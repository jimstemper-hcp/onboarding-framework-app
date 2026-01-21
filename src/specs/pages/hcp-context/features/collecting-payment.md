# Collecting Payment Feature

## Problem
Pros have trouble getting paid, relying on checks and cash that delay payment and create reconciliation headaches.

## Solution
Enable pros to accept payments through multiple methods including credit cards, ACH, and in-person payments with integrated payment processing.

## Scope
**Included:**
- Multiple payment method support
- Payment processor integration
- Auto-pay configuration
- Payment reminders
- Receipt generation

**Excluded:**
- Multi-currency support
- Financing/BNPL options
- Payment disputes handling

## Dependencies
- **Depends on:** Invoicing (for invoice amounts), Customers (for billing info)
- **Depended on by:** Reporting (for payment analytics)

## Success Criteria
- Payments can be processed through multiple methods
- Auto-pay reduces collection effort
- Receipts are generated automatically
- Payment status syncs with invoices

## Functional Requirements

### FR1: Payment Processing

#### User Story
As a pro, I want to accept payments easily so that I get paid faster.

#### Acceptance Criteria
| Payment Method | Support |
|----------------|---------|
| Credit card | Online and in-person |
| ACH/Bank transfer | Lower fees for larger amounts |
| Cash | Manual recording |
| Check | Manual recording with deposit tracking |

#### Related Prompts
- `[Historical]` "Create payment collection functionality"

### FR2: Stage Contexts

#### User Story
As an admin, I want stage-specific content so that pros receive appropriate guidance based on their payment collection adoption.

#### Acceptance Criteria
| Stage | Content Focus |
|-------|---------------|
| Not Attached | Benefit messaging: "Accept payments instantly from anywhere" |
| Attached | Onboarding items: Connect payment processor, process first payment |
| Activated | Onboarding items: Enable auto-pay, configure payment reminders |
| Engaged | Payment analytics, revenue tracking |

#### Related Prompts
- `[Historical]` "Define stage contexts for collecting payment feature"

## Open Questions/Unknowns
- Should we support payment plans?
- How should we handle chargebacks?
