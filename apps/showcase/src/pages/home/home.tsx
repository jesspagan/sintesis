import { Link } from 'react-router-dom'
import { Stack, Heading, Text, Button, Card, Badge, Divider } from '@sintesis/ui'
import styles from './home.module.css'

const features = [
  {
    title: 'token-first',
    description: 'Two CSS layers: a primitive scale (--gnrc-color-green-500) and semantic aliases (--gnrc-bg-brand). Components only reference semantics.',
    badge: 'tokens' as const,
  },
  {
    title: 'composable',
    description: 'Stack, Card, Typography, and Nav compose naturally. No configuration needed — just bring your content.',
    badge: 'components' as const,
  },
  {
    title: 'typed',
    description: 'Full TypeScript declarations ship in the dist. Autocomplete for every prop, every token key, every variant.',
    badge: 'dx' as const,
  },
]

export function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Stack gap="4" align="start">
          <Badge variant="success" dot>v0.1.0 — in development</Badge>
          <Heading as="h1" size="h1">
            síntesis
          </Heading>
          <Text variant="body" color="secondary" className={styles.subtitle}>
            an editorial design system built for experiences grounded in clarity, structure, and evergreen precision.
          </Text>
          <Stack direction="row" gap="3">
            <Button as={Link} to="/components">explore components</Button>
            <Button as={Link} to="/tokens" variant="secondary">view tokens</Button>
          </Stack>
        </Stack>
      </section>

      <Divider />

      <section className={styles.features}>
        <Heading as="h2" size="h3" className={styles['section-title']}>what's inside</Heading>
        <div className={styles.grid}>
          {features.map((f) => (
            <Card key={f.title} variant="outlined" padding="lg">
              <Stack gap="3">
                <Badge variant="info" size="sm">{f.badge}</Badge>
                <Heading as="h3" size="h4">{f.title}</Heading>
                <Text color="secondary">{f.description}</Text>
              </Stack>
            </Card>
          ))}
        </div>
      </section>

      <Divider />

      <section className={styles.cta}>
        <Stack gap="3" align="center">
          <Heading as="h2" size="h3">ready to build?</Heading>
          <Text color="secondary">install @sintesis/ui and import the token sheet.</Text>
          <Card variant="flat" padding="md" className={styles['code-block']}>
            <Text variant="code" as="pre">{'npm install @sintesis/ui\nimport \'@sintesis/ui/tokens.css\''}</Text>
          </Card>
          <Button as={Link} to="/components">browse all components</Button>
        </Stack>
      </section>
    </div>
  )
}
