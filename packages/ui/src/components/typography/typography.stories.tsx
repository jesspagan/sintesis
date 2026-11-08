import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading, Text } from './typography'

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  tags: ['ai-generated'],
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const H1: Story = { args: { as: 'h1', children: 'photosynthesis' } }
export const H2: Story = { args: { as: 'h2', children: 'design system' } }
export const H3: Story = { args: { as: 'h3', children: 'components' } }
export const H4: Story = { args: { as: 'h4', children: 'tokens' } }
export const Brand: Story = { args: { as: 'h2', color: 'brand', children: 'sintesis' } }
