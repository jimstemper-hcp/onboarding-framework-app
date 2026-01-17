// =============================================================================
// PLANNING MODE - TYPE DEFINITIONS
// =============================================================================
// This file defines the data model for the planning mode system.
// Planning mode allows viewing specs, collecting feedback, and tracking status
// for any component/page/feature in the application.
// =============================================================================

/**
 * Unique identifier for a plannable element.
 * Convention: kebab-case, prefixed by category
 * Examples: "view-portal", "page-admin-navigation", "modal-feature-edit"
 */
export type PlannableId = string;

/**
 * Categories of plannable elements for organization and filtering.
 */
export type PlannableCategory =
  | 'view'       // Main views (Portal, Admin, Frontline, Chat)
  | 'page'       // Sub-pages within views (Admin > Navigation, Calls, etc.)
  | 'modal'      // Modal dialogs (Feature Edit, Navigation Edit, etc.)
  | 'component'  // Reusable components (ViewSwitcher, etc.)
  | 'feature';   // Product features (Invoicing, Payments, etc.)

/**
 * Release status for the element.
 */
export type ReleaseStatus =
  | 'shipped'           // Already in production
  | 'in-development'    // Currently being built
  | 'planned'           // On roadmap, not started
  | 'proposed'          // Under consideration
  | 'prototype';        // Demo/prototype only

/**
 * A plannable element registration.
 * This is what gets registered in the plannable registry.
 *
 * LLM INSTRUCTIONS:
 * - When adding a new view/component/feature, register it here
 * - Use consistent ID naming: "{category}-{name}" in kebab-case
 * - Create a corresponding spec file at the specPath location
 * - Set appropriate status and release info
 */
export interface PlannableElement {
  // Core identity
  id: PlannableId;
  name: string;                        // Human-readable name
  category: PlannableCategory;

  // Documentation
  specPath: string;                    // Path to markdown spec file (relative to /src/specs/)

  // Status
  status: ReleaseStatus;
  releaseDate?: string;                // ISO date string or "Q1 2025" style
  releaseNotes?: string;               // Brief notes about the release

  // Optional metadata
  owners?: string[];                   // Team/person responsible
  dependencies?: PlannableId[];        // Other elements this depends on
  tags?: string[];                     // Searchable tags
}

/**
 * Feedback submission for a plannable element.
 */
export interface PlanningFeedback {
  id: string;                          // UUID for the feedback
  elementId: PlannableId;              // Which element this is about
  elementName: string;                 // Human-readable name (for display)
  feedback: string;                    // The feedback content
  submittedAt: string;                 // ISO timestamp
  submittedBy?: string;                // Optional author name
}

/**
 * Active tab in the planning modal.
 */
export type PlanningTab = 'spec' | 'feedback' | 'status';

/**
 * Planning mode context state.
 */
export interface PlanningModeState {
  // Mode toggle
  isPlanningMode: boolean;

  // Currently viewing
  activeElementId: PlannableId | null;
  isModalOpen: boolean;
  activeTab: PlanningTab;

  // Feedback (persisted to localStorage)
  feedbackItems: PlanningFeedback[];
}

/**
 * Planning mode context actions.
 */
export interface PlanningModeActions {
  // Mode toggle
  togglePlanningMode: () => void;
  setPlanningMode: (enabled: boolean) => void;

  // Element inspection
  openElement: (elementId: PlannableId) => void;
  closeModal: () => void;
  setActiveTab: (tab: PlanningTab) => void;

  // Feedback
  submitFeedback: (elementId: PlannableId, elementName: string, feedback: string, submittedBy?: string) => void;
  getFeedbackForElement: (elementId: PlannableId) => PlanningFeedback[];
  clearFeedback: (feedbackId: string) => void;

  // Registry access
  getElement: (elementId: PlannableId) => PlannableElement | undefined;
  getAllElements: () => PlannableElement[];
  getElementsByCategory: (category: PlannableCategory) => PlannableElement[];
}

/**
 * Combined context value type.
 */
export type PlanningModeContextValue = PlanningModeState & PlanningModeActions;
