---
"@jphil/bookwhen-client": minor
---

Add `getAll()` method to EventService for automatic pagination. Unlike `getMultiple()` which returns a single page (up to 20 events), `getAll()` follows JSON:API pagination links to fetch every matching event. Included resources are deduplicated across pages.
