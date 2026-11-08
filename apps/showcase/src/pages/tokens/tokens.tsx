import { Stack, Heading, Text, Divider, Badge } from '@sintesis/ui'
import { prmt, gnrcMap } from '@sintesis/ui'
import styles from './tokens.module.css'

const colorFamilies = Object.keys(prmt.color) as Array<keyof typeof prmt.color>

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div className={styles.swatch}>
      <div className={styles['swatch-color']} style={{ backgroundColor: value }} title={value} />
      <div className={styles['swatch-info']}>
        <Text variant="label" as="span">{name}</Text>
        <Text variant="caption" as="span">{value}</Text>
      </div>
    </div>
  )
}

function SpacingBar({ name, value }: { name: string; value: string }) {
  return (
    <div className={styles['spacing-row']}>
      <Text variant="caption" as="span" className={styles['spacing-name']}>{name}</Text>
      <div className={styles['spacing-bar']} style={{ width: value }} />
      <Text variant="caption" as="span" className={styles['spacing-value']}>{value}</Text>
    </div>
  )
}

export function TokensPage() {
  const spaceEntries = Object.entries(prmt.space)
  const textEntries = Object.entries(prmt.text)
  const gnrcEntries = Object.entries(gnrcMap)

  return (
    <div className={styles.page}>
      <Stack gap="4">
        <Heading as="h1" size="h2">tokens</Heading>
        <Text color="secondary">
          The token system has two CSS layers. Generic tokens (<code>--gnrc-color-green-500</code>) are the primitive scale.
          Semantic tokens (<code>--gnrc-bg-brand</code>) are role-based aliases. Components only use semantics.
        </Text>
      </Stack>

      <Divider label="color palette" spacing="lg" />

      <Stack gap="8">
        {colorFamilies.map((family) => (
          <Stack key={family} gap="3">
            <div className={styles['palette-header']}>
              <Heading as="h3" size="h4">{family}</Heading>
              <Badge variant="info" size="sm">prmt.color.{family}</Badge>
            </div>
            <div className={styles['swatch-grid']}>
              {(Object.entries(prmt.color[family]) as Array<[string, string]>).map(([step, hex]) => (
                <ColorSwatch key={step} name={step} value={hex} />
              ))}
            </div>
          </Stack>
        ))}
      </Stack>

      <Divider label="spacing scale" spacing="lg" />

      <Stack gap="2">
        {spaceEntries.map(([key, val]) => (
          <SpacingBar key={key} name={`space-${key}`} value={val as string} />
        ))}
      </Stack>

      <Divider label="type scale" spacing="lg" />

      <Stack gap="3">
        {textEntries.map(([key, val]) => (
          <div key={key} className={styles['type-row']}>
            <Text variant="caption" as="span" className={styles['type-name']}>{key}</Text>
            <span style={{ fontFamily: 'var(--gnrc-font-sans)', fontSize: val as string }}>
              the quick brown fox
            </span>
            <Text variant="caption" as="span" className={styles['type-value']}>{val as string}</Text>
          </div>
        ))}
      </Stack>

      <Divider label="semantic aliases (--gnrc- CSS layer)" spacing="lg" />

      <div className={styles['token-table']}>
        <div className={styles['token-table-head']}>
          <Text variant="label" as="span">token</Text>
          <Text variant="label" as="span">resolves to</Text>
        </div>
        {gnrcEntries.slice(0, 40).map(([token, ref]) => (
          <div key={token} className={styles['token-row']}>
            <Text variant="code" as="code">{token}</Text>
            <Text variant="code" as="code">{ref as string}</Text>
          </div>
        ))}
      </div>
    </div>
  )
}
