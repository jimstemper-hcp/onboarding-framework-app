// =============================================================================
// ONBOARDING FRAMEWORK - TYPE DEFINITIONS
// =============================================================================
// This file defines the data model for the centralized onboarding context
// repository. All four experiences (Admin, Frontline, Portal, Chat) use these
// types to ensure consistency across the platform.
// =============================================================================

// -----------------------------------------------------------------------------
// FEATURE IDENTIFIERS
// -----------------------------------------------------------------------------

export type FeatureId =
  | 'invoicing'
  | 'payments'
  | 'automated-comms'
  | 'scheduling'
  | 'estimates'
  | 'csr-ai'
  | 'reviews';

export type AdoptionStage = 'not_attached' | 'attached' | 'activated' | 'engaged';

// -----------------------------------------------------------------------------
// SUPPORTING TYPES
// -----------------------------------------------------------------------------

export interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'guide' | 'help-center';
}

// Navigation types for the admin UI
export type NavigationType =
  | 'hcp_sell_page'
  | 'hcp_navigate'
  | 'hcp_tours'
  | 'hcp_help_article'
  | 'hcp_video'
  | 'hcp_modal'
  | 'hcp_section_header'
  | 'hcp_training_article';

export interface NavigationItem {
  name: string;
  description: string; // LLM description
  url: string;
  navigationType: NavigationType;
}

// Context snippets for Important Context section
export interface ContextSnippet {
  id: string;
  title: string;
  content: string;
}

export interface CalendlyLink {
  name: string;
  url: string;
  team: 'sales' | 'onboarding' | 'support';
  description: string;
}

export interface McpTool {
  name: string;
  description: string;
  parameters: Record<string, {
    type: string;
    description: string;
    required?: boolean;
  }>;
}

export interface ProductPage {
  name: string;
  path: string;
  description: string;
}

export interface Video {
  title: string;
  url: string;
  durationSeconds: number;
  thumbnail?: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  actionUrl: string;
  completionEvent: string;
}

// =============================================================================
// CENTRALIZED ONBOARDING ITEMS
// =============================================================================

/**
 * Two types of onboarding items:
 * - in_product: Completion tracked via product API/events
 * - rep_facing: Manually tracked by reps (checkbox in admin panel)
 */
export type OnboardingItemType = 'in_product' | 'rep_facing';

/**
 * API completion tracking info for in_product items.
 * This is the information we get from feature teams.
 */
export interface CompletionApi {
  eventName: string;           // e.g., "customer.created", "job.completed"
  endpoint?: string;           // Optional: API endpoint to check status
  description: string;         // Human-readable: "Triggers when a customer is created"
}

/**
 * A centralized onboarding item definition.
 * These are stored in a central repository and referenced by features.
 */
export interface OnboardingItemDefinition {
  id: string;
  title: string;
  description: string;
  type: OnboardingItemType;
  // Labels for categorization and visual representation
  labels?: string[];
  // For in_product items - how we track completion
  completionApi?: CompletionApi;
  // For rep_facing items - instructions for the rep
  repInstructions?: string;
  estimatedMinutes?: number;
  actionUrl?: string;          // Where to go to complete this item
}

/**
 * When an onboarding item is assigned to a feature's stage.
 * This references the central item and adds stage-specific context.
 */
export interface OnboardingItemAssignment {
  itemId: string;              // References OnboardingItemDefinition.id
  required: boolean;           // Required vs optional for this stage
  stageSpecificNote?: string;  // Optional context for this feature's use
}

// -----------------------------------------------------------------------------
// STAGE-SPECIFIC CONTEXT TYPES
// -----------------------------------------------------------------------------

/**
 * Access condition for determining stage eligibility.
 */
export interface AccessCondition {
  variable: string; // e.g., "jobs.invoicing", "payments.processing"
  negated: boolean; // true = "does NOT have access", false = "has access"
}

export interface AccessConditionRule {
  operator: 'AND' | 'OR';
  conditions: AccessCondition[];
}

/**
 * Base stage context - all stages share these fields.
 * This ensures consistency across all four adoption stages.
 */
