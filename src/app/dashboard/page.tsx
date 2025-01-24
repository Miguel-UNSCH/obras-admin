/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { totalObrasRegistradas } from "@/actions/obras-actions";
import CustomMap from "@/components/views/custom-map";
import SideDashboard from "@/components/views/side-dashboard";
import { useEffect, useState } from "react";

interface UserLocation {
  latitude: number;
  longitude: number;
}

function Page() {
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [defaultLocation, setDefaultLocation] = useState<UserLocation>({
    latitude: -13.160441,
    longitude: -74.225832,
  });

  useEffect(() => {
    const getObrasData = async () => {
      const obras = await totalObrasRegistradas();
      setQueryResult(obras);
    };
    getObrasData();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row h-full w-full gap-4">
      <div className="overflow-y-auto p-4 h-full w-fit rounded-xl bg-gradient-to-b from-[#ececec] dark:from-[#2D2D2D] dark:to-[#2D2D2D] to-[#eba77a]">
        <SideDashboard
          totalObras={queryResult}
          setDefaultLocation={setDefaultLocation}
        />
      </div>

      <div className="rounded-xl overflow-hidden h-full w-full">
        <CustomMap obrasT={queryResult} defaultLocation={defaultLocation} />
      </div>
    </div>
  );
}

export default Page;
