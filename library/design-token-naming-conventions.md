---
lib-id: LIB-005
title: Design Token Naming Conventions — Primitive, Generic, and Semantic Tier Architecture
subjects: design-system workflow knowledge-management
type: research-note
created: 2026-11-08
updated: 2026-11-08
abstract: Three-angle temporal validity matrix investigation into how major design systems (Shopify Polaris, GitHub Primer, Atlassian, Material Design 3, Adobe Spectrum, MUI) name tokens across primitive, semantic, and component tiers. The industry has converged on a three-tier primitive → semantic → component structure with role-based (not value-based) naming at the semantic layer. The W3C Design Tokens Community Group published a stable spec (DTCG 2025.10) that standardizes the JSON format and alias syntax but deliberately excludes tier naming conventions — leaving "Primitive / Semantic / Component" as an ecosystem-level standard, not a spec-level one.
---

# Design Token Naming Conventions — Primitive, Generic, and Semantic Tier Architecture

*Researched November 8, 2026*

---

## Summary

The design token industry has converged on a three-tier architecture — primitive (raw values), semantic (purpose/role aliases), and component (scoped overrides) — with strong consensus on the naming rules at each tier. At the semantic layer, every major system uses role-based names that describe intent rather than appearance: `color.text.muted`, `color.background.brand`, not `color.gray.500` or `color.text.blue`. State suffixes always trail last. No hue names or numeric scales appear at the semantic tier. The W3C DTCG Format Module v2025.10 (October 2025) standardizes the JSON interchange format and alias reference syntax (`{path.to.token}`) but deliberately says nothing about tier structure — that remains an ecosystem convention converging on "Primitive / Semantic / Component" as the canonical vocabulary. Style Dictionary v4 (2024) broke the old CTI folder-hierarchy naming by requiring explicit `$type` declarations, freeing teams to use any naming structure they choose.

## Angle A — Established

The three-tier architecture has been the production standard across every major design system examined. The vocabulary differs but the topology — raw values → intent aliases → component overrides — is universal.

**What the major systems call each tier:**

