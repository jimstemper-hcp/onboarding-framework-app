# Connect Your Payment Processor

## Problem
Pros need to connect a payment processor to accept credit card payments from customers, enabling faster payment collection and reducing friction in the billing process.

## Solution
A guided onboarding item that walks the pro through connecting Stripe or another payment processor via OAuth flow.

## Scope
**Included:**
- Payment processor OAuth connection
- Stripe integration setup
- Account verification

**Excluded:**
- Payment collection (separate item)
- Bank account setup for payouts
- Custom payment processor integrations

## Dependencies
- **Depends on:** Account creation, business information setup
- **Depended on by:** Collect First Payment, Enable Card on File

## Success Criteria
- Pro successfully connects payment processor
- OAuth flow completes without errors
- Processor connection verified
- Completion event triggers (`payments.processor_connected`)

## Functional Requirements

### FR1: Processor Connection

#### User Story
As a pro, I want to connect my payment processor so that I can accept credit card payments from customers.

#### Acceptance Criteria
| Condition | Expected Behavior |
|-----------|-------------------|
| Pro clicks action URL | Navigates to `/settings/payments` |
| Pro initiates OAuth | Redirected to Stripe (or other processor) |
| OAuth completes | Connection established, verified |
| Completion API triggered | `payments.processor_connected` event fires |

#### Related Prompts
- [Initial]: "Payment processor connection is critical for payment collection"

## Open Questions/Unknowns
- Which payment processors are supported?
- What happens if OAuth is interrupted?
- How do we handle existing processor connections?
