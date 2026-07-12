---
name: agentic-research-orchestration
description: Architecting agentic research pipelines — orchestrator-worker patterns, depth calibration, validation techniques
type: research
---

# Agentic Research Orchestration

Prepared 2026-07-11. Compiled from a background research pass across Anthropic's multi-agent research system writeup, GPT-Researcher, Stanford STORM, and OpenAI's Deep Research system card. Rendered version: https://claude.ai/code/artifact/2db24044-32eb-40d8-8baa-def9d2b7efb5

**how to apply:** consult when designing, evaluating, or discussing an agentic research/orchestration system.

## 1. Orchestration architectures

Four patterns recur, trading coherence against throughput differently:

- **Single-agent ReAct loop** — one agent alternates reason→tool-call→observe. Coherent by construction, no coordination overhead, but serial; stalls once a task needs more than one independent thread of investigation.
- **Orchestrator-worker (lead + parallel subagents)** — Anthropic's production architecture for Claude Research ([anthropic.com/engineering/multi-agent-research-system](https://www.anthropic.com/engineering/multi-agent-research-system)). A `LeadResearcher` decomposes the query, spins up 3–5 subagents in parallel (each firing 3+ tool calls in parallel), each subagent acts as an "intelligent filter" that iteratively searches and condenses before reporting back. The lead synthesizes, decides whether to spawn more subagents or refine strategy, then hands off to a dedicated `CitationAgent`. Cut research time by up to 90% for complex queries — at a real cost: single agents use ~4× the tokens of a normal chat turn, multi-agent systems ~15×. Anthropic found token usage alone explains 80% of performance variance on their BrowseComp eval (tool calls + model choice explain the remaining 15%); upgrading model quality beat doubling token budget. Multi-agent Opus 4 (with Sonnet 4 subagents) beat single-agent Opus 4 by 90.2% on their internal eval.
- **Plan-and-execute** — GPT-Researcher's default: a planner explodes the query into sub-questions up front, executors run largely independently against that fixed plan, a publisher aggregates. Cheaper and more predictable than orchestrator-worker (no live re-planning loop), but less adaptive — can't redirect based on early findings. GPT-Researcher's LangGraph multi-agent mode adds explicit roles (chief editor, researcher, reviewer, reviser, writer, publisher) for higher-rigor runs. ([github.com/assafelovic/gpt-researcher](https://github.com/assafelovic/gpt-researcher))
- **Iterative deepening / STORM-style multi-perspective simulation** — Stanford's STORM simulates multiple perspectives interviewing a topic expert (grounded in web sources) to surface an outline before writing, rather than parallelizing workers. Optimized for coherent long-form synthesis (Wikipedia-style articles): +25% organization, +10% coverage over outline-driven RAG baselines in human eval. ([github.com/stanford-oval/storm](https://github.com/stanford-oval/storm))

**Context pollution** is the main failure mode orchestrator-worker architectures must engineer around: Anthropic's lead agent externalizes its plan to memory before context fills (truncation past 200K tokens), and subagents summarize completed phases rather than passing raw transcripts back up.

## 2. Strategy by topic type

Combining Anthropic's scaling rules with query-classification literature (Spotify's agentic query understanding work, the WideSearch benchmark) yields a practical mapping:

- **Narrow factual lookup** → single agent, 3–10 tool calls, no subagent spawn.
- **Direct comparison (A vs B)** → 2–4 subagents, one per entity/side, 10–15 calls each.
- **Broad survey/landscape** → 10+ subagents with explicitly non-overlapping responsibilities; start with short, broad queries, evaluate what's available, then progressively narrow — Anthropic flags overly-specific first queries as a failure mode that starves results.
- **Contested/controversial topic** → structure by viewpoint, not sub-topic — STORM's multi-perspective interview mechanism: assign each subagent a stance, force explicit contradiction-surfacing at synthesis rather than letting one agent silently pick a side.
- **Fast-moving/recency-sensitive topic** → bias tool choice and prompts toward date-filtered/live search over static knowledge; shorten the "trust window" for older sources.
- **Technical/code-level investigation** → prefer specialized tools over generic web search (docs, repos, package registries) when a dedicated API/index exists; keep it closer to single-agent ReAct since code investigations are usually sequentially dependent and parallelize poorly.

