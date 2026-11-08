import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta = {
  component: Badge,
  tags: ['ai-generated'],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { children: 'default' } }
export const Success: Story = { args: { variant: 'success', children: 'active' } }
export const Warning: Story = { args: { variant: 'warning', children: 'pending' } }
export const Error: Story = { args: { variant: 'error', children: 'failed' } }
export const Info: Story = { args: { variant: 'info', children: 'draft' } }
export const WithDot: Story = { args: { variant: 'success', dot: true, children: 'live' } }
export const Small: Story = { args: { size: 'sm', variant: 'info', children: 'beta' } }
