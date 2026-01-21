# Onboarding Items Tab

## Overview
The Onboarding Items Tab provides a centralized library of all onboarding tasks that can be assigned to features and weekly plans. Each item has completion logic and can be tracked across the system.

## Key Features
- Centralized item library
- Category organization
- Completion criteria configuration
- Estimated time tracking
- Point value assignment
- Item status management

## User Stories
- As an admin, I want to define onboarding items so they're consistent everywhere
- As an admin, I want to categorize items so they're organized
- As an admin, I want to set completion logic so tracking is automated
- As an admin, I want to estimate times so users can plan
- As an admin, I want to assign point values so important items are incentivized

## UI Components
- Onboarding item data table
- Category filters
- Add/Edit modal
- Completion logic editor
- Time estimate controls
- Point value selector

## Point Value System

Each onboarding item has a point value that determines how many points a pro earns when completing the task. Points are used in the Housecall Pro Web journey view to gamify onboarding and incentivize completion of high-value actions.

### Point Tiers

| Points | Criteria | Examples |
|--------|----------|----------|
| **100** | Critical/foundational actions that generate revenue or are essential for using the platform | Create first customer, Connect payment processor, Send first invoice, Collect first payment, Create first job |
| **75** | Important engagement drivers that indicate active usage | Complete first job, Schedule first job, Enable appointment reminders, Complete training session, Setup call forwarding, Online booking, Recurring jobs |
| **50** | Good to have actions that improve the user experience | Add team member, Set business hours, Customer portal, Job templates, Checklists, Dashboard, Configure AI settings |
| **25** | Nice to have / cosmetic items or advanced settings | Add company logo, Customize message templates, Customer tags, Calendar settings, Advanced configurations |

### Point Calculation Logic

Total points for a feature are calculated as:
- **Feature milestones**: Attached (+50), Activated (+100), Engaged (+150)
- **Task completion**: Sum of each completed item's individual point value

```typescript
// Example: Pro completes "Create first customer" (100 pts) and "Add company logo" (25 pts)
// for a feature that is "attached"
totalEarned = 50 (attached) + 100 (first customer) + 25 (logo) = 175 points
```

### Assignment Guidelines

When assigning point values to new items:

1. **100 points** - Reserve for actions that:
   - Generate revenue (payments, invoices)
   - Create foundational data (first customer, first job)
   - Enable core platform capabilities (payment processor connection)

2. **75 points** - Assign to actions that:
   - Complete workflows (finish a job, send an estimate)
   - Enable automation (appointment reminders, review requests)
   - Require meaningful time investment (training sessions)
   - Drive ongoing engagement (recurring jobs, online booking)

3. **50 points** - Use for actions that:
   - Improve efficiency (templates, checklists)
   - Add team capabilities (team members, dispatching)
   - Enable self-service (customer portal)
   - Configure important settings (business hours)

4. **25 points** - Default for:
   - Cosmetic/branding items (logo, custom templates)
   - Advanced or optional settings
   - Informational/review items
   - Low-effort configuration tasks

### Default Value

Items without an explicit point value default to **25 points** via the `DEFAULT_ITEM_POINTS` constant.

## Data Dependencies
- Reads: Onboarding item definitions, categories
- Writes: Onboarding item records

## Item Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier |
| `title` | string | Display title |
| `description` | string | Full description |
| `type` | 'in_product' \| 'rep_facing' | Whether tracked automatically or by reps |
| `category` | string | Category ID for grouping |
| `points` | number | Point value (25, 50, 75, or 100) |
| `estimatedMinutes` | number | Time estimate for completion |
| `completionApi` | object | API event/endpoint for auto-tracking |
| `actionUrl` | string | Deep link to complete the action |
| `repInstructions` | string | Instructions for rep-facing items |
| `contextSnippets` | array | Value statements and guidance for reps |

## Status
Prototype - Centralized onboarding item management with point-based gamification.
