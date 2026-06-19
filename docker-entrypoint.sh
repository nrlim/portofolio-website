#!/bin/sh
set -e

echo "Menjalankan sinkronisasi schema database (Prisma db push)..."
# Menggunakan db push karena lebih aman untuk VPS setup cepat tanpa setup migrations foldering
npx prisma db push --accept-data-loss

echo "Memulai aplikasi Next.js..."
exec node server.js
