import type { ProAccount, FeatureId, FeatureStatus, WeeklyPlan } from '../types';

// Default weekly plan used for most pros
const defaultWeeklyPlan: WeeklyPlan = {
  week1: [
    { itemId: 'create-first-customer', order: 0 },
    { itemId: 'company-profile', order: 1 },
    { itemId: 'add-company-logo', order: 2 },
    { itemId: 'add-new-customers', order: 3 },
  ],
  week2: [
    { itemId: 'create-first-estimate', order: 0 },
    { itemId: 'create-first-job', order: 1 },
    { itemId: 'send-first-invoice', order: 2 },
    { itemId: 'online-booking', order: 3 },
  ],
  week3: [
    { itemId: 'connect-payment-processor', order: 0 },
    { itemId: 'enable-appointment-reminders', order: 1 },
    { itemId: 'enable-review-requests', order: 2 },
    { itemId: 'add-employees', order: 3 },
  ],
  week4: [
    { itemId: 'pricebook', order: 0 },
    { itemId: 'service-plans-settings', order: 1 },
    { itemId: 'time-tracking', order: 2 },
    { itemId: 'custom-reports', order: 3 },
  ],
};

// Helper to create a feature status at a specific stage
const createStatus = (
  stage: FeatureStatus['stage'],
  completedTasks: string[] = [],
  usageCount = 0
): FeatureStatus => ({
  stage,
  completedTasks,
  usageCount,
  ...(stage !== 'not_attached' && { attachedAt: '2024-01-15' }),
  ...(stage === 'activated' || stage === 'engaged' ? { activatedAt: '2024-01-20' } : {}),
  ...(stage === 'engaged' ? { engagedAt: '2024-02-01' } : {}),
});

// Helper to create all feature statuses for a pro
const createAllFeatureStatuses = (
  statuses: Partial<Record<FeatureId, FeatureStatus>>
): Record<FeatureId, FeatureStatus> => {
  const defaultStatus = createStatus('not_attached');
  return {
    invoicing: statuses.invoicing ?? defaultStatus,
    payments: statuses.payments ?? defaultStatus,
    'automated-comms': statuses['automated-comms'] ?? defaultStatus,
    scheduling: statuses.scheduling ?? defaultStatus,
    estimates: statuses.estimates ?? defaultStatus,
    'csr-ai': statuses['csr-ai'] ?? defaultStatus,
    reviews: statuses.reviews ?? defaultStatus,
    // New features for Frontline Onboarding Plan
    'account-setup': statuses['account-setup'] ?? defaultStatus,
    customers: statuses.customers ?? defaultStatus,
    'add-ons': statuses['add-ons'] ?? defaultStatus,
    'service-plans': statuses['service-plans'] ?? defaultStatus,
    'online-booking': statuses['online-booking'] ?? defaultStatus,
    reporting: statuses.reporting ?? defaultStatus,
    // Core features for published release
    'business-setup': statuses['business-setup'] ?? defaultStatus,
    jobs: statuses.jobs ?? defaultStatus,
    employees: statuses.employees ?? defaultStatus,
  };
};

/**
 * Mock pro accounts at different stages of their onboarding journey.
 * These demonstrate the variety of states a pro can be in across features.
 * Includes Pro Data (Pro Facets) fields from the database.
 */
