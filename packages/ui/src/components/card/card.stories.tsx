import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './card'
import { Text } from '../typography'
import { Button } from '../button'

const meta = {
  component: Card,
  tags: ['ai-generated'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const content = <Text>This is the card body content.</Text>

export const Raised: Story = { args: { children: content } }
export const Flat: Story = { args: { variant: 'flat', children: content } }
export const Outlined: Story = { args: { variant: 'outlined', children: content } }
export const WithHeader: Story = { args: { header: 'card title', children: content } }
export const WithFooter: Story = {
  args: {
    header: 'confirm action',
    footer: <Button size="sm">confirm</Button>,
    children: <Text>Are you sure you want to continue?</Text>,
  },
}
export const PaddingLarge: Story = { args: { padding: 'lg', children: content } }
