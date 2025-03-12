"use client";

import RegistrosContainer from "./registros-container";
import { useEffect, useState } from "react";
import { getCooImg } from "@/actions/register-action";
import UploadImages from "./UploadImages";

interface Record {
  propietario_id: string;
  resident: string;
  cui: string;
  name: string;
  count: number;
}

export const dynamic = "force-dynamic";

export default function Page() {
  const [record, setRecord] = useState<Record[]>([]);

  const fetchRecords = async () => {
    const data = await getCooImg();
    setRecord(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <main className="grid w-full items-center justify-center gap-4">
      <div>
        <UploadImages record={record} refreshData={fetchRecords} />
      </div>
      <div>
        {record.length > 0 ? (
          <section>
            <RegistrosContainer registros={record} />
          </section>
        ) : (
          <p>No hay registros</p>
        )}
      </div>
    </main>
  );
};