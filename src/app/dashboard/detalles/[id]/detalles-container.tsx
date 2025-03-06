import DescriptionWork from "@/components/views/description-work";
import MapLocationWork from "@/components/maps/map-location-work";

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

export default function DetallesContainer({ obraDetalles, resident }: { obraDetalles: obra, resident: boolean }) {

  const mapDetails = {
    id: obraDetalles.id,
    state: obraDetalles.state,
    points: obraDetalles.points,
    projectType: obraDetalles.projectType,
  };

  const descriptionDetails = {
    id: obraDetalles.id,
    state: obraDetalles.state,
    cui: obraDetalles.cui,
    name: obraDetalles.name,
    areaOrLength: obraDetalles.areaOrLength,
    resident: obraDetalles.resident,
    projectType: obraDetalles.projectType,
    obraType: obraDetalles.obraType,
    propietario_id: obraDetalles.propietario_id,
  };

  return (
    <div className="grid grid-rows-2 h-full w-full gap-y-4">
      <div className="rounded-3xl overflow-hidden">
        <MapLocationWork obra={mapDetails} />
      </div>
      <div className="rounded-3xl overflow-hidden">
        <DescriptionWork obra={descriptionDetails} resident={resident} />
      </div>
    </div>
  );
};
