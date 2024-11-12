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

Thank you again for considering making a contribution!

## License

By contributing your code to the @jphil/bookwhen-client GitHub repository, you agree to license your contribution under the ISC license.