export const mockPros: ProAccount[] = [
  // =========================================================================
  // PRO 1: Mike's Plumbing - Mixed stages, good for demo
  // =========================================================================
  {
    id: 'pro-001',
    companyName: "Mike's Plumbing Co.",
    ownerName: 'Mike Johnson',
    businessType: 'plumber',
    plan: 'essentials',
    goal: 'growth',
    createdAt: '2024-01-10',
    currentWeek: 3,  // 3 weeks into onboarding

    // Pro Data (Pro Facets) fields
    billingStatus: 'enrolled',
    businessId: '671073f1-02b3-400d-b5cd-e09d6914a208',
    customerStatusDisplayName: 'Enrolled: Current Customer',
    fraudStatus: 'risk_review_approved',
    industry: 'Plumbing',
    industryStandardized: 'Plumbing',
    industryType: 'Mechanical',
    leadStatus: 'demo_attended',
    organizationBinSize: '2 to 5',
    organizationSize: 3,
    organizationStatus: 'enrolled_current_customer',
    organizationUuid: 'aa4fe49c-a4e7-412f-aab3-6d986eacc7d7',
    painPoints: ['Managing my schedule', 'Collecting my money', 'Customer communications'],
    retentionStatus: 'unknown',
    segment: '2B',
    salesforceAccountId: '0015000000ABC123',
    salesforceLeadId: '00Q5000000DEF456',
    techReadiness: false,

    weeklyPlan: defaultWeeklyPlan,

    featureStatus: createAllFeatureStatuses({
      // Invoicing: Attached but only created a customer (2 tasks remaining)
      invoicing: {
        stage: 'attached',
        attachedAt: '2024-01-10',
        completedTasks: ['invoicing-create-customer'],
        usageCount: 0,
      },
      // Payments: Attached
      payments: {
        stage: 'attached',
        attachedAt: '2024-01-10',
        completedTasks: [],
        usageCount: 0,
      },
      // Scheduling: Engaged - uses it daily
      scheduling: {
        stage: 'engaged',
        attachedAt: '2024-01-10',
        activatedAt: '2024-01-12',
        engagedAt: '2024-01-25',
        completedTasks: [
          'scheduling-add-employee',
          'scheduling-set-hours',
          'scheduling-first-job',
          'scheduling-online-booking',
        ],
        usageCount: 87,
      },
      // Automated Comms: Activated but not engaged yet
      'automated-comms': {
        stage: 'activated',
        attachedAt: '2024-01-10',
        activatedAt: '2024-01-15',
        completedTasks: ['comms-enable-otw', 'comms-verify-number'],
        usageCount: 12,
      },
      // Estimates: Attached, no tasks completed
      estimates: {
        stage: 'attached',
        attachedAt: '2024-01-10',
        completedTasks: [],
        usageCount: 0,
      },
      // CSR AI: Not attached
      'csr-ai': createStatus('not_attached'),
      // Reviews: Attached
      reviews: {
        stage: 'attached',
        attachedAt: '2024-01-10',
        completedTasks: [],
        usageCount: 0,
      },
      // Core features: Attached
      'business-setup': {
        stage: 'attached',
        attachedAt: '2024-01-10',
        completedTasks: [],
        usageCount: 0,
      },
      employees: {
        stage: 'attached',
        attachedAt: '2024-01-10',
        completedTasks: [],
        usageCount: 0,
      },
      customers: {
        stage: 'attached',
        attachedAt: '2024-01-10',
        completedTasks: [],
        usageCount: 0,
      },
      jobs: {
        stage: 'attached',
        attachedAt: '2024-01-10',
        completedTasks: [],
        usageCount: 0,
      },
    }),
  },

  // =========================================================================
  // PRO 2: Sunny HVAC - New pro, early in onboarding
  // =========================================================================
  {
    id: 'pro-002',
    companyName: 'Sunny HVAC Services',
    ownerName: 'Sarah Chen',
    businessType: 'hvac',
    plan: 'max',
    goal: 'efficiency',
    createdAt: '2024-02-01',
    currentWeek: 1,  // Just started onboarding

    // Pro Data (Pro Facets) fields
    billingStatus: 'trial',
    businessId: '56948479-cf93-4df7-9730-9c4c84c4f0b2',
    customerStatusDisplayName: 'Sale-in-Progress: Sales + Trial',
    fraudStatus: 'unknown',
    industry: 'Heating & Air Conditioning',
    industryStandardized: 'Heating & Air Conditioning',
    industryType: 'Mechanical',
    leadStatus: 'sales_and_trial',
    organizationBinSize: '6 to 10',
    organizationSize: 8,
    organizationStatus: 'unknown',
    organizationUuid: '8bcd5b96-da9a-4ece-a607-b0e8f5edda62',
    painPoints: ['Managing employees', 'Too much admin work', 'Knowing my numbers'],
    retentionStatus: 'unknown',
    segment: '3A',
    salesforceAccountId: '0015000000GHI789',
    salesforceLeadId: '00Q5000000JKL012',
    techReadiness: true,

    weeklyPlan: defaultWeeklyPlan,

    featureStatus: createAllFeatureStatuses({
      // Has access to everything (Max plan) but just started
      invoicing: {
        stage: 'attached',
        attachedAt: '2024-02-01',
        completedTasks: [],
        usageCount: 0,
      },
      payments: {
        stage: 'attached',
        attachedAt: '2024-02-01',
        completedTasks: [],
        usageCount: 0,
      },
      scheduling: {
        stage: 'attached',
        attachedAt: '2024-02-01',
        completedTasks: ['scheduling-add-employee'],
        usageCount: 0,
      },
      'automated-comms': {
        stage: 'attached',
        attachedAt: '2024-02-01',
        completedTasks: [],
        usageCount: 0,
      },
      estimates: {
        stage: 'attached',
        attachedAt: '2024-02-01',
        completedTasks: [],
        usageCount: 0,
      },
      'csr-ai': {
        stage: 'attached',
        attachedAt: '2024-02-01',
        completedTasks: [],
        usageCount: 0,
      },
      reviews: {
        stage: 'attached',
        attachedAt: '2024-02-01',
        completedTasks: [],
        usageCount: 0,
      },
    }),
  },

  // =========================================================================
  // PRO 3: Green Thumb Landscaping - Power user, mostly engaged
  // =========================================================================
  {
    id: 'pro-003',
    companyName: 'Green Thumb Landscaping',
    ownerName: 'Carlos Rodriguez',
    businessType: 'landscaper',
    plan: 'max',
    goal: 'growth',
    createdAt: '2023-06-15',
    currentWeek: 4,  // Completed onboarding journey

    // Pro Data (Pro Facets) fields
    billingStatus: 'enrolled',
    businessId: 'e063fd0d-016b-44fd-934e-d7c040e7acc6',
    customerStatusDisplayName: 'Enrolled: Current Customer',
    fraudStatus: 'risk_review_approved',
    industry: 'Landscaping & Lawn',
    industryStandardized: 'Landscaping & Lawn',
    industryType: 'Recurring',
    leadStatus: 'demo_attended',
    organizationBinSize: '11+',
    organizationSize: 15,
    organizationStatus: 'enrolled_current_customer',
    organizationUuid: '7d010772-bac0-489a-9904-09f0eb874a1e',
    painPoints: ['Hiring employees', 'Managing employees', 'Not enough jobs', 'Managing my schedule'],
    retentionStatus: 'unknown',
    segment: '4A',
    salesforceAccountId: '0015000000MNO345',
    salesforceLeadId: '00Q5000000PQR678',
    techReadiness: true,

    weeklyPlan: defaultWeeklyPlan,

    featureStatus: createAllFeatureStatuses({
      invoicing: {
        stage: 'engaged',
        attachedAt: '2023-06-15',
        activatedAt: '2023-06-18',
        engagedAt: '2023-07-01',
        completedTasks: [
          'invoicing-create-customer',
          'invoicing-create-job',
          'invoicing-complete-job',
          'invoicing-add-logo',
          'invoicing-setup-reminders',
          'invoicing-add-payment-method',
        ],
        usageCount: 342,
      },
      payments: {
        stage: 'engaged',
        attachedAt: '2023-06-15',
        activatedAt: '2023-06-20',
        engagedAt: '2023-07-15',
        completedTasks: ['payments-connect-stripe', 'payments-verify', 'payments-enable-tips'],
        usageCount: 289,
      },
      scheduling: {
        stage: 'engaged',
        attachedAt: '2023-06-15',
        activatedAt: '2023-06-17',
        engagedAt: '2023-06-25',
        completedTasks: [
          'scheduling-add-employee',
          'scheduling-set-hours',
          'scheduling-first-job',
          'scheduling-online-booking',
          'scheduling-sync-calendar',
        ],
        usageCount: 456,
      },
      'automated-comms': {
        stage: 'engaged',
        attachedAt: '2023-06-15',
        activatedAt: '2023-06-19',
        engagedAt: '2023-07-01',
        completedTasks: [
          'comms-enable-otw',
          'comms-verify-number',
          'comms-review-request',
          'comms-follow-up',
        ],
        usageCount: 1205,
      },
      estimates: {
        stage: 'engaged',
        attachedAt: '2023-06-15',
        activatedAt: '2023-06-22',
        engagedAt: '2023-07-10',
        completedTasks: [
          'estimates-price-book',
          'estimates-create-first',
          'estimates-templates',
          'estimates-good-better-best',
        ],
        usageCount: 178,
      },
      'csr-ai': {
        stage: 'activated',
        attachedAt: '2024-01-01',
        activatedAt: '2024-01-10',
        completedTasks: [
          'csr-configure-greeting',
          'csr-set-services',
          'csr-forward-number',
        ],
        usageCount: 23,
      },
      reviews: {
        stage: 'engaged',
        attachedAt: '2023-06-15',
        activatedAt: '2023-06-25',
        engagedAt: '2023-08-01',
        completedTasks: [
          'reviews-connect-google',
          'reviews-enable-requests',
          'reviews-customize-request',
          'reviews-add-facebook',
        ],
        usageCount: 156,
      },
    }),
  },

  // =========================================================================
  // PRO 4: Quick Electric - Basic plan, limited features
  // =========================================================================
  {
    id: 'pro-004',
    companyName: 'Quick Electric LLC',
    ownerName: 'Dave Thompson',
    businessType: 'electrician',
    plan: 'basic',
    goal: 'efficiency',
    createdAt: '2024-01-20',
    currentWeek: 2,  // Second week of onboarding

    // Pro Data (Pro Facets) fields
    billingStatus: 'enrolled',
    businessId: 'f4a82c19-7b53-48e6-a9d1-cc7f12389aed',
    customerStatusDisplayName: 'Enrolled: Current Customer',
    fraudStatus: 'unknown',
    industry: 'Electrical',
    industryStandardized: 'Electrical',
    industryType: 'Mechanical',
    leadStatus: 'independent_trial',
    organizationBinSize: '0 to 1',
    organizationSize: 1,
    organizationStatus: 'enrolled_current_customer',
    organizationUuid: '1521ce20-0138-4866-9830-13087209f775',
    painPoints: ['Too much admin work', 'Managing my schedule'],
    retentionStatus: 'unknown',
    segment: '1A',
    salesforceAccountId: '0015000000STU901',
    techReadiness: false,

    weeklyPlan: defaultWeeklyPlan,

    featureStatus: createAllFeatureStatuses({
      // Basic plan only includes scheduling
      scheduling: {
        stage: 'activated',
        attachedAt: '2024-01-20',
        activatedAt: '2024-01-25',
        completedTasks: [
          'scheduling-add-employee',
          'scheduling-set-hours',
          'scheduling-first-job',
        ],
        usageCount: 34,
      },
      // Everything else requires upgrade
      invoicing: createStatus('not_attached'),
      payments: createStatus('not_attached'),
      'automated-comms': createStatus('not_attached'),
      estimates: createStatus('not_attached'),
      'csr-ai': createStatus('not_attached'),
      reviews: createStatus('not_attached'),
    }),
  },
];

export const getProById = (id: string): ProAccount | undefined =>
  mockPros.find((pro) => pro.id === id);
