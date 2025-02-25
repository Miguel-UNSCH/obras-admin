/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/utils/zod/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { formatDateTime } from "@/lib/format-date";

// Función para actualizar la contraseña del usuario
export async function updateUser(data: z.infer<typeof updateUserSchema>) {
  try {
    const session = await auth();

    if (!session) {
      return { message: "No existe sesión activa", status: 400 };
    }

    // Verificar que el usuario autenticado está actualizando sus propios datos
    if (data.id !== session.user.id) {
      return {
        message: "No tienes permiso para actualizar este usuario",
        status: 400,
      };
    }

    // Comprobar si las nuevas contraseñas coinciden
    if (data.newPassword !== data.confirmNewPassword) {
      return { message: "Las contraseñas no coinciden", status: 400, field: 2 };
    }

    // Obtener la información del usuario actual para verificar la contraseña
    const user = await prisma.user.findUnique({
      where: { id: data.id },
    });

    // Verificar que el usuario ingrese un email único
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail && existingEmail.id !== data.id) {
      return {
        status: 400,
        message: "Este correo ya está en uso por otro usuario.",
      };
    }

    if (!user || !user.password) {
      return {
        message: "Usuario no encontrado o sin contraseña establecida",
        status: 400,
      };
    }

    // Verificar si la contraseña actual es correcta
    const isCurrentPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return { message: "Contraseña incorrecta", status: 400, field: 1 };
    }

    // Encriptar la nueva contraseña antes de guardarla
    const hashedNewPassword = await bcrypt.hash(data.newPassword, 12);

    // Actualizar solo la contraseña en la base de datos
    await prisma.user.update({
      where: { id: data.id },
      data: { password: hashedNewPassword },
    });

    await prisma.notification.create({
      data: {
        UserID: "Admin",
        title: "Actualización de contraseña",
        description:
          "La contraseña del usuario " + data.user + " ha sido actualizada",
        status: "actualizado",
        priority: "media",
      },
    });

    return { message: "Datos actualizados con éxito", status: 200 };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors.map((e) => e.message).join(", "),
        status: 400,
      };
    }
    return { message: "Error al actualizar el usuario: " + error, status: 500 };
  }
}

export async function getUsers() {
  try {
    const session = await auth();

    if (!session) {
      return { message: "No existe sessión activa", status: 500 };
    }

    const users = await prisma.user.findMany({});

    // Formatear los datos antes de devolver la respuesta
    const formattedData = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      user: user.user,
      createdAt: formatDateTime(user.createdAt), // Formatear la fecha de creación
      updatedAt: formatDateTime(user.updatedAt), // Formatear la fecha de actualización
    }));

    return formattedData;
  } catch (error) {
    return { message: "error" + error, status: 500 };
  }
}
