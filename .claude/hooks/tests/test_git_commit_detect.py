#!/usr/bin/env python3
"""Regression suite for _git_commit_detect.invokes_git_commit.

Every case here was found the hard way, across sixteen rounds of PR
review on the branch that introduced this file, plus two cases (help-
exclusion edge, `|&` operator) found afterward by actually reading
Claude Code's own permissions documentation instead of waiting for a
seventeenth round. Run from the repo root: `python3 .claude/hooks/tests/test_git_commit_detect.py`.

This does not test the harness-level `"if"` matcher — Claude Code's own
docs state that mechanism is best-effort and explicitly not meant for
hard enforcement (see hooks-and-harnesses.md §8), so there's nothing to
characterize there beyond "don't rely on it," which the hook scripts
already don't. This suite is scoped to what actually needs to be
correct: the self-filtering logic that replaced it."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from _git_commit_detect import invokes_git_commit

# (command, expected, why it's here)
CASES = [
    # basic
    ("git commit -m x", True, "baseline positive"),
    ("git init -q", False, "baseline negative — different subcommand"),
    ("git commit-tree abc123", False, "subcommand name that merely starts with 'commit'"),
    ('echo "I will commit to this later"', False, "the word 'commit' in unrelated prose"),
    ("gitcommit-fake-binary -m x", False, "program name that merely contains 'git'"),

    # program-path variants
    ("/usr/bin/git commit -m x", True, "absolute path to the git binary"),

    # global options (round 6/7: subcommand-position parsing)
    ("git -c user.email=x commit -m y", True, "-c takes a separate-token value"),
    ("git --work-tree /tmp commit -m x", True, "--work-tree takes a separate-token value"),
    ("git --git-dir /repo/.git commit -m x", True, "--git-dir, space form"),
    ("git --git-dir=/repo/.git commit -m x", True, "--git-dir, inline = form"),
    ("git --namespace foo commit -m x", True, "--namespace takes a separate-token value"),

    # help requests (round 7: false positives from naive substring match)
    ("git help commit", False, "'help' is the real subcommand, commit is its argument"),
    ("git --help commit", False, "--help anywhere means it's a help request"),
    ("git commit --help", False, "shows help, doesn't commit"),
    ("git commit -h", False, "shows help, doesn't commit"),
    ("git log --grep=commit", False, "'commit' inside a single --grep=commit token, not a bare subcommand"),

    # subcommand vs. argument disambiguation (round 7)
    ("git show commit", False, "'commit' as a ref argument to a different subcommand"),
    ("git diff commit", False, "same, different subcommand"),
    ("git stash -m commit", False, "'commit' as a stash message, not a subcommand — accepted false-negative-adjacent edge, see module docstring in _git_commit_detect.py"),

    # quoting (round 9: naive string-level operator split cuts inside quotes)
    ('git commit -m "message with a | pipe in it"', True, "quoted pipe must not be treated as an operator"),
    ('git commit -m "message;with;semicolons"', True, "quoted semicolons must not be treated as operators"),
    ('echo "a | b" && git commit -m x', True, "quoted operator in one segment, real commit in the next"),
    ('git log | grep "commit" && echo done', False, "quoted 'commit' as a grep pattern, no real commit anywhere"),
    ('git commit -m "unterminated quote', False, "fails open on a genuine parse error — see module docstring"),

    # compound commands / operators (rounds 9-12; |& added after reading
    # Claude Code's permissions docs, which list the full recognized set)
    ("git init -q && git commit -m x", True, "&&"),
    ("git log --oneline | grep commit", False, "| with no real commit on either side"),
    ("echo hi;git commit -m x", True, "; with no surrounding whitespace"),
    ("echo hi&&git commit -m x", True, "&& with no surrounding whitespace"),
    ("echo hi||git commit -m x", True, "|| with no surrounding whitespace"),
    ("echo hi|grep x;git commit -m x", True, "chained | then ;"),
    ("echo ok & git commit -m x", True, "bare & (background)"),
    ("git log |& cat", False, "|& (stderr+stdout pipe) with no real commit"),
    ("echo hi |& git commit -m x", True, "|& with a real commit on the far side"),

    # env-var prefixes and wrapper commands (round 10)
    ("GIT_AUTHOR_NAME=x git commit -m y", True, "single leading assignment"),
    ("GIT_AUTHOR_NAME=x GIT_AUTHOR_EMAIL=y git commit -m z", True, "multiple leading assignments"),
    ("FOO=bar git status", False, "leading assignment, but not a commit"),
    ("env GIT_AUTHOR_NAME=x git commit -m y", True, "env wrapper plus assignment"),
    ("env ls -la", False, "env wrapper, not a commit"),
    ("command git commit -m x", True, "command wrapper"),
    ("sudo git commit -m x", True, "sudo wrapper"),
    ("exec git commit -m x", True, "exec wrapper"),

    # wrapper commands with their own flags (round 12)
    ("sudo -u root git commit -m x", True, "sudo -u <value>, a wrapper flag that itself takes a value"),
    ("sudo -H git commit -m x", True, "sudo -H, a bare wrapper flag"),
    ("sudo -u root -H git commit -m x", True, "value-taking then bare wrapper flag together"),
    ("env -i FOO=bar git commit -m x", True, "env -i plus assignment"),
    ("nice sudo -u root git commit -m x", True, "nested wrappers"),

    # newlines as separators (PR #2 review: an earlier docstring claimed
    # this "just worked" via shlex whitespace handling — it didn't; shlex
    # discards newlines instead of emitting them as a token, so a
    # multi-line command silently merged into one segment and evaded
    # detection entirely if 'git' wasn't the very first word)
    ("echo hi\ngit commit -m x", True, "real commit on line 2, not line 1"),
    ("echo hi\necho bye", False, "multi-line, but no real commit anywhere"),
    ("git commit -m x\necho done", True, "real commit on line 1, unrelated line 2"),
    ("echo hi\n\ngit commit -m x", True, "blank line between — consecutive newlines group into one token"),
    ('git commit -m "line one\nline two"', True, "a literal newline INSIDE a quoted string must stay part of that token, not become a separator"),

    # subshell/grouping parens (PR #2 review: '(' and ')' are in
    # punctuation_chars for redirection support, so a leading '(' became
    # prog and matched nothing — a complete bypass, same shape as the
    # unwrapped-wrapper-command bug)
    ("(git commit -m x)", True, "single subshell wrapping a real commit"),
    ("((git commit -m x))", True, "nested subshell — consecutive parens group into one token"),
    ("(echo hi)", False, "subshell, no real commit inside"),
    ("(git commit -m x; git push)", True, "compound command inside a subshell"),
    ("(sudo git commit -m x)", True, "wrapper command inside a subshell"),
    ("git commit -m x > /dev/null", True, "redirection token must not break detection of a real commit"),
    ("git log > /dev/null", False, "redirection, no real commit"),
]


class TestInvokesGitCommit(unittest.TestCase):
    def test_all_cases(self):
        for command, expected, why in CASES:
            with self.subTest(command=command, why=why):
                self.assertEqual(
                    invokes_git_commit(command), expected,
                    f"{command!r} ({why}): expected {expected}",
                )


if __name__ == "__main__":
    unittest.main()
