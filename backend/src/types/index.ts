// =============================================================================
// BACKEND TYPE DEFINITIONS
// Mirrors frontend types but for backend use
// =============================================================================

export type FeatureId =
  | 'invoicing'
  | 'payments'
  | 'automated-comms'
  | 'scheduling'
  | 'estimates'
  | 'csr-ai'
  | 'reviews'
  | 'account-setup'
  | 'customers'
  | 'add-ons'
  | 'service-plans'
  | 'online-booking'
  | 'reporting'
  | 'business-setup'
  | 'jobs'
  | 'employees';

// HP-5118: 3 states (removing 'engaged' from original 4-state model)
export type AdoptionStage = 'not_attached' | 'attached' | 'activated';

export type FeatureReleaseStatus = 'draft' | 'published' | 'archived';

export type NavigationType =
  | 'hcp_navigate'
  | 'hcp_modal'
  | 'hcp_video'
  | 'hcp_help'
  | 'hcp_external'
  | 'hcp_tour';

export type NavigationStatus = 'published' | 'archived' | 'draft';

export interface NavigationTypeData {
  pagePath?: string;
  modalPath?: string;
  modalId?: string;
  videoUrl?: string;
  videoDurationSeconds?: number;
  videoThumbnail?: string;
  helpArticleUrl?: string;
  helpArticleId?: string;
  externalUrl?: string;
  appcueId?: string;
  tourName?: string;
}

export interface ContextSnippet {
  id: string;
  title: string;
  content: string;
}

export interface NavigationItem {
  slugId?: string;
  name: string;
  status?: NavigationStatus;
  navigationType: NavigationType;
  typeData?: NavigationTypeData;
  contextSnippets?: ContextSnippet[];
  prompt?: string;
  description: string;
  url: string;
}

export type CalendlyTeam = 'sales' | 'onboarding' | 'support';
export type CalendlyStatus = 'published' | 'archived' | 'draft';

export interface CalendlyLink {
  slugId?: string;
  name: string;
  status?: CalendlyStatus;
  team: CalendlyTeam;
  eventType?: string;
  url: string;
  contextSnippets?: ContextSnippet[];
  prompt?: string;
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

export type OnboardingItemType = 'in_product' | 'rep_facing';
export type OnboardingItemStatus = 'published' | 'archived' | 'draft';

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

export interface CompletionApi {
  eventName: string;
  endpoint?: string;
  description: string;
}

export type CompletionOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'exists' | 'not_exists';

export interface CompletionCondition {
  variable: string;
  operator: CompletionOperator;
  value?: number | string | boolean;
  description: string;
}

export interface OnboardingSubItem {
  id: string;
  title: string;
}

export interface OnboardingItemDefinition {
  id: string;
  title: string;
  status?: OnboardingItemStatus;
  type: OnboardingItemType;
  completionApi?: CompletionApi;
  completionCondition?: CompletionCondition;
  repInstructions?: string;
  labels?: string[];
  category?: OnboardingCategoryId;
  subItems?: OnboardingSubItem[];
  contextSnippets?: ContextSnippet[];
  prompt?: string;
  tools?: McpTool[];
  navigation?: NavigationItem[];
  calendlyTypes?: CalendlyLink[];
  estimatedMinutes?: number;
  actionUrl?: string;
  points?: number;
  description: string;
}

// =============================================================================
// HP-5118 COMPLETION STEP (new schema)
// =============================================================================

/**
 * Completion Step - HP-5118 spec
 * Represents a step in a feature's activation journey.
 */
export interface CompletionStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  type: 'one_off' | 'dynamic';
  business_rule: string;
  action?: {
    type: 'navigate' | 'modal' | 'external';
    url: string;
  };
  ai_context?: {
    prompt: string;
    tools: string[];
  };
}

export interface OnboardingItemAssignment {
  itemId: string;
  required: boolean;
  stageSpecificNote?: string;
}

export interface AccessCondition {
  variable: string;
  negated: boolean;
}

export interface AccessConditionRule {
  operator: 'AND' | 'OR' | 'NONE';
  conditions: AccessCondition[];
}

export interface StageContext {
  accessConditions: AccessConditionRule;
  onboardingItems: OnboardingItemAssignment[];
  contextSnippets: ContextSnippet[];
  navigation: NavigationItem[];
  calendlyTypes: CalendlyLink[];
  prompt: string;
  tools: McpTool[];
}

export interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  icon: string;
  version: string;
  releaseStatus?: FeatureReleaseStatus;
  stages: {
    notAttached: StageContext;
    attached: StageContext;
    activated: StageContext;
  };
  // HP-5118 new fields
  value_statement?: string;
  feature_key?: string;
  permissions_required?: string[];
  call_to_book_url?: string;
  sell_page_url?: string;
  completion_steps?: CompletionStep[];
}

// Pro Account types
export type BusinessType = 'plumber' | 'electrician' | 'hvac' | 'landscaper' | 'cleaning' | 'general';
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

export interface FeatureStatus {
  stage: AdoptionStage;
  attachedAt?: string;
  activatedAt?: string;
  completedTasks: string[];
  usageCount: number;
  rank?: number;
}

export interface WeeklyPlanItem {
  itemId: string;
  order: number;
}

export interface WeeklyPlan {
  week1: WeeklyPlanItem[];
  week2: WeeklyPlanItem[];
  week3: WeeklyPlanItem[];
  week4: WeeklyPlanItem[];
}

export interface ProAccount {
  id: string;
  companyName: string;
  ownerName: string;
  businessType: BusinessType;
  plan: PlanTier;
  goal: ProGoal;
  createdAt: string;
  currentWeek: 1 | 2 | 3 | 4;
  featureStatus: Record<FeatureId, FeatureStatus>;
  weeklyPlan?: WeeklyPlan;
  completedItems?: string[];

  // Pro Data (Pro Facets) fields
  billingStatus?: BillingStatus;
  businessId?: string;  // UUID
  customerStatusDisplayName?: CustomerStatusDisplayName;
  fraudStatus?: FraudStatus;
  industry?: string;  // Raw industry value
  industryStandardized?: string;  // Standardized industry name
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

// API Response types
export interface OnboardingContext {
  pro: ProAccount;
  features: FeatureStateResult[];
  nextSteps: OnboardingItemDefinition[];
  weeklyPlan?: WeeklyPlan;
}

export interface FeatureStateResult {
  featureId: FeatureId;
  state: AdoptionStage;
  completedSteps: string[];
  pendingSteps: OnboardingItemAssignment[];
  context: StageContext;
}
