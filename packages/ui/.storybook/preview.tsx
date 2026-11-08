import type { Preview } from '@storybook/react-vite'
import '../src/tokens/tokens.css'
import './preview-global.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      default: 'base',
      values: [
        { name: 'base', value: 'var(--gnrc-color-neutral-100)' },
        { name: 'raised', value: 'var(--gnrc-color-neutral-50)' },
        { name: 'dark', value: 'var(--gnrc-color-neutral-900)' },
      ],
    },
  },
}

export default preview
