#!/usr/bin/env bash
set -euo pipefail
OUT="ROUTES.md"
CLIENT_DIR="$(ls -d client 2>/dev/null || true)"
SRC_DIR="$(ls -d src 2>/dev/null || true)"
SERVER_DIR="$(ls -d server 2>/dev/null || true)"
has(){ command -v "$1" >/dev/null 2>&1; }

collect_client() {
  local paths=(); [ -n "$CLIENT_DIR" ] && paths+=("$CLIENT_DIR"); [ -n "$SRC_DIR" ] && paths+=("$SRC_DIR"); [ ${#paths[@]} -eq 0 ] && return
  if has rg; then
    rg -n --no-heading -e "<Route[^>]*path=['\"]([^'\"]+)" -e "path:\\s*['\"]([^'\"]+)['\"]" "${paths[@]}" 2>/dev/null \
    | sed -E "s/.*path=.?[\"']([^\"']+).*/\1/; s/.*path:\\s*[\"']([^\"']+).*/\1/" | sort -u
  else
    grep -RnoE "<Route[^>]*path=.|path:\\s*['\"]" "${paths[@]}" 2>/dev/null \
    | sed -E "s/.*path=.?[\"']([^\"']+).*/\1/; s/.*path:\\s*[\"']([^\"']+).*/\1/" | sort -u
  fi
}
collect_server() {
  [ -z "$SERVER_DIR" ] && return
  if has rg; then
    {
      rg --no-heading --no-filename -o -e "router\\.(get|post|put|patch|delete)\\s*\\(\\s*['\"]([^'\"]+)" --replace 'router.$1:$2' "$SERVER_DIR" 2>/dev/null || true
      rg --no-heading --no-filename -o -e "app\\.(get|post|put|patch|delete)\\s*\\(\\s*['\"]([^'\"]+)" --replace 'app.$1:$2' "$SERVER_DIR" 2>/dev/null || true
    } | awk -F':' '{ split($1, parts, "."); method = parts[2]; path=$2; for(i=3;i<=NF;i++) path=path":"$i; printf "%s %s\n", toupper(method), path }'
  else
    grep -RnoE "(router|app)\\.(get|post|put|patch|delete)\\(\\s*['\"]([^'\"]+)" "$SERVER_DIR" 2>/dev/null \
      | sed -E "s/.*(router|app)\.([a-z]+).*['\"]([^'\"]+).*/\2:\3/" \
      | awk -F':' '{ printf "%s %s\n", toupper($1), $2 }'
  fi | sort -u
}
{
  echo "# Routes"
  echo "## Client"
  CR=$(collect_client || true); [ -n "${CR:-}" ] && echo "$CR" | sed 's/^/- /' || echo "- none detected"
  echo; echo "## Server"
  SR=$(collect_server || true); [ -n "${SR:-}" ] && echo "$SR" | sed 's/^/- /' || echo "- none detected"
} > "$OUT"
echo "Wrote $OUT"
