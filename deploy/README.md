# deploy/ — droplet sync + digest automation

The self-learning loop (see [`../OBJECTIVE.md`](../OBJECTIVE.md)). Two systemd timers drive
[`../tools/deploy-sync.sh`](../tools/deploy-sync.sh) and the weekly digest. Sync model:

- **`main` = source of truth** for code + wiki. **GitHub → droplet** = `git pull` (ff-only, gated).
- **droplet → GitHub** = telemetry (`bot-logs/feedback.jsonl`, `coverage-gaps-queue.md`) + `#ingest`-merged
  wiki pages, force-pushed to the **`droplet-telemetry`** branch from a disposable worktree. Humans merge
  `droplet-telemetry → main` during the Wednesday sync. The live checkout is never branch-switched.

## One-time droplet setup (Phase 0)

```bash
# 0. Back up live state
cd /opt/nrg-bot
cp .env /root/nrg-bot.env.bak
tar czf /root/nrg-state-$(date +%F).tar.gz .env logs bot-logs

# 1. Deploy key with WRITE access (needed only to push droplet-telemetry)
ssh-keygen -t ed25519 -f /root/.ssh/nrg_deploy -N ""
cat >> /root/.ssh/config <<'EOF'
Host github-nrg
  HostName github.com
  User git
  IdentityFile /root/.ssh/nrg_deploy
  IdentitiesOnly yes
EOF
cat /root/.ssh/nrg_deploy.pub      # → add to GitHub repo → Settings → Deploy keys (Allow write access)

# 2. Repoint the live checkout to NRG-Knowledgebase (in-place; preserves .env/logs)
git remote set-url origin github-nrg:Tyrone-vdL/NRG-Knowledgebase.git
git fetch origin
git stash push -u -m pre-repoint 2>/dev/null || true   # set aside scp drift (bot.js already matches)
git checkout -B main origin/main
node --check bot.js && node bot.js --dry-run            # gate
pm2 restart nrg-bot --update-env

# 3. Disposable telemetry worktree (push direction; never touches the live checkout)
git worktree add -B droplet-telemetry /opt/nrg-telemetry origin/main

# 4. Add the #bot-ops webhook to .env (create the channel + webhook in Discord first)
echo 'BOT_OPS_WEBHOOK=https://discord.com/api/webhooks/XXX/YYY' >> /opt/nrg-bot/.env

# 5. Install the timers
cp deploy/nrg-sync.service deploy/nrg-sync.timer deploy/nrg-digest.service deploy/nrg-digest.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now nrg-sync.timer nrg-digest.timer
systemctl list-timers 'nrg-*'
```

## Operating it

- **Deploys are automatic:** merge a PR to `main` → within 15 min the droplet ff-pulls, runs
  `node bot.js --dry-run`, restarts, and posts `✅ deployed` to `#bot-ops`. A failed dry-run auto-rolls back.
- **Learning is automatic + gated:** the bot logs 👍/👎 + reply-corrections to `feedback.jsonl`;
  `mine-gaps.mjs` ranks gaps into `coverage-gaps-queue.md`; both push to `droplet-telemetry`. New knowledge
  still only enters via the `#ingest` ✅ flow — corrections are signals, never auto-edits.
- **Weekly (Wed 08:00):** the digest posts usage/quality/gaps + the delivery checklist to `#bot-ops`,
  with the one action: review/merge `droplet-telemetry → main`.
- **Manual run:** `systemctl start nrg-sync.service` / `node tools/post-digest.mjs --dry`.
- **Logs:** `journalctl -u nrg-sync.service -n 50`; alerts land in `#bot-ops`.

## Rollback / disable
`systemctl disable --now nrg-sync.timer nrg-digest.timer`. The bot keeps running; deploys revert to manual.
