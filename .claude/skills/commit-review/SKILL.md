---
name: commit-review
description: Review checklist to run before committing changes to this repo — duplicate-topic check, memo convention compliance, index entry, sourcing hygiene, secret scan. Use before every git commit in this repo.
---

Run this before any `git commit` in this repo. It's a checklist, not free-form review — work through every item and report what you found; don't skip one because it "looks fine." Runs inline in the main thread, deliberately not forked — a review gating an imminent commit needs to see live repo state and hand back a trustworthy verdict synchronously, not go idle waiting on background children the way a forked research task can.

## 1. Duplicate/near-duplicate check

If new/changed files are in `research/`, check `AGENTS.md`'s index for an existing memo already covering the same topic. Two competing versions of the same memo have already shipped in this repo in a single session because concurrent processes skipped this check — don't repeat it. If a near-duplicate exists, consolidate into one file rather than adding a second.

## 2. Convention compliance (`research/*.md` only)

Each memo needs:
- frontmatter: `name` (matches filename minus `.md`), `description`, `type: research`
- a `**how to apply:**` line
- relative markdown links to other memos (`[slug](./slug.md)`) — never `[[wikilinks]]`

## 3. `AGENTS.md` index entry

Every new/changed memo has exactly one line in `AGENTS.md`'s `## Index`, under ~150 characters, formatted `- [file.md](research/file.md) — what it covers; when to consult`. No duplicate entries, no stale entries for deleted files.

## 4. Sourcing hygiene

Non-obvious claims are grounded in a citable source. Where sources disagree, the disagreement is stated in the memo, not silently resolved.

## 5. Secret scan

The diff about to be committed contains no API keys, tokens, credentials, or other secrets.

## 6. Actually look at the diff

Run `git status` and `git diff --staged` (plain `git diff` only shows unstaged changes, not what's actually about to be committed) and review what's really about to be committed — don't rely on this checklist as a substitute for reading the diff.

## Output

State pass/fail per item. If everything passes, proceed with the commit. If something fails, fix it first — don't commit and follow up later.
