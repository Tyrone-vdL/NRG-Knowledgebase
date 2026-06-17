#!/usr/bin/env bash
# tools/deploy-sync.sh — two-way sync between GitHub (Tyrone-vdL/NRG-Knowledgebase)
# and the live droplet. Run every 15 min by the nrg-sync systemd timer.
#
#   • TELEMETRY PUSH (droplet → repo): a DISPOSABLE git worktree at $TELE on the
#     `droplet-telemetry` branch is reset to origin/main, overlaid with the live
#     bot's learning artifacts (bot-logs/feedback.jsonl, coverage-gaps-queue.md)
#     and any #ingest-merged wiki pages, then force-pushed. The LIVE checkout is
#     NEVER branch-switched, so the running bot is never disturbed.
#   • DEPLOY PULL (repo → live): fast-forward main into the live checkout, gated by
#     `node --check` + `node bot.js --dry-run`, with automatic rollback. Live ingest
#     drift is set aside first — it is already safe on droplet-telemetry by then.
#
# Any failure posts a one-line alert to #bot-ops so a broken loop is LOUD, not silent
# (the verified #1 death mode: telemetry silently stuck on the box == today's drift).
set -uo pipefail

LIVE=/opt/nrg-bot
TELE=/opt/nrg-telemetry
REMOTE="github-nrg:Tyrone-vdL/NRG-Knowledgebase.git"   # ssh config alias → nrg_deploy key
export GIT_SSH_COMMAND="ssh -o BatchMode=yes"
cd "$LIVE" || exit 1

LOG(){ echo "[deploy-sync $(date -u +%FT%TZ)] $*"; }
WEBHOOK="$(grep -E '^BOT_OPS_WEBHOOK=' "$LIVE/.env" 2>/dev/null | cut -d= -f2-)"
alert(){
  [ -n "${WEBHOOK:-}" ] || return 0
  local msg; msg=$(printf '%s' "$1" | python3 -c 'import json,sys;print(json.dumps(sys.stdin.read()))' 2>/dev/null) || return 0
  curl -sf -m 10 -H 'Content-Type: application/json' -d "{\"content\":$msg}" "$WEBHOOK" >/dev/null 2>&1 || true
}

git fetch origin main --quiet 2>/dev/null || { LOG "fetch failed"; exit 0; }

# --- refresh the ranked gap queue + metrics (cheap, no API spend) ------------
node tools/mine-gaps.mjs >/dev/null 2>&1 || LOG "mine-gaps failed"

# --- TELEMETRY PUSH (disposable worktree; never touches the live checkout) ---
if [ -d "$TELE/.git" ] || git -C "$TELE" rev-parse --git-dir >/dev/null 2>&1; then
  git -C "$TELE" fetch origin main --quiet 2>/dev/null
  git -C "$TELE" reset --hard origin/main --quiet 2>/dev/null
  mkdir -p "$TELE/bot-logs"
  cp -f "$LIVE/bot-logs/feedback.jsonl"          "$TELE/bot-logs/" 2>/dev/null || true
  cp -f "$LIVE/bot-logs/coverage-gaps-queue.md"  "$TELE/bot-logs/" 2>/dev/null || true
  # capture #ingest-merged wiki pages too (worktree was reset to main, so this is a clean overlay)
  if command -v rsync >/dev/null 2>&1; then rsync -a "$LIVE/wiki/" "$TELE/wiki/" 2>/dev/null
  else cp -rf "$LIVE/wiki/." "$TELE/wiki/" 2>/dev/null; fi
  # add each telemetry artifact only if it exists (feedback.jsonl appears once the
  # first 👍/👎/correction lands; a missing path would otherwise fail the whole add)
  [ -f "$TELE/bot-logs/feedback.jsonl" ]         && git -C "$TELE" add -f bot-logs/feedback.jsonl 2>/dev/null
  [ -f "$TELE/bot-logs/coverage-gaps-queue.md" ] && git -C "$TELE" add -f bot-logs/coverage-gaps-queue.md 2>/dev/null
  git -C "$TELE" add wiki/ 2>/dev/null
  if ! git -C "$TELE" diff --cached --quiet; then
    git -C "$TELE" -c user.name='NRG Droplet' -c user.email='bot@nrg.local' \
      commit -m "telemetry+ingest sync $(date -u +%FT%TZ)" --quiet
    if git -C "$TELE" push -f "$REMOTE" droplet-telemetry --quiet 2>/tmp/nrg-push.log; then
      LOG "pushed telemetry → droplet-telemetry"
    else
      LOG "telemetry push FAILED"
      alert "🚨 NRG sync: droplet→repo telemetry push failed — learning signal stuck on the box. $(tail -1 /tmp/nrg-push.log 2>/dev/null)"
    fi
  fi
else
  LOG "telemetry worktree $TELE missing — run Phase 0 setup (git worktree add)"
fi

# --- DEPLOY PULL (repo → live), gated + rollback -----------------------------
LOCAL=$(git rev-parse HEAD)
ORIGIN=$(git rev-parse origin/main)
if [ "$LOCAL" != "$ORIGIN" ]; then
  LOG "deploying main ${LOCAL:0:8} → ${ORIGIN:0:8}"
  git stash push -u -q -m nrg-drift 2>/dev/null || true   # drift already safe on droplet-telemetry
  if git merge --ff-only origin/main --quiet; then
    if node --check bot.js && node bot.js --dry-run >/tmp/nrg-dryrun.log 2>&1; then
      pm2 restart nrg-bot --update-env >/dev/null 2>&1
      LOG "deployed + restarted at ${ORIGIN:0:8}"
      alert "✅ NRG bot deployed: \`${ORIGIN:0:8}\` is live."
    else
      LOG "dry-run FAILED; rolling back to ${LOCAL:0:8}"
      git reset --hard "$LOCAL" --quiet
      pm2 restart nrg-bot --update-env >/dev/null 2>&1
      alert "🚨 NRG deploy of \`${ORIGIN:0:8}\` failed dry-run — rolled back, bot stays up. See /tmp/nrg-dryrun.log."
    fi
  else
    LOG "ff-only merge failed (main diverged)"
    git merge --abort 2>/dev/null || true
    alert "⚠️ NRG deploy: ff-only merge failed (live checkout diverged from main) — manual check needed."
  fi
  git stash drop -q 2>/dev/null || true   # discard drift; canonical copy lives on the remote
fi
LOG "done"
