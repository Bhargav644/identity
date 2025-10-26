#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting Identity Backend Container..."

# Step 1: Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until nc -z -v -w30 db 5432
do
  echo "⏳ Waiting for database connection at db:5432..."
  sleep 2
done
echo "✅ PostgreSQL is ready!"

# Step 2: Start the application
echo "🎉 Starting Node.js server..."
exec "$@"
