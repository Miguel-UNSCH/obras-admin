'use server'

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const saveFile = async (file: File): Promise<string> => {
  const uploadsDir = path.join(process.cwd(), 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(file.name);
  const uuidFileName = `${uuidv4()}${ext}`;
  const filePath = path.join(uploadsDir, uuidFileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  // Devolver solo el nombre del archivo (con uuid)
  return uuidFileName; 
};
