#!/bin/bash
# Paso 7: Crear la imagen Docker
docker build -t obras-app .

# Paso 8: Verificar si el contenedor ya existe
EXISTING_CONTAINER=$(docker ps -aq -f name=obras-app)
if [ -n "$EXISTING_CONTAINER" ]; then
    echo "El contenedor existente será detenido y eliminado."
    docker stop $EXISTING_CONTAINER
    docker rm $EXISTING_CONTAINER
fi
# Paso 9: Levantar el contenedor Docker usando el archivo .env ya existente
docker run -d -p $PUERTO:$PUERTO --name obras-app --env-file .env obras-app

if [[ $? -eq 0 ]]; then
    echo "Contenedor Docker levantado correctamente en el puerto $PUERTO"
else
    echo "Error al levantar el contenedor Docker."
    exit 1
fi

# Paso 10: Reiniciar el contenedor para aplicar la configuración de Nginx y SSL
docker restart obras-app-$PUERTO

echo "El contenedor ha sido reiniciado con la configuración de SSL y el puerto $PUERTO"

# Paso 11: Verificar que los certificados están bien configurados en el contenedor
echo "Verificando configuración de SSL dentro del contenedor..."
docker exec obras-app-$PUERTO openssl s_client -connect $IP_LOCAL:$PUERTO -showcerts

echo "Despliegue completado. 🚀"
