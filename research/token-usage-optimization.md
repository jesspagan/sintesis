---
name: token-usage-optimization
description: How to conserve Claude Code usage/token limits — playbook for context, delegation, and session hygiene
type: research
---

# Token Usage Optimization

**why:** produced 2026-07-11 after the user asked to research how to optimize token usage "as efficiently and smart as possible" and to persist the result as a standing preference — applies to personal Claude Code plan usage, not API-billing cost optimization for an app the user might be building.

**how to apply:** apply these habits by default, without being asked each time.

1. **Context hygiene.** Don't re-read files just edited/written (Edit/Write already confirm success). Suggest `/clear` when the conversation is pivoting to an unrelated topic rather than letting stale history accumulate.
2. **Delegate noisy exploration.** For open-ended codebase digging (broad grepping, reading many files to answer one question, long test-suite runs), prefer forking (`Agent` with `subagent_type: "fork"`) or the `Explore` agent over doing it inline in the main thread — keeps raw tool output out of the main context. Don't delegate trivial single-file lookups; delegation itself has overhead.
3. **Prefer precise requests over broad ones** — when the user's ask is vague and touches a lot of surface area, it's fine to scope it down via a quick clarifying question rather than doing wide exploratory reads.
4. **Use Plan mode for multi-step work** before executing, to avoid expensive rework from a wrong initial approach.
5. **Never poll for background/async task completion** — rely on the harness's automatic completion notifications instead of repeated manual checks.
6. **Persist durable facts to memory** (or, in this repo, to `research/`) instead of re-deriving or re-asking about them each session.
7. **Batch related asks** rather than one-thing-at-a-time round trips when the user's intent is already clear.
