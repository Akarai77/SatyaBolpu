import { Navigate, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CultureType } from "./Explore";
import { useLoading } from "../context/LoadingContext";
import gsap from "gsap";
import { BASE_URL } from "../App";
import CustomSvg from "../constants/Image";

const Culture = () => {
  const { culture } = useParams();

  const { isLoading, setLoading } = useLoading();

  const culturesApi = useApi(`/cultures/${culture}`);

  const [cultureData, setCultureData] = useState<CultureType | null>(null);

  const titleRef = useRef<HTMLDivElement | null>(null);
  const imgContainerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const paragraphRefs = useRef<HTMLDivElement[]>([]);
  const imagesRef = useRef<HTMLDivElement[]>([]);
  
  useEffect(() => {
    setLoading(culturesApi.loading);
  }, [culturesApi.loading]);
  
  useEffect(() => {
    console.log(culturesApi.data);
    if (culturesApi.data) {
      setCultureData(culturesApi.data.culture);
    }
  }, [culturesApi.data]);
  
  useEffect(() => {
    console.log(cultureData);
  }, [cultureData]);
  {/*
  useEffect(() => {
    
    const updateTranslateZValue = () => {
      if(imagesRef.current) {
        imagesRef.current.forEach((img,index) => 
          img.style.transform = `translate(-50%, -50%) rotateY(${index * 72}deg) 
                                 translateZ(${Math.max(200, Math.min(window.innerWidth * 0.2, 300))}px)`
        )}
    }

    window.addEventListener('resize',updateTranslateZValue);
    return () => window.removeEventListener('resize',updateTranslateZValue);
  },[])*/}

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if(titleRef.current && imagesRef.current && paragraphRefs.current) {
        gsap.to(titleRef.current,
          {
            opacity: 0,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: titleRef.current,
                start: '75% center',
                toggleActions: 'play pause pause reverse'
            },
          }
        );

        paragraphRefs.current.map((paragraph) => {
          gsap.to(paragraph,
            {
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: paragraph,
                start: 'bottom center',
                toggleActions: 'play none none reverse'
              }
            }
          );
        })

        imagesRef.current.forEach((img,index) => {
          const topValue = [15,15,35,35,55,55]
          let XValue = [-50,-50,-75,-75,-50,-50]
          const rotateZ = [10,-10,0,0,-10,10]

            gsap.to(img,
              {
                top: `${topValue[index]}%`,
                left: index%2 === 0 ? XValue[index] : '',
                right: index%2 !==0 ? XValue[index] : '',
                rotateZ: rotateZ[index],
                filter: 'brightness(0.5)',
                ease: "none",
                scrollTrigger: {
                  trigger: img,
                  start: 'bottom center',
                  scrub: true
                }
              })

            XValue = [12,41,77,28,63,92] 
            const length = imagesRef.current.length;
            gsap.fromTo(img,
              {
                top: `${topValue[index]}%`,
                left: index%2 === 0 ? XValue[index] : '',
                right: index%2 !==0 ? XValue[index] : '',
                rotateZ: rotateZ[index],
                rotateY: 0,
                filter: 'brightness(0.5)',
              },
              {
                  top: '50%',
                  x: '-50%',
                  y: '-50%',
                  z: `${Math.max(200, Math.min(window.innerWidth * 0.2, 300))}px)`,
                  left: `${index%2 === 0 ? 50 : ''}%`,
                  right: `${index%2 !== 0 ? 50 : ''}%`,
                  rotateY: (index) * (360/length),
                  rotateZ: 0,
                  filter: 'brightness(1)',
                  immediateRender: false,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: imgContainerRef.current,
                    start: '70% center',
                    end: '75% center',
                    scrub: true,
                    markers: true,
                  }
              }

        )});
        
        {/*
        imagesRef.current.forEach((img,index) => {
          gsap.fromTo(img,
            {
            },
            {
              left: '50%',
              transform: `translate(-50%,-50%) rotateY(${(length - index - 1) * 72}deg) 
                          translateZ(${Math.max(200, Math.min(window.innerWidth * 0.2, 300))}px)`,
              duration: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: imgContainerRef.current,
                start: 'top center',
                toggleActions: 'play none none reverse'
              }
            }
          );
        })*/}

        const tl = gsap.timeline({
            scrollTrigger: {
              trigger: imgContainerRef.current,
              start: '75% center',
              scrub: true,
            }})

        tl.set(carouselRef.current,{
          transformStyle: 'preserve-3d',
          transformPerspective: 2000,
          rotateY: 0
        })
        {/*
        tl.fromTo(carouselRef.current,
          {
            rotateY: 0,
          },
          {
            rotateY: 360,
            ease: "none"
          }
        );*/}


      }
    })

    return () => ctx.revert();
  },[cultureData])
  
  if (culturesApi.error) {
    return <Navigate to={'/404'} replace />;
  }

  return (
    cultureData && (
      <div className="w-full relative">
        <style>{`
          @keyframes preSpin {
            from {

            }
          }

          @keyframes spin3d {
            from {
              transform: perspective(2000px) rotateX(-16deg) rotateY(0deg)
            }
            to {
              transform: perspective(2000px) rotateX(-16deg) rotateY(360deg)
            }
          }

          @keyframes showText {
            0% {
              stroke-dashoffset: 400;
              fill: transparent;
            }
            80%{
              stroke-dashoffset: 20;
              fill: transparent;
            }
            100% {
              stroke-dashoffset: 0;
              fill: var(--primary);
            }
          }

          @keyframes showBg {
            from {
              mask-position: 0 0;
            } to {
              mask-position: 100% 0;
            }
          }
        `}</style>

        <div 
          className="w-full h-screen text-primary/70 flex justify-center items-center font-black
          text-[10rem] z-10 absolute top-0"
          ref={titleRef}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" width="100vw" height="100vh" 
            style={{ strokeDasharray: '400', animation: 'showText 2s linear forwards' }}>
            <text x='50%' y='50%' textAnchor="middle" dominantBaseline="middle" className="stroke-primary"
              style={{
                fontSize: 'clamp(2rem,10vw,10rem)'
              }}
            >
              {cultureData.name}
            </text>
          </svg>
        </div>

        <div className="w-full h-screen mb-[100vh]">
        </div>

        <div className="relative w-full">
            <div 
              className="w-full relative h-[1000vh]"
              ref={imgContainerRef}
              style={{
                transformStyle: 'preserve-3d',
                transform: 'perspective(2000px)'
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center h-[100vh] sticky top-0 w-full px-5 lg:px-10"
                  style={{
                    flexDirection: `${index%2 === 0 ? 'row' : 'row-reverse'}`
                  }}
                  ref={carouselRef}
                >
                  <div
                    className="w-1/4 lg:w-1/5 absolute aspect-[2/3]"
                    style={{
                      filter: 'brightness(1)'
                    }}
                    ref={(el) => {
                      if(el) imagesRef.current[index] = el
                    }}
                  >
                    <img
                      src={`${BASE_URL}${cultureData.image}`}
                      className="w-full h-full object-cover rounded-lg shadow-xl"
                      alt={`${cultureData.name} culture`}
                    />
                  </div>
                  <div 
                    className={`w-[70%] text-[1rem] md:w-2/3 lg:w-1/2 md:text-[1.25rem] lg:text-[1.5rem] absolute text-primary  text-center flex
                      italic font-semibold ${index%2 === 0 ? 'right-0 lg:right-[20%]' : 'left-0 lg:left-[20%]'}`}
                    ref={(el) => {
                      if(el) paragraphRefs.current[index] = el
                    }}
                  >
                    Daivaradhane is an ancient tribal ritual.
                    Daivaradhane is an ancient tribal ritual.
                    Daivaradhane is an ancient tribal ritual.
                    Daivaradhane is an ancient tribal ritual.
                    Daivaradhane is an ancient tribal ritual.
                    Daivaradhane is an ancient tribal ritual.
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    )
  );
};

export default Culture;
