import { useState } from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { RotatingCardProps } from '../types/globals';
import { BASE_URL } from '../App';

export const RotatingSkeletonCard = () => (
  <div className="w-1/5 bg-gray-700 animate-pulse h-120 flex items-center justify-center rounded-xl">
    <div className="w-2/3 h-2/3 rounded-xl bg-gray-800"></div>
  </div>
);

const RotatingCard = ({ id, title, image, description }: RotatingCardProps) => {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/${id}/${title}`);
    }
  };

  return (
    <div
      className="perspective-[1000px] hover:scale-[1.025] transition-all duration-200 ease-in-out"
      onClick={() => setClicked(!clicked)}
    >
      <div
        className={`relative w-full h-120 transition-transform duration-700 ease-in-out cursor-pointer
          transform-3d ${clicked ? 'transform-[rotateY(180deg)]' : 'transform-[rotateY(0deg)]'}`}
      >
        <div
          className="absolute w-full h-full bg-black text-white backface-hidden z-10
          rounded-2xl overflow-hidden border border-white border-solid"
        >
          <img
            src={`${BASE_URL}${image}`}
            alt={title}
            className="w-full h-full object-cover z-0"
          />
          <div
            className="w-[90%] flex items-center justify-center text-white font-black
             text-[1.25rem] text-center absolute z-10 bottom-5 left-1/2 -translate-x-1/2"
            style={{
              textShadow: '1px 1px 6px black',
            }}
          >
            <h3>{title}</h3>
          </div>
        </div>
        <div
          className="absolute w-full h-full bg-zinc-800 text-white overflow-hidden
          rounded-2xl border border-white border-solid transform-[rotateY(180deg)] backface-hidden"
        >
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <p className="h-3/4 flex items-center justify-center">
              {description
                ? description.length > 500
                  ? `${description.slice(0, 500)}...`
                  : description
                : 'No content provided'}
            </p>
            <Button content="View More" onClick={handleClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotatingCard;
