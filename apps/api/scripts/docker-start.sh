#!/bin/sh
set -e

echo "Running database migrations..."
bun run migration:run

echo "Starting NestJS in watch mode..."
exec bun run dev
