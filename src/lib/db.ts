/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/db.ts

import { Pool, QueryResultRow } from "pg";

// Define una interfaz para los parámetros de conexión
interface DBConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Configuración para la base de datos secundaria
const secondaryPool: DBConfig = {
  host: process.env.PGHOST_SECONDARY || "localhost",
  port: parseInt(process.env.PGPORT_SECONDARY || "5432", 10),
  database: process.env.PGDATABASE_SECONDARY || "mi_base_de_datos_secundaria",
  user: process.env.PGUSER_SECONDARY || "mi_usuario_secundario",
  password: process.env.PGPASSWORD_SECONDARY || "mi_contraseña_secundaria",
};

// Crea un pool de conexiones con `native: false`
const pool = new Pool(secondaryPool);

export async function querySecondary<T extends QueryResultRow>(
  text: string,
  params?: any[]
): Promise<T[]> {
  try {
    const res = await pool.query<T>(text, params);
    return res.rows;
  } catch (error) {
    throw error;
  }
}
