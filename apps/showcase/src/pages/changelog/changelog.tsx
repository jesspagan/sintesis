import { Stack, Heading, Text, Divider, Badge, Card } from '@sintesis/ui'
import uiChangelog from 'virtual:ui-changelog'
import showcaseChangelog from '../../../CHANGELOG.md?raw'
import { marked } from 'marked'
import styles from './changelog.module.css'

function ChangelogSection({ title, raw, badge }: { title: string; raw: string; badge: string }) {
  const html = marked.parse(raw) as string
  return (
    <Stack gap="4">
      <Stack direction="row" gap="3" align="center">
        <Heading as="h2" size="h3">{title}</Heading>
        <Badge variant="info" size="sm">{badge}</Badge>
      </Stack>
      <Card variant="outlined" padding="lg">
        <div
          className={styles['markdown']}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Card>
    </Stack>
  )
}

export function ChangelogPage() {
  return (
    <div className={styles.page}>
      <Stack gap="4">
        <Heading as="h1" size="h2">changelog</Heading>
        <Text color="secondary">
          Evolution of @sintesis/ui and this showcase site. Both follow <a href="https://keepachangelog.com">Keep a Changelog</a> format.
        </Text>
      </Stack>

      <Divider spacing="lg" />

      <Stack gap="12">
        <ChangelogSection title="@sintesis/ui" raw={uiChangelog} badge="design system" />
        <ChangelogSection title="showcase" raw={showcaseChangelog} badge="site" />
      </Stack>
    </div>
  )
}
