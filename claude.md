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
