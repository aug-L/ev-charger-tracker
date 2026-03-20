#!/bin/sh
set -e

echo "Starting backend initialization script..."

# Function to run migrations in the background
run_migrations() {
  echo "Running database migrations (npm run db:push)..."
  if npm run db:push; then
    echo "Database migrations completed successfully."
  else
    echo "Error: Database migrations failed. Please check your DATABASE_URL and connectivity."
    # We don't exit here because we want the server to stay up for health checks
  fi
}

# Run migrations in the background
run_migrations &

# Start the server
echo "Starting Node server..."
exec node src/server.js
