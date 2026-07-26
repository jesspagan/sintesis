# Review instructions for this repo

sintesis is a minimal, solo-maintained repository of durable research memos (see `AGENTS.md` and `.claude/skills/research/SKILL.md` for the authoring conventions). When reviewing a PR here:

- Match existing sibling files' register and formatting exactly, not an abstract style rule — e.g. every memo's `description:` frontmatter value starts capitalized; field names in backtick-quoted lists are punctuated consistently (`field:`, not `field`). Check the other files in `research/` before flagging an inconsistency.
- Don't suggest adding enforcement tooling (lint scripts, CI checks, pre-commit hooks, stub/index files) — this repo deliberately has none. It previously built exactly that kind of governance and removed it as disproportionate for a solo-maintained repo; see [`research/hooks-and-harnesses.md`](../research/hooks-and-harnesses.md) §8–9 for the case study.
- A memo's confidence/sourcing notes should describe only what's checkable from the persisted file itself — not external process artifacts (sub-research transcripts, prior session details) a future reader won't have access to.
- Prefer primary sources over Wikipedia/secondary summaries when a primary source is easy to find; when only a secondary source was used for a well-established, non-contested claim, flag it in the memo's own confidence notes rather than requiring a source swap.
- Wording/punctuation nitpicks are fine to raise, but shouldn't be treated as blocking on their own in this low-traffic repo — call out substance issues (factual accuracy, actual inconsistency) as the priority.
