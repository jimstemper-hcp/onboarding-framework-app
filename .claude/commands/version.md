---
allowed-tools: Bash(git tag:*), Bash(git log:*), Bash(git push:*), Bash(git add:*), Bash(git commit:*), Read, Edit, Write
description: Create a new version tag using semantic versioning
---

## Current State
- Branch: !`git branch --show-current`
- All versions: !`git tag -l "v*" --sort=-v:refname`
- Recent commits: !`git log --oneline -10`

## Task

Create a new semantic version tag and update CHANGELOG.md based on $ARGUMENTS:

### Usage
- `/version major` - Bump major version (v1.0.0 → v2.0.0) for breaking changes
- `/version minor` - Bump minor version (v1.0.0 → v1.1.0) for new features
- `/version patch` - Bump patch version (v1.0.0 → v1.0.1) for bug fixes
- `/version v1.2.3` - Create specific version tag
- `/version` - Show current version and suggest next version

### Steps
1. Determine the new version number based on argument
2. If no tags exist, start with v0.1.0 (or v1.0.0 for major)
3. Update CHANGELOG.md:
   - If CHANGELOG.md doesn't exist, create it with Keep a Changelog format
   - Add new version section at top (below header) with today's date
   - Categorize commits since last tag into: Added, Changed, Fixed, Removed
   - Parse commit messages (feat: → Added, fix: → Fixed, refactor: → Changed, etc.)
4. Commit the changelog update with message: "docs: Update CHANGELOG for vX.X.X"
5. Create an annotated tag with a brief summary of changes
6. Push both the commit and tag to origin

### Changelog Format (Keep a Changelog)
```markdown
## [vX.X.X] - YYYY-MM-DD

### Added
- New features (feat: commits)

### Changed
- Changes to existing functionality (refactor:, chore: commits)

### Fixed
- Bug fixes (fix: commits)

### Removed
- Removed features
```

$ARGUMENTS
