import { Marker, Source, Layer, MapLayerMouseEvent } from "react-map-gl";
import { TbPointFilled } from "react-icons/tb";
import { Feature, Polygon, LineString } from "geojson";
import MapProvider from "../MapProvider";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface MapObrasProps {
  isClient: boolean;
  userLocation: UserLocation;
  defaultLocation: UserLocation;
  newPoints: [number, number][];
  setNewPoints: React.Dispatch<React.SetStateAction<[number, number][]>>;
  polygonData: Feature<Polygon> | null;
  lineData: Feature<LineString> | null;
  projectType: string;
  handleMapClick: (event: MapLayerMouseEvent) => void;
}

function MapObras({
  isClient,
  userLocation,
  defaultLocation,
  newPoints,
  setNewPoints,
  polygonData,
  lineData,
  projectType,
  handleMapClick,
}: MapObrasProps) {
  const location = isClient ? userLocation : defaultLocation;
  return (
    <MapProvider
      defaultLocation={location}
      enableTerrain={false}
      onClick={handleMapClick}
    >
      {newPoints.map(([lng, lat], index) => {
        let markerColor = "#FF0000";
        if (index === 0) markerColor = "#111114";
        else if (index === newPoints.length - 1) markerColor = "#FEE227";

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
            {projectType === "Superficie" &&
              polygonData?.geometry?.coordinates && (
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
          </Marker>
        );
      })}
    </MapProvider>
  );
}

export default MapObras;
