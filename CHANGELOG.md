# @jphil/bookwhen-client

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
