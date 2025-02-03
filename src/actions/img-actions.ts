/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";

export async function getDaysWorked(propietario_id: string, cui: string) {
  try {
    const resultados = await prisma.image.findMany({
      where: {
        propietario_id: propietario_id,
        cui: cui,
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
        const formattedDate = date.toISOString().split("T");
        const datePart = formattedDate[0];
        const timePart = formattedDate[1].substring(0, 5);
        return `${datePart}T${timePart}`;
      })(),
    }));

    return diasTrabajados;
  } catch (error) {
    console.error("Error al buscar las imagenes:", error);
    return [];
  }
}
