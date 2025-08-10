import { GeoJSON } from "react-leaflet";
import React, { useEffect, useRef, useState } from "react";
import { Map } from "leaflet";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { useLoading } from "../context/LoadingContext";
import MapComponent from "../components/MapComponent";

const MAP = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<{ [key: string]: any }>({});
  const [lock, setLock] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(9);
  const [isFullScreen, setFullScreen] = useState<boolean>(false);
  const toolTipPane = useRef<Element>();
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
    if (mapRef.current) {
      if (isFullScreen) mapRef.current.requestFullscreen();
      else if (document.fullscreenElement === mapRef.current) document.exitFullscreen();
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

  const activeLayerRef = useRef<any>(null);

  const onEachVillage = (feature: any, layer: any) => {
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
        } else {
          layer.setStyle(styles.click);
          activeLayerRef.current = layer; 
        }
      },
    });
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden" ref={mapRef}>
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
            z-index: 1000;
          }
          .global-tooltip:before {
            border-top-color: rgba(0, 0, 0, 0.8);
          }
          .permanent-tooltip {
            z-index: 1001;
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
        )}
      </MapComponent>
    </div>
  );
};

export default MAP;
