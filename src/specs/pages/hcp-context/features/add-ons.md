# Add-ons Feature

## Problem
Pros leave money on the table by not offering additional services, warranties, and upgrades during job completion.

## Solution
Enable pros to create and offer add-ons, upsell prompts, and service bundles that increase revenue per job.

## Scope
**Included:**
- Add-on catalog management
- Upsell prompts during jobs
- Warranty packages
- Service upgrades
- Add-on pricing and bundles

**Excluded:**
- Automated upsell recommendations
- Customer preference learning
- Add-on subscription management

## Dependencies
- **Depends on:** Job Scheduling (for job context), Invoicing (for billing)
- **Depended on by:** Reporting (for add-on revenue analytics)

## Success Criteria
- Add-ons can be created and managed
- Upsell prompts appear at appropriate job stages
- Add-on revenue is tracked separately
- Bundles provide pricing discounts

## Functional Requirements

### FR1: Add-on Catalog

#### User Story
As a pro, I want to manage my add-on catalog so that I can offer consistent upsells.

#### Acceptance Criteria
| Field | Description |
|-------|-------------|
| Add-on name | Name of the additional service |
| Description | What the add-on includes |
| Price | Additional charge amount |
| Category | Type of add-on (service, warranty, upgrade) |

#### Related Prompts
- `[Historical]` "Create add-on catalog management for upselling"

### FR2: Stage Contexts

#### User Story
As an admin, I want stage-specific content so that pros receive appropriate guidance based on their add-on adoption.

#### Acceptance Criteria
| Stage | Content Focus |
|-------|---------------|
| Not Attached | Benefit messaging: "Increase revenue with service add-ons" |
| Attached | Onboarding items: Create first add-on, set pricing |
| Activated | Onboarding items: Configure upsell prompts, create bundles |
| Engaged | Add-on performance analytics, optimization strategies |

#### Related Prompts
- `[Historical]` "Define stage contexts for add-ons feature"

## Open Questions/Unknowns
- Should add-ons have inventory tracking?
- How should we handle add-on bundling rules?