Tier 1 (raw values): "primitives" (Tokens Studio, most practitioners), "globals" (Style Dictionary v3), "reference tokens" (Material Design 3), "core" (some systems). Naming formula is universally `[category].[hue-or-property].[numeric-scale]` — e.g., `color.green.500`, `--gnrc-color-green-500`, `color-sky-100`. Numeric steps (50/100/200…900 or Radix UI's 1–12) are preferred over adjectives because they leave room for insertion and carry no false comparisons.

Tier 2 (semantic/alias): "semantic tokens" (Figma, Tokens Studio, Shopify Polaris), "alias tokens" (Adobe Spectrum, Style Dictionary docs), "functional tokens" (GitHub Primer), "system tokens" (Material Design 3), "design tokens" as the publicly-surfaced layer (Atlassian). The vocabulary is fragmented but all names describe the same concept: purpose-bound pointers into the primitive tier.

Tier 3 (component): "component tokens" (Material Design 3, most practitioners), scoped CSS custom properties or component-level variables. Created only when a component genuinely diverges from the semantic default.

**Semantic layer naming patterns from major systems:**

[Shopify Polaris](https://github.com/Shopify/polaris-tokens) uses `--p-[category]-[element]-[role]-[variant]-[state]`. Examples: `--p-color-bg-fill-active`, `--p-color-text-subdued`, `--p-color-text-interactive-hover`. The `--p-` prefix namespaces the system.

[GitHub Primer](https://primer.style/foundations/primitives/color) uses `--[property]-[semantic-intent]-[state]`. Examples: `--fgColor-accent`, `--bgColor-success-emphasis`, `--bgColor-danger-muted`. Intensity modifiers (`emphasis`, `muted`) express contrast weight within a category.

[Atlassian Design System](https://atlassian.design/components/tokens/all-tokens) uses `color.[role].[accent].[intensity].[state]` in dot notation. Examples: `color.background.accent.red.subtle`, `color.text`, `color.text.subtle`. Intensity vocabulary — `subtlest`, `subtler`, `subtle`, `bolder` — encodes contrast intent.

[MUI](https://mui.com/material-ui/customization/css-theme-variables/configuration/) uses `--mui-palette-[role]-[variant]`. Examples: `--mui-palette-primary-main`, `--mui-palette-error-light`. Material Design 3 reference tokens: `md.sys.color.primary`, `md.ref.palette.primary40`.

**Cross-system patterns with high confidence:**

1. Property-then-role ordering at the semantic layer: `color.background.primary`, `color.text.subtle`, `color.border.danger` — category first, then semantic role.
2. State suffixes appended last — hover, active, disabled, focus always trail: `--p-color-text-interactive-hover`, `color.background.accent.lime.subtler.hovered`.
3. Namespace/prefix isolation is universal for public CSS token APIs: `--p-` (Polaris), `spectrum-` (Adobe), `--mui` (MUI).
4. No hue names at the semantic layer — `color.text.muted`, not `color.text.gray`. Every source that documents this rule is explicit: semantic names must survive a rebrand without becoming false.
5. Role vocabulary converges across systems on the same set: `background`/`bg`/`surface`, `text`/`foreground`/`fg`, `border`/`stroke`, `interactive`/`action`, status names (`success`, `warning`, `error`/`danger`, `info`), `brand`/`accent`, `neutral`.

## Angle B — Deprecated

**CTI taxonomy (Style Dictionary v3 default, 2018–2024, now deprecated):** The Category/Type/Item folder hierarchy was Style Dictionary's default organizational model. Tokens were organized in folder paths (`color/red/500`, `size/font/base`) and Style Dictionary inferred token type from folder position. CTI-named transforms (`name/cti/camel`, `name/cti/kebab`, `name/ti/camel`, `name/ti/constant`) are removed in [Style Dictionary v4](https://styledictionary.com/versions/v4/migration/). The tool now requires explicit `$type` or `type` declarations per token. Any v3 config using folder hierarchy for type inference requires migration.

**Bare `value`/`type` property format (pre-DTCG):** Style Dictionary v3 used bare property names. The [W3C DTCG Format Module 2025.10](https://www.designtokens.org/tr/drafts/format/) standardized `$value` and `$type` as the canonical keys. Style Dictionary v4 accepts both but cannot mix them in a single instance — teams with legacy files must migrate.

**Flat, value-encoded naming:** Names like `color-blue-500` as a semantic token, `color-background-blue`, `text-gray` encoded appearance directly. These worked while the palette was frozen. When a "blue" background became teal, every reference became a lie without a mass rename — a breaking change propagating through design files, code, documentation, and tests simultaneously. This practice was [documented as a named anti-pattern](https://designtokens.substack.com/p/6-common-mistakes-in-design-tokens) by 2022.

**Direct primitive→component mapping (skipping the semantic layer):** Mapping global tokens directly to components (`button-primary-background: {blue.600}`) with no intermediate semantic layer was common through 2021. The [six common mistakes analysis](https://designtokens.substack.com/p/6-common-mistakes-in-design-tokens) identifies this as the leading cause of maintenance debt — every theme variant requires duplicating the entire component token set without the semantic indirection layer.

**Vague ordinal naming:** `color.primary`, `color.secondary`, `button.primary` — shorthand that worked while the team shared unwritten context. At handoff or after team turnover these names become opaque. Replaced by role-explicit names: `color.action.primary`, `color.text.default`.

**Component-first naming:** Naming tokens after the first component that used them (`button.primary.background`) rather than the shared design decision. This hard-wires tokens to their first consumer, preventing reuse and causing proliferation when the same value is needed elsewhere.

## Angle C — Failed Approaches

**Value-encoded semantic names:** `color-text-gray`, `color-background-blue`. These names are precise until rebranded — then they lie. The root cause is [naming what a token *is* rather than what it *does*](https://www.alwaystwisted.com/articles/design-token-naming-conventions). The fix describes role: `color-text-muted`, `color-background-brand`.

**Premature component tokens — skipping semantic abstraction:** Naming tokens after the component they first appear in rather than the shared decision they represent. The [Frontside analysis](https://frontside.com/blog/2021-01-15-design-tokens-and-components/) documents a production failure: a progress bar using `$dt-disabled` for its background because the hex matched visually, not because the bar was disabled. When the disabled color changed for accessibility, the progress bar broke unexpectedly. Without a semantic layer, components borrow values from semantically unrelated roles silently.

The proliferation pattern: the same design decision needed on a button, a nav item, a badge, and a segmented control becomes four separate component tokens pointing at the same primitive. Six months of this produces 400+ component-scoped tokens with no shared semantic layer, requiring 400 edits for every theme change.

**Skipping the semantic tier entirely:** Without the semantic layer, theme changes require editing component tokens individually rather than updating one semantic pointer. [The Frontside article](https://frontside.com/blog/2021-01-15-design-tokens-and-components/) shows the concrete failure: what should be "update `color.background.default`" becomes "find all 200 components that use this color and change each one."

**Vague modifiers without definitions:** "primary," "secondary," "strong," "subtle," "muted" work only while the team shares unwritten context. `color.primary` is ambiguous between brand color, primary action color, and most prominent text color. The fix is a [documented controlled vocabulary](https://www.designsystemscollective.com/design-token-naming-that-scales-how-to-prevent-token-chaos-b92ff4cd55fd) defining what each modifier means in each category and which categories it applies to.

**Inconsistent segment ordering and format mixing:** Mixing `text/primary`, `TextPrimary`, `text_primary`, `text-primary` in the same system prevents automation, breaks autocomplete, and produces incomplete audit results. The fix is a canonical dot-notation source format that transforms to per-platform output via build tooling.

**No migration path for renames:** Deleting a token name and announcing it in release notes breaks downstream consumers with no graceful path. The [token naming scale article](https://www.designsystemscollective.com/design-token-naming-that-scales-how-to-prevent-token-chaos-b92ff4cd55fd) documents the working pattern: add replacement, alias old name to new value, mark deprecated with deadline, measure usage, then remove.

## Angle D — Newly Viable

**W3C DTCG Format Module v2025.10 (October 28, 2025):** The [Design Tokens Community Group published its first stable specification](https://w3c.github.io/cg-reports/design-tokens/CG-FINAL-format-20251028/) on October 28, 2025, backed by 24+ organizations including Adobe, Figma, Google, Microsoft, and Salesforce. This is a Community Group Report (not a formal W3C Recommendation) but functions as the de facto interchange standard. Style Dictionary, Tokens Studio, Cobalt, Supernova, and Specify have all aligned on its JSON dialect.

What the spec establishes: `$value`/`$type`/`$description`/`$extensions`/`$deprecated` as reserved keys; `{group.token}` curly-brace alias syntax; explicit statement that tools must NOT infer token type from folder position (formally deprecating CTI). Breaking change in 2025.10: color values must be structured objects naming their color space (sRGB, HSL, Lab, OkLch) — bare hex strings are no longer valid.

The spec deliberately says nothing about tier naming or the primitive/semantic/component structure — that layer is left to the ecosystem.

**Figma Variables (mid-2023):** Figma Variables made the two-tier and three-tier token architectures [natively executable inside Figma](https://help.figma.com/hc/en-us/articles/18490793776023-Update-1-Tokens-variables-and-styles) for the first time. Before this, all token management required a third-party plugin with no native alias or mode support. Slash-separated paths in Figma variable names (`color/text/primary`) translate directly to CSS custom property names after hyphen conversion, establishing slash-path as the cross-tool convention. The design-to-code pipeline can now be maintained as a single DTCG JSON artifact via Figma's REST API export.

**Style Dictionary v4 (2024):** [v4 migration](https://styledictionary.com/versions/v4/migration/) removed CTI as the default and required explicit `$type` per token. This freed naming hierarchies from folder-position constraints — teams can now use `surface/raised`, `interactive/primary`, `feedback/error` with no structural assumptions from the tool. First-class DTCG format support (`$value`/`$type` consumed natively) is included.

**CSS `@property` universal browser support (mid-2024):** `@property` reached full cross-browser coverage when [Firefox 128 shipped in mid-2024](https://moderncss.dev/providing-type-definitions-for-css-with-at-property/). Semantic-tier CSS custom properties can now be registered with explicit type declarations (`syntax: '<color>'`), making them type-validated and animatable. Primitives can remain unregistered or be kept as build-time-only values excluded from the browser CSS.

## Angle E — Emerging Trajectory

**"Primitive / Semantic / Component" converging as standard vocabulary:** The [three-tier structure is approaching full convergence](https://www.productdesign.vn/en/articles/design-tokens-architecture-2026/) as the industry vocabulary. "Primitive" (Tier 1) and "semantic" (Tier 2) are strongly converged. "Component" (Tier 3) is the dominant term though some practitioners prefer "contextual" to avoid ambiguity when a "component" spans multiple UI surfaces. No major system has shipped a spec change based on this debate. Confidence: directional signal approaching convergence, not yet a formal standard.

**Material Design 3's alternative vocabulary ("Reference / System / Component"):** Material Design 3 uses different names — [reference tokens, system tokens, component tokens](https://sujeet.pro/articles/design-tokens-and-theming) — but maps to the same three-tier topology. "Reference" = primitive, "system" = semantic. This is a dissenting vocabulary from an authoritative source, but the structural topology is identical.

**Modes (light/dark, brand) are the largest open gap in the DTCG spec:** The [2025.10 stable spec](https://w3c.github.io/cg-reports/design-tokens/CG-FINAL-format-20251028/) does not address modes. Tools (Figma Variables, Tokens Studio) have filled this gap with their own incompatible conventions. The DTCG community has an open draft proposal for modes but it has not shipped. Modes are the likeliest site of the next meaningful spec evolution. Confidence: proposal level, not committed.

**DTCG will not standardize tier naming:** The spec community has explicitly stated the tier structure is out of scope. The spec governs format and type system, not organizational philosophy. This is a [committed scope boundary](https://designtokens.substack.com/p/a-two-tiers-architecture-is-possible), not a gap — it means tier naming conventions will remain ecosystem-level standards indefinitely. Confidence: committed.

## Cross-Reference Notes

### High-Confidence Findings

1. **Three-tier primitive → semantic → component is industry consensus** (Angles A, B, D, E — appears across all four). Every major system uses this topology; it has been the standard since at least 2019 and is reinforced by the DTCG spec's alias syntax.

2. **No hue/value names at the semantic layer** (Angles A, C). All major systems state this explicitly (A); value-encoded semantic names are documented as a named, catastrophic anti-pattern (C). The rule is non-negotiable for any system that needs theming or rebrand resilience.

3. **State suffixes trail last** (Angles A, C). `--p-color-text-interactive-hover`, `color.background.accent.lime.subtler.hovered` — no system puts state before role. Established pattern (A) and its absence causes naming inconsistency (C).

4. **Skipping the semantic tier causes maintenance debt proportional to system size** (Angles B, C). Deprecated as a practice (B); documented as a production failure mechanism (C).

5. **Style Dictionary v4 broke CTI and aligned with DTCG** (Angles B, D). The deprecation (B) and the replacement (D) are the same event — v4's release.

### Contradictions

No direct contradictions found across angles. The only vocabulary divergence is Material Design 3's "reference/system" vs. the community's "primitive/semantic" — these map to the same concepts and do not contradict.

### Gaps

- Angle B had thin coverage of naming conventions from before CTI was established (pre-2018). The pre-CTI era is underdocumented.
- Angle E's coverage of modes in the emerging DTCG spec is a true gap in the spec itself — the community has not resolved this. Thin coverage reflects thin resolution, not thin research.
- None of the sources directly address how to handle the case where a system uses a "generic" middle tier (CSS primitives that sit between JSON-only raw values and CSS semantic tokens) rather than the standard primitive/semantic two-CSS-tier approach. This is Sintesis's specific architecture and it is not documented as a named pattern in the ecosystem.

### Inter-Angle Connections

1. **B + D**: The deprecation of CTI (B) and the newly viable Style Dictionary v4 (D) are the same event from two temporal perspectives. CTI was deprecated precisely because v4 aligned with DTCG; they cannot be understood independently.

2. **C + A**: The cross-system rule against hue names at the semantic layer (A) exists because value-encoded semantic names fail catastrophically (C). The established rule is the solution to the documented failure.

3. **B (deprecated component-first naming) + C (anti-pattern: premature component tokens)**: These describe the same failure pattern from different angles — historical practice (B) and mechanism of failure (C). Double confirmation that component-first naming is the highest-cost naming mistake.

4. **D (Figma Variables, 2023) + E (modes not in DTCG spec)**: Figma Variables filled the modes gap before the DTCG spec could address it. This created a chicken-and-egg situation that explains why modes remain unresolved in the stable spec — the vacuum was filled by proprietary tooling before standardization could happen.

## Implications for sintesis

The Sintesis design system uses a three-tier structure: `prmt` (raw values in JSON only, never CSS variables) → `--gnrc-` (CSS custom properties, values come from primitives) → `--snt-` (CSS custom properties, purpose-bound aliases into `--gnrc-`).

1. **Use `--snt-` names with property-then-role ordering**: Write `--snt-bg-brand`, `--snt-text-primary`, `--snt-border-interactive` — not `--snt-brand-bg`, `--snt-primary-text`. This matches the cross-system consensus (Polaris, Primer, Atlassian all put category first) and makes autocomplete-driven discovery predictable.

2. **State suffixes must trail last in `--snt-` names**: Write `--snt-border-interactive-hover`, not `--snt-hover-border-interactive`. Every major system does this; deviating breaks the pattern that engineers expect.

3. **Never put hue names or numeric scales in `--snt-` tokens**: `--snt-brand` and `--snt-bg-success` are correct. `--snt-green-500` and `--snt-bg-green` will lie after the first palette change. The `--gnrc-` tier is the right place for `--gnrc-color-green-500`.

4. **Document `--gnrc-` explicitly as the CSS primitive tier**: The `--gnrc-` prefix diverges from the industry vocabulary ("primitives," "globals," "reference tokens"). If the token system will be used by external teams, consider whether `--prmt-` or `--ref-` aligns better. If `--gnrc-` is kept, add a one-sentence doc comment to any file that defines these tokens stating that `--gnrc-` is the CSS primitive tier — not a semantic alias layer. The divergence is acceptable but must be explicit to prevent misclassification.

5. **Plan the component token tier before you need it**: The current two-CSS-tier system (`--gnrc-` and `--snt-`) matches industry practice for the launch phase. Add component-scoped CSS custom properties (using CSS Modules' `:root` or `[data-component]` scoping) only when a component genuinely needs to diverge from a semantic default — not reflexively at the start. Premature component tokens are the highest-documented source of maintenance debt (Angles B and C agree).

6. **Register semantic-tier tokens with CSS `@property`**: Use `@property` for color and spacing tokens at the `--snt-` layer. `@property` is universally supported as of mid-2024. Declaring `syntax: '<color>'` on `--snt-brand` and `--snt-bg-success` provides type validation and smooth transitions. `--gnrc-` tokens can remain unregistered or be excluded from the browser CSS entirely and kept as build-time values only.

7. **Use DTCG alias syntax in `primitives.json`**: Write primitive→generic mappings as `"--gnrc-color-green-500": {"$value": "{prmt.color.green.500}"}` — the curly-brace path syntax is the DTCG 2025.10 standard and is consumed natively by Style Dictionary v4. This positions the token file for tooling compatibility without requiring a rewrite.

## Sources

- [Crafting consistency: a thoughtful approach for naming design tokens — Specify](https://specifyapp.com/blog/crafting-consistency-a-thoughtful-approach-for-naming-design-tokens)
- [Design token naming conventions: a 3-tier system that scales — Adamarant](https://adamarant.com/en/blog/design-token-naming-conventions-a-3-tier-system-that-scales)
- [Design Token Naming Conventions: A Practical Guide — Always Twisted](https://www.alwaystwisted.com/articles/design-token-naming-conventions)
- [Shopify Polaris Tokens — GitHub](https://github.com/Shopify/polaris-tokens)
- [GitHub Primer Color Primitives — primer.style](https://primer.style/foundations/primitives/color)
- [Atlassian Design System — All Tokens](https://atlassian.design/components/tokens/all-tokens)
- [MUI CSS Theme Variables Configuration — mui.com](https://mui.com/material-ui/customization/css-theme-variables/configuration/)
- [Design Tokens and Theming Architecture — Sujeet Jaiswal](https://sujeet.pro/articles/design-tokens-and-theming)
- [Design token naming that scales: How to prevent token chaos — Design Systems Collective](https://www.designsystemscollective.com/design-token-naming-that-scales-how-to-prevent-token-chaos-b92ff4cd55fd)
- [6 Common Mistakes in Design Tokens Naming — Design Tokens Substack](https://designtokens.substack.com/p/6-common-mistakes-in-design-tokens)
- [The context dilemma: design tokens and components — Frontside](https://frontside.com/blog/2021-01-15-design-tokens-and-components/)
- [Naming the Middle — Baseline Design Newsletter](https://newsletter.baselinedesign.com/naming-the-middle/)
- [A two-tiers architecture is possible? — Design Tokens Substack](https://designtokens.substack.com/p/a-two-tiers-architecture-is-possible)
- [Design Tokens Format Module 2025.10 — W3C DTCG](https://www.designtokens.org/tr/drafts/format/)
- [Design Tokens Format Module — W3C CG Final Report](https://w3c.github.io/cg-reports/design-tokens/CG-FINAL-format-20251028/)
- [Style Dictionary v4 Migration Guide — styledictionary.com](https://styledictionary.com/versions/v4/migration/)
- [Update 1: Tokens, variables, and styles — Figma Help](https://help.figma.com/hc/en-us/articles/18490793776023-Update-1-Tokens-variables-and-styles)
- [Providing Type Definitions for CSS with @property — Modern CSS](https://moderncss.dev/providing-type-definitions-for-css-with-at-property/)
- [Design tokens architecture: the three-tier system that scales — productdesign.vn](https://www.productdesign.vn/en/articles/design-tokens-architecture-2026/)
- [Design Tokens: How to Sync Design and Code in Figma — Figma Resource Library](https://www.figma.com/resource-library/design-tokens/)
- [Token Tiers: building token architecture in layers — Honcho Agency](https://honcho.agency/design-systems/glossary/token-tiers)
- [Design Token Architecture 2026: Strategic Blueprint — Timothy Graf](https://timgraf.com/ui/design-token-architecture-2026-the-strategic-blueprint-for-scalable-design-systems/)
