#!/bin/bash
# SessionStart hook: ensures core.hooksPath points at this repo's
# version-controlled .githooks/ directory. Native git hooks in
# .git/hooks/ are never version-controlled, so a fresh clone has none of
# the enforcement in .githooks/ (branch guard, commit message ceiling)
# active until this runs once. Idempotent — safe to run every session.
git config core.hooksPath .githooks 2>/dev/null
exit 0
