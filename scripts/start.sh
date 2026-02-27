#!/usr/bin/env bash
set -euo pipefail

APP=$1
PID=$2
LOG=$3

if [ -f "$PID" ] && kill -0 "$(cat "$PID")" 2>/dev/null; then
    echo "Already running (PID $(cat "$PID"))"
else
    (cd "$APP" && exec npx next dev) > "$LOG" 2>&1 &
    echo $! > "$PID"
    sleep 1
    echo "Started (PID $(cat "$PID"))"
fi
