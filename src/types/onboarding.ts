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
  | 'reviews'
  // New features for Frontline Onboarding Plan:
  | 'account-setup'
  | 'customers'
  | 'add-ons'
  | 'service-plans'
  | 'online-booking'
  | 'reporting'
  // Core features for published release:
  | 'business-setup'
  | 'jobs'
  | 'employees';

/**
 * Release status for features in @HCP Context Manager.
 * - draft: Feature does NOT appear in any user-facing part of the application
 * - published: Feature DOES appear in user-facing parts of the application
 * - archived: Feature does NOT appear in any user-facing part of the application
 */
export type FeatureReleaseStatus = 'draft' | 'published' | 'archived';

export type AdoptionStage = 'not_attached' | 'attached' | 'activated' | 'engaged';

// -----------------------------------------------------------------------------
// ONBOARDING CATEGORY TYPES (for Frontline Onboarding Plan)
// -----------------------------------------------------------------------------

export type OnboardingCategoryId =
  | 'account-setup'
  | 'the-basics'
  | 'add-ons'
  | 'estimates'
  | 'jobs'
  | 'invoicing'
  | 'service-plans'
  | 'additional-tools'
  | 'reporting';

export interface OnboardingSubItem {
  id: string;
  title: string;
}

export interface OnboardingCategory {
  id: OnboardingCategoryId;
  label: string;
  icon: string;
}

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
  category?: OnboardingCategoryId;  // Primary category for Onboarding Plan
  subItems?: OnboardingSubItem[];   // Nested sub-items

  // Context for AI/LLM (first two are "LLM Description" and "Value Statement")
  contextSnippets?: ContextSnippet[];
  prompt?: string;
  tools?: McpTool[];

  // Navigation links (pages, articles, videos, etc.) - same as features
  navigation?: NavigationItem[];

  // Calendly event types for scheduling calls - same as features
  calendlyTypes?: CalendlyLink[];

  // Additional metadata
  estimatedMinutes?: number;
  actionUrl?: string;          // Where to go to complete this item
  points?: number;             // Point value for completion (25, 50, 75, or 100)

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
// WEEKLY PLAN TYPES
// -----------------------------------------------------------------------------

/**
 * A single item in a weekly plan, referencing an onboarding item.
 */
export interface WeeklyPlanItem {
  itemId: string;  // References OnboardingItemDefinition.id
  order: number;   // Display order within the week
}

/**
 * A 4-week onboarding plan structure.
 * Each week contains a list of onboarding items to complete.
 */
