#!/usr/bin/env python3
"""PostToolUse hook: fires after every Edit/MultiEdit/Write (not gated by
a harness `if` filter). An earlier version relied on `"if":
"Edit(AGENTS.md)|..."` in settings.json to scope this to AGENTS.md edits
only — verified live (via a debug-capture hook swapped into
settings.json) that this silently suppressed the hook entirely, for
every case, including editing AGENTS.md itself. Not the same failure
Copilot's comment hypothesized (over-firing on every edit), but the same
underlying lesson as the Bash hooks in round 4: don't trust the harness
`if` filter for this, self-filter inside the script using the real
payload instead.

Flags index lines over the length budget stated in the research skill
(.claude/skills/research/SKILL.md step 2) and the commit-review skill
(item 3) — CLAUDE.md notes this is hook-enforced but doesn't itself
state the number — so it's caught at write time, not only at
commit-review time.

Only checks lines inside the "## Index" section (between that heading
and the next "## " heading or EOF) — matching "- [" anywhere in the file
would also flag an unrelated bulleted list (e.g. a future "Resources"
section) that was never meant to follow this convention."""
import json
import sys
from pathlib import Path

MAX = 170

data = json.load(sys.stdin)
file_path = data.get("tool_input", {}).get("file_path", "")
cwd = data.get("cwd") or "."

target = Path(cwd) / "AGENTS.md"
if not file_path or Path(file_path).resolve() != target.resolve():
    sys.exit(0)

if not target.is_file():
    sys.exit(0)

fail = False
in_index = False
for line in target.read_text().splitlines():
    if line.startswith("## Index"):
        in_index = True
        continue
    if line.startswith("## "):
        in_index = False
        continue
    if not in_index:
        continue
    if line.startswith("- [") and len(line) > MAX:
        print(f"AGENTS.md index line is {len(line)} chars (budget ~150, hard ceiling {MAX}): {line}", file=sys.stderr)
        fail = True

if fail:
    print("Trim the oversized index line(s) above before moving on — see .claude/skills/research/SKILL.md step 2.", file=sys.stderr)
    sys.exit(2)

sys.exit(0)
