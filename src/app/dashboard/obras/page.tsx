/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { getProyectos } from "@/actions/obras-actions";
import ObrasContainer from "./obras-container";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

function Page() {
  const [queryResult, setQueryResult] = useState<any[]>([]);

  useEffect(() => {
    const getObrasData = async () => {
      const obras = await getProyectos();
      setQueryResult(obras);
    };
    getObrasData();
  }, []);

  return (
    <div className="h-full">
      <ObrasContainer obras={queryResult} />
    </div>
  );
}

export default Page;
