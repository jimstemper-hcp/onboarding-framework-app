# Reviews Feature

## Problem
Pros struggle to build online reputation because they forget to ask for reviews or don't know how to manage them across platforms.

## Solution
Automate review requests and provide tools to monitor and respond to reviews across multiple platforms, helping pros build their online reputation.

## Scope
**Included:**
- Automated review requests
- Multi-platform review support
- Review monitoring
- Response management
- Review analytics

**Excluded:**
- Fake review generation
- Review removal services
- Competitor review monitoring

## Dependencies
- **Depends on:** Job Scheduling (for job completion triggers), Customers (for contact info), Automated Communications (for sending requests)
- **Depended on by:** Reporting (for reputation analytics)

## Success Criteria
- Review requests are sent automatically
- Reviews are aggregated from multiple platforms
- Responses can be posted from one place
- Review trends are visible

## Functional Requirements

### FR1: Automated Review Requests

#### User Story
As a pro, I want review requests sent automatically so that I don't forget to ask.

#### Acceptance Criteria
| Trigger | Behavior |
|---------|----------|
| Job completed | Send review request after delay |
| Payment received | Optional trigger for request |
| Customer satisfaction | Skip if negative feedback |

#### Related Prompts
- `[Historical]` "Create automated review request functionality"

### FR2: Stage Contexts

#### User Story
As an admin, I want stage-specific content so that pros receive appropriate guidance based on their review adoption.

#### Acceptance Criteria
| Stage | Content Focus |
|-------|---------------|
| Not Attached | Benefit messaging: "Build your reputation with customer reviews" |
| Attached | Onboarding items: Enable review requests, connect review platforms |
| Activated | Onboarding items: Customize request timing, set up alerts |
| Engaged | Reputation analytics, review response strategies |

#### Related Prompts
- `[Historical]` "Define stage contexts for reviews feature"

## Open Questions/Unknowns
- Which review platforms should we support?
- How should we handle negative reviews?
