# Claude Code Rules

## Rule 1: Spec Documentation Updates

As changes are made to the codebase, once all changes are tested and working, update the spec docs with the changes. Spec docs should be in the format:
- Problem
- Solution
- Scope
- Dependencies
- Success criteria
- Functional requirements (for each requirement add the sections below)
  - User story
  - Acceptance criteria (include specification tables wherever possible)
  - Related prompts (list verbatim all prompts that contributed to the requirement)
- Open questions/unknowns

## Rule 2: Backend/Frontend Data Flow

All information used in user facing pages ("Housecall Pro Web", "AI Chat Assistant", and "Org Insights Admin Panel") must reference our backend management tools ("@HCP Context Manager" and/or "Sample Pros Configurations") as if those 2 pages were the backend for this web application. In order to make any changes to the user facing pages, make sure that all content displayed comes from the backend management tools.

## Rule 3: @HCP Context Manager Item Specs

Every item in the @HCP Context Manager MUST have a linked spec doc:

### Spec File Locations
- Features: `/src/specs/pages/hcp-context/features/{feature-id}.md`
- Navigation: `/src/specs/pages/hcp-context/navigation/{slug-id}.md`
- Calls: `/src/specs/pages/hcp-context/calls/{slug-id}.md`
- Onboarding Items: `/src/specs/pages/hcp-context/onboarding-items/{item-id}.md`
- Tools: `/src/specs/pages/hcp-context/tools/{tool-name}.md`

### When to Update Specs
- Create spec when adding new item
- Update spec when modifying item configuration
- Update "Related Prompts" section with prompts that changed the item

## Rule 4: Test-Driven Development (TDD)

Always use a TDD approach when writing code:

1. **Red**: Write a failing test first that defines the expected behavior
2. **Green**: Write the minimum code necessary to make the test pass
3. **Refactor**: Clean up the code while keeping tests green

### TDD Guidelines
- Write tests before implementation code
- Each test should test one specific behavior
- Run tests after each change to ensure nothing breaks
- Keep tests fast and isolated
- Use descriptive test names that explain the expected behavior

### Test Verification Requirements
- Always run test commands to confirm code works before moving on to the next task
- Tests must pass before considering any implementation complete
- Running tests is a mandatory final step in any plan that writes code
- If tests fail, fix the issues before proceeding

## Rule 5: Confluence Spec Sync

When releasing specs to Confluence, follow this process to ensure consistent page hierarchy and tracking.

### Environment Configuration

Confluence credentials are stored in `.env.local` (gitignored):
```
VITE_CONFLUENCE_BASE_URL=https://housecall.atlassian.net/wiki
VITE_CONFLUENCE_SPACE_KEY=4D
VITE_CONFLUENCE_API_TOKEN=<api-token>
VITE_CONFLUENCE_USER_EMAIL=<email>
VITE_CONFLUENCE_PARENT_PAGE_ID=3454075335
```

### Versioning Workflow

Specs follow a working draft → verified workflow:

| Version Level | Status Label | Page Title | Meaning |
|---------------|--------------|------------|---------|
| Patch | Rough draft | v0.x.x | Early planning iteration |
| Minor | In progress | v0.x.x | Design iteration |
| Major | Verified | v1.x.x | Ready for engineering (final) |

**Workflow:**
1. **Start**: First release should be `0.0.1` (patch) - creates "Spec v0.x.x" with "Rough draft" status
2. **Iterate**: Work through `0.x.x` versions with patch/minor updates
3. **Finalize**: Major release creates `1.0.0` - renames to "Spec v1.x.x" with "Verified" status

**Example progression:**
```
0.0.1 (patch) → Rough draft     "Invoicing v0.x.x"
0.0.2 (patch) → Rough draft     "Invoicing v0.x.x"
0.1.0 (minor) → In progress     "Invoicing v0.x.x"
0.2.0 (minor) → In progress     "Invoicing v0.x.x"
1.0.0 (major) → Verified        "Invoicing v1.x.x"  ← Ready for engineering
```

### Page Hierarchy

All spec pages are organized under the "Projects" parent page (ID: 3454075335):
```
Projects (3454075335)
├── Features (3734405610)
│   ├── Invoicing v0.x.x [Rough draft]
│   ├── Customers v1.x.x [Verified]
│   └── ...
├── Navigation
│   └── Customers Page v1.x.x
├── Tools
│   └── HCP Create Customer v1.x.x
├── Onboarding Items
│   └── Create First Customer v1.x.x
└── ...
```

### Page Naming Convention
- Category pages: Title case of category (e.g., "Features", "Onboarding Items")
- Spec pages: `{Display Name} v{major}.x.x` (e.g., "Invoicing v0.x.x" during drafts, "Invoicing v1.x.x" when verified)

### Sync Process

1. **Find or create category page** under the parent (Projects)
2. **Create spec page** under the category page
3. **Set page status** based on version level (Rough draft, In progress, or Verified)
4. **Store page ID** in `spec-versions.json` for reliable future updates
5. **Update existing page** for minor/patch releases using stored page ID

### Using the Release Command

Run `/release-spec` to release specs with automatic Confluence sync:
```
/release-spec features/invoicing patch   # Rough draft - early planning
/release-spec features/invoicing minor   # In progress - design iteration
/release-spec features/invoicing major   # Verified - ready for engineering
```

### Testing Confluence Connection

Run `/test-confluence` to verify credentials and list existing pages.

### Key Files
- Client: `src/planning/utils/confluenceClient.ts`
- Sync logic: `src/planning/utils/confluenceSync.ts`
- Registry: `src/specs/versions/spec-versions.json`
