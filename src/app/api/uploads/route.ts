import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const id = formData.get("id") as string;
    const cui = formData.get("cui") as string;
    const latitud = formData.get("latitud") as string;
    const longitud = formData.get("longitud") as string;
    const date = formData.get("date") as string;

    if (!file || !id || !cui || !latitud || !longitud || !date) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `${process.env.NEXT_PUBLIC_URL}/api/uploads/${file.name}`;

    const newImage = await prisma.image.create({
      data: {
        url: fileUrl,
        latitud,
        longitud,
        propietario_id: id,
        cui,
        date: new Date(date),
      },
    });

    return NextResponse.json({
      message: "Imagen subida y guardada con éxito",
      image: newImage,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
