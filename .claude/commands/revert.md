---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git restore:*), Bash(git stash:*), Bash(git log:*)
description: Safely revert uncommitted changes with explanations
---

## Current State
- Branch: !`git branch --show-current`
- Status: !`git status --short`

## Task

Help this user safely revert their changes. They are new to coding, so:

1. **First, explain** what changes they currently have:
   - Unstaged changes (modified but not added)
   - Staged changes (added but not committed)

2. **Show them exactly** which files would be affected

3. **Ask for confirmation** before reverting anything - use AskUserQuestion to confirm:
   - Which files to revert (all or specific ones)
   - Whether to save a backup first using `git stash` (recommended for beginners)

4. **Explain what will happen** in simple terms before executing

5. If they want to revert:
   - Offer to stash first (`git stash` saves changes so they can be recovered later)
   - Use `git restore <file>` for unstaged changes
   - Use `git restore --staged <file>` for staged changes

IMPORTANT: Never revert without explicit user confirmation. Always offer the stash backup option.

$ARGUMENTS
