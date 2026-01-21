# Send Your First Invoice

## Problem
Pros need to successfully send their first invoice to validate their invoicing workflow is working and to start getting paid through the platform.

## Solution
A guided onboarding item that encourages the pro to send an invoice to a customer, demonstrating the complete billing workflow.

## Scope
**Included:**
- Invoice sending via email or SMS
- Confirmation of successful delivery
- Tracking via completion API

**Excluded:**
- Invoice creation (prerequisite)
- Payment collection (separate item)
- Recurring invoice setup

## Dependencies
- **Depends on:** Create First Customer, Create First Job, Complete First Job (invoice generation)
- **Depended on by:** Collect First Payment

## Success Criteria
- Pro successfully sends an invoice
- Customer receives invoice via selected method
- Completion event triggers (`invoice.sent`)
- Pro can track invoice status

## Functional Requirements

### FR1: Invoice Sending

#### User Story
As a pro with a completed job, I want to send the invoice to my customer so that I can get paid for my work.

#### Acceptance Criteria
| Condition | Expected Behavior |
|-----------|-------------------|
| Invoice exists | Generated from completed job |
| Pro selects send method | Email or SMS option available |
| Pro sends invoice | Invoice delivered to customer |
| Completion API triggered | `invoice.sent` event fires |

#### Related Prompts
- [Initial]: "First invoice sent marks key activation milestone"

## Open Questions/Unknowns
- Should we encourage test invoice to self first?
- What if customer email/phone is missing?
