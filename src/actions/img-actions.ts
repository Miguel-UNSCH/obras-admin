/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";

export async function getDaysWorked(id: string) {
  try {
    const resultados = await prisma.image.findMany({
      where: {
        propietario_id: id,
      },
    });

    const diasTrabajados = resultados.map((resul: any) => ({
      id: resul.id,
      url: resul.url,
      latitud: resul.latitud,
      longitud: resul.longitud,
      propietario_id: resul.propietario_id,
      date: (() => {
        const date = new Date(resul.date);
        date.setUTCHours(0, 0, 0, 0);
        return date.toISOString().split("T")[0] + "T00:00";
      })(),
    }));

    return diasTrabajados;
  } catch (error) {
    console.error("Error al buscar las imagenes:", error);
    return [];
  }
}
