#!/usr/bin/env bash
# Import documents and assets into the Sanity production dataset.
# Reads project ID from .env so it targets whichever instance is configured.
# Usage: ./scripts/sanity/import.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
EXPORT_FILE="$SCRIPT_DIR/sanity-export.tar.gz"

if [ ! -f "$EXPORT_FILE" ]; then
  echo "Error: Export file not found at $EXPORT_FILE"
  echo "Run ./scripts/sanity/export.sh first."
  exit 1
fi

echo "Importing into Sanity production dataset..."
echo "(Using project ID from your sanity.config.ts / .env)"
echo ""

npx sanity dataset import "$EXPORT_FILE" --dataset production --replace

echo ""
echo "Import complete."
