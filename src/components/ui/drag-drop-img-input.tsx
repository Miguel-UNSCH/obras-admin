import { useRef, useState } from "react";
import Image from "next/image";
import toasterCustom from "../toaster-custom";

interface DragDropImgInputProps {
  img: File | null; // Cambiado para reflejar el tipo correcto
  setImg: (img: File | null) => void; // Actualizado para aceptar `File` o `null`
  placeholderText?: string;
  onImgSelect?: (img: File) => void;
}

export default function DragDropImgInput({
  img,
  setImg,
  placeholderText = "Arrastra y suelta una imagen aquí o haz clic para seleccionar",
  onImgSelect,
}: DragDropImgInputProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = () => {
    wrapperRef.current?.classList.add("border-primary", "bg-primary/10");
  };

  const handleDragLeave = () => {
    wrapperRef.current?.classList.remove("border-primary", "bg-primary/10");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    wrapperRef.current?.classList.remove("border-primary", "bg-primary/10");
    const selectedImg = e.dataTransfer.files?.[0] ?? null;
    handleFile(selectedImg);
  };

  const handleFile = (file: File | null) => {
    if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setImg(file); // Actualiza el estado del archivo
      onImgSelect?.(file); // Llama al callback si se proporciona
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toasterCustom(
        400,
        "Solo se permiten imágenes en formato PNG, JPG o JPEG."
      );
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImg = e.target.files?.[0] ?? null;
    handleFile(selectedImg);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full border-dashed border-2 rounded-lg flex items-center justify-center p-2 cursor-pointer ${
        img
          ? "border-primary"
          : "border-border hover:border-primary hover:bg-primary/10"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleInputChange}
      />
      <div className="text-center flex flex-col items-center justify-center">
        {img ? (
          <div className="text-center flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
              {img.name}
            </p>
            {preview && (
              <div className="relative mt-2 w-40 h-40 flex items-center justify-center overflow-hidden">
                <Image
                  src={preview}
                  alt="Vista previa"
                  layout="fill"
                  objectFit="contain"
                  className="rounded"
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              {placeholderText}
            </p>
            <p className="text-xs text-muted-foreground">
              Solo se permiten imágenes PNG, JPG o JPEG.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
