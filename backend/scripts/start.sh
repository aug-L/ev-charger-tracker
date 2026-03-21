#!/bin/sh
set -e

echo "Starting backend initialization script..."

echo "Checking for DATABASE_URL environment variable..."
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL is not set in the environment. Migrations and connection may fail."
else
  echo "DATABASE_URL is set (length: ${#DATABASE_URL})."
fi

# Run migrations synchronously
echo "Running database migrations (npm run db:push)..."
if npm run db:push; then
  echo "Database migrations completed successfully."
else
  echo "ERROR: Database migrations failed. Please check your DATABASE_URL and connectivity."
  # Exit on failure to prevent the container from running in a broken state
  exit 1
fi

# Start the server
echo "Starting Node server..."
exec node src/server.js
