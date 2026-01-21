# Housecall Pro Web

## Problem
Pros need a clear, motivating view of their onboarding progress, but text-heavy task lists don't provide the engagement needed to drive completion.

## Solution
Provide a gamified pro-facing web portal with two viewing modes (Journey and Weekly), featuring points, progress tracking, and visual milestones—all powered by data from @HCP Context Manager and Sample Pros Configurations.

## Scope
**Included:**
- Journey View: Timeline-based gamified onboarding experience
- Weekly View: Task-focused weekly planning interface
- Progress tracking with points and streaks
- Feature milestone tracking
- Task completion with point rewards

**Excluded:**
- Content editing (handled by @HCP Context Manager)
- Rep-facing features (handled by Org Insights)
- Account settings

## Dependencies
- **Depends on:** @HCP Context Manager (features, onboarding items, point values), Sample Pros Configurations (pro account, feature status, completed tasks)
- **Depended on by:** None (end-user interface)

## Success Criteria
- Progress is visually represented and motivating
- Points are correctly calculated based on item values
- Both view modes display consistent data
- Task completion updates immediately

## Functional Requirements

### FR1: Progress Summary Card

#### User Story
As a pro, I want to see my overall progress so that I know how far I've come.

#### Acceptance Criteria
| Element | Display |
|---------|---------|
| Total points | Sum of earned points from completed items and milestones |
| Completion percentage | Tasks completed / total tasks |
| Current streak | Consecutive days with activity |

#### Related Prompts
- `[Historical]` "Show progress summary with points and streaks"

### FR2: View Mode Toggle

#### User Story
As a pro, I want to switch between views so that I can see my progress in different ways.

#### Acceptance Criteria
| View | Focus |
|------|-------|
| Journey | Feature-based milestones on a timeline |
| Weekly | Week-by-week task planning |

#### Related Prompts
- `[Historical]` "Support both journey and weekly view modes"

### FR3: Point System

#### User Story
As a pro, I want to earn points for completing tasks so that I feel rewarded.

#### Acceptance Criteria
| Point Source | Value |
|--------------|-------|
| Complete onboarding item | Item's point value (25, 50, 75, or 100) |
| Reach Attached stage | 50 points |
| Reach Activated stage | 100 points |
| Reach Engaged stage | 150 points |

#### Related Prompts
- "Add point values to onboarding items"

### FR4: Data from Backend

#### User Story
As a pro, I want to see my personalized onboarding plan so that I know what's relevant to me.

#### Acceptance Criteria
| Data Type | Source |
|-----------|--------|
| Features | @HCP Context Manager Features Tab |
| Onboarding Items | @HCP Context Manager Onboarding Items Tab |
| Point Values | @HCP Context Manager Onboarding Items Tab |
| Pro Progress | Sample Pros Configurations |

#### Related Prompts
- `[Historical]` "Pro-facing data should come from centralized backend"

## Open Questions/Unknowns
- Should we add achievements or badges?
- How should we handle feature filtering by plan tier?
