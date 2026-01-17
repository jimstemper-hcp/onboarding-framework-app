import type { OnboardingItemDefinition } from '../types';

/**
 * Centralized repository of onboarding items.
 * These items can be assigned to any feature at any stage.
 * Completion is tracked once - if a pro completes "create a customer" for invoicing,
 * it's also complete for estimates, scheduling, etc.
 */
export const onboardingItems: OnboardingItemDefinition[] = [
  // ===========================================================================
  // SHARED ITEMS - Used by multiple features
  // ===========================================================================
  {
    id: 'create-first-customer',
    title: 'Create your first customer',
    description: 'Add a customer to your account to start sending invoices, estimates, and scheduling jobs.',
    type: 'in_product',
    completionApi: {
      eventName: 'customer.created',
      endpoint: '/api/customers',
      description: 'Triggers when a customer record is created in the system',
    },
    estimatedMinutes: 2,
    actionUrl: '/customers/new',
  },
  {
    id: 'create-first-job',
    title: 'Create your first job',
    description: 'Create a job for a customer. Jobs track work, generate invoices, and feed your schedule.',
    type: 'in_product',
    completionApi: {
      eventName: 'job.created',
      endpoint: '/api/jobs',
      description: 'Triggers when a job is created',
    },
    estimatedMinutes: 3,
    actionUrl: '/jobs/new',
  },
  {
    id: 'complete-first-job',
    title: 'Complete your first job',
    description: 'Mark a job as done to generate an invoice and track your completed work.',
    type: 'in_product',
    completionApi: {
      eventName: 'job.completed',
      endpoint: '/api/jobs/:id/complete',
      description: 'Triggers when a job status changes to completed',
    },
    estimatedMinutes: 1,
    actionUrl: '/jobs',
  },
  {
    id: 'add-company-logo',
    title: 'Add your company logo',
    description: 'Upload your logo to appear on invoices, estimates, and customer communications.',
    type: 'in_product',
    completionApi: {
      eventName: 'branding.logo_uploaded',
      endpoint: '/api/settings/branding',
      description: 'Triggers when a logo file is uploaded',
    },
    estimatedMinutes: 2,
    actionUrl: '/settings/branding',
  },
  {
    id: 'add-business-address',
    title: 'Add your business address',
    description: 'Add your business address to appear on invoices and help with job routing.',
    type: 'in_product',
    completionApi: {
      eventName: 'settings.address_added',
      endpoint: '/api/settings/business',
      description: 'Triggers when business address is saved',
    },
    estimatedMinutes: 2,
    actionUrl: '/settings/business',
  },

  // ===========================================================================
  // INVOICING ITEMS
  // ===========================================================================
  {
    id: 'send-first-invoice',
    title: 'Send your first invoice',
    description: 'Send an invoice to a customer via email or SMS.',
    type: 'in_product',
    completionApi: {
      eventName: 'invoice.sent',
      endpoint: '/api/invoices/:id/send',
      description: 'Triggers when an invoice is sent to a customer',
    },
    estimatedMinutes: 2,
    actionUrl: '/invoices',
  },
  {
    id: 'setup-payment-reminders',
    title: 'Configure payment reminders',
    description: 'Set up automatic reminders for unpaid invoices so you get paid faster.',
    type: 'in_product',
    completionApi: {
      eventName: 'invoicing.reminders_configured',
      endpoint: '/api/settings/invoicing/reminders',
      description: 'Triggers when reminder settings are saved',
    },
    estimatedMinutes: 3,
    actionUrl: '/settings/invoicing/reminders',
  },

  // ===========================================================================
  // PAYMENTS ITEMS
  // ===========================================================================
  {
    id: 'connect-payment-processor',
    title: 'Connect your payment processor',
    description: 'Connect Stripe or another processor to accept credit card payments.',
    type: 'in_product',
    completionApi: {
      eventName: 'payments.processor_connected',
      endpoint: '/api/settings/payments/connect',
      description: 'Triggers when payment processor OAuth completes',
    },
    estimatedMinutes: 5,
    actionUrl: '/settings/payments',
  },
  {
    id: 'collect-first-payment',
    title: 'Collect your first payment',
    description: 'Receive a payment from a customer through the platform.',
    type: 'in_product',
    completionApi: {
      eventName: 'payment.collected',
      endpoint: '/api/payments',
      description: 'Triggers when a payment is successfully processed',
    },
    estimatedMinutes: 1,
    actionUrl: '/payments',
  },
  {
    id: 'enable-card-on-file',
    title: 'Enable card on file',
    description: 'Allow customers to save their payment method for faster checkout.',
    type: 'in_product',
    completionApi: {
      eventName: 'payments.card_on_file_enabled',
      endpoint: '/api/settings/payments',
      description: 'Triggers when card on file setting is enabled',
    },
    estimatedMinutes: 2,
    actionUrl: '/settings/payments',
  },

  // ===========================================================================
  // SCHEDULING ITEMS
  // ===========================================================================
  {
    id: 'set-business-hours',
    title: 'Set your business hours',
    description: 'Define when you\'re available so customers can book at the right times.',
    type: 'in_product',
    completionApi: {
      eventName: 'settings.hours_configured',
      endpoint: '/api/settings/hours',
      description: 'Triggers when business hours are saved',
    },
    estimatedMinutes: 3,
    actionUrl: '/settings/hours',
  },
  {
    id: 'add-team-member',
    title: 'Add a team member',
    description: 'Add employees or contractors to dispatch jobs to.',
    type: 'in_product',
    completionApi: {
      eventName: 'team.member_added',
      endpoint: '/api/team',
      description: 'Triggers when a team member is created',
    },
    estimatedMinutes: 3,
    actionUrl: '/team/new',
  },
  {
    id: 'schedule-first-job',
    title: 'Schedule your first job',
    description: 'Put a job on the calendar with a date and time.',
    type: 'in_product',
    completionApi: {
      eventName: 'job.scheduled',
      endpoint: '/api/jobs/:id/schedule',
      description: 'Triggers when a job gets a scheduled date/time',
    },
    estimatedMinutes: 2,
    actionUrl: '/schedule',
  },
  {
    id: 'dispatch-first-job',
    title: 'Dispatch a job to a technician',
    description: 'Assign a scheduled job to a team member.',
    type: 'in_product',
    completionApi: {
      eventName: 'job.dispatched',
      endpoint: '/api/jobs/:id/dispatch',
      description: 'Triggers when a job is assigned to a technician',
    },
    estimatedMinutes: 1,
    actionUrl: '/schedule',
  },

  // ===========================================================================
  // ESTIMATES ITEMS
  // ===========================================================================
  {
    id: 'add-price-book-item',
    title: 'Add items to your price book',
    description: 'Add services and materials with prices for quick estimates.',
    type: 'in_product',
    completionApi: {
      eventName: 'pricebook.item_added',
      endpoint: '/api/pricebook',
      description: 'Triggers when a price book item is created',
    },
    estimatedMinutes: 5,
    actionUrl: '/settings/price-book',
  },
  {
    id: 'create-first-estimate',
    title: 'Create your first estimate',
    description: 'Build and send a professional estimate to a potential customer.',
    type: 'in_product',
    completionApi: {
      eventName: 'estimate.created',
      endpoint: '/api/estimates',
      description: 'Triggers when an estimate is created',
    },
    estimatedMinutes: 3,
    actionUrl: '/estimates/new',
  },
  {
    id: 'send-first-estimate',
    title: 'Send your first estimate',
    description: 'Send an estimate to a customer for approval.',
    type: 'in_product',
    completionApi: {
      eventName: 'estimate.sent',
      endpoint: '/api/estimates/:id/send',
      description: 'Triggers when an estimate is sent',
    },
    estimatedMinutes: 1,
    actionUrl: '/estimates',
  },

  // ===========================================================================
  // AUTOMATED COMMS ITEMS
  // ===========================================================================
  {
    id: 'enable-appointment-reminders',
    title: 'Enable appointment reminders',
    description: 'Automatically remind customers before their appointments.',
    type: 'in_product',
    completionApi: {
      eventName: 'comms.appointment_reminders_enabled',
      endpoint: '/api/settings/communications',
      description: 'Triggers when appointment reminders are turned on',
    },
    estimatedMinutes: 2,
    actionUrl: '/settings/communications/reminders',
  },
  {
    id: 'enable-on-my-way',
    title: 'Enable "On my way" texts',
    description: 'Let customers know when technicians are en route.',
    type: 'in_product',
    completionApi: {
      eventName: 'comms.on_my_way_enabled',
      endpoint: '/api/settings/communications',
      description: 'Triggers when on-my-way texts are enabled',
    },
    estimatedMinutes: 2,
    actionUrl: '/settings/communications/on-my-way',
  },
  {
    id: 'enable-follow-up',
    title: 'Enable follow-up messages',
    description: 'Automatically follow up after jobs for feedback and reviews.',
    type: 'in_product',
    completionApi: {
      eventName: 'comms.follow_up_enabled',
      endpoint: '/api/settings/communications',
      description: 'Triggers when follow-up messages are enabled',
    },
    estimatedMinutes: 2,
    actionUrl: '/settings/communications/follow-up',
  },
  {
    id: 'customize-message-templates',
    title: 'Customize message templates',
    description: 'Personalize the messages sent to your customers.',
    type: 'in_product',
    completionApi: {
      eventName: 'comms.template_customized',
      endpoint: '/api/settings/communications/templates',
      description: 'Triggers when a message template is edited',
    },
    estimatedMinutes: 5,
    actionUrl: '/settings/communications/templates',
  },

  // ===========================================================================
  // AI VOICE AGENT ITEMS
  // ===========================================================================
  {
    id: 'configure-ai-greeting',
    title: 'Configure your AI greeting',
    description: 'Set how the AI introduces itself and your business.',
    type: 'in_product',
    completionApi: {
      eventName: 'ai.greeting_configured',
      endpoint: '/api/settings/ai-voice/greeting',
      description: 'Triggers when AI greeting is saved',
    },
    estimatedMinutes: 5,
    actionUrl: '/settings/ai-voice/greeting',
  },
  {
    id: 'configure-ai-services',
    title: 'Tell the AI your services',
    description: 'List services so the AI can answer questions accurately.',
    type: 'in_product',
    completionApi: {
      eventName: 'ai.services_configured',
      endpoint: '/api/settings/ai-voice/services',
      description: 'Triggers when service list is saved',
    },
    estimatedMinutes: 5,
    actionUrl: '/settings/ai-voice/services',
  },
  {
    id: 'setup-call-forwarding',
    title: 'Set up call forwarding',
    description: 'Forward calls to the AI when you can\'t answer.',
    type: 'in_product',
    completionApi: {
      eventName: 'ai.forwarding_enabled',
      endpoint: '/api/settings/ai-voice/forwarding',
      description: 'Triggers when call forwarding is configured',
    },
    estimatedMinutes: 3,
    actionUrl: '/settings/ai-voice/forwarding',
  },

  // ===========================================================================
  // REVIEWS ITEMS
  // ===========================================================================
  {
    id: 'connect-google-business',
    title: 'Connect Google Business Profile',
    description: 'Link your Google listing to manage reviews in one place.',
    type: 'in_product',
    completionApi: {
      eventName: 'reviews.google_connected',
      endpoint: '/api/settings/reviews/google',
      description: 'Triggers when Google Business Profile OAuth completes',
    },
    estimatedMinutes: 3,
    actionUrl: '/settings/reviews/google',
  },
  {
    id: 'enable-review-requests',
    title: 'Enable review requests',
    description: 'Automatically ask for reviews after completed jobs.',
    type: 'in_product',
    completionApi: {
      eventName: 'reviews.requests_enabled',
      endpoint: '/api/settings/reviews/requests',
      description: 'Triggers when review requests are turned on',
    },
    estimatedMinutes: 2,
    actionUrl: '/settings/reviews/requests',
  },

  // ===========================================================================
  // REP-FACING ITEMS (Manually tracked by reps)
  // ===========================================================================
  {
    id: 'rep-intro-call-completed',
    title: 'Complete intro call',
    description: 'Rep has completed the initial onboarding intro call with the pro.',
    type: 'rep_facing',
    repInstructions: 'Mark this complete after finishing the introductory call. Cover account overview, goals, and immediate next steps.',
    estimatedMinutes: 30,
  },
  {
    id: 'rep-training-session-scheduled',
    title: 'Schedule training session',
    description: 'Rep has scheduled a training session for the pro.',
    type: 'rep_facing',
    repInstructions: 'Use Calendly to schedule a training session. Choose the appropriate session type based on their plan and needs.',
    estimatedMinutes: 5,
  },
  {
    id: 'rep-training-session-completed',
    title: 'Complete training session',
    description: 'Rep has delivered the training session to the pro.',
    type: 'rep_facing',
    repInstructions: 'Mark complete after the training session. Note any follow-up items or concerns in the account notes.',
    estimatedMinutes: 45,
  },
  {
    id: 'rep-reviewed-account-health',
    title: 'Review account health',
    description: 'Rep has reviewed the pro\'s account health and usage metrics.',
    type: 'rep_facing',
    repInstructions: 'Check adoption metrics, usage patterns, and identify any blockers. Document findings in account notes.',
    estimatedMinutes: 10,
  },
  {
    id: 'rep-documented-goals',
    title: 'Document pro goals',
    description: 'Rep has documented the pro\'s business goals and success criteria.',
    type: 'rep_facing',
    repInstructions: 'Ask about their business goals, what success looks like, and update the account record with this information.',
    estimatedMinutes: 10,
  },
  {
    id: 'rep-sent-welcome-resources',
    title: 'Send welcome resources',
    description: 'Rep has sent the welcome email with getting started resources.',
    type: 'rep_facing',
    repInstructions: 'Send the welcome email template with links to help articles, videos, and the getting started guide.',
    estimatedMinutes: 5,
  },
];

