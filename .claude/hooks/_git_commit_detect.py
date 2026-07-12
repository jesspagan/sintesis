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

Checks for a literal `commit` token anywhere after `git`, excluding help
requests (`-h`/`--help` anywhere, or `help` as the first word) — this is
deliberately *not* a subcommand-position parser (identify the first
non-option token after skipping known value-taking global options):
that approach needs an exhaustive list of which global options consume a
following token (`-c`/`-C`, but also `--git-dir`, `--work-tree`,
`--namespace`, `--config-env`, ...) and missed real commits through any
option not on the list. Token-containment doesn't care what precedes
`commit`, so it handles every global option without enumerating them —
its own false-positive edge case (e.g. `git stash -m commit`, a stash
message that happens to be the word "commit") is an acceptable trade:
an unneeded check costs nothing, a missed real commit defeats the hook.

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
        if prog != "git" and not prog.endswith("/git"):
            continue
        rest = seg[1:]
        if "commit" not in rest:
            continue
        if "-h" in rest or "--help" in rest or (rest and rest[0] == "help"):
            continue
        return True
    return False
