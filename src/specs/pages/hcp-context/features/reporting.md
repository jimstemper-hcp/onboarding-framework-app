# Reporting Feature

## Problem
Pros make business decisions based on intuition rather than data because they lack accessible analytics and insights.

## Solution
Provide customizable reports and dashboards that give pros visibility into their business performance, enabling data-driven decisions.

## Scope
**Included:**
- Pre-built report templates
- Custom report builder
- Dashboard widgets
- Export capabilities
- Scheduled report delivery

**Excluded:**
- Real-time analytics
- Predictive analytics
- Competitive benchmarking

## Dependencies
- **Depends on:** All data-generating features (Jobs, Invoices, Payments, Customers, etc.)
- **Depended on by:** None (consumption endpoint)

## Success Criteria
- Standard reports are available out-of-box
- Custom reports can be created
- Reports can be exported
- Scheduled reports are delivered on time

## Functional Requirements

### FR1: Pre-built Reports

#### User Story
As a pro, I want access to standard reports so that I can quickly view key metrics.

#### Acceptance Criteria
| Report Type | Metrics Included |
|-------------|------------------|
| Revenue | Total revenue, by period, by service |
| Jobs | Job count, completion rate, average value |
| Customers | New customers, retention, lifetime value |
| Team | Performance by technician |

#### Related Prompts
- `[Historical]` "Provide standard business reports for pros"

### FR2: Stage Contexts

#### User Story
As an admin, I want stage-specific content so that pros receive appropriate guidance based on their reporting adoption.

#### Acceptance Criteria
| Stage | Content Focus |
|-------|---------------|
| Not Attached | Benefit messaging: "Make data-driven decisions with reports" |
| Attached | Onboarding items: View first report, explore dashboard |
| Activated | Onboarding items: Customize dashboard, create custom report |
| Engaged | Analytics mastery, data-driven strategies |

#### Related Prompts
- `[Historical]` "Define stage contexts for reporting feature"

## Open Questions/Unknowns
- What report templates should be included?
- How should we handle data retention for historical reports?
