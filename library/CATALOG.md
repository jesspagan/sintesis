# Library Catalog
*The finding aid for the sintesis library. Maintained exclusively by the Librarian. Read-only for all other agents and users.*

---

## About This Library

This is a **special library** — a curated, closed collection of research documents relevant to the sintesis project. It is not a general-purpose knowledge base. Every document here was acquired deliberately, cataloged precisely, and is maintained for active use.

**Scope**: Development tooling, AI/LLM usage, workflow optimization, and technical reference relevant to this codebase.

**Not in scope**: General programming tutorials, documentation that lives in official docs, ephemeral notes, or anything obtainable more authoritatively elsewhere.

---

## Collection Index

| ID | Title | Subjects | Type | Dates | Abstract |
|----|-------|----------|------|-------|----------|
| LIB-001 | [Claude Code Token Efficiency — Complete Reference Guide](claude-code-token-efficiency.md) | `claude-code` `tokens` `context-management` `prompt-caching` `cost-optimization` | reference-guide | 2026-06-16 / 2026-06-16 | Comprehensive guide to managing context window usage in Claude Code: caching behavior, commands (/clear, /compact, /btw), deprecated features, Pro vs Max thresholds, and anti-patterns that waste tokens. |
| LIB-002 | [Library Science Principles for Digital Special Collections](library-science-principles.md) | `knowledge-management` `agents` `workflow` `tokens` | research-note | 2026-06-16 / 2026-06-16 | Core library science principles adapted for a small, closed codebase library: why special collections use flat structure over hierarchies, how finding aids beat search boxes, the reference interview model, collection development gating, MUSTIE weeding, and the token efficiency payoff of each principle. |
| LIB-003 | [Claude Code Agent Design Patterns — Reference Guide](claude-code-agent-design-patterns.md) | `agents` `claude-code` `workflow` `tokens` | reference-guide | 2026-06-17 / 2026-06-18 | Comprehensive reference for designing Claude Code subagents and skills: complete agent frontmatter spec, skill file format and $ARGUMENTS substitution, tool grants and authority enforcement, agents vs skills vs CLAUDE.md decision framework, parallel execution costs, nested agents, fork mechanics, testing patterns, and the agent-creator meta-pattern. |
| LIB-004 | [Claude Code Deep Research Features — Subscription Tiers & Architecture](claude-code-deep-research-features.md) | `claude-code` `workflow` | reference-guide | 2026-06-18 / 2026-06-18 | Reference guide to the two architecturally distinct deep-research features in Claude's ecosystem — the Claude.ai Research Toggle (web UI, Pro+) and the /deep CLI command (Max or API subscription) — covering subscription gates, behavioral differences, and how to replicate the parallel-agent research pattern on a Pro subscription. |
| LIB-005 | [Design Token Naming Conventions — Primitive, Generic, and Semantic Tier Architecture](design-token-naming-conventions.md) | `design-system` `workflow` `knowledge-management` | research-note | 2026-11-08 / 2026-11-08 | Three-angle temporal validity matrix investigation into how major design systems (Shopify Polaris, GitHub Primer, Atlassian, Material Design 3, Adobe Spectrum, MUI) name tokens across primitive, semantic, and component tiers. The industry has converged on a three-tier primitive → semantic → component structure with role-based (not value-based) naming at the semantic layer. The W3C Design Tokens Community Group published a stable spec (DTCG 2025.10) that standardizes the JSON format and alias syntax but deliberately excludes tier naming conventions — leaving "Primitive / Semantic / Component" as an ecosystem-level standard, not a spec-level one. |
| LIB-006 | [Research Methodology — How Researchers Do Research](research-methodology-how-researchers-do-research.md) | `knowledge-management` `workflow` `agents` | research-note | 2026-06-18 / 2026-06-18 | Five-angle temporal validity matrix research into how researchers do research: established durable practices (scientific method, systematic reviews, validity/reliability, PRISMA/GRADE), superseded practices driven by the replication crisis (HARKing, p-hacking, closed data, NHST-only), failed approaches and their cognitive/structural root causes (confirmation bias, cherry-picking, data dredging), newly viable AI-assisted methods (LLM-powered SLR, semantic citation graphs, RAG hypothesis generation, preprint-first mandates), and the emerging trajectory (agentic pipelines, multi-agent research teams, adversarial red-teaming as rigor layer, the evaluation gap). Includes cross-referenced implications for improving an AI research agent. |

*Dates column: `created / updated`. Same date means never revised after initial cataloging.*

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
- `design-system` — design token architecture, naming conventions, component systems, style dictionaries

---

## Document Format Standard

See `library/TEMPLATE.md` for the complete format spec for currently defined document types, acceptance criteria, and field ownership. TEMPLATE.md is the sole authority — this file does not duplicate it.

---

## Access Policy

| Role | CATALOG.md | Document files | Add/Edit/Remove |
|------|-----------|----------------|-----------------|
| Librarian | Read + Write | Read + Write | Yes |
| Any other agent | Read-only | Read-only | No |
| User (direct) | Read | Read | Via Librarian only |

The Librarian is the **sole authority** over collection changes. Other agents may read any document but must route all modification requests through the Librarian.

---

*Last updated: 2026-06-18 by Librarian — split single Date column into Dates (`created / last-updated`) across all collection index rows; added Dates column guidance note; prior: rewrote TEMPLATE.md (agent-optimized); consolidated Document Format Standard to TEMPLATE.md (sole authority); fixed LIB-003 frontmatter date; reclassified LIB-004 from research-note to reference-guide and restructured body for lookup*
