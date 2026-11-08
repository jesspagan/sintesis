import type { Meta, StoryObj } from '@storybook/react-vite'
import { Nav } from './nav'
import { Button } from '../button'

const items = [
  { label: 'tokens', to: '/tokens' },
  { label: 'components', to: '/components' },
  { label: 'changelog', to: '/changelog' },
]

const meta = {
  component: Nav,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Nav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { items } }

export const WithActiveItem: Story = {
  args: {
    items,
    isActive: (item) => item.to === '/tokens',
  },
}

export const WithActions: Story = {
  args: {
    items,
    actions: <Button size="sm" variant="primary">get started</Button>,
  },
}

export const LogoOnly: Story = { args: { logoLabel: 'sintesis' } }
