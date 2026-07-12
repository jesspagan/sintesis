#!/usr/bin/env python3
"""PostToolUse hook: fires after every Bash call (not gated by a harness
`if` filter — see _git_commit_detect.py for why), self-filters on whether
the command actually invoked `git commit`, then reads the actual
committed message back via `git log` (reliable — the real final text,
not the fragile shell-invocation string) and flags it if it blows the
ceiling stated in CLAUDE.md. Exit 2 does interrupt the current turn (the
agent must act on the stderr feedback before continuing) but can't undo
or prevent the commit itself, since it already happened by the time
PostToolUse fires — the only remedy is a nag toward `git commit --amend`,
not a block on the action.

`invokes_git_commit` only tells us the command *attempted* a commit, not
that one was actually created. A standalone failing `git commit` (clean
tree, pre-commit hook rejection, aborted editor, ...) makes the overall
Bash tool call report non-zero, and PostToolUse simply never fires for a
non-zero Bash result (confirmed empirically) — so that case doesn't reach
this hook at all. But a *compound* command like `git commit -m x; echo
done` still reports overall success even if the commit inside it failed,
which is exactly the shape of command this session writes constantly.
Text-matching git's own failure messages ("nothing to commit", etc.) was
tried first and rejected — it only covers the specific wordings checked
for, missing e.g. pre-commit hook rejection or an aborted editor. Instead
this checks whether HEAD's commit is actually *fresh* (created within the
last minute): any failure mode leaves HEAD unmoved, so a stale timestamp
means nothing was created regardless of why.

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
FRESHNESS_WINDOW_SECONDS = 60

data = json.load(sys.stdin)
command = data.get("tool_input", {}).get("command", "")
cwd = data.get("cwd") or "."

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

commit_ts = git_log("%ct")
try:
    is_fresh = commit_ts is not None and (time.time() - int(commit_ts)) <= FRESHNESS_WINDOW_SECONDS
except ValueError:
    is_fresh = False
if not is_fresh:
    sys.exit(0)  # HEAD wasn't just moved — this commit attempt didn't actually create one

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
