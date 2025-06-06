import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { act, useEffect, useRef, useState } from "react";
import { LatLngBoundsExpression, LatLngExpression, Layer, Map } from "leaflet";
import { IoLocationSharp } from "react-icons/io5";
import { AiOutlineFullscreen,AiOutlineFullscreenExit } from "react-icons/ai";
import { FaLock,FaLockOpen,FaPlus,FaMinus } from "react-icons/fa";
import { useLoading } from "../context/LoadingContext";
import LoadingPage from "../components/Loading/LoadingPage";

const MAP = () => {

  const mapRef = useRef<HTMLDivElement | null>(null);    
  const [map, setMap] = useState<Map | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<{ [key: string]: any }>({});
  const [lock,setLock] = useState<boolean>(false);
  const INITIAL_ZOOM : number = 9;
  const [zoom,setZoom] = useState<number>(INITIAL_ZOOM);
  const center: LatLngExpression = [13.006995870591474, 75.07172913896241];
  const [isFullScreen,setFullScreen] = useState<boolean>(false);
  const [dragging,setDragging] = useState<boolean>(false);
  const toolTipPane = useRef<Element>()
  const {isLoading,setLoading} = useLoading();

  const maxBounds: LatLngBoundsExpression = [
      [14.025289007277138, 73.94617968510107],
      [11.98870273390581, 76.19727859282375],
  ];

  useEffect(() => {
    const fetchGeoJson = async (name: string) => {
        setLoading(true)
        try {
            const response = await fetch(`/assets/Map/${name}.geojson`);
            if (!response.ok) throw new Error(`Failed to fetch ${name}`);
            const data = await response.json();
            setGeoJsonData(prev => ({ ...prev, [name]: data }));
        } catch (error) {
            console.error(`Error loading ${name} GeoJSON:`, error);
        }
        setLoading(false)
    };

    ["districts", "dakshina_kannada", "udupi", "kasaragod"].forEach(fetchGeoJson);
    }, []);
    
    useEffect(()=>{
        if(mapRef.current){
           if(isFullScreen) mapRef.current.requestFullscreen();
           else if(document.fullscreenElement === mapRef.current) document.exitFullscreen()
        }
    },[isFullScreen])

  const MapEvents = () => {
    const map = useMap();

    useEffect(() => {
        setMap(map);
        const tooltips = document.querySelector(".leaflet-tooltip-pane");
        if(tooltips){
            toolTipPane.current = tooltips;
        }
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

    {/* The below useffect callback function is necessary as while dragging the map the tooltips of the layers which come
    under the dragging radius are opened and the user needs to click on the screen to close them.*/}
    useEffect(() => {
        if (map) {
          map.on("dragend",()=>{
            setDragging(true)
            setTimeout(()=>setDragging(false),400)
            }
          )
        }
      }, [map]);  

    return null;
  };

  useEffect(() => {
    if (toolTipPane.current && toolTipPane.current.children.length > 1) {
      toolTipPane.current.replaceChildren()
    }
  },[dragging]);

  const handleZoomChange = (delta: number) => map && map.setZoom(zoom + delta);

  const activeLayerRef = useRef<any>(null);

  const onEachVillage = (feature: any, layer: any) => {
    if (feature.properties?.Village_Name) {
      layer.bindTooltip(feature.properties.Village_Name, {
        permanent: false,
        direction: "top",
      });
    }

    const styles = {
      default: {
        color: "black",
        weight: 1,
        fillColor: "transparent",
        opacity: 0.5,
      },
      hover: {
        color: "red",
        weight: 2,
        fillColor: "pink",
        fillOpacity: 0.5,
        opacity: 1,
      },
      click: {
        color: "red",
        weight: 2,
        fillColor: "blue",
        fillOpacity: 0.5,
        opacity: 1,
      },
    };

    layer.setStyle(styles.default);

    layer.on({
      mouseover: () => {
        if (layer !== activeLayerRef.current) {
          layer.setStyle(styles.hover);
        }
      },
      mouseout: () => {
        if (layer !== activeLayerRef.current) {
          layer.setStyle(styles.default);
        }
      },
      click: () => {
        // Unstyle and reset tooltip of previous active
        if (activeLayerRef.current && activeLayerRef.current !== layer) {
          activeLayerRef.current.setStyle(styles.default);
          const oldTooltipContent = activeLayerRef.current.getTooltip()?.getContent();
          activeLayerRef.current.unbindTooltip();
          activeLayerRef.current.bindTooltip(oldTooltipContent, {
            permanent: false,
            direction: "top",
          });
        }
  
        // Toggle current
        if (layer === activeLayerRef.current) {
          layer.setStyle(styles.default);
          const tooltipContent = layer.getTooltip()?.getContent();
          layer.unbindTooltip();
          layer.bindTooltip(tooltipContent, {
            permanent: false,
            direction: "top",
          });
          activeLayerRef.current = null;
        } else {
          layer.setStyle(styles.click);
          const tooltipContent = layer.getTooltip()?.getContent();
          layer.unbindTooltip();
          layer.bindTooltip(tooltipContent, {
            permanent: true,
            direction: "top",
          }).openTooltip();
          activeLayerRef.current = layer;
        }
      },
    });
  };

  if(isLoading) return <LoadingPage/>
  return (
    <div className="w-screen h-screen relative overflow-hidden" ref={mapRef} >
      <style>
      {`
          .leaflet-interactive:focus{
              outline: none;
          }
      `}
      </style>

      <div className="controls z-10 absolute flex flex-col justify-center items-center gap-2 left-7 top-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
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

      <div className="fullscreen z-10 absolute flex flex-col justify-center items-center gap-2 right-0 top-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
        {
          isFullScreen ? 
          <AiOutlineFullscreenExit className="text-white text-[2.5rem] stroke-2 hover:scale-110" onClick={()=>setFullScreen(false)}/> : 
          <AiOutlineFullscreen className="text-white text-[2.5rem] stroke-2 hover:scale-110" onClick={()=>setFullScreen(true)}/>
        }
      </div>

      <MapContainer className={`z-0 relative w-full h-full`} center={center} zoom={INITIAL_ZOOM} maxBounds={maxBounds} minZoom={INITIAL_ZOOM} scrollWheelZoom={false} zoomControl={false}>
        <MapEvents /> {/*A Seperate func component MpaEvents is required to acccess the map instance as ref is not working initially for some reason*/}
          <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a class="pr-2" target="_blank" href="https://www.esri.com/">Esri</a>'
          />
          {
            zoom < 11 ? 
            geoJsonData["districts"] && <GeoJSON data={geoJsonData["districts"]} style={{ color: "var(--primary)", fillColor: "transparent", opacity: 0.5 }} /> : 
            <>
                {geoJsonData["districts"] && <GeoJSON data={geoJsonData["districts"]} style={{ color: "var(--primary)", fillColor: "transparent", opacity: 0.5 }} />}
                {geoJsonData["dakshina_kannada"] && <GeoJSON data={geoJsonData["dakshina_kannada"]} style={{ color: "black",weight : 1, fillColor: "transparent", opacity: 0.5}} onEachFeature={onEachVillage}/>}
                {geoJsonData["udupi"] && <GeoJSON data={geoJsonData["udupi"]} style={{ color: "black",weight : 1, fillColor: "transparent", opacity: 0.5}} onEachFeature={onEachVillage}/>}
                {geoJsonData["kasaragod"] && <GeoJSON data={geoJsonData["kasaragod"]} style={{ color: "black",weight : 1, fillColor: "transparent", opacity: 0.5}} onEachFeature={onEachVillage}/>}
            </>
          }
      </MapContainer>

      <div className="">

      </div>
      
    </div>
  );
};

export default MAP;