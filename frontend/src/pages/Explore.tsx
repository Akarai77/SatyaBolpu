import { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import Button from "../components/Button";
import { useLoading } from "../context/LoadingContext";
import LoadingPage from "../components/Loading/LoadingPage";

interface dataType {
  title : string;
  descr : string;
  image : string;
  initialClass : string;
  finalClass : string;
}

const Explore = () => {
  const [active,setActive] = useState<number | null>(null);
  const [data,setData] = useState<dataType[]>([]);
  const {isLoading,setLoading} = useLoading();

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      try{
        const res = await fetch('/assets/data/data.json');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const resData = await res.json();
        if(resData.explore){
          setData(resData.explore);
        } else {
          console.error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }

    fetchData();
  },[])

  if(isLoading) return <LoadingPage/>
  return (
    <div className="explore w-screen h-screen relative bg-black">
      {
        data && data.map((div,index) => (
          <div key={index} className={
            `absolute [background-image:url('${div.image}')] bg-cover bg-no-repeat cursor-pointer 
            before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black/50 before:content-['']
            hover:before:bg-transparent transition-all duration-300
            ${active === index ? `${div.finalClass} before:hidden` : `${div.initialClass} before:visible` }
          `}
            onClick={() => setActive(index)}
          >
            <div className={`transition-all duration-150 ${active === index ? 'opacity-1' : 'opacity-0'}`} >
              <MdCancel className="absolute text-[2.5rem] m-5 bg-black text-primary rounded-full hover:scale-110 z-10" onClick={(e) => {e.stopPropagation(); setActive(null)}}/>
              <div className="w-screen absolute top-0 ml-auto mr-auto h-screen flex flex-col items-center justify-center gap-3 z-0">
                <h1 className="text-[3rem]/[3rem] font-bold text-primary [text-shadow:1px_1px_6px_black]">{div.title}</h1>
                <p className="text-lg/6 w-1/3 text-black text-justify p-3 pl-7 pr-7 bg-white/60">{div.descr}</p>
                <Button content="Explore More"/>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Explore;