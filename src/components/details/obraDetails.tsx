import { Button } from "@/components/buttons/button";
import Link from "next/link";

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
  obra: obra;
  onClose: () => void;
}

export function ObraDetails({ obra, onClose }: ObraDetailsProps) {
  return (
    <div className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2">
      <div className="bg-gradient-to-r from-gray-900 to-black text-white p-4 rounded-lg shadow-lg max-w-full sm:max-w-lg w-[320px] mx-auto text-justify">
        <h2 className="text-[14px] font-extrabold mb-4 text-center">Obra</h2>
        <div className="space-y-3">
          <div>
            <strong className="text-[13px]">CUI:</strong>{" "}
            <span className="text-[12px] text-gray-200">{obra.cui}</span>
          </div>
          <div>
            <strong className="text-[13px]">Descripción del Proyecto:</strong>
            <p className="text-[12px] leading-relaxed text-gray-200">
              {obra.name}
            </p>
          </div>
          <div>
            <strong className="text-[13px]">Proyecto:</strong>{" "}
            <span className="text-[12px] text-gray-200">
              {obra.obraType}
            </span>
          </div>
          <div>
            <strong className="text-[13px]">Residente:</strong>{" "}
            <span className="text-[12px] text-gray-200">{obra.resident}</span>
          </div>
        </div>
        <div className="flex flex-row p-3">
          <Button className="mx-auto block" onClick={onClose}>
            Cerrar
          </Button>
          <Link
            href={`/dashboard/detalles/${obra.id}`}
            className="mx-auto px-4 py-2 bg-green-600 text-sm text-center items-center rounded-md hover:bg-green-400 transition-colors duration-300"
          >
            Detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
