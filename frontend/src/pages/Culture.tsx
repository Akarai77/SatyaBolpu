import { Navigate, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useEffect, useState } from "react";
import { CultureType } from "./Explore";
import { useLoading } from "../context/LoadingContext";

const Culture = () => {
  
  const { culture } = useParams();
  const culturesApi = useApi(`/cultures/${culture}`);
  const [cultureData,setCultureData] = useState<CultureType | null>(null);
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    setLoading(culturesApi.loading);
  },[culturesApi.loading])

  useEffect(() => {
    console.log(culturesApi.data)
    if(culturesApi.data) {
      setCultureData(culturesApi.data.culture);
    }
  },[culturesApi.data])

  useEffect(() => {
    console.log(cultureData)
  },[cultureData])

  if(culturesApi.error) {
    return <Navigate to={'/404'} replace/>
  }

  return (
    <div className="w-full">
      <div className="w-full h-screen">
      {  }
      </div>     
    </div>
  )
}

export default Culture;
