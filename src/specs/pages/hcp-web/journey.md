# Journey View

## Problem
Pros need a motivating view of their onboarding progress, but traditional task lists don't create the sense of achievement needed to drive completion.

## Solution
Present onboarding as a gamified vertical timeline with feature milestones, point rewards, and visual progression that motivates pros to advance through their journey.

## Scope
**Included:**
- Vertical timeline with connected milestones
- Feature-based milestone cards
- Points system with rewards
- Expandable task lists within milestones
- Progress indicators per feature

**Excluded:**
- Achievements/badges system
- Leaderboards
- Social features

## Dependencies
- **Depends on:** @HCP Context Manager (features, onboarding items, point values), Sample Pros Configurations (completed tasks, feature status)
- **Depended on by:** Housecall Pro Web (as one view mode)

## Success Criteria
- Timeline displays all milestones visually
- Current milestone is highlighted
- Points are calculated correctly
- Tasks can be completed from timeline

## Functional Requirements

### FR1: Timeline Display

#### User Story
As a pro, I want to see milestones on a timeline so that I understand the full journey.

#### Acceptance Criteria
| Element | Display |
|---------|---------|
| Timeline track | Vertical line connecting milestones |
| Milestone nodes | Circles with status indicators |
| Connectors | Lines between milestones |
| Current indicator | Highlight on active milestone |

#### Related Prompts
- `[Historical]` "Create vertical timeline for journey view"

### FR2: Milestone Cards

#### User Story
As a pro, I want to see milestone details so that I know what to do next.

#### Acceptance Criteria
| Element | Content |
|---------|---------|
| Feature icon | Visual identifier |
| Feature name | Milestone title |
| Points | Potential points for completion |
| Status | Stage badge (current state) |

#### Related Prompts
- `[Historical]` "Create milestone cards with feature info"

### FR3: Point System

#### User Story
As a pro, I want to earn points so that I feel rewarded for progress.

#### Acceptance Criteria
| Source | Points |
|--------|--------|
| Task completion | Item's point value (25, 50, 75, 100) |
| Attached stage | 50 points |
| Activated stage | 100 points |
| Engaged stage | 150 points |

#### Related Prompts
- "Add point values to onboarding items"

### FR4: Expandable Tasks

#### User Story
As a pro, I want to expand milestones so that I can see and complete individual tasks.

#### Acceptance Criteria
| Section | Content |
|---------|---------|
| Required tasks | Must-do items for stage completion |
| Bonus tasks | Optional items for extra points |
| Checkboxes | Click to complete |

#### Related Prompts
- `[Historical]` "Add expandable task sections to milestones"

### FR5: Backend Data Source

#### User Story
As a pro, I want my journey to reflect my actual progress.

#### Acceptance Criteria
| Data | Source |
|------|--------|
| Features | @HCP Context Manager Features Tab |
| Onboarding items | @HCP Context Manager Onboarding Items Tab |
| Point values | @HCP Context Manager Onboarding Items Tab |
| Completion status | Sample Pros Configurations |

#### Related Prompts
- `[Historical]` "Pull journey data from centralized backend"

## Open Questions/Unknowns
- Should we add celebration animations?
- How should we handle locked milestones?
