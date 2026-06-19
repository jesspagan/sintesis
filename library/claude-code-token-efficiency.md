---
lib-id: LIB-001
title: Claude Code Token Efficiency — Complete Reference Guide
subjects: [claude-code, tokens, context-management, prompt-caching, cost-optimization]
type: reference-guide
created: 2026-06-16
updated: 2026-06-16
abstract: Comprehensive guide to managing context window usage in Claude Code: caching behavior, commands (/clear, /compact, /btw), deprecated features, Pro vs Max thresholds, and anti-patterns that waste tokens.
---

# Claude Code Token Efficiency — Complete Reference Guide

*Researched June 15, 2026*

---

## The Core Mental Model

Every message re-sends your entire conversation history as input tokens. Message 50 costs as much in input tokens as messages 1–49 combined. The context window is your primary resource, not individual messages.

What loads at session start (most stable → least stable for caching):
1. System prompt + tool definitions (~13–33K tokens, fixed per version)
2. CLAUDE.md, auto-memory, scoped rules
3. Conversation: messages, file reads, tool outputs (grows every turn)

Prompt caching works by matching the **prefix** exactly. Stable content at the top gets cached; the conversation tail never does.

---

## Part 1: Commands (Still Working, High Impact)

| Command | When to Use |
|---|---|
| `/clear` | Between unrelated tasks; after 2+ failed corrections |
| `/compact [focus]` | At **40–70% context** — NOT at 90%+ (too late, summary is compressed badly) |
| `/context` | Before large tasks to see what's consuming space |
| `/usage` | Monitor token count and session cost |
| `/btw <question>` | Quick clarifications that **never enter history** — ephemeral agent reuses your cache |
| `/recap` | Resume after a break without replaying conversation |
| `/rewind` | Revert wrong direction — cheaper than `/compact` for abandoning a path |
| `/effort low/medium/high` | Set at session start; **never change mid-session** (cache invalidation) |
| `/model` | Switch at session start only — every mid-session switch invalidates cache |

**`/btw` is underused and powerful:** added March 2026 (v2.1.72). Questions + answers never appear in your main history. Perfect for quick checks.

**Compact timing is critical:** Set `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70` in your shell profile (not settings.json — there's an open bug where it's silently ignored there).

---

## Part 2: CLAUDE.md Optimization

**Target: under 200 lines.** Rule compliance drops to ~30% when CLAUDE.md exceeds 4,000 tokens.

**Include:**
- Bash commands Claude can't guess
- Code style that differs from defaults
- Test runner preferences
- Non-obvious environment quirks

**Exclude:**
- Anything Claude can infer from reading the code
- Standard language conventions
- Detailed API docs (link instead)
- Frequently-changing information

**Structural tricks:**
- `<!-- comment -->` — HTML comments are stripped before injection, zero tokens
- Path-scoped rules in `.claude/rules/` load only when matching files are touched
- Move specialized workflows (PR review, migrations) into `.claude/skills/` — load on-demand only

One measured example: a 3,847-token CLAUDE.md reduced to 312 tokens by cutting inferable content.

---

## Part 3: Environment Variables

Export these in your shell profile:

```powershell
$env:CLAUDE_AUTOCOMPACT_PCT_OVERRIDE = "70"
$env:BASH_MAX_OUTPUT_LENGTH          = "20000"
$env:MAX_MCP_OUTPUT_TOKENS           = "8000"
$env:CLAUDE_CODE_EFFORT_LEVEL        = "medium"
$env:CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = "1"
$env:ANTHROPIC_SMALL_FAST_MODEL      = "claude-haiku-4-5-20251001"
$env:DISABLE_AUTOUPDATER             = "1"
$env:CLAUDE_CODE_DISABLE_THINKING    = "1"
$env:MAX_THINKING_TOKENS             = "8000"
```

