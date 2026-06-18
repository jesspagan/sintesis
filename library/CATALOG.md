# Library Catalog
*The finding aid for the sintesis library. Maintained exclusively by the Librarian. Read-only for all other agents and users.*

---

## About This Library

This is a **special library** — a curated, closed collection of research documents relevant to the sintesis project. It is not a general-purpose knowledge base. Every document here was acquired deliberately, cataloged precisely, and is maintained for active use.

**Scope**: Development tooling, AI/LLM usage, workflow optimization, and technical reference relevant to this codebase.

**Not in scope**: General programming tutorials, documentation that lives in official docs, ephemeral notes, or anything obtainable more authoritatively elsewhere.

---

## Collection Index

| ID | Title | Subjects | Type | Date | Abstract |
|----|-------|----------|------|------|----------|
| LIB-001 | [Claude Code Token Efficiency — Complete Reference Guide](claude-code-token-efficiency.md) | `claude-code` `tokens` `context-management` `prompt-caching` `cost-optimization` | reference-guide | 2026-06-16 | Comprehensive guide to managing context window usage in Claude Code: caching behavior, commands (/clear, /compact, /btw), deprecated features, Pro vs Max thresholds, and anti-patterns that waste tokens. |
| LIB-002 | [Library Science Principles for Digital Special Collections](library-science-principles.md) | `knowledge-management` `agents` `workflow` `tokens` | research-note | 2026-06-16 | Core library science principles adapted for a small, closed codebase library: why special collections use flat structure over hierarchies, how finding aids beat search boxes, the reference interview model, collection development gating, MUSTIE weeding, and the token efficiency payoff of each principle. |
| LIB-003 | [Claude Code Agent Design Patterns — Reference Guide](claude-code-agent-design-patterns.md) | `agents` `claude-code` `workflow` `tokens` | reference-guide | 2026-06-17 | Comprehensive reference for designing Claude Code subagents: complete frontmatter spec, tool grants and authority enforcement, agents vs skills vs CLAUDE.md decision framework, parallel execution costs, nested agents, fork mechanics, testing patterns, and the agent-creator meta-pattern. |

---

## Subject Index

*Controlled vocabulary for this collection. The Librarian assigns subjects from this list; new subjects are added only when no existing term fits.*

- `claude-code` — Claude Code CLI features, behavior, configuration
- `tokens` — token counting, context limits, input/output costs
- `context-management` — managing what's in the context window across sessions
- `prompt-caching` — Anthropic prompt cache mechanics and TTLs
- `cost-optimization` — reducing API costs and session spend
- `agents` — sub-agents, orchestration, agent design patterns
- `mcp` — Model Context Protocol, MCP servers, tool definitions
- `workflow` — development workflow, productivity patterns
- `git` — version control, branching, commit practices
- `testing` — test strategy, test frameworks, CI
- `knowledge-management` — library organization, collection policy, cataloging, findability

---

## Document Format Standard

Every document in the library **must** open with this frontmatter block:

```
---
lib-id: LIB-NNN
title: Full Document Title
subjects: [subject-one, subject-two]
type: reference-guide | research-note | decision-record | how-to
date: YYYY-MM-DD
abstract: One to three sentences. Must be self-contained — readable without opening the file.
---
```

Followed immediately by `# Title` as the H1 heading and `*Researched Month Day, Year*` on the next line.

---

## Access Policy

| Role | CATALOG.md | Document files | Add/Edit/Remove |
|------|-----------|----------------|-----------------|
| Librarian | Read + Write | Read + Write | Yes |
| Any other agent | Read-only | Read-only | No |
| User (direct) | Read | Read | Via Librarian only |

The Librarian is the **sole authority** over collection changes. Other agents may read any document but must route all modification requests through the Librarian.

---

*Last updated: 2026-06-17 by Librarian — added LIB-003, added no new subjects*
