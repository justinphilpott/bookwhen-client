# Decisions

Record architectural choices so maintainers and agents can recover intent quickly.

---

**Context**: The client originally returned only the top-level `data` payload from Bookwhen responses.

**Decision**: Service methods return full JSON:API response envelopes (`data`, optional `included`, `links`, `meta`).

**Impact**: Consumers can access side-loaded resources and metadata without custom transport workarounds, and new model services can follow one consistent response contract.

---

**Context**: The package targets both Node and browser environments with one source base.

**Decision**: Keep the package ESM-only and externalize `axios` and `zod` as peer dependencies.

**Impact**: Build output remains predictable across environments and avoids duplicate runtime dependency copies in consuming apps.

---

**Context**: API coverage is incomplete, but reliability expectations are high for what is already implemented.

**Decision**: Implement model services incrementally (event-first), shipping tests and docs updates with each model.

**Impact**: Progress is steady and reviewable, while keeping public docs accurate during expansion to tickets, locations, attachments, and class passes.
