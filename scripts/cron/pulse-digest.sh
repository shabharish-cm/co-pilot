#!/bin/bash
# Weekly pulse digest generator — runs every Thursday at 12:00 PM IST via launchd
# Reads normalized transcripts from the Thu–Wed window, runs /pulse skill

set -euo pipefail

REPO="/Users/shabharish/Documents/CM/Co-Pilot"
LOG="$REPO/logs/cron-pulse.log"
CLAUDE="/opt/homebrew/bin/claude"

mkdir -p "$REPO/logs"

{
  echo "==== $(date '+%Y-%m-%d %H:%M:%S %Z') — weekly pulse digest starting ===="

  cd "$REPO"

  # Pull latest transcripts and state
  git pull --rebase --autostash
  echo "git pull done"

  # Run the /pulse skill with full tool permissions (non-interactive)
  "$CLAUDE" --dangerously-skip-permissions -p "/pulse"

  echo "==== done ===="
} >> "$LOG" 2>&1
