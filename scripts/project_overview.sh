#!/usr/bin/env bash
set -euo pipefail

OUT="PROJECT_OVERVIEW.md"
ROOT="$(pwd)"

has() { command -v "$1" >/dev/null 2>&1; }

# helpers
node_json() {
  node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8')); \
    const k=process.argv[1]; if(!k){console.log(JSON.stringify(p,null,2));process.exit(0)}; \
    let v=p; for(const part of k.split('.')){ v=v?.[part] }; \
    if(typeof v==='object') console.log(Object.keys(v||{}).join(', ')); else console.log(v||'');" "$1"
}

# detect paths
CLIENT_DIR="$(ls -d client 2>/dev/null || true)"
SERVER_DIR="$(ls -d server 2>/dev/null || true)"
SRC_DIR="$(ls -d src 2>/dev/null || true)"
SHARED_DIR="$(ls -d shared 2>/dev/null || true)"

# collect client routes (React Router v5/v6 patterns)
collect_client_routes() {
  local paths=()
  [ -n "$CLIENT_DIR" ] && paths+=("$CLIENT_DIR")
  [ -n "$SRC_DIR" ] && paths+=("$SRC_DIR")
  [ ${#paths[@]} -eq 0 ] && return

  if has rg; then
    rg -n --no-heading \
      -e "<Route[^>]*path=['\"]([^'\"]+)" \
      -e "path:\\s*['\"]([^'\"]+)['\"]" \
      "${paths[@]}" 2>/dev/null \
      | sed -E "s/.*path=.?[\"']([^\"']+).*/\1/; s/.*path:\\s*[\"']([^\"']+).*/\1/" \
      | sort -u
  else
    grep -RnoE "<Route[^>]*path=.|path:\\s*['\"]" "${paths[@]}" 2>/dev/null \
      | sed -E "s/.*path=.?[\"']([^\"']+).*/\1/; s/.*path:\\s*[\"']([^\"']+).*/\1/" \
      | sort -u
  fi
}

# collect server routes (Express router/app)
collect_server_routes() {
  if [ -z "$SERVER_DIR" ]; then return; fi
  if has rg; then
    {
      rg -n --no-heading -e "router\\.(get|post|put|patch|delete)\\s*\\(\\s*['\"]([^'\"]+)" "$SERVER_DIR" 2>/dev/null
      rg -n --no-heading -e "app\\.(get|post|put|patch|delete)\\s*\\(\\s*['\"]([^'\"]+)" "$SERVER_DIR" 2>/dev/null
    } | sed -E "s/.*router\\.([a-z]+)\\s*\\(\\s*['\"]([^'\"]+).*/\U\1 \2/; s/.*app\\.([a-z]+)\\s*\\(\\s*['\"]([^'\"]+).*/\U\1 \2/"
  else
    grep -RnoE "(router|app)\\.(get|post|put|patch|delete)\\(" "$SERVER_DIR" 2>/dev/null \
      | sed -E "s/.*router\\.([a-z]+)\\s*\\(\\s*['\"]([^'\"]+).*/\U\1 \2/; s/.*app\\.([a-z]+)\\s*\\(\\s*['\"]([^'\"]+).*/\U\1 \2/"
  fi | sort -u
}

# write report
{
  echo "# Project Overview"
  echo
  echo "Repo: \`$(basename "$ROOT")\`"
  echo "Name: \`$(node_json name)\`"
  echo "Version: \`$(node_json version)\`"
  echo
  echo "## Structure"
  tree_cmd=""
  if has tree; then tree_cmd="tree -L 2 -I 'node_modules|dist|build|.git'"; else tree_cmd="find . -maxdepth 2 -type d | grep -v -E 'node_modules|/.git|/dist|/build'"; fi
  eval "$tree_cmd" | sed 's/^/    /'
  echo
  echo "### Key Directories"
  [ -n "$CLIENT_DIR" ] && echo "- \`$CLIENT_DIR/\`: React SPA (pages, components, global styles)."
  [ -n "$SERVER_DIR" ] && echo "- \`$SERVER_DIR/\`: Express API (index.ts, routes/)."
  [ -n "$SHARED_DIR" ] && echo "- \`$SHARED_DIR/\`: TS contracts and cross-layer utilities."
  [ -n "$SRC_DIR" ] && echo "- \`$SRC_DIR/\`: Source root (if monofolder layout)."
  echo "- \`dist/\`: Production build outputs."
  echo
  echo "## Scripts"
  node_json scripts | awk -F, '{
    n=split($0,a,",");
    print "";
    for(i=1;i<=n;i++){ gsub(/^\s+|\s+$/,"",a[i]); if(a[i]!="") print "- " a[i] }
  }'
  echo
  echo "## Dependencies"
  echo "- deps: $(node_json dependencies)"
  echo "- devDeps: $(node_json devDependencies)"
  echo
  echo "## Environment Variables"
  if [ -f ".env.example" ]; then
    echo "From .env.example:"
    sed -E 's/=.*/=****/g' .env.example | sed 's/^/- `&`/' 
  else
    echo "Add \`.env.example\` to document required vars."
  fi
  echo
  echo "## Client Routes"
  CR=$(collect_client_routes || true)
  if [ -n "$CR" ]; then echo "$CR" | sed 's/^/- /'; else echo "- Not detected. Search for <Route> or router config."; fi
  echo
  echo "## Server Routes"
  SR=$(collect_server_routes || true)
  if [ -n "$SR" ]; then echo "$SR" | sed 's/^/- /'; else echo "- Not detected. Search Express handlers in \`server/routes\`."; fi
  echo
  echo "## Testing"
  if [ -f "vitest.config.ts" ] || grep -q '"vitest"' package.json 2>/dev/null; then
    echo "- Vitest present. Run \`npm test\`."
  else
    echo "- No explicit test config found."
  fi
  echo
  echo "## Build & Run"
  echo "- Dev: \`npm run dev\`"
  echo "- Prod build: \`npm run build\` then \`npm start\`"
} > "$OUT"

echo "Wrote $OUT"
