---
name: deep-research
description: Multi-angle deep research using the temporal validity matrix. Spawns five parallel agents (one per angle), cross-references findings, produces a cited report, and saves it to the library. Invoke with /deep-research [topic]. Use when thorough, multi-source research is needed before making a technical or strategic decision.
---

# Deep Research

Research `$ARGUMENTS` thoroughly using the temporal validity matrix framework. This produces a cited, cross-referenced report and saves it to the library.

---

## Step 0 — Library Check First

Before doing any research, check whether this topic has already been investigated. Read `library/CATALOG.md` and scan for documents matching the topic. If a relevant document exists, report its LIB-ID and abstract, then ask the user whether to use the existing research, update it, or proceed with a full fresh run.

---

## Step 1 — Spawn Five Parallel Research Agents

Use the Agent tool to spawn five forks simultaneously in a single message. Each investigates one angle of the temporal validity matrix for `$ARGUMENTS`. Do NOT run these sequentially — all five must launch at once.

**Angle A — Established (works today, worked before):**
Research what approaches, tools, or patterns related to `$ARGUMENTS` are well-established and still valid today. Run 2–3 WebSearch queries from different angles. WebFetch the top 2 full articles per query — read the full page, not just the snippet. Synthesize: what works, why it's durable, and evidence of longevity.

**Angle B — Deprecated (worked before, no longer does):**
Research what used to work for `$ARGUMENTS` but has been deprecated, superseded, or broken by changes. WebSearch with terms like "deprecated", "removed", "no longer supported", "breaking change". WebFetch 2 full articles. Synthesize: what changed, when, and what replaced it.

**Angle C — Failed approaches (never worked):**
Research what approaches for `$ARGUMENTS` were tried and didn't work, or are commonly believed to work but don't. WebSearch for "pitfalls", "doesn't work", "misconceptions", "anti-pattern". WebFetch 2 full articles. Synthesize: what fails and the root cause.

**Angle D — Newly viable (didn't work before, now does):**
Research what recently became possible or practical for `$ARGUMENTS` that wasn't before — due to new tools, updated APIs, changed constraints, or ecosystem shifts. WebSearch with current year, "new in", "now supports", "recently added". WebFetch 2 full articles. Synthesize: what changed to make it viable and since when.

**Angle E — Emerging trajectory (not here yet, building toward it):**
Research where `$ARGUMENTS` is heading. WebSearch for roadmaps, open proposals, upcoming releases, future plans, and directional signals. WebFetch 2 full articles. Synthesize: what's in progress, what signals point toward it, and the confidence level (proposal vs. committed roadmap vs. speculation).

---

## Step 2 — Synthesize Cross-Agent Findings

After all five agents complete, synthesize before writing the report:

1. **Cross-reference**: Claims that appear across multiple angles carry higher confidence. Note them explicitly.
2. **Contradictions**: If angles conflict, flag it — do not silently pick one.
3. **Connections**: Note where angles explain each other (e.g., something deprecated in B is what made D newly viable).
4. **Gaps**: An angle that returned thin or no results is itself a finding — sparse coverage signals uncertain or under-documented territory.

---

## Step 3 — Produce the Report

Read `library/TEMPLATE.md` now. Find the `research-note` section — use its acceptance criteria and template exactly. Write the full report including frontmatter. Do not write from memory; read the file, then write.

---

## Step 3.5 — Quality Gate

Check every item in the **Acceptance criteria** list under `## research-note` in `library/TEMPLATE.md`. Fix any failures before proceeding. Do not pass a report that fails any criterion.

---

## Step 4 — Save to Library

Invoke the librarian agent and pass the full report. The librarian assigns the LIB-ID, verifies compliance against `library/TEMPLATE.md`, and updates `CATALOG.md`. Do not write to `library/` directly.
