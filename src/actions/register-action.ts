"use server";

import { prisma } from "@/lib/prisma";

export async function getCooImg() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const imagesToday = await prisma.image.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        propietario_id: true,
        date: true,
      },
    });

    const coordinatesToday = await prisma.coordinates.findMany({
      where: {
        state:"Ejecucion",
      },
      select: {
        propietario_id: true,
        resident: true,
        cui: true,
        name: true,
      },
    });

    const propietarioCount = imagesToday.reduce(
      (acc: { [key: string]: number }, image) => {
        const { propietario_id } = image;
        acc[propietario_id] = (acc[propietario_id] || 0) + 1;
        return acc;
      },
      {}
    );

    const result = coordinatesToday.map((coord) => {
      const count = propietarioCount[coord.propietario_id] || 0;
      return {
        propietario_id: coord.propietario_id,
        resident: coord.resident,
        cui: coord.cui,
        name: coord.name,
        count,
      };
    });
    return result;
  } catch (error) {
    console.error("Error al buscar los imagenes:", error);
    return [];
  }
}

export async function guardarImg(
  url: string,
  propietario_id: string,
  fecha: string
) {
  try {
    const nuevaImagen = await prisma.image.create({
      data: {
        url,
        propietario_id,
        date: new Date(fecha),
      },
    });

    return {
      message: "La imagen se guardó con éxito",
      status: 200,
      data: nuevaImagen,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    console.error("Error al actualizar la obra:", error);
    return {
      message: "La obra no se pudo eliminar",
      status: errorStatus,
    };
  }
}
