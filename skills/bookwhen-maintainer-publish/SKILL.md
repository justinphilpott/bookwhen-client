---
name: bookwhen-maintainer-publish
description: Maintainer release and publishing workflow for the @jphil/bookwhen-client repo, including trusted publishing (OIDC), release tagging, and CI verification. Use when asked to cut a release, publish to npm, update release notes, or troubleshoot publish/auth failures in this repo.
---

# Maintainer Publishing Workflow (Bookwhen Client)

## Quick path (maintainer flow, distinct from contributor PRs)
1. Ensure `main` is up to date and CI is green.
2. If new work is needed, land it via a normal PR and merge to `main`.
   - `git checkout -b some-new-branch`
   - `git commit -m "feat(context): my latest work on feature x"`
   - `git push -u origin some-new-branch`
3. Create a clean release branch from `main`:
   - `git checkout main`
   - `git pull`
   - `git branch -d release` (if it exists locally)
   - `git checkout -b release`
4. Prepare the release with Changesets:
   - `pnpm changeset` (creates a changeset file; commit happens in the next step)
   - `pnpm changeset version` (bumps versions, updates `CHANGELOG.md`, commits)
5. Push the release branch and open a release PR; merge after checks pass.
   - `git push -u origin release`
6. Tag and push the release from `main`:
   - `git checkout main`
   - `git pull`
   - `git tag -a vX.Y.Z -m "release vX.Y.Z"`
   - `git push origin vX.Y.Z`
7. Monitor the publish workflow and confirm:
   - npm package version is live
   - GitHub release is created

## Notes
- The release PR is the only place version bumps should appear; contributor PRs must not include `pnpm changeset version`.

## Trusted publishing requirements
- Ensure `.github/workflows/publish.yml` is on `main` before tagging so the tag uses the OIDC publish workflow.
- Ensure the npm trusted publisher is configured for this repo and `publish.yml`.
- Ensure workflow permissions include `id-token: write` and `contents: write`.
- Ensure the workflow runs on GitHub-hosted runners (OIDC requires this).
- Ensure npm CLI version is >= 11.5.1 in the workflow.
- Ensure the tag version matches `package.json`.

## Troubleshooting
- Re-check trusted publisher fields (org/user, repo, workflow filename) and `id-token: write` if npm publish fails to authenticate.
- If the publish workflow does not run, confirm the tag matches `v*.*.*` and that `publish.yml` exists in the tagged commit.
- Use a read-only npm token for install only if private dependency installs fail.
- Expect provenance only for public packages from public repos; it is automatic with trusted publishing.

## Files to consult
- `.github/workflows/publish.yml`
- `CONTRIBUTING.md` (maintainer publishing notes)
