# Portal View

> **Status**: Prototype
> **Category**: View
> **Last Updated**: 2025-01-17

## Overview

The Portal View is the pro-facing onboarding dashboard that shows a professional their personalized onboarding journey. It displays features relevant to their plan and goal, with stage-specific content based on their adoption progress.

## Purpose

Home service professionals need a clear view of their onboarding progress and what features are available to them. The Portal View provides a personalized dashboard that helps pros understand what they can do, what they should do next, and how to get help.

## Key Features

- **Feature Cards**: Display all features with adoption stage indicators
- **Stage-Specific Content**: Show relevant context, tasks, and resources for current stage
- **Progress Tracking**: Visual indicators of onboarding completion
- **Quick Actions**: Easy access to next steps and scheduling calls

## User Stories

- As a pro, I want to see my onboarding progress so that I know what I've completed and what's next
- As a pro, I want to see features relevant to my plan so that I don't see features I can't use
- As a pro, I want to schedule a help call so that I can get support when stuck

## Data Model

```typescript
// Key types
interface ProAccount {
  id: string;
  companyName: string;
  ownerName: string;
  businessType: BusinessType;
  plan: PlanTier;
  goal: ProGoal;
  featureStatus: Record<FeatureId, FeatureStatus>;
}

interface FeatureStatus {
  stage: AdoptionStage;
  completedTasks: string[];
  usageCount: number;
}
```

## Dependencies

- **OnboardingContext**: Gets current pro and feature data
- **Feature definitions**: Uses stage contexts from feature definitions

## UI/UX Specifications

### Layout
- Header with pro info and selection
- Grid of feature cards
- Each card shows feature icon, name, status, and relevant actions

### Interactions
- Click feature card to expand details
- Complete tasks via checkboxes
- Schedule calls via Calendly links

### States
- **Loading**: Skeleton cards while loading
- **No Pro Selected**: Prompt to select a pro account
- **Feature Locked**: Grayed out card for unavailable features

## Implementation Notes

- Located at `/src/views/portal/PortalView.tsx`
- Uses the pro selector in the header
- Feature cards adapt content based on adoption stage
- Simulated pro accounts for demo purposes

## Future Enhancements

- [ ] Add feature search/filter
- [ ] Add gamification elements (achievements, streaks)
- [ ] Add personalized recommendations
- [ ] Add progress charts/graphs

## Open Questions

- How should we handle features across multiple plan tiers?
- Should we show all features or filter by relevance?

---

*LLM INSTRUCTIONS: This is the primary pro-facing view. Changes should focus on clarity and actionability. Pro experience is the top priority.*
