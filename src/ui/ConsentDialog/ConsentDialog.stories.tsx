import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConsentDialog } from './ConsentDialog';

const meta = {
  title: 'Overlays/Consent dialog',
  component: ConsentDialog,
  args: {
    isOpen: true,
    categories: [
      {
        id: 'analytics',
        label: 'Analytics',
        description: 'Counts visits and how pages are used, so we can improve them.',
      },
      {
        id: 'marketing',
        label: 'Marketing',
        description:
          'Measures our ads on Google, Meta, Pinterest and TikTok, and personalises them.',
      },
    ],
    intro: (
      <p>
        We use cookies to see how the site is used and to measure our ads. Nothing is set until you
        choose. You can change your mind at any time from Cookie settings in the footer.
      </p>
    ),
    onAcceptAll: fn(),
    onRejectAll: fn(),
    onSave: fn(),
  },
} satisfies Meta<typeof ConsentDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstVisit: Story = {};
export const ReturningWithChoices: Story = {
  args: { choices: { analytics: true, marketing: false } },
};
