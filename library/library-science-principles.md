---
lib-id: LIB-002
title: Library Science Principles for Digital Special Collections
subjects: [knowledge-management, agents, workflow, tokens]
type: research-note
created: 2026-06-16
updated: 2026-06-16
abstract: Core library science principles adapted for a small, closed codebase library: why special collections use flat structure over hierarchies, how finding aids beat search boxes, the reference interview model, collection development gating, MUSTIE weeding, and the token efficiency payoff of each principle.
---

# Library Science Principles for Digital Special Collections

*Researched June 16, 2026*

---

## Core Insight: Special Libraries Are Not General Libraries

Dewey Decimal and Library of Congress classifications are designed for universal knowledge. Special libraries — law firms, hospitals, research units — organize differently: **flat or shallow structure with rich subject metadata** rather than deep folder hierarchies. For a small, closed collection, the catalog (finding aid) is the navigation layer, not the directory tree.

**Applied here**: `library/` is a flat directory. All navigation happens through `CATALOG.md` and controlled subject terms, not subfolders.

---

## The Finding Aid Beats the Search Box

Archives discovered this before libraries did: a well-structured finding aid lets a researcher navigate an entire collection without reading individual documents. The key elements:

- **Abstract per item**: self-contained, answerable without opening the file
- **Controlled subject terms**: consistent vocabulary across all entries
- **Sequential ID**: enables precise citation and cross-reference
- **Type field**: separates reference guides from research notes from decision records

**Applied here**: `CATALOG.md` is the finding aid. The librarian reads it first on every operation. A well-written abstract answers most "do we have X" questions without opening any document.

---

## The Reference Interview

A librarian's most critical skill is the **reference interview** — not answering the question asked, but understanding the question meant. The patron says "do you have anything on tokens?" but means "I'm hitting rate limits mid-session and need to know when to compact."

Steps:
1. Clarify scope: quick answer, full document, or pointer to a section?
2. Search the catalog's abstracts before opening any file
3. Open and quote the specific section that answers the real question
4. Cite the document ID and section heading so the patron can find it themselves

**Applied here**: the librarian agent follows this flow. It never just returns a filename — it surfaces the answer and cites the source.

---

## Collection Development: The Librarian as Gatekeeper

Every real library has a **collection development policy** — a definition of scope that determines what gets acquired. Without it, the collection becomes a dumping ground and retrieval degrades.

The four gates (all must pass):
1. **In scope** — relevant to the defined collection scope
2. **Not already authoritative online** — don't duplicate what official docs cover better
3. **Synthesized insight** — not raw information that could be fetched on demand; must contain analysis or curation
4. **Will be consulted again** — not a one-off answer

**Applied here**: the librarian applies this test before adding anything, including requests from other agents.

---

## MUSTIE Weeding

An outdated document returned in a search is worse than no document — it costs a correction loop. MUSTIE criteria flag documents for removal or update:

| Letter | Criterion | Action |
|--------|-----------|--------|
| M | **Misleading** — information now known to be wrong | Update or remove |
| U | **Ugly** — so poorly structured it hinders use | Fix the structure |
| S | **Superseded** — a newer document covers the same ground | Remove or merge |
| T | **Trivial** — too shallow to justify the catalog entry | Remove |
| I | **Irrelevant** — no longer within project scope | Remove |
| E | **Elsewhere** — more authoritatively available in official docs | Remove |

Preference order: **update > merge > remove**. Removal is the last resort.

---

## Access Control: Read for Everyone, Write for One

Every real library enforces this asymmetry: patrons read, librarians write. This protects collection integrity — a document written by anyone is cataloged by no one.

**Applied here**: the `library/` directory is read-only for all agents except the librarian. All modification requests route through the librarian, which applies the Collection Development Test and maintains catalog consistency.

---

## Controlled Vocabulary vs. Free Tags

Free tags are more discoverable but inconsistent — the same concept gets five different spellings. Controlled vocabulary (like Library of Congress Subject Headings) ensures the same concept always has one term, enabling precise retrieval across the whole collection.

**Applied here**: subjects are drawn from the controlled vocabulary in `CATALOG.md`. The librarian may add new terms only when no existing term fits, and adds them to the Subject Index at the same time.

---

## Token Efficiency Payoff by Principle

| Library principle | Token efficiency payoff |
|---|---|
| CATALOG.md as finding aid | One small stable file answers most lookups — no Glob + multi-Read required |
| Abstracts as pre-answers | Quick lookups resolve at the catalog row; no document open needed |
| Quote sections, not documents | Retrieval outputs only the relevant excerpt |
| Stable catalog = cacheable | CATALOG.md doesn't change between reads; strong prompt cache candidate |
| MUSTIE weeding | Accurate collection = first-result accuracy = no correction loops |
| Scope enforcement | Small library = fast catalog reads = low token cost per lookup |
| Collection Development Test | Prevents catalog bloat that would make the finding aid itself expensive to read |
