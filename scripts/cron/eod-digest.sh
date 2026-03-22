#!/bin/bash
# EOD digest generator — runs at 6:00 PM IST daily via launchd
# Pulls latest state (written by GitHub Actions evening sync), then runs /eod skill

set -euo pipefail

REPO="/Users/shabharish/Documents/CM/Co-Pilot"
LOG="$REPO/logs/cron-eod.log"
CLAUDE="/opt/homebrew/bin/claude"

mkdir -p "$REPO/logs"

{
  echo "==== $(date '+%Y-%m-%d %H:%M:%S %Z') — EOD digest starting ===="

  cd "$REPO"

  # Pull latest state committed by GitHub Actions evening sync
  git pull --rebase --autostash
  echo "git pull done"

  # Run the /eod skill with full tool permissions (non-interactive)
  "$CLAUDE" --dangerously-skip-permissions -p "/eod"

  echo "==== done ===="
} >> "$LOG" 2>&1
