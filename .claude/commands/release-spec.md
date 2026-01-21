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
- `/release-spec features/invoicing patch` - Rough draft (early planning)
- `/release-spec features/invoicing minor` - In progress (design iteration)
- `/release-spec features/invoicing major` - Verified (ready for engineering)
- `/release-spec features/invoicing` - Show current version and available actions

### Semantic Version Meanings

| Level | Status Label | Page Title | Meaning |
|-------|--------------|------------|---------|
| **Patch** | Rough draft | v0.x.x | Early planning iteration |
| **Minor** | In progress | v0.x.x | Design iteration |
| **Major** | Verified | v1.x.x | Ready for engineering (final) |

### Versioning Workflow

1. **Start**: First release should be `0.0.1` (patch) - creates page with "Rough draft" status
2. **Iterate**: Work through `0.x.x` versions with patch/minor updates
3. **Finalize**: Major release creates `1.0.0` - updates page title to "v1.x.x" with "Verified" status

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
       "gitTag": "spec/features/invoicing/v1.0.0",
       "confluenceDocId": "123456789",
       "confluenceDocUrl": "https://company.atlassian.net/wiki/spaces/SPECS/pages/123456789"
     }
     ```
   - **Important**: Store `confluenceDocId` and `confluenceDocUrl` from Confluence sync result to enable reliable page tracking for subsequent releases

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

### Example Output (First Release - Patch)

```
Spec Release: features/invoicing

Current version: 0.0.0
New version: 0.0.1 (Patch)
Version meaning: Rough draft - early planning

Git tag: spec/features/invoicing/v0.0.1
Commit: release: Invoicing v0.0.1

Pushed to origin/main

Confluence: Created "Invoicing v0.x.x" under Features
- Status: Rough draft
- Page ID: 123456789
- URL: https://company.atlassian.net/wiki/spaces/SPECS/pages/123456789

Next steps:
- GitHub Action will deploy to: spec-features-invoicing-v0-0-1.vercel.app
```

### Example Output (Final Release - Major)

```
Spec Release: features/invoicing

Current version: 0.2.0
New version: 1.0.0 (Major)
Version meaning: Verified - ready for engineering

Git tag: spec/features/invoicing/v1.0.0
Commit: release: Invoicing v1.0.0

Pushed to origin/main

Confluence: Updated "Invoicing v1.x.x" under Features
- Status: Verified
- Page ID: 123456789
- URL: https://company.atlassian.net/wiki/spaces/SPECS/pages/123456789

Next steps:
- GitHub Action will deploy to: spec-features-invoicing-v1-0-0.vercel.app
```

### Confluence Page Hierarchy

When `VITE_CONFLUENCE_PARENT_PAGE_ID` is configured, pages are organized as:
```
Parent Page (configured)
├── Features
│   ├── Invoicing v0.x.x [Rough draft]
│   ├── Customers v1.x.x [Verified]
│   └── ...
├── Navigation
│   └── Customers Page v1.x.x [Verified]
├── Tools
│   └── HCP Create Customer v0.x.x [In progress]
└── ...
```

### Confluence Sync Logic

1. **First release (0.0.1)**: Creates new page "Spec v0.x.x" under category with "Rough draft" status
2. **Subsequent patch/minor**: Updates existing page, sets status based on level
3. **Major release (1.0.0)**: Updates page title to "Spec v1.x.x" with "Verified" status

### Registry Location

The spec versions registry is at: `/src/specs/versions/spec-versions.json`

$ARGUMENTS
