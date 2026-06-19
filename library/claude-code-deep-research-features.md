---
lib-id: LIB-004
title: Claude Code Deep Research Features — Subscription Tiers & Architecture
subjects: [claude-code, workflow]
type: reference-guide
created: 2026-06-18
updated: 2026-06-18
abstract: Reference guide to the two architecturally distinct deep-research features in Claude's ecosystem — the Claude.ai Research Toggle (web UI, Pro+) and the /deep CLI command (Max or API subscription) — covering subscription gates, behavioral differences, and how to replicate the parallel-agent research pattern on a Pro subscription.
---

# Claude Code Deep Research Features — Subscription Tiers & Architecture

*As of June 2026*

---

## Overview

Two distinct "deep research" features exist in Claude's ecosystem. They are architecturally separate and often confused.

| Feature | Location | Subscription | Duration |
|---|---|---|---|
| Research Toggle | Claude.ai web UI only | Pro, Team, Max, Enterprise | 5–30+ min |
| `/deep` command | Claude Code CLI | Max or API subscription | Minutes |

---

## Feature 1 — Claude.ai Research Toggle

- **Location:** Claude.ai web interface only — not accessible from Claude Code CLI
- **Subscription:** Pro ($20/mo), Team, Max, Enterprise
- **Behavior:** Multiple search strategies, reads full articles (not snippets), follows related links, cross-references sources
- **Output:** Comprehensive cited report
- **Limitation:** No API endpoint; cannot be invoked programmatically from Claude Code without browser automation

---

## Feature 2 — `/deep` Command (Claude Code CLI)

- **Location:** Claude Code CLI as a slash command / skill
- **Subscription:** NOT available on Pro ($20/mo) — confirmed absent. Likely Max ($100/mo) or API subscription
- **Behavior:** Spawns parallel subagents, each investigating independently; cross-checks findings; synthesizes cited report
- **Confirmed present on:** Anthropic API subscription (usage-based billing)

---

## Replicating Deep Research on Pro

These tools ARE available on Pro and can replicate the `/deep` pattern:

| Tool | Role |
|---|---|
| `WebSearch` | Find sources across angles |
| `WebFetch` | Read full articles (not snippets) |
| `Agent` tool | Spawn parallel subagents |

The `/deep-research` skill in `.claude/skills/` implements this pattern for Pro subscriptions.

---

## Sources

- [What Is the /deep Research Command in Claude Code? — MindStudio](https://www.mindstudio.ai/blog/what-is-deep-research-command-claude-code)
- [How to Use Claude.ai's Research Toggle Inside Claude Code — DEV](https://dev.to/bhaidar/how-to-use-claudeais-research-toggle-inside-claude-code-469d)
- [Use Claude Code with your Pro or Max plan — Anthropic Support](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)
