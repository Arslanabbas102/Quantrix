#!/bin/bash
# Quantrix deploy helper — start/stop/status the web server.
# Usage: ./deploy.sh start | stop | status

set -euo pipefail

HOST="${QUANTRIX_HOST:-127.0.0.1}"
PORT="${QUANTRIX_PORT:-8321}"

case "${1:-help}" in
  start)
    echo "Starting Quantrix server on ${HOST}:${PORT}..."
    echo "WARNING: To expose to network, set QUANTRIX_HOST=0.0.0.0 (no authentication!)"
    uv run quantrix serve --host "$HOST" --port "$PORT" &
    echo "PID: $!"
    ;;
  stop)
    pkill -f "quantrix serve" && echo "Stopped." || echo "Not running."
    ;;
  status)
    pgrep -f "quantrix serve" > /dev/null && echo "Running" || echo "Stopped"
    ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    exit 1
    ;;
esac
