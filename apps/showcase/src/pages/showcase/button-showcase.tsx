import { Stack, Heading, Text, Button, Divider, Card } from '@sintesis/ui'
import styles from './showcase.module.css'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap="4">
      <Heading as="h3" size="h4">{title}</Heading>
      <Card variant="flat" padding="lg">
        {children}
      </Card>
    </Stack>
  )
}

export function ButtonShowcase() {
  return (
    <div className={styles.page}>
      <Stack gap="4">
        <Heading as="h1" size="h2">button</Heading>
        <Text color="secondary">The core interactive element. 4 variants, 3 sizes, loading and disabled states, and an icon slot.</Text>
      </Stack>

      <Divider spacing="lg" />

      <Stack gap="8">
        <Section title="variants">
          <Stack direction="row" gap="3" wrap>
            <Button variant="primary">primary</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="ghost">ghost</Button>
            <Button variant="destructive">destructive</Button>
          </Stack>
        </Section>

        <Section title="sizes">
          <Stack direction="row" gap="3" align="center" wrap>
            <Button size="sm">small</Button>
            <Button size="md">medium</Button>
            <Button size="lg">large</Button>
          </Stack>
        </Section>

        <Section title="states">
          <Stack direction="row" gap="3" align="center" wrap>
            <Button>default</Button>
            <Button disabled>disabled</Button>
            <Button loading>loading</Button>
          </Stack>
        </Section>

        <Section title="full width">
          <Button fullWidth>full width button</Button>
        </Section>

        <Section title="as anchor">
          <Stack direction="row" gap="3" wrap>
            <Button as="a" href="#" variant="primary">link button</Button>
            <Button as="a" href="#" variant="ghost">ghost link</Button>
          </Stack>
        </Section>
      </Stack>

      <Divider label="usage" spacing="lg" />

      <Card variant="outlined" padding="md">
        <Text variant="code" as="pre">{`import { Button } from '@sintesis/ui'\n\n<Button variant="primary" size="md">\n  get started\n</Button>`}</Text>
      </Card>
    </div>
  )
}
