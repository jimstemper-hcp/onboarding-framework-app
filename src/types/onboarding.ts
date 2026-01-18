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
  | 'hcp_navigate'  // Page paths in the web product
  | 'hcp_modal'     // Modals in the product (path or modal ID)
  | 'hcp_video'     // Video links for embedding in chat
  | 'hcp_help'      // Help articles
  | 'hcp_external'  // External URLs
  | 'hcp_tour';     // Appcue tour IDs

export type NavigationStatus = 'published' | 'archived' | 'draft';

/**
 * Type-specific data for navigation items.
 * Different navigation types require different data.
 */
export interface NavigationTypeData {
  // hcp_navigate - page path in the product
  pagePath?: string;

  // hcp_modal - modal configuration
  modalPath?: string;      // Optional path that opens the modal
  modalId?: string;        // Modal identifier for programmatic opening

  // hcp_video - video embed
  videoUrl?: string;
  videoDurationSeconds?: number;
  videoThumbnail?: string;

  // hcp_help - help article
  helpArticleUrl?: string;
  helpArticleId?: string;

  // hcp_external - external URL
  externalUrl?: string;

  // hcp_tour - Appcue tour
  appcueId?: string;
  tourName?: string;
}

/**
 * A navigation resource that can be used across features and stages.
 * These are centralized and referenced by features.
 */
export interface NavigationItem {
  // Core identity
  slugId?: string;          // Unique ID (lowercase, hyphenated from name)
  name: string;
  status?: NavigationStatus;

  // Type and type-specific data
  navigationType: NavigationType;
  typeData?: NavigationTypeData;

  // Context for AI/LLM
  contextSnippets?: ContextSnippet[];  // First one defaults to "LLM Description"
  prompt?: string;
  tools?: McpTool[];

  // Legacy fields for backward compatibility
  description: string;      // LLM description (duplicates first contextSnippet)
  url: string;              // Primary URL (derived from typeData)
}

// Context snippets for Important Context section
export interface ContextSnippet {
  id: string;
  title: string;
  content: string;
}

export type CalendlyTeam = 'sales' | 'onboarding' | 'support';
export type CalendlyStatus = 'published' | 'archived' | 'draft';

/**
 * A Calendly call/meeting type that can be scheduled.
 * Used across features and stages for booking calls with pros.
 */
export interface CalendlyLink {
  // Core identity
  slugId?: string;          // Unique ID (lowercase, hyphenated from name)
  name: string;
  status?: CalendlyStatus;

  // Calendly configuration
  team: CalendlyTeam;
  eventType?: string;       // Calendly event type name
  url: string;              // Calendly booking link

  // Context for AI/LLM
  contextSnippets?: ContextSnippet[];  // First one is "LLM Description"
  prompt?: string;
  tools?: McpTool[];

  // Legacy field for backward compatibility
  description: string;      // LLM description
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

/**
 * Chat experience configuration for AI feature detection.
 * Defines how the AI should respond when detecting a user asking about
 * a specific feature at a specific adoption stage.
 */
export interface ChatExperience {
  // What the AI says when detecting this feature at this stage
  detectionResponse: string;
  // Primary action type to surface
  priorityAction: 'onboarding' | 'call' | 'navigation' | 'tip';
  // Specific prompt for the action CTA
  actionPrompt: string;
  // Button text for the call-to-action
  suggestedCta: string;
  // Optional: phrases that should trigger escalation
  escalationTriggers?: string[];
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
export type OnboardingItemStatus = 'published' | 'archived' | 'draft';

/**
 * A centralized onboarding item definition.
 * These are stored in a central repository and referenced by features.
 */
export interface OnboardingItemDefinition {
  // Core identity
  id: string;
  title: string;
  status?: OnboardingItemStatus;

  // Type and completion
  type: OnboardingItemType;
  // For in_product items - how we track completion
  completionApi?: CompletionApi;
  // For rep_facing items - instructions for the rep
  repInstructions?: string;

  // Categorization
  labels?: string[];

  // Context for AI/LLM (first two are "LLM Description" and "Value Statement")
  contextSnippets?: ContextSnippet[];
  prompt?: string;
  tools?: McpTool[];

  // Additional metadata
  estimatedMinutes?: number;
  actionUrl?: string;          // Where to go to complete this item

  // Legacy field for backward compatibility
  description: string;         // LLM description
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
  // Chat experience for AI feature detection
  chatExperience?: ChatExperience;
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
