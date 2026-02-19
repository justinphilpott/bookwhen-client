# TODO

Lightweight task tracking for active development.

## Doing Now

- [ ] Add `attachments` service (`/attachments`, `/attachments/{attachment_id}`).
- [ ] Define shared JSON:API typing strategy for additional model services before duplicating types.

## Next Up

- [ ] Add `class_passes` service (`/class_passes`, `/class_passes/{class_pass_id}`).
- [ ] Expose new services from `BookwhenClient` and public exports.
- [ ] Add end-to-end browser tests for at least one non-event model service.

## Backlog

- [ ] Decide whether to run Playwright in Firefox/WebKit in CI or keep Chromium-only for speed.
- [ ] Expand browser tests to cover explicit CORS/security and network failure scenarios.
- [ ] Review and tighten API coverage docs after each model lands.
