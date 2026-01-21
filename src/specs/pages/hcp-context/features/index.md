# Features Tab

## Problem
Features need stage-specific content and behaviors, but managing this across four adoption stages is complex without a structured interface.

## Solution
Provide a comprehensive feature management interface where admins can define features, configure all four adoption stages, and assign relevant onboarding items and navigation resources to each stage.

## Scope
**Included:**
- Feature CRUD operations
- Stage context editing (Not Attached, Attached, Activated, Engaged)
- Onboarding item assignments per stage
- Navigation resource assignments
- Feature metadata (icon, name, description)
- Stage completion logic configuration

**Excluded:**
- Feature usage analytics
- A/B testing of stage content
- Automated feature suggestions

## Dependencies
- **Depends on:** Onboarding Items (for assignment), Navigation (for resource linking)
- **Depended on by:** All user-facing pages that display feature content

## Success Criteria
- All four stages can be configured independently for each feature
- Onboarding items can be assigned to specific stages
- Navigation resources can be linked to features
- Stage completion logic can be configured per stage

## Functional Requirements

### FR1: Feature List with CRUD

#### User Story
As an admin, I want to view, create, edit, and delete features so that I can maintain the feature catalog.

#### Acceptance Criteria
| Action | Behavior |
|--------|----------|
| View | Display feature table with name, icon, and status |
| Create | Open modal with empty feature form |
| Edit | Open modal with populated feature data |
| Delete | Confirm and remove feature from system |

#### Related Prompts
- `[Historical]` "Create a feature management interface with table view"

### FR2: Stage Context Editor

#### User Story
As an admin, I want to configure stage-specific content so that pros receive relevant information based on their adoption level.

#### Acceptance Criteria
| Stage | Configurable Elements |
|-------|----------------------|
| All stages | Description, prompts, talking points |
| All stages | Onboarding item assignments |
| All stages | Navigation resource links |
| All stages | AI configuration snippets |

#### Related Prompts
- `[Historical]` "Each stage should have its own content and item assignments"

### FR3: Stage Completion Logic Editor

#### User Story
As an admin, I want stage-specific completion logic so that each adoption stage has appropriate transition rules.

#### Acceptance Criteria
| Stage | UI Behavior |
|-------|-------------|
| Not Attached | Toggle (AND/OR/NONE) + conditions editor (or "All pros have access" for NONE) |
| Attached | Description only: "To be considered 'Attached' the Pro must complete all onboarding items assigned to the 'Attached' stage for this feature" |
| Activated | Description only: "To be considered 'Activated' the Pro must complete all onboarding items assigned to the 'Activated' stage for this feature" |
| Engaged | Description only: "At this time we consider all pros engaged once they have completed the 'Activated' stage" |

#### Related Prompts
- "Update the HCP Context Manager to have stage-specific completion logic..."
- "Can you add the behavior by stage table you just showed me to the proper spec doc?"

### FR4: Onboarding Item Assignment

#### User Story
As an admin, I want to assign onboarding items to feature stages so that pros get relevant tasks at each adoption level.

#### Acceptance Criteria
| Condition | Expected Behavior |
|-----------|-------------------|
| Assign item to stage | Item appears in stage's item list |
| Remove item from stage | Item removed from stage's item list |
| Item assigned to multiple features | Item can be shared across features |
| Change item order | Items display in specified order |

#### Related Prompts
- `[Historical]` "Allow onboarding items to be assigned to specific stages"

### FR5: Navigation Resource Assignment

#### User Story
As an admin, I want to link navigation resources to features so that AI can provide contextual navigation help.

#### Acceptance Criteria
| Condition | Expected Behavior |
|-----------|-------------------|
| Link resource | Resource appears in feature's navigation list |
| Unlink resource | Resource removed from feature's navigation |
| Multiple resources | Features can have multiple navigation links |

#### Related Prompts
- "Add Navigation & Calls to onboarding items"

## Open Questions/Unknowns
- Should feature editing be split into a separate route for complex features?
- How should we handle feature versioning?
