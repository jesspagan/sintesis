#!/usr/bin/env python3
"""PostToolUse hook: fires after `git commit`. Reads the actual committed
message back via `git log` (reliable — the real final text, not the
fragile shell-invocation string) and flags it if it blows the ceiling
stated in CLAUDE.md. Can't undo the commit (already happened by the time
PostToolUse fires) — this is a nag toward `git commit --amend`, not a
block.

Resolves the target repo via the payload's `cwd` rather than the hook
process's own cwd, which isn't guaranteed to match."""
import json
import subprocess
import sys

SUBJECT_MAX = 72
BODY_LINE_MAX = 3
BODY_CHAR_MAX = 400

data = json.load(sys.stdin)
cwd = data.get("cwd") or "."


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

body_lines = len([l for l in body.splitlines() if l.strip()])
body_chars = len(body)
if body_lines > BODY_LINE_MAX or body_chars > BODY_CHAR_MAX:
    print(f"Commit body is {body_lines} lines / {body_chars} chars (budget {BODY_LINE_MAX} lines / {BODY_CHAR_MAX} chars).", file=sys.stderr)
    fail = True

if fail:
    print("Consider 'git commit --amend' to tighten the message — see CLAUDE.md's commit message format section.", file=sys.stderr)
    sys.exit(2)

sys.exit(0)
