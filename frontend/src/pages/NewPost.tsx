import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import Title from "../components/Title";
import { usePost } from "../context/PostContext";
import { Navigate, useNavigate } from "react-router-dom";
import { MdDone } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogBoxContext";
import useApi from "../hooks/useApi";

const NewPost = () => {
  
  const [progress,setProgress] = useState<number>(0);
  const navigate = useNavigate();
  const dialog = useDialog();
  const { data, loading, error, post } = useApi('/posts', { auto: false })
  const { state: authState } = useAuth();
  const { state: postState, dispatch: postDispatch } = usePost();

  const steps = useMemo(() => ({
    'Post Details': 'post-details',
    'Editor': 'editor',
    ...(postState.details?.locationSpecific && { 'Map Details': 'map' })
  }), [postState.details?.locationSpecific]);

  const offset = useMemo(
    () => 100 / (Object.keys(steps).length - 1),
      [steps]
  );

  useLayoutEffect(() => {
    let width = 0;
    for(const value of Object.values(postState)) {
      if(!value) {
        break
      }
      width += offset
    }

    setProgress(width)
  },[postState]);

  const handleUpload = () => {
    const uploadPost = async () => {
       await post(postState);
    }

    dialog.popup({
      title: "Post Upload.",
      descr: "Are you sure you want to upload the post. All saved drafts will be cleared on upload.",
      onConfirm: uploadPost
    })
  };

  useEffect(() => {
    if(data) {
       postDispatch({
         type: 'CLEAR_POST'
       });
      console.log(data)
    }
    if(error) console.log(error)
  },[data, error])
  
  if(!authState.token || authState.user?.role !== 'admin')
    return <Navigate to={'/404'} replace/>

  return (
    <div className="mt-20 mb-40 flex flex-col gap-20 items-center justify-center">
      <Title title={postState.details ? `New Post - ${postState.details.mainTitle}` : 'New Draft Post'}/>
      
      <div className="flex text-white w-1/2 h-10 bg-white 
        mx-auto items-center justify-between relative rounded-full">
        <div 
          className="absolute z-10 h-10 bg-primary transition-all duration-300" 
          style={{
            borderTopLeftRadius: '9999px',
            borderBottomLeftRadius: '9999px',
            borderTopRightRadius: progress >= 100 ? '9999px' : '',
            borderBottomRightRadius: progress >= 100 ? '9999px' : '',
            width: `${Math.min(progress,100)}%`
          }}
          ></div>
        {
          Object.values(steps).map((step,index) => {
            const isDisabled = index === 0 ? false : progress < offset * index;
            const isCompleted = progress > offset*index;
            return (
              <div className="flex z-20 flex-col items-center justify-center" key={index}>
                <div 
                  className={`outline-primary outline rounded-full w-9 h-9 text-center transition-all flex items-center justify-center 
                    ${isDisabled ? 
                      'cursor-not-allowed bg-gray-400' :
                      'cursor-pointer hover:scale-110 hover:bg-primary hover:text-black hover:outline-black bg-black'}`} 
                  onClick={() => {
                    if(!isDisabled) 
                      navigate(`${step}`) 
                  }}
                >
                  {
                    isCompleted ? 
                      <MdDone /> : index+1
                  }
                </div>
                <div className="absolute -bottom-10 text-nowrap cursor-pointer">
                  {Object.keys(steps)[index]}
                </div>
              </div>
            )
          })
        }
      </div>

      {
        progress > 100 &&
          <Button 
            content="Upload Post" 
            onClick={handleUpload}
            loading={loading}
            loadingText="Uploading"
          />
      }
    </div>
  )
}

export default NewPost;
