/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { ModeChange } from "@/components/mode-change";
import ButtonInicio from "@/components/buttons/dynamic/button-inicio";
import ButtonTutorial from "@/components/buttons/dynamic/button-turorial";
import TextAnimate from "@/components/ui/text-animate";

export default function LandingPage() {
  return (
    <div className="relative flex h-screen w-screen">
      <div className="flex-1 h-full w-full absolute top-0 left-0 z-1">
        <div className="absolute z-2 w-1/2 h-full top-0 left-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-black dark:via-black/70"></div>
        <img
          className="w-full h-full"
          src="https://res.cloudinary.com/dmr9ef5cl/image/upload/v1737646188/pexels-pixabay-461789_oeszyd.jpg"
          alt="Logo claro"
        />
      </div>

      <nav className="absolute top-0 left-0 right-0 container mx-auto px-4 py-6 flex items-center justify-between bg-transparent z-10">
        <div className="flex items-center">
          <Image
            src="/logos/inicio_claro.png"
            alt="Logo claro"
            width={250}
            height={32}
            className="cursor-pointer dark:hidden"
          />
          <Image
            src="/logos/inicio_oscuro.png"
            alt="Logo oscuro"
            width={250}
            height={32}
            className="cursor-pointer hidden dark:block"
          />
        </div>
        <ModeChange horizontal />
      </nav>
      <div className="relative z-8 flex-1 flex items-center justify-center py-12 px-4 md:px-8">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
              Bienvenido a <br />
              <span className="text-primary">GeoObras</span>
            </h1>
            <h2 className="text-black dark:text-white">
              La solución ideal para{" "}
              <span className="font-bold">documentar y gestionar obras</span>
            </h2>
            <span className="text-orange-400 font-bold text-4xl">
              <TextAnimate
                textList={[
                  "registra la asistencia fácilmente",
                  "captura evidencia en tiempo real",
                  "organiza tus reportes al instante",
                  "optimiza y asegura resultados",
                  "¡GeoObras es tu mejor aliado!",
                ]}
              />
            </span>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              <span className="text-primary font-bold">
                ¡Optimiza tu control y asegura resultados!
              </span>
            </p>

            <div className="flex justify-center md:justify-start items-center space-x-4 mt-4">
              <ButtonInicio />
              <ButtonTutorial />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
