import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Stack } from './stack'

const meta = {
  component: Stack,
  tags: ['ai-generated'],
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  args: { gap: '4', children: ['one', 'two', 'three'].map((t, i) => <div key={i}>{t}</div>) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('one')).toBeVisible()
  },
}

export const Horizontal: Story = {
  args: { direction: 'row', gap: '4', align: 'center', children: ['A', 'B', 'C'].map((t, i) => <div key={i}>{t}</div>) },
}

export const CssCheck: Story = {
  args: { gap: '4', children: <div>check</div> },
  play: async ({ canvas }) => {
    const el = canvas.getByText('check').parentElement as HTMLElement
    await expect(getComputedStyle(el).gap).toBe('16px')
  },
}
