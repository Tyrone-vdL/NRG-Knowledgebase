---
title: Config
type: config
updated: 2026-06-15
---

# Config

This file tells any LLM (or future bot) where the source documents live. **Update this file if the source folder ever moves.**

## Source root

```
.            # repo root of Tyrone-vdL/NRG-Knowledgebase
```

As of the 2026-06-15 unification, the raw source documents (`Z - NCC/`, `Z - PRODUCT INFO/`,
`Z - RESOURCES_FORMS/`, `Z - TECHNICAL INFO/`) and this `wiki/` layer live in the **same repo**.
All file paths in `wiki/index.md` and source pages in `wiki/sources/` are RELATIVE to the repo
root. To resolve a full path: `<repo_root>/<relative_path>` — e.g. `Z - NCC/QDC 4.1 - NCC 2019 5STAR DTS.pdf`.

> Historical note: before unification the source root was a local OneDrive path
> (`C:\Users\tyron\OneDrive\Documents\Kampfire.Digital\NRG Knowledge Base`) and the bot code lived
> in a separate repo (`ChoppaTheMegalodon/nrg-discord-bot`). Both were merged into this repo so the
> raw documents and their distilled wiki summaries are version-controlled together.

## Wiki root

```
./wiki
```

## Owner

- **Current owner:** Kampfire Digital (Choppa)
- **Future owner:** NRG team (handoff TBD)

## Handoff procedure

When transferring ownership:
1. Copy the `wiki/` folder to the new owner's machine.
2. Update `source root` above to point at their copy of the source documents.
3. The new owner can then point any LLM (Claude Desktop, ChatGPT with file access, etc.) at the wiki folder and start querying.

No other changes needed. The wiki is fully portable.
