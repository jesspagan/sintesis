#!/usr/bin/env python3
"""Fires after every Bash call, on both `PostToolUse` and
`PostToolUseFailure` (not gated by a harness `if` filter — see
_git_commit_detect.py for why). Wired to both events because `PostToolUse`
alone doesn't fire when the overall Bash tool call reports non-zero — so
a compound command like `git commit -m x; git push` would skip this check
entirely if the push step failed, even though a real commit was made.
`PostToolUseFailure`'s payload has no `tool_response` field, but this
script never reads that field, so the same logic runs unchanged under
either event.

Self-filters on whether the command actually invoked `git commit`, then
reads the actual committed message back via `git log` (reliable — the
real final text, not the fragile shell-invocation string) and flags it if
it blows the ceiling stated in CLAUDE.md. Exit 2 does interrupt the
current turn (the agent must act on the stderr feedback before
continuing) but can't undo or prevent the commit itself, since it already
happened by the time either event fires — the only remedy is a nag
toward `git commit --amend`, not a block on the action.

`invokes_git_commit` only tells us the command *attempted* a commit, not
that one was actually created — a standalone no-op (clean tree,
pre-commit hook rejection, aborted editor, ...) or a compound command
where the commit itself failed leaves HEAD unmoved. Text-matching git's
own failure messages ("nothing to commit", etc.) was tried first and
rejected — it only covers the specific wordings checked for. A fixed
freshness window ("HEAD's commit is within the last N seconds") was tried
next and also rejected: for a slow compound command like `git commit -m
x; sleep 120`, the commit happens near the *start* of the tool call but
this hook only runs after the whole thing finishes, so a fixed window
measured from hook-eval time would call a genuinely fresh commit stale.
Instead this uses the payload's own `duration_ms` to reconstruct when the
tool call *started*, and checks the commit against that — self-calibrating
regardless of how long the surrounding command took, rather than guessing
a window size.

Resolves the target repo via the payload's `cwd` rather than the hook
process's own cwd, which isn't guaranteed to match."""
import json
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _git_commit_detect import invokes_git_commit

SUBJECT_MAX = 72
BODY_LINE_MAX = 3
BODY_CHAR_MAX = 400
FRESHNESS_SLACK_SECONDS = 10  # clock skew / hook-dispatch fuzz around the tool call's own start

data = json.load(sys.stdin)
command = data.get("tool_input", {}).get("command", "")
cwd = data.get("cwd") or "."
duration_ms = data.get("duration_ms") or 0

if not invokes_git_commit(command):
    sys.exit(0)


def git_log(fmt):
    try:
        result = subprocess.run(
            ["git", "-C", cwd, "log", "-1", f"--format={fmt}"],
            capture_output=True, text=True, check=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None
    return result.stdout.rstrip("\n")


subject = git_log("%s")
if subject is None:
    sys.exit(0)

call_start = time.time() - (duration_ms / 1000.0)
commit_ts = git_log("%ct")
try:
    is_fresh = commit_ts is not None and int(commit_ts) >= call_start - FRESHNESS_SLACK_SECONDS
except ValueError:
    is_fresh = False
if not is_fresh:
    sys.exit(0)  # HEAD wasn't moved during this tool call — this commit attempt didn't actually create one

body = git_log("%b") or ""

fail = False

if len(subject) > SUBJECT_MAX:
    print(f"Commit subject is {len(subject)} chars (budget {SUBJECT_MAX}): {subject}", file=sys.stderr)
    fail = True

body_lines = len(body.splitlines())  # count all lines, blank ones included — a hard ceiling shouldn't be bypassable by padding with blank lines
body_chars = len(body)
if body_lines > BODY_LINE_MAX or body_chars > BODY_CHAR_MAX:
    print(f"Commit body is {body_lines} lines / {body_chars} chars (budget {BODY_LINE_MAX} lines / {BODY_CHAR_MAX} chars).", file=sys.stderr)
    fail = True

if fail:
    print("Consider 'git commit --amend' to tighten the message — see CLAUDE.md's commit message format section.", file=sys.stderr)
    sys.exit(2)

sys.exit(0)
