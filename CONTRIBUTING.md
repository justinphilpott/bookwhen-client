Thanks for your interest in contributing to this project!

## Useful References

You will likely need to reference the [Bookwhen API docs](https://api.bookwhen.com/v2), which are also available in [Swagger format](https://petstore.swagger.io/?url=https://api.bookwhen.com/v2/openapi.yaml).

## Contribution Workflow

To get setup and running, just follow these steps:

### 1. Clone the Repository:  
   Fork the repository (click the <kbd>Fork</kbd> button at the top right of
   [this page](https://github.com/jphil/bookwhen-client)) 

   Then clone it locally:
   
   ```bash
   $ git clone https://github.com/justinphilpott/bookwhen-client.git
   ```  
   
   Navigate into the project directory:
   
   ```bash
   $ cd bookwhen-client
   ```

### 2. Create a new Branch:  
   From main, create a new branch using the naming convention [type/scope], e.g., fix/error-handling or docs/typo. Use Conventional Commit types (e.g., fix, feat, docs) for type, and keep scope descriptive but short.
   
   ```bash
   $ git checkout -b feature/your-feature
   ```
   
### 3. Develop and Commit:
   Make your code changes, ensuring you periodically rebase your branch onto the latest main to keep it up to date and minimize conflicts. This should be done at the start of your work and just before opening a pull request. Commit your changes to your branch with a clear and descriptive message that follows the [Conventional Commits standard](https://www.conventionalcommits.org):

   ```bash
   $ git add .
   $ git commit -m "fix(scope): description of changes"
   ``` 

   N.B. All commits that fix bugs or add features need a test!

### 4. Create a changeset (possibly)
   If your changes affect functionality or user experience, create a changeset:
   
   ```bash
   $ pnpm changeset
   ```

   You will be asked to provide a detailed description of your changes. This will be used to generate a changelog when we publish an update, so be clear and concise. This will create a commit. N.B. DO NOT run "changeset version" which will try to bump versions - any PR's with version bumps will not be accepted.

   [Learn more about Changesets](https://github.com/atlassian/changesets/tree/master/packages/cli).

### 5. Push the Feature Branch:  
   Push your feature branch to your fork:
   
   ```bash
   $ git push origin feature/your-feature
   ```

### 6. Open a Pull Request (PR):  
   On GitHub, open a PR from your branch in your forked repository to the main branch of this repository. Use the PR template to include a summary, any related issues, testing steps, and documentation updates.

### 7. Sync with Main Regularly:  
   For long-running PRs, periodically sync your branch with main to avoid conflicts:
   
   ```bash
   $ git fetch origin
   $ git rebase origin/main
   ```

### 8. CI Pipeline:  
   The CI pipeline runs automated checks on your PR:

   - Tests: Ensure all tests pass.
   - Build: Verify that the project builds successfully.

### 9. Address CI Results
   - Success: Your PR is ready for review.
   - Failure: Review and resolve issues, then push changes to trigger the CI pipeline again.

## Maintainers: Publishing (automated release PR)

This flow is separate from the contributor workflow above. Contributor PRs must not include version bumps; they should add a changeset file when needed.

### Maintainer release process
1. Merge feature PRs with changesets as usual.
2. The Changesets Action keeps a single release PR updated (branch `changeset-release/main`) with version bumps and `CHANGELOG.md` updates.
3. When ready to release, merge the release PR.
4. The publish workflow on `main` runs tests/build, publishes to npm via OIDC, then tags and creates the GitHub release.

Publishing is handled by `.github/workflows/publish.yml`, which uses Changesets to open the release PR and publishes when a version bump is detected on `main`.

- Ensure `.github/workflows/publish.yml` is on `main` before releasing so OIDC is active.
- This repo uses npm **trusted publishing (OIDC)**, so no `NPM_TOKEN` secret is required.
- Ensure the workflow has `permissions: { id-token: write, contents: write, pull-requests: write }` and uses npm CLI `>= 11.5.1`.
- The workflow only publishes when `package.json` version changes (i.e., after the release PR merge).
- Provenance is generated automatically for public packages from public repos; no `--provenance` flag is required.
- If there are no changesets, no release PR is created; add one with `pnpm changeset`.
- If you ever switch back to token-based publishing, use a **granular** token with **bypass 2FA** and rotate before expiry.

Thank you again for considering making a contribution!

## License

By contributing your code to the @jphil/bookwhen-client GitHub repository, you agree to license your contribution under the ISC license.
