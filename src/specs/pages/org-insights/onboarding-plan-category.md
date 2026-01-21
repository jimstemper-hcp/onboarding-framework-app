# Category View

## Problem
Reps need to see onboarding coverage across functional areas, but a flat list doesn't show which categories need attention.

## Solution
Organize onboarding items by their functional category (Account Setup, Billing, Operations, etc.) with category-level progress indicators.

## Scope
**Included:**
- Category accordion sections
- Category progress indicators
- Item completion status per category
- Expand/collapse functionality

**Excluded:**
- Drag-and-drop between categories
- Category customization
- Category-level actions

## Dependencies
- **Depends on:** @HCP Context Manager (onboarding items, categories), Sample Pros Configurations (completion status)
- **Depended on by:** Onboarding Plan (as one view mode)

## Success Criteria
- All categories are displayed as accordions
- Progress is shown per category
- Items can be completed within categories
- Categories can be expanded/collapsed

## Functional Requirements

### FR1: Category Accordions

#### User Story
As a rep, I want items grouped by category so that I can ensure complete coverage.

#### Acceptance Criteria
| Component | Behavior |
|-----------|----------|
| Category header | Name with progress chip |
| Expand | Shows all items in category |
| Collapse | Hides items, shows summary |
| Expand all | Button to open all categories |

#### Related Prompts
- `[Historical]` "Create accordion-based category view"

### FR2: Category Progress

#### User Story
As a rep, I want to see category progress so that I can identify areas needing attention.

#### Acceptance Criteria
| Indicator | Display |
|-----------|---------|
| Progress chip | "X of Y" items complete |
| Progress bar | Visual percentage |
| Color coding | Green when complete |

#### Related Prompts
- `[Historical]` "Add progress indicators to category headers"

### FR3: Item Completion

#### User Story
As a rep, I want to complete items within categories so that progress is tracked.

#### Acceptance Criteria
| Action | Behavior |
|--------|----------|
| Check item | Mark complete, update progress |
| Uncheck item | Revert to incomplete |
| Progress update | Category progress recalculates |

#### Related Prompts
- `[Historical]` "Enable item completion in category view"

## Open Questions/Unknowns
- Should we support category filtering?
- How should we handle empty categories?
