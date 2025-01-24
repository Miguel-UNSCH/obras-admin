import { Card, CardContent } from "@/components/ui/card";
import { FaUser, FaUserTimes, FaUserCheck } from "react-icons/fa";

interface Register {
  propietario_id: string;
  resident: string;
  cui: string;
  name: string;
  count: number;
}

export default function RegistrosContainer({
  registros,
}: {
  registros: Register[];
}) {
  return (
    <div className="space-y-4">
      {registros.map((registro, index) => (
        <RegistroItem key={index} registro={registro} />
      ))}
    </div>
  );
}

function RegistroItem({ registro }: { registro: Register }) {
  return (
    <Card className="mb-4">
      <CardContent className="flex flex-col md:flex-row items-center p-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center justify-center space-x-3 w-full md:w-1/12">
          <div className="flex flex-col items-center justify-center">
            <FaUser
              className="text-4xl text-teal-600 dark:text-teal-400"
              aria-label="Usuario"
            />
            <h2 className="text-sm text-center font-semibold text-gray-800 dark:text-gray-100">
              {registro.resident}
            </h2>
          </div>
        </div>

        <div className="text-center flex-1 items-center justify-center border-l-2 pl-4 w-full md:w-1/12">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>CUI</strong>
          </p>
          <div className="text-lg">{registro.cui}</div>
        </div>

        <div className="flex items-center border-l-2 pl-4 w-full md:w-8/12">
          <p className="text-sm text-justify text-gray-600 dark:text-gray-300">
            {registro.name}
          </p>
        </div>

        <div className="text-center flex-1 items-center font-semibold justify-center border-l-2 pl-4 w-full md:w-2/12">
          {registro.count === 0 ? (
            <div className="flex items-center justify-center space-x-2">
              <FaUserTimes className="text-red-600" aria-label="Pendiente" />
              <span className="text-red-700">Pendiente</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <FaUserCheck
                className="text-green-400"
                aria-label="Actualizado"
              />
              <span className="text-green-600">Actualizado</span>
            </div>
          )}
          <p className="text-sm text-gray-600  dark:text-gray-300">
            Imágenes: {registro.count}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
