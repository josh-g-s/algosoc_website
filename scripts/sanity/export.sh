#!/usr/bin/env bash
# Export all documents and assets from the Sanity production dataset.
# Usage: ./scripts/sanity/export.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
EXPORT_FILE="$SCRIPT_DIR/sanity-export.tar.gz"

echo "Exporting Sanity production dataset..."
npx sanity dataset export production "$EXPORT_FILE"

echo ""
echo "Export saved to: $EXPORT_FILE"
