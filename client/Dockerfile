FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3000

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Changer le propriétaire des fichiers
RUN chown -R nodejs:nodejs /app
USER nodejs

# Commande de démarrage
CMD ["npm", "start"]
