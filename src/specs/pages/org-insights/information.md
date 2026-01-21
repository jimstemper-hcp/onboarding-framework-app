# Information Page

## Problem
Reps need a quick overview of pro account details before calls, but this information is scattered across different systems.

## Solution
Provide a comprehensive pro information dashboard showing account details, onboarding progress, goals, and key metrics at a glance.

## Scope
**Included:**
- Pro account details display
- Company information
- Current onboarding week indicator
- Goal and trade information
- Overall progress summary

**Excluded:**
- Account editing
- Billing information
- Activity history

## Dependencies
- **Depends on:** Sample Pros Configurations (pro account data)
- **Depended on by:** None (end-user interface)

## Success Criteria
- All key pro info is visible at a glance
- Progress indicators are accurate
- Goals and trade type are displayed
- Contact information is accessible

## Functional Requirements

### FR1: Account Details

#### User Story
As a rep, I want to see pro account details so that I can prepare for calls.

#### Acceptance Criteria
| Field | Content |
|-------|---------|
| Company name | Business name |
| Owner | Pro owner name |
| Contact | Phone, email |
| Trade | Business trade type |

#### Related Prompts
- `[Historical]` "Display pro account details for rep reference"

### FR2: Progress Overview

#### User Story
As a rep, I want to see onboarding progress so that I know where the pro stands.

#### Acceptance Criteria
| Indicator | Content |
|-----------|---------|
| Current week | Which week of onboarding (1-4) |
| Overall progress | Percentage complete |
| Tasks completed | X of Y items done |

#### Related Prompts
- `[Historical]` "Show progress overview on information page"

### FR3: Goal Display

#### User Story
As a rep, I want to see pro's goals so that I can provide relevant guidance.

#### Acceptance Criteria
| Display | Content |
|---------|---------|
| Primary goal | Pro's stated onboarding goal |
| Trade | Business type for context |
| Plan tier | Current subscription level |

#### Related Prompts
- `[Historical]` "Display pro goals and trade information"

### FR4: Backend Data Source

#### User Story
As a rep, I want accurate pro data so that information is up to date.

#### Acceptance Criteria
| Data | Source |
|------|--------|
| Account details | Sample Pros Configurations |
| Progress | Sample Pros Configurations |
| Goals | Sample Pros Configurations |

#### Related Prompts
- `[Historical]` "Pull pro data from Sample Pros backend"

## Open Questions/Unknowns
- Should we include last contact date?
- How should we handle incomplete pro profiles?
