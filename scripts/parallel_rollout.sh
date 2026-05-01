#!/usr/bin/env bash
# Run bank+assemble+validate for many topics in parallel batches.
# Usage: ./parallel_rollout.sh <parallelism> topic1 topic2 ...
set -uo pipefail
cd "$(dirname "$0")/.."
P="${1:-4}"; shift
LOGDIR=/tmp/rollout-logs
mkdir -p "$LOGDIR"

run_one() {
  local t="$1"
  {
    echo "=== START $(date -u +%H:%M:%S) $t ==="
    python -u scripts/generate_mocks.py bank --topic "$t" --delay 1
    python -u scripts/generate_mocks.py assemble --topic "$t"
    python -u scripts/generate_mocks.py validate --topic "$t"
    echo "=== DONE $(date -u +%H:%M:%S) $t ==="
  } > "$LOGDIR/$t.log" 2>&1
}

export -f run_one
printf '%s\n' "$@" | xargs -n1 -P "$P" -I{} bash -c 'run_one "$@"' _ {}
