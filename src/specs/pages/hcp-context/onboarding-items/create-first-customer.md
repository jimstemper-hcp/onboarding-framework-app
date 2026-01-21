# Create Your First Customer

## Problem
New pros need to add customer information to start using core features like invoicing, estimates, and scheduling. Without customers in the system, pros cannot demonstrate value from the platform.

## Solution
A guided onboarding item that prompts the pro to create their first customer record, establishing the foundational data needed for all customer-facing workflows.

## Scope
**Included:**
- Customer creation workflow
- Basic customer information capture (name, contact, address)
- Success tracking via completion API

**Excluded:**
- Customer import from external sources
- Bulk customer creation
- Customer merge/deduplication

## Dependencies
- **Depends on:** Account creation, basic setup complete
- **Depended on by:** Create First Job, Send First Invoice, Send First Estimate

## Success Criteria
- Pro successfully creates a customer record
- Customer appears in customer list
- Completion event triggers (`customer.created`)
- Pro can proceed to job/invoice creation

## Functional Requirements

### FR1: Customer Creation Flow

#### User Story
As a new pro, I want to add my first customer so that I can start creating jobs and invoices for them.

#### Acceptance Criteria
| Condition | Expected Behavior |
|-----------|-------------------|
| Pro clicks action URL | Navigates to `/customers/new` |
| Pro fills required fields | Name fields are required |
| Pro saves customer | Customer record created, success message shown |
| Completion API triggered | `customer.created` event fires |

#### Related Prompts
- [Initial]: "User needs to create customers before they can use invoicing features"

## Open Questions/Unknowns
- Should we pre-populate sample data for demo purposes?
- What validation is required for phone/email fields?
