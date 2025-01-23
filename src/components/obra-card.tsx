import React from "react";
import { TbMapPinShare } from "react-icons/tb";

interface Obra {
  id: string;
  state: string;
  cui: string;
  name: string;
  points: [number, number][];
  areaOrLength: string | null;
  resident: string;
  projectType: string;
  propietario_id: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

const ObraCard: React.FC<{
  obra: Obra;
  setDefaultLocation: (location: UserLocation) => void;
}> = ({ obra, setDefaultLocation }) => {
  const calculateCentroid = (
    coordinates: [number, number][]
  ): { longitude: number; latitude: number } => {
    let sumLat = 0;
    let sumLon = 0;

    coordinates.forEach((coord) => {
      sumLat += coord[1];
      sumLon += coord[0];
    });

    return {
      latitude: sumLat / coordinates.length,
      longitude: sumLon / coordinates.length,
    };
  };
  const calculateMitad = (
    coordinates: [number, number][]
  ): { longitude: number; latitude: number } => {
    const midIndex = Math.floor(coordinates.length / 2);
    return {
      latitude: coordinates[midIndex][1],
      longitude: coordinates[midIndex][0],
    };
  };

  const centroid =
    obra.projectType === "Superficie"
      ? calculateCentroid(obra.points)
      : calculateMitad(obra.points);

  const handleIconClick = () => {
    setDefaultLocation(centroid);
  };

  return (
    <div className="bg-secondary p-2 rounded-lg space-y-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex-1 text-center">
          <h1 className="font-semibold">{`CUI: ${obra.cui}`}</h1>
        </div>
        <TbMapPinShare
          onClick={handleIconClick}
          className="cursor-pointer hover:text-primary"
        />
      </div>
      <p className="text-secondary-foreground text-sm text-justify">
        {obra.name}
      </p>
      <p className="text-secondary-foreground text-sm text-justify">
        Tipo de proyecto: {obra.projectType}
      </p>
      <p className="text-secondary-foreground text-sm text-justify">
        Estado: {obra.state}
      </p>
      <span className="text-sm text-gray-400">Residente: {obra.resident}</span>
    </div>
  );
};

export default ObraCard;
