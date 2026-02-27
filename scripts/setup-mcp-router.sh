#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MCP_NAME="mcp-router"

# --- Select AI agents ---
CHOICE=$(gum choose \
    --header "Configure mcp-router for:" \
    "Claude Code" "Gemini" "Both") || true

if [[ -z "$CHOICE" ]]; then
    echo "No agents selected. Exiting."
    exit 0
fi

# --- Get token once ---
token=$(gum input --password --placeholder "paste token here" \
    --prompt "MCPR_TOKEN: ") || true

if [[ -z "$token" ]]; then
    echo "No token provided. Exiting."
    exit 1
fi

# --- Claude Code ---
configure_claude() {
    if claude mcp list 2>/dev/null | grep -q "$MCP_NAME"; then
        gum style --foreground 220 "  skip (exists): mcp-router already in Claude Code"
    else
        claude mcp add "$MCP_NAME" --env MCPR_TOKEN="$token" -- \
            npx -y @mcp_router/cli@0.2.0 connect
        gum style --foreground 212 "  linked: mcp-router → Claude Code"
    fi
}

# --- Gemini ---
configure_gemini() {
    if gemini mcp list 2>/dev/null | grep -q "$MCP_NAME"; then
        gum style --foreground 220 "  skip (exists): mcp-router already in Gemini"
    else
        gemini mcp add "$MCP_NAME" -e MCPR_TOKEN="$token" npx -y @mcp_router/cli@0.2.0 connect
        gum style --foreground 212 "  linked: mcp-router → Gemini (.gemini/settings.json)"
    fi
}

# --- Run ---
case "$CHOICE" in
    "Claude Code") gum style --bold "Configuring: Claude Code"; configure_claude ;;
    "Gemini")      gum style --bold "Configuring: Gemini";      configure_gemini ;;
    "Both")        gum style --bold "Configuring: Claude Code"; configure_claude
                   gum style --bold "Configuring: Gemini";      configure_gemini ;;
esac

echo ""
gum style --bold "Done."