// Helper to get an item by ID
export function getOnboardingItemById(id: string): OnboardingItemDefinition | undefined {
  return onboardingItems.find(item => item.id === id);
}

// Helper to get items by type
export function getOnboardingItemsByType(type: 'in_product' | 'rep_facing'): OnboardingItemDefinition[] {
  return onboardingItems.filter(item => item.type === type);
}

// Export item IDs for type-safe references
export const ONBOARDING_ITEM_IDS = {
  // Shared
  CREATE_FIRST_CUSTOMER: 'create-first-customer',
  CREATE_FIRST_JOB: 'create-first-job',
  COMPLETE_FIRST_JOB: 'complete-first-job',
  ADD_COMPANY_LOGO: 'add-company-logo',
  ADD_BUSINESS_ADDRESS: 'add-business-address',

  // Invoicing
  SEND_FIRST_INVOICE: 'send-first-invoice',
  SETUP_PAYMENT_REMINDERS: 'setup-payment-reminders',

  // Payments
  CONNECT_PAYMENT_PROCESSOR: 'connect-payment-processor',
  COLLECT_FIRST_PAYMENT: 'collect-first-payment',
  ENABLE_CARD_ON_FILE: 'enable-card-on-file',

  // Scheduling
  SET_BUSINESS_HOURS: 'set-business-hours',
  ADD_TEAM_MEMBER: 'add-team-member',
  SCHEDULE_FIRST_JOB: 'schedule-first-job',
  DISPATCH_FIRST_JOB: 'dispatch-first-job',

  // Estimates
  ADD_PRICE_BOOK_ITEM: 'add-price-book-item',
  CREATE_FIRST_ESTIMATE: 'create-first-estimate',
  SEND_FIRST_ESTIMATE: 'send-first-estimate',

  // Automated Comms
  ENABLE_APPOINTMENT_REMINDERS: 'enable-appointment-reminders',
  ENABLE_ON_MY_WAY: 'enable-on-my-way',
  ENABLE_FOLLOW_UP: 'enable-follow-up',
  CUSTOMIZE_MESSAGE_TEMPLATES: 'customize-message-templates',

  // AI Voice
  CONFIGURE_AI_GREETING: 'configure-ai-greeting',
  CONFIGURE_AI_SERVICES: 'configure-ai-services',
  SETUP_CALL_FORWARDING: 'setup-call-forwarding',

  // Reviews
  CONNECT_GOOGLE_BUSINESS: 'connect-google-business',
  ENABLE_REVIEW_REQUESTS: 'enable-review-requests',

  // Rep-facing
  REP_INTRO_CALL_COMPLETED: 'rep-intro-call-completed',
  REP_TRAINING_SESSION_SCHEDULED: 'rep-training-session-scheduled',
  REP_TRAINING_SESSION_COMPLETED: 'rep-training-session-completed',
  REP_REVIEWED_ACCOUNT_HEALTH: 'rep-reviewed-account-health',
  REP_DOCUMENTED_GOALS: 'rep-documented-goals',
  REP_SENT_WELCOME_RESOURCES: 'rep-sent-welcome-resources',
} as const;
