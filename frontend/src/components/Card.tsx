import { useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

export type CardProps = {
    title: string;
    image: string;
    alt?: string;
    content?: string;
    route?: string;
}

const Card = ({ title, image, alt, content, route }: CardProps) => {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
      if(route) {
        navigate(`/${route}/${title}`)
      }
  }

  return (
    <div className="w-1/5 [perspective:1000px] hover:scale-[1.025] transition-all duration-200 ease-in-out" 
      onClick={() => setClicked(!clicked)}>
      <div
        className={`relative w-full h-[30em] transition-transform duration-700 ease-in-out cursor-pointer
          [transform-style:preserve-3d] ${clicked ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}`}
      >
        <div className="absolute w-full h-full bg-black text-white [backface-visibility:hidden] z-10
          rounded-2xl overflow-hidden border border-white border-solid">
          <img src={image} alt={alt} className="w-full h-4/5 object-cover" />
          <div className="h-1/5 flex items-center justify-center">
            <h3>{title}</h3>
          </div>
        </div>
        <div className="absolute w-full h-full bg-zinc-800 text-white overflow-hidden
          rounded-2xl border border-white border-solid [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <p className="h-3/4 flex items-center justify-center">{content || "No content provided"}</p>
            <Button content="View More" onClick={handleClick}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
