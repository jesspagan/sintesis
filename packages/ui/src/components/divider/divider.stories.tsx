import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './divider'

const meta = {
  component: Divider,
  tags: ['ai-generated'],
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithLabel: Story = { args: { label: 'or continue with' } }
export const Strong: Story = { args: { color: 'strong' } }
export const Tight: Story = { args: { label: 'section', spacing: 'sm' } }
