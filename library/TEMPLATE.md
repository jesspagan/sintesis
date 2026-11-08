# Library Document Templates

*Sole authority: Librarian. Read-only for all others. Meta-file — no LIB-ID frontmatter required.*

---

## Document Types

| Type | Use when |
|---|---|
| `research-note` | Multi-angle investigation using the temporal validity matrix |
| `reference-guide` | Stable reference: specs, options, lookup tables |
| `decision-record` | Specific architectural or workflow decision |
| `how-to` | Step-by-step procedure for a recurring operation |

*Only `research-note` has a defined template currently. Other types are added on demand.*

---

## research-note

### Field ownership

| Field | Filled by |
|---|---|
| `lib-id` | Librarian at ingestion |
| `type` | Researcher (always `research-note`) |
| `created` | Librarian at ingestion |
| `updated` | Librarian at revision — same as `created` if never revised |
| `title`, `subjects`, `abstract` | Researcher |
| All body sections | Researcher |

### Acceptance criteria

1. Frontmatter complete: all seven required fields present (lib-id, title, subjects, type, created, updated, abstract). Fields showing `[Librarian assigns]` are valid in researcher drafts.
2. All inline citations use `[Title](URL)` format — no bare URLs, no footnotes
3. Every angle section (A–E) has ≥ 2 inline citations
4. Summary is self-contained: states conclusions, not topics covered
5. All four Cross-Reference Notes subsections present (High-Confidence Findings, Contradictions, Gaps, Inter-Angle Connections); sections with no findings use `[None found]`
6. Implications for sintesis contains ≥ 1 specific, actionable recommendation (not "consider X")
7. No angle section is blank — thin coverage goes under Gaps in Cross-Reference Notes
8. Sources section present with ≥ 1 cited URL

### Template

```
---
lib-id: [Librarian assigns]
title: [Descriptive — not "Research on X"]
subjects: [terms from CATALOG.md controlled vocabulary]
type: research-note
created: [Librarian assigns — date first cataloged]
updated: [Librarian assigns — date last revised; same as created if never revised]
abstract: [1–3 sentences: topic + method + single most important finding. No "This document".]
---

# [title]

*Researched [Month Day, Year]*

---

## Summary
[3–5 sentences. Conclusions, not topics. Self-contained.]

## Angle A — Established
[What works today and has always worked. Why durable. Evidence of longevity. Citations.]

## Angle B — Deprecated
[What worked before, no longer does. What changed and when. What replaced it. Citations.]

## Angle C — Failed Approaches
[What doesn't work. Root cause — not just "it fails" but why. Citations.]

## Angle D — Newly Viable
[What recently became possible. What changed. Since when. Newly viable ≠ universally adopted. Citations.]

## Angle E — Emerging Trajectory
[Where this is heading. Label each signal: proposal / committed roadmap / speculation. Citations.]

## Cross-Reference Notes

### High-Confidence Findings
[Claims appearing in ≥ 2 independent angles. State the claim and which angles confirmed it.]

### Contradictions
[Angles that conflict. Do not silently pick one.]

### Gaps
[Angles with thin coverage. Sparse coverage is a finding, not a failure.]

### Inter-Angle Connections
[Where one angle explains another. Often contains the most actionable insight.]

## Implications for sintesis
[Specific and actionable. Not "consider X" — "do X because of finding Y".]

## Sources
- [Title](URL)
```

---

*Last updated: 2026-06-18 by Librarian — removed reference-guide, decision-record, how-to template sections (added as needed); fixed research-note field ownership table (added type field); reordered acceptance criteria (format rule before count rule); expanded criterion 5 to require all four Cross-Reference Notes subsections with [None found] for empty; added criterion 8 (Sources section required); unified Angle A body guidance with other angles; prior: split date into created + updated; agent-optimized; acceptance criteria before templates; consolidated format spec from CATALOG.md*
