# @HCP Context Manager

## Problem
Product teams need a centralized place to manage onboarding content that powers all customer-facing experiences. Without this, content is scattered across multiple systems, leading to inconsistencies and difficult maintenance.

## Solution
Provide an internal admin tool that serves as the single source of truth for all onboarding content and configuration. This includes features, navigation resources, call types, onboarding items, and AI tools—all managed through a unified interface.

## Scope
**Included:**
- Feature definitions with stage contexts
- Navigation resource management (pages, videos, help articles)
- Calendly call type configuration
- Onboarding item library
- MCP tool configuration

**Excluded:**
- Pro account management (handled by Sample Pros)
- Real-time usage analytics
- Direct pro-facing content editing

## Dependencies
- **Depends on:** None (this is the backend data source)
- **Depended on by:** Housecall Pro Web, AI Chat Assistant, Org Insights Admin Panel

## Success Criteria
- All content types can be created, read, updated, and deleted
- Changes propagate to user-facing pages immediately
- Content is validated before saving
- Tab navigation provides easy access to all content types

## Functional Requirements

### FR1: Tab-Based Content Management

#### User Story
As an admin, I want to navigate between content types via tabs so that I can quickly access the data I need to manage.

#### Acceptance Criteria
| Tab | Content Managed |
|-----|-----------------|
| Features | Feature definitions with 4 adoption stages |
| Navigation | Navigation resources (pages, modals, videos, help articles, external URLs, tours) |
| Calls | Calendly call types and booking links |
| Onboarding Items | Centralized onboarding item library |
| Tools | MCP tool configurations for AI |

#### Related Prompts
- `[Historical]` "Create a centralized admin interface for managing onboarding content"

### FR2: Feature Management with Stage Contexts

#### User Story
As an admin, I want to define features with stage-specific contexts so that pros see relevant content based on their adoption level.

#### Acceptance Criteria
| Stage | Context Includes |
|-------|-----------------|
| Not Attached | Benefit messaging, discovery prompts |
| Attached | Initial onboarding items, quick setup guides |
| Activated | Advanced items, optimization tips |
| Engaged | Analytics, advanced usage guidance |

#### Related Prompts
- `[Historical]` "Each feature should have different content for each adoption stage"

### FR3: Content Validation

#### User Story
As an admin, I want content to be validated before saving so that I don't introduce errors into the system.

#### Acceptance Criteria
| Field | Validation |
|-------|------------|
| Feature name | Required, non-empty |
| Navigation URL | Valid URL format |
| Onboarding item points | Must be 25, 50, 75, or 100 |
| Calendly link | Valid Calendly URL format |

#### Related Prompts
- `[Inferred]` Validation requirements from implementation patterns

## Open Questions/Unknowns
- Should we add version history for features?
- How should we handle concurrent editing conflicts?
