import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "MI_CLAVE_SECRETA_SUPER_SEGURA";

export async function GET() {
  return NextResponse.json({ message: "Hello World" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, password } = body;

    if (!user || !password) {
      // Importante: retornar para detener la ejecución si no hay credenciales
      return NextResponse.json({ error: 'No data' }, { status: 404 });
    }

    const userFound = await prisma.userPhone.findFirst({
      where: {
        user,
      },
    })

    if (!userFound) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const passwordValid = await bcrypt.compare(password, userFound.password);

    if (!passwordValid) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 404 });
    }

    const obraFound = await prisma.coordinates.findFirst({
      where: {
        cui: userFound.cui,
      },
    })

    // =====================================
    // Generar el token JWT con el ID del usuario
    // =====================================
    // Aquí puedes incluir en el payload la información que necesites; por ejemplo, el ID de usuario.
    // "expiresIn" define el tiempo de validez del token (ej: "2h", "7d", etc.).
    const token = jwt.sign(
      { userId: userFound.id },        // Payload: en este caso, el ID del usuario.
      JWT_SECRET,                      // Clave secreta para firmar el token.
      { expiresIn: '24h' }             // Tiempo de expiración del token.
    );

    return NextResponse.json({
      token,
      user: {
        // Información relevante del usuario para mostrar en la app
        name: userFound.name,
        propietario_id: userFound.propietario_id,
        image: userFound.image,
        state: userFound.state,
        cui: userFound.cui,
        obra: obraFound
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
