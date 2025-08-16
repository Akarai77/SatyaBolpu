import { useEffect, useLayoutEffect, useState } from "react";
import Button from "../components/Button";
import Title from "../components/Title";
import { usePost } from "../context/PostContext";
import { Navigate, useNavigate } from "react-router-dom";
import { MdDone } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const NewPost = () => {
  
  const steps = {
    'Post Details' : 'post-details',
    'Editor' : 'editor',
    'Map Details' : 'map'
  };
  const [progress,setProgress] = useState<number>(0);
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { state: postState } = usePost();
  const offset = 100 / (Object.keys(steps).length - 1);

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
            const isDisabled = !(progress >= (offset*index))
            const isCompleted = (progress > offset*index);
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
          <Button content="Upload Post"/>
      }
    </div>
  )
}

export default NewPost;
