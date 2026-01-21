# Service Plans Feature

## Problem
Pros lack recurring revenue streams, relying on one-time jobs that create income unpredictability and require constant customer acquisition.

## Solution
Enable pros to offer recurring maintenance contracts and subscription services to customers, creating predictable monthly revenue and stronger customer relationships.

## Scope
**Included:**
- Service plan creation and management
- Recurring billing setup
- Plan management dashboard
- Renewal reminders
- Plan performance tracking

**Excluded:**
- Custom billing frequency beyond standard options
- Multi-location plan management
- Automated plan recommendations

## Dependencies
- **Depends on:** Invoicing (for billing), Customers (for customer data)
- **Depended on by:** Reporting (for revenue analytics)

## Success Criteria
- Pros can create and manage service plans
- Recurring billing processes automatically
- Renewal reminders are sent on schedule
- Plan revenue is trackable

## Functional Requirements

### FR1: Service Plan Creation

#### User Story
As a pro, I want to create service plans so that I can offer recurring services to customers.

#### Acceptance Criteria
| Field | Description |
|-------|-------------|
| Plan name | Descriptive name for the service |
| Services included | List of services covered |
| Billing frequency | Monthly, quarterly, annually |
| Price | Recurring charge amount |

#### Related Prompts
- `[Historical]` "Enable service plan creation for recurring revenue"

### FR2: Stage Contexts

#### User Story
As an admin, I want stage-specific content so that pros receive appropriate guidance based on their service plan adoption.

#### Acceptance Criteria
| Stage | Content Focus |
|-------|---------------|
| Not Attached | Benefit messaging: "Create recurring revenue with service plans" |
| Attached | Onboarding items: Create first service plan, set pricing |
| Activated | Onboarding items: Configure renewal reminders, set up auto-billing |
| Engaged | Plan analytics, retention strategies |

#### Related Prompts
- `[Historical]` "Define stage contexts for service plans feature"

## Open Questions/Unknowns
- Should we support custom billing frequencies?
- How should we handle plan cancellations and refunds?
