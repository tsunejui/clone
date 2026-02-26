#!/usr/bin/env bash
set -euo pipefail

HEADER="${INTERACTIVE_HEADER:-Select an action}"

declare -a LABELS=()
declare -a COMMANDS=()

for item in "$@"; do
    LABELS+=("${item%%::*}")
    COMMANDS+=("${item##*::}")
done

OPTIONS=$(printf '%s\n' "${LABELS[@]}")

SELECTED=$(echo "$OPTIONS" | gum choose --header "$HEADER") || {
    echo "No selection made. Exiting."
    exit 0
}

if [[ -z "$SELECTED" ]]; then
    echo "No tasks selected. Exiting."
    exit 0
fi

while IFS= read -r label; do
    [[ -z "$label" ]] && continue
    for i in "${!LABELS[@]}"; do
        if [[ "${LABELS[$i]}" == "$label" ]]; then
            gum style --foreground 212 "▶ Running: $label"
            eval "${COMMANDS[$i]}"
            break
        fi
    done
done <<< "$SELECTED"
