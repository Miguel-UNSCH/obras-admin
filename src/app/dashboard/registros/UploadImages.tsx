import { useState } from "react";
import { Button } from "@/components/buttons/button";
import FormImage from "@/components/forms/formUploadImage";
import { BiSolidImageAdd } from "react-icons/bi";

interface Record {
  propietario_id: string;
  resident: string;
  cui: string;
  name: string;
  count: number;
}

interface UploadImagesProps {
  record: Record[];
}

export default function UploadImages({ record }: UploadImagesProps) {
  const [Modal, setModal] = useState<boolean>(false);
  const dayActual = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleConfirmationModal = () => {
    setModal(true);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 w-full items-center">
      <div className="flex justify-center sm:justify-start">
        <span className="text-lg font-semibold text-center">{dayActual}</span>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold py-4">Registros</h1>
      </div>

      <div className="flex justify-center sm:justify-end">
        <Button
          className="bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-600"
          onClick={handleConfirmationModal}
        >
          <BiSolidImageAdd />
          Nuevo registro
        </Button>
      </div>

      {Modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <FormImage record={record} setModal={setModal} />
        </div>
      )}
    </div>
  );
}
