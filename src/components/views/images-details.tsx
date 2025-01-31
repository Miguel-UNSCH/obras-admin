/* eslint-disable @next/next/no-img-element */
import MapLocationDeatils from "./map-location-details";

interface ImgProps {
  id: string;
  url: string;
  latitud: string | null;
  longitud: string | null;
  propietario_id: string;
  date: string;
}

interface LocationObra {
  projectType: string;
  points: [number, number][];
}

interface ImageDetallesProps {
  selectedImage: ImgProps;
  coordinates: LocationObra | null;
  closeModal: () => void;
}

function ImageDetalles({
  selectedImage,
  coordinates,
  closeModal,
}: ImageDetallesProps) {
  const latitude = selectedImage.latitud
    ? parseFloat(selectedImage.latitud)
    : null;
  const longitude = selectedImage.longitud
    ? parseFloat(selectedImage.longitud)
    : null;

  const date = new Date(selectedImage.date);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const formattedDate = localDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedTime = localDate.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-white dark:bg-background p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
      <h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-200 pb-4">
        Detalles de la Imagen
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <img
            src={selectedImage.url}
            alt={selectedImage.id}
            className="w-full h-52 md:h-64 object-cover rounded-md mb-3"
          />
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Latitud:</strong> {latitude ?? "No disponible"}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Longitud:</strong> {longitude ?? "No disponible"}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Fecha:</strong> {formattedDate}, {formattedTime}
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center">
          {latitude !== null && longitude !== null ? (
            <div className="w-full h-[250px] md:h-full min-w-[200px] min-h-[250px] rounded-lg overflow-hidden">
              <MapLocationDeatils
                longitude={longitude}
                latitude={latitude}
                coordinates={coordinates}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              📍 Ubicación no disponible
            </p>
          )}
        </div>
      </div>

      <button
        onClick={closeModal}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
      >
        Cerrar
      </button>
    </div>
  );
}

export default ImageDetalles;
