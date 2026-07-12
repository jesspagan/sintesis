---
name: research
description: Research a topic thoroughly — pick a strategy and depth suited to the topic type, validate findings before trusting them, then persist as a memo in this repo's research/ directory. Use when asked to research, investigate, or look into something.
context: fork
---

The point of this skill is doing the research well, not filing the paperwork afterward. Persisting the memo is the last step, not the focus.

## 1. Pick a strategy for the topic type

See [agentic-research-orchestration](../../../research/agentic-research-orchestration.md) §2 for the full mapping. Don't default to one approach for every topic:
- **Narrow factual lookup** — single agent, a handful of tool calls, no subagent spawn.
- **Broad survey** — decompose into sub-questions, parallelize across subagents/forks, synthesize.
- **Contested topic** — deliberately pull from sources that disagree; don't stop at the first source that confirms an answer.
- **Recency-sensitive** — prioritize freshness over authority; check publication/update dates.
- **Technical** — ground claims against primary sources over secondhand summaries. For an actively-developed software system (not a historical/theoretical topic), treat "primary source" as three distinct types pulled separately, not one satisfied by touching any single one: vendor documentation, the actual source code where installable/accessible (not documentation *about* the code), and issue-tracker/community-reported content on gaps between documented and actual behavior. Make this checkable in the finished memo: its Sources section should show all three for this category of topic, or say explicitly when one wasn't available (no public source, no active issue tracker) — the same discipline as flagging when sources disagree rather than silently picking one.

## 2. Calibrate depth

Use a tiered budget and a diminishing-returns check (§2 of the same memo): stop adding sources once new ones stop changing the conclusion, not once you've exhausted search results. More tool calls isn't automatically better — see [token-usage-optimization](../../../research/token-usage-optimization.md) for the cost side of this tradeoff.

## 3. Isolate the noisy part

This skill already runs forked (`context: fork`), so the main thread never sees the search/fetch noise by default — only the finished memo comes back. If the topic is broad enough to split into independent sub-questions, fork further from inside here (nested subagents) and have each report back synthesized findings with citations, not raw transcripts — see [claude-code-orchestration-primitives](../../../research/claude-code-orchestration-primitives.md).

## 4. Validate before writing anything down

Per the "validation techniques" section of the orchestration memo: ground every non-obvious claim in a citable source, corroborate across independent sources where the claim matters, and surface contradictions explicitly rather than silently picking one source when sources disagree.

## 5. Persist the findings

Only after 1–4. Every memo in this repo is a single self-contained file in `research/` — no separate index/stub file, no `[[wikilink]]` syntax. `AGENTS.md` at repo root is the only index; it holds one line per memo, not the content.

```
---
name: <kebab-case-slug, matches filename minus .md>
description: <one line — what the memo covers>
type: research
---

# <Title>

<one or two sentences: when this was produced and what it's grounded in — sources, prior sessions, etc.>

**how to apply:** <one line — when a reader should consult this memo>

## <sections as needed>
```

1. Write `research/<slug>.md` following the format above. Cross-reference other memos with relative markdown links (`[slug](./slug.md)`), never `[[wikilinks]]`.
2. Add one line to the `## Index` in `AGENTS.md`, matching the existing entries: `- [<slug>.md](research/<slug>.md) — <what it covers>; <when to consult it>`. Keep the whole line under ~150 characters — the link markup alone eats ~50-80 of those, so the description has to be terser than it feels like it should be. A hook checks this on save; don't rely on it to catch a bloated line for you.
3. Do not create a `memory/` directory or a per-memo stub file — this repo deliberately keeps one file per memo, not a two-tier index/body split.
