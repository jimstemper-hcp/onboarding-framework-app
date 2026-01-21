# Weekly Planning View

## Problem
Pros can feel overwhelmed seeing all onboarding tasks at once, leading to analysis paralysis and lack of focus.

## Solution
Provide a focused week-by-week view that highlights the current week's tasks while surfacing incomplete items from prior weeks in a catch-up section.

## Scope
**Included:**
- Current week focus with task list
- Catch-up section for incomplete prior week items
- Week progress indicator (dots for weeks 1-4)
- Next week preview
- Task completion with points

**Excluded:**
- Week customization
- Task rescheduling
- Multi-week view

## Dependencies
- **Depends on:** @HCP Context Manager (onboarding items, point values), Sample Pros Configurations (weekly plan, completion status)
- **Depended on by:** Housecall Pro Web (as one view mode)

## Success Criteria
- Current week is prominently displayed
- Catch-up items are visible when applicable
- Progress dots show week status
- Tasks can be completed from this view

## Functional Requirements

### FR1: Current Week Focus

#### User Story
As a pro, I want to see this week's tasks so that I can focus on what's due now.

#### Acceptance Criteria
| Element | Content |
|---------|---------|
| Week header | "Week X" with description |
| Task list | All items assigned to current week |
| Progress bar | Completion percentage |
| Task count | "X of Y completed" |

#### Related Prompts
- `[Historical]` "Create current week focus for weekly view"

### FR2: Catch-up Section

#### User Story
As a pro, I want to see missed tasks so that nothing falls through the cracks.

#### Acceptance Criteria
| Condition | Behavior |
|-----------|----------|
| Incomplete prior tasks | Show catch-up card |
| Week badges | Indicate which week task is from |
| No incomplete | Hide catch-up section |

#### Related Prompts
- `[Historical]` "Add catch-up section for missed tasks"

### FR3: Week Progress Indicators

#### User Story
As a pro, I want to see my overall week progress so that I know where I am in onboarding.

#### Acceptance Criteria
| Indicator | Display |
|-----------|---------|
| Week dots | 4 dots for weeks 1-4 |
| Completed week | Filled dot |
| Current week | Highlighted dot |
| Future weeks | Empty dot |

#### Related Prompts
- `[Historical]` "Add week progress dots"

### FR4: Next Week Preview

#### User Story
As a pro, I want to preview next week so that I can plan ahead.

#### Acceptance Criteria
| Element | Content |
|---------|---------|
| Preview card | Summary of next week |
| Item count | Number of tasks coming |
| Teaser | First few items listed |

#### Related Prompts
- `[Historical]` "Add next week preview card"

### FR5: Task Completion

#### User Story
As a pro, I want to complete tasks easily so that I can track my progress.

#### Acceptance Criteria
| Action | Behavior |
|--------|----------|
| Click checkbox | Mark task complete |
| Point award | Add item's points to total |
| Progress update | Update progress bar and count |

#### Related Prompts
- `[Historical]` "Enable task completion in weekly view"

### FR6: Backend Data Source

#### User Story
As a pro, I want my weekly plan to reflect my assigned items.

#### Acceptance Criteria
| Data | Source |
|------|--------|
| Weekly plan | Sample Pros Configurations |
| Onboarding items | @HCP Context Manager Onboarding Items Tab |
| Point values | @HCP Context Manager Onboarding Items Tab |
| Completion status | Sample Pros Configurations |

#### Related Prompts
- `[Historical]` "Pull weekly data from centralized backend"

## Open Questions/Unknowns
- Should we support week skipping?
- How should we handle tasks that can't be completed in assigned week?