export interface WeeklyPlan {
  week1: WeeklyPlanItem[];
  week2: WeeklyPlanItem[];
  week3: WeeklyPlanItem[];
  week4: WeeklyPlanItem[];
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
  operator: 'AND' | 'OR' | 'NONE';
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
  releaseStatus?: FeatureReleaseStatus; // Controls visibility in user-facing parts of the app
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

// Pro Data (Pro Facets) types from the database
export type BillingStatus = 'trial_expired' | 'enrolled' | 'unknown' | 'unenrolled' | 'trial';

export type FraudStatus = 'risk_review_approved' | 'risk_review_denied' | 'risk_review_in_progress' | 'unknown';

export type IndustryType = 'Mechanical' | 'One-time' | 'Recurring';

export type LeadStatus =
  | 'database'
  | 'demo_attended'
  | 'demo_booked'
  | 'demo_missed'
  | 'in_progress_sale'
  | 'independent_trial'
  | 'internal_account'
  | 'not_target_customer'
  | 'sales_and_trial'
  | 'sdr_assigned'
  | 'spam'
  | 'stop_outreach';

export type OrganizationBinSize = '0 to 1' | '2 to 5' | '6 to 10' | '11+';

export type OrganizationStatus =
  | 'canceled_former_customer'
  | 'enrolled_cancel_requested'
  | 'enrolled_current_customer'
  | 'enrolled_under_review_billing'
  | 'enrolled_under_review_risk'
  | 'excluded_internal_account'
  | 'terminated_billing_reason'
  | 'terminated_risk_reason'
  | 'unknown';

export type CustomerStatusDisplayName =
  | 'Canceled: Former Customer'
  | 'Enrolled: Cancel Requested'
  | 'Enrolled: Current Customer'
  | 'Enrolled: Under Review Billing'
  | 'Enrolled: Under Review Risk'
  | 'Excluded: Internal Account'
  | 'Excluded: Internal Lead'
  | 'Excluded: Not Target Customer'
  | 'Excluded: Spam'
  | 'Excluded: Stop Outreach'
  | 'Prospect: Database'
  | 'Prospect: SDR Assigned'
  | 'Sale-in-Progress: Demo Attended'
  | 'Sale-in-Progress: Demo Booked'
  | 'Sale-in-Progress: Demo Missed'
  | 'Sale-in-Progress: Independent Trial'
  | 'Sale-in-Progress: Sales'
  | 'Sale-in-Progress: Sales + Trial'
  | 'Terminated: Billing Reason'
  | 'Terminated: Risk Reason'
  | 'Unknown';

export type RetentionStatus =
  | 'billing_retention_in_progress'
  | 'billing_retention_lost'
  | 'billing_retention_saved'
  | 'cancellation_retention_in_progress'
  | 'cancellation_retention_lost'
  | 'cancellation_retention_saved'
  | 'unknown';

export type Segment =
  | '1' | '1A' | '1B' | '1C' | '1D'
  | '2' | '2A' | '2B' | '2C' | '2D'
  | '3' | '3A' | '3B' | '3C' | '3D'
  | '4' | '4A' | '4B' | '4C' | '4D'
  | 'A' | 'B' | 'C' | 'D';

export type PainPoint =
  | 'Hiring employees'
  | 'Training employees'
  | 'Managing employees'
  | 'Employee communication'
  | 'Customer communications'
  | 'Not enough jobs'
  | 'Selling effectively'
  | 'Collecting my money'
  | 'Knowing my numbers'
  | 'Managing my schedule'
  | 'Managing my costs'
  | 'Too many apps'
  | 'Too much admin work'
  | 'Need business help & coaching';

// Standardized industry list from Pro Data
export type IndustryStandardized =
  | 'Accountant'
  | 'Air Duct Cleaning'
  | 'Alternative Therapy'
  | 'Appliances'
  | 'Appraisal'
  | 'Audio & TV'
  | 'Automotive'
  | 'Baby Proof'
  | 'Barber'
  | 'Business Services'
  | 'Cabinetry'
  | 'Carpet Cleaning'
  | 'Carpet Repair'
  | 'Caulking & Sealants'
  | 'Commercial and Industrial Equipment'
  | 'Concrete & Asphalt'
  | 'Construction & Remodels'
  | 'Cooking'
  | 'Credit Counselor'
  | 'Deck & Patio'
  | 'Demolition'
  | 'Device Repair'
  | 'Document Storage & Destruction'
  | 'Doors'
  | 'Drywall'
  | 'Electrical'
  | 'Farming'
  | 'Fencing'
  | 'Financial Planner'
  | 'Fireplace & Chimney'
  | 'Fitness'
  | 'Fleets & Trucks'
  | 'Flooring'
  | 'Furniture & Upholstery'
  | 'Garage'
  | 'General Contractor'
  | 'Glass'
  | 'Graphics & Printing'
  | 'Gutters'
  | 'Handyman'
  | 'Health & Beauty'
  | 'Heating & Air Conditioning'
  | 'Home Builder'
  | 'Home Cleaning'
  | 'Home Inspection'
  | 'Install & Assemble'
  | 'Insurance'
  | 'Janitorial'
  | 'Junk Removal'
  | 'Landscaping & Lawn'
  | 'Laundry'
  | 'Lighting'
  | 'Locksmith'
  | 'Manufacturing'
  | 'Marine Services'
  | 'Massage'
  | 'Mechanical Contractor'
  | 'Medical'
  | 'Misc Mechanical'
  | 'Mortgage Broker'
  | 'Moving'
  | 'Music & Singing'
  | 'Natural Stone'
  | 'Neighborhood Chores'
  | 'Notary'
  | 'Organization & Interior Design'
  | 'Other'
  | 'Outdoor Activities'
  | 'Painting'
  | 'Parties'
  | 'Pest Control'
  | 'Pets'
  | 'Photography'
  | 'Plumbing'
  | 'Pool & Spa'
  | 'Power Wash'
  | 'Property Manager'
  | 'Real Estate'
  | 'Real Estate Team'
  | 'Regulatory & Environmental'
  | 'Restaurant'
  | 'Restoration'
  | 'Roof & Attic'
  | 'Rug Cleaning'
  | 'Security'
  | 'Sewer & Septic'
  | 'Showing Coordinator'
  | 'Siding'
  | 'Smart Home'
  | 'Snow Removal'
  | 'Solar & Energy'
  | 'Specialty Contractor'
  | 'Subcontractor'
  | 'Tech Help'
  | 'Tile & Grout'
  | 'Transportation'
  | 'Tree Services'
  | 'Tutoring'
  | 'Warehousing and Storage'
  | 'Water Heater'
  | 'Water Services'
  | 'Water Treatment'
  | 'Well Pumps'
  | 'Wildlife Control'
  | 'Window & Exterior Cleaning'
  | 'Wine';

export interface FeatureStatus {
  stage: AdoptionStage;
  attachedAt?: string;
  activatedAt?: string;
  engagedAt?: string;
  completedTasks: string[]; // Task IDs
  usageCount: number;
  rank?: number; // Per-pro ranking (lower = higher priority)
}

/**
 * A ProAccount represents a home service professional using Housecall Pro.
 * Tracks their plan, business type, and progress on each feature.
 * Includes Pro Data (Pro Facets) fields for core business information.
 */
export interface ProAccount {
  id: string;
  companyName: string;
  ownerName: string;
  businessType: BusinessType;
  plan: PlanTier;
  goal: ProGoal;  // Maps to company_goal in Pro Data
  createdAt: string;
  currentWeek: 1 | 2 | 3 | 4;  // Weeks since enrolling in paid plan (1-4)
  featureStatus: Record<FeatureId, FeatureStatus>;
  weeklyPlan?: WeeklyPlan;  // Custom weekly onboarding plan
  completedItems?: string[];  // Global list of completed onboarding item IDs

