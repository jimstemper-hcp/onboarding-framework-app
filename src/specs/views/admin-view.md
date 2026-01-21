# Admin View

## Problem
Product teams need a centralized interface to manage onboarding content, but without a unified admin tool, content management is fragmented and error-prone.

## Solution
Provide the Admin View as the primary interface for the @HCP Context Manager, allowing admins to manage features, navigation resources, calls, onboarding items, and tools through a tabbed interface with modal editors.

## Scope
**Included:**
- Feature management with stage context editing
- Navigation resource management
- Calendly call type management
- Onboarding item library management
- MCP tool configuration

**Excluded:**
- Pro account management (handled by Sample Pros)
- Analytics and reporting
- User access control

## Dependencies
- **Depends on:** OnboardingContext (for data and mutations), Feature data files
- **Depended on by:** All user-facing views (consume the content managed here)

## Success Criteria
- All five content types are accessible via tabs
- Edit modals allow full configuration of each content type
- Changes are validated before saving
- Content updates propagate to user-facing views

## Functional Requirements

### FR1: Tabbed Navigation

#### User Story
As an admin, I want to switch between content types via tabs so that I can manage all onboarding content from one interface.

#### Acceptance Criteria
| Tab | Content |
|-----|---------|
| Features | Feature table with stage context editing |
| Navigation | Navigation resource table with type filters |
| Calls | Calendly link table with team organization |
| Onboarding Items | Item table with category filters |
| Tools | MCP tool table with parameter configuration |

#### Related Prompts
- `[Historical]` "Create tabbed navigation for admin content management"

### FR2: Feature Edit Modal

#### User Story
As an admin, I want to edit features in a modal so that I can configure all aspects of a feature.

#### Acceptance Criteria
| Tab | Contents |
|-----|----------|
| Basic Info | Name, icon, description |
| Important Context | Stage contexts, talking points |
| AI Config | Prompts, snippets, tool access |
| JSON Payload | Raw data view for debugging |

#### Related Prompts
- `[Historical]` "Create 4-tab modal for feature editing"

### FR3: CRUD Operations

#### User Story
As an admin, I want to create, read, update, and delete content so that I can maintain the content catalog.

#### Acceptance Criteria
| Operation | UI Element |
|-----------|------------|
| Create | "Add New" button opens empty modal |
| Read | Table displays all items with key fields |
| Update | Click row to open populated modal |
| Delete | Delete button with confirmation |

#### Related Prompts
- `[Historical]` "Support CRUD operations for all content types"

### FR4: Data Validation

#### User Story
As an admin, I want content validated before saving so that I don't introduce errors.

#### Acceptance Criteria
| Validation | Behavior |
|------------|----------|
| Required fields | Prevent save if empty |
| URL format | Validate navigation URLs |
| Point values | Must be 25, 50, 75, or 100 |
| Duplicate check | Warn if slug already exists |

#### Related Prompts
- `[Inferred]` Validation from implementation patterns

## Open Questions/Unknowns
- Should we split the AdminView component into smaller sub-components?
- Should we add search/filter functionality to all tables?
