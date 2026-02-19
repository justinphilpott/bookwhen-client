# `@jphil/bookwhen-client`

TypeScript client for the [Bookwhen API v2](https://api.bookwhen.com/v2), built for Node.js and browser environments.

This package is currently pre-1.0 and under active development.

## Quick Start

Install the library and peer dependencies:

```bash
pnpm add @jphil/bookwhen-client axios zod
```

Create a client and fetch events:

```typescript
import { createBookwhenClient } from '@jphil/bookwhen-client';

const client = createBookwhenClient({
  apiKey: process.env.BOOKWHEN_API_KEY!,
});

const response = await client.events.getMultiple({
  filters: { from: '20250101', to: '20251231' },
  includes: ['location', 'tickets'],
});

const events = response.data;
const included = response.included;
```

## API Coverage

Bookwhen resources currently implemented in this client:

| Resource     | Status      | Endpoints                                        |
| ------------ | ----------- | ------------------------------------------------ |
| Events       | Implemented | `/events`, `/events/{event_id}`                  |
| Tickets      | Implemented | `/tickets`, `/tickets/{ticket_id}`               |
| Locations    | Implemented | `/locations`, `/locations/{location_id}`         |
| Attachments  | Implemented | `/attachments`, `/attachments/{attachment_id}`   |
| Class passes | Implemented | `/class_passes`, `/class_passes/{class_pass_id}` |

Reference docs:

- Bookwhen API docs: https://api.bookwhen.com/v2
- Swagger layout: https://petstore.swagger.io/?url=https://api.bookwhen.com/v2/openapi.yaml

## Response Shape

Service methods return full JSON:API response envelopes (not just `data`).

```typescript
const eventResponse = await client.events.getById({
  eventId: 'ev-123',
  includes: ['location'],
});

eventResponse.data;
eventResponse.included;
eventResponse.links;
eventResponse.meta;
```

Relationship helper utilities are exported:

```typescript
import {
  resolveJsonApiRelationships,
  resolveJsonApiResource,
} from '@jphil/bookwhen-client';

const resolvedMany = resolveJsonApiRelationships(
  response.data,
  response.included,
);
const resolvedOne = resolveJsonApiResource(
  eventResponse.data,
  eventResponse.included,
);
```

## Browser Notes

- The library works in browser contexts and includes browser-aware error handling.
- Client-side API keys are visible to users; use least-privilege Bookwhen API tokens.

## Development

Common local commands:

```bash
pnpm install
pnpm test
pnpm build
pnpm lint
```

## Documentation

Project docs are intentionally lightweight and living:

- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution workflow and release notes
- [TODO.md](TODO.md) - Active work and backlog
- [DECISIONS.md](DECISIONS.md) - Architectural decisions
- [LEARNINGS.md](LEARNINGS.md) - Validated findings and gotchas
- [AGENTS.md](AGENTS.md) - Context and constraints for coding agents

## Roadmap

- Expand coverage to remaining Bookwhen v2 content models.
- Continue improving test depth across browser and Node environments.
- Iterate toward a stable 1.0 release with community feedback.

## License

ISC License. See [LICENSE](LICENSE).
