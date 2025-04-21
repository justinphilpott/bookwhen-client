# PLAYWRIGHT TEST PLAN (Temporary)

## Context
- Verifies browser compatibility of @jphil/bookwhen-client
- Focuses on API client behavior (no DOM testing)
- Complements existing Node.js tests (ref: PLAN.md#2.2)
- Aligns with browser usage docs (ref: README.md#Browser-Usage)

## Setup Tasks
- [x] Create shared mock structure at `tests/__mocks__/`
- [x] Install dependencies: playwright @mswjs/data
- [ ] Configure base playwright.config.ts
- [ ] Setup MSW mock server

## Core Test Cases
### Request Validation
- [ ] Verify correct API endpoints called
- [ ] Test authentication headers
- [ ] Validate query parameter handling

### Response Handling
- [ ] Test successful response parsing
- [ ] Verify error structure matches Node.js
- [ ] Check browser-specific error properties

### Error Scenarios
- [ ] Simulate CORS failures
- [ ] Test network timeouts
- [ ] Validate security error handling

## Mock Data
- `mocks/events/` - Success responses
- `mocks/errors/` - 4xx/5xx responses  
- `mocks/network/` - Timeout/abort scenarios

## Verification
- [ ] Run against Chromium/Firefox/WebKit
- [ ] Test local and CI environments
- [ ] Compare with Node.js test results

## Integration
- Finalize then merge into PLAN.md#2.2
- Update README.md testing section
