// import Link from "next/link";

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

interface ObraDetailsProps {
  obra?: obra;
}

export function ObraDetails({ obra }: ObraDetailsProps) {
  if (!obra) {
    return <p className="text-white text-center">No hay obra seleccionada</p>;
  }

  return (
    <div className="w-full h-full text-sm">
      <div className="space-y-3 text-start">
        <div>
          <strong className="font-bold text-justify">
            Descripción del Proyecto:
          </strong>
          <p className="leading-relaxed text-gray-200">{obra.name}</p>
        </div>
        <div>
          <strong className="font-bold">CUI:</strong>{" "}
          <span className="text-gray-200">{obra.cui}</span>
        </div>
        <div>
          <strong className="font-bold">Proyecto:</strong>{" "}
          <span className="text-gray-200">{obra.obraType}</span>
        </div>
        <div>
          <strong className="font-bold">Medida Aproximada: </strong>{" "}
          <span className="text-gray-200">{obra.areaOrLength}</span>
        </div>
        <div>
          <strong className="font-bold">Estado: </strong>{" "}
          <span className="text-gray-200">{obra.state}</span>
        </div>
        <div>
          <strong className="font-bold">Residente:</strong>{" "}
          <span className="text-gray-200">{obra.resident}</span>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="flex flex-row p-3">
  <Link
    href={`/dashboard/detalles/${obra.id}`}
    className="mx-auto px-4 py-2 bg-green-600 text-sm text-center items-center rounded-md hover:bg-green-400 transition-colors duration-300"
  >
    Detalles
  </Link>
</div>; */
}
