import manifest from './contrast-manifest.yaml';
import { resolveToken, contrastRatio, parseRequiredRatio, collectContrastChecks, type TokenTree } from './contrast-utils';
import darkSemantics from './dark/semantics.json';
import lightSemantics from './light/semantics.json';
import primitives from './primitives.json';

const themes = {
  light: lightSemantics,
  dark: darkSemantics,
};

const checks = collectContrastChecks(manifest as TokenTree);

const cases = checks.flatMap((check) => Object.entries(themes).map(([themeName, semantics]) => ({ ...check, themeName, semantics })));

describe('contrast checks', () => {
  it.each(cases)('$path meets the required contrast ratio in the $themeName theme', ({ background, foreground, required, semantics }) => {
    const backgroundColor = resolveToken(background, semantics, primitives);
    const foregroundColor = resolveToken(foreground, semantics, primitives);

    const ratio = contrastRatio(backgroundColor, foregroundColor);

    expect(ratio).toBeGreaterThanOrEqual(parseRequiredRatio(required));
  });
});
