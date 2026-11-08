import { Stack, Heading, Text, Divider, Card } from '@sintesis/ui'
import styles from './showcase.module.css'

export function TypographyShowcase() {
  return (
    <div className={styles.page}>
      <Stack gap="4">
        <Heading as="h1" size="h2">typography</Heading>
        <Text color="secondary">
          DM Sans (semi-bold, lowercase) for headings and UI text. DM Mono for code. Base is 1.4rem (14px) at 62.5% root.
        </Text>
      </Stack>

      <Divider spacing="lg" />

      <Stack gap="8">
        <Stack gap="4">
          <Heading as="h3" size="h4">headings</Heading>
          <Card variant="flat" padding="lg">
            <Stack gap="4">
              <div className={styles['type-specimen']}>
                <Text variant="label" as="span">h1 · 4.8rem</Text>
                <Heading as="h1" size="h1">the future is evergreen</Heading>
              </div>
              <div className={styles['type-specimen']}>
                <Text variant="label" as="span">h2 · 3.6rem</Text>
                <Heading as="h2" size="h2">design with intention</Heading>
              </div>
              <div className={styles['type-specimen']}>
                <Text variant="label" as="span">h3 · 3.0rem</Text>
                <Heading as="h3" size="h3">token-first system</Heading>
              </div>
              <div className={styles['type-specimen']}>
                <Text variant="label" as="span">h4 · 2.4rem</Text>
                <Heading as="h4" size="h4">composable components</Heading>
              </div>
            </Stack>
          </Card>
        </Stack>

        <Stack gap="4">
          <Heading as="h3" size="h4">text variants</Heading>
          <Card variant="flat" padding="lg">
            <Stack gap="4">
              <div className={styles['type-specimen']}>
                <Text variant="label" as="span">body · 1.4rem</Text>
                <Text>The quick brown fox jumps over the lazy dog. A design system built for experiences grounded in clarity and structure.</Text>
              </div>
              <div className={styles['type-specimen']}>
                <Text variant="label" as="span">caption · 1.2rem</Text>
                <Text variant="caption">Last updated 3 minutes ago · version 0.1.0</Text>
              </div>
              <div className={styles['type-specimen']}>
                <Text variant="label" as="span">label · 1.2rem semibold uppercase</Text>
                <Text variant="label" as="span">status · category · section</Text>
              </div>
              <div className={styles['type-specimen']}>
                <Text variant="label" as="span">code · DM Mono</Text>
                <Text variant="code" as="code">import {'{ Button }'} from '@sintesis/ui'</Text>
              </div>
            </Stack>
          </Card>
        </Stack>

        <Stack gap="4">
          <Heading as="h3" size="h4">colors</Heading>
          <Card variant="flat" padding="lg">
            <Stack gap="2">
              {(['primary', 'secondary', 'brand', 'disabled'] as const).map((c) => (
                <Stack direction="row" gap="4" align="center" key={c}>
                  <Text variant="label" as="span" className={styles['color-label']}>{c}</Text>
                  <Text color={c}>The editorial voice of sintesis</Text>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Stack>

        <Stack gap="4">
          <Heading as="h3" size="h4">weights</Heading>
          <Card variant="flat" padding="lg">
            <Stack gap="2">
              {(['regular', 'medium', 'semibold'] as const).map((w) => (
                <Stack direction="row" gap="4" align="center" key={w}>
                  <Text variant="label" as="span" className={styles['color-label']}>{w}</Text>
                  <Text weight={w}>Grounded in clarity, structure, and precision</Text>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Stack>
      </Stack>

      <Divider label="usage" spacing="lg" />

      <Card variant="outlined" padding="md">
        <Text variant="code" as="pre">{`import { Heading, Text } from '@sintesis/ui'\n\n<Heading as="h1" size="h1">title</Heading>\n<Text color="secondary">supporting copy here</Text>`}</Text>
      </Card>
    </div>
  )
}
