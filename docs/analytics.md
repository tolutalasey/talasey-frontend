# Analytics (`src/analytics`)

The typed analytics event schema from PRD section 16, the consent record, Google Consent Mode v2 states, and a consent-aware `track()`.

```ts
const track = createTracker({ getConsent: readConsent, send: pushToTagManager });
track({ name: 'add_to_cart', params: { currency: 'GBP', value: 179.98, items: [paving] } });
```

- `analyticsEvent` validates every event in the plan: browsing, samples, planning, buying, finance, leads and content. Parameters follow GA4's recommended events where one exists.
- `keyEvents` are the conversions the business is measured on; `serverOnlyEvents` (`sample_delivered`, `finance_approved`, `refund`) are only ever sent by our servers.
- `track()` sends nothing without analytics consent, refuses server-only events, and drops events that fail the schema.
- `consentModeDefaults` is Consent Mode v2 in basic mode: everything denied until the visitor chooses. `consentModeFor(choices)` gives the update to send after they do.
- The consent record (`CONSENT_COOKIE`) lasts 6 months; bump `CONSENT_VERSION` when the list of tools changes so everyone is asked again.

The test in `src/events.test.ts` lists the PRD event plan and fails if the schema drifts from it.

```sh
npm run test
```
