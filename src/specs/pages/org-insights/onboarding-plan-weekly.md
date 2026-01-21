# Weekly Planning View

## Problem
Reps need to create structured, time-based plans, but assigning items to specific weeks is difficult without a visual weekly interface.

## Solution
Provide a 4-week grid layout where reps can organize onboarding items into weekly buckets with drag-and-drop support.

## Scope
**Included:**
- 4-week grid layout
- Item assignment to weeks
- Week progress tracking
- Item reordering within weeks

**Excluded:**
- Week duration customization
- Multiple plan tracks
- Automated scheduling

## Dependencies
- **Depends on:** @HCP Context Manager (onboarding items), Sample Pros Configurations (weekly assignments)
- **Depended on by:** Onboarding Plan (as one view mode)

## Success Criteria
- All 4 weeks are displayed as columns
- Items can be assigned to weeks
- Progress is shown per week
- Items can be reordered within weeks

## Functional Requirements

### FR1: Week Columns

#### User Story
As a rep, I want to see 4 week columns so that I can plan the full onboarding period.

#### Acceptance Criteria
| Column | Content |
|--------|---------|
| Week 1-4 | Column per week |
| Header | Week label with progress |
| Items | Assigned items for that week |

#### Related Prompts
- `[Historical]` "Create 4-week grid layout for planning"

### FR2: Item Assignment

#### User Story
As a rep, I want to assign items to weeks so that pros have clear weekly goals.

#### Acceptance Criteria
| Action | Behavior |
|--------|----------|
| Drag item | Move between weeks |
| Drop zone | Visual indicator for placement |
| Unassigned | Pool of items not yet scheduled |

#### Related Prompts
- "Replace Weekly Plan with Onboarding Items tab"

### FR3: Week Progress

#### User Story
As a rep, I want to see week progress so that I can track pacing.

#### Acceptance Criteria
| Indicator | Display |
|-----------|---------|
| Header | "X of Y" items complete |
| Progress bar | Visual percentage |
| Color coding | Green when complete |

#### Related Prompts
- `[Historical]` "Add progress indicators to weekly columns"

### FR4: Item Reordering

#### User Story
As a rep, I want to reorder items within a week so that priority is clear.

#### Acceptance Criteria
| Action | Behavior |
|--------|----------|
| Drag within week | Change item order |
| Order persistence | Saved to pro's plan |

#### Related Prompts
- `[Historical]` "Enable item reordering within weeks"

## Open Questions/Unknowns
- Should we support week customization (e.g., 6-week plans)?
- How should we handle items that span multiple weeks?
