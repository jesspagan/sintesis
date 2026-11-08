import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Input } from './input'

const meta = {
  component: Input,
  tags: ['ai-generated'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'email address', placeholder: 'you@example.com' },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText(/email address/i)
    await expect(input).toBeVisible()
    await expect(input).not.toBeDisabled()
  },
}

export const WithHelper: Story = { args: { label: 'username', helperText: 'lowercase only, no spaces', placeholder: 'sintesis' } }
export const WithError: Story = { args: { label: 'password', error: 'must be at least 8 characters', type: 'password' } }
export const Disabled: Story = { args: { label: 'read only', value: 'cannot change', disabled: true } }
export const Small: Story = { args: { size: 'sm', label: 'compact', placeholder: 'small input' } }
export const Large: Story = { args: { size: 'lg', label: 'prominent', placeholder: 'large input' } }
