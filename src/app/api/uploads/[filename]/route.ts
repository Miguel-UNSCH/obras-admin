import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

interface Params {
  filename: string;
}

export async function GET(req: Request, context: { params: Promise<Params> }) {
  // Asegúrate de usar `await` en `context.params`
  const { filename } = await context.params;

  const uploadsDir = path.join(process.cwd(), 'uploads');
  const filePath = path.join(uploadsDir, filename);

  // Verifica si el archivo existe
  if (!fs.existsSync(filePath)) {
    return new NextResponse('Archivo no encontrado', { status: 404 });
  }

  const file = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // Determina el tipo MIME
  const mimeType = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.avif': 'image/avif',
  }[ext] || 'application/octet-stream';

  return new NextResponse(file, {
    headers: {
      'Content-Type': mimeType,
    },
  });
}
