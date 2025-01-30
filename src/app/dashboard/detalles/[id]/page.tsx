"use client";
import { useParams } from "next/navigation";
import DetallesContainer from "./detalles-container";
import ImagesContainer from "./images-container";
import {
  BuscarActulizacionResident,
  obtenerDetalles,
} from "@/actions/details-action";
import { getDaysWorked } from "@/actions/img-actions";
import { useEffect, useState } from "react";

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

interface imgs {
  id: string;
  url: string;
  latitud: string | null;
  longitud: string | null;
  propietario_id: string;
  date: string;
}

function Page() {
  const { id } = useParams();
  const [obra, setObra] = useState<obra | null>(null);
  const [img, setImg] = useState<imgs[]>([]);
  const [resident, setResident] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id && typeof id === "string") {
        const data = await obtenerDetalles(id);
        setObra(data);

        if (data && data.propietario_id) {
          const imgs = await getDaysWorked(data.propietario_id);
          setImg(imgs);

          if (data.state === "Finalizado") {
            setResident(false);
          } else {
            const obraActualizada = await BuscarActulizacionResident(
              data.cui,
              data.propietario_id
            );
            setResident(obraActualizada);
          }
        }
      }
    };

    fetchData();
  }, [id]);

  const coordenadasobra = obra
    ? {
        projectType: obra.projectType,
        points: obra.points,
      }
    : null;

  if (!obra)
    return (
      <div className="text-center text-cyan-900 dark:text-teal-400 font-semibold">
        Cargando...
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full gap-4">
      <div className="h-full">
        <ImagesContainer imgs={img} coordinates={coordenadasobra} />
      </div>
      <div className="h-full">
        <DetallesContainer obraDetalles={obra} resident={resident} />
      </div>
    </div>
  );
}

export default Page;
