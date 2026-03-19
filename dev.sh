#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

SERVICE="ssp-mobile-dev"
PORT="${PORT:-19000}"

echo "[dev] build & up"
docker compose up -d --build

echo "[dev] fix permissions (best-effort)"
docker compose exec --user root "$SERVICE" bash -lc "chown -R 1000:1000 /home/node/.npm 2>/dev/null || true"
docker compose exec --user root "$SERVICE" bash -lc "chown -R 1000:1000 /workspace/node_modules /workspace/package-lock.json 2>/dev/null || true"

echo "[dev] install deps (if needed)"
docker compose exec "$SERVICE" bash -lc "test -d node_modules || npm i"

echo "[dev] start expo (LAN) on port ${PORT}"
exec docker compose exec "$SERVICE" bash -lc "npx expo start --lan --port ${PORT}"

