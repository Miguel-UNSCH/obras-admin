import Map, {
  Marker,
  NavigationControl,
  Source,
  Layer,
  MapLayerMouseEvent,
} from "react-map-gl";
import { TbPointFilled } from "react-icons/tb";
import { Feature, Polygon, LineString } from "geojson";

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
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
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
                const updatedPoints: [number, number][] = [...prevPoints];
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
  );
}

export default MapObras;
