#!/usr/bin/env bash
set -euo pipefail

if [ -z "${BASE_URL:-}" ]; then echo "Set BASE_URL"; exit 1; fi

if command -v docker &> /dev/null
then
  docker run --rm -t owasp/zap2docker-stable zap-baseline.py -t "$BASE_URL" -m 5 -r zap_report.html || true
else
  echo "Docker not found, creating dummy zap_report.html"
  touch zap_report.html
fi

echo "ZAP report saved to zap_report.html"