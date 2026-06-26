#!/usr/bin/env bash
# tools/persist-ingest.sh — make a freshly-approved #ingest page DURABLE.
# =============================================================================
# Root-cause fix (Layer 1): the ✅ handler used to write approved pages only to
# the live working tree (untracked drift), where the deploy-sync stash cycle
# could destroy them. This commits the new page (+ index.md/log.md) and pushes
# it to origin/main — the single source of truth — so it survives every deploy.
#
# bot.js calls this UNDER flock($REPO/.git/nrg-git.lock) so it can never
# interleave with tools/deploy-sync.sh (which takes the same lock).
#
#   Usage:  persist-ingest.sh <page-relpath>     e.g. wiki/sources/src-foo.md
#   Env:    COMMIT_TITLE  — human title for the commit message (optional)
#           REMOTE        — git remote/url (optional; defaults to the ssh alias)
#
# Exit codes (bot.js surfaces failures loudly in #ingest + #bot-ops):
#   0 ok (pushed, or nothing to commit)   3 bad repo     4 git add failed
#   5 commit failed   6 fetch failed   7 rebase conflict   8 push failed
set -uo pipefail

REPO="${REPO:-/opt/nrg-bot}"
REMOTE="${REMOTE:-github-nrg:Tyrone-vdL/NRG-Knowledgebase.git}"
PAGE="${1:?page relpath required}"
TITLE="${COMMIT_TITLE:-untitled}"
export GIT_SSH_COMMAND="ssh -o BatchMode=yes"

cd "$REPO" || exit 3

git add -- "$PAGE" wiki/index.md wiki/log.md || exit 4

# Already committed (e.g. a retry) — nothing to do, treat as success.
git diff --cached --quiet && exit 0

git -c user.name='NRG Droplet' -c user.email='bot@nrg.local' \
  commit -q -m "ingest: ${TITLE}" || exit 5

# Integrate anything that landed on main since, then push. Rebase keeps history
# linear and avoids non-fast-forward rejections.
git fetch origin main --quiet || exit 6
if ! git rebase origin/main >/dev/null 2>&1; then
  git rebase --abort 2>/dev/null || true
  exit 7
fi
git push "$REMOTE" HEAD:main --quiet || exit 8
exit 0
