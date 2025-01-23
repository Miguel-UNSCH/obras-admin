'use server'

import fs from 'fs';
import path from 'path';

export const saveFile = async (file: File): Promise<string> => {
  const uploadsDir = path.join(process.cwd(), 'uploads');

  // Crea la carpeta `uploads` si no existe
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  const filePath = path.join(uploadsDir, file.name);

  // Escribir el archivo en el sistema de archivos
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return filePath;
};

export const listFiles = async (): Promise<string[]> => {
  const uploadsDir = path.join(process.cwd(), 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    return [];
  }

  return fs.readdirSync(uploadsDir);
};
