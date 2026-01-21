# Planning Mode System

## Problem
Development teams need a way to view specifications, collect feedback, and track release status for components, but this meta-information is typically scattered across different tools.

## Solution
Provide a Planning Mode toggle that overlays information icons on all plannable elements, enabling access to specs, feedback collection, and status tracking without leaving the application.

## Scope
**Included:**
- Mode toggle in header (Demo/Planning)
- Info icons on all plannable elements
- Planning Modal with Spec, Feedback, and Status tabs
- Feedback persistence to localStorage
- Plannable element registry

**Excluded:**
- Collaborative editing of specs
- Version control for specs
- Feedback sync to external systems

## Dependencies
- **Depends on:** None (foundational system)
- **Depended on by:** All views, pages, modals, and components (can be wrapped)

## Success Criteria
- Mode toggle switches between Demo and Planning modes
- Info icons appear on all wrapped elements in Planning Mode
- Modal displays spec content correctly
- Feedback is persisted and retrievable

## Functional Requirements

### FR1: Mode Toggle

#### User Story
As a developer, I want to toggle Planning Mode so that I can access element specifications.

#### Acceptance Criteria
| State | Behavior |
|-------|----------|
| Demo Mode | Normal application behavior, no info icons |
| Planning Mode | Info icons appear on all wrapped elements |
| Toggle | Persists to localStorage |

#### Related Prompts
- `[Historical]` "Create mode toggle for planning vs demo mode"

### FR2: Info Icons

#### User Story
As a developer, I want to click info icons so that I can view element specifications.

#### Acceptance Criteria
| Placement | Behavior |
|-----------|----------|
| Default | Top-right of wrapped element |
| Configurable | Position can be adjusted per element |
| Click | Opens Planning Modal for element |

#### Related Prompts
- `[Historical]` "Add info icons to plannable elements"

### FR3: Planning Modal

#### User Story
As a developer, I want to view spec, feedback, and status so that I understand the element's current state.

#### Acceptance Criteria
| Tab | Content |
|-----|---------|
| Spec | Rendered markdown from spec file |
| Feedback | Form to submit feedback, history of past feedback |
| Status | Release status, date, owners, dependencies, tags |

#### Related Prompts
- `[Historical]` "Create 3-tab planning modal"

### FR4: Plannable Registry

#### User Story
As a developer, I want to register new elements so that they're included in the planning system.

#### Acceptance Criteria
| Registration | Required Fields |
|--------------|-----------------|
| Element ID | Unique identifier |
| Name | Display name |
| Category | view, page, modal, component, feature |
| Spec path | Path to markdown spec file |
| Status | shipped, in-development, planned, proposed, prototype |

#### Related Prompts
- `[Historical]` "Create central registry for plannable elements"

### FR5: Feedback Persistence

#### User Story
As a stakeholder, I want my feedback saved so that it's not lost between sessions.

#### Acceptance Criteria
| Storage | Behavior |
|---------|----------|
| localStorage | Feedback persisted locally |
| Structure | Element ID, name, feedback text, timestamp, submitter |
| History | All past feedback viewable per element |

#### Related Prompts
- `[Historical]` "Persist feedback to localStorage"

## Open Questions/Unknowns
- Should specs be fetched from a CMS instead of local files?
- How should we handle spec versioning?
