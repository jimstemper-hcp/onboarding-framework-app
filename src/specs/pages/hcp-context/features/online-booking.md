# Online Booking Feature

## Problem
Pros miss potential jobs when customers can't book outside business hours, and phone-only booking creates friction for customers who prefer self-service.

## Solution
Provide a public online booking page where customers can view available time slots and book appointments 24/7, reducing phone volume and capturing more leads.

## Scope
**Included:**
- Public booking page
- Service selection
- Time slot availability
- Instant confirmations
- Booking customization

**Excluded:**
- Multiple booking pages per service area
- Payment collection at booking
- Waitlist management

## Dependencies
- **Depends on:** Job Scheduling (for availability), Customers (for customer data)
- **Depended on by:** Automated Communications (for booking confirmations)

## Success Criteria
- Customers can book appointments online
- Availability reflects actual schedule
- Confirmations are sent immediately
- Booking page is customizable

## Functional Requirements

### FR1: Public Booking Page

#### User Story
As a customer, I want to book appointments online so that I can schedule at my convenience.

#### Acceptance Criteria
| Component | Behavior |
|-----------|----------|
| Service selection | Customer chooses service type |
| Date picker | Shows available dates |
| Time slots | Displays available times for selected date |
| Confirmation | Instant booking confirmation |

#### Related Prompts
- `[Historical]` "Create online booking page for customer self-service"

### FR2: Stage Contexts

#### User Story
As an admin, I want stage-specific content so that pros receive appropriate guidance based on their online booking adoption.

#### Acceptance Criteria
| Stage | Content Focus |
|-------|---------------|
| Not Attached | Benefit messaging: "Let customers book online anytime" |
| Attached | Onboarding items: Set up booking page, configure services |
| Activated | Onboarding items: Customize booking flow, set availability rules |
| Engaged | Booking analytics, conversion optimization |

#### Related Prompts
- `[Historical]` "Define stage contexts for online booking feature"

## Open Questions/Unknowns
- Should we support deposit collection at booking?
- How should we handle booking conflicts?
