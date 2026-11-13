import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, CheckboxGroup } from './Checkbox';

const meta = {
  title: 'Forms/Checkbox',
  component: CheckboxGroup,
  args: { label: 'Finish', children: null },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Checkbox value="corten">Weathered steel</Checkbox>
      <Checkbox value="galvanised" description="Silver grey, will not rust">
        Galvanised
      </Checkbox>
      <Checkbox value="powder" isDisabled>
        Powder coated (out of stock)
      </Checkbox>
    </CheckboxGroup>
  ),
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: ['corten'] } };
export const WithError: Story = {
  args: { isInvalid: true, errorMessage: 'Choose at least one finish' },
};
export const Single: Story = {
  render: () => <Checkbox value="terms">I have read the delivery terms</Checkbox>,
};
