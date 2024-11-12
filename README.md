# `@jphil/bookwhen-client`

An API client library for the [Bookwhen](https://www.bookwhen.com) booking platform [API (v2)](https://api.bookwhen.com/v2), written in Typescript for NodeJS. Intended for server-side environments. \[wip\]!

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

## Overview

You'll likely be at least somewhat familiar with the [Bookwhen](https://www.bookwhen.com) booking platform if you've landed here. But if not, you'll want to have a look at their [API (v2) documentation](https://api.bookwhen.com/v2). There's also a nice [Swagger style layout of the Bookwhen API v2 docs](https://petstore.swagger.io/?url=https://api.bookwhen.com/v2/openapi.yaml)

## Features

- Provides an easy way to pull your data from Bookwhen for NodeJS environments
- Provides fully typed methods for each model (so far just the events model) in the Bookwhen API v2

## Installation

Install via pnpm:

```bash
pnpm add @jphil/bookwhen-client
```

## Usage

!N.B. this usage structure may change as I progress towards a 1.0.0

```typescript
// import the client factory
import { createBookwhenClient } from '@jphil/bookwhen-client';

// create the client (optional debug param to get requests logged to console)
const client = createBookwhenClient({ apiKey: 'your-API-key'[, debug = true]});

// use events Service method to get a single event
const event = client.events.getById({eventId: 'some-id'});

// get all events
const events = client.events.getMultiple();

// get all events in 2025
const events_2025 = client.events.getMultiple({
  filters: [
    from: '20250101',
    to: '20251231'
  ]
});

```

## Configuration

Required configuration options:

- **apiKey**: Your Bookwhen API key (required)

API requests to the Bookwhen API are authenticated using Basic Authentication with the API Key as the username and a blank password.

API keys can be generated in the [API tokens setup area of your Bookwhen account](https://YOUR-ACCOUNT-NAME.bookwhen.com/settings/api_access_permission_sets).

## Contributing

Please see the docs in the CONTRIBUTIONS.md file, thanks!

## Roadmap

- Keep up with any future changes or additions to the [Bookwhen API](https://api.bookwhen.com/v2), additions will be driven mainly by this.
- Possibly add a "fields" param to service methods to allow response filtering

### Todos
- [] put Zod in place in more areas to strengthen runtime type guards
- [] flesh out e2e tests
- [] write services for the other models in the API
- [] create e2e test github action workflow

## License

ISC License. See [LICENSE](LICENSE) for more information.
