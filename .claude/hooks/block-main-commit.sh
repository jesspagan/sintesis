#!/usr/bin/env python3
"""PreToolUse hook: fires before `git commit` runs, can actually block it
(unlike a PostToolUse hook, which fires after the fact). This repo's
workflow requires committing on a feature branch, never directly to
main/master.

Reads the tool-call JSON from stdin rather than trusting the harness's own
`if` matcher alone, and resolves the branch via the payload's `cwd` rather
than the hook process's own cwd, which isn't guaranteed to match the
target repo."""
import json
import re
import subprocess
import sys

data = json.load(sys.stdin)
command = data.get("tool_input", {}).get("command", "")
cwd = data.get("cwd") or "."

if not re.search(r"(?<![\w-])git\s+commit\b", command):
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
    print("Create/switch to a feature branch first, e.g.: git checkout -b <descriptive-branch-name>", file=sys.stderr)
    sys.exit(2)

sys.exit(0)
