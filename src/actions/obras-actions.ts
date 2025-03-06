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
  obra: {
    nombre_completo: string;
    codigo_CUI: string;
    nombre: string;
    propietario_id: string;
  },
  projectType: string,
  obraType: string,
  points: [number, number][],
  areaOrLength: string
) {
  try {
    await prisma.coordinates.create({
      data: {
        state: "Ejecucion",
        propietario_id: obra.propietario_id,
        resident: obra.nombre_completo,
        projectType,
        obraType,
        cui: obra.codigo_CUI,
        name: obra.nombre,
        areaOrLength,
        points: JSON.stringify(points),
      },
    });

    const hashedNewPassword = await bcrypt.hash(obra.propietario_id, 12);

    await prisma.userPhone.create({
      data: {
        name: obra.nombre_completo,
        propietario_id: obra.propietario_id,
        user: obra.propietario_id,
        state: "Activo",
        cui: obra.codigo_CUI,
        password: hashedNewPassword,
      },
    });

    await prisma.notification.create({
      data: {
        UserID: obra.propietario_id,
        title:
          "Registro de nueva " +
          (projectType === "Superficie" ? "construcción" : "carretera"),
        description: obra.nombre,
        status: "actualizado",
        priority: "alta",
      },
    });

    await prisma.notification.create({
      data: {
        UserID: obra.propietario_id,
        title: "Registro de nuevo residente: " + obra.nombre_completo,
        description: "NUEVO RESIDENTE DE LA OBRA: " + obra.nombre,
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
