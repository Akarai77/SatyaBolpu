import { ChangeEvent, FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import Title from "../components/Title";
import { MdCancel } from "react-icons/md";
import { FaUpload } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { PostDetailsType, usePost } from "../context/PostContext";
import { FaEdit } from "react-icons/fa";
import { getFile, saveFile } from "../utils/FileStore";
import useApi from "../hooks/useApi";
import { useLoading } from "../context/LoadingContext";

type formErrorType = {
  mainTitle: string;
  shortTitle: string;
  culture: string;
  description: string;
  tags: string;
  locationSpecific: string;
  image: string;
}

const initialFormData: PostDetailsType = {
  mainTitle: '',
  shortTitle: '',
  culture: '',
  description: '',
  tags: [],
  locationSpecific: false,
  image: null
}

const initialFormErrors: formErrorType = {
  mainTitle: '',
  shortTitle: '',
  culture: '',
  description: '',
  tags: '',
  locationSpecific: '',
  image: ''
}

const PostDetails = () => {
  const { state: authState } = useAuth();
  const { state: postState, dispatch: postDispatch } = usePost();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostDetailsType>(initialFormData);
  const [errors,setErrors] = useState<formErrorType>(initialFormErrors);
  const descrRef = useRef<HTMLTextAreaElement | null>(null);
  const tagRef = useRef<HTMLInputElement | null>(null);
  const [showTags, setShowTags] = useState<boolean>(false);
  const [allowedTags,setAllowedTags] = useState<string[]>([]);
  const [activeTag,setActiveTag] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(0); 
  const [visibleStart, setVisibleStart] = useState<number>(0);
  const pageSize = 10;
  const [submitted, setSubmitted] = useState(false);
  const tagsApi = useApi('/tags');
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(tagsApi.loading);
  },[tagsApi.loading]);

  useEffect(() => {
    if(tagsApi.data && tagsApi.data.tags)
      setAllowedTags(tagsApi.data.tags.sort())
  },[tagsApi.data])

  useLayoutEffect(() => {
    if(!postState.details)
      return
    
    const {image, ...postDetailsWithoutImage} = postState.details;
    (async () => {
      console.log(postState.details)
      setFormData({...postDetailsWithoutImage, image: await getFile(Number(image))});
    })();
    setSubmitted(true);
  },[])

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
        setShowTags(false);
      }
    }

    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setErrors((prev) => ({
      ...prev,
      [name] : ''
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  useEffect(() => {
    const el = descrRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  },[formData.description])

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value.toLowerCase();
    if(!tag)
      setAllowedTags(tagsApi.data.tags.filter((t: string) => !formData.tags.includes(t)))
    else
      setAllowedTags(tagsApi.data.tags.filter((t: string) => t.startsWith(tag) && !formData.tags.includes(t)).sort())
    setActiveTag(tag);
  }

  const handleAddTag = (tag: string) => {
    if(tagRef.current) {
      if(!formData.tags.includes(tag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        tagRef.current.value = '';
        setActiveTag('');
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!allowedTags.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = (activeIndex + 1) % allowedTags.length;
      setActiveIndex(newIndex);
 
      if(newIndex === 0) {
        setVisibleStart(0);
      } else if (newIndex >= visibleStart + pageSize) {
        setVisibleStart(visibleStart + 1);
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = (activeIndex - 1 + allowedTags.length) % allowedTags.length;
      setActiveIndex(newIndex);

      if(newIndex === allowedTags.length-1) {
        setVisibleStart(Math.max(0,allowedTags.length-pageSize));
      } else if (newIndex < visibleStart) {
        setVisibleStart(visibleStart - 1);
      }
    }

    if (e.key === "Enter" && allowedTags[activeIndex]) {
      e.preventDefault();
      handleAddTag(allowedTags[activeIndex]);
      setAllowedTags(prev => prev.filter((_, i) => i !== activeIndex));
      setActiveIndex(0);
      setVisibleStart(0);
    }

    setErrors(prev => ({
      ...prev,
      tags: ""
    }));
  };

  const handleRemoveTag = (index: number) => {
    setAllowedTags((prev) => [...prev, formData.tags[index]].sort());
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_,id) => id !== index )
    }));
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => ({
      ...prev,
      image: ''
    }));

    setFormData((prev) => ({
      ...prev,
      image: e.target.files![0]
    }))
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = {
      mainTitle: '',
      shortTitle: '',
      culture: '',
      description: '',
      tags: '',
      locationSpecific: '',
      image: ''
    }

    if(!formData.mainTitle.trim()) {
      newErrors.mainTitle = "Main Title cannot be empty!";
    }

    if(!newErrors.mainTitle && formData.mainTitle.length < 5) {
      newErrors.mainTitle = "Main Title should be at least 5 characters long!";
    }

    if(!formData.shortTitle.trim()) {
      newErrors.shortTitle = "Short Title cannot be empty!";
    }

    if(!newErrors.shortTitle && formData.shortTitle.length < 3) {
      newErrors.shortTitle = "Short Title should be at least 3 characters long!";
    }

    if(!formData.culture.trim()) {
      newErrors.culture = "Please choose a culture!";
    }

    if(!formData.description.trim()) {
      newErrors.description = "Description cannot be empty!";
    }
    
    if(formData.tags.length < 1) {
      newErrors.tags = "Add at least one tag!";
    }

    if(!formData.image) {
      newErrors.image = "Please upload a image!";
    }

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(err => err !== '');
    if(hasErrors)
      return 


    const postFormData = new FormData();
    postFormData.append("mainTitle", formData.mainTitle);
    postFormData.append("shortTitle", formData.shortTitle);
    postFormData.append("culture", formData.culture);
    postFormData.append("description", formData.description);
    postFormData.append("locationSpecific", formData.locationSpecific ? "true" : "false");
    formData.tags.forEach(tag => postFormData.append("tags", tag));
    if (formData.image && formData.image instanceof File) postFormData.append("file", formData.image);

    const { image, ...formDataWithoutImage } = formData;
    if(image && image instanceof File) {
      const imageId = await saveFile(image);
      console.log(imageId)
      postDispatch({
        type: 'SAVE_BASIC_DETAILS',
        payload: {
          details: { ...formDataWithoutImage, image: Number(imageId) } 
        }
      })
    }
    setSubmitted(true);
  }

  const handleNext = () => {
    if(submitted) {
      navigate('/new-post/editor')
    } else {
      toast.error("You need to submit the form first!");
    }
  }

  const handleEditAgain = () => {
    setSubmitted(false);
    postDispatch({
      type: 'CLEAR_BASIC_DETAILS',
    })
  }

  if(!authState.token || authState.user?.role !== 'admin') 
    return <Navigate to={'/404'} replace/>

  return (
    <div className="w-full mt-20">
      <Title title="Post Details" />

      <form 
        className="w-4/5 md:w-2/3 lg:w-1/2 flex flex-col gap-20 mx-auto py-10 justify-center" 
        onSubmit={handleFormSubmit}>
        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="mainTitle">
            Main Title
          </label>
          <input 
            className={`text-black font-semibold p-2 disabled:bg-gray-400`} 
            disabled={submitted}
            type="text" 
            id="mainTitle" 
            name="mainTitle" 
            value={formData.mainTitle}
            onChange={handleFormChange}/>
            {errors.mainTitle && <p className="text-red-500">{errors.mainTitle}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="shortTitle">
            Short Title
          </label>
          <input 
            className={`text-black font-semibold p-2 disabled:bg-gray-400`} 
            disabled={submitted}
            type="text" 
            id="shortTitle" 
            name="shortTitle" 
            value={formData.shortTitle}
            onChange={handleFormChange}/>
            {errors.shortTitle && <p className="text-red-500">{errors.shortTitle}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="culture">
            Culture
          </label>
          <select 
            disabled={submitted}
            name="culture" 
            id="culture"
            className="p-2 cursor-pointer disabled:bg-gray-300"
            value={formData.culture}
            onChange={handleFormChange}
          >
            <option value="" hidden className="text-white">-- Choose a culture --</option>
            <option value="daivaradhane">Daivaradhane</option>
            <option value="nagaradhane">Nagaradhane</option>
            <option value="yakshagana">Yakshagana</option>
            <option value="kambala">Kambala</option>
          </select>
          {errors.culture && <p className="text-red-500">{errors.culture}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="description">
            Description
          </label>
          <textarea
            className="text-black font-semibold p-2 overflow-hidden resize-none disabled:bg-gray-400"
            rows={1}
            disabled={submitted}
            id="description"
            name="description"
            ref={descrRef}
            value={formData.description}
            onChange={handleFormChange}
          />
          {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <div className="w-full relative flex flex-col gap-3">
            <label className="text-primary font-semibold text-[1.5rem]" htmlFor="tags">
              Tags
            </label>
            <div className="w-full flex gap-1 flex-wrap">
            {
              formData.tags.length > 0 && formData.tags.map((tag,index) => (
                <div key={index} className="text-white max-w-full flex items-center justify-evenly gap-1 bg-gray-600 px-2 rounded-lg">
                  <p className="max-w-full break-words">{tag}</p>
                  {
                    !submitted &&
                      <MdCancel 
                        className="fill-gray-400 cursor-pointer hover:fill-white"
                        onClick={() => handleRemoveTag(index)}/>
                  }
                </div>
              ))
            }
            </div>
            <input
              className="text-black w-1/2 font-semibold p-2 overflow-hidden resize-none disabled:bg-gray-400"
              type="text"
              id="tags"
              disabled={submitted}
              name="tags"
              ref={tagRef}
              autoComplete="off"
              onKeyDown={handleKeyDown}
              onFocus={() => setShowTags(true)}
              value={activeTag}
              onChange={handleTagChange}
            />
            <div 
              className={`bg-white w-1/2 flex flex-col items-center justify-center absolute top-full 
                ${showTags ? "visible" : "hidden"}`}
            >
              {allowedTags
                .slice(visibleStart, visibleStart + pageSize)
                .map((tag, index) => {
                  const globalIndex = visibleStart + index;
                  return (
                    <div
                      key={globalIndex}
                      className={`w-full flex items-center justify-center cursor-pointer hover:bg-primary
                        ${globalIndex === activeIndex ? "bg-primary" : ""}`}
                      onClick={() => handleAddTag(tag)}
                    >
                      {tag}
                    </div>
                  );
                })}
            </div>
          </div>
          {errors.tags && <p className="text-red-500">{errors.tags}</p>}
        </div>

        <div className="flex flex-col w-full">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="locationSpecific-yes">
            Is the post location specific?
          </label>
          <div className="flex gap-10">
            <label className="text-white text-[1.5rem] cursor-pointer" htmlFor="locationSpecific-yes">
              <input 
                className="cursor-pointer" 
                type="radio" 
                value="true" 
                disabled={submitted}
                id="locationSpecific-yes"
                name="locationSpecific"
                checked={formData.locationSpecific}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  locationSpecific: (e.target as HTMLInputElement).value === "true"
                }))}
              />
                Yes
            </label>
            <label className="text-white text-[1.5rem] cursor-pointer" htmlFor="locationSpecific-no">
              <input 
                className="cursor-pointer" 
                type="radio" 
                value="false" 
                disabled={submitted}
                id="locationSpecific-no"
                name="locationSpecific"
                checked={!formData.locationSpecific}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  locationSpecific: !((e.target as HTMLInputElement).value === "false")
                }))}
              />
                No
            </label>
          </div>
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]">
            Image
          </label>
          <label htmlFor="image" className="w-fit">
            <div className={`text-black w-fit p-5 rounded-lg flex flex-col items-center 
              justify-center border-3 border-solid border-primary  
              ${submitted ? 'bg-white/70 cursor-not-allowed' : 'bg-white hover:bg-white/70 cursor-pointer'}`}>
              <FaUpload />
              <p>Upload Image</p>
            </div>
          </label>
          <input
            className="hidden"
            disabled={submitted}
            type="file"
            accept="image/*"
            id="image"
            name="image"
            onChange={handleFileChange}
          />
          {
            formData.image && formData.image instanceof File &&
              <div className="w-1/2 border-2 border-solid border-white flex">
                <img 
                  className="w-full aspect-square object-cover object-center" 
                  src={URL.createObjectURL(formData.image)} alt="" />
              </div>
          }
          {errors.image && <p className="text-red-500">{errors.image}</p>}
        </div>

        {

          submitted ? 
            <FaEdit
              className={`text-[2.5rem] cursor-pointer m-5 bg-black 
                         text-white hover:scale-110 hover:text-primary z-50`}
              id='edit'
              onClick={handleEditAgain}/>
            :
            <Button 
              content="Save"
              className="text-[1.5rem] w-1/5 mx-auto"
              type="submit"
              />
        }


      </form>

      <div className="flex w-screen items-center justify-between p-10">
        <div 
          className={` text-[1.75rem] hover:text-primary text-white cursor-pointer`}
          onClick={() => navigate('/new-post')}>
            {`< Progress`}
        </div>
        <div 
          className={` text-[1.75rem]
          ${submitted ? 'hover:text-primary text-white cursor-pointer' : 'text-gray-500 cursor-not-allowed'}`}
          onClick={handleNext}>
            {`Editor >`}
          </div>
      </div>


    </div>
  );
};

export default PostDetails;

