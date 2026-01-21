---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*), Bash(git push:*)
description: Create a git commit with a descriptive message and push to origin
---

## Current State
- Branch: !`git branch --show-current`
- Staged: !`git diff --cached --stat`
- Unstaged: !`git diff --stat`
- Recent commits: !`git log --oneline -5`

## Remote
- Origin: git@github.com:jimstemper-hcp/onboarding-framework-app.git

## Task

Review the staged and unstaged changes, then create a well-structured commit:

1. Stage relevant files if needed
2. Write a descriptive commit message following conventional commits format (feat:, fix:, refactor:, docs:, test:, chore:)
3. Keep subject line under 50 characters
4. Add detailed body for complex changes
5. Push to origin after committing

$ARGUMENTS
