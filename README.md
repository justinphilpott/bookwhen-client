# `@jphil/bookwhen-client`

\[wip\]!

An API client library for the [Bookwhen](www.bookwhen.com) booking platform [API (v2)](https://api.bookwhen.com/v2), written in Typescript for NodeJS. Intended for server-side environments.

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

You'll likely be at least somewhat familiar with the [Bookwhen](www.bookwhen.com) booking platform if you've landed here. But if not, you'll want to have a look at their [API (v2) documentation](https://api.bookwhen.com/v2). There's also a nice [Swagger style layout of the Bookwhen API v2 docs](https://petstore.swagger.io/?url=https://api.bookwhen.com/v2/openapi.yaml)

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
import { createBookwhenClient } from 'bookwhen-client';

const client = createBookwhenClient(YOUR_API_KEY)
const event = client.event.getByID({myEventId});
const events = client.event.getMultiple({
  filters: ["filter1", "filter2"]
  includes: ["inc1", "inc2"]
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

- Todos
[] - put Zod in place in more areas to strengthen runtime type guards
[] - refine error handling
[] - write more integration tests
[] - write services for the other integrations

## License

ISC License. See [LICENSE](LICENSE) for more information.
