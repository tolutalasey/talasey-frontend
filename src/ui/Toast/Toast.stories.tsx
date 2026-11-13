import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { createToastQueue, ToastRegion, type ToastMessage } from './Toast';

function Demo({ message, show }: { message: ToastMessage; show: boolean }) {
  const [queue] = useState(() => {
    const created = createToastQueue();
    if (show) created.add(message);
    return created;
  });
  return (
    <>
      <Button onPress={() => queue.add(message)}>Show toast</Button>
      <ToastRegion queue={queue} />
    </>
  );
}

const meta = {
  title: 'Feedback/Toast',
  component: Demo,
  args: {
    show: true,
    message: { title: 'Added to basket', description: '2 packs of Dusk grey porcelain paving' },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddedToBasket: Story = {};
export const WithUndo: Story = {
  args: {
    message: {
      title: 'Removed from basket',
      description: 'Pavetuf jointing compound, grey',
      action: { label: 'Undo', onAction: fn() },
    },
  },
};
export const OnRequest: Story = { args: { show: false } };
