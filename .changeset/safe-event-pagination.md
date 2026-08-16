---
'@jphil/bookwhen-client': patch
---

Prevent event pagination from leaking credentials or making unbounded requests by rejecting cross-origin and repeated links and enforcing a configurable page limit.
