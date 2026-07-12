# sintesis

Research-memo repository. See `AGENTS.md` for the memo index and per-memo conventions.

## When asked to commit changes

Follow this procedure in order — don't skip a step because it "looks fine":

1. **Stage, then review.** Stage the changes, then run the `commit-review` skill and act on its findings — its own checklist has you review `git diff --staged`, which only reflects reality once staging has already happened.
2. **Branch.** Never commit directly to `main`/`master`. If currently on `main`/`master`, create a feature branch first: `<type>/<slug>`, where `type` is `feat` (new capability — a skill, hook, memo covering genuinely new ground), `fix` (correcting something wrong), `docs` (memo/doc content, no process change), or `chore` (tooling/config/process). Pick whichever fits the actual change; when a commit mixes types, use the one that dominates. This is also hook-enforced, not just advisory — `.claude/hooks/block-main-commit.py` (`PreToolUse`) blocks the commit outright if run on `main`/`master`, since it's a "must not happen" case rather than a judgment call.
3. **Commit**, following the message format below.
4. **Push** the branch to `origin` (`git push -u origin <branch>`) so the work actually lands somewhere, not just locally.

This whole procedure only applies once the user has actually asked for a commit — reaching each of these steps doesn't imply permission to also open a PR, merge, or push to `main` unless separately asked.

## Commit message format

(See [agentic-commit-and-pr-verbosity](research/agentic-commit-and-pr-verbosity.md).) Subject ≤72 chars, body ≤3 lines / ~400 chars, focused on *why* not *what*. Stated as an explicit structural ceiling rather than a vague "be concise" ask, because the research found vague asks don't reliably work against the model's own verbosity bias — the ceiling is also hook-checked after commit (`.claude/hooks/check-commit-message.py`) as a backstop, not a substitute for getting it right the first time.

## Review checklist depth

Most of `commit-review`'s checklist stays advisory rather than hook-enforced — see [hooks-and-harnesses](research/hooks-and-harnesses.md) for why that's the right default for a solo-maintained, low-blast-radius repo. The one exception besides branch/message format: `AGENTS.md` index-line length is hook-enforced (`.claude/hooks/check-agents-index.sh`, `PostToolUse`) after the same mistake slipped through advisory review twice in one session — a concrete instance of "revisit once a checklist item is actually getting skipped in practice," not a hypothetical one.
