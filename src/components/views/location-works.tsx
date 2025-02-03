/* eslint-disable @typescript-eslint/prefer-as-const */
import { Feature, Polygon, LineString } from "geojson";
import { JSX, useState } from "react";
import {
  FaRoad,
  FaBuilding,
  FaUniversity,
  FaHospital,
  FaWarehouse,
  FaTree,
  FaIndustry,
  FaWater,
  FaTrain,
  FaShip,
  FaPlane,
  FaLandmark,
  FaGavel,
  FaCloudRain,
  FaStore,
  FaTruckMoving,
  FaTint,
} from "react-icons/fa";
import { FaBridge } from "react-icons/fa6";
import { Marker, Source, Layer } from "react-map-gl";
import calculateHalfwayPoint from "@/utils/midPoint";
import { ObraDetails } from "../details/obraDetails";

interface obra {
  id: string;
  state: string;
  propietario_id: string;
  resident: string;
  projectType: string;
  obraType: string;
  cui: string;
  name: string;
  areaOrLength: string;
  points: [number, number][];
}

function LocationObras({ obra }: { obra: obra }) {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const typeObra = obra.projectType === "Superficie" ? "Polygon" : "LineString";

  const centroid = calculateHalfwayPoint(obra.points, obra.projectType);

  const layerConfig =
    typeObra === "Polygon"
      ? {
          id: `polygon-layer-${obra.id}`,
          type: "fill" as "fill",
          paint: {
            "fill-color": "#088ff5",
            "fill-opacity": 0.5,
            "fill-outline-color": "#000000",
          },
        }
      : {
          id: `line-layer-${obra.id}`,
          type: "line" as "line",
          paint: {
            "line-color": "#14437F",
            "line-width": 5,
          },
        };

  const geoJsonData: Feature<Polygon | LineString> =
    typeObra === "Polygon"
      ? {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [obra.points],
          },
        }
      : {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: obra.points,
          },
        };

  const handleMarkerClick = () => {
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const getIconByObraType = (obraType: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      Acueducto: <FaTint className="text-[#9333EA] text-2xl z-0" />,
      Aeropuerto: <FaPlane className="text-[#4C51BF] text-2xl z-0" />,
      Almacen: <FaWarehouse className="text-[#A16207] text-2xl z-0" />,
      Canal: <FaTint className="text-[#F43F5E] text-2xl z-0" />,
      Carretera: <FaRoad className="text-[#f75617] text-2xl z-0" />,
      Clinica: <FaHospital className="text-[#16A34A] text-2xl z-0" />,
      Cultural: <FaLandmark className="text-[#EAB308] text-2xl z-0" />,
      Deposito: <FaBuilding className="text-[#6B7280] text-2xl z-0" />,
      Edificio: <FaBuilding className="text-[#DC2626] text-2xl z-0" />,
      Embalse: <FaWater className="text-[#F97316] text-2xl z-0" />,
      Escuela: <FaUniversity className="text-[#1D4ED8] text-2xl z-0" />,
      Estadio: <FaGavel className="text-[#D97706] text-2xl z-0" />,
      Fabrica: <FaIndustry className="text-[#6B7280] text-2xl z-0" />,
      Ferrocarril: <FaTrain className="text-[#8B5CF6] text-2xl z-0" />,
      Hospital: <FaHospital className="text-[#16A34A] text-2xl z-0" />,
      "Infraestructura sanitaria": (
        <FaTint className="text-[#A21CAF] text-2xl z-0" />
      ),
      Mercado: <FaStore className="text-[#D97706] text-2xl z-0" />,
      Parque: <FaTree className="text-[#15803D] text-2xl z-0" />,
      Planta: <FaIndustry className="text-[#6B7280] text-2xl z-0" />,
      Puente: <FaBridge className="text-[#065F46] text-2xl z-0" />,
      Puerto: <FaShip className="text-[#EC4899] text-2xl z-0" />,
      Represa: <FaCloudRain className="text-[#9333EA] text-2xl z-0" />,
      "Terminal de transporte": (
        <FaTruckMoving className="text-[#F59E0B] text-2xl z-0" />
      ),
      Tunel: <FaRoad className="text-[#4B5563] text-2xl z-0" />,
      Universidad: <FaLandmark className="text-[#EAB308] text-2xl z-0" />,
    };

    return (
      iconMap[obraType] || <FaBuilding className="text-gray-400 text-2xl z-0" />
    );
  };

  return (
    <>
      <Marker
        key={`centroid-marker-${obra.cui}`}
        longitude={centroid.longitude}
        latitude={centroid.latitude}
        onClick={handleMarkerClick}
      >
        <div className="relative">
          {getIconByObraType(obra.obraType)}
          {showDetails && (
            <ObraDetails obra={obra} onClose={handleCloseDetails} />
          )}
        </div>
      </Marker>

      <Source id={`source-${obra.id}`} type="geojson" data={geoJsonData}>
        <Layer {...layerConfig} />
      </Source>
    </>
  );
}

export default LocationObras;
