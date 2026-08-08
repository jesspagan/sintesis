# DTCG token scaffold

Minimal example token files following the W3C Design Tokens Community Group (DTCG) format spec, release **2025.10** (Format + Color modules, marked "stable"), split by type. Accompanies [dtcg-format-spec.md](../../dtcg-format-spec.md) — read that memo's §1 before treating "stable" as final, and its per-type tables in §3–5 before extending these files.

- `color.tokens.json` — primitive + semantic (alias) color tokens using the Color Module's structured `$value` (`colorSpace`/`components`/`alpha`/`hex` — not a bare hex string), plus `$deprecated` and `$extensions` examples
- `dimension.tokens.json` — spacing and radius primitives, `$value` as `{ value, unit }`
- `font.tokens.json` — `fontFamily` and `fontWeight` primitives
- `duration.tokens.json` — `duration` (`{ value, unit }`) and `cubicBezier` (4-number array) primitives
- `typography.tokens.json` — composite `typography` tokens aliasing into the files above

These files are illustrative, not a build pipeline: there's no tool config (e.g. Style Dictionary `config.json`) or CI validation here. The `$schema` pointer in each file reflects the convention used throughout the spec's own examples, not (yet) a normatively required property. Aliases (`{group.token}`) resolve only once all files are merged into a single token tree by a build tool — they don't resolve standalone.

Two things worth knowing before building on this for real, both covered in the memo:

- **Tooling lags the spec.** Per the memo's §9, Style Dictionary v4 and Tokens Studio both self-report incomplete 2025.10 support (notably the Color Module's object shape) — check what your actual build tool accepts before assuming these files round-trip cleanly.
- **Theming/multi-context tokens are out of scope here.** The spec's separate Resolver Module (§8 of the memo) handles that via a `.resolver.json` file layering token sets by modifier (e.g. light/dark) — it's the least mature of the three modules and isn't scaffolded in this example set.
