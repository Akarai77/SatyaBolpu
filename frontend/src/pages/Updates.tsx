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
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/assets/data/data.json');
        const responseData = await res.json();
        setData(responseData.updates);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
   if(data.length > 0) {
    setPaginationLoading(true);
    const page = parseInt(pageNo);
    if(!page) 
      return
    setPageData([]);
    setTimeout(() => {
      setLoading(false);
      setPageData(data.slice((page - 1)*10, page*10));
      setPaginationLoading(false);
    },500);
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

  const SkeletonCard = () => (
    <div className="w-2/3 h-[30vh] flex border border-white animate-pulse">
    <div className="w-1/3 bg-gray-700 opacity-40"></div>
    <div className="w-3/5 p-5 flex gap-5 flex-col items-center justify-center">
    <div className="w-4/5 h-10 rounded-full bg-gray-600"></div>
    <div className="w-4/5 h-20 rounded-full bg-gray-600"></div>
    <div className="w-1/5 h-10 rounded-full bg-gray-600"></div>
    </div>
    </div>
  );

  const UpdateCard = ({ data }: { data: DataProps }) => (
    <div className="w-2/3 h-[30vh] flex border border-white">
    <div className="w-1/3">
    <img className="w-full h-full object-cover object-center" src={data.image} alt="" />
    </div>
    <div className="w-3/5 p-5 flex flex-col gap-5 items-center justify-center">
    <h1 className="text-primary text-center text-[1.5rem]">{data.title}</h1>
    <p className="text-white text-justify">{data.descr}</p>
    <Button content="View More" />
    </div>
    </div>
  );

  const Pagination = () => (
    <div className="w-full flex items-center justify-center">
      <div className="text-[3rem] text-black flex items-center justify-center gap-3">
        <GrFormPrevious 
          className={`bg-white w-12 p-2 rounded-2xl cursor-pointer transition-colors ${
            isPrevDisabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-primary'
          }`}
          onClick={() => !isPrevDisabled && handleArrows('-')}
        />    
        <div className="flex items-center gap-2">
          <input
            type="text"
            min={1}
            max={data.length}
            className="bg-white text-[2rem] w-12 h-12 text-center rounded-2xl hover:bg-primary cursor-pointer" 
            value={pageNo}
            onChange={(e) => handlePageChange((e.target as HTMLInputElement).value)}
          />
          <span className="text-white text-lg">
            / {totalPages}
          </span>
        </div>
        <GrFormNext 
          className={`bg-white w-12 p-2 rounded-2xl cursor-pointer transition-colors ${
            isNextDisabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-primary'
          }`}
          onClick={() => !isNextDisabled && handleArrows('+')}
        />
      </div>
    </div>
  )

  const isPrevDisabled = Number(pageNo) <= 1;
  const isNextDisabled = Number(pageNo) >= totalPages;

  return (
    <div className="w-full py-20">
      
      <Title title="All Updates" />
      
      { !loading && data.length > 0 && <Pagination /> }

      <div className="w-full my-20 flex flex-col gap-24 items-center justify-center">
      {
        loading || paginationLoading ? (
          Array.from({ length: itemsPerPage }).map((_, id) => (
              <SkeletonCard key={id} />
            ))
          ) : (
          pageData.map((d, id) => (
            <UpdateCard key={`${pageNo}-${id}`} data={d} />
          ))
      )}
      </div>

      { !loading && data.length > 0 && <Pagination /> }
    </div>
  )
}

export default Updates;
