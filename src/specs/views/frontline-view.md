# Frontline View

> **Status**: Prototype
> **Category**: View
> **Last Updated**: 2025-01-17

## Overview

The Frontline View is the rep-facing interface for managing pro onboarding. It allows customer success and onboarding reps to view pro accounts, track onboarding progress, and take actions to help pros succeed.

## Purpose

Customer-facing reps need tools to efficiently manage multiple pro accounts and guide them through onboarding. The Frontline View provides a workspace for reps to see pro status, complete rep-facing tasks, and access stage-specific context.

## Key Features

- **Pro List**: View all assigned pro accounts
- **Pro Detail**: Deep dive into individual pro progress
- **Rep Tasks**: Complete rep-facing onboarding items
- **Context Cards**: See stage-specific talking points and resources

## User Stories

- As a rep, I want to see all my assigned pros so that I can prioritize my outreach
- As a rep, I want to see what stage each pro is in so that I can provide relevant guidance
- As a rep, I want to complete rep-facing tasks so that I can track my work

## Data Model

```typescript
// Key types
interface ProAccount {
  id: string;
  companyName: string;
  ownerName: string;
  featureStatus: Record<FeatureId, FeatureStatus>;
}

interface OnboardingItemAssignment {
  itemId: string;
  required: boolean;
  stageSpecificNote?: string;
}
```

## Dependencies

- **OnboardingContext**: Gets pro list and feature data
- **Onboarding Items**: Uses centralized item definitions

## UI/UX Specifications

### Layout
- Split view: Pro list on left, detail on right
- Pro list shows status indicators and key metrics
- Detail view shows all features and their stage contexts

### Interactions
- Click pro to view details
- Check off rep-facing tasks
- Quick actions for common operations

### States
- **Loading**: Skeleton list while loading
- **No Pros**: Empty state with explanation
- **Pro Selected**: Full detail view

## Implementation Notes

- Located at `/src/views/frontline/FrontlineView.tsx`
- Designed for rep efficiency
- Shows rep-facing onboarding items prominently

## Future Enhancements

- [ ] Add pro filtering and sorting
- [ ] Add bulk actions
- [ ] Add activity history
- [ ] Add notes/comments per pro
- [ ] Add rep performance metrics

## Open Questions

- How should we handle team-based pro assignments?
- Should we integrate with external CRM?

---

*LLM INSTRUCTIONS: This view is optimized for rep efficiency. Focus on quick access to information and minimal clicks to complete tasks.*
