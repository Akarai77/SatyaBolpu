import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { GeoJSONOptions, LatLngBoundsExpression, LatLngExpression, Map } from "leaflet";
import { IoLocationSharp } from "react-icons/io5";
import { FaLock,FaLockOpen,FaPlus,FaMinus } from "react-icons/fa";
import { useLoading } from "../context/LoadingContext";
import LoadingPage from "./Loading/LoadingPage";

const MapComponent = React.forwardRef<HTMLDivElement | null, {}>((_,ref) => {
 
  const [map, setMap] = useState<Map | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [lock,setLock] = useState<boolean>(false);
  const INITIAL_ZOOM : number = 9;
  const [zoom,setZoom] = useState<number>(INITIAL_ZOOM);
  const center: LatLngExpression = [13.006995870591474, 75.07172913896241];
  const [focus,setFocus] = useState<boolean>(false);
  const {isLoading,setLoading} = useLoading();

  const maxBounds: LatLngBoundsExpression = [
      [14.025289007277138, 73.94617968510107],
      [11.98870273390581, 76.19727859282375],
  ];

  useEffect(() => {
    const fetchGeoJson = async () => {
        try {
            const response = await fetch(`/assets/Map/districts.geojson`);
            if (!response.ok) throw new Error(`Failed to fetch GeoJSON data`);
            const data = await response.json();
            setGeoJsonData(data);
        } catch (error) {
            console.error(`Error loading GeoJSON data:`, error);
        }
    };

    fetchGeoJson();
    }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        if(ref && !ref.current.contains(e.target as Node)) {
            setFocus(false); 
        } else {
            setFocus(true);
        }
    }

    document.addEventListener("mousedown",handleClickOutside);
    return () => document.removeEventListener("mousedown",handleClickOutside);
  },[]);

  const MapEvents = () => {
    const map = useMap();

    useEffect(() => {
        setMap(map);
    }, [map]);

    useEffect(() => {
    if(map){
        const handleZoom = () => setZoom(map.getZoom());
        map.on("zoomend", handleZoom);
        return () => {
            map.off("zoomend", handleZoom);
        };
    }
    }, [map]);

    useEffect(() => {
        if (map) {
            if (lock) {
                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.boxZoom.disable();
                map.keyboard.disable();
            } else {
                map.dragging.enable();
                map.touchZoom.enable();
                map.doubleClickZoom.enable();
                map.scrollWheelZoom.enable();
                map.boxZoom.enable();
                map.keyboard.enable();
            }
        }
    }, [map,lock]);

    useEffect(() => {
        if(map) {
            if(focus) {
                map.scrollWheelZoom.enable();
            } else {
                map.scrollWheelZoom.disable();
            }
        }
    }, [map,focus]);

    return null;
  };

  const handleZoomChange = (delta: number) => map && map.setZoom(zoom + delta);

  if(isLoading) return <LoadingPage/>
  return (
    <div className="w-full h-full relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl overflow-hidden" ref={ref} >
      <div className="z-10 absolute flex flex-col justify-center items-center gap-2 left-7 top-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div className={`flex h-[3.5rem] flex-col gap-2 bg-slate-100 rounded-md ${lock ? 'pointer-events-none' : ''}`}>
              <div className="h-1/2 p-1 pl-2 pr-2" onClick={() => handleZoomChange(1)}>
                  <FaPlus className={`${lock ? 'text-slate-300' : 'text-black'}`}/>
              </div>
              <div className="h-1/2 p-1 pl-2 pr-2" onClick={() => handleZoomChange(-1)}>
                  <FaMinus className={`${lock ? 'text-slate-300' : 'text-black'}`}/>
              </div>
          </div>
          <IoLocationSharp
              className={`${lock ? 'text-slate-300 pointer-events-none' : 'text-red-500'}`}
              size={32}
              onClick={() => map && map.setView(center,INITIAL_ZOOM,{animate:true})}
          />

          {
              lock ? 
                  <FaLock
                      className="text-slate-500"
                      size={24}
                      onClick={() => setLock(false)}
                  /> :
                  <FaLockOpen
                      className="text-slate-500"
                      size={24}
                      onClick={() => setLock(true)}
                  />  
          }
      </div>

      <MapContainer 
        className="z-0 relative w-full h-full" 
        center={center} 
        zoom={INITIAL_ZOOM} 
        maxBounds={maxBounds} 
        minZoom={INITIAL_ZOOM} 
        scrollWheelZoom={false} 
        zoomControl={false}>

        <MapEvents /> {/*A Seperate func component MapEvents is required to acccess the map instance as ref is not working initially for some reason*/}
          <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a class="pr-2" target="_blank" href="https://www.esri.com/">Esri</a>'
          />
          {
            geoJsonData && <GeoJSON data={geoJsonData} style={{ color: "var(--primary)", fillColor: "transparent", opacity: 0.5 }} /> 
          }
          <Marker position={[13.3409, 74.7421]}>
              <Popup>Udupi - The Heart of Tulunadu</Popup>
          </Marker>
          <Marker position={[12.8701, 74.8419]}>
              <Popup>Mangaluru - The Heart of Tulunadu</Popup>
          </Marker>
          <Marker position={[12.4996,74.9869]}>
              <Popup>Kasargod - The Heart of Tulunadu</Popup>
          </Marker>
      </MapContainer>

    </div>
  );
});

export default MapComponent;
