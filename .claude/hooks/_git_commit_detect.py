"""Shared git-commit invocation detector for block-main-commit.py and
check-commit-message.py — kept in one place after Copilot review caught
the two scripts' copies drifting out of sync.

Tokenizes the whole command once via a punctuation-aware shlex lexer
(`punctuation_chars=True`), then splits into segments on operator
*tokens* — the same separator set Claude Code's own permission-rule
matcher documents (`&&`, `||`, `;`, `|`, `|&`, `&`, and newlines; newlines
are handled implicitly since shlex treats them as whitespace) — rather
than a raw string split that could cut inside a quoted commit message
containing one of those characters.
Plain `shlex.split()` — no `punctuation_chars` — was tried first and
doesn't actually solve that problem: it only splits operators that are
already whitespace-separated, so `echo hi;git commit -m x` (real,
common, unspaced shell syntax) tokenizes to a single glued token
`'hi;git'` and evades detection entirely — not a false positive/negative
tuning issue, a complete bypass. `punctuation_chars=True` splits `;`/
`&`/`|` into their own tokens regardless of surrounding whitespace,
while still correctly keeping them as literal text when they appear
inside quotes. A plain `git\\s+commit` regex also misses global options
between `git` and the subcommand (`git -c user.email=x commit -m y`),
which this catches too.

Identifies `commit` by *subcommand position*: the first non-option token
after `git`, skipping global options that consume a following value
token. An earlier version checked for a `commit` token appearing
anywhere after `git`, which avoided needing to enumerate global options
but caused real false positives on commands like `git show commit` or
`git diff commit` (using "commit" as a ref/argument to a different
subcommand) — a false block on `main` for a command that was never
actually going to commit. Subcommand-position is the more precise
signal; VALUE_TAKING_GLOBAL_OPTS is git's own documented set of global
options that take a separate-token value (`git --help`, OPTIONS
section) — `--exec-path` is deliberately excluded since it only accepts
an inline `=value` form, never a separate token.

Fails **open** (assumes it's not a commit) on a quoting error we can't
parse — this reverses an earlier version that failed closed, because the
tradeoff changed: this function now runs on *every* Bash call in the
session (settings.json has no harness-level `if` filter — see below), so
a shlex parse failure is now far more likely to come from some unrelated
complex command (process substitution, ANSI-C quoting, other bash syntax
shlex doesn't model) than from a real commit attempt. Failing closed in
that world means blocking arbitrary unrelated commands on `main` whenever
they use shell syntax shlex can't parse. Failing open doesn't meaningfully
open a bypass either: a `git commit` whose shlex parse genuinely fails
(actual unbalanced quotes) will most likely also fail when bash itself
tries to run it, so nothing was going to commit anyway.

Unwraps leading environment-variable assignments (`GIT_AUTHOR_NAME=x git
commit ...`) and common wrapper commands (`env`/`command`/`exec`/`sudo`/
`nice`/`nohup`), *including their own flags* (`sudo -u root git commit`),
before checking for `git` — a segment starting with any of these would
otherwise never be recognized as a git invocation at all: not a subtler
false positive/negative like the other cases above, a complete bypass.
WRAPPER_VALUE_TAKING_FLAGS covers the common value-taking flags across
these wrappers (`-u`/`-g` for user/group, `-C` for a directory, etc.);
this isn't an exhaustive model of each wrapper's full option grammar
(e.g. `env`'s own `-S`/`--split-string` isn't covered) — a bounded,
documented gap rather than either an exhaustive parser or the previous
complete miss.

This is the *only* thing that should decide whether a Bash command
invokes `git commit` — settings.json intentionally does not gate these
hooks with a harness-level `if` pattern, since that pattern is a blunt
text filter sitting in front of this more precise check, and if it
doesn't fire, the script never runs at all."""
import re
import shlex

OPERATORS = {"&&", "||", ";", "|", "|&", "&"}
VALUE_TAKING_GLOBAL_OPTS = {
    "-C", "-c",
    "--config-env", "--git-dir", "--work-tree", "--namespace",
    "--list-cmds", "--attr-source",
}
WRAPPER_COMMANDS = {"env", "command", "exec", "sudo", "nice", "nohup"}
WRAPPER_VALUE_TAKING_FLAGS = {"-u", "-g", "-C", "-p", "-r", "-t", "-h"}
ASSIGNMENT_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*=")


def _unwrap(tokens):
    i = 0
    while i < len(tokens):
        tok = tokens[i]
        if ASSIGNMENT_RE.match(tok):
            i += 1
            continue
        if tok in WRAPPER_COMMANDS:
            i += 1
            while i < len(tokens) and tokens[i].startswith("-"):
                if tokens[i] in WRAPPER_VALUE_TAKING_FLAGS:
                    i += 2
                else:
                    i += 1
            continue
        break
    return tokens[i:]


def _subcommand(tokens):
    i = 0
    while i < len(tokens):
        tok = tokens[i]
        if tok in VALUE_TAKING_GLOBAL_OPTS:
            i += 2  # this option and its separate-token value
            continue
        if tok.startswith("-"):
            i += 1  # a bare flag, or a long option using inline --foo=bar form
            continue
        return tok
    return None


def _tokenize(cmd):
    lexer = shlex.shlex(cmd, posix=True, punctuation_chars=True)
    lexer.whitespace_split = True
    return list(lexer)


def invokes_git_commit(cmd):
    try:
        tokens = _tokenize(cmd)
    except ValueError:
        return False

    segments = [[]]
    for tok in tokens:
        if tok in OPERATORS:
            segments.append([])
        else:
            segments[-1].append(tok)

    for seg in segments:
        seg = _unwrap(seg)
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
