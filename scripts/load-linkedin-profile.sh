#!/usr/bin/env bash
set -euo pipefail

APP="apps/persona"
PROFILES_DIR="$APP/profiles"

# Find all YAML files
files=($(find "$PROFILES_DIR" -maxdepth 1 -name '*.yaml' -o -name '*.yml' | sort))

if [[ ${#files[@]} -eq 0 ]]; then
    echo "No profile YAML files found in $PROFILES_DIR/"
    exit 1
fi

# Build display labels (filename without path)
labels=()
for f in "${files[@]}"; do
    labels+=("$(basename "$f")")
done

selected=$(printf '%s\n' "${labels[@]}" | gum choose --header "Select a LinkedIn profile to load") || {
    echo "No selection made."
    exit 0
}

file="$PROFILES_DIR/$selected"
gum style --foreground 212 "▶ Loading profile: $selected"

cd "$APP" && npx tsx scripts/load-profile.ts "../../$file"
