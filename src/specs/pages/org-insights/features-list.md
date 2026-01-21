# Features List

## Problem
Reps need visibility into which features a pro is using and their adoption level, but without a unified view, they can't quickly assess where to focus their efforts.

## Solution
Display all features available to the selected pro with their current adoption stage, usage counts, and quick access to stage-specific context.

## Scope
**Included:**
- Feature list with adoption stages
- Stage indicators (Not Attached, Attached, Activated, Engaged)
- Usage count display
- Feature icons and descriptions

**Excluded:**
- Stage manipulation by reps
- Feature usage analytics
- Feature comparison

## Dependencies
- **Depends on:** @HCP Context Manager (feature definitions), Sample Pros Configurations (pro's feature status)
- **Depended on by:** None (end-user interface)

## Success Criteria
- All features visible with current stage
- Stage badges are color-coded
- Usage counts are accurate
- Feature details are expandable

## Functional Requirements

### FR1: Feature Display

#### User Story
As a rep, I want to see all features so that I understand the pro's full potential.

#### Acceptance Criteria
| Element | Content |
|---------|---------|
| Icon | Feature visual identifier |
| Name | Feature title |
| Stage | Current adoption stage badge |
| Usage | Count of feature usage |

#### Related Prompts
- `[Historical]` "Display feature list with adoption stages"

### FR2: Stage Indicators

#### User Story
As a rep, I want to see adoption stages visually so that I can quickly identify opportunities.

#### Acceptance Criteria
| Stage | Badge Color |
|-------|-------------|
| Not Attached | Gray |
| Attached | Blue |
| Activated | Green |
| Engaged | Gold |

#### Related Prompts
- `[Historical]` "Color-code adoption stage badges"

### FR3: Backend Data Source

#### User Story
As a rep, I want feature data from the central system so that information is accurate.

#### Acceptance Criteria
| Data | Source |
|------|--------|
| Features | @HCP Context Manager Features Tab |
| Stage status | Sample Pros Configurations |
| Usage counts | Sample Pros Configurations |

#### Related Prompts
- `[Historical]` "Pull feature data from centralized backend"

## Open Questions/Unknowns
- Should reps be able to manually advance stages?
- How should we handle features not available on pro's plan?
