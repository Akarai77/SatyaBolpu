import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdCancel } from "react-icons/md";
import Button from "../components/Button";
import { useLoading } from "../context/LoadingContext";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

interface dataType {
  title: string;
  descr: string;
  image: string;
  clipPathInitial: string;
  clipPathNormal: string;
  clipPathFinal: string;
  position: string;
  placement: string;
}

const Explore = () => {
  const [active, setActive] = useState<number | null>(null);
  const [data, setData] = useState<dataType[]>([]);
  const refs = useRef<HTMLDivElement[]>([]);
  const { isLoading, setLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
      try {
        const res = await fetch('/assets/data/data.json');
        if (!res.ok) throw new Error('Failed to fetch data');
        const resData = await res.json();
        if (Array.isArray(resData.explore)) {
          setData(resData.explore);
        } else {
          console.error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      } finally {
          setLoading(false)
      }
    };

    fetchData();
  }, []);

    useLayoutEffect(() => {
      if (isLoading || data.length === 0) return;

      const ctx = gsap.context(() => {
        refs.current.forEach((ref, index) => {
          if (!ref || !data[index]) return;

          gsap.fromTo(
            ref,
            { clipPath: data[index].clipPathInitial },
            {
              clipPath: data[index].clipPathNormal,
              ease: "power4.inOut",
              delay: 0.25,
              duration: 0.4 * index + 0.1,
            }
          );
        });
      });

      return () => ctx.revert();
    }, [data, isLoading]);

  const handleClick = useCallback((index: number) => () => setActive(index), []);
  
  const handleCancelClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setActive(null);
  }, []);


  return (
    <div className="explore w-screen h-screen relative bg-black">
      {data.map((item, index) => {
        const isActive = active === index;
        const style = {
          clipPath: isActive ? item.clipPathFinal : item.clipPathNormal,
          backgroundImage: `url('${item.image}')`,
          backgroundPosition: item.position,
          zIndex: isActive ? 50 : 10,
        };

        const baseClass = `
          absolute bg-cover bg-no-repeat cursor-pointer transition-all duration-500 ease-in-out
          before:absolute before:top-0 before:left-0 before:w-full before:h-full 
          before:bg-black/50 before:content-[''] hover:before:bg-transparent
        `;

        const placement = `
          ${item.placement === 'left' ? 'left-0' : ''}
          ${item.placement === 'right' ? 'right-0' : ''}
          ${item.placement === 'top' ? 'top-0' : ''}
          ${item.placement === 'bottom' ? 'bottom-0' : ''}
          `;

        const dimensions = ` 
          ${(item.placement === 'left' || item.placement === 'right') ? 'w-1/2 h-full' : ''}
          ${(item.placement === 'top' || item.placement === 'bottom') ? 'w-full h-1/2' : ''}
        `;

        return (
          <div
            key={index}
            style={style}
            ref={(el) => {
                if(el) refs.current[index] = el;
            }}
            className={`${baseClass + placement} ${isActive ? 'before:hidden w-full h-full' : 'before:visible' + dimensions}`}
            onClick={handleClick(index)}>
            <div className={`absolute w-screen h-screen transition-all duration-200 ${placement}
                ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              <MdCancel
                className="absolute text-[2.5rem] m-5 bg-black text-primary rounded-full hover:scale-110 z-50"
                onClick={handleCancelClick}/>
              <div className="absolute w-full h-full flex flex-col items-center justify-center gap-3">
                <h1 className="text-[3rem]/[3rem] font-bold text-primary [text-shadow:1px_1px_6px_black]">{item.title}</h1>
                <p className="text-lg/6 w-1/3 text-black text-justify p-3 pl-7 pr-7 bg-white/60">{item.descr}</p>
                <Button content="Explore More" onClick={() => navigate(`${item.title}`)}/>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Explore;

