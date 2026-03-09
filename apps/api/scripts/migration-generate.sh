#!/bin/sh
# Usage: bun run migration:generate <MigrationName>
# Example: bun run migration:generate AddProductTable
set -e

NAME="$1"

if [ -z "$NAME" ]; then
  echo "Error: Migration name is required."
  echo "Usage: bun run migration:generate <MigrationName>"
  echo "Example: bun run migration:generate AddProductTable"
  exit 1
fi

OUTPUT="src/database/migrations/$NAME"

echo "Generating migration: $OUTPUT"

TS_NODE_PROJECT=tsconfig.cli.json bun x typeorm-ts-node-commonjs \
  migration:generate "$OUTPUT" \
  -d src/database/data-source.ts
