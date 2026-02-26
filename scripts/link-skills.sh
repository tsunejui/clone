#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$REPO_ROOT/.agents/skills"
DST_DIR="$REPO_ROOT/.claude/skills"

mkdir -p "$DST_DIR"

linked=0
skipped=0

for skill_path in "$SRC_DIR"/*/; do
  skill_name="$(basename "$skill_path")"
  link="$DST_DIR/$skill_name"
  # Relative target: from .claude/skills/<name> -> ../../.agents/skills/<name>
  target="../../.agents/skills/$skill_name"

  if [ -L "$link" ]; then
    echo "  skip (exists): $skill_name"
    ((skipped++)) || true
  else
    ln -s "$target" "$link"
    echo "  linked: $skill_name"
    ((linked++)) || true
  fi
done

echo ""
echo "Done: $linked linked, $skipped already existed."
