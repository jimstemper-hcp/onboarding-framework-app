# Portal View

## Problem
Pros need a clear view of their onboarding progress, but without a personalized dashboard, they don't know what features are available or what to do next.

## Solution
Provide a pro-facing dashboard showing all available features with stage-specific content, quick actions, and progress tracking—all driven by data from @HCP Context Manager and Sample Pros Configurations.

## Scope
**Included:**
- Feature cards with adoption stage indicators
- Stage-specific content per feature
- Progress tracking visuals
- Quick actions and call scheduling

**Excluded:**
- Content editing
- Rep-facing features
- Account settings

## Dependencies
- **Depends on:** OnboardingContext (for feature data), Sample Pros Configurations (for pro account and progress)
- **Depended on by:** None (end-user interface)

## Success Criteria
- All available features are displayed
- Current adoption stage is visible per feature
- Stage-specific content guides next actions
- Calls can be scheduled from the portal

## Functional Requirements

### FR1: Feature Cards

#### User Story
As a pro, I want to see all features so that I know what's available to me.

#### Acceptance Criteria
| Card Element | Content |
|--------------|---------|
| Icon | Feature visual identifier |
| Name | Feature title |
| Status | Current adoption stage |
| Actions | Context-appropriate next steps |

#### Related Prompts
- `[Historical]` "Create feature cards for pro portal"

### FR2: Stage-Specific Content

#### User Story
As a pro, I want content relevant to my stage so that I'm not overwhelmed with advanced features.

#### Acceptance Criteria
| Stage | Card Displays |
|-------|---------------|
| Not Attached | Benefit messaging, discovery prompts |
| Attached | Setup tasks, quick start guides |
| Activated | Optimization tips, advanced features |
| Engaged | Best practices, analytics links |

#### Related Prompts
- `[Historical]` "Show stage-specific content in portal cards"

### FR3: Progress Tracking

#### User Story
As a pro, I want to see my progress so that I stay motivated.

#### Acceptance Criteria
| Indicator | Displays |
|-----------|----------|
| Stage badge | Current adoption stage |
| Task count | X of Y tasks complete |
| Progress bar | Visual completion percentage |

#### Related Prompts
- `[Historical]` "Add progress indicators to feature cards"

### FR4: Backend Data Source

#### User Story
As a pro, I want consistent information so that my progress is accurately reflected.

#### Acceptance Criteria
| Data | Source |
|------|--------|
| Features | @HCP Context Manager Features Tab |
| Stage content | @HCP Context Manager Features Tab |
| Pro progress | Sample Pros Configurations |
| Calendly links | @HCP Context Manager Calls Tab |

#### Related Prompts
- `[Historical]` "Pull portal data from centralized backend"

## Open Questions/Unknowns
- How should we handle features across multiple plan tiers?
- Should we add gamification elements?
