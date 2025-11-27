FROM node:18-bullseye
#sadasda
WORKDIR /app

# Copy package files and Prisma schema (needed for postinstall hook)
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (including dev for Prisma CLI)
# This will run postinstall which generates Prisma Client
RUN npm ci

# Copy rest of source code
COPY . .

# Ensure Prisma Client is generated (redundant but safe)
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]