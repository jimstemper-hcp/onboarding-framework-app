import type { ProAccount, FeatureId, FeatureStatus } from '../types';

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
  };
};

/**
 * Mock pro accounts at different stages of their onboarding journey.
 * These demonstrate the variety of states a pro can be in across features.
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
    featureStatus: createAllFeatureStatuses({
      // Invoicing: Attached but only created a customer (2 tasks remaining)
      invoicing: {
        stage: 'attached',
        attachedAt: '2024-01-10',
        completedTasks: ['invoicing-create-customer'],
        usageCount: 0,
      },
      // Payments: Not attached (needs to upgrade or add-on)
      payments: createStatus('not_attached'),
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
      // Reviews: Not attached
      reviews: createStatus('not_attached'),
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
