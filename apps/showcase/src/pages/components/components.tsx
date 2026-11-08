import { Link } from 'react-router-dom'
import { Stack, Heading, Text, Card, Badge, Button, Divider } from '@sintesis/ui'
import styles from './components.module.css'

const components = [
  { name: 'button', to: '/components/button', description: '4 variants, 3 sizes, loading and disabled states', badge: 'interactive' },
  { name: 'input', to: '/components/input', description: 'Label, helper text, error state, icon slots', badge: 'form' },
  { name: 'card', to: '/components/card', description: 'flat, raised, outlined — with optional header and footer', badge: 'layout' },
  { name: 'badge', to: '/components/badge', description: '5 status variants, dot indicator, 2 sizes', badge: 'display' },
  { name: 'typography', to: '/components/typography', description: 'Heading (h1–h4) + Text (body, caption, label, code)', badge: 'display' },
  { name: 'stack', to: '/components', description: 'Flexbox layout primitive — direction, gap, align, justify', badge: 'layout' },
  { name: 'divider', to: '/components', description: 'Horizontal rule with optional label', badge: 'layout' },
  { name: 'nav', to: '/components', description: 'Top navigation bar with logo, links, and actions slot', badge: 'layout' },
]

const badgeVariantMap: Record<string, 'default' | 'info' | 'success' | 'warning'> = {
  interactive: 'info',
  form: 'info',
  layout: 'default',
  display: 'success',
}

export function ComponentsPage() {
  return (
    <div className={styles.page}>
      <Stack gap="4">
        <Heading as="h1" size="h2">components</Heading>
        <Text color="secondary">8 composable components built entirely on semantic tokens. Each accepts standard HTML attributes and plays well with React Router.</Text>
      </Stack>

      <Divider spacing="lg" />

      <div className={styles.grid}>
        {components.map((c) => (
          <Card key={c.name} variant="outlined" padding="md" as={c.to !== '/components' ? undefined : undefined}>
            <Stack gap="3">
              <div className={styles['card-header']}>
                <Badge size="sm" variant={badgeVariantMap[c.badge] ?? 'default'}>{c.badge}</Badge>
              </div>
              <Heading as="h3" size="h4">{c.name}</Heading>
              <Text color="secondary" variant="body">{c.description}</Text>
              {c.to !== '/components' && (
                <Button as={Link} to={c.to} variant="ghost" size="sm" className={styles['view-btn']}>
                  view showcase →
                </Button>
              )}
            </Stack>
          </Card>
        ))}
      </div>
    </div>
  )
}
