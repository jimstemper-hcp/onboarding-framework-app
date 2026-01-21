# Org Insights Admin Panel

## Problem
Customer success reps need to manage individual pro onboarding, but without a unified interface, they must switch between multiple systems to monitor progress, customize plans, and schedule calls.

## Solution
Provide a rep-facing interface that consolidates all pro management capabilities: account overview, onboarding plan management, feature adoption tracking, and call scheduling—all referencing data from the @HCP Context Manager and Sample Pros Configurations.

## Scope
**Included:**
- Pro account selection and overview
- Information dashboard
- Onboarding plan management (category and weekly views)
- Feature adoption status list
- Calendly call scheduling

**Excluded:**
- Pro account creation (handled by Sample Pros)
- Feature content editing (handled by @HCP Context Manager)
- Direct pro communication

## Dependencies
- **Depends on:** @HCP Context Manager (features, items, calls), Sample Pros Configurations (pro accounts)
- **Depended on by:** None (end-user interface)

## Success Criteria
- Reps can view any assigned pro's onboarding status
- Onboarding plans can be customized per pro
- Feature adoption stages are visible at a glance
- Calls can be scheduled with one click

## Functional Requirements

### FR1: Pro Account Selector

#### User Story
As a rep, I want to select a pro account so that I can view and manage their onboarding.

#### Acceptance Criteria
| Condition | Expected Behavior |
|-----------|-------------------|
| Select pro | Dashboard updates with pro's data |
| No pro selected | Prompt to select a pro |
| Multiple pros | Dropdown shows all assigned pros |

#### Related Prompts
- `[Historical]` "Allow reps to switch between pro accounts"

### FR2: Sidebar Navigation

#### User Story
As a rep, I want to navigate between pages via sidebar so that I can quickly access different pro data.

#### Acceptance Criteria
| Page | Content |
|------|---------|
| Information | Pro account details and overview |
| Onboarding Plan | Item management (category/weekly views) |
| Features | Feature adoption status list |
| Calls | Calendly booking links |

#### Related Prompts
- `[Historical]` "Create sidebar navigation for rep interface"

### FR3: Data from Backend

#### User Story
As a rep, I want to see data from the central content system so that information is consistent.

#### Acceptance Criteria
| Data Type | Source |
|-----------|--------|
| Features | @HCP Context Manager Features Tab |
| Onboarding Items | @HCP Context Manager Onboarding Items Tab |
| Call Types | @HCP Context Manager Calls Tab |
| Pro Account | Sample Pros Configurations |

#### Related Prompts
- `[Historical]` "All rep-facing data should come from centralized backend"

## Open Questions/Unknowns
- Should we add rep performance metrics?
- How should we handle team-based pro assignments?
