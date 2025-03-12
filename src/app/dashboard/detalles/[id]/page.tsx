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
  obraType: string;
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
  date: Date;
}

function Page() {
  const { id } = useParams();
  const [obra, setObra] = useState<obra | null>(null);
  const [img, setImg] = useState<imgs[]>([]);
  const [resident, setResident] = useState<boolean>(false);

  const fetchData = async () => {
    if (!id) return;

    const idOnly = id?.toString();
    const data = await obtenerDetalles(idOnly);
    setObra(data);

    if (data && data.cui) {
      const imgs = await getDaysWorked(data.cui);
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
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const type_points_obra = obra
    ? {
        projectType: obra.projectType,
        points: obra.points,
      }
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full gap-4">
      <div className="h-full">
        <ImagesContainer imgs={img} type_points_obra={type_points_obra} />
      </div>
      <div className="h-full">
        {obra && <DetallesContainer obraDetalles={obra} resident={resident} refreshData={fetchData}/>}
      </div>
    </div>
  );
}

export default Page;
