#!/bin/sh
# Script de startup para Railway
# Aguarda o banco estar pronto, roda migrations e inicia a aplicação

echo "🔄 Waiting for database to be ready..."
node scripts/wait-for-db.js

if [ $? -ne 0 ]; then
  echo "❌ Failed to connect to database. Exiting."
  exit 1
fi

echo "🔄 Running database migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
  echo "❌ Migration failed. Exiting."
  exit 1
fi

echo "✅ Starting application..."
exec npm start

