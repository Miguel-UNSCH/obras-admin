import React from "react";
import { TbMapPinShare } from "react-icons/tb";
import calculateHalfwayPoint from "@/utils/midPoint";

interface obra {
  id: string;
  state: string;
  propietario_id: string;
  resident: string;
  projectType: string;
  cui: string;
  name: string;
  areaOrLength: string;
  points: [number, number][];
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface obrasProsp {
  obra: obra;
  setDefaultLocation: (location: UserLocation) => void;
}

function ObraCard({ obra, setDefaultLocation }: obrasProsp) {
  const centroid = calculateHalfwayPoint(obra.points, obra.projectType);

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
}

export default ObraCard;
