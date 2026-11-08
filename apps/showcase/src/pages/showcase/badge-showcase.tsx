import { Stack, Heading, Text, Badge, Divider, Card } from '@sintesis/ui'
import styles from './showcase.module.css'

export function BadgeShowcase() {
  const variants = ['default', 'success', 'warning', 'error', 'info'] as const
  const labels: Record<typeof variants[number], string> = {
    default: 'default',
    success: 'active',
    warning: 'pending',
    error: 'failed',
    info: 'draft',
  }

  return (
    <div className={styles.page}>
      <Stack gap="4">
        <Heading as="h1" size="h2">badge</Heading>
        <Text color="secondary">Inline status indicator. 5 semantic variants, 2 sizes, and an optional dot indicator.</Text>
      </Stack>

      <Divider spacing="lg" />

      <Stack gap="8">
        <Stack gap="4">
          <Heading as="h3" size="h4">variants</Heading>
          <Card variant="flat" padding="lg">
            <Stack direction="row" gap="3" wrap>
              {variants.map((v) => (
                <Badge key={v} variant={v}>{labels[v]}</Badge>
              ))}
            </Stack>
          </Card>
        </Stack>

        <Stack gap="4">
          <Heading as="h3" size="h4">with dot indicator</Heading>
          <Card variant="flat" padding="lg">
            <Stack direction="row" gap="3" wrap>
              {variants.map((v) => (
                <Badge key={v} variant={v} dot>{labels[v]}</Badge>
              ))}
            </Stack>
          </Card>
        </Stack>

        <Stack gap="4">
          <Heading as="h3" size="h4">sizes</Heading>
          <Card variant="flat" padding="lg">
            <Stack direction="row" gap="3" align="center" wrap>
              <Badge size="sm" variant="success">small</Badge>
              <Badge size="md" variant="success">medium</Badge>
            </Stack>
          </Card>
        </Stack>

        <Stack gap="4">
          <Heading as="h3" size="h4">in context</Heading>
          <Card variant="outlined" padding="lg">
            <Stack gap="4">
              <Stack direction="row" gap="2" align="center">
                <Heading as="h4" size="h4">release v0.1.0</Heading>
                <Badge variant="success" dot>published</Badge>
              </Stack>
              <Stack direction="row" gap="2" align="center">
                <Heading as="h4" size="h4">release v0.2.0</Heading>
                <Badge variant="warning">pending review</Badge>
              </Stack>
              <Stack direction="row" gap="2" align="center">
                <Heading as="h4" size="h4">release v0.3.0</Heading>
                <Badge variant="info">draft</Badge>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Stack>

      <Divider label="usage" spacing="lg" />

      <Card variant="outlined" padding="md">
        <Text variant="code" as="pre">{`import { Badge } from '@sintesis/ui'\n\n<Badge variant="success" dot>active</Badge>`}</Text>
      </Card>
    </div>
  )
}
