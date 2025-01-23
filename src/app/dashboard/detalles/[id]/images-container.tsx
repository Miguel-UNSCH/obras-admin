import CalendarCustom from "@/components/views/calendar-custom";
import ImageWork from "@/components/views/image-work";
import { useState } from "react";

interface Imgs {
  id: string;
  url: string | null;
  latitud: string | null;
  longitud: string | null;
  date: string | null;
}

interface ImagesContainerProps {
  imgs: Imgs[] | null;
}

const today = new Date().toISOString().split("T")[0];

const ImagesContainer: React.FC<ImagesContainerProps> = ({ imgs }) => {
  const [day, setDay] = useState<string>(today);

  const dayT = imgs?.map((result) => result.date).filter((date): date is string => date !== null) ?? [];

  const onlyDay = imgs?.filter((result) => result.date === (day + "T00:00")) ?? [];

  return (
    <div className="grid grid-rows-2 h-full w-full gap-y-4">
      <div className="rounded-3xl w-full bg-gradient-to-tr from-[#FFCEB7] dark:from-[#0F172A] dark:to-[#065F46] to-[#E3D8D6]">
        <CalendarCustom Daysworked={dayT} setDay={setDay} />
      </div>
      <div className="rounded-3xl bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
        <ImageWork imgs={onlyDay} />
      </div>
    </div>
  );
};

export default ImagesContainer;