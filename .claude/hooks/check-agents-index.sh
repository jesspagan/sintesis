#!/bin/bash
# PostToolUse hook: fires after any Edit/Write to AGENTS.md.
# Flags index lines over the length budget stated in AGENTS.md's own convention
# and in the research/commit-review skills, so it's caught at write time, not
# only at commit-review time.

FILE="${CLAUDE_PROJECT_DIR:-.}/AGENTS.md"
MAX=170

[ -f "$FILE" ] || exit 0

fail=0
while IFS= read -r line; do
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
