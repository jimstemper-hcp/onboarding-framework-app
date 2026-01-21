# Onboarding Plan

## Problem
Reps need flexibility in how they view and manage pro onboarding plans, but a single view doesn't accommodate different planning styles and use cases.

## Solution
Provide dual viewing modes (category-based and weekly-based) for onboarding plan management, allowing reps to choose the organization that works best for their workflow.

## Scope
**Included:**
- Category view: Items grouped by functional category
- Weekly view: Items organized by week (1-4)
- Item completion tracking
- View mode switching

**Excluded:**
- Drag-and-drop between categories
- Custom category creation
- Plan templates

## Dependencies
- **Depends on:** @HCP Context Manager (onboarding items, categories), Sample Pros Configurations (pro's plan assignments)
- **Depended on by:** None (end-user interface)

## Success Criteria
- Both views display the same items differently organized
- View toggle persists user preference
- Completion status syncs across views
- Items can be added/removed from plan

## Functional Requirements

### FR1: View Mode Toggle

#### User Story
As a rep, I want to switch between views so that I can organize plans the way that works for me.

#### Acceptance Criteria
| View | Organization |
|------|--------------|
| Category | Items grouped by category (Account Setup, Billing, etc.) |
| Weekly | Items grouped by week (1-4) |
| Toggle | Switch between views instantly |

#### Related Prompts
- `[Historical]` "Create dual view mode for onboarding plans"

### FR2: Item Completion Tracking

#### User Story
As a rep, I want to track item completion so that I know what's been done.

#### Acceptance Criteria
| Action | Behavior |
|--------|----------|
| Check item | Mark as complete, update progress |
| Uncheck item | Revert to incomplete |
| Sync | Status syncs to pro account |

#### Related Prompts
- `[Historical]` "Add item completion tracking to plan management"

### FR3: Backend Data Source

#### User Story
As a rep, I want plan data from the central system so that items are consistent.

#### Acceptance Criteria
| Data | Source |
|------|--------|
| Onboarding items | @HCP Context Manager Onboarding Items Tab |
| Categories | @HCP Context Manager Onboarding Items Tab |
| Pro assignments | Sample Pros Configurations |
| Completion status | Sample Pros Configurations |

#### Related Prompts
- `[Historical]` "Pull plan data from centralized backend"

## Open Questions/Unknowns
- Should we support custom plan templates?
- How should we handle mid-plan item additions?
