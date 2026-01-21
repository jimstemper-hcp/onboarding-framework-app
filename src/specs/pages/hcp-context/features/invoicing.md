# Invoicing Feature

## Problem
Pros struggle to get paid on time when using manual or unprofessional invoicing methods, leading to cash flow issues and customer confusion.

## Solution
Enable pros to create and send professional invoices with customizable templates, payment tracking, and automated sending capabilities.

## Scope
**Included:**
- Invoice creation and customization
- Customer billing management
- Payment tracking
- Invoice templates
- Automated invoice sending

**Excluded:**
- Multi-currency support
- Subscription billing
- Invoice factoring

## Dependencies
- **Depends on:** Customers (for billing info), Collecting Payment (for payment processing)
- **Depended on by:** Reporting (for revenue tracking)

## Success Criteria
- Invoices can be created and sent
- Payment status is tracked
- Templates can be customized
- Auto-send works reliably

## Functional Requirements

### FR1: Invoice Creation

#### User Story
As a pro, I want to create invoices so that I can bill customers for work completed.

#### Acceptance Criteria
| Component | Behavior |
|-----------|----------|
| Line items | Add services with descriptions and prices |
| Customer info | Pull from customer record |
| Due date | Set payment deadline |
| Notes | Add custom notes or terms |

#### Related Prompts
- `[Historical]` "Create invoicing functionality for billing customers"

### FR2: Stage Contexts

#### User Story
As an admin, I want stage-specific content so that pros receive appropriate guidance based on their invoicing adoption.

#### Acceptance Criteria
| Stage | Content Focus |
|-------|---------------|
| Not Attached | Benefit messaging: "Get paid faster with professional invoices" |
| Attached | Onboarding items: Create first customer, create first invoice |
| Activated | Onboarding items: Customize invoice template, set up auto-send |
| Engaged | Advanced usage guidance, reporting and analytics |

#### Related Prompts
- `[Historical]` "Define stage contexts for invoicing feature"

## Open Questions/Unknowns
- Should we support partial payments?
- How should we handle invoice disputes?
