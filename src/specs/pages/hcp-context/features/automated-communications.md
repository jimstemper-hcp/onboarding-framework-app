# Automated Communications Feature

## Problem
Pros spend too much time on repetitive customer communications and miss important touchpoints like appointment reminders and follow-ups.

## Solution
Enable automated messaging for appointment reminders, on-my-way notifications, follow-ups, and review requests, saving time and improving customer experience.

## Scope
**Included:**
- Appointment reminders (SMS/Email)
- On-my-way notifications
- Follow-up messages
- Review request automation
- Custom message templates

**Excluded:**
- Marketing campaigns
- Newsletter functionality
- Voice automation

## Dependencies
- **Depends on:** Job Scheduling (for appointment data), Customers (for contact preferences)
- **Depended on by:** Reviews (for review request automation)

## Success Criteria
- Reminders are sent on schedule
- Templates can be customized
- Delivery status is tracked
- Opt-outs are respected

## Functional Requirements

### FR1: Appointment Reminders

#### User Story
As a pro, I want automatic reminders sent so that customers don't forget appointments.

#### Acceptance Criteria
| Reminder Type | Default Timing |
|---------------|----------------|
| SMS | 24 hours before |
| Email | 48 hours before |
| Same-day | Morning of appointment |

#### Related Prompts
- `[Historical]` "Create automated appointment reminder system"

### FR2: Stage Contexts

#### User Story
As an admin, I want stage-specific content so that pros receive appropriate guidance based on their automation adoption.

#### Acceptance Criteria
| Stage | Content Focus |
|-------|---------------|
| Not Attached | Benefit messaging: "Save time with automated customer messaging" |
| Attached | Onboarding items: Enable appointment reminders, customize templates |
| Activated | Onboarding items: Set up review requests, configure follow-ups |
| Engaged | Message performance analytics, A/B testing guidance |

#### Related Prompts
- `[Historical]` "Define stage contexts for automated communications feature"

## Open Questions/Unknowns
- Should we support MMS with images?
- How should we handle delivery failures?
