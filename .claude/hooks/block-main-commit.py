#!/usr/bin/env python3
"""PreToolUse hook: fires before every Bash call (not gated by a harness
`if` filter — see _git_commit_detect.py for why), can actually block a
real `git commit` invocation (unlike a PostToolUse hook, which fires
after the fact). This repo's workflow requires committing on a feature
branch, never directly to main/master.

Resolves the branch via the payload's `cwd` rather than the hook
process's own cwd, which isn't guaranteed to match the target repo."""
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _git_commit_detect import invokes_git_commit

data = json.load(sys.stdin)
command = data.get("tool_input", {}).get("command", "")
cwd = data.get("cwd") or "."

if not invokes_git_commit(command):
    sys.exit(0)

try:
    # symbolic-ref, not rev-parse --abbrev-ref: rev-parse fails on an
    # unborn branch (a repo with zero commits yet), which would silently
    # let a first commit land straight on main.
    result = subprocess.run(
        ["git", "-C", cwd, "symbolic-ref", "--short", "HEAD"],
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
