#!/bin/bash
# PostToolUse hook: fires after any Edit/MultiEdit/Write to AGENTS.md.
# Flags index lines over the length budget stated in the research skill
# (.claude/skills/research/SKILL.md step 2) and the commit-review skill
# (item 3) — CLAUDE.md notes this is hook-enforced but doesn't itself
# state the number — so it's caught at write time, not only at
# commit-review time.
#
# Only checks lines inside the "## Index" section (between that heading
# and the next "## " heading or EOF) — matching "- [" anywhere in the
# file would also flag an unrelated bulleted list (e.g. a future
# "Resources" section) that was never meant to follow this convention.

FILE="${CLAUDE_PROJECT_DIR:-.}/AGENTS.md"
MAX=170

[ -f "$FILE" ] || exit 0

fail=0
in_index=0
while IFS= read -r line; do
  case "$line" in
    "## Index"*)
      in_index=1
      continue
      ;;
    "## "*)
      in_index=0
      continue
      ;;
  esac
  [ "$in_index" -eq 1 ] || continue
  case "$line" in
    "- ["*)
      len=${#line}
      if [ "$len" -gt "$MAX" ]; then
        echo "AGENTS.md index line is $len chars (budget ~150, hard ceiling $MAX): $line" >&2
        fail=1
      fi
      ;;
  esac
done < "$FILE"

if [ "$fail" -eq 1 ]; then
  echo "Trim the oversized index line(s) above before moving on — see .claude/skills/research/SKILL.md step 2." >&2
  exit 2
fi

exit 0
