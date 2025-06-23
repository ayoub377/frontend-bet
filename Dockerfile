# --- Étape 1: Le Builder (pour construire l'application) ---
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances et les installer
COPY package*.json ./
RUN npm install

# Copier le reste du code de l'application
COPY . .

# --- IMPORTANT ---
# We will pass the API URL from docker-compose during the build step.
# This makes it more flexible than hardcoding it here.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Construire l'application Next.js pour la production
RUN npm run build

# --- Étape 2: Le Runner (pour servir l'application construite) ---
FROM node:18-alpine

WORKDIR /app

# --- ADDED THESE LINES ---
# Copier les fichiers de production depuis l'étape "builder"
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exposer le port sur lequel Next.js s'exécute
EXPOSE 3000

# --- ADDED THIS LINE ---
# Commande pour démarrer le serveur de production Next.js
CMD ["npm", "start"]
