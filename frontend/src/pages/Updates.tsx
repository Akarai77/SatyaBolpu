import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Button from "../components/Button";
import Title from "../components/Title";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

type DataProps = {
  title: string;
  descr: string;
  image: string;
}

const Updates = () => {
  const [data,setData] = useState<DataProps[]>([]);
  const [pageNo,setPageNo] = useState<string>('1');
  const [pageData,setPageData] = useState<DataProps[]>([]);
  const [loading,setLoading] = useState<boolean>(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/assets/data/data.json');
        const data = await res.json();
        setData(data.updates);
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  },[])

  useEffect(() => {
   if(data) {
    const page = parseInt(pageNo);
    if(!page) 
      return
    setTimeout(() => {
      setLoading(false);
      setPageData(data.slice((page - 1)*10, page*10));
    },5000);
   }
  },[pageNo, data])

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (val: string) => {
    const num = parseInt(val);
    if (!val || num < 1) return setPageNo('');
    if (isNaN(num)) return;
    if(num > data.length) return setPageNo(totalPages.toString());
    setPageNo(num.toString());
  };

  const handleArrows = (action: "+" | "-") => {
    const num = parseInt(pageNo);
    if(action === '-') {
      if(num - 1 < 1) return setPageNo('1');
      setPageNo((num - 1).toString());
    } else {
      if(num + 1 > data.length) return setPageNo(totalPages.toString());
      setPageNo((num + 1).toString())
    }
  }

  return (
    <div className="w-full py-20">
      
      <Title title="All Updates" />
      
      <div className="w-full my-20 flex flex-col gap-10 items-center justify-center">
      {
        pageData && pageData.map((d,id) => (
          <div key={id} className="w-2/3 h-[30vh] flex border-solid border border-white">
            <div className="w-1/3">
              <img className="w-full h-full object-cover object-center" src={d.image} alt="" />
            </div>
            <div className="w-3/5 p-5 flex flex-col items-center justify-center">
              <h1 className="text-primary text-center text-[1.5rem]">{d.title}</h1>
              <p className="text-white text-justify">{d.descr}</p>
              <Button content="View More"/>
            </div>
          </div>
        ))
      }
      </div>

      <div className="w-full flex items-center justify-center">
        <div className="text-[3rem] text-black flex items-center justify-center gap-3">
          <GrFormPrevious 
            className="bg-white w-12 p-2 rounded-2xl hover:bg-primary cursor-pointer" 
            onClick={() => handleArrows('-')}/>
          <input
            type="text"
            min={1}
            max={data.length}
            className="bg-white text-[2rem] w-12 h-12 text-center rounded-2xl hover:bg-primary cursor-pointer" 
            value={pageNo}
            onChange={(e) => handlePageChange((e.target as HTMLInputElement).value)}
          />
          <GrFormNext 
            className="bg-white w-12 p-2 rounded-2xl hover:bg-primary cursor-pointer" 
            onClick={() => handleArrows('+')}/>
        </div>
      </div>

    </div>
  )
}

export default Updates;