## 3. Calibrating depth

Anthropic's scaling table is essentially a budget-based approach keyed to a manually-assessed complexity tier (simple / comparison / complex), not a learned classifier. The "Deep Research Agents" survey ([arxiv.org/pdf/2506.18096](https://arxiv.org/pdf/2506.18096)) generalizes this into named stopping mechanisms:

- Token/compute budgets capping total inference per query
- Search iteration caps (max query count)
- Confidence thresholds — stop once marginal new information drops below a bar
- Time constraints for deployment SLAs
- Variable-depth exploration — more cycles for high-uncertainty subtopics, one shallow pass for straightforward claims (depth as a function of disagreement/uncertainty across sources, not topic size)

GPT-Researcher operationalizes depth more crudely but concretely: ≥20 sources aggregated per report as a triangulation floor, report-length knobs, and a configurable depth/breadth parameter for its recursive "Deep Research" mode (~5 min/cycle) trading latency for thoroughness directly.

**Practical rule**: pick an effort tier at plan time from cheap signals (facet count in the query, whether sources disagree in the first pass, report vs. answer intent) — then let a live diminishing-returns check (is subagent N+1 returning anything not already covered by N?) cut the loop short even inside a high-tier budget. Anthropic's team validated this qualitatively by watching full execution traces rather than trusting automatic metrics alone.

## 4. Validating results

