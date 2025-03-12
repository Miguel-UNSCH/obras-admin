import React from "react";
import { Calendar } from "../ui/calendar";

interface DayProps {
  Daysworked: Date[];
  setDay: (value: string) => void;
}

export default function CalendarCustom({ Daysworked, setDay }: DayProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  React.useEffect(() => {
    if (selectedDate) {
      setDay(selectedDate.toISOString().split("T")[0]);
    }
  }, [selectedDate, setDay]);

  const trabajadasDates = Daysworked.map((date) => new Date(date));

  return (
    <div className="grid grid-cols h-full w-full sm:p-4 gap-1 shadow-lg rounded-3xl items-center">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="max-w-full max-h-full text-xs"
        modifiers={{
          Daysworked: trabajadasDates,
        }}
        modifiersClassNames={{
          Daysworked: "bg-green-500 text-white",
        }}
      />
    </div>
  );
}
