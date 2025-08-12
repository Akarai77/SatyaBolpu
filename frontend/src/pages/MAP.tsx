import { GeoJSON } from "react-leaflet";
import React, { ChangeEvent, FormEvent, FormEventHandler, useEffect, useMemo, useRef, useState } from "react";
import { Map } from "leaflet";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { useLoading } from "../context/LoadingContext";
import MapComponent from "../components/MapComponent";
import Button from "../components/Button";
import { MdCancel } from "react-icons/md";
import { FaMagnifyingGlassLocation } from "react-icons/fa6";
import { useDialog } from "../context/DialogBoxContext";

type coordinatesType = {
  latitude: number | null;
  longitude: number | null;
};

const MAP = ({ editMode = false } : { editMode?: boolean }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<{ [key: string]: any }>({});
  const [lock, setLock] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(9);
  const [isFullScreen, setFullScreen] = useState<boolean>(false);
  const toolTipPane = useRef<Element>();
  const activeLayerRef = useRef<any>(null);
  const [activeVillage,setActiveVillage] = useState<any>(null);
  const [coordinates,setCoordinates] = useState<coordinatesType>({latitude: null,longitude: null});
  const dialog = useDialog();
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    const fetchGeoJson = async (name: string) => {
      setLoading(true);
      try {
        const response = await fetch(`/assets/Map/${name}.geojson`);
        if (!response.ok) throw new Error(`Failed to fetch ${name}`);
        const data = await response.json();
        setGeoJsonData(prev => ({ ...prev, [name]: data }));
      } catch (error) {
        console.error(`Error loading ${name} GeoJSON:`, error);
      } finally {
        setLoading(false);
      }
    };

    ["districts", "dakshina_kannada", "udupi", "kasaragod"].forEach(fetchGeoJson);
  }, []);

  useEffect(() => {
    return () => {
      if (toolTipPane.current) {
        toolTipPane.current.innerHTML = '';
      }
    };
  }, [map]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFs = document.fullscreenElement === mapRef.current;
      setFullScreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      if (isFullScreen && document.fullscreenElement !== mapRef.current) {
        mapRef.current.requestFullscreen();
      } else if (!isFullScreen && document.fullscreenElement === mapRef.current) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  const handleMapReady = (mapInstance: Map) => {
    setMap(mapInstance);
    
    const tooltips = document.querySelector(".leaflet-tooltip-pane");
    if (tooltips) {
      toolTipPane.current = tooltips;
    }

    mapInstance.on("zoomstart", () => {
      if (toolTipPane.current) {
        toolTipPane.current.innerHTML = '';
      }
    });
  };

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
  const onEachVillage = (feature: any, layer: any) => {

    layer.setStyle(styles.default);

    layer.on({
      mouseover: (e: any) => {
        if (feature.properties?.Village_Name && layer !== activeLayerRef.current) {
          if (toolTipPane.current) {
            const existingTooltips = toolTipPane.current.querySelectorAll('.leaflet-tooltip:not(.permanent-tooltip)');
            existingTooltips.forEach((tooltip: Element) => tooltip.remove());
          }
          
          const tooltip = L.tooltip({
            permanent: false,
            direction: "top",
            className: "global-tooltip"
          })
          .setContent(feature.properties.Village_Name)
          .setLatLng(e.latlng);
          
          if (map) {
            tooltip.addTo(map);
          }
        }
        
        if (layer !== activeLayerRef.current) {
          layer.setStyle(styles.hover);
        }
      },
      
      mouseout: () => {
        if (layer !== activeLayerRef.current) {
          layer.setStyle(styles.default);
        }
      },
      
      click: (e: any) => {
        if (toolTipPane.current) {
          toolTipPane.current.innerHTML = '';
        }

        if (activeLayerRef.current && activeLayerRef.current !== layer) {
          activeLayerRef.current.setStyle(styles.default);
        }

        if (layer === activeLayerRef.current) {
          layer.setStyle(styles.default);
          activeLayerRef.current = null;
          setActiveVillage(null);
        } else {
          layer.setStyle(styles.click);
          activeLayerRef.current = layer;
          setActiveVillage(feature)
          if (feature.properties?.Village_Name && map) {
            const permanentTooltip = L.tooltip({
              permanent: true,
              direction: "top",
              className: "global-tooltip permanent-tooltip"
            })
            .setContent(feature.properties.Village_Name)
            .setLatLng(e.latlng);

            permanentTooltip.addTo(map);
          }
        }
      },
    });
  };

  const villageLayers = useMemo(() => (
    <>
      {geoJsonData["dakshina_kannada"] && (
        <GeoJSON 
          data={geoJsonData["dakshina_kannada"]} 
          style={{ color: "black", weight: 1, fillColor: "transparent", opacity: 0.5 }}
          onEachFeature={onEachVillage}
        />
      )}
      
      {geoJsonData["udupi"] && (
        <GeoJSON 
          data={geoJsonData["udupi"]}
          style={{ color: "black", weight: 1, fillColor: "transparent", opacity: 0.5 }}
          onEachFeature={onEachVillage}
        />
      )}

      {geoJsonData["kasaragod"] && (
        <GeoJSON 
          data={geoJsonData["kasaragod"]} 
          style={{ color: "black", weight: 1, fillColor: "transparent", opacity: 0.5 }}
          onEachFeature={onEachVillage}
        />
      )}

    </>
  ), [geoJsonData]);

  const handleVillageExit = () => {
    if(map && activeVillage) {
      setActiveVillage(null);
      activeLayerRef.current.setStyle(styles.default);
      activeLayerRef.current = null;
    }
  }

  const handleView = () => {
    if(map && activeVillage) {
      console.log(activeVillage)
      const [xmin,ymin,xmax,ymax] = activeVillage.bbox;
      console.log(xmin,ymin)
      map.flyTo([(ymin+ymax)/2, (xmin+xmax)/2], 14)
    }
  }


  const askForCoordinates = () => {
    const handleCoordinateChange = (e: ChangeEvent<HTMLInputElement>) => {
      const {name,value} = e.target;

      setCoordinates((prev) => ({
        ...prev,
        [name] : value
      }));
    }

    const handleCoordinatesSubmit = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
      e.preventDefault();
    }

    const CoordinatesForm = () => {
      return (
        <form 
          className="w-full flex flex-col items-center justify-center gap-2"
          onSubmit={handleCoordinatesSubmit}>
          <div className="w-full flex items-center justify-between gap-2">
            <label className="text-white" htmlFor="lat">Latitude</label>
            <input
              className="p-1"
              type="text"
              name="latitude"
              value={coordinates.latitude!}
              onChange={handleCoordinateChange}
              />
          </div>
          <div className="w-full flex items-center justify-between gap-2">
            <label className="text-white" htmlFor="lat">Longitude</label>
            <input 
              className="p-1"
              type="text"
              name="longitude"
              value={coordinates.longitude!}
              onChange={handleCoordinateChange}
              />
          </div>
          <input type="submit" className="hidden"/>
        </form>
      )
    }

    dialog?.popup({
      title: 'Enter the coordinates.',
      descr: 'Paste the latitude and longitude of the location.',
      children: (
        <CoordinatesForm />
      ),
      onConfirm: handleCoordinatesSubmit
    })
  }

  return (
    <div className="w-screen h-screen relative" ref={mapRef}>
      <style>
        {`
          .leaflet-interactive:focus{
            outline: none;
          }
          .global-tooltip {
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: 20;
          }
          .global-tooltip:before {
            border-top-color: rgba(0, 0, 0, 0.8);
          }
          .permanent-tooltip {
            z-index: 30;
          }
        `}
      </style>

      <div className="fullscreen z-10 absolute flex flex-col justify-center items-center
        gap-2 right-0 top-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
        {isFullScreen ? (
          <AiOutlineFullscreenExit 
            className="text-white text-[2.5rem] stroke-2 hover:scale-110" 
            onClick={() => setFullScreen(false)} 
          />
        ) : (
          <AiOutlineFullscreen 
            className="text-white text-[2.5rem] stroke-2 hover:scale-110" 
            onClick={() => setFullScreen(true)} 
          />
        )}
      </div>

      {
        editMode && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-white hover:scale-105 
            p-2 rounded-xl hover:bg-primary text-back cursor-pointer text-[2rem]" 
            onClick={askForCoordinates}>
              <FaMagnifyingGlassLocation className=""/>
          </div>
        )
      }

      {
        activeVillage && (
          <div className="absolute bottom-0 bg-black m-5 p-5 text-white z-[1000]
             flex flex-col gap-2 rounded-2xl">
            <MdCancel 
              className="absolute top-3 right-3 cursor-pointer hover:fill-primary"
              onClick={handleVillageExit}/>
            <h1>Village : {activeVillage.properties.Village_Name}</h1>
            <p className="italic">lorem ipsum</p>
            <p>No of covered locations: {0}</p>
            <Button content="View More" className="mx-auto" onClick={handleView}/>
          </div>
        )
      }

      <MapComponent
        className="z-0 relative w-full h-full"
        geoJsonData={geoJsonData}
        onMapReady={handleMapReady}
        zoom={zoom}
        onZoomChange={setZoom}
        lock={lock}
        onLockChange={setLock}
        showControls={true}
        minZoom={9}
        initialZoom={9}
      >
        {zoom >= 11 && (
          villageLayers
        )}
      </MapComponent>
    </div>
  );
};

export default MAP;
