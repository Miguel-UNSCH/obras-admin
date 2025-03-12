/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Image from "next/image";
import ImageDetalles from "./images-details";

interface ImgProps {
  id: string;
  url: string;
  latitud: string | null;
  longitud: string | null;
  propietario_id: string;
  date: Date;
}

interface LocationObra {
  projectType: string;
  points: [number, number][];
}

interface ImagesContainerProps {
  imgs: ImgProps[] | null;
  type_points_obra: LocationObra | null;
}

export default function ImageWork({ imgs, type_points_obra }: ImagesContainerProps) {
  const [selectedImage, setSelectedImage] = useState<ImgProps | null>(null);

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (!imgs || imgs.length === 0) {
    return (
      <div className="p-4 gap-4 text-center text-cyan-900 dark:text-teal-400 flex flex-col h-full justify-center items-center">
        <p className="text-gray-800 dark:text-gray-400 font-semibold text-xl">
          No se encontraron imágenes
        </p>
        <Image
          src="/imagenes/not_image.png"
          alt="NotImage"
          width={300}
          height={200}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-0">
      {imgs.map((img) => (
        <div
          key={img.id}
          className="h-60 w-full bg-slate-300 rounded-lg overflow-hidden shadow-md cursor-pointer"
          onClick={() => setSelectedImage(img)}
        >
          <img
            src={img.url || ""}
            alt={img.id}
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        </div>
      ))}

      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-6">
          <ImageDetalles
            selectedImage={selectedImage}
            type_points_obra={type_points_obra}
            closeModal={closeModal}
          />
        </div>
      )}
    </div>
  );
}

