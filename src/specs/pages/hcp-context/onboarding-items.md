# Onboarding Items Tab

## Problem
Onboarding tasks need to be consistent across the entire system, but defining them in multiple places leads to inconsistencies and maintenance burden.

## Solution
Provide a centralized onboarding item library where all tasks are defined once with their completion logic, point values, and metadata, then referenced throughout the system.

## Scope
**Included:**
- Onboarding item CRUD operations
- Category organization
- Completion criteria configuration
- Point value assignment
- Time estimates
- Navigation and call associations
- Item types (in-product, rep-facing)

**Excluded:**
- Real-time completion tracking (handled by pro accounts)
- Item recommendations engine
- A/B testing of items

## Dependencies
- **Depends on:** Navigation (for navigation links), Calls (for call links)
- **Depended on by:** Features (for stage assignments), Org Insights (for plan management), Housecall Pro Web (for journey tasks)

## Success Criteria
- All items can be created and managed centrally
- Items can be assigned to feature stages
- Point values follow the defined tier system
- Navigation and calls can be associated with items

## Functional Requirements

### FR1: Onboarding Item CRUD

#### User Story
As an admin, I want to manage onboarding items so that they're consistent everywhere in the system.

#### Acceptance Criteria
| Action | Behavior |
|--------|----------|
| Create | Add new item with all required fields |
| Read | View item list with filtering |
| Update | Edit item details and associations |
| Delete | Remove item from library |

#### Related Prompts
- `[Historical]` "Create a centralized onboarding item library"

### FR2: Point Value System

#### User Story
As an admin, I want to assign point values to items so that important items are incentivized appropriately.

#### Acceptance Criteria
| Points | Criteria | Examples |
|--------|----------|----------|
| 100 | Critical/foundational actions that generate revenue or are essential | Create first customer, Connect payment processor, Send first invoice |
| 75 | Important engagement drivers that indicate active usage | Complete first job, Enable appointment reminders, Online booking |
| 50 | Good to have actions that improve user experience | Add team member, Set business hours, Customer portal |
| 25 | Nice to have / cosmetic items or advanced settings | Add company logo, Customize message templates |

#### Related Prompts
- "Add point values to onboarding items"

### FR3: Item Types

#### User Story
As an admin, I want to categorize items by type so that tracking is handled correctly.

#### Acceptance Criteria
| Type | Description | Tracking |
|------|-------------|----------|
| in_product | Tracked automatically by system | API-based completion detection |
| rep_facing | Completed by reps | Manual checkbox in Org Insights |

#### Related Prompts
- `[Historical]` "Support both automatic and manual item tracking"

### FR4: Navigation and Call Associations

#### User Story
As an admin, I want to associate navigation resources and calls with items so that users can easily access related content.

#### Acceptance Criteria
| Association | Behavior |
|-------------|----------|
| Add navigation | Item displays navigation link |
| Add call | Item displays call booking link |
| Multiple associations | Item can have multiple navigation/call links |
| Remove association | Link removed from item display |

#### Related Prompts
- "Add Navigation & Calls to onboarding items"

### FR5: Category Organization

#### User Story
As an admin, I want to organize items by category so that they're grouped logically.

#### Acceptance Criteria
| Condition | Expected Behavior |
|-----------|-------------------|
| Assign category | Item grouped under category |
| Filter by category | Show only items in selected category |
| Change category | Item moves to new category group |

#### Related Prompts
- `[Historical]` "Organize onboarding items by category"

### FR6: Completion Logic Configuration

#### User Story
As an admin, I want to define completion logic so that item completion is tracked correctly.

#### Acceptance Criteria
| Field | Purpose |
|-------|---------|
| completionApi | API endpoint/event for automatic tracking |
| actionUrl | Deep link for user to complete action |
| repInstructions | Instructions for rep-facing items |

#### Related Prompts
- `[Historical]` "Define completion logic for each item"

### FR7: Context Snippets

#### User Story
As an admin, I want to add context snippets to items so that reps have talking points when discussing items with pros.

#### Acceptance Criteria
| Snippet Type | Purpose |
|--------------|---------|
| Value statement | Why this item matters |
| Guidance | How to complete the item |
| Objection handling | Common questions/concerns |

#### Related Prompts
- `[Historical]` "Add context snippets for rep guidance"

## Open Questions/Unknowns
- Should items have dependencies on other items?
- How should we handle item versioning?
