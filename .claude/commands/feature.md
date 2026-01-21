---
allowed-tools: Bash(git checkout:*), Bash(git pull:*), Bash(git branch:*)
description: Create a new feature branch from main
---

## Current State
- Branch: !`git branch --show-current`
- Main status: !`git log origin/main --oneline -3 2>/dev/null || echo "Run 'git fetch' to see remote status"`

## Task

Create a new feature branch from the latest main:

1. Checkout main branch
2. Pull latest changes from origin
3. Create and checkout new feature branch with naming convention: `feature/<branch-name>`

Branch name should be derived from $ARGUMENTS (kebab-case, lowercase).

Example: `/feature add user auth` → creates `feature/add-user-auth`

$ARGUMENTS
