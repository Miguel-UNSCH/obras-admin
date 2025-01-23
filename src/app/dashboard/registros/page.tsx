/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/buttons/button";
import Registros from "./registros-container";
import { useEffect, useState, useMemo } from "react";
import { getCooImg, guardarImg } from "@/actions/register-action";
import { CalendarForm } from "@/components/ui/calendarForm";
import DragDropImgInput from "@/components/ui/drag-drop-img-input";
import { ConfirmDialog } from "@/components/dialog/dialog-confirm";
import { Combobox } from "@/components/select/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toasterCustom from "@/components/toaster-custom";
import { listFiles, saveFile } from "@/lib/fileHandler";

interface Record {
  propietario_id: string;
  resident: string;
  cui: string;
  name: string;
  count: number;
}

interface OptionProps {
  value: string;
  label: string;
}

export const dynamic = "force-dynamic";

function Page() {
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [editedImg, setEditedImg] = useState<File | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [record, setRecord] = useState<Record[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [Modal, setModal] = useState(false);

  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const data = await getCooImg();
      setRecord(data);
    };

    fetchRecords();
  }, []);

  const dayActual = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const options: OptionProps[] = useMemo(
    () => record.map((key) => ({ value: key.cui, label: key.cui })),
    [record]
  );

  const handleConfirmationModal = () => {
    setModal(true);
  };

  const handleShowConfirmationModal = () => {
    setShowConfirmationModal(true);
  };
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const closeModal = () => {
    setModal(false);
    setSelectedOption("");
  };

  const obraSeleccionada = record.find((obra) => obra.cui === selectedOption);

  async function handleFileUpload(file: File) {
    if (!file) {
      throw new Error("No se ha proporcionado ningún archivo");
    }

    const formData = new FormData();
    formData.append("file", file);

    const filePath = await saveFile(file);
    return filePath;
  }

  const handleConfirmSave = async () => {
    if (!selectedOption || !fecha || !editedImg) {
      toasterCustom(
        400,
        "Por favor complete todos los campos antes de guardar."
      );
      return;
    }

    if (!obraSeleccionada?.propietario_id) {
      toasterCustom(400, "El propietario_id no está disponible.");
      return;
    }

    try {
      // Subir la imagen
      const filePath = await handleFileUpload(editedImg);

      // Guardar la información relacionada con la imagen
      const response = await guardarImg(
        `${process.env.NEXT_PUBLIC_URL}/api/uploads/${editedImg.name}`, // URL del archivo subido
        obraSeleccionada?.propietario_id,
        fecha.toISOString()
      );

      toasterCustom(response.status, response.message);

      handleCloseConfirmationModal();
      closeModal();

      if (response.status === 200) {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      }
    } catch (error) {
      console.error("Error al guardar la imagen:", error);
      toasterCustom(404, "Error al guardar la imagen");
    }
  };

  const selectedRecord = record.find((rec) => rec.cui === selectedOption);

  return (
    <main className="grid w-full items-center justify-center gap-4">
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
            Nuevo registro
          </Button>
        </div>
      </div>

      {record.length > 0 ? (
        <section className="w-full mx-auto">
          <Registros registros={record} />
        </section>
      ) : (
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
          No tienes registros en este momento...
        </p>
      )}

      {Modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full sm:w-3/4 lg:w-1/2 max-w-sm sm:max-w-lg space-y-6 px-4">
            <h2 className="text-xl text-center font-semibold mb-4">
              Nuevo Registro
            </h2>
            <div className="space-y-4">
              <div className="space-x-4">
                <Label htmlFor="cui">Cui de obra:</Label>
                <Combobox
                  placeholder="Seleccione el cui de obra"
                  options={options}
                  onChange={(value: string | null) =>
                    setSelectedOption(value || "")
                  }
                  value={selectedOption}
                />
              </div>

              <div>
                <Label>Residente:</Label>
                <Input
                  type="text"
                  value={selectedRecord?.resident || ""}
                  readOnly
                  placeholder="Nombre del residente"
                  disabled
                />
              </div>

              <div>
                <Label>Nombre de la obra:</Label>
                <Input
                  type="text"
                  value={selectedRecord?.name || ""}
                  readOnly
                  placeholder="Nombre de la obra"
                  disabled
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <CalendarForm fecha={setFecha} />
              <DragDropImgInput img={editedImg} setImg={setEditedImg} />
            </div>

            <div className="flex justify-end mt-4 space-x-4">
              <Button onClick={closeModal}>Cancelar</Button>
              <Button
                className="bg-green-600 hover:bg-green-500"
                onClick={handleShowConfirmationModal}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmSave}
        title="¿Estas seguro de guardar esta imagen?"
        description="La imagen que intenta guardar ya no se podra borrar hasta que el proyecto sea eliminado..."
        styleButton="bg-[#0E8E8D] hover:bg-[#36BFC5]"
      />
    </main>
  );
}

export default Page;
