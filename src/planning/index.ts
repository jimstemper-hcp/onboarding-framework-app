// =============================================================================
// PLANNING MODE - PUBLIC API
// =============================================================================
// This file exports all planning mode components, hooks, and utilities.
//
// LLM INSTRUCTIONS:
// - Import from '@/planning' or '../planning' depending on your path
// - Main exports: PlanningModeProvider, usePlanningMode, PlanningWrapper
// - See individual files for detailed documentation
// =============================================================================

// Context and hooks
export { PlanningModeProvider, usePlanningMode } from './context/PlanningContext';

// Components
export { PlanningModeToggle } from './components/PlanningModeToggle';
export { PlanningWrapper, PlanningInfoButton } from './components/PlanningWrapper';
export { PlanningModal } from './components/PlanningModal';
export { PlanningDrawer, DRAWER_WIDTH } from './components/PlanningDrawer';

// Registry
export { plannableRegistry, getElementsByCategory, getElementsByStatus, getElementsByTag } from './registry/plannableRegistry';

// Types
export type {
  PlannableId,
  PlannableCategory,
  ReleaseStatus,
  PlannableElement,
  PlanningFeedback,
  PlanningTab,
  SpecViewMode,
  PageId,
  PlanningModeState,
  PlanningModeActions,
  PlanningModeContextValue,
} from './types';
