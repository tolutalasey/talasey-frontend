'use client';

import { useState } from 'react';
import { Modal } from '@/ui/Modal/Modal';
import { LOCAL_HELP, type LocalHelpKind } from '../local-help';
import { LocalHelpForm } from './LocalHelpForm';

interface Props {
  kind: LocalHelpKind;
  label: string;
  productHandle: string;
  // The product and options the shopper is looking at, to start the form with.
  products?: string;
  className?: string;
}

// A button that opens the stockist, installer or showroom form over the product page.
export function EnquiryPopup({ kind, label, productHandle, products, className }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>
      <Modal title={LOCAL_HELP[kind].title} isOpen={open} onOpenChange={setOpen}>
        <p>{LOCAL_HELP[kind].intro}</p>
        <LocalHelpForm
          kind={kind}
          id={`${kind}-form`}
          productHandle={productHandle}
          products={products}
        />
      </Modal>
    </>
  );
}
