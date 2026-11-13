import type { Meta, StoryObj } from '@storybook/react-vite';
import { MeasurementField, QuantityField } from './QuantityField';

const meta = {
  title: 'Forms/Quantity and measurements',
  component: QuantityField,
  args: { label: 'Packs', defaultValue: 2, description: '1.44 m² per pack' },
} satisfies Meta<typeof QuantityField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quantity: Story = {};
export const AtTheMinimum: Story = { args: { defaultValue: 1 } };
export const QuantityError: Story = {
  args: { isInvalid: true, errorMessage: 'For more than 999 packs, call us', defaultValue: 1200 },
};

export const PatioArea: Story = {
  render: () => (
    <MeasurementField
      label="Patio area"
      unit="m²"
      unitLabel="square metres"
      description="Length times width. We add 10% for cuts."
      defaultValue={18}
      minValue={1}
      step={0.1}
    />
  ),
};

export const MadeToMeasure: Story = {
  render: () => (
    <MeasurementField
      label="Width"
      unit="mm"
      unitLabel="millimetres"
      description="400 to 2000 mm"
      minValue={400}
      maxValue={2000}
      isInvalid
      errorMessage="Enter a width from 400 to 2000 mm"
      defaultValue={2400}
    />
  ),
};
