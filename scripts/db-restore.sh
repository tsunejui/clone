#!/usr/bin/env bash
set -euo pipefail

APP=${1:?Usage: db-restore.sh APP [version]}
VERSION=${2:-}

# Resolve DATABASE_URL → absolute path (same logic as start.sh)
if [ ! -f "$APP/.env" ]; then
    echo "Error: $APP/.env not found" >&2
    exit 1
fi

DB_URL=$(grep -E '^DATABASE_URL=' "$APP/.env" | head -1 | sed 's/^DATABASE_URL=//' | tr -d '"')
DB_REL=${DB_URL#file:}
if [ "$DB_REL" != "$DB_URL" ]; then
    PRISMA_DIR=$(cd "$APP/prisma" && pwd)
    DB_PATH="$PRISMA_DIR/${DB_REL#./}"
else
    DB_PATH=$DB_URL
fi

BACKUP_DIR="$APP/backups"

if [ -n "$VERSION" ]; then
    BACKUP="$BACKUP_DIR/$VERSION.db"
    if [ ! -f "$BACKUP" ]; then
        echo "Error: backup not found: $BACKUP" >&2
        exit 1
    fi
else
    # Interactive selection
    BACKUPS=("$BACKUP_DIR"/*.db)
    if [ ! -f "${BACKUPS[0]}" ]; then
        echo "No backups found in $BACKUP_DIR" >&2
        exit 1
    fi

    echo "Available backups:"
    for i in "${!BACKUPS[@]}"; do
        FILE=${BACKUPS[$i]}
        NAME=$(basename "$FILE" .db)
        SIZE=$(ls -lh "$FILE" | awk '{print $5}')
        echo "  $((i + 1))) $NAME ($SIZE)"
    done

    printf "\nSelect backup [1-%d]: " "${#BACKUPS[@]}"
    read -r CHOICE

    if ! [[ "$CHOICE" =~ ^[0-9]+$ ]] || [ "$CHOICE" -lt 1 ] || [ "$CHOICE" -gt "${#BACKUPS[@]}" ]; then
        echo "Invalid selection" >&2
        exit 1
    fi

    BACKUP="${BACKUPS[$((CHOICE - 1))]}"
fi

# Auto-backup current DB before restoring
if [ -f "$DB_PATH" ]; then
    mkdir -p "$BACKUP_DIR"
    PRE="$BACKUP_DIR/$(date +%Y%m%d-%H%M%S)-pre-restore.db"
    cp "$DB_PATH" "$PRE"
    echo "Current DB backed up to: $PRE"
fi

cp "$BACKUP" "$DB_PATH"
echo "Restored from: $(basename "$BACKUP" .db)"
