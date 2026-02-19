# Learnings

Capture validated discoveries that should influence future implementation.

---

**Topic**: JSON:API response handling

**Insight**: Returning only resource arrays is insufficient for Bookwhen endpoints that rely on includes.

**Validated by**: v0.4.0 migration and follow-up fixes where full envelope support resolved missing related-resource access.

**Implication**: New model services should return full envelopes from day one and avoid adding convenience methods that hide `included`/`links`/`meta`.

---

**Topic**: Cross-environment testing

**Insight**: Browser tests catch behavior drift that Node-only tests miss, especially around bundling and runtime wiring.

**Validated by**: Playwright/browser test updates that had to be aligned with JSON:API envelope behavior.

**Implication**: Every new model service should include at least one browser-path test in addition to Node unit/integration coverage.

---

**Topic**: Documentation hygiene

**Insight**: Historical planning docs become stale quickly once work lands and are harder to trust than living docs.

**Validated by**: `PLAN.md` and `TEST_PLAN.md` drifting from actual repository state despite completed setup.

**Implication**: Keep short living docs (`TODO`, `DECISIONS`, `LEARNINGS`) and delete stale scaffolding instead of patching old phase plans.
