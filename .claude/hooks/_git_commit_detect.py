"""Shared git-commit invocation detector for block-main-commit.py and
check-commit-message.py — kept in one place after Copilot review caught
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

Identifies `commit` by its *subcommand position* (the first non-option
token after `git`, skipping value-taking global options like `-c`/`-C`),
not by checking whether the word appears anywhere in the tokens — the
naive version misfired on `git help commit` (subcommand is `help`,
`commit` is help's argument) and `git --help commit` (a help request,
not an actual commit). Also excludes any segment with `-h`/`--help`
anywhere in it, since `git commit --help` shows help rather than
committing.

This is the *only* thing that should decide whether a Bash command
invokes `git commit` — settings.json intentionally does not gate these
hooks with a harness-level `if` pattern, since that pattern is a blunt
text filter sitting in front of this more precise check, and if it
doesn't fire, the script never runs at all."""
import shlex

OPERATORS = {"&&", "||", ";", "|"}
VALUE_TAKING_OPTS = {"-c", "-C"}


def _subcommand(tokens):
    i = 0
    while i < len(tokens):
        tok = tokens[i]
        if tok in VALUE_TAKING_OPTS:
            i += 2
            continue
        if tok.startswith("-"):
            i += 1
            continue
        return tok
    return None


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
        if prog != "git" and not prog.endswith("/git"):
            continue
        rest = seg[1:]
        if "-h" in rest or "--help" in rest:
            continue
        if _subcommand(rest) == "commit":
            return True
    return False
