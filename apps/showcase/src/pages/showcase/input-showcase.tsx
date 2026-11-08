import { Stack, Heading, Text, Input, Divider, Card } from '@sintesis/ui'
import styles from './showcase.module.css'

export function InputShowcase() {
  return (
    <div className={styles.page}>
      <Stack gap="4">
        <Heading as="h1" size="h2">input</Heading>
        <Text color="secondary">Form input with built-in label, helper text, error state, and icon slots. Auto-generates accessible ids via useId().</Text>
      </Stack>

      <Divider spacing="lg" />

      <Stack gap="8">
        <Stack gap="4">
          <Heading as="h3" size="h4">sizes</Heading>
          <Card variant="flat" padding="lg">
            <Stack gap="4" style={{ maxWidth: '40rem' }}>
              <Input size="sm" label="small" placeholder="small input" />
              <Input size="md" label="medium" placeholder="medium input" />
              <Input size="lg" label="large" placeholder="large input" />
            </Stack>
          </Card>
        </Stack>

        <Stack gap="4">
          <Heading as="h3" size="h4">states</Heading>
          <Card variant="flat" padding="lg">
            <Stack gap="4" style={{ maxWidth: '40rem' }}>
              <Input label="with helper" helperText="enter your display name" placeholder="sintesis" />
              <Input label="with error" error="this field is required" placeholder="empty field" />
              <Input label="disabled" disabled value="cannot be changed" readOnly />
            </Stack>
          </Card>
        </Stack>

        <Stack gap="4">
          <Heading as="h3" size="h4">types</Heading>
          <Card variant="flat" padding="lg">
            <Stack gap="4" style={{ maxWidth: '40rem' }}>
              <Input label="email" type="email" placeholder="you@example.com" />
              <Input label="password" type="password" placeholder="••••••••" />
              <Input label="search" type="search" placeholder="search tokens…" />
            </Stack>
          </Card>
        </Stack>
      </Stack>

      <Divider label="usage" spacing="lg" />

      <Card variant="outlined" padding="md">
        <Text variant="code" as="pre">{`import { Input } from '@sintesis/ui'\n\n<Input\n  label="email"\n  helperText="we'll never share it"\n  placeholder="you@example.com"\n  type="email"\n/>`}</Text>
      </Card>
    </div>
  )
}
