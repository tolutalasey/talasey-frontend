import type { ReactNode } from 'react';
import { LocalHelpForm } from '@/features/contact';
import { OfflineChooser, type OfflineColour } from './OfflineChooser';

const FORM_ID = 'local-help-form';

interface Props {
  phone: string;
  handle: string;
  spec: string;
  colours?: { label: string; options: OfflineColour[] } | null;
  size?: string | null;
  // The same calculator as buying, for products sold by the area they cover.
  calculator?: ReactNode;
  // What one of the product is called, like pack or board.
  unit?: { one: string; many: string };
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
