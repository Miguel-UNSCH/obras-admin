/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/buttons/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, OctagonAlert } from "lucide-react";
import { signInSchema } from "@/utils/zod/schemas";
import Image from "next/image";
import { ModeChange } from "./mode-change";

import * as motion from "motion/react-client";
import Link from "next/link";

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn({
  onSubmit,
  serverError,
  status,
}: {
  onSubmit: (values: SignInFormValues) => void;
  serverError?: string;
  status?: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showServerError, setShowServerError] = useState(!!serverError);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: SignInFormValues) => {
    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
    setShowServerError(true); // Muestra el error del servidor si ocurre
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      if (showServerError) {
        setShowServerError(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, showServerError]);

  return (
    <div className="flex items-center justify-center h-screen bg-background px-4">
      <img
        src="https://affixtheme.com/html/xmee/demo/img/elements/shape1.png"
        alt="puntos"
        className="absolute top-0 left-0 h-full"
      />
      <img
        src="https://affixtheme.com/html/xmee/demo/img/elements/bg1.png"
        alt="manchita"
        className="absolute top-0 left-0"
      />
      <div className="relative container mx-auto h-full flex flex-col sm:flex-row items-center justify-between">
        <motion.div
          initial={{
            x: -200,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            delay: 0.4,
          }}
          className="relative z-10 flex flex-col justify-between h-full py-16"
        >
          <Link href="/">
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
          </Link>
          <div className="space-y-4 h-full flex flex-col justify-center max-w-72">
            <div className="font-bold text-center">
              <span className="text-4xl text-rose-500 dark:text-red-500">
                Iniciar Sesión
              </span>
              <br />
              <span className="text-2xl">GeObras</span>
            </div>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              <li>Organiza tus obras con un solo clic.</li>
              <li>Tus proyectos en un solo lugar.</li>
              <li>Explora, localiza y gestiona.</li>
            </ul>
          </div>
          <ModeChange horizontal />
        </motion.div>
        <motion.img
          initial={{
            scale: 0.1
          }}
          animate={{
            scale: 0.5,
            transform: "translate(-50%, -50%)",
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          src="./imagenes/portada.webp"
          alt="log"
          className="absolute top-1/2 left-1/2 z-1 -translate-x-1/2 -translate-y-1/2 w-1/2"
        />
        <div className="relative z-10 w-full max-w-sm">
          {showServerError && (
            <Alert
              className={`mb-4 ${
                status === 200
                  ? "border-green-500 bg-green-100"
                  : "border-red-500 bg-red-100"
              }`}
            >
              <AlertDescription
                className={`flex items-center gap-2 ${
                  status === 200 ? "text-green-500" : "text-red-500"
                }`}
              >
                <OctagonAlert />
                {serverError}
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="JPEREZ"
                        {...field}
                        className="h-12 rounded-xl bg-blue-50 dark:bg-gray-700"
                      />
                    </FormControl>
                    <FormMessage className="text-end" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="h-12 rounded-xl bg-blue-50 dark:bg-gray-700"
                          placeholder="**************"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="sr-only">
                            {showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-end" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
