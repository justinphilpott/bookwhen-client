---
name: bookwhen-maintainer-publish
description: Maintainer release and publishing workflow for the @jphil/bookwhen-client repo, including trusted publishing (OIDC), release tagging, and CI verification. Use when asked to cut a release, publish to npm, update release notes, or troubleshoot publish/auth failures in this repo.
---

# Maintainer Publishing Workflow (Bookwhen Client)

## Quick path (automated release PR, maintainer only)
1. Land changes via normal PRs, adding `pnpm changeset` files as needed.
2. The Changesets Action keeps a single release PR updated (branch `changeset-release/main`) with version bumps and `CHANGELOG.md` updates.
3. When ready to release, merge the release PR (tell me to release and I can merge it).
4. The publish workflow on `main` runs tests/build, publishes to npm via OIDC, then tags and creates the GitHub release.

## Notes
- Version bumps happen only in the release PR; contributor PRs should only add changeset files.
- Tags are created after a successful publish; no manual tag push is required.

## Trusted publishing requirements
- Ensure `.github/workflows/publish.yml` is on `main` before releasing so OIDC is active.
- Ensure the npm trusted publisher is configured for this repo and `publish.yml`.
- Ensure workflow permissions include `id-token: write`, `contents: write`, and `pull-requests: write`.
- Ensure the workflow runs on GitHub-hosted runners (OIDC requires this).
- Ensure npm CLI version is >= 11.5.1 in the workflow.
- Ensure the tag version matches `package.json`.

## Troubleshooting
- Re-check trusted publisher fields (org/user, repo, workflow filename) and `id-token: write` if npm publish fails to authenticate.
- If no release PR appears, confirm there are changeset files in `.changeset/` and the Changesets Action ran on `main`.
- If publish does not run, confirm the release PR was merged and `package.json` version changed.
- Use a read-only npm token for install only if private dependency installs fail.
- Expect provenance only for public packages from public repos; it is automatic with trusted publishing.

## Files to consult
- `.github/workflows/publish.yml`
- `.changeset/config.json`
- `CONTRIBUTING.md` (maintainer publishing notes)
