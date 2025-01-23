import DescriptionWork from "@/components/views/description-work";
import MapDrawingPolygon from "@/components/views/map-drawing-polygon";

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

const DetallesContainer: React.FC<{ obra: Obra, resident: boolean }> = ({
  obra,
  resident,
}) => {
  const mapDetails = {
    id: obra.id,
    state: obra.state,
    points: obra.points,
    projectType: obra.projectType,
  };

  const descriptionDetails = {
    id: obra.id,
    state: obra.state,
    cui: obra.cui,
    name: obra.name,
    areaOrLength: obra.areaOrLength,
    resident: obra.resident,
    projectType: obra.projectType,
    propietario_id: obra.propietario_id,
  };

  return (
    <div className="grid grid-rows-2 h-full w-full gap-y-4">
      <div className="rounded-3xl overflow-hidden">
        <MapDrawingPolygon obra={mapDetails} />
      </div>
      <div className="rounded-3xl overflow-hidden">
        <DescriptionWork obra={descriptionDetails} resident={resident} />
      </div>
    </div>
  );
};

export default DetallesContainer;
