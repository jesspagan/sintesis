import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from './button'

const meta = {
  component: Button,
  tags: ['ai-generated'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { children: 'get started' },
  play: async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: /get started/i })
    await expect(btn).toBeVisible()
    await expect(btn).not.toBeDisabled()
  },
}

export const Secondary: Story = { args: { variant: 'secondary', children: 'learn more' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'cancel' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'delete account' } }
export const Small: Story = { args: { size: 'sm', children: 'compact' } }
export const Large: Story = { args: { size: 'lg', children: 'prominent' } }
export const Loading: Story = { args: { loading: true, children: 'saving…' } }
export const Disabled: Story = { args: { disabled: true, children: 'unavailable' } }
export const FullWidth: Story = { args: { fullWidth: true, children: 'submit' }, decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>] }
