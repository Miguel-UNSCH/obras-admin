/* eslint-disable react-hooks/exhaustive-deps */
import "mapbox-gl/dist/mapbox-gl.css";
import Map, {
  Marker,
  NavigationControl,
  Source,
  Layer,
  MapMouseEvent,
} from "react-map-gl";
import { useState, useCallback, useEffect } from "react";
import { Feature, Polygon, LineString } from "geojson";
import { TbPointFilled } from "react-icons/tb";
import ButtonBack from "@/components/buttons/dynamic/icons-back";
import Radio from "./option-figura";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface NewCoordinatesProps {
  setPoints: (localPoints: [number, number][]) => void;
  setProjectTypestyle: (projectType: string) => void;
}

function NewCoordinates({
  setPoints,
  setProjectTypestyle,
}: NewCoordinatesProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [polygonData, setPolygonData] = useState<Feature<Polygon> | null>(null);
  const [lineData, setLineData] = useState<Feature<LineString> | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [typeError, setTypeError] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const defaultLocation: UserLocation = {
    latitude: -13.160441,
    longitude: -74.225832,
  };
  const [newPoints, setNewPoints] = useState<[number, number][]>([]);
  const [projectType, setProjectType] = useState<string>("Superficie");

  const createPolygon = (points: [number, number][]): Feature<Polygon> => ({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [points.concat([points[0]])],
    },
    properties: {},
  });

  const createLine = (points: [number, number][]): Feature<LineString> => ({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: points,
    },
    properties: {},
  });

  const updateGeometryData = useCallback(
    (points: [number, number][]) => {
      if (projectType === "Superficie") {
        setPolygonData(createPolygon(points));
        setLineData(null);
      } else if (projectType === "Carretera") {
        setLineData(createLine(points));
        setPolygonData(null);
      }
    },
    [projectType]
  );

  useEffect(() => {
    updateGeometryData(newPoints);
    setPoints(newPoints);
    setProjectTypestyle(projectType);
  }, [newPoints, projectType, updateGeometryData]);

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setNewPoints((prevPoints) => {
      const newPoint: [number, number][] = [...prevPoints, [lng, lat]];

      if (JSON.stringify(prevPoints) !== JSON.stringify(newPoint)) {
        return newPoint;
      }

      return prevPoints;
    });
  }, []);

  const handleRemoveLastPoint = () => {
    setNewPoints((prevPoints) => {
      const updatedPoints = prevPoints.slice(0, -1);
      updateGeometryData(updatedPoints);
      return updatedPoints;
    });
  };

  const handleProjectTypeChange = (newType: string) => {
    setProjectType(newType);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setTypeError(0);
      setLocationError("La geolocalización no es soportada por este navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setTypeError(null);
        setLocationError(null);
      },
      (error) => {
        setTypeError(error.code);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("El usuario denegó el permiso de geolocalización");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("La posición geográfica no está disponible");
            break;
          case error.TIMEOUT:
            setLocationError(
              "La solicitud de geolocalización ha superado el tiempo de espera"
            );
            break;
          default:
            setLocationError("Error desconocido al obtener la ubicación");
        }
      }
    );
  };

  useEffect(() => {
    requestLocation();

    if (typeError === null) {
      setIsClient(true);
    }

    const timeoutId = setTimeout(() => {
      if (!userLocation) {
        setUserLocation(defaultLocation);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [typeError, userLocation]);

  if (!isClient || !userLocation) {
    return (
      <div className="p-4">
        {isClient ? (
          <p className="text-center text-gray-700 dark:text-cyan-800 font-semibold">
            Esperando la ubicación del usuario...
          </p>
        ) : (
          <div className="items-center text-center text-red-500">
            <p className="font-semibold">{locationError}</p>
            <p>Se le redirigirá a una ubicación predeterminada...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-10">
        <ButtonBack onClick={handleRemoveLastPoint} />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Radio
          projectType={projectType}
          setProjectType={handleProjectTypeChange}
        />
      </div>

      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: isClient
            ? userLocation.longitude
            : defaultLocation.longitude,
          latitude: isClient ? userLocation.latitude : defaultLocation.latitude,
          zoom: 13,
        }}
        mapStyle={"mapbox://styles/mapbox/satellite-streets-v12"}
        onClick={handleMapClick}
      >
        <NavigationControl
          position="bottom-right"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            gap: "10px",
            borderRadius: "15px",
          }}
        />

        {newPoints.map(([lng, lat], index) => {
          let markerColor = "#FF0000";
          if (index === 0) {
            markerColor = "#111114";
          } else if (index === newPoints.length - 1) {
            markerColor = "#FEE227";
          }
          return (
            <Marker
              key={index}
              longitude={lng}
              latitude={lat}
              draggable
              onDrag={(event) => {
                const { lng: newLng, lat: newLat } = event.lngLat;
                setNewPoints((prevPoints) => {
                  const updatedPoints = [...prevPoints];
                  updatedPoints[index] = [newLng, newLat];
                  return updatedPoints;
                });
              }}
            >
              <TbPointFilled size={20} color={markerColor} />
            </Marker>
          );
        })}

        {projectType === "Superficie" && polygonData?.geometry?.coordinates && (
          <Source id="polygon-source" type="geojson" data={polygonData}>
            <Layer
              id="polygon-layer"
              type="fill"
              paint={{
                "fill-color": "#CA3938",
                "fill-opacity": 0.5,
              }}
            />
          </Source>
        )}

        {projectType === "Carretera" && lineData?.geometry?.coordinates && (
          <Source id="line-source" type="geojson" data={lineData}>
            <Layer
              id="line-layer"
              type="line"
              paint={{
                "line-color": "#F7700A",
                "line-width": 5,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}

export default NewCoordinates;
