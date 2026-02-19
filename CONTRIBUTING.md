# Contributing to `@jphil/bookwhen-client`

Thanks for your interest in contributing.

## References

- Bookwhen API docs: https://api.bookwhen.com/v2
- Swagger layout: https://petstore.swagger.io/?url=https://api.bookwhen.com/v2/openapi.yaml

## Quick Start

```bash
git clone https://github.com/justinphilpott/bookwhen-client.git
cd bookwhen-client
pnpm install
pnpm test
pnpm build
```

## Development Workflow

1. Create a branch from `main`.
2. Make focused changes with tests.
3. Commit using Conventional Commits (for example: `feat(tickets): add ticket service types`).
4. Open a PR to `main` with testing notes.

For long-running branches, regularly rebase on top of `main`.

## Testing and Quality

Run these before opening or updating a PR:

```bash
pnpm lint
pnpm test
pnpm build
pnpm check-exports
```

CI runs Node tests, build, and browser tests (Playwright/Chromium).

## Changesets

If your change impacts package behavior, API surface, or user-facing docs, add a changeset:

```bash
pnpm changeset
```

Do not run `pnpm changeset version` in feature PRs. Version bumps happen in release flow.

## Maintainer Release Notes

Current release flow:

1. Merge completed work to `main`.
2. Run `pnpm changeset version` on your release prep commit.
3. Push `main`.
4. Create and push a semver tag from `main` (`vX.Y.Z`).
5. GitHub Actions publishes to npm from `.github/workflows/publish.yml`.

Publishing uses npm trusted publishing (OIDC). No `NPM_TOKEN` secret is required.

## Documentation Expectations

- Keep docs in sync with behavior in the same PR.
- Use `TODO.md` for active work, `DECISIONS.md` for architectural decisions, and `LEARNINGS.md` for validated discoveries.
- Remove stale placeholders and outdated plan docs instead of accumulating drift.

## License

By contributing to this repository, you agree that your contributions are licensed under ISC.
