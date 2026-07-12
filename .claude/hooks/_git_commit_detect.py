"""Shared git-commit invocation detector for block-main-commit.sh and
check-commit-message.sh — kept in one place after Copilot review caught
the two scripts' copies drifting out of sync.

Tokenizes the whole command once via shlex (respecting quotes), then
splits into segments on operator *tokens* (`&&`/`||`/`;`/`|`) rather than
a raw string split, which could otherwise cut inside a quoted commit
message containing one of those characters. A plain `git\\s+commit` regex
also misses global options between `git` and the subcommand
(`git -c user.email=x commit -m y`), which this catches.

Fails closed (assumes it might be a commit) on a quoting error we can't
parse — a false positive here costs an unnecessary check; a false
negative would let a direct-to-main commit slip past a hook that exists
specifically to prevent that.

This is the *only* thing that should decide whether a Bash command
invokes `git commit` — settings.json intentionally does not gate these
hooks with a harness-level `if` pattern, since that pattern is a blunt
text filter sitting in front of this more precise check, and if it
doesn't fire, the script never runs at all."""
import shlex

OPERATORS = {"&&", "||", ";", "|"}


def invokes_git_commit(cmd):
    try:
        tokens = shlex.split(cmd)
    except ValueError:
        return True

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
