import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/select/combobox";
import { Input } from "@/components/ui/input";
import { CalendarForm } from "@/components/ui/calendarForm";
import DragDropImgInput from "@/components/ui/drag-drop-img-input";
import toasterCustom from "@/components/toaster-custom";
import { saveFile } from "@/lib/fileHandler";
import { guardarImg } from "@/actions/register-action";
import { ConfirmDialog } from "@/components/dialog/dialog-confirm";
import { Button } from "@/components/buttons/button";

interface Record {
  propietario_id: string;
  resident: string;
  cui: string;
  name: string;
  count: number;
}

interface UploadImagesProps {
  record: Record[];
  setModal: (setModal: boolean) => void;
  refreshData: () => void;
}

interface OptionProps {
  value: string;
  label: string;
}

export default function FormImage({ record, setModal, refreshData }: UploadImagesProps) {
  const [editedImg, setEditedImg] = useState<File | null>(null);
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const options: OptionProps[] = useMemo(
    () => record.map((key) => ({ value: key.cui, label: key.cui })),
    [record]
  );

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

    const fileName = await saveFile(file);
    return fileName;
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
      const uploadedFileName = await handleFileUpload(editedImg);
      console.log(uploadedFileName);
      

      const response = await guardarImg(
        `${process.env.NEXT_PUBLIC_URL}/api/uploads/${uploadedFileName}`,
        obraSeleccionada?.propietario_id,
        obraSeleccionada?.cui,
        fecha.toISOString()
      );

      toasterCustom(response.status, response.message);

      handleCloseConfirmationModal();
      closeModal();

      if (response.status === 200) {
        await refreshData();
      }
    } catch {
      toasterCustom(404, "Error al guardar la imagen");
    }
  };

  const selectedRecord = record.find((rec) => rec.cui === selectedOption);

  return (
    <div className="bg-background p-6 rounded-lg w-full sm:w-3/4 lg:w-1/2 max-w-sm sm:max-w-lg space-y-6 px-4">
      <h2 className="text-xl text-center font-semibold mb-4">Nuevo Registro</h2>
      <div className="space-y-4">
        <div className="space-x-4">
          <Label htmlFor="cui">Cui de obra:</Label>
          <Combobox
            placeholder="Seleccione el cui de obra"
            options={options}
            onChange={(value: string | null) => setSelectedOption(value || "")}
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
      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmSave}
        title="¿Estas seguro de guardar esta imagen?"
        description="La imagen que intenta guardar ya no se podra borrar hasta que el proyecto sea eliminado..."
        styleButton="bg-[#0E8E8D] hover:bg-[#36BFC5]"
      />
    </div>
  );
}
