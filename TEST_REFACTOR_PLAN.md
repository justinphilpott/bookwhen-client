# TEST REFACTOR PLAN (Replaces PLAYWRIGHT_TEST_PLAN.md)

## Goals
1. Single test suite for Node and browser environments
2. Shared mock definitions across environments  
3. Browser-specific testing where needed
4. Minimal duplicate test code

## Architecture

### Mocking Layer
```
tests/
  __mocks__/
    handlers/       # MSW handler definitions
      events.ts     # Event API handlers
      errors.ts     # Error cases  
    server.ts       # Node setup (setupServer)
    worker.ts       # Browser setup (setupWorker)
```

### Test Structure
```
tests/
  integration/     # Shared tests
    events/        # Event API tests
      get.test.ts  # Runs in Node and browser
      filters.test.ts
  browser/         # Browser-specific tests  
    network/       # CORS, timeouts etc
    security/      # CSP, cookie handling
```

## Implementation Steps

1. [ ] Setup MSW infrastructure
   - Install @mswjs/http-middleware
   - Create shared handler files
   - Configure server/worker setup

2. [ ] Migrate existing tests
   - Convert nock interceptors to MSW handlers
   - Update test files to use MSW
   - Verify Node test compatibility

3. [ ] Add browser execution
   - Configure Playwright test runner
   - Add browser test entry points
   - Set up CI for both environments

4. [ ] Add browser-specific tests
   - Network reliability cases
   - Security restriction tests
   - Performance validation

## Mock Data Strategy
- Reuse existing mock JSON files
- Enhance with MSW handler logic
- Add browser-specific error cases

## Verification
- [ ] All existing Node tests pass with MSW
- [ ] Same tests pass in browser
- [ ] Browser-specific cases added
- [ ] CI runs both test suites

## Deprecation
- Remove nock dependencies
- Archive PLAYWRIGHT_TEST_PLAN.md
- Update CONTRIBUTING.md
