---
name: dtcg-format-spec
description: W3C Design Tokens Community Group (DTCG) format spec in depth — status, file structure, every primitive/composite type, aliasing, extensions, resolver module, and tool support
type: research
tags: [tokens]
---

# DTCG format spec, in depth

Produced 2026-08-06, grounded in the primary spec text — both the published pages at designtokens.org (`/TR/2025.10/format/`, `/TR/2025.10/color/`, `/TR/2025.10/resolver/`) and the raw Markdown chapter sources in the [design-tokens/community-group](https://github.com/design-tokens/community-group) GitHub repo (`technical-reports/format/*.md`, `technical-reports/color/*.md`, `technical-reports/resolver/*.md`), fetched directly via `curl`/`gh api` rather than through a summarizing fetch tool wherever a verbatim quote mattered. The existing [omnichannel-design-systems](./omnichannel-design-systems.md) memo covers DTCG only as one paragraph of a broader survey (spec maturity, a type list, platform-conversion scope); this memo supersedes that paragraph's depth on the format itself without touching the rest of that memo's scope.

**how to apply:** consult when implementing a DTCG-compliant token pipeline or tool, writing/reviewing a `.tokens.json` file, evaluating whether a tool (Style Dictionary, Tokens Studio, Figma) is actually spec-compliant, or deciding whether to build on the Resolver module yet.

## 1. Current status: three separate modules, one of them stable

As of this writing the spec is no longer a single monolithic document. It has split into three independently-versioned **Technical Reports**, all under the `2025.10` release:

- **[Format Module](https://www.designtokens.org/TR/2025.10/format/)** — the core token/group/type/alias syntax.
- **[Color Module](https://www.designtokens.org/TR/2025.10/color/)** — the color type, split out because it grew complex enough (CSS Color 4 alignment) to warrant its own report.
- **[Resolver Module](https://www.designtokens.org/TR/2025.10/resolver/)** — theming/context resolution (new; not present in earlier drafts).

The Format and Color modules at `2025.10` carry the banner: **"This specification is considered stable. Further updates will be provided in superseding specifications."** This was announced by the group on 2025-10-28 as ["the first stable version of the Design Tokens Specification"](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/). "Stable" here is a DTCG-internal designation, not W3C Standards Track status — the document explicitly states **"It is not a W3C Standard nor is it on the W3C Standards Track,"** and is published as a Community Group Report under the W3C Community Final Specification Agreement. Practically: a Community Group Report is a consensus snapshot of a self-selected group of implementers, not a W3C Recommendation subject to the formal Process Document (patent policy review, wide review, multiple independent implementations sign-off, etc.) — treat "stable" as "the editors consider the syntax frozen enough to build on," not "ratified by W3C."

Separately, the perpetually-updating **draft** at `/tr/drafts/format/` continues past `2025.10` for the next release cycle and carries the standard warning: *"This is a preview draft of in progress changes. Do not refer to this document directly, and do not implement anything in this document."* Do not cite that URL as current — always pin to `/TR/2025.10/...`.

**Not everything under "stable" is actually settled.** Every composite type section in the 2025.10 Format Module still carries an embedded open-issue callout soliciting feedback (issue numbers are real, filed against [design-tokens/community-group](https://github.com/design-tokens/community-group)):
- Stroke style — [#98](https://github.com/design-tokens/community-group/issues/98): whether it needs SVG-equivalent sub-values (`stroke-linejoin`, `stroke-miterlimit`, `stroke-dashoffset`).
- Border — [#99](https://github.com/design-tokens/community-group/issues/99): whether it needs outset/border-image/multi-border support.
- Shadow — [#100](https://github.com/design-tokens/community-group/issues/100): whether the spec should support multiple shadows (it already does, as an array — the issue predates that addition and may be stale).
- Gradient — [#101](https://github.com/design-tokens/community-group/issues/101): whether gradient *type* (linear/radial/conic) needs to be specified — currently it is not; the spec only defines a stop list.
- Typography — [#102](https://github.com/design-tokens/community-group/issues/102): whether `lineHeight` should be a bare number, a `dimension`, or a new dedicated type.
- Transition — [#103](https://github.com/design-tokens/community-group/issues/103): whether duration/delay/timing-function alone are useful without specifying *what* is transitioning.

The **Resolver Module** is markedly less mature than Format/Color: its own `CHANGELOG.md` versions it independently (`2.1.0` as of 2025-07-23, `2.0.0` as of 2023-10-27) and the 2.1.0 entry says explicitly: *"This version focuses on integrating community feedback and issue identification from the working copy rather than normative specification changes."* Open items logged there include unresolved terminology ("dimensions" vs "contexts"), whether modifiers should be arrays or objects, and undefined precedence rules when multiple modifiers touch the same token. Treat the Resolver Module as usable-but-still-settling, distinctly behind Format/Color's stability.

One more live discrepancy worth flagging: every code example across the stable spec tags files with `"$schema": "https://www.designtokens.org/schemas/2025.10/format.json"`, but the `file-format.md` chapter itself still carries an editor's note: *"The group is currently exploring the addition of a JSON Schema to support the spec."* The examples are ahead of the prose — `$schema` is a de facto convention in every example, not yet a normatively documented required/optional property.

## 2. File format structure

A design token file is plain JSON (`application/design-tokens+json`, falling back to `application/json`; recommended extensions `.tokens` or `.tokens.json`). Structurally there are only two kinds of object:

- **A token**: any JSON object containing a `$value` property. `$value`'s presence is the *sole* discriminator — "the presence of a `$value` property definitively identifies an object as a token." An object with both `$value` and nested child objects is invalid and tools MUST report it as an error.
- **A group**: any object *without* `$value`. Groups are purely organizational — "groups are arbitrary and tools SHOULD NOT use them to infer the type or purpose of design tokens" — and cannot themselves be referenced by other tokens the way a token can.

Token and group names are plain JSON strings, case-sensitive, and MUST NOT begin with `$` (reserved for spec properties) or contain `{`, `}`, or `.` (reserved for alias syntax).

**Reserved properties**, all `$`-prefixed:

| Property | On tokens | On groups | Required | Notes |
|---|---|---|---|---|
| `$value` | Yes | — | Yes (tokens only) | The only required property; its presence *is* what makes something a token. |
| `$type` | Yes | Yes | No | See inheritance rule below. |
| `$description` | Yes | Yes | No | Plain string. |
| `$extensions` | Yes | Yes | No | Vendor-namespaced object; see §6. |
| `$deprecated` | Yes | Yes | No | `true` / `false` / explanatory string; a group's `$deprecated` cascades to all child tokens unless a child overrides it with `false`. |
| `$extends` | No | Yes | No | Group-only; inherits tokens/properties from another group. |
| `$root` | No | Yes (as a child key) | No | Reserved child-name inside a group, for a group's "default" token — see below. |
| `$ref` | Yes (in place of `$value`) | Yes | No | RFC 6901 JSON Pointer, for property-level references — see §5. |

**Type inheritance**, quoted verbatim from the spec: *"If the `$type` property is not set on a token, then the token's type MUST be determined as follows: If the token's value is a reference, then its type is the resolved type of the token being referenced. Otherwise, if any of the token's parent groups have a `$type` property, then the token's type is inherited from the closest parent group with a `$type` property. Otherwise... the token MUST be considered invalid."* And critically: *"Tools MUST NOT attempt to guess the type of a token by inspecting the contents of its value."* Type is never inferred from shape — only from an explicit `$type`, a reference chain, or ancestor-group `$type`.

**`$root` tokens** (a newer addition) let a group hold both a "base" value and named variants without an ambiguous group-vs-token reference: `{color.accent.$root}` resolves to the root token's value, while `{color.accent}` alone is an invalid reference because `color.accent` is a group, not a token.

**`$extends`** lets one group inherit another group's tokens/properties, with local keys overriding inherited ones (a deep merge). The spec states it is *"syntactic sugar for JSON Schema's `$ref` keyword"* — `{"$extends": "{button}"}` on a group is defined as semantically identical to `{"$ref": "#/button"}`.

## 3. Primitive types (7, plus 3 informative-only "future" candidates)

All primitive types other than color live in the Format Module; color is specified separately in the Color Module (§4 covers color's shape in detail since it's the most structurally complex).

| Type | `$type` string | `$value` shape |
|---|---|---|
| Color | `color` | See §4 — object with `colorSpace`/`components`/`alpha`/`hex` (Color Module). |
| Dimension | `dimension` | `{ "value": <number>, "unit": "px" \| "rem" }`. Both keys required, even when `value` is `0`. `px` maps conceptually to Android `dp` / iOS `pt`; `rem` to Android `sp` (16sp ≈ 1rem). |
| Font family | `fontFamily` | A single string, or an array of strings ordered most- to least-preferred (font-stack fallback order). Flagged by [issue #53](https://github.com/design-tokens/community-group/issues/53) as possibly needing revision for platform/OS font-availability restrictions. |
| Font weight | `fontWeight` | A number in `[1, 1000]` (OpenType `wght` axis), or one of the pre-defined string aliases: `100`/`thin`/`hairline`, `200`/`extra-light`/`ultra-light`, `300`/`light`, `400`/`normal`/`regular`/`book`, `500`/`medium`, `600`/`semi-bold`/`demi-bold`, `700`/`bold`, `800`/`extra-bold`/`ultra-bold`, `900`/`black`/`heavy`, `950`/`extra-black`/`ultra-black`. Values outside range, or unrecognized/miscased strings, are invalid. |
| Duration | `duration` | `{ "value": <number>, "unit": "ms" \| "s" }`. |
| Cubic Bézier | `cubicBezier` | `[P1x, P1y, P2x, P2y]` — 4 numbers; x-coordinates constrained to `[0,1]`, y-coordinates unbounded. |
| Number | `number` | A bare JSON number, positive/negative/fractional. Used e.g. for gradient stop `position` or unitless line heights. |

The spec's `types.md` chapter also lists **informative, not-yet-normative** candidates explicitly flagged as future work, not implementable today: *font style* (an enum like `normal`/`italic`), a *percentage/ratio* type (unresolved whether it's just a `number` with alternate syntax, e.g. `"50%"` ≡ `0.5`), and a *file* type for asset references (path/URL, possibly with MIME type). Don't treat these as part of the current spec — they're roadmap notes inside the "Additional types" informative section.

## 4. Color type (Color Module) — CSS-Color-4-aligned, not a hex string

The pre-2025.10 draft color shape (largely hex/legacy-CSS-string based) has been replaced. The current normative shape is a structured object, not a string:

```json
{
  "$type": "color",
  "$value": {
    "colorSpace": "srgb",
    "components": [1, 0, 1],
    "alpha": 1,
    "hex": "#ff00ff"
  }
}
```

- `colorSpace` (**required**): one of `srgb`, `srgb-linear`, `hsl`, `hwb`, `lab`, `lch`, `oklab`, `oklch`, `display-p3`, `a98-rgb`, `prophoto-rgb`, `rec2020`, `xyz-d65`, `xyz-d50`.
- `components` (**required**): array whose length/meaning depends on `colorSpace` (e.g. sRGB/Display-P3/A98/ProPhoto/Rec2020 are `[R,G,B] ∈ [0,1]`; HSL is `[H ∈ [0,360), S ∈ [0,100], L ∈ [0,100]]`; OKLCH is `[L ∈ [0,1], C ∈ [0,∞), H ∈ [0,360)]`; etc.). Each component may also be the string `"none"` (per CSS Color 4) to mark a component as *inapplicable* rather than zero — meaningfully different during interpolation (e.g. `hsl(none, 0%, 100%)` white vs `hsl(0, 0%, 100%)` white with an explicit-but-irrelevant red hue).
- `alpha` (optional, default `1`): `[0,1]`.
- `hex` (optional): a 6-digit CSS hex **fallback**, not the source of truth — normative color data lives in `colorSpace`/`components`.
- No normative gamut-mapping algorithm is mandated: *"When transforming colors, translation tools MAY use the gamut mapping algorithm that best fits the use case."*

There is no supported legacy hex-string-only `$value` (e.g. `"$value": "#ff00ff"`) in the current spec — tools that still only accept a hex string are not 2025.10-compliant on color.

## 5. Composite types (6)

A composite type's `$value` is an object or array of pre-defined sub-values, each either an explicit primitive value or a `{reference}` to a token of the matching type. Per the spec's own framing (from PR [#86](https://github.com/design-tokens/community-group/pull/86), which settled this): composites are **pre-defined only** — there is no user-defined composite mechanism (an earlier design direction that was explicitly abandoned, though "the possibility of reintroducing user-defined composite types in future spec versions" is left open). Composite tokens are real tokens (can carry `$description`, `$extensions`, and be referenced by other tokens); groups cannot.

| Type | `$type` string | `$value` shape |
|---|---|---|
| Stroke style | `strokeStyle` | Either a string — `solid`, `dashed`, `dotted`, `double`, `groove`, `ridge`, `outset`, `inset` (CSS `line-style` semantics) — **or** an object `{ dashArray: [dimension\|ref, ...], lineCap: "round"\|"butt"\|"square" }`. String and object forms are mutually exclusive and not always inter-convertible (documented fallback guidance: e.g. CSS can't express a precise `dashArray`, so a tool falls back to `dashed`). |
| Border | `border` | `{ color: color\|ref, width: dimension\|ref, style: strokeStyle\|ref }`. |
| Transition | `transition` | `{ duration: duration\|ref, delay: duration\|ref, timingFunction: cubicBezier\|ref }`. |
| Shadow | `shadow` | A single object, **or an array** of objects/refs (multiple stacked shadows) — `{ color: color\|ref, offsetX: dimension\|ref, offsetY: dimension\|ref, blur: dimension\|ref, spread: dimension\|ref, inset: boolean (optional, default false) }` per shadow. |
| Gradient | `gradient` | An array of **gradient stop** objects/refs: `{ color: color\|ref, position: number\|ref ∈ [0,1] }` (out-of-range positions are clamped, not rejected). Notably, gradient *type* (linear/radial/conic) and axis/angle are **not** part of the spec — it only models the color stop list, which is why issue #101 is still open. |
| Typography | `typography` | `{ fontFamily: fontFamily\|ref, fontSize: dimension\|ref, fontWeight: fontWeight\|ref, letterSpacing: dimension\|ref, lineHeight: number\|ref }`. `lineHeight` is a bare `number` intended as a multiplier of `fontSize`, not a `dimension` — this is exactly the point contested in issue #102. Note: `textDecoration` / `textTransform` are **not** in the current normative shape (an earlier/adjacent draft iteration seen mid-research briefly listed them; the current 2025.10 `typography.md` chapter defines only the five properties above — verify against source if building tooling that assumes more). |

**Array aliasing rule** (applies to shadow and gradient, the two array-valued composites): *"References in arrays always resolve to a single value... When referencing an array, the entire referenced array is treated as a single element in the referencing array"* — i.e. no implicit flattening; array elements can freely mix explicit objects and `{references}` to same-typed tokens.

**Groups vs. composite tokens**, the spec's own distinction: groups are arbitrary, impose no naming/typing rules, and cannot be referenced; composite tokens have a fixed, spec-defined set of named sub-values (adding an undefined sub-value or wrong-typed value makes the token invalid), and — because they're real tokens — can be referenced by other tokens.

## 6. Aliasing / references

Two distinct, non-interchangeable syntaxes:

**Curly-brace token references** — `{group.token}` — *"always resolves to the `$value` property of the target token"* and can **only** target a complete token (something with `$value`), never a group or a sub-property inside a value. Path segments are group/token names joined by `.`.

**JSON Pointer references** — `"$ref": "#/path/to/target"`, RFC 6901 — required support (*"Tools implementing this specification MUST support JSON Pointer syntax"*), and the only way to do **property-level references** into part of a composite value, e.g. `{"$ref": "#/colors/blue/$value/components/0"}` to pull just the red channel of a color token into a `number` token. Curly braces cannot do this.

Resolution rules:
- Tools *SHOULD* preserve references and only resolve them lazily, when the actual value is needed (so live-editing a base token updates everything downstream).
- **Chained references** are allowed and MUST be followed transitively until an explicit value is found.
- **Circular references are prohibited**: *"References MUST NOT be circular... an appropriate error or warning message SHOULD be displayed to the user"* and *"Tools MUST detect and report this as an error affecting all tokens in the circular chain."*
- A referenced token's resolved *type* is what an un-typed referencing token inherits (§2's type-inheritance rule, branch 1).

## 7. `$extensions`

Verbatim: *"The optional `$extensions` property is an object where tools MAY add proprietary, user-, team- or vendor-specific data to a design token [or group]. When doing so, each tool MUST use a vendor-specific key whose value MAY be any valid JSON data."* Reverse-domain-name keys (`org.example.tool-a`) are recommended to avoid collisions. The interoperability-preserving obligation runs both ways: *"Tools that process design token files MUST preserve any extension data they do not themselves understand"* — so Tool B opening a file with Tool A's `$extensions` block must round-trip it unmodified even if it doesn't parse it. The spec explicitly scopes `$extensions` to "optional meta-data that is not crucial to understanding that token's value" — anything load-bearing for interoperability doesn't belong there — and notes (as an editorial aside) that this mechanism isn't vendor-exclusive; any token author can use it for their own purposes, and popular extensions may eventually get promoted into the core spec.

## 8. The Resolver Module: theming without combinatorial explosion

New since the earlier draft-era spec (the [omnichannel-design-systems](./omnichannel-design-systems.md) memo's DTCG paragraph predates this module entirely). It solves a named problem — *"Consumers of design tokens often need to express alternate values that apply in different contexts [...] Theming [...] Sizing [...] Accessibility mode [...] these alternate contexts are susceptible to combinatorial explosion"* — by defining a `.resolver.json` file, separate from token files, that composes them:

- **`sets`**: named collections of design tokens, each merging one or more source files/inline declarations (last-source-wins on conflicts).
- **`modifiers`**: named axes of variation (e.g. a `theme` modifier with `light`/`dark` **contexts**), each context pointing at one or more token sets/refs to layer in.
- **`resolutionOrder`** (required): an ordered array of sets/modifiers defining final merge precedence.
- A JSON Schema is published at `https://www.designtokens.org/schemas/2025.10/resolver.json`.

This directly targets the gap that Tokens Studio's ad-hoc `$themes.json` and various Style Dictionary custom-build-script conventions have each solved independently and incompatibly — the Resolver Module is DTCG's attempt at one standard answer. But per §1, treat it as the least-settled of the three modules: independently versioned at `2.1.0` (2025-07-23), with its own changelog admitting open questions about modifier array-vs-object shape, cross-modifier precedence, and terminology.

## 9. Tool support: incumbents lag, newcomers build 2025.10-native

Support is uneven and worth checking per-tool before assuming compliance:

- **Style Dictionary**: *"As of version 4, Style Dictionary has first-class support for the DTCG format"* (dollar-prefixing `value`→`$value`, `type`→`$type`, hoisting group-level `$type` to individual tokens) — but per its own docs, *"the latest format 2025.10 does not have full support yet in Style Dictionary,"* with full 2025.10 alignment (presumably including the new color-object shape and Resolver Module) called out as **work in progress in v5**. It also explicitly does not auto-migrate old type names (e.g. won't rewrite `"$type": "size"` to `"$type": "dimension"`) — that remains a manual migration step.
- **Tokens Studio for Figma**: supports the `$`-prefix structural convention (its distinguishing feature vs. its own "Legacy" format) but its own docs concede *"The DTCG specifies additional token types and their accepted values, which we will support in future releases"* — i.e. self-declared partial compliance. No documentation surfaced of support for the 2025.10 color object shape (`colorSpace`/`components`) or the Resolver Module; for dev handoff it explicitly defers to external tooling (Style Dictionary v4's `convertToDTCG` utility, the `sd-transforms` preprocessor) rather than emitting fully-compliant DTCG itself.
- **Figma (native Variables)**: reported (via the DTCG community's own tools-tracking [discussion #312](https://github.com/design-tokens/community-group/discussions/312)) to be reachable via third-party bridges like the **TokensBrücke** plugin, which converts Figma Variables to DTCG-compatible JSON — not native first-party DTCG export as of this research.
- **Newer/smaller tools claim tighter 2025.10 alignment**: per that same tracking discussion, tools including **Cobalt CLI**, **Dispersa**, **asimonim**, and **Design Token Kit** explicitly advertise 2025.10-stable support (validation + multi-target output), alongside validators like Anima's Design Token Validator. The discussion thread notably has **no entries for Style Dictionary or Tokens Studio** despite both being the incumbent tools most design systems already use — consistent with the "incumbents are still catching up" pattern above.

Net read: the *format's* stability (2025.10) has outpaced the *tooling ecosystem's* implementation of it. A team choosing tools today should verify against the specific module (Format vs. Color vs. Resolver) and specific version, not assume "supports DTCG" implies full 2025.10 compliance.

## Sources

- [Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/) (and raw chapter sources: [design-token.md](https://github.com/design-tokens/community-group/blob/main/technical-reports/format/design-token.md), [groups.md](https://github.com/design-tokens/community-group/blob/main/technical-reports/format/groups.md), [types.md](https://github.com/design-tokens/community-group/blob/main/technical-reports/format/types.md), [composite-types.md](https://github.com/design-tokens/community-group/blob/main/technical-reports/format/composite-types.md), [aliases.md](https://github.com/design-tokens/community-group/blob/main/technical-reports/format/aliases.md), [file-format.md](https://github.com/design-tokens/community-group/blob/main/technical-reports/format/file-format.md))
- [Design Tokens Color Module 2025.10](https://www.designtokens.org/TR/2025.10/color/) ([color-type.md source](https://github.com/design-tokens/community-group/blob/main/technical-reports/color/color-type.md))
- [Design Tokens Resolver Module 2025.10](https://www.designtokens.org/TR/2025.10/resolver/) ([introduction.md](https://github.com/design-tokens/community-group/blob/main/technical-reports/resolver/introduction.md), [CHANGELOG.md](https://github.com/design-tokens/community-group/blob/main/technical-reports/resolver/CHANGELOG.md))
- [Design Tokens specification reaches first stable version — W3C DTCG announcement, 2025-10-28](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/)
- [design-tokens/community-group GitHub repo](https://github.com/design-tokens/community-group) — issues [#53](https://github.com/design-tokens/community-group/issues/53), [#98](https://github.com/design-tokens/community-group/issues/98), [#99](https://github.com/design-tokens/community-group/issues/99), [#100](https://github.com/design-tokens/community-group/issues/100), [#101](https://github.com/design-tokens/community-group/issues/101), [#102](https://github.com/design-tokens/community-group/issues/102), [#103](https://github.com/design-tokens/community-group/issues/103); [PR #86](https://github.com/design-tokens/community-group/pull/86) (composite-types decision); [discussion #312](https://github.com/design-tokens/community-group/discussions/312) (tool support tracking)
- [Style Dictionary — DTCG support](https://styledictionary.com/info/dtcg/)
- [Tokens Studio — Token Format: W3C DTCG vs Legacy](https://docs.tokens.studio/manage-settings/token-format)
- [The Design Token Spec Is Finally Real. Now What? — Luis Vargas](https://themotiondesign.com/writing/design-token-spec-finally-real-now-what) (practitioner commentary, not a primary spec source — see confidence notes)
- [omnichannel-design-systems.md](./omnichannel-design-systems.md) — this repo's prior, survey-level DTCG coverage

**Confidence notes:** Sections 1–7 (spec status, file structure, all primitive/composite type shapes, aliasing, extensions, resolver overview) are grounded in direct `curl`/`gh api` fetches of the primary spec text (both the published `/TR/2025.10/` pages and their raw GitHub Markdown sources), with load-bearing claims quoted verbatim rather than paraphrased. The one internal uncertainty flagged in §5 (typography's exact property set — some early-research fetches surfaced `textDecoration`/`textTransform` as possibly present) was resolved by reading the actual `composite-types.md` source, which defines only `fontFamily`/`fontSize`/`fontWeight`/`letterSpacing`/`lineHeight`; that discrepancy is called out inline as a caution for anyone who encounters conflicting secondary summaries. §8's characterization of Tokens Studio's `$themes.json` and Style Dictionary's custom theming as what the Resolver Module supersedes is inference from the stated problem statement, not a claim the spec itself makes by name — flagged as such in-line. §9 (tool support) rests on each tool's own docs (primary) plus one GitHub discussion thread's crowd-sourced tool list (secondary, unverified per-entry) — treat the "which tools support 2025.10" claims as directionally right but unaudited per-tool.
