import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { DialogTrigger, Drawer, Modal } from './Modal';

const meta = {
  title: 'Overlays/Modal and drawer',
  component: Modal,
  args: { title: 'Size guide', children: null },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const guide = (close: () => void) => (
  <>
    <p>Measure the longest side of the area first, then the shortest. Add 10% for cuts.</p>
    <Button onPress={close}>Done</Button>
  </>
);

export const Closed: Story = {
  render: (args) => (
    <DialogTrigger>
      <Button variant="secondary">Size guide</Button>
      <Modal {...args}>{guide}</Modal>
    </DialogTrigger>
  ),
};

export const Open: Story = {
  render: (args) => (
    <Modal {...args} defaultOpen>
      {guide}
    </Modal>
  ),
};

export const DrawerOpen: Story = {
  args: { title: 'Filters' },
  render: (args) => (
    <Drawer {...args} defaultOpen>
      {(close) => (
        <>
          <p>Filters go here on phones.</p>
          <Button onPress={close}>Show 24 products</Button>
        </>
      )}
    </Drawer>
  ),
};
