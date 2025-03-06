"use client";

import NewCoordinatesMap from "@/components/maps/map-new-coordinates";
import { useState, useMemo } from "react";
import ButtonSave from "@/components/buttons/dynamic/icons-save";
import { guardarObra } from "@/actions/obras-actions";
import toasterCustom from "@/components/toaster-custom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialog/dialog-confirm";
import { Combobox } from "@/components/select/combobox";
import medidaTotal from "@/utils/measureWork";
interface ObraProps {
  nombre: string;
  codigo_CUI: string;
  propietario_id: string;
  nombre_completo: string;
}

interface ObrasContainerProps {
  obras: ObraProps[];
}

interface OptionProps {
  value: string;
  label: string;
}

export default function ObrasContainer({ obras }: ObrasContainerProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [obraType, setObraType] = useState<string>("");
  const [points, setPoints] = useState<[number, number][]>([]);
  const [projectType, setProjectType] = useState<string>("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const defaultLocation = {
      latitude: -13.160441,
      longitude: -74.225832,
    };

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
    const areaOrLength = medidaTotal(points, projectType);

    const obraSeleccionada = obras.find(
      (obra) => obra.codigo_CUI === selectedOption
    );

    try {
      if (!obraSeleccionada || !points || !obraType) {
        toasterCustom(400, "Por favor complete todos los campos requeridos.");
        return;
      }

      const data = await guardarObra(
        obraSeleccionada,
        projectType,
        obraType,
        points,
        areaOrLength
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

  const optionIcon = [
    { value: "Acueducto", label: "Acueducto" },
    { value: "Aeropuerto", label: "Aeropuerto" },
    { value: "Almacen", label: "Almacén" },
    { value: "Canal", label: "Canal" },
    { value: "Carretera", label: "Carretera" },
    { value: "Clinica", label: "Clínica" },
    { value: "Cultural", label: "Cultural" },
    { value: "Deposito", label: "Depósito" },
    { value: "Edificio", label: "Edificio" },
    { value: "Embalse", label: "Embalse" },
    { value: "Escuela", label: "Escuela" },
    { value: "Estadio", label: "Estadio" },
    { value: "Fabrica", label: "Fábrica" },
    { value: "Ferrocarril", label: "Ferrocarril" },
    { value: "Hospital", label: "Hospital" },
    { value: "Infraestructura sanitaria", label: "Infraestructura sanitaria" },
    { value: "Mercado", label: "Mercado" },
    { value: "Parque", label: "Parque" },
    { value: "Planta", label: "Planta" },
    { value: "Puente", label: "Puente" },
    { value: "Puerto", label: "Puerto" },
    { value: "Represa", label: "Represa" },
    { value: "Terminal de transporte", label: "Terminal de transporte" },
    { value: "Tunel", label: "Túnel" },
    { value: "Universidad", label: "Universidad" },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid sm:grid-row-1 md:grid-cols-[1fr_auto] items-center gap-4">
        <div className="grid sm:grid-row-1 md:grid-cols-[1fr_auto] items-center gap-2">
          <Combobox
            placeholder="Seleccione una obra"
            options={options}
            onChange={(value: string | null) => setSelectedOption(value || "")}
            value={selectedOption}
          />
          <Combobox
            placeholder="Tipo de obra"
            options={optionIcon}
            onChange={(value: string | null) => setObraType(value || "")}
            value={obraType}
          />
        </div>

        <ButtonSave onClick={handleSaveClick} />
      </div>

      <div className="rounded-3xl overflow-hidden w-full h-full shadow-lg">
        <NewCoordinatesMap setPoints={setPoints} setProjectTypestyle={setProjectType} defaultLocation={defaultLocation}/>
      </div>

      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmSave}
        title="¿Estás seguro de guardar esta información?"
        description="Los datos guardados incluirán nombres y coordenadas"
        styleButton="bg-green-500 hover:bg-emerald-500"
      />
    </div>
  );
}