export interface StageContext {
  // Access conditions that determine when a pro is in this stage
  accessConditions: AccessConditionRule;
  // Onboarding items from the central repository
  onboardingItems: OnboardingItemAssignment[];
  // Important context snippets (value prop, tips, etc.)
  contextSnippets: ContextSnippet[];
  // Navigation links (pages, articles, videos, etc.)
  navigation: NavigationItem[];
  // Calendly event types for scheduling calls
  calendlyTypes: CalendlyLink[];
  // AI prompt for this stage
  prompt: string;
  // MCP tools available for this stage
  tools: McpTool[];
}

// Type aliases for each stage - they all use the same structure now
export type NotAttachedContext = StageContext;
export type AttachedContext = StageContext;
export type ActivatedContext = StageContext;
export type EngagedContext = StageContext;

// -----------------------------------------------------------------------------
// FEATURE DEFINITION
// -----------------------------------------------------------------------------

/**
 * A Feature represents a product capability that has its own onboarding journey.
 * Each feature has context for all four adoption stages.
 */
export interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  icon: string; // MUI icon name
  version: string; // Semantic version (major.minor.patch)
  stages: {
    notAttached: NotAttachedContext;
    attached: AttachedContext;
    activated: ActivatedContext;
    engaged: EngagedContext;
  };
}

// -----------------------------------------------------------------------------
// PRO ACCOUNT & PROGRESS TRACKING
// -----------------------------------------------------------------------------

export type BusinessType =
  | 'plumber'
  | 'electrician'
  | 'hvac'
  | 'landscaper'
  | 'cleaning'
  | 'general';

export type PlanTier = 'basic' | 'essentials' | 'max';

export type ProGoal = 'growth' | 'efficiency';

export interface FeatureStatus {
  stage: AdoptionStage;
  attachedAt?: string;
  activatedAt?: string;
  engagedAt?: string;
  completedTasks: string[]; // Task IDs
  usageCount: number;
}

/**
 * A ProAccount represents a home service professional using Housecall Pro.
 * Tracks their plan, business type, and progress on each feature.
 */
export interface ProAccount {
  id: string;
  companyName: string;
  ownerName: string;
  businessType: BusinessType;
  plan: PlanTier;
  goal: ProGoal;
  createdAt: string;
  featureStatus: Record<FeatureId, FeatureStatus>;
}

// -----------------------------------------------------------------------------
// VIEW TYPES
// -----------------------------------------------------------------------------

export type ViewType = 'admin' | 'frontline' | 'portal' | 'chat';

// -----------------------------------------------------------------------------
// CONTEXT STATE & ACTIONS
// -----------------------------------------------------------------------------

export interface OnboardingContextState {
  // Data
  features: Feature[];
  pros: ProAccount[];

  // Current selections
  currentView: ViewType;
  selectedProId: string | null;
  selectedFeatureId: FeatureId | null;

  // For Portal view - which pro is "logged in"
  activeProId: string;
}

export interface OnboardingContextActions {
  // Navigation
  setCurrentView: (view: ViewType) => void;

  // Selection
  selectPro: (proId: string | null) => void;
  selectFeature: (featureId: FeatureId | null) => void;
  setActivePro: (proId: string) => void;

  // Pro progress mutations
  completeTask: (proId: string, featureId: FeatureId, taskId: string) => void;
  uncompleteTask: (proId: string, featureId: FeatureId, taskId: string) => void;
  setFeatureStage: (proId: string, featureId: FeatureId, stage: AdoptionStage) => void;
  incrementUsage: (proId: string, featureId: FeatureId) => void;

  // Feature mutations (for Admin view)
  updateFeature: (feature: Feature) => void;

  // Derived data helpers
  getFeatureById: (featureId: FeatureId) => Feature | undefined;
  getProById: (proId: string) => ProAccount | undefined;
  getProFeatureStatus: (proId: string, featureId: FeatureId) => FeatureStatus | undefined;
  getStageContext: (
    featureId: FeatureId,
    stage: AdoptionStage
  ) => NotAttachedContext | AttachedContext | ActivatedContext | EngagedContext | undefined;
}

export type OnboardingContextValue = OnboardingContextState & OnboardingContextActions;
