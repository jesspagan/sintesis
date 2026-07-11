---
name: agentic-research-orchestration
description: Pointer to a research memo on architecting agentic research pipelines (orchestrator-worker patterns, depth calibration, validation techniques)
metadata:
  type: reference
---

Full research memo on how to orchestrate agentic research systems lives at `research/agentic-research-orchestration.md` in this repo. Rendered artifact: https://claude.ai/code/artifact/2db24044-32eb-40d8-8baa-def9d2b7efb5

Covers: orchestrator-worker vs. plan-and-execute vs. iterative-deepening architectures, strategy by topic type (narrow lookup / survey / contested / recency-sensitive / technical), depth-calibration heuristics (tiered budgets + diminishing-returns checks), and validation techniques (citation grounding as a separate pass, cross-source corroboration, contradiction-surfacing, LLM-judge rubrics, human spot-checks).

**Why:** Produced 2026-07-11 from a background research pass surveying Anthropic's multi-agent research system writeup, GPT-Researcher, Stanford STORM, and OpenAI's Deep Research system card.

**How to apply:** Consult when designing, evaluating, or discussing an agentic research/orchestration system.
