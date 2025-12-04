FROM node:18-bullseye

WORKDIR /app

# Copy package files and Prisma schema (needed for postinstall hook)
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (including dev for Prisma CLI)
# This will run postinstall which generates Prisma Client
RUN npm install

# Copy rest of source code
COPY . .

# Ensure Prisma Client is generated (redundant but safe)
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Make startup script executable
RUN chmod +x scripts/start.sh

# Expose port
EXPOSE 3001

# Start the application (Railway will use startCommand from railway.json)
CMD ["npm", "start"]