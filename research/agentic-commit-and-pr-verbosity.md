---
name: agentic-commit-and-pr-verbosity
description: Why agentic commit messages and PR descriptions run longer than human ones, what vendors actually specify, and concrete levers to make them terser
type: research
tags: [commits]
---

# Agentic commit message and PR description verbosity

Prepared 2026-07-11, in response to a direct observation that this session's own commits/PRs (and agentic tools generally) read as noticeably more verbose than typical human-written ones. Grounded in this session's own system-prompt instructions (a primary, verifiable source), Anthropic's public Claude Code docs, GitHub Copilot/Devin/Cursor documentation, two 2026 papers proposing extensions to Conventional Commits for agent consumption, and a web pass on reviewer-fatigue commentary.

**how to apply:** consult when deciding how verbose a commit message or PR description should be for agent-authored changes, when writing a CLAUDE.md/PR-template rule to control that verbosity, or when explaining *why* agentic output defaults toward over-explaining. Complements [pre-commit-review-orchestration](./pre-commit-review-orchestration.md) (the *process* around reviewing agent-written changes) and [hooks-and-harnesses](./hooks-and-harnesses.md) (enforcement mechanisms) — this memo is specifically about commit/PR *content format and length*, not the review pipeline around it.

## 1. The core finding: vendors already instruct brevity; models over-explain anyway

The clearest evidence available is this session's own system prompt, which is about as primary a source as exists for "what does Claude Code actually tell the model to do." It explicitly instructs brevity at every level:

- Commit messages: "Draft a concise (1-2 sentences) commit message that focuses on the 'why' rather than the 'what'."
- PR titles: "Keep the PR title short (under 70 characters)... Use the description/body for details, not the title."
- PR bodies: a fixed template — `## Summary` (1-3 bullet points) + `## Test plan` (a checklist) + a one-line attribution footer — not free-form prose.
- Explicit style-matching instruction: analyze `git log` and follow *this repository's* existing commit style, not a generic default.

