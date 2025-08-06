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

type formErrorType = {
  mainTitle: string;
  shortTitle: string;
  culture: string;
  description: string;
  tags: string;
  image: string;
}

const initialFormData: PostDetailsType = {
  mainTitle: '',
  shortTitle: '',
  culture: '',
  description: '',
  tags: [],
  image: null
}

const initialFormErrors: formErrorType = {
  mainTitle: '',
  shortTitle: '',
  culture: '',
  description: '',
  tags: '',
  image: ''
}

const NewPost = () => {
  const { state: authState } = useAuth();
  const { state: postState, dispatch: postDispatch } = usePost();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostDetailsType>(initialFormData);
  const [errors,setErrors] = useState<formErrorType>(initialFormErrors);
  const descrRef = useRef<HTMLTextAreaElement | null>(null);
  const tagRef = useRef<HTMLInputElement | null>(null);
  const [tag,setTag] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  useLayoutEffect(() => {
    const postDetails = localStorage.getItem('postDetails')
    if(postDetails) {
      setFormData(JSON.parse(postDetails));
      setSubmitted(true);
    }
  },[])

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target;

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

  const handleAddTag = (e: React.KeyboardEvent) => {
    if(!tag.trim())
      return 

    const key = e.key;
    if(key === 'Enter' && tagRef.current) {
      e.preventDefault();
      if(!formData.tags.includes(tag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        tagRef.current.value = '';
        setTag('');
      }
    }
  }

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_,id) => id !== index )
    }));
  }

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = {
      mainTitle: '',
      shortTitle: '',
      culture: '',
      description: '',
      tags: '',
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
    if(!hasErrors) {
      setSubmitted(true);
      postDispatch({
        type: 'SAVE_BASIC_DETAILS', 
        payload : {
          details: formData
        }
      });
    }
  }

  const handleNext = () => {
    if(submitted) {
      navigate('/editor')
    } else {
      toast.error("You need to submit the form first!");
    }
  }

  if(!authState.token && authState.user?.role !== 'admin') 
    return <Navigate to={'/404'} replace/>

  return (
    <div className="w-full py-20">
      <Title title="New Post" />

      <form className="w-4/5 md:w-2/3 lg:w-1/2 flex flex-col gap-20 mx-auto py-10 items-center justify-center" onSubmit={handleFormSubmit}>
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
            className="text-black font-semibold p-2 overflow-hidden resize-none disabled:bg-gray-400"
            type="text"
            id="tags"
            disabled={submitted}
            name="tags"
            ref={tagRef}
            onKeyDown={handleAddTag}
            onChange={(e) => setTag((e.target as HTMLInputElement).value.toLowerCase())}
          />
          {errors.tags && <p className="text-red-500">{errors.tags}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]">
            Image
          </label>
          <label htmlFor="image" className="w-fit">
            <div className="text-black w-fit cursor-pointer bg-white p-5 rounded-lg flex flex-col items-center 
              justify-center border-3 border-solid border-primary hover:bg-white/70">
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
            onChange={(e) => setFormData((prev) => ({
              ...prev,
              image: (e.target as HTMLInputElement).files![0]
            }))}
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
              onClick={() => setSubmitted(false)}/>
            :
            <Button 
              content="Submit"
              className="text-[1.5rem]"
              type="submit"
              />
        }

        <div 
          className={` text-[1.75rem] p-2 rounded-lg ml-auto
          ${submitted ? 'hover:text-primary text-white cursor-pointer' : 'text-gray-500 cursor-not-allowed'}`}
          onClick={handleNext}>
            {`Editor >`}
        </div>

      </form>


    </div>
  );
};

export default NewPost;

