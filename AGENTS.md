# sintesis

A repository of research memos — durable findings meant to be consulted when relevant, not read start to finish every session. Each file in `research/` is self-contained: frontmatter (`name`, `description`, `type`, plus optional `tags`/`status`/`supersedes`/`superseded_by` fields — see [SKILL.md](.claude/skills/research/SKILL.md)) plus a `**how to apply:**` line stating when to consult it.

Treat the index as a starting point, not a single-keyword lookup: a question can be relevant to more than one memo, so scan for all plausibly-relevant entries and open each before answering, rather than stopping at the first title match.

## Index

- [token-usage-optimization.md](research/token-usage-optimization.md) — conserve token/usage limits; apply by default
- [agentic-research-orchestration.md](research/agentic-research-orchestration.md) — architecting agentic research pipelines; consult when designing one
- [claude-code-orchestration-primitives.md](research/claude-code-orchestration-primitives.md) — main thread vs. skill vs. agent; consult before delegating
- [authoring-token-efficient-skills.md](research/authoring-token-efficient-skills.md) — how to write a Skill; consult before authoring/reviewing one
- [pre-commit-review-orchestration.md](research/pre-commit-review-orchestration.md) — hooks/review patterns for pre-commit gates; consult when auditing one
- [hooks-and-harnesses.md](research/hooks-and-harnesses.md) — hook taxonomy, cross-framework comparison, governance landscape; consult when writing/evaluating a hook
- [agentic-commit-and-pr-verbosity.md](research/agentic-commit-and-pr-verbosity.md) — why agentic commit/PR text runs long; vendor specs and terseness levers
- [libraries-as-knowledge-institutions.md](research/libraries-as-knowledge-institutions.md) — library science for KB curation; consult when designing one
