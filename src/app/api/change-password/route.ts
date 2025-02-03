import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {user, cui, password, newPassword } = body;

    if ( !user || !newPassword || !password || !cui) {
      return NextResponse.json({ error: 'No data' }, { status: 404 });
    }

    const userFound = await prisma.userPhone.findFirst({
      where: {
       user,
       cui
      }
    })

    if (!userFound) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const passwordValid = await bcrypt.compare(password, userFound.password);

    if (!passwordValid) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 404 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.userPhone.update({
      where: {
        user,
        cui
      },
      data: {
        password: hashedNewPassword
      }
    })

    return NextResponse.json({ message: 'Contraseña actualizada correctamente' })

  } catch (error) {
    return NextResponse.json({ message: error}, {status: 500})
  }
}