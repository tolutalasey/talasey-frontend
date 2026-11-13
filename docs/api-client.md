# API client (`src/api-client`)

Typed, server-only clients for the backend, generated from its OpenAPI contract.

```sh
pnpm openapi      # in the backend, after changing an endpoint
pnpm api:types    # here: regenerates src/api-client/schema.d.ts
```

CI fails if either file is out of date.
