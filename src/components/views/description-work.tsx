"use client";

import {
  FaBarcode,
  FaCogs,
  FaUserAlt,
  FaChartArea,
  FaHeartbeat,
  FaHeartBroken,
  FaUserEdit,
} from "react-icons/fa";

import { IoIosSend } from "react-icons/io";

import { useRouter } from "next/navigation";
import { Button } from "../buttons/button";
import { ActualizarResidenteO, FinalizarObra } from "@/actions/details-action";
import toasterCustom from "../toaster-custom";
import { useState } from "react";
import { ConfirmDialog } from "../dialog/dialog-confirm";

interface Obra {
  id: string;
  state: string;
  cui: string;
  name: string;
  areaOrLength: string | null;
  resident: string;
  projectType: string;
  propietario_id: string;
}

const DescriptionWork: React.FC<{ obra: Obra; resident: boolean }> = ({
  obra,
  resident,
}) => {
  const [showConfirmationModalU, setShowConfirmationModalU] = useState(false);
  const [showConfirmationModalF, setShowConfirmationModalF] = useState(false);

  const router = useRouter();

  const handlemensajeUpdate = () => {
    setShowConfirmationModalU(true);
  };

  const handleUpdateConfirmationModal = () => {
    setShowConfirmationModalU(false);
  };

  const handlemensajeFinalizar = () => {
    setShowConfirmationModalF(true);
  };

  const handleFinalizarConfirmationModal = () => {
    setShowConfirmationModalF(false);
  };

  const updateResident = async () => {
    try {
      const res = await ActualizarResidenteO(
        obra.id,
        obra.propietario_id,
        obra.cui
      );
      handleUpdateConfirmationModal();
      toasterCustom(res.status, res.message);
      if (res.status === 200) {
        router.push("/dashboard");
      }
    } catch {
      toasterCustom(400, "Error al acrualizar al residente");
    }
  };

  const confirmationFinalizar = async () => {
    try {
      const response = await FinalizarObra(obra.id, obra.cui);

      toasterCustom(response.status, response.message);

      router.push("/dashboard");
    } catch {
      toasterCustom(400, "Error al finalizar la obra");
    }
  };

  return (
    <div className="flex flex-col justify-center h-full p-6 gap-2 bg-white dark:bg-gray-800 shadow-lg">
      <p className="font-bold text-gray-900 dark:text-white text-justify p-4 text-sm">
        {obra.name}
      </p>
      <div className="grid grid-cols-1">
        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          <FaCogs className="text-lg text-blue-500" />
          <p className="font-medium">Tipo de Proyecto:</p>
          <span>{obra.projectType}</span>
        </div>

        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          <FaBarcode className="text-lg text-green-500" />
          <p className="font-medium">Código CUI:</p>
          <span>{obra.cui}</span>
        </div>

        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          <FaUserAlt className="text-lg text-yellow-500" />
          <p className="font-medium">Residente:</p>
          <span>{obra.resident}</span>
        </div>

        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          <FaChartArea className="text-lg text-purple-500" />
          <p className="font-medium">Medida Aproximada:</p>
          <span>{obra.areaOrLength}</span>
        </div>

        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          {obra.state === "ejecucion" ? (
            <>
              <FaHeartbeat className="text-lg text-green-500" />
              <p className="font-medium">Estado:</p>
              <span>En {obra.state}</span>
            </>
          ) : (
            <>
              <FaHeartBroken className="text-lg text-red-500" />
              <p className="font-medium">Estado:</p>
              <span>{obra.state}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center sm:justify-end space-x-2">
        {resident && (
          <Button
            className="bg-[#03BB85] hover:bg-[#67DDBD]"
            onClick={handlemensajeUpdate}
          >
            <FaUserEdit /> Actualizar
          </Button>
        )}

        {obra.state === "ejecucion" && (
          <Button
            onClick={handlemensajeFinalizar}
            className="bg-fuchsia-900 hover:bg-fuchsia-700"
          >
            <IoIosSend /> Finalizar
          </Button>
        )}
      </div>
      <ConfirmDialog
        isOpen={showConfirmationModalU}
        onClose={handleUpdateConfirmationModal}
        onConfirm={updateResident}
        title="¿Estas seguro de desea actualizar al residente?"
        description="Los datos serán del anterior residente se mantendran guardadas, incluyendo fotos, reportes y otros elementos importantes."
        styleButton="bg-[#03BB85] hover:bg-[#42D0A8]"
      />

      <ConfirmDialog
        isOpen={showConfirmationModalF}
        onClose={handleFinalizarConfirmationModal}
        onConfirm={confirmationFinalizar}
        title="¿Estas seguro de desea Finalizar esta obra?"
        description="Una vez finalizado la obra no habra vuelta atras"
        styleButton="bg-fuchsia-900 hover:bg-fuchsia-700"
      />
    </div>
  );
};

export default DescriptionWork;
