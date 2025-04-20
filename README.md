# `@jphil/bookwhen-client`

A universal API client library for the [Bookwhen](https://www.bookwhen.com) booking platform [API (v2)](https://api.bookwhen.com/v2), written in TypeScript for both NodeJS and browser environments.

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

- Provides an easy way to access Bookwhen API from both NodeJS and browsers
- Browser-compatible with proper CORS handling
- Provides fully typed methods for each model (so far just the Events model) provided in the Bookwhen API v2

## Installation

Install via pnpm:

```bash
pnpm add @jphil/bookwhen-client
```

## Usage

```typescript
// import the client factory
import { createBookwhenClient } from '@jphil/bookwhen-client';

// create the client
const client = createBookwhenClient({ 
  apiKey: 'your-API-key',
  debug: true  // Optional: enables request logging
});

// Get a single event
const event = await client.events.getById({
  eventId: 'some-id',
  includes: ['location', 'tickets']  // Optional: include related resources
});

// get all events
const events = await client.events.getMultiple();

// get all events in 2025 tagged with 'workshop'
const events_2025 = await client.events.getMultiple({
  filters: {  // Optional: filter by various 
    from: '20250101',
    to: '20251231',
    tag: ['workshop']
  },
  includes: ['location']   // Optional: Include related resources
});

```

(N.B. Ensure you wrap the above statements in try/catch blocks to catch errors which could be thrown)

Valid filters and includes for each method are detailed in the [API v2 docs](https://petstore.swagger.io/?url=https://api.bookwhen.com/v2/openapi.yaml) 

Services for the other models in the API are in the pipeline.

N.B. This library is still a pre-1.0.0 WIP, please use accordingly!

## Browser Usage Notes

This client is designed to expose your Bookwhen API key to browsers. By design:
- API keys are visible in client-side code
- Only accesses public endpoints
- No sensitive data exposure

## Configuration

Required configuration:

- **apiKey**: Your Bookwhen API key (required)

API requests to the Bookwhen API are authenticated using Basic Authentication with the API Key as the username and a blank password.

API keys can be generated in the [API tokens setup area of your Bookwhen account](https://admin.bookwhen.com/settings/api_access_permission_sets). (This will link to the API settings page in your Bookwhen account if you have one and are logged into your admin account)

## Contributing

Please see the docs in the CONTRIBUTIONS.md file, thanks!

## Roadmap

- Proceed towards a 1.0.0 with community feedback.
- Keep up with any future changes or additions to the [Bookwhen API](https://api.bookwhen.com/v2).

### Todos

- [] create e2e test suite with github action workflow
- [] put Zod in place in more areas to strengthen runtime type guards
- [] write services for the other models in the API

## License

ISC License. See [LICENSE](LICENSE) for more information.
