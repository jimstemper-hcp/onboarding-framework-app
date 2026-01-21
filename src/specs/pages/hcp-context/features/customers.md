# Customers Feature

## Problem
Pros lose track of customer information across spreadsheets, phones, and notes, leading to poor customer experience and missed opportunities.

## Solution
Provide CRM capabilities for managing customer relationships, including contact information, job history, and communication preferences in one centralized location.

## Scope
**Included:**
- Customer database management
- Contact information storage
- Job and payment history
- Communication preferences
- Customer tagging and segmentation

**Excluded:**
- Marketing automation
- Customer portal management
- Lead scoring

## Dependencies
- **Depends on:** None (foundational data)
- **Depended on by:** Invoicing, Job Scheduling, Automated Communications, Online Booking

## Success Criteria
- Customer records can be created and managed
- Job history is visible per customer
- Tags enable segmentation
- Communication preferences are respected

## Functional Requirements

### FR1: Customer Records

#### User Story
As a pro, I want to store customer information so that I have everything in one place.

#### Acceptance Criteria
| Field | Purpose |
|-------|---------|
| Name | Customer identification |
| Contact info | Phone, email, address |
| Service address | Where work is performed |
| Notes | Special instructions or preferences |
| Tags | Categorization for segmentation |

#### Related Prompts
- `[Historical]` "Create customer management CRM functionality"

### FR2: Stage Contexts

#### User Story
As an admin, I want stage-specific content so that pros receive appropriate guidance based on their customer management adoption.

#### Acceptance Criteria
| Stage | Content Focus |
|-------|---------------|
| Not Attached | Benefit messaging: "Keep all your customer info in one place" |
| Attached | Onboarding items: Add first customer, import existing customers |
| Activated | Onboarding items: Set up customer tags, configure preferences |
| Engaged | Customer analytics, segmentation strategies |

#### Related Prompts
- `[Historical]` "Define stage contexts for customers feature"

## Open Questions/Unknowns
- Should we support customer merging for duplicates?
- How should we handle customer data privacy requests?
