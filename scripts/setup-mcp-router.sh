#!/usr/bin/env bash
set -euo pipefail

if claude mcp list 2>/dev/null | grep -q "mcp-router"; then
    echo "mcp-router is already configured."
else
    echo -n "Enter your MCPR_TOKEN: "
    read -rs token
    echo
    claude mcp add mcp-router --env MCPR_TOKEN="$token" -- npx -y @mcp_router/cli@0.2.0 connect
    echo "mcp-router has been added successfully."
fi
