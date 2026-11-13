import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './RadioGroup';

const meta = {
  title: 'Forms/Radio group',
  component: RadioGroup,
  args: { label: 'Delivery', children: null },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="pallet" description="£45.00">
        Pallet delivery
      </Radio>
      <Radio value="parcel" description="No parcel rate for 140 kg" isDisabled>
        Parcel delivery
      </Radio>
      <Radio value="collect" description="Free, from our Scunthorpe yard">
        Collect
      </Radio>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NothingChosen: Story = {};
export const Chosen: Story = { args: { defaultValue: 'pallet' } };
export const WithError: Story = {
  args: { isRequired: true, isInvalid: true, errorMessage: 'Choose how we deliver' },
};
