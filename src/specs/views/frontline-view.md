# Frontline View

## Problem
Customer success reps need tools to efficiently manage multiple pro accounts, but current tools don't provide stage-specific context or integrated task management.

## Solution
Provide a rep-facing interface with pro list and detail views, showing feature adoption status, rep-facing tasks, and stage-specific talking points—all pulling data from @HCP Context Manager and Sample Pros Configurations.

## Scope
**Included:**
- Pro account list with status indicators
- Pro detail view with feature status
- Rep-facing task completion
- Stage-specific context cards

**Excluded:**
- Pro account creation
- Content editing
- Performance analytics

## Dependencies
- **Depends on:** OnboardingContext (for feature data), Onboarding Items (for rep tasks), Sample Pros Configurations (for pro accounts)
- **Depended on by:** None (end-user interface)

## Success Criteria
- Reps can see all assigned pros at a glance
- Feature adoption stages are visible for each pro
- Rep-facing tasks can be completed with one click
- Stage context provides relevant talking points

## Functional Requirements

### FR1: Pro List

#### User Story
As a rep, I want to see all my assigned pros so that I can prioritize my outreach.

#### Acceptance Criteria
| Column | Content |
|--------|---------|
| Company | Pro's company name |
| Owner | Pro owner name |
| Status | Overall adoption status |
| Actions | Quick access to common tasks |

#### Related Prompts
- `[Historical]` "Create pro list view for rep workspace"

### FR2: Pro Detail View

#### User Story
As a rep, I want to see detailed pro information so that I can provide relevant guidance.

#### Acceptance Criteria
| Section | Content |
|---------|---------|
| Pro info | Company, owner, contact |
| Feature status | All features with adoption stages |
| Rep tasks | Outstanding rep-facing items |
| Context | Stage-specific talking points |

#### Related Prompts
- `[Historical]` "Show feature status and context in pro detail"

### FR3: Rep Task Completion

#### User Story
As a rep, I want to complete rep-facing tasks so that I can track my work.

#### Acceptance Criteria
| Action | Behavior |
|--------|----------|
| Check task | Mark as complete, update pro status |
| View instructions | See rep instructions for task |
| Undo completion | Revert if marked by mistake |

#### Related Prompts
- `[Historical]` "Enable rep-facing task completion"

### FR4: Backend Data Source

#### User Story
As a rep, I want consistent data so that information matches what pros see.

#### Acceptance Criteria
| Data | Source |
|------|--------|
| Features | @HCP Context Manager Features Tab |
| Items | @HCP Context Manager Onboarding Items Tab |
| Pro accounts | Sample Pros Configurations |
| Stage contexts | @HCP Context Manager Features Tab |

#### Related Prompts
- `[Historical]` "Pull rep-facing data from centralized backend"

## Open Questions/Unknowns
- How should we handle team-based pro assignments?
- Should we integrate with external CRM?
