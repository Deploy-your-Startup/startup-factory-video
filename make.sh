#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
case "${1:-run}" in
  install) npm ci ;;
  run) npm run dev -- --port 3100 ;;
  render) npm run render ;;
  format) npm run format ;;
  lint) npm run lint ;;
  poster) npm run still ;;
  *) echo "Usage: ./make.sh {install|run|render|format|lint|poster}" >&2; exit 1 ;;
esac
