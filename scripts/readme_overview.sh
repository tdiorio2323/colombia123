#!/usr/bin/env bash
set -euo pipefail
OUT="README.md"
HDR=$'# Project Overview\n\n'
OV="$(sed -n '1,120p' PROJECT_OVERVIEW.md)"
RT="$(sed -n '1,200p' ROUTES.md)"
AG=$( [ -f AGENTS.md ] && echo "- See [AGENTS.md](./AGENTS.md) for contributor rules." || echo "" )
{
  echo "$HDR"
  echo "$OV" | sed -n '1,80p'
  echo
  echo "## Routes Snapshot"
  echo "$RT"
  echo
  echo "$AG"
} > .README_OVERVIEW.tmp
# insert or replace section in README.md
if grep -q '^# Project Overview$' "$OUT" 2>/dev/null; then
  awk 'BEGIN{p=1}/^# Project Overview$/{print;getline;<".README_OVERVIEW.tmp";p=0} p' .README_OVERVIEW.tmp "$OUT" > .README_OVERVIEW.new && mv .README_OVERVIEW.new "$OUT"
else
  cat .README_OVERVIEW.tmp >> "$OUT"
fi
rm .README_OVERVIEW.tmp
echo "Updated README.md"
