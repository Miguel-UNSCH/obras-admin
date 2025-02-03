import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, cui, date } = body;

    const fechaInicio = new Date(`${date}T00:00:00.000Z`);
    const fechaFin = new Date(`${date}T23:59:59.999Z`);

    if (!id || !cui || !date) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, {status: 404});
    }

    const imageFound = await prisma.image.findMany({
      where: {
        propietario_id: id,
        cui,
        date: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
    })

    if (imageFound.length === 0) {
      return NextResponse.json({ error: "No se encontró imagenes" }, {status: 404});
    }

    return NextResponse.json(imageFound);

  } catch (error) {
    return NextResponse.json({ message: error}, {status: 500})
  }
}