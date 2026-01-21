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
