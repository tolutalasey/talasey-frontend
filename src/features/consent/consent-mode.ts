import { consentModeDefaults, consentModeFor, type ConsentState } from '@/analytics';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// gtag's queue, without loading any Google script: tags read it if and when they load.
function gtag(...args: unknown[]) {
  window.dataLayer ??= [];
  window.dataLayer.push(args);
}

export function updateConsentMode(choices: ConsentState) {
  gtag('consent', 'update', consentModeFor(choices));
}

// Runs before anything else in <head>, so Consent Mode v2 starts with everything denied.
export const consentDefaultsScript = `window.dataLayer=window.dataLayer||[];window.dataLayer.push(['consent','default',${JSON.stringify(
  { ...consentModeDefaults, wait_for_update: 500 },
)}]);`;
