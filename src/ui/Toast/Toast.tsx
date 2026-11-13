'use client';

import {
  Button as AriaButton,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
} from 'react-aria-components';
import { CloseIcon } from '../icons';
import styles from './Toast.module.css';

export interface ToastMessage {
  title: string;
  description?: string;
  action?: { label: string; onAction: () => void };
}

export type ToastQueue = AriaToastQueue<ToastMessage>;

// Toasts stay until closed: PRD section 12 asks for no time limits. React Aria's toast is still
// marked unstable, so it is only used through this file.
export function createToastQueue(): ToastQueue {
  return new AriaToastQueue<ToastMessage>({ maxVisibleToasts: 3 });
}

export function ToastRegion({ queue }: { queue: ToastQueue }) {
  return (
    <AriaToastRegion queue={queue} className={styles.region}>
      {({ toast }) => (
        <AriaToast toast={toast} className={styles.toast}>
          <AriaToastContent className={styles.content}>
            <Text slot="title" className={styles.title}>
              {toast.content.title}
            </Text>
            {toast.content.description && (
              <Text slot="description" className={styles.description}>
                {toast.content.description}
              </Text>
            )}
          </AriaToastContent>
          {toast.content.action && (
            <AriaButton
              className={styles.action}
              onPress={() => {
                toast.content.action?.onAction();
                queue.close(toast.key);
              }}
            >
              {toast.content.action.label}
            </AriaButton>
          )}
          <AriaButton slot="close" className={styles.close} aria-label="Close">
            <CloseIcon />
          </AriaButton>
        </AriaToast>
      )}
    </AriaToastRegion>
  );
}
