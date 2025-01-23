/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";

export async function getNotification() {
  try {
    const result = await prisma.notification.findMany({
      take: 20,
      orderBy: {
        updatedAt: "desc",
      },
    });

    const resultados = result.map((resul: any) => ({
      id: resul.id,
      title: resul.title,
      description: resul.description,
      status: resul.status,
      priority: resul.priority,
      update: new Date(resul.updatedAt).toLocaleString(),
    }));

    return resultados;
  } catch (error) {
    console.error("Error en notificaciones:", error);
    return [];
  }
}
