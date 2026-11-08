import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from './typography'

const meta = {
  title: 'Typography/Text',
  component: Text,
  tags: ['ai-generated'],
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Body: Story = { args: { children: 'The quick brown fox jumps over the lazy dog.' } }
export const Caption: Story = { args: { variant: 'caption', children: 'Last updated 3 minutes ago' } }
export const Label: Story = { args: { variant: 'label', as: 'span', children: 'status' } }
export const Code: Story = { args: { variant: 'code', as: 'code', children: 'npm install @sintesis/ui' } }
export const BrandColor: Story = { args: { color: 'brand', children: 'sintesis design system' } }
