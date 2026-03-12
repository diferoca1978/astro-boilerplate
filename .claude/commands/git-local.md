# Instructions for Claude Code: Local Git Workflow

When executing this workflow, follow these steps in order:

## Allowed branches:

- main
- dev
- feature/\*

## Pre-validations

1. Execute `git branch --show-current` to verify the current branch
2. If the branch is "main", execute `git checkout dev` automatically
3. If the dev branch doesn't exist, ask if it should be created or switch to a feature branch

## SSH Validation

1. Execute `git remote -v` to verify remote URLs
2. If any remote URL uses SSH protocol (starts with `git@`):
   - Execute `ssh -T git@github.com` (or corresponding host) to verify SSH connectivity
   - If SSH validation fails, stop the process and inform about required SSH configuration
   - If SSH is required, continue only with the commit workflow (no push or PR)
3. If all remote URLs use HTTPS, continue with the complete workflow (commit + push + PR)

## Staging Process

1. Execute `git status` to show current status
2. Execute `git add .` to add all changes
3. Execute `git status` again to confirm staged changes

## Interactive Commit

1. Create a descriptive commit message avoiding any reference to claude code
2. Validate that the message follows conventional format:
   - `feat: New functionality` (ex: "feat: add user authentication system")
   - `fix: Bug correction` (ex: "fix: resolve login validation error")
   - `docs: Documentation changes` (ex: "docs: update API documentation")
   - `style: Format changes` (ex: "style: fix code formatting and indentation")
   - `refactor: Code refactoring` (ex: "refactor: optimize database queries")
   - `test: Add or modify tests` (ex: "test: add unit tests for user service")
   - `chore: General maintenance` (ex: "chore: update dependencies")
3. If it doesn't comply with the format, suggest corrections automatically
4. Execute the commit with the validated message

## Conditional Post-Commit Workflow

### If SSH is required:

1. **STOP HERE** - Only perform local commit
2. Inform the user that the process completed with local commit only
3. Mention that push and PR must be done manually due to SSH configuration

### If SSH is NOT required (HTTPS):

1. Execute `git push origin [current-branch]` to upload changes
2. If push is successful, create Pull Request automatically:
   - Execute `gh pr create --title "[commit-based-title]" --body "Automatic description based on changes"`
   - Verify that PR was created correctly
3. Provide links to the created PR

## Error Handling

- If any Git command fails, stop the process and explain the error
- If there are merge conflicts, provide instructions to resolve them
- Provide clear diagnostics for any git problems

## Conditional Restrictions

### When SSH is required:

- **TOTALLY PROHIBITED**: Any `git push` command in any form
- **TOTALLY PROHIBITED**: `git pull` commands that might modify the remote repository
- **ONLY ALLOWED**: Local commit workflow

### When SSH is NOT required (HTTPS):

- **ALLOWED**: `git push` to upload changes to remote repository
- **ALLOWED**: Pull Request creation using `gh pr create`
- **PROHIBITED**: Using `git push --force`, `git push --force-with-lease`, or any force push variant

### Absolute Restrictions (Always applicable):

- **TOTALLY PROHIBITED**: Execute `git remote add`, `git remote set-url`, or modify remote configurations
- **NEVER** allow commits without descriptive message
- **NEVER** modify main or master branch directly
- **NEVER** execute destructive commands like `git reset --hard` without explicit confirmation
- **NEVER** modify commit history with `git rebase -i` or `git filter-branch`
- **NEVER** delete branches without explicit user confirmation

## Allowed Operations

### Always allowed:

- Query commands: `git status`, `git log`, `git diff`, `git branch`, `git remote -v`
- Local operations: `git add`, `git commit`, `git checkout`, `git stash`
- Local branch creation: `git branch`, `git checkout -b`
- Information display: `git show`, `git blame`, `git config --list`
- SSH validation: `ssh -T git@github.com` (or corresponding host)

### Conditionally allowed (only with HTTPS):

- Remote operations: `git push origin [branch]`
- If the current branch is feature/\* use `gh pr create --base dev`
- PR creation: `gh pr create` with appropriate parameters