- **Citation grounding as a distinct pipeline stage** — Anthropic runs a dedicated `CitationAgent` after the research loop to map claims → source locations, rather than trusting inline citations generated mid-synthesis (which drift/hallucinate under load).
- **Cross-source corroboration/triangulation** — GPT-Researcher aggregates 20+ sources and favors the most frequent claim. Cheap and effective for factual claims; weak for genuinely contested topics (echo chambers can inflate frequency without independence).
- **Contradiction detection** — treated as a first-class signal, not an error: flag disputed claims and present multiple viewpoints rather than silently resolving them (STORM's whole architecture; also listed as a standard module in the Deep Research Agents survey).
- **Critic/verifier agents (LLM-as-judge)** — Anthropic's eval harness scores 0.0–1.0 against a rubric (factual accuracy, citation accuracy, completeness, source quality, tool efficiency); most consistent, human-aligned automatic check they found. ~20 test queries was enough to detect prompt-change effects early because effect sizes were large.
- **Self-verification / Chain-of-Verification** — agents re-derive and check their own claims via structured re-querying rather than free-form re-reading ([arxiv.org/html/2509.18970v1](https://arxiv.org/html/2509.18970v1)).
- **Multi-agent role separation for QA** — generator / fact-checker / citation-checker / logic-checker as distinct agents so no single pass has to catch everything at once.
- **Human eval as an irreducible layer** — Anthropic is explicit that manual testing caught hallucinations, systemic failures, and subtle source-selection biases (e.g. agents preferring SEO content farms over academic PDFs) that automated evals missed entirely.

## 5. Mapping the human research process

| Human step | Agentic equivalent | Who does it in practice |
|---|---|---|
| Clarify the question | Interactive clarification turn before planning | OpenAI Deep Research ([system card](https://openai.com/index/deep-research-system-card/)) |
| Scope & plan | Lead/planner agent decomposes into sub-questions, sets subagent count via complexity tier | Anthropic LeadResearcher; GPT-Researcher planner |
| Survey the landscape | Broad, short first-pass queries before narrowing | Anthropic's "start wide" prompting rule |
| Identify key sources | Tool-selection heuristics (specialized tool > generic search when available) | Anthropic tool-design principle |
| Deep-dive | Parallel subagents each act as filters, iterating tool calls until saturation | Anthropic and GPT-Researcher executors |
| Synthesize | Lead agent compiles subagent reports into a draft | LeadResearcher / GPT-Researcher publisher |
| Identify gaps, iterate | Lead agent decides "more research needed?" and re-spawns or refines | Anthropic's explicit loop-back step; OpenAI's adaptive iterative workflow |
| Write up with citations | Separate citation/attribution pass, distinct from drafting | Anthropic CitationAgent (post-hoc); STORM (more integrated, during outline curation) |

STORM is the outlier worth naming separately: it front-loads "identify key sources / survey landscape" into a simulated multi-perspective interview rather than raw search-and-summarize — arguably the closest agentic analogue to how a human researcher actually canvasses disagreement before writing.

## If you were to build this

**Architecture**: orchestrator-worker as the default (lead agent + parallel subagents), not plan-and-execute — the only pattern here with hard, published numbers (90% latency cut, 90.2% quality gain over single-agent) backing it, provided ~15× token cost over a single chat turn is affordable. Fall back to single-agent ReAct only for narrow lookups where spawning subagents is pure overhead.

**Depth calibration rule**: classify query complexity at plan time into 3 tiers (simple/comparison/complex → 1 agent·3–10 calls / 2–4 agents·10–15 calls / 10+ agents) as a budget ceiling, but don't just run the budget out — add a live diminishing-returns check where each new subagent's findings are diffed against what's already known, and truncate early once new subagents stop contributing novel information. Bias uncertain/contested subtopics toward the higher tier regardless of overall query classification.

**Validation step**: run citation/fact-checking as a separate, dedicated pass after the research loop closes (citation-mapping agent), backed by a cross-source corroboration check during research (flag single-source claims as lower-confidence) and explicit contradiction-surfacing rather than silent resolution for anything contested. Evaluate the whole pipeline with an LLM-judge rubric (factual accuracy, citation accuracy, completeness, source quality) on a small (~20) query set early, but keep a human-in-the-loop spot-check — that's where source-selection bias and hallucinations actually get caught.

## 6. Token efficiency: quality budget vs. conservation

This memo treats token spend as a **quality/latency budget to calibrate**, not a quantity to minimize — the default recommendation (orchestrator-worker, ~15× a single chat turn) is justified by hard published quality/latency gains, tempered only by the diminishing-returns cutoff and tiered budgets in §3, not by a conservation goal.

That's a different objective from [token-usage-optimization](./token-usage-optimization.md), the standing preference to conserve *personal Claude Code plan usage*. The two aren't contradictory — this memo is scoped to architecting a dedicated research product/pipeline (e.g., building a research agent as a deliverable), where token cost is a line item traded against output quality for an end user of that product. It is not directly a playbook for how *I* (Claude Code, in this session) should research something for you.

**Reconciliation when applying this memo's ideas inside a Claude Code session** (rather than building a standalone research system): default toward the cheaper end of these patterns — single-agent ReAct or a couple of forked subagents rather than defaulting straight to 10+-subagent orchestrator-worker — and lean harder on the diminishing-returns cutoff to stop early. Reserve the full multi-agent architecture for when the task genuinely is "build/operate a research pipeline," where the quality gains are the point.

## Sources

- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [GPT-Researcher (assafelovic)](https://github.com/assafelovic/gpt-researcher)
- [Stanford STORM](https://github.com/stanford-oval/storm)
- [OpenAI — Deep Research system card](https://openai.com/index/deep-research-system-card/)
- [Deep Research Agents survey](https://arxiv.org/pdf/2506.18096)
- [Hallucination-mitigation survey](https://arxiv.org/html/2509.18970v1)
- [WideSearch benchmark](https://arxiv.org/pdf/2508.07999)
