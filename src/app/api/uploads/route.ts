import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import multiparty from "multiparty";
import { Readable } from "stream";
import type { IncomingMessage } from "http";
import { v4 as uuidv4 } from "uuid";

// Desactivar el análisis automático del cuerpo de la solicitud en Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// Convertir `Request` de Next.js a `IncomingMessage` de Node.js
async function toIncomingMessage(req: Request): Promise<IncomingMessage> {
  const readableStream = req.body?.getReader();
  const stream = new Readable({
    async read() {
      if (!readableStream) return this.push(null);
      const { done, value } = await readableStream.read();
      if (done) return this.push(null);
      this.push(value);
    },
  });

  const incomingMessage = Object.assign(stream, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.url,
  });

  return incomingMessage as IncomingMessage;
}

export async function POST(req: Request) {
  try {
    console.log("Recibiendo datos en el servidor...");
    console.log("Headers:", req.headers);

    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type inválido" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Convertir `req` a `IncomingMessage`
    const incomingReq = await toIncomingMessage(req);

    // Configurar multiparty
    const form = new multiparty.Form({
      uploadDir: uploadsDir,
      maxFilesSize: 50 * 1024 * 1024,
    });

    // Definir `data` con tipos explícitos
    const data: {
      fields: Record<string, string[]>;
      files: Record<string, multiparty.File[]>;
    } = await new Promise((resolve, reject) => {
      form.parse(incomingReq, (err, fields, files) => {
        if (err) return reject(err);
        resolve({
          fields: fields as Record<string, string[]>,
          files: files as Record<string, multiparty.File[]>,
        });
      });
    });

    console.log("Campos recibidos:", data.fields);
    console.log("Archivos recibidos:", data.files);

    if (!data.files.file || data.files.file.length === 0) {
      return NextResponse.json(
        { error: "Archivo no encontrado" },
        { status: 400 }
      );
    }

    const file = data.files.file[0];
    const id = data.fields.id?.[0] ?? "";
    const cui = data.fields.cui?.[0] ?? "";
    const latitud = data.fields.latitud?.[0] ?? "";
    const longitud = data.fields.longitud?.[0] ?? "";
    const date = data.fields.date?.[0] ?? "";

    if (!file || !id || !cui || !latitud || !longitud || !date) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // Generar nuevo nombre con UUID
    const ext = path.extname(file.originalFilename);
    const uuidFilename = `${uuidv4()}${ext}`;
    const newPath = path.join(uploadsDir, uuidFilename);

    // Mover archivo subido al nuevo path con UUID
    fs.renameSync(file.path, newPath);

    const fileUrl = `${process.env.NEXT_PUBLIC_URL}/api/uploads/${uuidFilename}`;

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
    console.error("Error en el servidor:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