  // Pro Data (Pro Facets) fields
  billingStatus?: BillingStatus;
  businessId?: string;  // UUID
  customerStatusDisplayName?: CustomerStatusDisplayName;
  fraudStatus?: FraudStatus;
  industry?: string;  // Raw industry value
  industryStandardized?: IndustryStandardized;
  industryType?: IndustryType;
  leadStatus?: LeadStatus;
  organizationBinSize?: OrganizationBinSize;
  organizationSize?: number;
  organizationStatus?: OrganizationStatus;
  organizationUuid?: string;  // UUID
  painPoints?: PainPoint[];
  retentionStatus?: RetentionStatus;
  segment?: Segment;
  salesforceAccountId?: string;
  salesforceLeadId?: string;
  techReadiness?: boolean;
}

// -----------------------------------------------------------------------------
// VIEW TYPES
// -----------------------------------------------------------------------------

export type ViewType = 'admin' | 'frontline' | 'portal' | 'chat' | 'sample-pros';

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

  // Chat integration - pending prompt to send when chat view opens
  pendingChatPrompt: string | null;

  // Chat drawer state
  isChatDrawerOpen: boolean;
}

export interface OnboardingContextActions {
  // Navigation
  setCurrentView: (view: ViewType) => void;

  // Selection
  selectPro: (proId: string | null) => void;
  selectFeature: (featureId: FeatureId | null) => void;
  setActivePro: (proId: string) => void;

  // Chat integration
  openChatWithPrompt: (prompt: string) => void;
  clearPendingChatPrompt: () => void;

  // Chat drawer controls
  openChatDrawer: () => void;
  closeChatDrawer: () => void;
  toggleChatDrawer: () => void;

  // Pro progress mutations
  completeTask: (proId: string, featureId: FeatureId, taskId: string) => void;
  uncompleteTask: (proId: string, featureId: FeatureId, taskId: string) => void;
  setFeatureStage: (proId: string, featureId: FeatureId, stage: AdoptionStage) => void;
  incrementUsage: (proId: string, featureId: FeatureId) => void;

  // Pro CRUD mutations (for Sample Pros view)
  addPro: (pro: ProAccount) => void;
  updatePro: (pro: ProAccount) => void;
  deletePro: (proId: string) => void;
  updateProFeatureStatus: (proId: string, featureId: FeatureId, status: FeatureStatus) => void;
  updateProWeeklyPlan: (proId: string, weeklyPlan: WeeklyPlan) => void;
  updateProCompletedItems: (proId: string, completedItems: string[]) => void;

  // Feature mutations (for Admin view)
  updateFeature: (feature: Feature) => void;
  resetFeatures: () => void;

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
