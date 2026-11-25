import type { OfflineAction as Action } from '@/api-client';
import { LocalHelpForm } from '@/features/contact';
import { OfflineChooser, type OfflineColour } from './OfflineChooser';

const FORM_ID = 'local-help-form';

interface Props {
  action: Action;
  phone: string;
  handle: string;
  spec: string;
  colours?: { label: string; options: OfflineColour[] } | null;
}

// For a product that isn't sold online: the choices and the stockist form, which sends the choice.
export function OfflineAction({ handle, ...props }: Props) {
  return (
    <OfflineChooser
      {...props}
      formId={FORM_ID}
      form={<LocalHelpForm kind={props.action} productHandle={handle} />}
    />
  );
}
