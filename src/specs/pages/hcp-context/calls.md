# Calls Tab

## Problem
Reps need easy access to Calendly booking links for scheduling calls with pros, but without centralized management, links become outdated and difficult to maintain across teams.

## Solution
Provide a centralized Calendly call type management interface where admins can define call types, organize them by team, and maintain accurate booking links.

## Scope
**Included:**
- Calendly link CRUD operations
- Team-based organization
- Call duration configuration
- Call description and context
- Status management

**Excluded:**
- Calendar integration beyond Calendly
- Call scheduling automation
- Call analytics

## Dependencies
- **Depends on:** None
- **Depended on by:** Org Insights Admin Panel (Calls page), Onboarding Items (for call-related items)

## Success Criteria
- All call types can be created and managed
- Call types are organized by team
- Booking links work correctly when clicked
- Only active call types are shown to users

## Functional Requirements

### FR1: Call Type CRUD

#### User Story
As an admin, I want to manage Calendly call types so that reps have accurate booking options.

#### Acceptance Criteria
| Action | Behavior |
|--------|----------|
| Create | Add new call type with name, URL, duration |
| Read | View call type list in data table |
| Update | Edit call type details |
| Delete | Remove call type from system |

#### Related Prompts
- `[Historical]` "Add Calendly call management to admin interface"

### FR2: Team Organization

#### User Story
As an admin, I want to organize call types by team so that reps can easily find the right specialist.

#### Acceptance Criteria
| Condition | Expected Behavior |
|-----------|-------------------|
| Assign team | Call type appears under team grouping |
| Filter by team | Show only call types for selected team |
| No team assigned | Call type appears in general section |

#### Related Prompts
- `[Historical]` "Organize calls by team for easy routing"

### FR3: Duration Configuration

#### User Story
As an admin, I want to specify call durations so that scheduling is accurate.

#### Acceptance Criteria
| Duration | Display |
|----------|---------|
| 15 min | "15 min" |
| 30 min | "30 min" |
| 45 min | "45 min" |
| 60 min | "1 hour" |

#### Related Prompts
- `[Historical]` "Show call durations in the call type list"

### FR4: Status Management

#### User Story
As an admin, I want to control call type status so that outdated calls are not shown to users.

#### Acceptance Criteria
| Status | Behavior |
|--------|----------|
| Active | Call type shown to users |
| Inactive | Call type hidden from users |

#### Related Prompts
- `[Inferred]` Status control requirement from implementation

## Open Questions/Unknowns
- Should we integrate with other calendar providers?
- How should we handle call type usage tracking?
