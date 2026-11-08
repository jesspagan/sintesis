import { Stack, Heading, Text, Card, Button, Divider, Badge } from '@sintesis/ui'
import styles from './showcase.module.css'

export function CardShowcase() {
  return (
    <div className={styles.page}>
      <Stack gap="4">
        <Heading as="h1" size="h2">card</Heading>
        <Text color="secondary">Container primitive with 3 surface variants, configurable padding, and optional header and footer slots.</Text>
      </Stack>

      <Divider spacing="lg" />

      <Stack gap="8">
        <Stack gap="4">
          <Heading as="h3" size="h4">variants</Heading>
          <div className={styles.grid3}>
            <Card variant="flat" padding="lg">
              <Stack gap="2">
                <Text variant="label" as="span">flat</Text>
                <Text color="secondary">matches the page background</Text>
              </Stack>
            </Card>
            <Card variant="raised" padding="lg">
              <Stack gap="2">
                <Text variant="label" as="span">raised</Text>
                <Text color="secondary">elevated surface with shadow</Text>
              </Stack>
            </Card>
            <Card variant="outlined" padding="lg">
              <Stack gap="2">
                <Text variant="label" as="span">outlined</Text>
                <Text color="secondary">defined by a border stroke</Text>
              </Stack>
            </Card>
          </div>
        </Stack>

        <Stack gap="4">
          <Heading as="h3" size="h4">with header and footer</Heading>
          <div className={styles.grid2}>
            <Card variant="outlined" header="profile settings">
              <Text color="secondary">Your profile is visible to workspace members.</Text>
            </Card>
            <Card
              variant="raised"
              header={
                <Stack direction="row" gap="2" align="center">
                  <span>deploy to production</span>
                  <Badge variant="warning" size="sm">pending</Badge>
                </Stack>
              }
              footer={
                <Stack direction="row" gap="2" justify="end">
                  <Button size="sm" variant="ghost">cancel</Button>
                  <Button size="sm">confirm</Button>
                </Stack>
              }
            >
              <Text color="secondary">This will push changes to the production environment.</Text>
            </Card>
          </div>
        </Stack>

        <Stack gap="4">
          <Heading as="h3" size="h4">padding scale</Heading>
          <Stack gap="3">
            {(['none', 'sm', 'md', 'lg'] as const).map((p) => (
              <Card key={p} variant="outlined" padding={p}>
                <Text variant="label" as="span">padding: {p}</Text>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Stack>

      <Divider label="usage" spacing="lg" />

      <Card variant="outlined" padding="md">
        <Text variant="code" as="pre">{`import { Card } from '@sintesis/ui'\n\n<Card variant="raised" header="title" footer={<Button>ok</Button>}>\n  <p>card content</p>\n</Card>`}</Text>
      </Card>
    </div>
  )
}