This is a materially terser spec than what most human teams write down as convention (most don't specify a bullet-count ceiling or a title character limit at all). Yet the observation motivating this research — that agentic output still reads as more verbose than human output — holds up against independent sources on *why* LLMs over-explain, none of which are specific to commits/PRs but all of which apply directly:

- **Training-data bias**: the corpus an LLM learns from is disproportionately "explanatory, instructional, SEO-shaped, academic-ish, corporate, pedagogical, or review-like" — that register generalizes into the model's default writing stance for *any* task, commits included ([Hybrid Copy — "LLMs Overexplain"](https://hybridcopynet.wordpress.com/2026/06/22/llms-overexplain/)).
- **RLHF reward-model bias toward length**: reward models used in RLHF training reward helpfulness, clarity, completeness, and safety — traits "useful for explanation but hostile to prose that depends on implication, compression, omission, and silence" — and researchers have specifically flagged that RMs "might favor more verbose outputs over concise ones," independent of what the prompt asks for (arXiv survey work on verbosity and RLHF, cross-referenced via the Hybrid Copy piece and [Over-Reasoning and Redundant Calculation of LLMs](https://arxiv.org/pdf/2401.11467)).
- **Evaluation gaps**: "did the model know where to stop?" is not a primary target in the benchmarks models are optimized against (math, coding, tool-use, instruction-following) — so models get better at doing the task without getting better at editorial restraint specifically.
- **Assistant/tutor role framing**: a chatbot is implicitly framed as a guide clarifying for a reader, not a terse committer writing for other engineers who'll skim `git log --oneline`; "even when a model produces a good line, the assistant instinct often returns to explain what the line did."
- **A named ceiling on prompting as a fix**: the same source's conclusion is worth taking seriously as a design constraint, not just a complaint — "prompting can reduce surface tics, it cannot reshape the underlying probability distribution." This is consistent with what's observed here: explicit 1-2-sentence, why-not-what instructions exist in the harness prompt, and verbosity is still the reported experience — the instruction narrows the distribution, it doesn't relocate its mode.

**Net read**: this is not primarily a documentation gap (vendors mostly do specify brevity) or a "lack of an internalized brevity norm" gap in the sense of nobody having written the norm down — Claude Code's own prompt *has* the norm written down, explicitly. It's better explained as an emergent model tendency that survives explicit brevity instructions, compounded by structural additions (fixed template sections, attribution footers — see §5) that a terse human commit simply wouldn't include at all.

## 2. What major vendors actually specify

| Tool | Documented commit format | Documented PR format | Verbosity controls |
|---|---|---|---|
| **Claude Code** (this session's system prompt) | 1-2 sentences, why-not-what, match repo's existing `git log` style, `Co-Authored-By:` footer | Title <70 chars; `## Summary` (1-3 bullets) + `## Test plan` (checklist) + attribution footer | Built into the instruction itself (bullet-count and sentence-count ceilings); public [best-practices doc](https://code.claude.com/docs/en/best-practices) only says "commit with a descriptive message" — the concrete format lives in the harness prompt, not the public docs page |
| **GitHub Copilot** | N/A (commit-message generation is a separate, lighter-weight VS Code feature) | Two-part: prose overview paragraph + bulleted list of changes linked to code lines. Files with >400 combined additions/deletions are excluded from summarization. Explicit accuracy disclaimer: "carries the same risks of inaccuracy as the original... always review and assess accuracy before saving or publishing" ([Responsible use of PR summaries](https://docs.github.com/en/copilot/responsible-use/pull-request-summaries)) | No length/verbosity guidance beyond the 400-line-diff exclusion; no documented trim/edit workflow — review-before-publish is the only stated mitigation |
| **Cursor** | Reads the staged diff directly for commit-message generation via the Source Control panel | — | Community forum threads (e.g. [Cursor forum #155785](https://forum.cursor.com/t/rules-for-the-ai-generate-commit-messages/155785)) show active user demand for configurable rules/format — i.e., no strong built-in terseness discipline is documented, users are asking for it |
| **OpenAI Codex CLI** | No published commit-message format spec found; docs emphasize "inspect changes before you commit or open a pull request" (human-in-the-loop, not a format contract) | Same — no published PR-description format spec found | Not documented at the format level |
| **Devin (Cognition)** | Follows `type(scope): short description` when configured via the org's Knowledge Base; otherwise no fixed default documented | Follows the repo's own `.github/pull_request_template.md` if present, or a Devin-specific `devin_pr_template.md`; falls back to "Devin's default PR description format" (undocumented shape) if no template exists. Devin is explicitly described as writing "detailed descriptions of changes" | Verbosity is template-driven — the org supplies the structure via Knowledge Base/PR template rather than Devin defaulting to brevity on its own |

**Reading across the row**: Claude Code and Devin are the two tools with the most concrete documented levers (an explicit sentence/bullet-count instruction for Claude Code; a template-following mechanism for Devin), and both put the terseness decision in the *caller's* hands (harness prompt, or org-supplied template) rather than the model's own judgment — consistent with the "prompting narrows but doesn't relocate the mode" finding in §1: these tools compensate for the model's default tendency with an explicit structural constraint, rather than trusting the model to self-regulate length.

## 3. Conventional Commits and the explain-vs-compress tension

[Conventional Commits](https://www.conventionalcommits.org/) (`type(scope): description`, optional body/footer) predates agentic tooling and is widely referenced by all the tools above as a target format — but it was designed for a world where the *human author* held the tacit reasoning in their head and the commit message only needed to index it, not reconstruct it. Two 2026 proposals argue this is now a mismatch for agent-consumed history, independently converging on the same fix:

- **"Lore" (arXiv, 2603.15566)**: names the gap the "Decision Shadow" — the reasoning behind a change that vanishes once only the diff and a Conventional-Commits-style header survive. A message like `refactor: clean up utils` is "near-zero signal" for an agent that later needs to reconstruct *why* code is shaped the way it is (constraints, rejected alternatives) to avoid re-proposing an already-rejected approach. Its fix: keep the human-readable subject/body terse as today, but push structured reasoning (`Constraints:`, `Rejected:`, `Directives:`, `Confidence:`, `Risk:`) into **git trailers** — a native git mechanism, zero new infrastructure, parseable by tooling and skippable by a human skimming `git log --oneline`.
- **Contextual Commits** ([github.com/berserkdisruptors/contextual-commits](https://github.com/berserkdisruptors/contextual-commits)): the same idea under a different name — an open standard for capturing "the WHY in git history" as structured, typed action lines in the commit body, explicitly designed to stay git-native rather than requiring a separate ADR (architecture decision record) system.

**The tension isn't fully resolved, and the sources say so directly**: skeptics cited in this research argue well-written prose in a commit body already does this job, and structured tagging just adds cognitive overhead without clearly improving on clear natural language — "no one in the AI-assisted development field has resolved this tension" between machine-parseable structured context and human-readable brevity. The practical takeaway for a repo deciding today: **the emerging consensus shape is a two-tier structure — a terse Conventional-Commits-style headline for humans, with agent-reasoning content demoted to an optional trailer/footer section a human reviewer doesn't have to read** — not "make the whole message longer to fit the reasoning in," which is the failure mode this memo's motivating observation is actually describing.

## 4. Industry commentary: real, but aimed at code volume more than message length specifically

Reviewer fatigue from AI-generated changes is a well-documented, actively discussed phenomenon — but the sourcing here is worth being precise about, because most of it is about *code volume and reviewability*, not commit-message/PR-description *text* length specifically:

- An open-source maintainer reported PR volume going from 20-25/week to 100+/week, mostly AI-generated, with review queues doubling then tripling ([ITK Discourse thread](https://discourse.itk.org/t/ai-generated-pull-requests-overwhelming-hard-to-review-carefully/7728); [atomicrobot.com — "AI Writes Better Code. We're Getting Worse at Reviewing It."](https://atomicrobot.com/blog/ai-review-fatigue/)).
- The Godot engine's HN thread on "AI slop pull requests" ([news.ycombinator.com/item?id=47059779](https://news.ycombinator.com/item?id=47059779)) is squarely about submitters not understanding the code they're proposing ("the entire premise behind AI coding is to not have to understand... the code you generate") and maintainer burden from volume — **verbosity of the PR description itself is not named as a complaint in that thread**, which is a useful negative finding: don't over-claim that "AI slop" discourse is fundamentally about prose length; it's substantially about code correctness and submitter accountability.
- A companion HN thread on GitHub considering a "kill switch" for PRs ([news.ycombinator.com/item?id=46884471](https://news.ycombinator.com/item?id=46884471)) and Addy Osmani's framing (cited in [pre-commit-review-orchestration](./pre-commit-review-orchestration.md) §1) that agents produce "roughly four times the code for something like a tenth more delivered value" are both about the same volume/signal problem, one level up from message text.

Where verbosity-*as-such* does show up as a named, addressed problem is in product features, not community backlash threads: JetBrains AI Assistant ships an explicit verbosity slider for generated commit messages ([JetBrains AI-in-VCS docs](https://www.jetbrains.com/help/ai-assistant/ai-in-vcs-integration.html)), and multiple GitHub Marketplace Actions exist specifically to post a *condensed* AI-generated summary as a PR comment rather than relying on the raw generated description. This suggests the terseness problem is treated by the ecosystem as a solvable configuration/tooling detail (turn a dial, pick a template) rather than as a crisis prompting public complaint threads the way code-volume-driven review fatigue has.

## 5. Concrete levers that reliably produce terser output

Ranked roughly by how directly they constrain length (structural constraints beat vague instructions, consistent with the "prompting narrows, doesn't relocate" finding in §1):

1. **A fixed template with explicit count/length ceilings, not a vague "be concise."** Claude Code's own harness prompt (1-2 sentences, 1-3 bullets, <70-char title) is the strongest evidence here — vague instructions like "keep it short" reliably underperform an explicit structural cap (corroborated independently by CLAUDE.md-authoring guidance: "the clearer and more specific your instructions, the better... vague instructions lead to verbose output" — [HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md); [Buildcamp CLAUDE.md guide](https://www.buildcamp.io/guides/the-ultimate-guide-to-claudemd)).
2. **A CLAUDE.md or repo-level commit-format spec Claude/an agent can read once and apply every time**, rather than relying on generic training-data defaults. A minimal `type: summary` / `what:` / `why:` skeleton constrains structurally even without a hard character count.
3. **A PR template file the tool is documented to follow** — Devin explicitly searches for and fills `.github/pull_request_template.md` (or a tool-specific override file) rather than free-writing; a template with a fixed-size "Summary" section forces trimming rather than leaving section length to model judgment.
4. **Explicit style-matching against existing history** — instructing the agent to read `git log` and match the *repository's own* established terseness (as Claude Code's harness prompt does) transfers the human team's existing brevity norm into the one input channel most likely to override the model's generic-corpus default.
5. **Demote reasoning to a trailer/footer rather than the headline** (§3) — if the underlying cause of length is the model wanting to justify/explain its own reasoning, giving that impulse a designated, skippable location (git trailers, a collapsed "why" section) resolves more of the tension than suppressing the explanation outright, which fights the model's trained-in tendency directly and is the more fragile approach per §1's ceiling finding.
6. **A verbosity-level product control** (JetBrains' slider) where available, or a post-hoc condensing step (a Marketplace Action that rewrites the generated description into a short comment) when the generation step itself can't be constrained tightly enough.
7. **Cut structural boilerplate that isn't the model's fault but adds fixed length regardless** — e.g. attribution footers, mandatory "Test plan" sections on trivial changes — these are vendor-level format choices (not emergent verbosity) and are the easiest lever to turn off entirely via harness/template configuration if a team decides they're not worth the line count on every single commit.

## Sources

- This session's own system-prompt commit/PR instructions (git commit conventions, HEREDOC PR-body template) — primary source, quoted directly in §1
- [Claude Code — Best practices](https://code.claude.com/docs/en/best-practices) — public docs; notably lighter on commit-format specifics than the harness prompt itself
- [GitHub — Responsible use of GitHub Copilot pull request summaries](https://docs.github.com/en/copilot/responsible-use/pull-request-summaries)
- [GitHub — Creating a pull request summary with GitHub Copilot](https://docs.github.com/copilot/using-github-copilot/creating-a-pull-request-summary-with-github-copilot)
- [Cursor forum — Rules for AI-generated commit messages](https://forum.cursor.com/t/rules-for-the-ai-generate-commit-messages/155785)
- [Devin Docs — GitHub integration / PR templates](https://docs.devin.ai/integrations/gh)
- [Conventional Commits](https://www.conventionalcommits.org/)
- ["Lore: Repurposing Git Commit Messages as a Structured Knowledge Protocol for AI Coding Agents"](https://arxiv.org/html/2603.15566v1) (arXiv, 2026)
- [Contextual Commits — open standard](https://github.com/berserkdisruptors/contextual-commits)
- [Hybrid Copy — "LLMs Overexplain"](https://hybridcopynet.wordpress.com/2026/06/22/llms-overexplain/)
- [Over-Reasoning and Redundant Calculation of Large Language Models](https://arxiv.org/pdf/2401.11467) (arXiv)
- [ITK Discourse — "AI generated pull requests overwhelming, hard to review carefully"](https://discourse.itk.org/t/ai-generated-pull-requests-overwhelming-hard-to-review-carefully/7728)
- [atomicrobot.com — "AI Writes Better Code. We're Getting Worse at Reviewing It."](https://atomicrobot.com/blog/ai-review-fatigue/)
- [Hacker News — "Godot is drowning in AI slop pull requests"](https://news.ycombinator.com/item?id=47059779)
- [Hacker News — "GitHub Ponders Kill Switch for Pull Requests to Stop AI Slop"](https://news.ycombinator.com/item?id=46884471)
- [JetBrains — AI in version control](https://www.jetbrains.com/help/ai-assistant/ai-in-vcs-integration.html)
- [HumanLayer — Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [Buildcamp — The Ultimate Guide to CLAUDE.md in 2026](https://www.buildcamp.io/guides/the-ultimate-guide-to-claudemd)

## Related

- [pre-commit-review-orchestration](./pre-commit-review-orchestration.md) — the review *process* around agent-written changes (hooks, subagent review, risk-tiering); this memo is scoped to commit/PR *content format and length* specifically, a distinct angle
- [hooks-and-harnesses](./hooks-and-harnesses.md) — how enforcement (hooks vs. advisory prose) generally works in Claude Code; §5's template/CLAUDE.md levers here are advisory-tier, not hook-enforced
