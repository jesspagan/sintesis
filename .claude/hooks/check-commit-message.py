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
that one was actually created — `git commit` exits non-zero and creates
nothing on a clean tree ("nothing to commit"), untracked-only changes
("nothing added to commit"), or unstaged-only changes ("no changes added
to commit"). Without checking for these, this hook would lint whatever
commit HEAD already pointed to — a stale, unrelated prior commit — not
the (nonexistent) one this invocation was trying to make.

Resolves the target repo via the payload's `cwd` rather than the hook
process's own cwd, which isn't guaranteed to match."""
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _git_commit_detect import invokes_git_commit

SUBJECT_MAX = 72
BODY_LINE_MAX = 3
BODY_CHAR_MAX = 400
NO_OP_MARKERS = (
    "nothing to commit",
    "nothing added to commit",
    "no changes added to commit",
)

data = json.load(sys.stdin)
command = data.get("tool_input", {}).get("command", "")
cwd = data.get("cwd") or "."

if not invokes_git_commit(command):
    sys.exit(0)

response = data.get("tool_response", {}) or {}
output = (response.get("stdout") or "") + (response.get("stderr") or "")
if any(marker in output for marker in NO_OP_MARKERS):
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
