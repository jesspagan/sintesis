#!/usr/bin/env python3
"""PreToolUse hook: fires before `git commit` runs, can actually block it
(unlike a PostToolUse hook, which fires after the fact). This repo's
workflow requires committing on a feature branch, never directly to
main/master.

Reads the tool-call JSON from stdin rather than trusting the harness's own
`if` matcher alone, and resolves the branch via the payload's `cwd` rather
than the hook process's own cwd, which isn't guaranteed to match the
target repo.

Detects a real `git commit` invocation via shlex tokenization rather than
a regex, so `git -c user.email=x commit -m y` (global options between
`git` and the subcommand) is still caught — a plain `git\s+commit` regex
misses it."""
import json
import re
import shlex
import subprocess
import sys

data = json.load(sys.stdin)
command = data.get("tool_input", {}).get("command", "")
cwd = data.get("cwd") or "."


def invokes_git_commit(cmd):
    for segment in re.split(r"&&|\|\||;|\n|\|", cmd):
        try:
            tokens = shlex.split(segment)
        except ValueError:
            continue
        if not tokens:
            continue
        prog = tokens[0]
        if (prog == "git" or prog.endswith("/git")) and "commit" in tokens[1:]:
            return True
    return False


if not invokes_git_commit(command):
    sys.exit(0)

try:
    result = subprocess.run(
        ["git", "-C", cwd, "rev-parse", "--abbrev-ref", "HEAD"],
        capture_output=True, text=True, check=True,
    )
except (subprocess.CalledProcessError, FileNotFoundError):
    sys.exit(0)

branch = result.stdout.strip()
if branch in ("main", "master"):
    print(f"Blocked: direct commit to '{branch}' isn't allowed in this repo.", file=sys.stderr)
    print("Create/switch to a feature branch first, e.g.: git checkout -b <type>/<slug> (type: feat/fix/docs/chore — see CLAUDE.md)", file=sys.stderr)
    sys.exit(2)

sys.exit(0)
