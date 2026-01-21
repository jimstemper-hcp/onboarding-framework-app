# Estimates Feature

## Problem
Pros lose jobs to competitors when estimates are slow, unprofessional, or hard to understand, reducing their close rate.

## Solution
Enable pros to create professional estimates and proposals with line items, digital signatures, and easy conversion to jobs, helping them win more business.

## Scope
**Included:**
- Estimate creation and customization
- Line item management
- Estimate templates
- Digital signature support
- Estimate to job conversion

**Excluded:**
- Automated estimate generation
- Competitor pricing comparison
- Estimate follow-up automation

## Dependencies
- **Depends on:** Customers (for customer data), Job Scheduling (for job conversion)
- **Depended on by:** Reporting (for estimate analytics)

## Success Criteria
- Estimates can be created and sent
- Digital signatures can be collected
- Approved estimates convert to jobs
- Conversion rate is trackable

## Functional Requirements

### FR1: Estimate Creation

#### User Story
As a pro, I want to create estimates so that I can provide pricing to potential customers.

#### Acceptance Criteria
| Component | Behavior |
|-----------|----------|
| Line items | Add services with prices |
| Options | Offer good/better/best choices |
| Expiration | Set estimate validity period |
| Digital signature | Enable customer approval |

#### Related Prompts
- `[Historical]` "Create estimate functionality for sales process"

### FR2: Stage Contexts

#### User Story
As an admin, I want stage-specific content so that pros receive appropriate guidance based on their estimate adoption.

#### Acceptance Criteria
| Stage | Content Focus |
|-------|---------------|
| Not Attached | Benefit messaging: "Win more jobs with professional estimates" |
| Attached | Onboarding items: Create first estimate, set up templates |
| Activated | Onboarding items: Enable digital signatures, customize branding |
| Engaged | Estimate analytics, conversion tracking |

#### Related Prompts
- `[Historical]` "Define stage contexts for estimates feature"

## Open Questions/Unknowns
- Should we support estimate revisions with version history?
- How should we handle estimate expiration reminders?
