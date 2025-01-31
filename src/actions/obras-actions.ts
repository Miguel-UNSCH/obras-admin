/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { querySecondary } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function totalObrasRegistradas() {
  try {
    const result = await prisma.coordinates.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return result.map((obra: any) => ({
      id: obra.id,
      state: obra.state,
      propietario_id: obra.propietario_id,
      resident: obra.resident,
      projectType: obra.projectType,
      obraType: obra.obraType,
      cui: obra.cui,
      name: obra.name,
      areaOrLength: obra.areaOrLength,
      points: JSON.parse(obra.points),
    }));
  } catch (error) {
    console.error("Error al buscar obras:", error);
    return [];
  }
}

export async function getProyectos() {
  try {
    const result = await querySecondary(
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

    const coordinates = await prisma.coordinates.findMany({
      select: {
        cui: true,
      },
    });

    const existingCuis = new Set(
      coordinates.map((coordinate: any) => coordinate.cui)
    );

    const missingProjects = result.filter(
      (project: any) => !existingCuis.has(project.codigo_CUI)
    );

    return missingProjects;
  } catch (error) {
    console.error("Error al buscar obras", error);
    return [];
  }
}

export async function guardarObra(
  resident: string,
  projectType: string,
  obraType: string,
  cui: string,
  name: string,
  points: [number, number][],
  areaOrLength: string,
  propietario_id: string
) {
  try {
    await prisma.coordinates.create({
      data: {
        state: "Ejecucion",
        propietario_id,
        resident,
        projectType,
        obraType,
        cui,
        name,
        areaOrLength,
        points: JSON.stringify(points),
      },
    });

    const hashedNewPassword = await bcrypt.hash(propietario_id, 12);
    await prisma.userPhone.create({
      data: {
        name: resident,
        propietario_id: propietario_id,
        user: propietario_id,
        state: "Activo",
        cui: cui,
        password: hashedNewPassword,
      },
    });

    await prisma.notification.create({
      data: {
        UserID: propietario_id,
        title:
          "Registro de nueva " +
          (projectType === "Superficie" ? "construcción" : "carretera"),
        description: name,
        status: "actualizado",
        priority: "media",
      },
    });

    return {
      message: "La obra y las coordenadas se guardaron con éxito",
      status: 200,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    console.error("Error al guardar la obra:", error);
    return {
      message: "La obra no se pudo guardar",
      status: errorStatus,
    };
  }
}
