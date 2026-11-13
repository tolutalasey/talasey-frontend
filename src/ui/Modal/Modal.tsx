'use client';

import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  Dialog,
  Heading,
  Modal as AriaModal,
  ModalOverlay,
  type ModalOverlayProps,
} from 'react-aria-components';
import { cx } from '../cx';
import { CloseIcon } from '../icons';
import styles from './Modal.module.css';

type Content = ReactNode | ((close: () => void) => ReactNode);

export interface ModalProps extends Pick<
  ModalOverlayProps,
  'isOpen' | 'defaultOpen' | 'onOpenChange' | 'isDismissable' | 'isKeyboardDismissDisabled'
> {
  title: string;
  children: Content;
  // Hide the close button when the dialog must be answered, as the consent dialog is.
  hideClose?: boolean;
}

function Surface({
  title,
  children,
  hideClose,
  variant,
  ...props
}: ModalProps & { variant: 'dialog' | 'drawer' }) {
  return (
    <ModalOverlay
      isDismissable
      {...props}
      className={cx(styles.overlay, variant === 'drawer' && styles.drawerOverlay)}
    >
      <AriaModal className={cx(styles.modal, styles[variant])}>
        <Dialog className={styles.dialog}>
          {({ close }) => (
            <>
              <div className={styles.header}>
                <Heading slot="title" className={styles.title}>
                  {title}
                </Heading>
                {!hideClose && (
                  <AriaButton className={styles.close} aria-label="Close" onPress={close}>
                    <CloseIcon />
                  </AriaButton>
                )}
              </div>
              <div className={styles.body}>
                {typeof children === 'function' ? children(close) : children}
              </div>
            </>
          )}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  );
}

// Put it inside a DialogTrigger next to the button that opens it, or control it with isOpen.
export function Modal(props: ModalProps) {
  return <Surface {...props} variant="dialog" />;
}

// A panel that slides in from the right edge: filters on phones, the basket, the menu.
export function Drawer(props: ModalProps) {
  return <Surface {...props} variant="drawer" />;
}

export { DialogTrigger } from 'react-aria-components';
