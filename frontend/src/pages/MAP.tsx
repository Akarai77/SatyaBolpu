import { GeoJSON, Marker } from "react-leaflet";
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {  LeafletMouseEvent, Map } from "leaflet";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { useLoading } from "../context/LoadingContext";
import MapComponent from "../components/MapComponent";
import Button from "../components/Button";
import { MdCancel } from "react-icons/md";
import { FaMagnifyingGlassLocation } from "react-icons/fa6";
import { IoMdDoneAll } from "react-icons/io";
import { usePost } from "../context/PostContext";

type coordinatesType = {
  latitude: number | null;
  longitude: number | null;
};

type coordinatesErrorType = {
  latitude: string;
  longitude: string;
}

const MAP = ({ editMode = false } : { editMode?: boolean }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const { state, dispatch } = usePost();
  const [map, setMap] = useState<Map | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<{ [key: string]: any }>({});
  const [lock, setLock] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(9);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const toolTipPane = useRef<Element>();
  const activeLayerRef = useRef<any>(null);
  const [activeVillage,setActiveVillage] = useState<any>(null);
  const [askForCoordinates,setAskForCoordinates] = useState<boolean>(false);
  const [coordinates,setCoordinates] = useState<coordinatesType>({latitude: null,longitude: null});
  const [coordinateErrors,setCoordinateErrors] = useState<coordinatesErrorType>({latitude: '', longitude: ''});
  const [marker,setMarker] = useState<boolean>(false);
  const { setLoading } = useLoading();

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
    if(map && zoom > 15)
      setActiveVillage(null);
  },[zoom]);

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
      if (fullScreen && document.fullscreenElement !== mapRef.current) {
        mapRef.current.requestFullscreen();
      } else if (!fullScreen && document.fullscreenElement === mapRef.current) {
        document.exitFullscreen();
      }
    }
  }, [fullScreen]);

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
      
      click: (e: LeafletMouseEvent) => {
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

  const districtKeys = ["dakshina_kannada", "udupi", "kasaragod"];
  const onEachUniteractiveVillage = (feature: any,layer: any) => {
    layer.on({
      click: (e: LeafletMouseEvent) => {
        setCoordinates({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        });
        setMarker(true);
        console.log(e)
        localStorage.setItem('mapDetails',JSON.stringify({
        }))
      }
    })
  }

  const uninteractiveVillageLayers = useMemo(() => (
    <>
      {districtKeys.map((key) => 
        geoJsonData[key] && (
          <GeoJSON
            key={`u${key}`}
            data={geoJsonData[key]}
            style={{
              color: "black",
              weight: 1,
              fillColor: "transparent",
              opacity: 0.5
            }}
            onEachFeature={onEachUniteractiveVillage}
          />
        )
      )}
    </>
  ), [geoJsonData]);

  const villageLayers = useMemo(() => (
    <>
      {districtKeys.map((key) => 
        geoJsonData[key] && (
          <GeoJSON
            key={key}
            data={geoJsonData[key]}
            style={{
              color: "black",
              weight: 1,
              fillColor: "transparent",
              opacity: 0.5
            }}
            onEachFeature={onEachVillage}
          />
        )
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
      const [xmin,ymin,xmax,ymax] = activeVillage.bbox;
      map.flyTo([(ymin+ymax)/2, (xmin+xmax)/2], 14)
    }
  }

   const handleCoordinateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCoordinateErrors((prev) => ({
      ...prev,
      [name] : ''
    }))
    const {name, value} = e.target;

    if(isNaN(Number(value)))
      return

    setCoordinates((prev) => ({
        ...prev,
        [name]: value
    }));
  };

  const handleCoordinatesSubmit = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();

    const newErrors = {
      latitude: '',
      longitude: ''
    }

    if(!coordinates.latitude) {
      newErrors.latitude = 'Latitude is required.'
    }

    if(!coordinates.longitude) {
        newErrors.longitude = 'Longitude is required.'
    }

    const maxBounds = [
      [14.025289007277138, 73.94617968510107],
      [11.98870273390581, 76.19727859282375],
    ];

    if(coordinates.latitude && (coordinates.latitude! > maxBounds[0][0] || coordinates.latitude! < maxBounds[1][0])) {
      newErrors.latitude = 'Latitude exceeds max bounds.'
    }

    if(coordinates.longitude && (coordinates.longitude! > maxBounds[1][1] || coordinates.longitude! < maxBounds[0][1])) {
      newErrors.longitude = 'Longitude exceeds max bounds.'
    }

    setCoordinateErrors(newErrors);
    const hasError = Object.values(newErrors).some(err => err !== '');
    if(hasError)
      return

    map?.flyTo([coordinates.latitude!, coordinates.longitude!],18);
    setMarker(true);
  }

  const handleSubmit = () => {
          
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
        gap-2 right-0 top-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
        {fullScreen ? (
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
        {
          editMode &&
            <IoMdDoneAll 
              className="text-[2.5rem] text-white hover:scale-110"
              onClick={handleSubmit}
            />
        }
      </div>

      {
        editMode && (
          !fullScreen && !askForCoordinates ?
            (
              <div 
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-white hover:scale-105 
                  p-2 rounded-xl hover:bg-primary text-back cursor-pointer text-[2rem]" 
                onClick={() => setAskForCoordinates(true)} 
              >
                <FaMagnifyingGlassLocation className=""/>
              </div>
            ) :

            (
              <form 
                className="absolute flex flex-col gap-3 left-5 top-1/2 -translate-y-1/2 z-10 bg-black
                  p-6 rounded-xl text-back cursor-pointer" 
                onSubmit={handleCoordinatesSubmit}>
                <MdCancel 
                  className="absolute top-1 right-1 fill-white hover:fill-primary" 
                  onClick={() => setAskForCoordinates(false)}
                />
                <div className="w-full flex flex-col items-center justify-between gap-2">
                  <label className="text-white" htmlFor="latitude">Latitude</label>
                  <input
                    className="p-1"
                    type="text"
                    id="latitude"
                    name="latitude"
                    autoComplete="off"
                    value={coordinates.latitude ?? ''}
                    onChange={handleCoordinateChange}
                  />        
                  {coordinateErrors.latitude && <p className="text-red-500">{coordinateErrors.latitude}</p>}
                </div>
                <div className="w-full flex flex-col items-center justify-between gap-2">
                  <label className="text-white" htmlFor="longitude">Longitude</label>
                  <input 
                    className="p-1 rounded"
                    type="text"
                    id="longitude"
                    name="longitude"
                    autoComplete="off"
                    value={coordinates.longitude ?? ''}
                    onChange={handleCoordinateChange}
                  />
                  {coordinateErrors.longitude && <p className="text-red-500">{coordinateErrors.longitude}</p>}
                </div>
                <Button content="Find" type="submit" className="w-fit mx-auto"/>
              </form>
            )
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
        className={`z-0 relative w-full h-full`}
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
          zoom > 15 ? 
            uninteractiveVillageLayers
              :
            villageLayers
        )}
        {
          marker &&
            <Marker 
              position={[coordinates.latitude!, coordinates.longitude!]}
            />
        }
      </MapComponent>
    </div>
  );
};

export default MAP;
