import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_VERSION,
  consentModeDefaults,
  consentModeFor,
  type ConsentState,
} from '@/analytics/consent';

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

// Runs before the page paints: marks the page when the visitor hasn't chosen yet (or chose long
// ago, or before the cookie list changed), and CSS shows the consent dialog that is already in
// the HTML. Showing it at first paint, instead of after the JavaScript loads, keeps it from
// holding up the page's largest paint. Without JavaScript nothing is tracked and nothing is asked.
export const consentPromptScript = `(function(){var m=/(?:^|; )${CONSENT_COOKIE}=([^;]*)/.exec(document.cookie);var v=m?decodeURIComponent(m[1]).split('.'):[];var d=Date.parse(v.slice(3).join('.'));if(v[0]!=='${CONSENT_VERSION}'||!(Date.now()-d<${CONSENT_MAX_AGE_DAYS}*864e5))document.documentElement.dataset.consent='ask';})();`;
