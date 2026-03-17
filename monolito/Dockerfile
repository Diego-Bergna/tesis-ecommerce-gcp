# ==========================================
# Etapa 1: Compilación (Builder)
# ==========================================
FROM node:24-alpine AS builder

WORKDIR /app

# 1. Copiamos los archivos de dependencias y el esquema de Prisma
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# 2. Instalamos TODAS las dependencias (incluyendo las de desarrollo)
RUN yarn install --frozen-lockfile

# 3. Generamos el Prisma Client
RUN yarn prisma generate

# 4. Copiamos el resto del código fuente
COPY . .

# 5. Compilamos la aplicación de NestJS a JavaScript puro
RUN yarn build

# ==========================================
# Etapa 2: Producción (Runner)
# ==========================================
FROM node:24-alpine

WORKDIR /app

# 1. Copiamos solo los archivos necesarios para instalar dependencias
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# 2. Instalamos SOLO las dependencias de producción (más ligero)
RUN yarn install --production --frozen-lockfile

# 3. Generamos el Prisma Client para esta nueva imagen
RUN yarn prisma generate

# 4. Traemos la carpeta 'dist' (código compilado) desde la Etapa 1
COPY --from=builder /app/dist ./dist

# 5. Exponemos el puerto que usa nuestra app
EXPOSE 3000

# 6. Comando para encender el servidor en modo producción
CMD ["node", "dist/src/main.js"]