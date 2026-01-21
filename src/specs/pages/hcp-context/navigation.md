# Navigation Tab

## Problem
The AI assistant needs to direct users to specific pages, videos, help articles, and external resources, but without a managed catalog of navigation resources, the AI cannot provide consistent and accurate navigation help.

## Solution
Provide a centralized navigation resource management interface where admins can define all navigable resources with their metadata, categorize them by type, and control their publication status.

## Scope
**Included:**
- Navigation resource CRUD operations
- Resource types: Pages, Modals, Videos, Help Articles, External URLs, Tours
- Status management (Published, Draft, Archived)
- Feature associations
- Context snippets for AI

**Excluded:**
- Analytics on resource usage
- Automatic resource discovery
- Resource content editing (just metadata)

## Dependencies
- **Depends on:** None
- **Depended on by:** Features (for navigation assignments), AI Chat Assistant (for navigation guidance)

## Success Criteria
- All resource types can be created and managed
- Resources can be associated with features
- Only published resources are used by user-facing pages
- Context snippets provide AI with accurate navigation guidance

## Functional Requirements

### FR1: Resource Type Management

#### User Story
As an admin, I want to categorize navigation resources by type so that they are organized and the AI can provide appropriate guidance.

#### Acceptance Criteria
| Resource Type | Description |
|---------------|-------------|
| Page | Internal HCP pages |
| Modal | In-app modal dialogs |
| Video | Training and help videos |
| Help Article | Knowledge base articles |
| External URL | Third-party resources |
| Tour | In-app guided tours |

#### Related Prompts
- `[Historical]` "Create navigation types for different resource categories"

### FR2: Resource Status Control

#### User Story
As an admin, I want to control resource publication status so that only approved content is used by the AI.

#### Acceptance Criteria
| Status | Behavior |
|--------|----------|
| Published | Resource available to all systems |
| Draft | Resource visible in admin only |
| Archived | Resource hidden, preserved for history |

#### Related Prompts
- `[Historical]` "Add status management to navigation resources"

### FR3: Feature Association

#### User Story
As an admin, I want to associate navigation resources with features so that the AI provides contextual navigation within feature contexts.

#### Acceptance Criteria
| Condition | Expected Behavior |
|-----------|-------------------|
| Associate with feature | Resource appears in feature's navigation list |
| Multiple associations | One resource can link to multiple features |
| No association | Resource available globally |

#### Related Prompts
- "Add Navigation & Calls to onboarding items"

### FR4: Context Snippets for AI

#### User Story
As an admin, I want to add context snippets to resources so that the AI can describe the resource accurately to users.

#### Acceptance Criteria
| Snippet Type | Purpose |
|--------------|---------|
| Value statement | Why this resource is helpful |
| Description | What the user will find |
| Prerequisites | What should be done first |

#### Related Prompts
- `[Historical]` "Add context snippets to navigation resources for AI context"

## Open Questions/Unknowns
- Should we add automatic link checking for external URLs?
- How should we handle resource versioning?
