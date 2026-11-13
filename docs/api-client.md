# API client (`src/api-client`)

Typed, server-only clients for the backend, generated from its OpenAPI contract.

```sh
npm run openapi      # in the backend, after changing an endpoint
npm run api:types    # here: regenerates src/api-client/schema.d.ts
```

CI fails if either file is out of date.
