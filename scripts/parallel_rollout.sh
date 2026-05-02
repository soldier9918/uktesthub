#!/usr/bin/env bash
# Run bank+assemble+validate for many topics in parallel batches.
# Usage: ./parallel_rollout.sh <parallelism> topic1 topic2 ...
set -uo pipefail
cd "$(dirname "$0")/.."
P="${1:-4}"; shift
LOGDIR=/tmp/rollout-logs
mkdir -p "$LOGDIR"

PYBIN="$(command -v python3 || command -v python)"

run_topic() {
  local t="$1"
  local log="$LOGDIR/$t.log"
  {
    echo "=== START $(date -u +%H:%M:%S) $t ==="
    "$PYBIN" -u scripts/generate_mocks.py bank --topic "$t" --delay 1
    "$PYBIN" -u scripts/generate_mocks.py assemble --topic "$t"
    "$PYBIN" -u scripts/generate_mocks.py validate --topic "$t"
    echo "=== DONE  $(date -u +%H:%M:%S) $t ==="
  } > "$log" 2>&1
}

# Simple parallelism via job control (avoids xargs/export-f quirks)
running=0
for t in "$@"; do
  run_topic "$t" &
  running=$((running+1))
  if (( running >= P )); then
    wait -n
    running=$((running-1))
  fi
done
wait
echo "All done."
