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

EXPOSE 3003

CMD ["sh", "-c", "nginx && npm start"]
