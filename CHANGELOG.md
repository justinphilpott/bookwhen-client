# @jphil/bookwhen-client

## 0.4.1

### Patch Changes

- Ensure that the relationships resolving functions are exported

## 0.4.0

### Minor Changes

- - **Service methods now return full JSON:API response objects** instead of just data arrays
  - `EventService.getById()` now returns `EventResponse` (JsonApiResponse)
  - `EventService.getMultiple()` now returns `EventsResponse` (JsonApiResponse<BookwhenEvent[]>)
  - **Complete JSON:API compliance** with access to `included`, `links`, and `meta` properties
  - **Generic JSON:API relationship resolver utilities**:

    - `resolveJsonApiRelationships()` for array data
    - `resolveJsonApiResource()` for single resources

  - **Full TypeScript support** with proper interfaces for JSON:API responses
  - **Fixed missing included data** - previously only returned `.data` array, missing `included` resources
  - **Corrected test expectations** to properly reflect optional JSON:API properties
  - **Fixed browser test failures** that were expecting old API behavior

  ```typescript
  // Before (v0.3.2)
  const events = await client.events.getMultiple(); // BookwhenEvent[]
  const event = await client.events.getById({ eventId: '123' }); // BookwhenEvent

  // After (v0.4.0)
  const response = await client.events.getMultiple(); // EventsResponse
  const events = response.data; // BookwhenEvent[]

  const eventResponse = await client.events.getById({ eventId: '123' }); // EventResponse
  const event = eventResponse.data; // BookwhenEvent

  // Optional: Resolve relationships
  const resolvedEvents = resolveJsonApiRelationships(
    response.data,
    response.included,
  );
  ```

  - Access to complete API response including included resources
  - Proper JSON:API specification compliance
  - Future-proof for additional API properties
  - Flexible relationship resolution when needed

  All 47 Node.js tests and 3 browser tests passing with comprehensive test coverage.

## 0.3.2

### Patch Changes

- a9e62f8: Fix publish workflow

## 0.3.1

### Patch Changes

- fix(ci): ensure stable test execution locally and in CI

  - Updated `.husky/pre-commit` to remove deprecated script lines.
  - Modified `package.json`:
    - Added `start-server-and-test` dev dependency.
    - Ensured `pnpm test` script builds before browser tests and correctly manages the test server.
  - Corrected `webServer.command` in `playwright.config.ts` to `pnpm serve:test:browser`.
  - Reordered steps in `.github/workflows/ci.yml` to build the project before running browser tests.

  These changes address pre-commit hook issues, Husky deprecation warnings, and Playwright timeouts by ensuring consistent build and server management for tests.

## 0.3.0

### Minor Changes

- feat: Standardize ESM build and enhance browser compatibility/testing

  This update refactors the library to produce a clean, ESM-only build, improving compatibility and developer experience for both Node.js and browser environments.

  Key changes include:

  - **Build System:** Vite configuration updated to output only an ES module. `axios` and `zod` are now correctly externalized as peer dependencies.
  - **Dependency Management:** `axios` and `zod` are declared as `peerDependencies` and moved to `devDependencies` in `package.json`.
  - **Playwright Testing:**
    - Browser tests now use dynamic ESM imports of the library.
    - Implemented import maps in the test harness to resolve external dependencies (`axios`, `zod`) in the browser test environment.
    - Integrated Mock Service Worker (MSW) via `playwright-msw` for robust API mocking in browser tests, replacing `page.route()`.
  - **CI Pipeline:** GitHub Actions workflow updated to include Playwright browser tests and ensure Vitest unit/integration tests run separately.
  - **Documentation:** `README.md` updated to clarify ESM usage, peer dependencies, and browser consumption (with/without bundlers).
  - **Workspace Configuration:** Corrected `pnpm-workspace.yaml` and ensured `pnpm-lock.yaml` is consistent.

## [Unreleased]

### Added

- Cross-platform error handling system
- Browser environment detection in errors
- Comprehensive error typing and context
- Enhanced test coverage for error cases

## 0.2.6

### Patch Changes

- d692edc: tweak to fix build
- 8fce1f2: Test fix for exports

## 0.2.5

### Patch Changes

- 1453f9d: fix for broken exports

## 0.2.4

### Patch Changes

- ad4e2f2: Minor docs edits

## 0.2.3

### Patch Changes

- 3430ac1: Docs formatting

## 0.2.2

### Patch Changes

- 66af389: Docs refinements

## 0.2.1

### Patch Changes

- 87f40d1: Docs tweaks

## 0.2.0

### Minor Changes

- Fixed response processing issue. Added debug flag.

## 0.1.1

### Patch Changes

- 26c3d62: Fix dependencies (axios, zod), remove dotenv

## 0.1.0

### Minor Changes

- 0b5c39a: Adding BookwhenClient, Events service, supporting code and tests

## 0.0.10

### Patch Changes

- bb44c68: Docs update

## 0.0.9

### Patch Changes

- 9526aa4: fix(ci): enable npm publish - test

## 0.0.8

### Patch Changes

- f6cfb09: Tweak CI publish workflow pnpm and node order issue bug.

## 0.0.7

### Patch Changes

- bdd2ef1: CI Publish Pipelines test

## 0.0.6

### Patch Changes

- d4977cd: Fixed commitlint conflict with changesets commit styles

## 0.0.5

### Patch Changes

- Test of new pipelines

## 0.0.4

### Patch Changes

- Fix build (error in tsconfig)

## 0.0.3

### Patch Changes

- NPM publication flow improvements
- 29361bb: Adding npm ignore file to clean up the published package

## 0.0.2

### Patch Changes

- 3dee093: Initial setup - changesets -> npm publishing (wip)
