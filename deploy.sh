#!/bin/bash

# Paso 1: Obtener la IP local
IP_LOCAL=$(hostname -I | awk '{print $1}')
echo "IP local detectada: $IP_LOCAL"

# Paso 2: Pedir el puerto para exponer la aplicación
read -p "Introduce el puerto para exponer la aplicación (por ejemplo, 3084): " PUERTO
if ! [[ $PUERTO =~ ^[0-9]+$ ]]; then
    echo "Error: El puerto debe ser un número válido."
    exit 1
fi
echo "El puerto de exposición será: $PUERTO"

# Paso 3: Verificar si los certificados y el archivo .env existen
if [[ ! -f "wildcard.crt" || ! -f "wildcard.key" || ! -f "wildcard.ca_bundle" ]]; then
    echo "Error: Los certificados SSL no están presentes en el directorio actual."
    exit 1
fi

if [[ ! -f ".env" ]]; then
    echo "Error: El archivo .env no está presente en el directorio actual."
    exit 1
fi

# Paso 4: Escribir la configuración de Nginx (solo HTTPS)
cat <<EOF > nginx.conf
events {
    worker_connections 1024;  # Número máximo de conexiones por worker
}

http {
    client_max_body_size 30M;  # Permitir archivos grandes
    server {
        listen $PUERTO ssl;
        server_name $IP_LOCAL;

        ssl_certificate /etc/ssl/certs/wildcard.crt;
        ssl_certificate_key /etc/ssl/private/wildcard.key;
        ssl_trusted_certificate /etc/ssl/certs/wildcard.ca_bundle;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:AES128-GCM-SHA256:...';

        location / {
            proxy_pass http://localhost:3000;
            proxy_set_header Host \$http_host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            proxy_set_header X-Forwarded-Port \$server_port;
        }
    }
}
EOF

echo "Archivo nginx.conf generado para el servidor con la IP: $IP_LOCAL y el puerto: $PUERTO"

# Paso 5: Crear el Dockerfile
cat <<EOF > Dockerfile
# Dockerfile

# 1. Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar los archivos necesarios
COPY prisma ./prisma
COPY package*.json ./ 
COPY .env .env
RUN apk add --no-cache openssl
RUN npm install -g prisma && npm install --legacy-peer-deps
COPY . .

RUN npm run build

# 2. Etapa de producción
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl nginx nano
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./ 

COPY nginx.conf /etc/nginx/nginx.conf

# Crear directorios para certificados
RUN mkdir -p /etc/ssl/certs /etc/ssl/private

COPY wildcard.crt /etc/ssl/certs/wildcard.crt
COPY wildcard.key /etc/ssl/private/wildcard.key
COPY wildcard.ca_bundle /etc/ssl/certs/wildcard.ca_bundle

EXPOSE $PUERTO

CMD ["sh", "-c", "nginx && npm start"]
EOF

echo "Dockerfile generado con el puerto $PUERTO"

# Paso 6: Crear la imagen Docker
docker build -t obras-app-$PUERTO .

# Paso 7: Verificar si el contenedor ya existe
EXISTING_CONTAINER=$(docker ps -aq -f name=obras-app-$PUERTO)
if [ -n "$EXISTING_CONTAINER" ]; then
    echo "El contenedor existente será detenido y eliminado."
    docker stop $EXISTING_CONTAINER
    docker rm $EXISTING_CONTAINER
fi

# Paso 8: Levantar el contenedor Docker usando el archivo .env ya existente
docker run -d -p $PUERTO:$PUERTO --name obras-app-$PUERTO --env-file .env obras-app-$PUERTO

if [[ $? -eq 0 ]]; then
    echo "Contenedor Docker levantado correctamente en el puerto $PUERTO"
else
    echo "Error al levantar el contenedor Docker."
    exit 1
fi

# Paso 9: Reiniciar el contenedor para aplicar la configuración de Nginx y SSL
docker restart obras-app-$PUERTO

echo "El contenedor ha sido reiniciado con la configuración de SSL y el puerto $PUERTO"
