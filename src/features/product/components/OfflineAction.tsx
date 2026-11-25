import { LocalHelpForm } from '@/features/contact';
import { OfflineChooser, type OfflineColour } from './OfflineChooser';

const FORM_ID = 'local-help-form';

interface Props {
  phone: string;
  handle: string;
  spec: string;
  colours?: { label: string; options: OfflineColour[] } | null;
  size?: string | null;
}

// For a product that isn't sold online: the choices and the stockist form, which sends the choice.
// Shoppers need somewhere to buy it, so the button is always Find a stockist.
export function OfflineAction({ handle, ...props }: Props) {
  return (
    <OfflineChooser
      {...props}
      formId={FORM_ID}
      form={<LocalHelpForm kind="stockist" productHandle={handle} />}
    />
  );
}
