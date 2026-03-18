FROM node:20-slim

WORKDIR /app

# Nur package-Dateien kopieren, dann installieren
COPY package.json package-lock.json* ./

# Install mit optional deps + lightningcss neu bauen
RUN npm install --include=optional \
  && npm rebuild lightningcss

# Rest des Codes kopieren
COPY . .

EXPOSE 3000
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
