# Planning Mode System

> **Status**: In Development
> **Category**: Component
> **Last Updated**: 2025-01-17

## Overview

The Planning Mode System is a meta-feature that enables specification viewing, feedback collection, and status tracking for all plannable elements in the application. It transforms the prototype into a product direction communication tool optimized for AI-assisted development.

## Purpose

Modern development increasingly relies on LLMs for coding assistance. The Planning Mode System:
- Organizes the codebase for long-term LLM-based development
- Co-locates spec documents with code
- Enables stakeholder feedback collection
- Tracks release status per component/feature

## Key Features

- **Mode Toggle**: Switch between Demo Mode (normal) and Planning Mode in the header
- **Info Icons**: Appear on all plannable elements when in Planning Mode
- **Planning Modal**: 3-tab modal for each element (Spec, Feedback, Status)
- **Feedback Persistence**: Feedback stored in localStorage
- **Plannable Registry**: Central registry of all elements

## User Stories

- As a developer, I want to see specs for any element so that I understand its purpose
- As a stakeholder, I want to submit feedback on any element so that my input is captured
- As a PM, I want to see release status so that I understand project state

## Data Model

```typescript
// From /src/planning/types.ts
type PlannableCategory = 'view' | 'page' | 'modal' | 'component' | 'feature';
type ReleaseStatus = 'shipped' | 'in-development' | 'planned' | 'proposed' | 'prototype';

interface PlannableElement {
  id: PlannableId;
  name: string;
  category: PlannableCategory;
  specPath: string;              // Path to markdown spec
  status: ReleaseStatus;
  releaseDate?: string;
  releaseNotes?: string;
  owners?: string[];
  dependencies?: PlannableId[];
  tags?: string[];
}

interface PlanningFeedback {
  id: string;
  elementId: PlannableId;
  elementName: string;
  feedback: string;
  submittedAt: string;
  submittedBy?: string;
}
```

## Dependencies

- None (this is a foundational system)

## File Structure

```
src/planning/
├── index.ts                       # Public exports
├── types.ts                       # Type definitions
├── context/
│   └── PlanningContext.tsx        # React context and provider
├── components/
│   ├── PlanningModeToggle.tsx     # Header toggle
│   ├── PlanningWrapper.tsx        # Info icon wrapper
│   └── PlanningModal.tsx          # Modal with 3 tabs
└── registry/
    └── plannableRegistry.ts       # Central element registry

src/specs/
├── _template.md                   # Spec template
├── views/                         # View specs
├── admin/                         # Admin page specs
├── features/                      # Feature specs
├── modals/                        # Modal specs
└── components/                    # Component specs
```

## UI/UX Specifications

### Mode Toggle
- Located in AppBar header
- Shows "Demo" or "Planning" with icon
- Persists to localStorage

### Info Icons
- Appear on all wrapped elements when in Planning Mode
- Blue circular button with info icon
- Positioned top-right by default (configurable)

### Planning Modal
- **Spec Tab**: Renders markdown spec file
- **Feedback Tab**: Form with element ID, name, feedback text, history
- **Status Tab**: Release status, date, owners, dependencies, tags

## Implementation Notes

- Use `<PlanningWrapper elementId="xxx">` to wrap elements
- Use `<PlanningInfoButton elementId="xxx" />` for inline placement
- Register new elements in `plannableRegistry.ts`
- Create spec files at `/src/specs/{specPath}`

## Adding New Plannable Elements

1. Add entry to `plannableRegistry.ts`:
```typescript
plannableRegistry.set(
  'element-id',
  createPlannableElement('element-id', 'Element Name', 'category', 'path/to/spec.md', 'status', {
    releaseDate: 'Q1 2025',
    owners: ['Team'],
    tags: ['tag1', 'tag2'],
  })
);
```

2. Create spec file at `/src/specs/path/to/spec.md`

3. Wrap component:
```tsx
<PlanningWrapper elementId="element-id">
  <YourComponent />
</PlanningWrapper>
```

## Future Enhancements

- [ ] Export feedback to JSON/CSV
- [ ] Sync feedback to external system
- [ ] Search across all specs
- [ ] Diff view for spec changes
- [ ] Collaborative spec editing

## Open Questions

- Should specs be fetched from a CMS instead of local files?
- How should we handle spec versioning?

---

*LLM INSTRUCTIONS: When adding new views, pages, modals, or features, always register them in plannableRegistry.ts and create a corresponding spec file. Use the _template.md as a starting point.*
