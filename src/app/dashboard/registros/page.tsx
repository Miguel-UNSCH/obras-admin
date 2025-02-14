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

function Page() {
  const [record, setRecord] = useState<Record[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const data = await getCooImg();
      setRecord(data);
    };

    fetchRecords();
  }, []);

  return (
    <main className="grid w-full items-center justify-center gap-4">
      <div className="">
        <UploadImages record={record} />
      </div>
      <div className="">
        {record.length < 0 ? (
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
            No tienes registros en este momento...
          </p>
        ) : (
          <section className="w-full mx-auto">
            <RegistrosContainer registros={record} />
          </section>
        )}
      </div>
    </main>
  );
}

export default Page;
