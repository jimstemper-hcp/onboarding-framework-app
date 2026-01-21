---
allowed-tools: Bash(git tag:*), Bash(git log:*), Bash(git push:*), Bash(git add:*), Bash(git commit:*), Bash(git diff:*), Bash(git status:*), Bash(cat:*), Read, Edit, Write
description: Release a new version of a spec document with semantic versioning
---

## Current State
- Branch: !`git branch --show-current`
- Existing spec tags: !`git tag -l "spec/*" --sort=-v:refname | head -20`
- Recent commits: !`git log --oneline -5`

## Task

Release a new version of a spec document using semantic versioning.

### Usage
- `/release-spec features/invoicing major` - Release for engineering (creates new Confluence page)
- `/release-spec features/invoicing minor` - Design iteration (updates existing Confluence doc)
- `/release-spec features/invoicing patch` - Planning iteration (updates existing Confluence doc)
- `/release-spec features/invoicing` - Show current version and available actions

### Semantic Version Meanings

| Level | Meaning | Confluence Behavior |
|-------|---------|---------------------|
| **Major** | Ready for engineering | Creates new doc OR updates first major, then future majors create sibling docs |
| **Minor** | Design iteration | Updates existing doc from last major |
| **Patch** | Planning iteration | Updates existing doc from last major |

### Steps

1. **Parse arguments**: Extract spec ID (e.g., `features/invoicing`) and version level (major/minor/patch)

2. **Validate spec exists**: Check that the spec ID exists in `/src/specs/versions/spec-versions.json`

3. **Calculate next version**:
   - Read current version from the registry
   - If `0.0.0` (never released), start appropriately:
     - major → `1.0.0`
     - minor → `0.1.0`
     - patch → `0.0.1`
   - Otherwise increment the appropriate component

4. **Prompt for release notes**: Ask user for brief release notes (optional)

5. **Update registry** (`/src/specs/versions/spec-versions.json`):
   - Update `currentVersion` field
   - Update `lastUpdated` timestamp
   - Add new release entry to the beginning of `releases` array:
     ```json
     {
       "version": "1.0.0",
       "releasedAt": "2026-01-21T12:00:00.000Z",
       "releaseNotes": "Initial release for engineering review",
       "gitTag": "spec/features/invoicing/v1.0.0"
     }
     ```

6. **Commit the registry update**:
   ```bash
   git add src/specs/versions/spec-versions.json
   git commit -m "release: {spec-display-name} v{version}"
   ```

7. **Create annotated git tag**:
   ```bash
   git tag -a "spec/{spec-id}/v{version}" -m "{spec-display-name} v{version}

   {release-notes}"
   ```

8. **Push commit and tag**:
   ```bash
   git push origin {branch}
   git push origin "spec/{spec-id}/v{version}"
   ```

9. **Report success**: Display:
   - New version number
   - Git tag created
   - Push status
   - Note about Vercel preview deploy (triggered by GitHub workflow)
   - Note about Confluence sync (if configured)

### Example Output

```
Spec Release: features/invoicing

Current version: 0.0.0
New version: 1.0.0 (Major)
Version meaning: Ready for engineering

Git tag: spec/features/invoicing/v1.0.0
Commit: release: Invoicing v1.0.0

Pushed to origin/main

Next steps:
- GitHub Action will deploy to: spec-features-invoicing-v1-0-0.vercel.app
- Configure CONFLUENCE_* env vars to enable Confluence sync
```

### Registry Location

The spec versions registry is at: `/src/specs/versions/spec-versions.json`

$ARGUMENTS
