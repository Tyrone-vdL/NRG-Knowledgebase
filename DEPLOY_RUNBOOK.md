# NRG Discord Bot — Deploy Runbook

Execute these steps in order tonight. Total wall-clock time: **~90 minutes**, of which only ~30 mins is hands-on (the rest is npm install + Discord propagation waits).

The runbook is split into seven tracks. Track 1 (Discord) must be done first — it produces the tokens and IDs every other track depends on.

---

## Pre-flight checklist

Before starting, you'll need:

- [ ] Discord account (yours — you'll be the bot owner)
- [ ] DigitalOcean account with a payment method on file
- [ ] Anthropic API key (existing — from the Telegram bot demo)
- [ ] Your laptop's SSH key (or willingness to generate one — Track 2 shows how)
- [ ] About 90 minutes uninterrupted
- [ ] This runbook open in one window, terminal in another

---

## Track 1 — Discord server, application, channels (15 min)

### 1.1 Enable Developer Mode

You need this to be able to copy IDs.

1. Open Discord (desktop or web)
2. User Settings (cog at bottom left) → **Advanced** → toggle **Developer Mode** ON
3. Close settings

### 1.2 Create the NRG Discord server

1. Bottom of left sidebar: green `+` icon → **Create My Own** → **For me and my friends**
2. Server name: `NRG Knowledge Base` → **Create**
3. Right-click the new server icon in the sidebar → **Server Settings**
4. **Roles** → **Create Role** → name it `NRG Team` → leave permissions as default → **Save Changes**
5. (Don't add Matt or anyone else yet — Wednesday job)
6. Back to the server → next to channel list, click `+` → **Create Channel** → text channel → name: `wiki-bot`
7. Repeat for: `ingest`. (The `general` channel is created automatically.)
8. Right-click your own username in the member list → **Copy User ID** → paste into a notepad labelled `OWNER_USER_ID`
9. Right-click the server icon → **Copy Server ID** → save as `DISCORD_GUILD_ID`
10. Right-click `#wiki-bot` channel → **Copy Channel ID** → save as `WIKI_BOT_CHANNEL_ID`
11. Right-click `#ingest` channel → **Copy Channel ID** → save as `INGEST_CHANNEL_ID`
12. Right-click the `NRG Team` role (Server Settings → Roles → ... menu) → **Copy Role ID** → save as `NRG_TEAM_ROLE_ID` *(optional for v1 — leave blank in `.env` to allow any server member to query while we onboard)*

### 1.3 Create the Discord application + bot

1. Open https://discord.com/developers/applications
2. Top right: **New Application**
3. Name: `NRG Knowledge Base` → tick ToS → **Create**
4. From the application's **General Information** page → copy **Application ID** → save as `DISCORD_CLIENT_ID`
5. Left sidebar: **Bot**
6. Under **TOKEN** → **Reset Token** → **Yes, do it!** → **Copy** → save as `DISCORD_TOKEN` *(only shown once — don't lose it)*
7. Under **Privileged Gateway Intents**, toggle ON:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT
8. Scroll down → **Save Changes**

### 1.4 Invite the bot to your server

1. Left sidebar: **OAuth2** → **URL Generator**
2. **Scopes** — tick: `bot`, `applications.commands`
3. **Bot Permissions** (appears below) — tick:
   - View Channels
   - Send Messages
   - Send Messages in Threads
   - Read Message History
   - Add Reactions
   - Attach Files
   - Embed Links
   - Use Slash Commands
4. Copy the **Generated URL** at the bottom
5. Paste it into a browser → select **NRG Knowledge Base** server → **Authorize** → solve the captcha
6. Back in Discord: the bot appears in the member list (offline — that's fine, we'll bring it online in Track 6)

**At end of Track 1, your notepad should have:** `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`, `WIKI_BOT_CHANNEL_ID`, `INGEST_CHANNEL_ID`, `OWNER_USER_ID`. Optional: `NRG_TEAM_ROLE_ID`.

---

## Track 2 — DigitalOcean droplet (15 min)

### 2.1 Generate an SSH key if you don't have one

In your laptop terminal:

```bash
ls ~/.ssh/id_ed25519.pub
```

If that prints a file path, skip to 2.2. If it errors:

```bash
ssh-keygen -t ed25519 -C "choppa-kampfire"
# Press Enter through all prompts (no passphrase is fine for now)
cat ~/.ssh/id_ed25519.pub
```

Copy the entire output of `cat ~/.ssh/id_ed25519.pub` — you'll paste it into DO.

### 2.2 Add SSH key to DigitalOcean

1. https://cloud.digitalocean.com → top right → your avatar → **Settings** → **Security**
2. **Add SSH Key** → paste the public key → name it `choppa-laptop` → **Add SSH Key**

### 2.3 Create the droplet

1. Top right green **Create** → **Droplets**
2. **Region:** Sydney (SYD1)
3. **OS image:** Ubuntu 24.04 (LTS) x64
4. **Droplet type:** Basic
5. **CPU options:** Regular (Disk: SSD)
6. **Size:** `$6/mo` (1 GB / 1 vCPU / 25 GB SSD)
7. **Authentication:** SSH Key → tick `choppa-laptop`
8. **Hostname:** `nrg-bot-prod`
9. **Tags:** `kampfire`, `nrg`
10. **Create Droplet** → wait ~60 seconds
11. Copy the droplet's IPv4 address → save as `DROPLET_IP`

### 2.4 First SSH connection + base setup

```bash
ssh root@<DROPLET_IP>
# yes to fingerprint when prompted

apt update && apt upgrade -y
apt install -y curl git ufw rsync

# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v  # should print v20.x.x
npm -v

# PM2 (process manager)
npm install -g pm2

# Firewall
ufw allow OpenSSH
ufw --force enable

# Working directory
mkdir -p /opt/nrg-bot/logs
```

Leave the SSH session open — you'll come back to it.

---

## Track 3 — Get the bot code + wiki onto the droplet (10 min)

**Prerequisite:** complete `../GITHUB_RUNBOOK.md` first — Steps 1–3 push the wiki to GitHub and set up the deploy key on the droplet.

### 3a — Clone the wiki from GitHub (recommended path)

Still in the SSH session on the droplet:

```bash
cd /opt/nrg-bot
git clone git@github.com:Tyrone-vdL/NRG-Knowledgebase.git wiki

# Verify
ls wiki | head
# Expected: CLAUDE.md, concepts, config.md, index.md, log.md, products, sources, etc.
```

This becomes the production source of truth for the wiki. Any change merged into `main` on GitHub can be pulled to the droplet with `cd /opt/nrg-bot/wiki && git pull`.

### 3b — Bot code onto the droplet

From a **second terminal on your laptop** (don't close the SSH session):

```bash
cd "C:\Users\tyron\Work Life\kampfire-digital\clients\morelli-group"

# rsync the bot code (Windows: use Git Bash, WSL, or PowerShell rsync; below assumes a unix-like shell)
rsync -avz --exclude node_modules --exclude .env --exclude logs --exclude wiki \
  ./discord-bot/ root@<DROPLET_IP>:/opt/nrg-bot/
```

Note the `--exclude wiki` — the wiki already came from GitHub in Step 3a, so don't overwrite it.

If rsync isn't available on Windows, use `scp -r` instead, or install rsync via Git for Windows / Chocolatey.

### 3c — Optional: bot code in its own private repo

For cleaner future deploys, you can put the `discord-bot/` folder in a private GitHub repo and clone it on the droplet alongside the wiki:

```bash
# On laptop, from discord-bot/ folder:
git init && git add . && git commit -m "Initial bot v1"
gh repo create nrg-discord-bot --private --source=. --push
# Then on droplet: git clone git@github.com:Tyrone-vdL/nrg-discord-bot.git /opt/nrg-bot/code
```

For Wednesday: rsync is fine, repo can come later.

---

## Track 4 — Install dependencies + configure (10 min)

Back in the SSH session on the droplet:

```bash
cd /opt/nrg-bot
npm install
# This downloads discord.js, anthropic, pdf-parse, mammoth, dotenv. ~30 seconds.

cp .env.example .env
nano .env
# Fill in every value from your notepad:
#   DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID,
#   WIKI_BOT_CHANNEL_ID, INGEST_CHANNEL_ID, OWNER_USER_ID,
#   NRG_TEAM_ROLE_ID (optional — leave blank for v1),
#   ANTHROPIC_API_KEY,
#   WIKI_ROOT=/opt/nrg-bot/wiki
# Save with Ctrl+O, Enter, Ctrl+X
```

**Sanity check:**

```bash
cat .env | grep -E "^(DISCORD_TOKEN|ANTHROPIC_API_KEY|WIKI_ROOT)=" | sed 's/=.*/=SET/'
# should print 3 lines all ending in =SET
ls wiki | head
# should print: CLAUDE.md, concepts, config.md, index.md, log.md, products, sources, queries (or similar)
```

---

## Track 5 — First boot (test mode) (5 min)

```bash
cd /opt/nrg-bot

# Pre-flight: build the wiki layers + catalog WITHOUT touching Discord/Anthropic
node bot.js --dry-run
# prints always-loaded pages, the retrievable catalog, and estimated cache cost

node bot.js
```

You should see (in order):

```
[startup] Wiki loaded: XX always-loaded pages, XX retrievable pages
[startup] System prompt size: XXXXX chars (cached static prefix)
[ready] Logged in as NRG Knowledge Base#1234
[startup] Slash commands registered
[ready] NRG Discord bot is running.
```

If you see those four lines, the bot is live. Open Discord → the bot's status indicator should turn green.

**Test it:**

1. Type `/status` in any channel → bot replies with wiki size + uptime
2. Type any question in `#wiki-bot` (e.g. "What's the solar absorptance for Monument?") → bot replies with an answer
3. Drop a small PDF in `#ingest` → bot reacts 👀 → drafts a preview → you react ✅ or ❌

If any of these fail, see Troubleshooting at the bottom.

When satisfied, press **Ctrl+C** to stop the test process.

---

## Track 6 — Production launch under PM2 (5 min)

```bash
cd /opt/nrg-bot
pm2 start ecosystem.config.cjs
pm2 logs nrg-bot --lines 20
# verify the same startup messages appear
# Ctrl+C to exit log view (bot keeps running)

pm2 save                 # persist current process list
pm2 startup              # PRINTS a command — copy-paste and run it
# (the printed command typically looks like: env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root)
pm2 save                 # save again after enabling startup
```

Verify auto-restart works:

```bash
pm2 restart nrg-bot
pm2 logs nrg-bot --lines 10
# should see startup messages again
```

The bot is now production-deployed. It survives the SSH session closing, the droplet rebooting, and the bot process crashing (PM2 restarts it).

---

## Track 7 — Verify + backup (10 min)

### 7.1 End-to-end smoke test

In Discord:
1. `/help` — bot explains itself
2. `/status` — shows wiki size + uptime
3. Ask a question in `#wiki-bot` that you know the wiki can answer (e.g. about Hebel or COLORBOND)
4. Ask a question the wiki CAN'T answer — confirm the bot says "I don't have that in the wiki" rather than inventing a number (the HARD RULE working)
5. Drop a small test PDF in `#ingest` — confirm the draft preview appears
6. React ❌ to discard — wiki unchanged
7. Drop the same PDF again — react ✅ — confirm "Merged into wiki as `sources/src-xxx.md`. Wiki now has X+1 files in context."
8. Ask a question that the just-ingested doc would answer — confirm the bot cites the new file

### 7.2 Nightly backup (optional but recommended)

On the droplet:

```bash
mkdir -p /opt/backups
cat > /opt/backups/wiki-backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y-%m-%d)
tar -czf /opt/backups/wiki-$DATE.tar.gz /opt/nrg-bot/wiki
# keep last 14 days
find /opt/backups -name "wiki-*.tar.gz" -mtime +14 -delete
EOF
chmod +x /opt/backups/wiki-backup.sh

# Schedule nightly at 2am
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backups/wiki-backup.sh") | crontab -
```

### 7.3 Update the laptop's local wiki copy

The droplet wiki is now authoritative (Matt + team will write to it via Discord). To pull changes back to your laptop occasionally:

```bash
rsync -avz root@<DROPLET_IP>:/opt/nrg-bot/wiki/ "C:/Users/tyron/OneDrive/Documents/Kampfire.Digital/NRG Knowledge Base/wiki/"
```

Add this to your weekly routine, or wire it into Claude Code as a scheduled task.

---

## Redeploying a bot update (v3+, ~3 min)

When `bot.js` changes on the laptop:

```bash
# 1. Laptop: dry-run against the local wiki first
WIKI_ROOT="C:/Users/tyron/Work Life/kampfire-digital/NRG Knowledge Base/wiki" node bot.js --dry-run

# 2. Ship the changed files (never .env, never wiki/)
scp bot.js .env.example README.md root@<DROPLET_IP>:/opt/nrg-bot/

# 3. Droplet: restart + verify
ssh root@<DROPLET_IP> "cd /opt/nrg-bot && node --check bot.js && node bot.js --dry-run && pm2 restart nrg-bot && pm2 logs nrg-bot --lines 10 --nostream"
```

Then in Discord: `/status` (check the two cost-telemetry fields appear), one `#wiki-bot` query, confirm a `[usage]` line in `pm2 logs`.

---

## Troubleshooting

### Bot starts but doesn't appear online in Discord
- Token mismatch — check `DISCORD_TOKEN` in `.env` matches what you copied from the Developer Portal
- If you regenerated the token after copying, you need to copy the new one and update `.env`

### Bot online but doesn't respond in `#wiki-bot`
- `WIKI_BOT_CHANNEL_ID` is wrong — double-check via right-click → Copy Channel ID
- MESSAGE CONTENT INTENT is OFF — back to Developer Portal → Bot → toggle ON → save → restart bot (`pm2 restart nrg-bot`)

### Slash commands don't appear in Discord
- `DISCORD_CLIENT_ID` or `DISCORD_GUILD_ID` wrong — check `.env`
- Discord can take up to 60 seconds to propagate guild slash commands — wait, then try again

### Ingestion fails with "I couldn't extract meaningful text"
- Scanned PDF (image-only) — needs OCR before ingesting; share the doc by another route for now
- Encrypted/protected PDF — same issue

### `pdf-parse` install fails
- Sometimes pdf-parse has Node version issues. If `npm install` errors on it:
  ```bash
  npm uninstall pdf-parse
  npm install pdf-parse@1.1.1 --legacy-peer-deps
  ```

### Bot crashes silently
- `pm2 logs nrg-bot --err` shows error output
- Most common: `ANTHROPIC_API_KEY` invalid or out of credit

### Quick rollback
- `pm2 stop nrg-bot` — stops the bot (Discord goes offline, no further charges)
- `pm2 delete nrg-bot` — removes from PM2 entirely

---

## Cost monitoring

- DigitalOcean dashboard shows droplet billing (~$0.20/day for the $6/mo size)
- Anthropic console (https://console.anthropic.com → Usage) shows API spend daily
- Expect: ~$25–35/mo total all-in for normal NRG use

---

## What's next (after Wednesday)

1. Wire `NRG_TEAM_ROLE_ID` into `.env` and restart — locks access to assigned team members only
2. Add Matt + Will + Tara to the server with the NRG Team role
3. Run the Wednesday onboarding session (see `TEAM_ONBOARDING.md`)
4. Issue invoice #1 ($1,500 deposit) once contract v2 is signed
5. Set 30-day timer for invoice #2 ($1,500 on delivery) — payable after team is using it and 3 ingestions complete

---

*Generated as part of the v2 production deployment, June 2026.*
