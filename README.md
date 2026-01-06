# `@jphil/bookwhen-client`

[![npm version](https://img.shields.io/npm/v/@jphil/bookwhen-client.svg)](https://www.npmjs.com/package/@jphil/bookwhen-client)
[![CI](https://github.com/jphil/bookwhen-client/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/jphil/bookwhen-client/actions/workflows/ci.yml)

A universal API client library for the [Bookwhen](https://www.bookwhen.com) booking platform [API (v2)](https://api.bookwhen.com/v2), written in TypeScript for Node.js and browser environments.

Status: pre-1.0.0; APIs may change. Please file issues for bugs or missing endpoints.
Changelog: [CHANGELOG.md](CHANGELOG.md)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Supported Models](#supported-models)
- [Installation](#installation)
- [Usage](#usage)
- [JSON:API Response Structure](#jsonapi-response-structure)
- [Migration from v0.3.2](#migration-from-v032)
- [Browser Usage](#browser-usage)
- [Error Handling](#error-handling)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

## Overview

If you're new to Bookwhen, start with the [API (v2) documentation](https://api.bookwhen.com/v2). There's also a [Swagger UI view of the v2 spec](https://petstore.swagger.io/?url=https://api.bookwhen.com/v2/openapi.yaml).

## Features

- Easy access to the Bookwhen API from Node.js and browsers
- Typed methods for each supported model (currently Events)
- **Full JSON:API compliance** with access to included resources, links, and metadata
- **Relationship resolution utilities** for working with included data
- **Type-safe JSON:API response interfaces** with proper TypeScript support

## Supported Models

| Model | Status | Notes |
| --- | --- | --- |
| Events | Supported | Full JSON:API responses and relationship helpers |

Additional models are planned; see the [issue tracker](https://github.com/jphil/bookwhen-client/issues).

## Installation

Install via pnpm (or npm/yarn):

```bash
pnpm add @jphil/bookwhen-client
# or npm install @jphil/bookwhen-client
# or yarn add @jphil/bookwhen-client
```

As `axios` and `zod` are peer dependencies, ensure they are also installed in your project:

```bash
pnpm add axios zod
# or npm install axios zod
# or yarn add axios zod
```

## Usage

This library is published as an ES module. It works in modern Node.js (with `type: "module"` or `.mjs`) and in browser builds via a bundler. For direct browser usage without a bundler, see the [Browser Usage](#browser-usage) section.

```typescript
// import the client factory
import { createBookwhenClient } from '@jphil/bookwhen-client';

// create the client
const client = createBookwhenClient({
  apiKey: 'your-API-key',
  debug: true, // Optional: enables request logging
});

// Get a single event (full JSON:API response)
const eventResponse = await client.events.getById({
  eventId: 'some-id',
  includes: ['location', 'tickets'], // Optional: include related resources
});
const event = eventResponse.data; // Access the event data

// Get all events (full JSON:API response)
const eventsResponse = await client.events.getMultiple();
const events = eventsResponse.data; // Access the events array

// Get all events in 2025 tagged with 'workshop', including locations
const events2025Response = await client.events.getMultiple({
  filters: {
    // Optional: filter by various
    from: '20250101',
    to: '20251231',
    tag: ['workshop'],
  },
  includes: ['location'], // Optional: Include related resources
});
const events2025 = events2025Response.data; // Access the events array
const includedLocations = events2025Response.included; // Access included location data
```

### End-to-end example

```typescript
import {
  createBookwhenClient,
  resolveJsonApiRelationships,
} from '@jphil/bookwhen-client';

const client = createBookwhenClient({ apiKey: 'your-API-key' });

const response = await client.events.getMultiple({
  includes: ['location', 'tickets'],
});

const resolvedEvents = resolveJsonApiRelationships(
  response.data,
  response.included ?? []
);

const firstEvent = resolvedEvents[0];
```

Note: wrap calls in try/catch blocks to handle errors; see [Error Handling](#error-handling).

See the [API v2 docs](https://petstore.swagger.io/?url=https://api.bookwhen.com/v2/openapi.yaml) for valid filters and includes by endpoint.

## JSON:API Response Structure

Service methods return full JSON:API response objects instead of just data arrays. This provides access to all data returned by the Bookwhen API, including included resources, links, and metadata.

### Response Structure Example

```typescript
const response = await client.events.getMultiple({
  includes: ['location', 'tickets']
});

// response structure:
{
  data: [
    {
      id: 'ev-123',
      type: 'event',
      attributes: {
        title: 'Thai massage with Justin',
        start_at: '2025-11-02T11:00:00.000+00:00',
        // ... other event attributes
      },
      relationships: {
        location: { data: { id: 'loc-1', type: 'location' } },
        tickets: { data: [{ id: 'ticket-1', type: 'ticket' }] }
      }
    }
  ],
  included: [
    {
      id: 'loc-1',
      type: 'location',
      attributes: {
        address_text: 'MovingStillness Studio\nColdean\nBrighton',
        latitude: 50.8608545,
        longitude: -0.1070177
      }
    },
    {
      id: 'ticket-1',
      type: 'ticket',
      attributes: {
        name: 'Standard Ticket',
        price: 100,
        available: true
      }
    }
  ],
  links: {
    self: 'https://api.bookwhen.com/v2/events'
  },
  meta: {
    // Optional metadata
  }
}
```

### Working with Included Data

The library provides utility functions to help resolve relationships between resources:

```typescript
import { resolveJsonApiRelationships, resolveJsonApiResource } from '@jphil/bookwhen-client';

// For multiple events
const eventsResponse = await client.events.getMultiple({
  includes: ['location', 'tickets']
});

// Resolve relationships for all events
const resolvedEvents = resolveJsonApiRelationships(
  eventsResponse.data, 
  eventsResponse.included
);

// For a single event
const eventResponse = await client.events.getById({
  eventId: 'ev-123',
  includes: ['location']
});

// Resolve relationships for a single event
const resolvedEvent = resolveJsonApiResource(
  eventResponse.data,
  eventResponse.included
);
```

## Migration from v0.3.2

Version 0.4.0 introduces breaking changes to return full JSON:API responses:

### Before (v0.3.2)
```typescript
const events = await client.events.getMultiple(); // BookwhenEvent[]
const event = await client.events.getById({ eventId: '123' }); // BookwhenEvent
```

### After (v0.4.0)
```typescript
const response = await client.events.getMultiple(); // EventsResponse
const events = response.data; // BookwhenEvent[]

const eventResponse = await client.events.getById({ eventId: '123' }); // EventResponse
const event = eventResponse.data; // BookwhenEvent
```

Support for other API models is planned.

## Browser Usage

The client is well-suited for browser environments.

### With a Bundler (Recommended for Browser Projects)

If you are using a JavaScript bundler (like Webpack, Rollup, Vite, Parcel, etc.) in your browser project, you can import and use the client as shown in the main [Usage](#usage) section:

```typescript
import { createBookwhenClient } from '@jphil/bookwhen-client';
// ... rest of your code
```

Ensure that `axios` and `zod` are also installed in your project, as they are peer dependencies. Your bundler will typically handle resolving these.

### Directly with `<script type="module">` (Advanced)

For direct usage in a browser via `<script type="module">` without a bundler, you will need to:

1. Ensure ES module versions of `axios` and `zod` are accessible to your page (e.g., served locally or via a CDN).
2. Use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) to tell the browser how to resolve the module specifiers for `@jphil/bookwhen-client`, `axios`, and `zod`.

Example import map:

```html
<script type="importmap">
  {
    "imports": {
      "@jphil/bookwhen-client": "/node_modules/@jphil/bookwhen-client/dist/index.es.js",
      "axios": "/node_modules/axios/dist/esm/axios.js",
      "zod": "/node_modules/zod/lib/index.mjs"
    }
  }
</script>
<script type="module">
  import { createBookwhenClient } from '@jphil/bookwhen-client';
  // ...
</script>
```

Note: The exact paths in the import map will depend on how you serve these dependencies. Usage with a bundler is generally simpler for browser projects.

### Important Note on API Keys in Client-Side Usage

When using this library in a browser (client-side), your Bookwhen API key will necessarily be included in the client-side code and thus visible.

- It is crucial to use an API key that has the minimum necessary permissions for the operations you intend to perform from the client-side.
- This library enables access to Bookwhen API endpoints based on the permissions granted to the API key you provide.

## Error Handling

The library provides comprehensive error handling that works consistently in both Node.js and browser environments. Custom error objects thrown by the library will have the following properties:

- `code`: An error code string identifying the type of error (e.g., `NETWORK_ERROR`, `API_ERROR`).
- `message`: A human-readable description of the error.
- `isBrowser`: A boolean indicating if the error occurred in a browser environment.
- `context`: An object containing additional details, which may include the original error, status codes, etc.
- `timestamp`: The time the error occurred.

### Error Types

- `NETWORK_ERROR`: Indicates a failure in API communication (e.g., DNS resolution, connection refused).
- `SECURITY_ERROR`: Specific to browsers, indicates security restrictions prevented API access (e.g., CORS issues not handled by the server, mixed content).
- `API_ERROR`: The Bookwhen API returned an error response (e.g., 4xx or 5xx status code). The `context` may include `statusCode` and `responseData`.
- `CONFIG_ERROR`: The client was configured incorrectly (e.g., missing API key).
- `UNKNOWN_ERROR`: An unexpected error occurred within the library.

Example:

```typescript
try {
  await client.events.getById({ eventId: 'invalid-id' });
} catch (error: any) {
  // It's good practice to type the error if you have custom error types defined
  console.error(`Error Code: ${error.code}`);
  console.error(`Message: ${error.message}`);
  if (error.code === 'API_ERROR') {
    console.error('API Error Details:', error.context?.responseData);
  } else if (error.code === 'NETWORK_ERROR') {
    // Handle network issues, maybe retry or inform user
  }
  // Other error handling...
}
```

## Configuration

Required configuration:

- **apiKey**: Your Bookwhen API key (required)

API requests to the Bookwhen API are authenticated using Basic Authentication with the API Key as the username and a blank password.

API keys can be generated in the [API tokens setup area of your Bookwhen account](https://admin.bookwhen.com/settings/api_access_permission_sets). (This will link to the API settings page in your Bookwhen account if you have one and are logged into your admin account.)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contributor workflow and maintainer publishing notes.

## Roadmap

- Proceed towards a 1.0.0 with community feedback.
- Keep up with any future changes or additions to the [Bookwhen API](https://api.bookwhen.com/v2).

### Todos

See the [issue tracker](https://github.com/jphil/bookwhen-client/issues) for current todos.

## License

ISC License. See [LICENSE](LICENSE) for more information.
