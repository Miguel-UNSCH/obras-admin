import CalendarCustom from "@/components/views/calendar-custom";
import ImageWork from "@/components/views/image-work";
import { useState } from "react";

interface imgs {
  id: string;
  url: string;
  latitud: string | null;
  longitud: string | null;
  propietario_id: string;
  date: string;
}

interface ImagesContainerProps {
  imgs: imgs[] | null;
}

const today = new Date().toISOString().split("T")[0];

function ImagesContainer({ imgs }: ImagesContainerProps) {
  const [day, setDay] = useState<string>(today);

  const dayT =
    imgs
      ?.map((result) => result.date)
      .filter((date): date is string => date !== null) ?? [];

  const onlyDay =
    imgs?.filter((result) => result.date === day + "T00:00") ?? [];

  return (
    <div className="grid grid-rows-2 h-full w-full gap-y-4">
      <div className="rounded-3xl w-full bg-gradient-to-tr from-[#ffdbcb] to-[#E3D8D6] dark:from-[#15213d] dark:to-[#065f28ee] ">
        <CalendarCustom Daysworked={dayT} setDay={setDay} />
      </div>
      <div className="rounded-3xl bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
        <ImageWork imgs={onlyDay} />
      </div>
    </div>
  );
}

export default ImagesContainer;
