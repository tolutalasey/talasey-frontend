import '@/tokens/tokens.css';
import '@/tokens/fonts/fonts.css';
import './preview.css';
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    controls: { expanded: true },
  },
};

export default preview;
