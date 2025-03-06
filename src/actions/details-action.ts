/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { querySecondary } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function obtenerDetalles(id: string) {
  try {
    const result = await prisma.coordinates.findMany();

    const obraEncontrada = result.find((obra: any) => obra.id === id);

    if (!obraEncontrada) {
      return null;
    }

    const formattedObra = {
      id: obraEncontrada.id,
      state: obraEncontrada.state,
      cui: obraEncontrada.cui,
      name: obraEncontrada.name,
      points: JSON.parse(obraEncontrada.points),
      areaOrLength: obraEncontrada.areaOrLength,
      resident: obraEncontrada.resident,
      projectType: obraEncontrada.projectType,
      obraType: obraEncontrada.obraType,
      propietario_id: obraEncontrada.propietario_id,
    };

    return formattedObra;
  } catch (error) {
    console.error("Error en detalles:", error);
    return null;
  }
}

export async function FinalizarObra(id: string, cui: string) {
  try {
    await prisma.coordinates.update({
      where: { id },
      data: {
        state: "Finalizado",
      },
    });

    await prisma.userPhone.updateMany({
      where: { cui },
      data: {
        state: "Inactivo",
      },
    });

    return {
      message: "Obra finalizada correctamente",
      status: 200,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    return {
      message: "La obra no se pudo Finalizar",
      status: errorStatus,
    };
  }
}

export async function ActualizarObra(
  id: string,
  points: [number, number][],
  projectType: string,
  areaOrLength: string
) {
  try {
    await prisma.coordinates.update({
      where: { id },
      data: {
        points: JSON.stringify(points),
        projectType: projectType,
        areaOrLength: areaOrLength,
      },
    });
    return {
      message: "La obra y las coordenadas se guardaron con éxito",
      status: 200,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    console.error("Error al actualizar la obra:", error);
    return {
      message: "La obra y las coordenadas no se puedieron guardaron",
      status: errorStatus,
    };
  }
}

export async function BuscarActulizacionResident(
  codigo_CUI: string,
  propietario_id: string
) {
  try {
    const busqueda = await querySecondary(
      `SELECT
        app."codigo_CUI",
        apa."propietario_id"
      FROM public."archivoProject_proyecto" app
      INNER JOIN public."archivoProject_archivo" apa
        ON app.id = apa."nombre_proyecto_id"
      INNER JOIN public."archivoProject_usuario" apu
        ON apa."propietario_id" = apu."dni"
      WHERE apu."rol" = '2'`,
      []
    );

    const obraEncontrada = busqueda.find(
      (user: any) =>
        user.codigo_CUI === codigo_CUI && user.propietario_id === propietario_id
    );

    return !obraEncontrada;
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    return false;
  }
}

export async function ActualizarResidenteO(
  id: string,
  propietario_id: string,
  cui: string
) {
  try {
    const busqueda = await querySecondary(
      `SELECT
        app.nombre,
        app."codigo_CUI",
        apa.propietario_id,
        CONCAT(apu.apellido_paterno, ' ', apu.apellido_materno, ' ', apu.nombre) AS nombre_completo
      FROM public."archivoProject_proyecto" app
      INNER JOIN public."archivoProject_archivo" apa
        ON app.id = apa.nombre_proyecto_id
      INNER JOIN public."archivoProject_usuario" apu
        ON apa.propietario_id = apu.dni
      WHERE apu.rol = '2';`,
      []
    );

    const obraEncontrada = busqueda.find((user) => user.codigo_CUI === cui);

    const userEncontrado = await prisma.userPhone.findMany({
      where: {
        propietario_id: obraEncontrada?.propietario_id,
        cui: obraEncontrada?.codigo_CUI,
      },
    });

    if (userEncontrado.length === 0) {
      const hashedNewPassword = await bcrypt.hash(
        obraEncontrada!.propietario_id,
        12
      );

      await prisma.userPhone.create({
        data: {
          name: obraEncontrada?.nombre_completo,
          propietario_id: obraEncontrada!.propietario_id,
          user: obraEncontrada!.propietario_id,
          state: "Activo",
          cui: cui,
          password: hashedNewPassword,
        },
      });
    } else {
      await prisma.userPhone.updateMany({
        where: {
          propietario_id: obraEncontrada?.propietario_id,
          cui: obraEncontrada?.codigo_CUI,
        },
        data: {
          state: "Activo",
        },
      });
    }

    await prisma.userPhone.updateMany({
      where: { propietario_id, cui },
      data: {
        state: "Inactivo",
      },
    });

    await prisma.coordinates.update({
      where: { id },
      data: {
        propietario_id: obraEncontrada?.propietario_id,
        resident: obraEncontrada?.nombre_completo,
      },
    });

    await prisma.notification.create({
      data: {
        UserID: obraEncontrada!.propietario_id,
        title:
          "Registro de nuevo residente: " + obraEncontrada?.nombre_completo,
        description: "NUEVO RESIDENTE DE LA OBRA: " + obraEncontrada!.nombre,
        status: "actualizado",
        priority: "media",
      },
    });

    return {
      message: "El residente se guardo con éxito",
      status: 200,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    console.error("Error al actualizar el residente:", error);
    return {
      message: "No se pudo actualizar el residente",
      status: errorStatus,
    };
  }
}
