---
name: authoring-token-efficient-skills
description: Writing Claude Agent Skills that are token-efficient, maintainable, and well-scoped
type: research
tags: [skills, tokens]
---

# Authoring token-efficient, maintainable, well-scoped Skills

Research memo, 2026-07-11 (expanded same day). Companion to [claude-code-orchestration-primitives.md](./claude-code-orchestration-primitives.md) (when to reach for a skill at all) — this memo is the *how*, once you've decided a skill is the right primitive. Grounded in Anthropic's generic [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (applies across Claude products) plus Claude Code's own [skills docs](https://code.claude.com/docs/en/skills) (harness-specific mechanics: where skills live, lifecycle, budgets, frontmatter).

**how to apply:** consult before writing or reviewing any SKILL.md — especially when deciding what goes in the body vs. a bundled reference file, whether a skill's scope has drifted too wide, or whether a skill needs splitting.

**Token-efficiency framing (per [token-usage-optimization](./token-usage-optimization.md)'s overall thesis):** conservation-first throughout — no quality-budget tension to reconcile here, unlike the research-orchestration memo.

## TL;DR

A skill costs tokens in three separable places — pick each deliberately:
1. **Metadata (name + description)**: paid on *every* session regardless of relevance, and shared across a harness-wide listing budget with every other skill you have installed.
2. **SKILL.md body**: paid once, when the skill first triggers — then **persists unread for the rest of the session** (Claude Code does not re-fetch it on later turns).
3. **Bundled files/scripts**: paid only when actually read/run — the pressure valve for verbose content.

Maintenance and scope are the same lever pulled two ways: a tightly-scoped skill is both cheaper to run (less body text) and easier to keep correct (less surface for drift). In Claude Code specifically, scope also has a *governance* dimension the generic guidance doesn't cover: who is allowed to trigger the skill, what tools it can touch, and where in a repo it applies.

## 1. Token usage: three cost tiers, and how Claude Code actually spends the budget

**Tier 1 — metadata, always loaded, harness-wide budget.** Name + description load into every session's system prompt. In Claude Code this isn't just "keep it short" in the abstract — there's a real, measurable budget: the skill listing scales at **1% of the model's context window**, and each entry (`description` + `when_to_use`) is hard-capped at **1,536 characters** regardless of budget. When the listing overflows, Claude Code drops full descriptions starting with your **least-invoked** skills first (falling back to name-only), so a growing personal skill collection silently degrades the triggering quality of skills you rarely use — not evenly, but by usage-frequency LRU. `/doctor` reports the listing's cost and biggest contributors; `/context` shows the post-budget size. Put the key use case first in `description` since truncation is char-count-based, not sentence-aware.

**Tier 2 — SKILL.md body, loaded once, then persists for the whole session.** This is the mechanic the generic best-practices doc doesn't mention and that changes how you should write skill content: when a skill is invoked, its rendered content enters the conversation as a single message **and stays there** — Claude Code does not re-read the file on later turns. Two consequences:
- Write instructions as **standing guidance that should apply throughout the task**, not "step 1, now do step 2" framed as if freshly re-read each time.
- Re-invoking a skill with *identical* rendered output gets deduped (a short "already loaded" note replaces a second full copy); re-invoking with *different* output (changed arguments, or a dynamic-context command that returned new data) appends a full second copy — so a skill that injects live data (git diff, PR comments) can cost tier-2 tokens repeatedly across a session if invoked repeatedly with changing state.
- **Auto-compaction carries skills forward on their own sub-budget**, separate from the general conversation summary: the most recent invocation of each skill is re-attached after compaction, keeping the first 5,000 tokens of each, up to a **combined 25,000-token cap** across all re-attached skills — filled starting from most-recently-invoked, so older-invoked skills can be **dropped entirely** if you've invoked many in one long session. If a skill seems to stop influencing behavior after the first response, it's often not gone — it's just being out-competed for attention by more recent tool calls; re-invoke it after a compaction event rather than assuming it's still authoritative.

**Tier 3 — bundled files and scripts, loaded only if touched.** Unchanged from the generic guidance: no context penalty until read/run. Two Claude-Code-specific techniques amplify this:
- **Dynamic context injection** (`` !`command` `` or fenced ` ```! ` blocks): shell commands run *before* Claude ever sees the skill, and only their **output** is inserted — the command text itself is preprocessing, invisible to the model. This is a token-efficiency pattern in its own right: instead of telling Claude "run `git diff HEAD` and read the result" (a tool-call round trip that costs a turn), the diff is already inlined into the prompt at zero additional turns.
- **Executable scripts via `${CLAUDE_SKILL_DIR}`**: bundled scripts run without their source loading into context; only stdout counts. Use the substitution variable (not a hardcoded relative path) so the script resolves correctly regardless of whether the skill is installed at personal, project, or plugin scope.

## 2. Maintenance: evaluation-driven, with actual Claude Code tooling for it

The generic principle still holds — build evaluations from *observed* gaps before writing extensive documentation, not from anticipated ones — but Claude Code ships a concrete way to run this loop instead of doing it by hand:

**The `skill-creator` plugin** (`/plugin install skill-creator@claude-plugins-official`) automates the with-skill/without-skill comparison:
- Stores test cases (prompts, input files, expected behavior) in `evals/evals.json` inside the skill directory.
- Spawns a **subagent per test case** so each run starts clean — mirrors the isolation principle from the orchestration-primitives memo, applied specifically to skill evaluation.
- Grades each assertion, writes pass/fail with evidence to `grading.json`.
- Aggregates pass rate, time, and **token cost** for with-skill vs. without-skill into `benchmark.json` — so you can weigh a skill's pass-rate improvement directly against its token/time overhead, not just assume it's worth it.
- Runs a **blind A/B between two versions** of a skill before you commit an edit, to confirm it's actually an improvement.
- **Description tuning**: generates should-trigger / should-not-trigger prompts, measures hit rate, and proposes description edits when a skill fires on the wrong requests — directly operationalizes tier-1 token cost (a mistriggered skill wastes tier-2 tokens it shouldn't have spent).

**Baseline-comparison is the check, always**: seeing a skill trigger only tells you Claude found it, not that the output was right — run the same realistic prompts in a fresh session with the skill on vs. [disabled via `skillOverrides`](#3-taskfocus-scope-precedence-and-governance-specific-to-claude-code) and compare, because leftover authoring context in the same session masks gaps in the written instructions.

**Live-edit maintenance loop**: Claude Code watches skill directories and picks up edits/additions/removals within the current session without a restart — *except* a brand-new top-level skills directory that didn't exist when the session started, which needs a restart to be watched. Plugin-bundled skills that also carry `hooks/`, `.mcp.json`, `agents/`, or `output-styles/` need `/reload-plugins` for changes to those specific files even though `SKILL.md` text itself hot-reloads.

**Troubleshooting is itself a maintenance playbook** — three distinct failure modes, three distinct fixes:
| Symptom | Fix |
|---|---|
| Skill never triggers | Check description has the keywords a user would actually say; verify it's listed via "What skills are available?"; try rephrasing closer to the description; invoke directly with `/skill-name` as a fallback |
| Skill triggers too often | Narrow the description; add `disable-model-invocation: true` if it should only ever be manual |
| Skill triggers but description looks cut off | You're hitting the tier-1 listing budget (see above) — raise `skillListingBudgetFraction`, or demote low-priority skills to `"name-only"` via `skillOverrides` to free budget for the ones that matter |

## 3. Task/focus scope: precedence and governance specific to Claude Code

The generic naming/description discipline (gerund names, what+when descriptions, single responsibility) still applies — see the earlier version of this memo's reasoning. What Claude Code adds on top is **where a skill lives and who can trigger it**, which is a scope decision the generic Agent Skills doc doesn't have a mechanism for:

**Scope by location** — same skill name at different levels resolves by precedence: enterprise (managed settings, org-wide) overrides personal (`~/.claude/skills/`, all your projects) overrides project (`.claude/skills/`, this repo only). Any of these also overrides a same-named **bundled** skill (e.g. a project `code-review` skill replaces the built-in `/code-review`). Plugin skills are namespaced (`plugin-name:skill-name`) specifically so they can't collide with anything else.

**Nested/monorepo scope** — `.claude/skills/` in a subdirectory applies when Claude is working on files in that subdirectory, even if the session started at the repo root. If a nested skill shares a name with a root-level one, both stay available: the nested one gets a directory-qualified name (`apps/web:deploy`), and invoking the *unqualified* name still runs the root skill but Claude Code appends the qualified variants with an instruction to also invoke whichever one matches the files actually being touched. This is the mechanism behind the "scoped to a directory... most specific directory wins" pattern — worth knowing when authoring a skill meant to apply only within one package of a monorepo.

**Who can trigger it — the real scope control**: this is the harness's answer to the generic doc's "task content vs. reference content" distinction:
- `disable-model-invocation: true` → only *you* can invoke it (`/name`). Use for anything with side effects or timing you want to control — deploys, commits, messages sent to other systems. Also removes the skill's description from context entirely (a tier-1 token savings) and excludes it from subagent preloading and scheduled-task triggering.
- `user-invocable: false` → only *Claude* can invoke it, hidden from the `/` menu. Use for background knowledge that isn't a meaningful user action (e.g., "how our legacy system works").
- Neither set (default) → either party can invoke it.

**Tool-surface scope**: `allowed-tools` pre-approves specific tools while the skill is active (no per-use permission prompts) without restricting anything else; `disallowed-tools` removes tools from the pool for the skill's duration (clears on your next message) — useful for an autonomous/background skill that should never, say, call `AskUserQuestion`. For project-checked-in skills, `allowed-tools` only takes effect after the workspace-trust dialog is accepted — a skill can grant itself broad tool access, so review project skills before trusting a repo you didn't author.

**File-pattern scope**: the `paths` frontmatter field (glob patterns) limits automatic activation to when Claude is working with matching files — the skill equivalent of path-scoped CLAUDE.md rules from the orchestration-primitives memo's context-cost hierarchy.

**Execution-context scope — where a skill's own decision framework meets the main-thread-vs-subagent question**: `context: fork` (optionally with `agent: <type>`) runs the skill's content as the prompt for a forked subagent instead of inline in the main thread. This is the concrete lever for applying the orchestration-primitives memo's decision rule *inside* a skill itself — a skill that's pure "reference content" (conventions, patterns) should stay inline (default) so it's visible/steerable; a skill that's a self-contained "task" with disposable intermediate exploration (e.g. a `deep-research` skill using `agent: Explore`) should fork. The docs warn explicitly: `context: fork` only makes sense when the skill contains an actual task — a skill of pure guidelines forked into a subagent hands that subagent guidelines with nothing to *do*, and it returns nothing useful.

**Governance/distribution surface**: project skills are shared by committing `.claude/skills/` to version control; org-wide policy skills deploy via managed settings (same enterprise-override tier as CLAUDE.md in the primitives memo); `skillOverrides` in settings lets you control visibility of a skill you don't want to (or can't) edit directly — e.g. a shared/MCP-provided skill — without touching its frontmatter; `disableSkillShellExecution` (settable in managed settings so users can't override it) disables all dynamic-context shell execution across skills and commands org-wide, a hard guardrail rather than an authoring convention.

## Anti-patterns

Generic (apply regardless of platform):
- Writing SKILL.md as a tutorial/explainer instead of an instruction set.
- Nesting references more than one level deep from SKILL.md, causing silent partial reads.
- Building a skill from imagined requirements before running a single evaluation against real failures.
- Letting a description drift vague as the body grows to cover more cases.
- Punting error handling to Claude inside bundled scripts, or leaving undocumented magic constants.
- Treating skill creation as one-time setup rather than an observe-refine-test cycle.

Claude-Code-specific:
- Writing skill content as if it'll be re-fetched fresh each turn — it isn't; write standing instructions that hold up read once and left in context for the rest of the session.
- Letting a personal skill collection grow unpruned — every unused skill's metadata competes in the same 1%-of-context listing budget, and the ones you use least are the first to lose their descriptions, not a random sample.
- Forking (`context: fork`) a skill that's just reference guidelines with no embedded task — the subagent gets instructions and nothing to act on.
- Skipping `disable-model-invocation: true` on a skill with real side effects (deploy, commit, send a message) — leaves it to Claude's judgment whether "the code looks ready," which is exactly the autonomy boundary the field exists to draw.
- Granting broad `allowed-tools` on a project skill without treating it as a trust decision — it's an unreviewed repo granting itself permission, not just documentation.
- Chasing a triggering problem by rewriting SKILL.md body content when the actual cause is tier-1 listing-budget truncation cutting the description short — check `/doctor` / `/context` before assuming the description text itself is the problem.

## Sources

- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) — Anthropic, generic cross-product guidance (500-line budget, progressive disclosure patterns, evaluation-driven development, naming/description rules).
- [Extend Claude with skills](https://code.claude.com/docs/en/skills) — Claude Code docs, harness-specific mechanics (skill locations/precedence, frontmatter reference, content lifecycle, listing budget, dynamic context injection, `context: fork`, skill-creator plugin, troubleshooting).
- [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — architecture (metadata pre-load, on-demand file reads, no context penalty for unread files).
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — progressive disclosure framing, cited in [claude-code-orchestration-primitives.md](./claude-code-orchestration-primitives.md).
