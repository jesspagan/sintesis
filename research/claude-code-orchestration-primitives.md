---
name: claude-code-orchestration-primitives
description: When to use the main thread vs. a skill vs. an agent/subagent in Claude Code
type: research
---

# Main thread vs. skill vs. agent/subagent: when to use which

Research memo, 2026-07-11. Companion to [agentic-research-orchestration.md](./agentic-research-orchestration.md), which covers architecting *research pipelines* generally; this memo is scoped to Claude Code's own harness primitives — the concrete choice you make dozens of times a session.

**how to apply:** consult when deciding whether to handle a task inline, write/invoke a skill, or spawn a fork/subagent — either for own decision-making mid-session, or when the user asks how to structure their own Claude Code workflows/skills/subagents.

This memo's cost framing (per-primitive cost notes, the context-cost hierarchy, and the anti-patterns list below) is written to directly operationalize [token-usage-optimization](./token-usage-optimization.md) — the standing preference to conserve personal Claude Code plan usage. Where that memory says "delegate noisy exploration to a fork" and "don't delegate trivial lookups," this memo is the detailed *when exactly* behind those two rules.

## TL;DR decision rule

Ask two questions, in order:

1. **Does the user need to see and steer each step?** If yes → main thread. Steering requires shared context; anything delegated away is invisible until it returns.
2. **Will the work generate intermediate output the user/parent will never need again** (file reads, search noise, exploratory dead ends)? If yes → subagent (isolate it). If no, and the task is a *recurring procedure* rather than a one-off → skill (encode it). If neither → just do it in the main thread.

Rule of thumb from the field: if a task touches more than ~5 files and produces a lot of read/search noise, it's probably worth isolating in a subagent rather than doing it inline.

## The three primitives

### Main thread
- **What it is**: you, doing the work directly, in the conversation the user can see.
- **When**: the task is small, needs user steering/feedback mid-flight, or its output *is* the deliverable the user wants to review (a diff, an answer, a plan).
- **Cost**: every tool call and every token is visible and stays in context — cheapest to run, most expensive to *accumulate*. Exploration noise (grep spam, file dumps) compounds here permanently, which is why long exploratory sessions degrade.
- **Governance**: none needed beyond normal judgment — it's the default, and the user is present to catch mistakes live.

### Skill
- **What it is**: a named, on-disk procedure (`SKILL.md` + optional bundled scripts/assets) that Claude loads on demand. Name+description load at session start (cheap); the body loads only when the task matches; bundled files load only as needed (progressive disclosure — "table of contents → chapter → appendix").
- **When**: the pain is *repetition* — re-explaining the same procedure every session ("how we cut a release here," "how we write a migration in this repo," "our code-review rubric"). Skills also fit well when you want deterministic, pre-written code for a step rather than re-derived-every-time token generation (e.g., a validated palette-checker script beats re-deriving colors each time).
- **Runs in**: the main thread, by default. The steps stay visible and steerable — this is the key difference from a subagent. Use a skill when you want the procedure to play out *in front of the user*.
- **Cost**: near-zero until triggered; subject to a shared invocation budget, and oldest-invoked skills are the first dropped on context compaction — so don't rely on a skill's instructions persisting indefinitely across a very long session.
- **Governance**: name and description are the entire triggering surface — Claude decides relevance from those two fields, so weak descriptions cause missed or false triggers. Build/refine skills by running representative tasks and watching where the agent struggles, not by speculatively authoring them.

### Agent / subagent
- **What it is**: a forked or fresh Claude instance with its own context window. A **fork** inherits the parent's full conversation and shares its prompt cache — cheap, good for "go figure this out, I don't want the noise." A **fresh subagent** (Explore, general-purpose, or a custom-defined one) starts cold and needs the task fully specified in the prompt, since the only channel from parent to child is that prompt string.
- **When**: the defining reason is **context isolation** — a task that would dump a lot of intermediate material (file contents, search results, exploratory reasoning) into the parent conversation without the parent ever needing that material again. Also valuable for genuine **parallelism** (independent subtasks that can run concurrently and return only their conclusions) and for **specialized instruction sets** (a security-review subagent with its own tailored constraints).
- **Cost**: minimal to the parent's context *until* invoked — spawning has real fixed overhead (cold start for fresh agents; even forks cost a full turn), so it's not free just because it's "isolated." Nesting is supported up to ~5 levels for orchestrated workflows, but each added layer makes debugging and steering harder.
- **Governance**: the parent only sees what the subagent chooses to report back — trust but verify, especially for anything that edited files or made external calls. Never fabricate or predict a fork's result while it's running; wait for the actual completion notification. Don't spawn a subagent just to "feel thorough" on a task with no isolable side-output — that trades a real cost for no benefit.

## Where hooks and CLAUDE.md fit (context, not orchestration)

These aren't alternatives to the three primitives above, but they shape when you'd reach for one instead of hardcoding behavior:

- **Hooks**: deterministic automation (lint after edit, block a command, notify Slack) that should *never* depend on the model choosing to comply. If you're tempted to write "always do X" or "never do Y" into a skill or CLAUDE.md, that's usually a hook instead — instructions can fail under pressure or attrition; a hook can't be talked out of running.
- **CLAUDE.md**: project-wide facts that apply *always* (build commands, layout, conventions) — not procedures. A 30-line "how to do X" belongs in a skill, not CLAUDE.md, because CLAUDE.md is always loaded regardless of relevance while skill bodies load only on match.

Context-cost hierarchy, cheapest to most expensive per token actually spent: hooks (outside context entirely) → subagents/skills (load only when invoked) → path-scoped rules → unscoped rules/subdirectory CLAUDE.md → root CLAUDE.md (always loaded) → output-style/system-prompt append (highest weight, survives compaction).

## Orchestration patterns

- **Single-pass main thread**: default for anything the user is actively collaborating on.
- **Skill-in-main-thread**: recurring, steerable procedure — the user watches it happen, can interject.
- **Fork-and-report**: exploration or a self-contained multi-step task whose *process* is disposable but whose *conclusion* matters. Cheapest isolation option since it shares the parent's cache.
- **Parallel fresh subagents**: independent subtasks with no shared state, dispatched together (e.g., three review passes: style, security, coverage) so wall-clock time is the max of the three, not the sum.
- **Nested orchestration**: a subagent that itself spawns subagents — supported to ~5 levels, but treat each level as a debugging tax; reserve for genuinely hierarchical work (e.g., a top-level planner delegating to per-module implementers).

## Anti-patterns

- Delegating a task to a subagent when the user actually wanted to watch/steer it — defeats the point of the harness being interactive.
- Writing a recurring procedure inline in the main thread every session instead of capturing it as a skill — costs the user re-explanation every time.
- Spawning an agent "to be thorough" on a task with no disposable intermediate output — pure overhead, no isolation benefit gained.
- Encoding hard constraints ("never," "always") as prose in a skill or CLAUDE.md instead of a hook — prose guidance is advisory, not enforced.
- Letting root CLAUDE.md accumulate procedural content — it's the most expensive tier (always loaded) and procedures belong in skills.

## Sources

- [Steering Claude Code: when to use CLAUDE.md, skills, hooks, rules, subagents, and more](https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more) — Anthropic, primary source for the decision matrix and context-cost hierarchy above.
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic engineering, progressive disclosure and skill-authoring guidance.
- [Create custom subagents — Claude Code Docs](https://code.claude.com/docs/en/sub-agents)
- [Subagents in the SDK — Claude Code Docs](https://code.claude.com/docs/en/agent-sdk/subagents)
