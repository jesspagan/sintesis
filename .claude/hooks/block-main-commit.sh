#!/usr/bin/env python3
"""PreToolUse hook: fires before `git commit` runs, can actually block it
(unlike a PostToolUse hook, which fires after the fact). This repo's
workflow requires committing on a feature branch, never directly to
main/master.

Reads the tool-call JSON from stdin rather than trusting the harness's own
`if` matcher alone, and resolves the branch via the payload's `cwd` rather
than the hook process's own cwd, which isn't guaranteed to match the
target repo.

Detects a real `git commit` invocation via a single shlex tokenization of
the whole command, splitting into segments on operator *tokens*
(`&&`/`||`/`;`/`|`) rather than a raw string split — a string-level split
would cut inside quotes (e.g. a commit message containing `|`), and a
plain `git\s+commit` regex misses global options between `git` and the
subcommand (`git -c user.email=x commit -m y`). On a quoting error we
can't parse, fail closed (assume it might be a commit) rather than
silently skipping — this hook is meant to enforce a hard policy, and a
false positive (an unnecessary branch check) is a much smaller cost than
a missed direct-to-main commit."""
import json
import shlex
import subprocess
import sys

data = json.load(sys.stdin)
command = data.get("tool_input", {}).get("command", "")
cwd = data.get("cwd") or "."

OPERATORS = {"&&", "||", ";", "|"}


def invokes_git_commit(cmd):
    try:
        tokens = shlex.split(cmd)
    except ValueError:
        return True  # fail closed: unparseable, don't assume it's safe

    segments = [[]]
    for tok in tokens:
        if tok in OPERATORS:
            segments.append([])
        else:
            segments[-1].append(tok)

    for seg in segments:
        if not seg:
            continue
        prog = seg[0]
        if (prog == "git" or prog.endswith("/git")) and "commit" in seg[1:]:
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
