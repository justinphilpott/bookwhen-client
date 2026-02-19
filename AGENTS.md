# Agent Context for `@jphil/bookwhen-client`

TypeScript client for Bookwhen API v2, currently implementing Events, Tickets, and Locations resources with JSON:API response envelopes.

## Quick Links

- [README.md](README.md) - Project overview and usage
- [TODO.md](TODO.md) - Active work and backlog
- [DECISIONS.md](DECISIONS.md) - Architectural decisions
- [LEARNINGS.md](LEARNINGS.md) - Validated discoveries
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution and release workflow

## Working Practices

- Keep commits small and focused on one logical change.
- Update docs in the same PR when behavior or API coverage changes.
- Prefer extending existing patterns over introducing new abstractions.
- Add or update tests with all feature and bug-fix changes.
- Prune stale docs quickly; historical detail belongs in git history.

## Project Constraints

- ESM-only package output.
- `axios` and `zod` are peer dependencies.
- Service methods return full JSON:API envelopes (`data`, optional `included`, `links`, `meta`).
- Bookwhen API auth uses Basic Auth with API key as username and blank password.

## Key Files

- `src/client/BookwhenClient.ts` - Client factory and service accessors
- `src/services/event/Event.ts` - Current Events service implementation
- `src/services/event/EventInterfaces.ts` - Events service method contracts
- `src/services/event/EventTypes.ts` - Event and JSON:API response types
- `src/services/ticket/Ticket.ts` - Tickets service implementation
- `src/services/ticket/TicketInterfaces.ts` - Tickets service method contracts
- `src/services/location/Location.ts` - Locations service implementation
- `src/services/location/LocationInterfaces.ts` - Locations service method contracts
- `src/utils/json-api-resolver.ts` - Relationship resolver helpers
- `tests/browser/client.spec.ts` - Browser integration tests

## Commands

- `pnpm lint` - TypeScript lint/check
- `pnpm test:node` - Node test suite
- `pnpm test:browser` - Playwright browser tests
- `pnpm test` - Full test flow
- `pnpm build` - Library build
- `pnpm check-exports` - Export surface validation

## Testing Expectations

- For service changes, add/adjust unit tests in `src/services/**`.
- For client behavior changes, update integration tests in `src/client/**`.
- If browser behavior changes, run `pnpm test:browser` and update `tests/browser/**` as needed.

## Maintaining These Docs

When adding a new model service, update:

- API coverage in `README.md`
- Active work in `TODO.md`
- Relevant decisions in `DECISIONS.md`
- Any non-obvious implementation findings in `LEARNINGS.md`
