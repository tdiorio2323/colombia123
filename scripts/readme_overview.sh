#!/usr/bin/env bash
set -euo pipefail
OUT="README.md"
# strip a leading H1 from PROJECT_OVERVIEW.md to avoid duplicate headers
OV="$(sed -n '1,120p' PROJECT_OVERVIEW.md | sed '1{/^# Project Overview$/d;}' )"
RT="$(sed -n '1,200p' ROUTES.md)"
AG=$( [ -f AGENTS.md ] && echo "- See [AGENTS.md](./AGENTS.md) for contributor rules." || echo "" )
{
  echo "# Project Overview"
  echo
  echo "$OV" | sed -n '1,80p'
  echo
  echo "## Routes Snapshot"
  echo "$RT"
  echo
  echo "$AG"
} > .README_OVERVIEW.block

# Replace between markers, or append if absent
BEGIN='<!-- BEGIN AUTO OVERVIEW -->'
END='<!-- END AUTO OVERVIEW -->'
{
  echo "$BEGIN"
  cat .README_OVERVIEW.block
  echo "$END"
} > .README_OVERVIEW.marked

if grep -q "$BEGIN" "$OUT" 2>/dev/null; then
  awk -v b="$BEGIN" -v e="$END" '
    BEGIN{inblk=0}
    index($0,b){print; system("cat .README_OVERVIEW.block"); inblk=1; next}
    index($0,e){print; inblk=0; next}
    !inblk{print}
  ' "$OUT" > .README_OVERVIEW.new && mv .README_OVERVIEW.new "$OUT"
else
  printf "\n%s\n" "$BEGIN" >> "$OUT"
  cat .README_OVERVIEW.block >> "$OUT"
  echo "$END" >> "$OUT"
fi

rm -f .README_OVERVIEW.block .README_OVERVIEW.marked
echo "Updated README.md"
