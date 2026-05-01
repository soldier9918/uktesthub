#!/usr/bin/env bash
# Driver: roll the v2 pipeline across topics.
# Args: migrate | bank | assemble | full   topic1 topic2 ...
set -uo pipefail
cd "$(dirname "$0")/.."
mode="$1"; shift
for t in "$@"; do
  echo "=========================================="
  echo "TOPIC: $t  (mode=$mode)"
  echo "=========================================="
  case "$mode" in
    migrate)
      python scripts/generate_mocks.py migrate-legacy --topic "$t" || echo "migrate failed: $t"
      ;;
    bank)
      python scripts/generate_mocks.py bank --topic "$t" --delay 1 || echo "bank failed: $t"
      ;;
    assemble)
      python scripts/generate_mocks.py assemble --topic "$t" || echo "assemble failed: $t"
      python scripts/generate_mocks.py validate --topic "$t" || true
      ;;
    full)
      python scripts/generate_mocks.py bank --topic "$t" --delay 1 && \
      python scripts/generate_mocks.py assemble --topic "$t" && \
      python scripts/generate_mocks.py validate --topic "$t" || echo "full failed: $t"
      ;;
    full-migrate)
      python scripts/generate_mocks.py migrate-legacy --topic "$t" 2>/dev/null || true
      python scripts/generate_mocks.py bank --topic "$t" --delay 1 && \
      python scripts/generate_mocks.py assemble --topic "$t" && \
      python scripts/generate_mocks.py validate --topic "$t" || echo "full-migrate failed: $t"
      ;;
  esac
done
