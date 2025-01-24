"use client";

import NewCoordinates from "@/components/views/register-Location";
import { useState, useMemo } from "react";
import ButtonSave from "@/components/buttons/dynamic/icons-save";
import { guardarObra } from "@/actions/obras-actions";
import toasterCustom from "@/components/toaster-custom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialog/dialog-confirm";
import { Combobox } from "@/components/select/combobox";
import medidaTotal from "@/utils/measureWork";

interface ObrasProps {
  nombre: string;
  codigo_CUI: string;
  nombre_completo: string;
  propietario_id: string;
}

interface OptionProps {
  value: string;
  label: string;
}

interface ObrasContainerProps {
  obras: ObrasProps[];
}

function ObrasContainer({ obras }: ObrasContainerProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [points, setPoints] = useState<[number, number][]>([]);
  const [projectType, setProjectType] = useState<string>("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const options: OptionProps[] = useMemo(
    () => obras.map((obra) => ({ value: obra.codigo_CUI, label: obra.nombre })),
    [obras]
  );

  const handleSaveClick = async () => {
    if (!selectedOption) {
      toasterCustom(400, "Por favor, selecciona una obra antes de continuar.");
      return;
    }

    if (points.length < 3) {
      toasterCustom(
        400,
        "Por favor, introduce al menos 3 puntos para continuar."
      );
      return;
    }

    handleShowConfirmationModal();
  };

  const handleShowConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmSave = async () => {
    if (points.length < 3) {
      toasterCustom(
        400,
        "El polígono no tiene suficientes puntos para ser válido."
      );
      return;
    }

    const areaOrLength = medidaTotal(points, projectType);

    const obraSeleccionada = obras.find(
      (obra) => obra.codigo_CUI === selectedOption
    );
    if (!obraSeleccionada) {
      toasterCustom(400, "No se encontró la obra seleccionada.");
      return;
    }

    try {
      if (!obraSeleccionada || !points || !areaOrLength) {
        toasterCustom(400, "Por favor complete todos los campos requeridos.");
        return;
      }
      const data = await guardarObra(
        obraSeleccionada.nombre_completo,
        projectType,
        obraSeleccionada.codigo_CUI,
        obraSeleccionada.nombre,
        points,
        areaOrLength,
        obraSeleccionada.propietario_id
      );

      if (!data) {
        toasterCustom(500, "Ocurrió un error inesperado");
        return;
      }

      toast.dismiss();
      toasterCustom(data.status, data.message);
      handleCloseConfirmationModal();

      if (data.status === 200) {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      }
    } catch {
      toasterCustom(500, "Error al procesar la solicitud.");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid sm:grid-row-1 md:grid-cols-[1fr_auto] items-center gap-4">
        <Combobox
          placeholder="Seleccione una obra"
          options={options}
          onChange={(value: string | null) => setSelectedOption(value || "")}
          value={selectedOption}
        />
        <ButtonSave onClick={handleSaveClick} />
      </div>

      <div className="rounded-3xl overflow-hidden w-full h-full shadow-lg">
        <NewCoordinates
          setPoints={setPoints}
          setProjectTypestyle={setProjectType}
        />
      </div>

      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmSave}
        title="¿Estas seguro de guardar esta información?"
        description="Los datos guardados incluirán nombres y coordenadas"
        styleButton="bg-green-500 hover:bg-emerald-500"
      />
    </div>
  );
}

export default ObrasContainer;
