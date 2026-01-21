# Calls Page

## Problem
Reps need quick access to schedule calls with pros, but searching for the right Calendly link across teams and call types is time-consuming.

## Solution
Display all available call types organized by team with direct booking buttons, allowing reps to schedule calls with one click.

## Scope
**Included:**
- Calendly link display
- Team-based organization
- Direct booking buttons
- Call duration and description display

**Excluded:**
- Call scheduling within the app
- Call history
- Calendar integration

## Dependencies
- **Depends on:** @HCP Context Manager (Calendly links, call types)
- **Depended on by:** None (end-user interface)

## Success Criteria
- All call types are visible
- Team organization is clear
- Booking buttons redirect to Calendly
- Durations are displayed accurately

## Functional Requirements

### FR1: Call Type Display

#### User Story
As a rep, I want to see all call types so that I can choose the right one for the situation.

#### Acceptance Criteria
| Element | Content |
|---------|---------|
| Name | Call type title |
| Duration | Length of call |
| Description | Purpose of call type |
| Book button | Direct link to Calendly |

#### Related Prompts
- `[Historical]` "Display call types with booking buttons"

### FR2: Team Organization

#### User Story
As a rep, I want calls organized by team so that I can route to the right specialist.

#### Acceptance Criteria
| Organization | Behavior |
|--------------|----------|
| Team grouping | Calls grouped under team headers |
| No team | General section for unassigned calls |
| Filtering | Optional filter by team |

#### Related Prompts
- `[Historical]` "Organize calls by team"

### FR3: Backend Data Source

#### User Story
As a rep, I want call data from the central system so that links are always current.

#### Acceptance Criteria
| Data | Source |
|------|--------|
| Call types | @HCP Context Manager Calls Tab |
| Calendly URLs | @HCP Context Manager Calls Tab |
| Team assignments | @HCP Context Manager Calls Tab |

#### Related Prompts
- `[Historical]` "Pull call data from centralized backend"

## Open Questions/Unknowns
- Should we show call type availability status?
- How should we handle team-specific call routing?
