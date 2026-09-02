export type TokenTree = { [key: string]: unknown }

const ALIAS_PATTERN = /^\{(.+)\}$/

function resolvePath(path: string, tree: TokenTree): unknown {
  return path.split('.').reduce<unknown>((node, key) => {
    return typeof node === 'object' && node !== null ? (node as TokenTree)[key] : undefined
  }, tree)
}

/** Resolves a DTCG-style `{group.token}` alias against one or more token trees, checked in order. */
export function resolveToken(ref: string, ...trees: TokenTree[]): string {
  return resolveAlias(ref, trees, new Set())
}

function resolveAlias(ref: string, trees: TokenTree[], seen: Set<string>): string {
  const match = ALIAS_PATTERN.exec(ref.trim())
  if (!match) return ref

  const path = match[1]
  if (seen.has(path)) {
    throw new Error(`Cyclic token reference: ${[...seen, path].join(' -> ')}`)
  }
  seen.add(path)

  for (const tree of trees) {
    const value = resolvePath(path, tree)
    if (value !== undefined) {
      return typeof value === 'string' ? resolveAlias(value, trees, seen) : String(value)
    }
  }
  throw new Error(`Unresolved token reference: ${ref}`)
}

const HEX_PATTERN = /^#?([0-9a-fA-F]{6})$/

function hexToRgb(hex: string): [number, number, number] {
  const match = HEX_PATTERN.exec(hex.trim())
  if (!match) {
    throw new Error(`Invalid hex color: ${hex}`)
  }
  const value = parseInt(match[1], 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function srgbChannelToLinear(channel: number): number {
  const normalized = channel / 255
  return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4)
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(srgbChannelToLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.x contrast ratio between two sRGB hex colors, per https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio */
export function contrastRatio(hexA: string, hexB: string): number {
  const luminanceA = relativeLuminance(hexA)
  const luminanceB = relativeLuminance(hexB)
  const [lighter, darker] = luminanceA > luminanceB ? [luminanceA, luminanceB] : [luminanceB, luminanceA]
  return (lighter + 0.05) / (darker + 0.05)
}

/** Parses a manifest ratio like "3:1" into its numeric threshold (3). */
export function parseRequiredRatio(ratio: string): number {
  const numerator = Number(ratio.split(':')[0])
  if (!Number.isFinite(numerator) || numerator <= 0) {
    throw new Error(`Invalid contrast ratio: ${ratio}`)
  }
  return numerator
}

export type ContrastCheck = {
  path: string
  background: string
  foreground: string
  required: string
}

function isContrastCheck(node: unknown): node is Omit<ContrastCheck, 'path'> {
  const check = node as TokenTree
  return (
    typeof node === 'object' &&
    node !== null &&
    typeof check.background === 'string' &&
    typeof check.foreground === 'string' &&
    typeof check.required === 'string'
  )
}

/**
 * Recursively finds every {background, foreground, required} leaf in a manifest, at any
 * nesting depth, so the manifest's grouping can change without the checks needing an update.
 */
export function collectContrastChecks(manifest: TokenTree, path: string[] = []): ContrastCheck[] {
  if (isContrastCheck(manifest)) {
    return [{ ...manifest, path: path.join('.') }]
  }
  return Object.entries(manifest).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null ? collectContrastChecks(value as TokenTree, [...path, key]) : [],
  )
}
