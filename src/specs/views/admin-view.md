# Admin View

> **Status**: Prototype
> **Category**: View
> **Last Updated**: 2025-01-17

## Overview

The Admin View is the internal content management interface for the onboarding framework. It allows product managers and content administrators to define and manage features, navigation resources, Calendly call types, onboarding items, and AI tools.

## Purpose

Product teams need a centralized place to manage the onboarding content that powers all four customer-facing experiences (Portal, Frontline, Chat, and the Pro app). The Admin View provides this centralized management capability with a user-friendly interface.

## Key Features

- **Feature Management**: Define features and configure all four adoption stages (Not Attached, Attached, Activated, Engaged)
- **Navigation Management**: Create and manage navigation resources (pages, modals, videos, help articles, external links, tours)
- **Calls Management**: Configure Calendly call types for scheduling
- **Onboarding Items**: Define centralized onboarding item definitions
- **Tools Management**: Configure MCP tools for AI assistance (planned)

## User Stories

- As a product manager, I want to define feature stage contexts so that pros see relevant content based on their adoption stage
- As a content admin, I want to manage navigation resources so that all experiences show consistent links
- As a product manager, I want to configure onboarding items so that reps and pros can track progress

## Data Model

```typescript
// Key types from /src/types/onboarding.ts
interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  icon: string;
  version: string;
  stages: {
    notAttached: StageContext;
    attached: StageContext;
    activated: StageContext;
    engaged: StageContext;
  };
}

interface NavigationItem {
  slugId?: string;
  name: string;
  status?: NavigationStatus;
  navigationType: NavigationType;
  typeData?: NavigationTypeData;
  contextSnippets?: ContextSnippet[];
  prompt?: string;
  tools?: McpTool[];
}
```

## Dependencies

- **OnboardingContext**: Uses the onboarding context for feature data and mutations
- **Feature data files**: Reads from /src/data/features/*.ts

## UI/UX Specifications

### Layout
- Left sidebar with navigation tabs (Features, Navigation, Calls, Onboarding Items, Tools)
- Main content area that changes based on selected tab
- Full-width modals for editing

### Interactions
- Click sidebar item to switch views
- Click table row to open edit modal
- Delete button on each row for removal

### States
- **Loading**: Skeleton loaders while data loads
- **Empty**: Empty state message with "Add New" CTA
- **Error**: Toast notifications for errors

## Implementation Notes

- Located at `/src/views/admin/AdminView.tsx`
- Large component (~3000+ lines) - consider splitting into sub-components
- Edit modals have 4 tabs: Basic Info, Important Context, AI Config, JSON Payload
- Uses Material UI components throughout

## Future Enhancements

- [ ] Split into smaller components for better maintainability
- [ ] Add search/filter functionality to tables
- [ ] Add bulk operations (delete, duplicate)
- [ ] Add version history for features
- [ ] Add import/export functionality

## Open Questions

- Should feature editing be split into a separate route?
- How should we handle concurrent editing conflicts?

---

*LLM INSTRUCTIONS: This view is the main content management interface. When adding new content types, follow the existing patterns: table view with edit modal, 4-tab modal structure, delete affordance per row.*
