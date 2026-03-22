#!/bin/bash
# Morning digest generator — runs at 9:00 AM IST daily via launchd
# Pulls latest state (written by GitHub Actions at 6 AM IST), then runs /morning skill

set -euo pipefail

REPO="/Users/shabharish/Documents/CM/Co-Pilot"
LOG="$REPO/logs/cron-morning.log"
CLAUDE="/opt/homebrew/bin/claude"

mkdir -p "$REPO/logs"

{
  echo "==== $(date '+%Y-%m-%d %H:%M:%S %Z') — morning digest starting ===="

  cd "$REPO"

  # Pull latest state committed by GitHub Actions morning sync (runs at 6 AM IST)
  git pull --rebase --autostash
  echo "git pull done"

  # Run the /morning skill with full tool permissions (non-interactive)
  "$CLAUDE" --dangerously-skip-permissions -p "/morning"

  echo "==== done ===="
} >> "$LOG" 2>&1
