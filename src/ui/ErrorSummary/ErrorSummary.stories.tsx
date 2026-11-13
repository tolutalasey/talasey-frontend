import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { TextField } from '../TextField/TextField';
import { ErrorSummary } from './ErrorSummary';

const meta = {
  title: 'Forms/Form with inline errors',
  component: ErrorSummary,
  args: {
    errors: [
      { fieldId: 'postcode', message: 'Enter a UK postcode, like M1 1AE' },
      { fieldId: 'phone', message: 'Enter a phone number so the driver can call ahead' },
    ],
  },
  render: (args) => (
    <Form
      validationErrors={Object.fromEntries(
        args.errors.map((error) => [error.fieldId, error.message]),
      )}
    >
      <ErrorSummary {...args} />
      <TextField id="postcode" label="Postcode" name="postcode" defaultValue="M1" />
      <TextField
        id="phone"
        label="Phone"
        name="phone"
        type="tel"
        description="The driver calls ahead on the day"
      />
      <div>
        <Button type="submit">Show delivery prices</Button>
      </div>
    </Form>
  ),
} satisfies Meta<typeof ErrorSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithErrors: Story = {};
export const NoErrors: Story = { args: { errors: [] } };
