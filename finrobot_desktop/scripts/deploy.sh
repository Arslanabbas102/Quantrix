#!/bin/bash
# Alpha Desk deploy helper — start/stop/status the web server.
# Usage: ./deploy.sh start | stop | status

set -euo pipefail

HOST="${ALPHA_DESK_HOST:-127.0.0.1}"
PORT="${ALPHA_DESK_PORT:-8321}"

case "${1:-help}" in
  start)
    echo "Starting Alpha Desk server on ${HOST}:${PORT}..."
    echo "WARNING: To expose to network, set ALPHA_DESK_HOST=0.0.0.0 (no authentication!)"
    uv run alpha_desk serve --host "$HOST" --port "$PORT" &
    echo "PID: $!"
    ;;
  stop)
    pkill -f "alpha_desk serve" && echo "Stopped." || echo "Not running."
    ;;
  status)
    pgrep -f "alpha_desk serve" > /dev/null && echo "Running" || echo "Stopped"
    ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    exit 1
    ;;
esac