| Variable | Effect |
|---|---|
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70` | Compact earlier, before context is too compressed to be useful |
| `BASH_MAX_OUTPUT_LENGTH=20000` | Caps terminal output — logs won't flood context |
| `MAX_MCP_OUTPUT_TOKENS=8000` | Caps MCP server output |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` | Disables telemetry, autoupdater checks |
| `ANTHROPIC_SMALL_FAST_MODEL` | Routes background tasks (compaction summaries, etc.) to Haiku |
| `DISABLE_AUTOUPDATER=1` | Prevents mid-session updates that bust the cache |
| `CLAUDE_CODE_DISABLE_THINKING=1` | Disables extended thinking (don't use on Fable 5) |
| `MAX_THINKING_TOKENS=8000` | Caps thinking budget on fixed-budget models |

---

## Part 4: Permissions (High Impact, Often Missed)

In `~/.claude/settings.json` or your project's `.claude/settings.json`:

```json
{
  "permissions": {
    "deny": [
      ".env",
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".next/**",
      "logs/**",
      "*.log"
    ]
  }
}
```

**Do NOT use `.claudeignore`** — it's broken as of January 2026 (The Register confirmed; open `anthropics/claude-code` issues #579, #4160). Claude reads files it's supposed to block, including `.env`. Use `permissions.deny` instead — enforced at the tool level.

Measured impact of disciplined deny rules: up to 85% context reduction.

---

## Part 5: Model Selection (Highest Single ROI)

Cost comparison (input/output per million tokens):
- Haiku 4.5: $1 / $5
- Sonnet 4.6: $3 / $15
- Opus 4.8: $5 / $25

**Default strategy:**
- Haiku: background tasks, simple subagents, batch operations
- Sonnet: daily coding (best value for most work)
- Opus: complex architecture, multi-step reasoning

**Critical rule:** Pick model at session start and stay there. Every `/model` change invalidates the entire prompt cache — you pay for one fully uncached turn.

---

## Part 6: Subagents and Forks

**Subagent (fresh context):** Starts its own conversation. Use for investigation/research so file reads don't pollute your main session. Only returns a summary.

**Fork (inherits parent cache):** First request hits the parent's cache — children 2–N in parallel save up to 90% on input tokens vs fresh subagents. Use `CLAUDE_CODE_FORK_SUBAGENT=1` for parallel work.

**Cache TTL difference:** Subscription users (Pro/Max) get **1-hour** cache TTL automatically. Direct API key users get 5 minutes. This is a meaningful advantage of subscriptions for interactive use — your context stays warm through breaks.

**Limitation:** Subagents use 5-minute TTL even on subscriptions. Cache goes cold fast for long-running subagents.

---

## Part 7: Things That No Longer Work

| Was | Status | Replacement |
|---|---|---|
| `.claudeignore` | Broken/unreliable (Jan 2026) | `permissions.deny` in settings.json |
| `budget_tokens` parameter | Deprecated on Opus 4.7+ | `/effort` command |
| `ENABLE_PROMPT_CACHING_1H` | Redundant for subscribers | Automatic on Pro/Max |
| `context-1m-2025-08-07` beta header | Retired | — |
| Claude Sonnet 4 / Opus 4.0 | Retired from API | Sonnet 4.6 / Opus 4.8 |
| Sampling params (temperature, top_p, top_k) | Removed on Opus 4.7+ | — |
| `TaskOutput` tool | Deprecated | `Read` on the task's output file path |

**Active deprecation warning:** Claude Opus 4.1 retires August 5, 2026 → migrate to Opus 4.8 if pinned.

---

## Part 8: New and Emerging (2026)

- **`/btw` command** (March 2026): ephemeral questions, never in history
- **`/recap` command** (April 2026): session summary for resumption
- **MCP tool deferral**: schemas load only when Claude actually calls a tool — makes having many MCP servers much cheaper
- **`/goal` condition**: set a success condition; evaluator re-checks after every turn for unattended runs
- **Stop hooks**: block a turn from ending until a condition passes (e.g., tests must pass)
- **Code intelligence plugins**: for TypeScript, Python, Go, Rust, Java — replaces text search with precise symbol navigation, major token savings
- **Worktrees + parallel sessions**: each worktree has an independent cache; no interference between parallel sessions
- **`/usage-credits`**: set a monthly spend cap from within the CLI

---

## Part 9: What to Avoid From the Start

1. **Kitchen sink sessions** — pivot between unrelated tasks = irrelevant context accumulates. `/clear` between tasks (commit first).
2. **Waiting for auto-compact at 90%+** — summary is too compressed. Compact at 40–70%.
3. **Bloated CLAUDE.md** — over 200 lines, rule compliance collapses.
4. **Too many MCP servers** — each adds to the system prompt. The Linear MCP alone is ~14K tokens. Disable unused ones.
5. **Model or effort switching mid-session** — full cache invalidation every time.
6. **Enabling fast mode deep in a session** — fast mode busts the cache. Enable at start if you want it.
7. **Resuming after a Claude Code upgrade** — first turn reprocesses entire history uncached.
8. **Vague prompts** ("improve this codebase") — triggers broad file scanning, everything stays in context.
9. **Correcting Claude more than twice** — accumulated wrong approaches cost more than `/clear` + better prompt.
10. **Unscoped investigation** ("investigate the auth system") — use a subagent so file reads don't pollute your context.
11. **Not committing between tasks** — if you can't commit, you can't safely `/clear`.
12. **Agent teams for simple tasks** — ~7x token multiplier. Only for genuinely parallel independent workstreams.

---

## Part 10: Pro vs Max — When to Actually Upgrade

### Current Limits (June 2026, post-May 6 doubling)

| Plan | Price | Approx. Prompts / 5h Window |
|---|---|---|
| Pro | $20/mo | 10–45 Sonnet prompts |
| Max 5x | $100/mo | ~88K tokens window |
| Max 20x | $200/mo | ~220K tokens window |

**Important:** Usage is **one shared pool** across Claude chat and Claude Code. Heavy chat drains Code capacity.

**Stay on Pro if:**
- Under ~2 hours/day of active Claude Code use
- Hitting limits less than twice/week
- Sessions are small-to-medium scope
- Applying the optimizations above consistently

**Move to Max 5x ($100) when:**
- Hitting limits 2–3 times per week regularly
- Working full-time on medium-large codebases
- Wait time from hitting limits breaks your flow state

**Move to Max 20x ($200) when:**
- Hitting Max 5x limits regularly
- Using agent teams
- Running parallel sessions in multiple worktrees

**Realistic trigger:** "Am I losing flow state 2+ times/week waiting for resets?" If yes, the $80/month delta for Max 5x is worth more than the lost time.

**The API math:** At full Max 20x usage, direct API would cost ~$3,650/month vs $200 subscription. Subscriptions win decisively once you're a regular heavy user.

---

## High-ROI Actions Checklist

- [ ] Set `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70` in shell profile (not settings.json)
- [ ] Trim CLAUDE.md to under 200 lines
- [ ] Add `permissions.deny` for node_modules, dist, build, logs, .env
- [ ] Set `BASH_MAX_OUTPUT_LENGTH=20000` and `MAX_MCP_OUTPUT_TOKENS=8000`
- [ ] Use `/clear` between unrelated tasks (commit first)
- [ ] Use `/btw` for clarification questions
- [ ] Pick model and effort at session start — never switch mid-session
- [ ] Run `/context` before large tasks
- [ ] Use subagents for any broad investigation
- [ ] Move specialized workflows to `.claude/skills/`
