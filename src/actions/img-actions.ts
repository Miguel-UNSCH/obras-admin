/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";

export async function getDaysWorked( cui: string) {
  try {
    const resultados = await prisma.image.findMany({
      where: {
        cui,
      },
    });

    const diasTrabajados = resultados.map((resul: any) => ({
      id: resul.id,
      url: resul.url,
      latitud: resul.latitud,
      longitud: resul.longitud,
      propietario_id: resul.propietario_id,
      date: resul.date,
    }));

    return diasTrabajados;
  } catch (error) {
    console.error("Error al buscar las imagenes:", error);
    return [];
  }
}
