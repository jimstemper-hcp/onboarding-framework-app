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
    category: 'the-basics',
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
    category: 'jobs',
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
    category: 'account-setup',
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
    category: 'account-setup',
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
    category: 'account-setup',
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
    category: 'account-setup',
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
    category: 'account-setup',
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
    category: 'additional-tools',
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
    category: 'estimates',
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
    category: 'additional-tools',
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
    category: 'additional-tools',
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

  // ===========================================================================
  // CATEGORY: ACCOUNT SETUP
  // ===========================================================================
  {
    id: 'notifications-settings',
    title: 'Notifications',
    description: 'Configure notification preferences for the account.',
    type: 'rep_facing',
    category: 'account-setup',
    repInstructions: 'Review and configure notification settings for email, SMS, and push notifications.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'notifications-settings-value',
        title: 'Value Statement',
        content: 'Smart notification settings keep you informed without overwhelming you. Get alerts for new jobs, payments, and customer messages on the channels that work best for your workflow.',
      },
      {
        id: 'notifications-settings-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Notifications. Review each notification type: new jobs, payments, reviews, etc. Ask which channel they prefer (email, SMS, push). Ensure critical alerts like new bookings are enabled.',
      },
    ],
  },
  {
    id: 'custom-sms',
    title: 'Set Up Custom SMS',
    description: 'Configure custom SMS messaging templates and settings.',
    type: 'rep_facing',
    category: 'account-setup',
    repInstructions: 'Help set up custom SMS templates and messaging preferences.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'custom-sms-value',
        title: 'Value Statement',
        content: 'Custom SMS templates let you communicate with your brand\'s voice. Personalized messages get better response rates and make your business memorable to customers.',
      },
      {
        id: 'custom-sms-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Communications > SMS Templates. Review default templates for appointment reminders, on-my-way, and follow-ups. Customize with their company name and tone. Test by sending a sample message.',
      },
    ],
  },
  {
    id: 'estimates-settings',
    title: 'Estimates Settings',
    description: 'Configure settings for estimates including templates and defaults.',
    type: 'rep_facing',
    category: 'account-setup',
    repInstructions: 'Walk through estimates settings including default terms, expiration, and templates.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'estimates-settings-value',
        title: 'Value Statement',
        content: 'Well-configured estimate settings save time on every quote. Set your default terms, expiration periods, and branding once - then every estimate you create starts with your preferences built in.',
      },
      {
        id: 'estimates-settings-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Estimates. Set default expiration (7-30 days typical). Configure terms and conditions. Ensure logo and contact info display correctly. Review approval workflow settings if applicable.',
      },
    ],
  },
  {
    id: 'invoice-settings',
    title: 'Invoice Settings',
    description: 'Configure invoice settings including payment terms and reminders.',
    type: 'rep_facing',
    category: 'account-setup',
    repInstructions: 'Set up invoice settings including payment terms, due dates, and reminder schedules.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'invoice-settings-value',
        title: 'Value Statement',
        content: 'Proper invoice settings help you get paid faster. Automatic reminders chase payments so you don\'t have to, and clear payment terms set expectations from the start.',
      },
      {
        id: 'invoice-settings-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Invoicing. Set default payment terms (Due on Receipt, Net 15, Net 30). Configure automatic payment reminders at 7, 14, 30 days overdue. Add late fee policy if applicable. Review invoice numbering format.',
      },
    ],
  },
  {
    id: 'consumer-financing',
    title: 'Consumer Financing - Wisetack',
    description: 'Set up consumer financing options through Wisetack integration.',
    type: 'rep_facing',
    category: 'account-setup',
    repInstructions: 'Explain and set up Wisetack consumer financing integration.',
    estimatedMinutes: 15,
    contextSnippets: [
      {
        id: 'consumer-financing-value',
        title: 'Value Statement',
        content: 'Consumer financing helps close bigger jobs by letting customers pay over time while you get paid upfront. Pros offering financing see 20-30% higher average ticket sizes on big-ticket repairs.',
      },
      {
        id: 'consumer-financing-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Payments > Consumer Financing. Walk through Wisetack signup (takes ~5 min). Explain how to offer financing on estimates and invoices. Train techs to mention financing for jobs over $500. No credit impact for soft checks.',
      },
    ],
  },

  // ===========================================================================
  // CATEGORY: THE BASICS (8 items)
  // ===========================================================================
  {
    id: 'customer-profile-details',
    title: 'Customer Profile Details',
    description: 'Understand customer profile fields and how to manage customer information.',
    type: 'rep_facing',
    category: 'the-basics',
    repInstructions: 'Walk through customer profile details and what information can be stored.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'customer-profile-details-value',
        title: 'Value Statement',
        content: 'Rich customer profiles help you deliver personalized service. Notes, equipment history, and preferences give techs context before they arrive - impressing customers and saving time.',
      },
      {
        id: 'customer-profile-details-guidance',
        title: 'Guidance',
        content: 'Open an existing customer profile. Walk through all sections: contact info, addresses, notes, job history, payment methods. Show how to add internal notes (not visible to customer). Explain lead source tracking for marketing ROI.',
      },
    ],
  },
  {
    id: 'customer-portal',
    title: 'Customer Portal',
    description: 'Set up and explain the customer portal for self-service.',
    type: 'rep_facing',
    category: 'the-basics',
    repInstructions: 'Explain customer portal features and how customers can use it.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'customer-portal-value',
        title: 'Value Statement',
        content: 'The customer portal lets customers view appointments, pay invoices, and request service 24/7. This reduces phone calls and gives customers the self-service experience they expect.',
      },
      {
        id: 'customer-portal-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Customer Portal. Enable the portal and customize branding. Walk through what customers see: upcoming appointments, invoice history, payment options. Show how portal link is included in customer communications.',
      },
    ],
  },
  {
    id: 'customer-tags',
    title: 'Customer Tags',
    description: 'Learn how to use tags to organize and categorize customers.',
    type: 'rep_facing',
    category: 'the-basics',
    repInstructions: 'Show how to create and use customer tags for organization and filtering.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'customer-tags-value',
        title: 'Value Statement',
        content: 'Tags help you segment customers for targeted marketing and better service. Tag VIP customers, property managers, or service plan members to quickly filter and communicate with specific groups.',
      },
      {
        id: 'customer-tags-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Tags > Customer Tags. Create common tags: VIP, Commercial, Residential, Service Plan, Do Not Call. Show how to apply tags to customers and filter customer list by tag. Explain tag-based marketing campaigns.',
      },
    ],
  },
  {
    id: 'cc-on-file',
    title: 'CC on File',
    description: 'Set up credit card on file for customers for easy payments.',
    type: 'rep_facing',
    category: 'the-basics',
    repInstructions: 'Explain how to store credit cards on file and the benefits for recurring payments.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'cc-on-file-value',
        title: 'Value Statement',
        content: 'Cards on file eliminate payment friction. Recurring customers and service plan members can be charged automatically, reducing collections work and speeding up cash flow.',
      },
      {
        id: 'cc-on-file-guidance',
        title: 'Guidance',
        content: 'Go to customer profile > Payment Methods. Show how to add a card via payment link or manual entry. Explain PCI compliance (cards stored securely by Stripe). Demonstrate charging a card on file from an invoice.',
      },
    ],
  },
  {
    id: 'parent-child-billing',
    title: 'Parent/Child Billing',
    description: 'Set up parent/child billing relationships for property management.',
    type: 'rep_facing',
    category: 'the-basics',
    repInstructions: 'Explain parent/child billing for property managers or multi-location customers.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'parent-child-billing-value',
        title: 'Value Statement',
        content: 'Parent/child billing simplifies commercial and property management accounts. Bill the management company while tracking work at individual properties - perfect for HOAs, franchises, and multi-unit customers.',
      },
      {
        id: 'parent-child-billing-guidance',
        title: 'Guidance',
        content: 'Go to customer profile > Billing Settings. Show how to set up parent company and link child locations. Explain invoice routing options (bill parent vs bill individual). Demonstrate consolidated billing reports for parent accounts.',
      },
    ],
  },
  {
    id: 'multiple-addresses',
    title: 'Adding Multiple Addresses',
    description: 'Learn how to add multiple service addresses for a single customer.',
    type: 'rep_facing',
    category: 'the-basics',
    repInstructions: 'Show how to add and manage multiple addresses for customers with multiple properties.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'multiple-addresses-value',
        title: 'Value Statement',
        content: 'Multiple addresses let you serve customers with vacation homes, rental properties, or multiple locations without creating duplicate customer records. All history stays under one customer.',
      },
      {
        id: 'multiple-addresses-guidance',
        title: 'Guidance',
        content: 'Go to customer profile > Addresses. Click Add Address. Show how to label addresses (Home, Vacation, Rental #1). When creating a job, demonstrate selecting from saved addresses. Explain property-specific notes for each address.',
      },
    ],
  },
  {
    id: 'customer-notifications',
    title: 'Notifications',
    description: 'Configure customer notification preferences.',
    type: 'rep_facing',
    category: 'the-basics',
    repInstructions: 'Set up customer notification preferences for appointments, invoices, and marketing.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'customer-notifications-value',
        title: 'Value Statement',
        content: 'Customer notification preferences ensure you\'re communicating how customers prefer. Respect opt-outs for marketing while ensuring transactional messages (appointments, invoices) still get through.',
      },
      {
        id: 'customer-notifications-guidance',
        title: 'Guidance',
        content: 'Go to customer profile > Notification Preferences. Show email vs SMS preferences. Explain difference between transactional (can\'t opt out) and marketing (can opt out). Demonstrate how to mark customers as "Do Not Contact" for marketing.',
      },
    ],
  },

  // ===========================================================================
  // CATEGORY: ADD ONS (8 items)
  // ===========================================================================
  {
    id: 'pipeline',
    title: 'Pipeline',
    description: 'Set up and use the sales pipeline for lead management.',
    type: 'rep_facing',
    category: 'add-ons',
    repInstructions: 'Demonstrate the pipeline feature for tracking leads and opportunities.',
    estimatedMinutes: 15,
    contextSnippets: [
      {
        id: 'pipeline-value',
        title: 'Value Statement',
        content: 'Pipeline helps you track leads from first contact to closed deal. See your sales funnel at a glance, follow up at the right time, and never let a hot lead go cold.',
      },
      {
        id: 'pipeline-guidance',
        title: 'Guidance',
        content: 'Go to Pipeline from main menu. Walk through stages: New Lead, Contacted, Estimate Sent, Negotiating, Won/Lost. Create a sample lead and move through stages. Set up follow-up reminders. Show pipeline reports and conversion metrics.',
      },
    ],
  },
  {
    id: 'profit-rhino',
    title: 'Profit Rhino',
    description: 'Set up Profit Rhino integration for flat-rate pricing.',
    type: 'rep_facing',
    category: 'add-ons',
    repInstructions: 'Explain and set up Profit Rhino integration for flat-rate pricing books.',
    estimatedMinutes: 20,
    contextSnippets: [
      {
        id: 'profit-rhino-value',
        title: 'Value Statement',
        content: 'Profit Rhino provides industry-standard flat-rate pricing books. Techs present professional options to customers without guessing prices, increasing average ticket size and closing rates.',
      },
      {
        id: 'profit-rhino-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Integrations > Profit Rhino. Connect their Profit Rhino account. Walk through how pricing syncs to estimates. Show techs how to build estimates using the pricing book. Review margin settings and adjustment options.',
      },
    ],
  },
  {
    id: 'marketing-center',
    title: 'Marketing Center',
    description: 'Set up and use the Marketing Center for campaigns.',
    type: 'rep_facing',
    category: 'add-ons',
    repInstructions: 'Walk through Marketing Center features including email campaigns and postcards.',
    estimatedMinutes: 20,
    contextSnippets: [
      {
        id: 'marketing-center-value',
        title: 'Value Statement',
        content: 'Marketing Center lets you stay top-of-mind with automated campaigns. Send seasonal reminders, win back inactive customers, and request reviews - all without lifting a finger after setup.',
      },
      {
        id: 'marketing-center-guidance',
        title: 'Guidance',
        content: 'Go to Marketing Center. Review campaign types: Email, Postcard, Automated. Start with a simple "win back" campaign for inactive customers. Set up seasonal reminder campaigns (HVAC tune-up, etc). Review analytics after first send.',
      },
    ],
  },
  {
    id: 'voice-call-tracking',
    title: 'Voice & Call Tracking',
    description: 'Set up voice and call tracking for marketing attribution.',
    type: 'rep_facing',
    category: 'add-ons',
    repInstructions: 'Configure voice and call tracking for lead source attribution.',
    estimatedMinutes: 15,
    contextSnippets: [
      {
        id: 'voice-call-tracking-value',
        title: 'Value Statement',
        content: 'Call tracking reveals which marketing channels drive phone calls. Know exactly which ads, mailers, or directories generate leads so you can invest more in what works.',
      },
      {
        id: 'voice-call-tracking-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Voice & Call Tracking. Set up tracking numbers for each lead source (Google, Yelp, mailers). Show call recording settings and compliance. Review call tracking reports to demonstrate ROI attribution.',
      },
    ],
  },
  {
    id: 'hcpa',
    title: 'HCPA',
    description: 'Set up Housecall Pro Accounting integration.',
    type: 'rep_facing',
    category: 'add-ons',
    repInstructions: 'Explain and set up HCPA for accounting integration.',
    estimatedMinutes: 20,
    contextSnippets: [
      {
        id: 'hcpa-value',
        title: 'Value Statement',
        content: 'HCPA syncs your Housecall Pro data with accounting software automatically. No more double entry - invoices, payments, and expenses flow directly to your books, saving hours each month.',
      },
      {
        id: 'hcpa-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Integrations > HCPA. Connect their QuickBooks or accounting system. Map chart of accounts for revenue, expenses, and payment types. Run a test sync and verify data in both systems.',
      },
    ],
  },
  {
    id: 'payroll',
    title: 'Payroll',
    description: 'Set up payroll integration for employee payments.',
    type: 'rep_facing',
    category: 'add-ons',
    repInstructions: 'Configure payroll integration for employee time tracking and payments.',
    estimatedMinutes: 20,
    contextSnippets: [
      {
        id: 'payroll-value',
        title: 'Value Statement',
        content: 'Integrated payroll uses the time tracking already happening in Housecall Pro. No more collecting timesheets - clock in/out data flows directly to payroll for accurate, hassle-free pay runs.',
      },
      {
        id: 'payroll-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Payroll. Set up employee profiles with pay rates and tax info. Configure pay periods and direct deposit. Show how time tracking data flows to payroll. Run a test pay period before going live.',
      },
    ],
  },
  {
    id: 'conquer',
    title: 'Conquer',
    description: 'Set up Conquer integration for sales enablement.',
    type: 'rep_facing',
    category: 'add-ons',
    repInstructions: 'Explain and configure Conquer integration.',
    estimatedMinutes: 15,
    contextSnippets: [
      {
        id: 'conquer-value',
        title: 'Value Statement',
        content: 'Conquer helps your team close more deals with guided selling tools. Present professional proposals, handle objections, and upsell confidently with built-in sales playbooks.',
      },
      {
        id: 'conquer-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Integrations > Conquer. Connect their Conquer account. Walk through how sales tools appear during estimate presentation. Review good-better-best presentation options. Practice a mock sales scenario.',
      },
    ],
  },
  {
    id: 'inha-accounting',
    title: 'INHA Accounting',
    description: 'Set up INHA Accounting integration.',
    type: 'rep_facing',
    category: 'add-ons',
    repInstructions: 'Configure INHA Accounting integration for financial management.',
    estimatedMinutes: 20,
    contextSnippets: [
      {
        id: 'inha-accounting-value',
        title: 'Value Statement',
        content: 'INHA Accounting provides full-service bookkeeping tailored for home service businesses. Get clean books, tax-ready financials, and insights specific to your industry without hiring an in-house accountant.',
      },
      {
        id: 'inha-accounting-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Integrations > INHA Accounting. Initiate the INHA onboarding process. Set up data sharing permissions. Schedule their intro call with INHA team. Review reporting cadence and deliverables.',
      },
    ],
  },

  // ===========================================================================
  // CATEGORY: ESTIMATES (5 items)
  // ===========================================================================
  {
    id: 'customer-intake-estimates',
    title: 'Customer Intake (If applicable)',
    description: 'Set up customer intake process for estimates.',
    type: 'rep_facing',
    category: 'estimates',
    repInstructions: 'Walk through customer intake workflow for estimate requests.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'customer-intake-estimates-value',
        title: 'Value Statement',
        content: 'A structured intake process ensures you gather all information needed to prepare accurate estimates. Reduce callbacks and surprise costs by asking the right questions upfront.',
      },
      {
        id: 'customer-intake-estimates-guidance',
        title: 'Guidance',
        content: 'Show how to capture estimate requests from calls, online booking, or walk-ins. Create intake questions specific to their services. Link intake forms to estimate creation workflow. Set up notification for new estimate requests.',
      },
    ],
  },
  {
    id: 'estimate-templates',
    title: 'Estimate Templates',
    description: 'Create and use estimate templates for efficiency.',
    type: 'rep_facing',
    category: 'estimates',
    repInstructions: 'Show how to create and use estimate templates for common job types.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'estimate-templates-value',
        title: 'Value Statement',
        content: 'Estimate templates let you quote common jobs in seconds instead of minutes. Techs in the field can send professional estimates immediately, closing deals before competitors even respond.',
      },
      {
        id: 'estimate-templates-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Estimate Templates. Create templates for their top 5 most common services. Include typical line items, standard terms, and default notes. Show how techs select a template and adjust as needed.',
      },
    ],
  },
  {
    id: 'multi-option-estimates',
    title: 'Multi-Optioned Estimates',
    description: 'Create estimates with multiple options for customers.',
    type: 'rep_facing',
    category: 'estimates',
    repInstructions: 'Demonstrate creating good-better-best style multi-option estimates.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'multi-option-estimates-value',
        title: 'Value Statement',
        content: 'Multi-option estimates (good/better/best) increase average ticket size by 20-40%. Customers appreciate choices and often select the middle or premium option when presented professionally.',
      },
      {
        id: 'multi-option-estimates-guidance',
        title: 'Guidance',
        content: 'Create a multi-option estimate with 3 tiers. Name options clearly (Basic Repair, Standard + Warranty, Premium + Maintenance). Highlight value differences between tiers. Show how customer selects their preferred option.',
      },
    ],
  },
  {
    id: 'sales-proposal-tool',
    title: 'Sales Proposal Tool',
    description: 'Use the sales proposal tool for professional presentations.',
    type: 'rep_facing',
    category: 'estimates',
    repInstructions: 'Walk through the sales proposal tool for creating compelling presentations.',
    estimatedMinutes: 15,
    contextSnippets: [
      {
        id: 'sales-proposal-tool-value',
        title: 'Value Statement',
        content: 'The sales proposal tool transforms estimates into compelling presentations. Include photos, videos, and financing options. Perfect for big-ticket jobs where you need to sell the value, not just the price.',
      },
      {
        id: 'sales-proposal-tool-guidance',
        title: 'Guidance',
        content: 'Create a proposal for a high-value service. Add before/after photos, equipment specs, and warranty information. Include financing calculator. Show presentation mode for in-home sales. Practice the customer-facing flow.',
      },
    ],
  },

  // ===========================================================================
  // CATEGORY: JOBS (9 items)
  // ===========================================================================
  {
    id: 'customer-intake-jobs',
    title: 'Customer Intake (If applicable)',
    description: 'Set up customer intake process for jobs.',
    type: 'rep_facing',
    category: 'jobs',
    repInstructions: 'Walk through customer intake workflow for job requests.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'customer-intake-jobs-value',
        title: 'Value Statement',
        content: 'Consistent intake ensures techs arrive prepared with the right parts and information. Reduce wasted trips and improve first-call resolution by capturing key details during booking.',
      },
      {
        id: 'customer-intake-jobs-guidance',
        title: 'Guidance',
        content: 'Set up intake questions for their common job types. Configure required fields for job creation. Show how CSRs or online booking capture this info. Link intake data to job notes visible to techs.',
      },
    ],
  },
  {
    id: 'job-tags',
    title: 'Job Tags',
    description: 'Use tags to organize and categorize jobs.',
    type: 'rep_facing',
    category: 'jobs',
    repInstructions: 'Show how to create and use job tags for organization and reporting.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'job-tags-value',
        title: 'Value Statement',
        content: 'Job tags unlock powerful reporting and filtering. Tag by service type, urgency, or source to analyze which jobs are most profitable and where your work is coming from.',
      },
      {
        id: 'job-tags-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Tags > Job Tags. Create tags for service types (Repair, Install, Maintenance), urgency (Emergency, Scheduled), and sources (Referral, Online, Repeat). Show how tags appear in reports and filters.',
      },
    ],
  },
  {
    id: 'job-templates',
    title: 'Job Templates',
    description: 'Create and use job templates for efficiency.',
    type: 'rep_facing',
    category: 'jobs',
    repInstructions: 'Demonstrate creating job templates for common service types.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'job-templates-value',
        title: 'Value Statement',
        content: 'Job templates speed up booking and ensure consistency. Pre-set duration, tags, checklists, and notes for common jobs so CSRs book accurately every time.',
      },
      {
        id: 'job-templates-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Job Templates. Create templates for top services (tune-up, diagnostic, install). Set default duration, tags, and any attached checklists. Show how CSRs select templates during booking.',
      },
    ],
  },
  {
    id: 'multi-day-appointments',
    title: 'Multi-Day Appointments',
    description: 'Schedule jobs that span multiple days.',
    type: 'rep_facing',
    category: 'jobs',
    repInstructions: 'Show how to create and manage multi-day job appointments.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'multi-day-appointments-value',
        title: 'Value Statement',
        content: 'Multi-day jobs let you schedule large projects that span several days under one job. Keep all notes, photos, and billing together while blocking out accurate calendar time.',
      },
      {
        id: 'multi-day-appointments-guidance',
        title: 'Guidance',
        content: 'Create a job and enable multi-day scheduling. Set start and end dates. Show how it appears on the calendar. Demonstrate updating progress across days. Explain how invoicing works for multi-day jobs.',
      },
    ],
  },
  {
    id: 'segments',
    title: 'Segments',
    description: 'Use segments to break jobs into multiple parts.',
    type: 'rep_facing',
    category: 'jobs',
    repInstructions: 'Explain job segments for multi-part or phased work.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'segments-value',
        title: 'Value Statement',
        content: 'Segments break complex jobs into trackable phases. Perfect for diagnostic + repair, permit + install, or any job that requires multiple visits with different billing.',
      },
      {
        id: 'segments-guidance',
        title: 'Guidance',
        content: 'Show how to add segments to a job. Create segments for different phases (Diagnostic, Parts Order, Repair). Explain how each segment can have its own schedule, tech, and line items. Demonstrate segment-based invoicing.',
      },
    ],
  },
  {
    id: 'recurring-jobs',
    title: 'Recurring Jobs',
    description: 'Set up recurring jobs for regular maintenance.',
    type: 'rep_facing',
    category: 'jobs',
    repInstructions: 'Configure recurring job schedules for maintenance contracts.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'recurring-jobs-value',
        title: 'Value Statement',
        content: 'Recurring jobs build predictable revenue. Set up maintenance visits once and they auto-generate on schedule. Never forget a service call or lose a maintenance customer to a competitor.',
      },
      {
        id: 'recurring-jobs-guidance',
        title: 'Guidance',
        content: 'Create a recurring job from a customer profile. Set frequency (weekly, monthly, quarterly, annually). Configure how far in advance jobs generate. Show recurring job management and how to modify the series.',
      },
    ],
  },
  {
    id: 'scheduling-dispatching',
    title: 'Scheduling/Dispatching',
    description: 'Learn scheduling and dispatching best practices.',
    type: 'rep_facing',
    category: 'jobs',
    repInstructions: 'Walk through scheduling and dispatching workflows and best practices.',
    estimatedMinutes: 15,
    contextSnippets: [
      {
        id: 'scheduling-dispatching-value',
        title: 'Value Statement',
        content: 'Efficient dispatching maximizes billable hours. See all techs and jobs at a glance, minimize drive time, and respond quickly to emergencies without losing track of scheduled work.',
      },
      {
        id: 'scheduling-dispatching-guidance',
        title: 'Guidance',
        content: 'Walk through the dispatch board. Show drag-and-drop scheduling. Explain color coding for job status. Demonstrate assigning jobs to techs. Use map view to optimize routes. Show notification settings for dispatch changes.',
      },
    ],
  },
  {
    id: 'calendar-settings',
    title: 'Calendar Settings',
    description: 'Configure calendar settings and views.',
    type: 'rep_facing',
    category: 'jobs',
    repInstructions: 'Set up calendar preferences including views, colors, and time slots.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'calendar-settings-value',
        title: 'Value Statement',
        content: 'Customized calendar settings make dispatching faster. Set your preferred views, time slots, and color coding so the calendar works the way your team thinks.',
      },
      {
        id: 'calendar-settings-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Calendar. Configure default view (day, week, month). Set time slot increments (15, 30, 60 min). Assign colors to job types or techs. Set up calendar sync with Google/Outlook if needed.',
      },
    ],
  },

  // ===========================================================================
  // CATEGORY: INVOICING (7 items)
  // ===========================================================================
  {
    id: 'processing-payments',
    title: 'Processing Payments',
    description: 'Learn how to process payments from customers.',
    type: 'rep_facing',
    category: 'invoicing',
    repInstructions: 'Demonstrate processing payments including cards, cash, and checks.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'processing-payments-value',
        title: 'Value Statement',
        content: 'Getting paid on the spot means better cash flow. Techs can process cards in the field, customers can pay via link, and all payments sync automatically to your accounting.',
      },
      {
        id: 'processing-payments-guidance',
        title: 'Guidance',
        content: 'Show all payment methods: card on file, tap to pay, payment link, cash, and check. Demonstrate recording each type. Show how payments appear on invoices. Explain tip settings and receipt options.',
      },
    ],
  },
  {
    id: 'progress-invoicing',
    title: 'Progress Invoicing',
    description: 'Set up progress invoicing for large projects.',
    type: 'rep_facing',
    category: 'invoicing',
    repInstructions: 'Explain progress invoicing for milestone-based billing.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'progress-invoicing-value',
        title: 'Value Statement',
        content: 'Progress invoicing protects your cash flow on large jobs. Bill at milestones (deposit, rough-in, completion) so you\'re never too far out on materials or labor costs.',
      },
      {
        id: 'progress-invoicing-guidance',
        title: 'Guidance',
        content: 'Show how to enable progress invoicing on a job. Set up billing milestones with amounts or percentages. Demonstrate sending milestone invoices. Explain how progress payments apply to the final invoice.',
      },
    ],
  },
  {
    id: 'cancel-edit-invoice',
    title: 'Cancel/Edit (Due date, Payment date, deleting/canceling a job)',
    description: 'Learn how to cancel or edit invoices and jobs.',
    type: 'rep_facing',
    category: 'invoicing',
    repInstructions: 'Show how to edit invoices, change dates, and properly cancel jobs/invoices.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'cancel-edit-invoice-value',
        title: 'Value Statement',
        content: 'Knowing how to properly edit and cancel keeps your records clean. Avoid duplicate invoices, maintain accurate reporting, and handle customer disputes professionally.',
      },
      {
        id: 'cancel-edit-invoice-guidance',
        title: 'Guidance',
        content: 'Show how to edit invoice line items, due dates, and payment terms. Demonstrate canceling an invoice (vs. deleting). Explain when to void vs. refund. Walk through canceling a job and its impact on related invoices.',
      },
    ],
  },
  {
    id: 'auto-invoicing',
    title: 'Auto Invoicing',
    description: 'Set up automatic invoice generation.',
    type: 'rep_facing',
    category: 'invoicing',
    repInstructions: 'Configure auto-invoicing settings for completed jobs.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'auto-invoicing-value',
        title: 'Value Statement',
        content: 'Auto-invoicing eliminates the delay between completing work and sending bills. Invoices go out immediately when jobs are marked complete, improving cash flow and reducing admin work.',
      },
      {
        id: 'auto-invoicing-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Invoicing > Auto-Invoice. Enable auto-invoice on job completion. Set whether to auto-send or just create as draft. Configure which job types auto-invoice. Review timing and notification settings.',
      },
    ],
  },
  {
    id: 'batched-invoices',
    title: 'Batched Invoices',
    description: 'Create batched invoices for multiple jobs.',
    type: 'rep_facing',
    category: 'invoicing',
    repInstructions: 'Demonstrate creating batched invoices for commercial clients or property managers.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'batched-invoices-value',
        title: 'Value Statement',
        content: 'Batched invoicing simplifies billing for commercial clients. Send one invoice for all work done in a period, matching how property managers and businesses prefer to receive and process bills.',
      },
      {
        id: 'batched-invoices-guidance',
        title: 'Guidance',
        content: 'Show how to select multiple completed jobs for one customer. Create a batched invoice combining all jobs. Review line item grouping options. Set up recurring batch invoicing for regular commercial accounts.',
      },
    ],
  },
  {
    id: 'invoice-checklist',
    title: 'Adding a checklist to an invoice',
    description: 'Add checklists to invoices for work verification.',
    type: 'rep_facing',
    category: 'invoicing',
    repInstructions: 'Show how to add checklists to invoices for documentation.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'invoice-checklist-value',
        title: 'Value Statement',
        content: 'Checklist visibility on invoices shows customers exactly what was done. It builds trust, reduces disputes, and provides documentation if questions arise later.',
      },
      {
        id: 'invoice-checklist-guidance',
        title: 'Guidance',
        content: 'Show how completed job checklists appear on invoices. Configure which checklists are customer-visible vs. internal. Demonstrate how customers see the completed checklist when viewing their invoice.',
      },
    ],
  },
  {
    id: 'invoice-attachments',
    title: 'Adding attachments to an invoice',
    description: 'Attach files and photos to invoices.',
    type: 'rep_facing',
    category: 'invoicing',
    repInstructions: 'Demonstrate adding photos and file attachments to invoices.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'invoice-attachments-value',
        title: 'Value Statement',
        content: 'Photos on invoices prove the work was done. Before/after pictures, equipment model numbers, and warranty documents give customers confidence and protect you from disputes.',
      },
      {
        id: 'invoice-attachments-guidance',
        title: 'Guidance',
        content: 'Show how to attach photos from job to invoice. Add PDFs like warranty docs or permits. Configure which attachments are customer-visible. Demonstrate customer view with attachments.',
      },
    ],
  },

  // ===========================================================================
  // CATEGORY: SERVICE PLANS (4 items)
  // ===========================================================================
  {
    id: 'service-plans-settings',
    title: 'Settings',
    description: 'Configure service plan settings.',
    type: 'rep_facing',
    category: 'service-plans',
    repInstructions: 'Set up service plan configuration options and defaults.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'service-plans-settings-value',
        title: 'Value Statement',
        content: 'Service plan settings define how your membership program works. Get the foundation right with billing cycles, auto-renewal, and cancellation policies that protect your recurring revenue.',
      },
      {
        id: 'service-plans-settings-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Service Plans. Configure default billing frequency (monthly, annual). Set auto-renewal preferences. Define cancellation policies and prorating rules. Set up payment failure handling.',
      },
    ],
  },
  {
    id: 'service-plans-templates',
    title: 'Templates',
    description: 'Create service plan templates.',
    type: 'rep_facing',
    category: 'service-plans',
    repInstructions: 'Create service plan templates for different service tiers.',
    estimatedMinutes: 15,
    contextSnippets: [
      {
        id: 'service-plans-templates-value',
        title: 'Value Statement',
        content: 'Service plan templates make selling memberships easy. Create tiered options (Bronze, Silver, Gold) with clear benefits so techs can present and close membership sales in the field.',
      },
      {
        id: 'service-plans-templates-guidance',
        title: 'Guidance',
        content: 'Create at least 2-3 plan tiers with different pricing and benefits. Define what\'s included: visits per year, discounts, priority scheduling. Set pricing and billing cycle for each tier. Create compelling plan names.',
      },
    ],
  },
  {
    id: 'edit-delete-service-plan',
    title: 'How to Edit/Delete a Service Plan',
    description: 'Learn how to modify or remove service plans.',
    type: 'rep_facing',
    category: 'service-plans',
    repInstructions: 'Show how to edit existing service plans and properly delete them.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'edit-delete-service-plan-value',
        title: 'Value Statement',
        content: 'Plans evolve as your business grows. Knowing how to properly modify or retire plans protects existing customers while letting you improve your offerings.',
      },
      {
        id: 'edit-delete-service-plan-guidance',
        title: 'Guidance',
        content: 'Show how edits to templates affect existing vs. new subscribers. Demonstrate changing pricing and benefits. Explain how to retire a plan (hide from new sales) vs. delete. Walk through handling existing subscribers on retired plans.',
      },
    ],
  },
  {
    id: 'add-service-plan-customer',
    title: 'Add a Service Plan to a Customer',
    description: 'Assign service plans to customers.',
    type: 'rep_facing',
    category: 'service-plans',
    repInstructions: 'Demonstrate adding service plans to customer accounts.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'add-service-plan-customer-value',
        title: 'Value Statement',
        content: 'Enrolling customers in service plans builds recurring revenue. Each new member represents predictable income and a customer committed to using your services long-term.',
      },
      {
        id: 'add-service-plan-customer-guidance',
        title: 'Guidance',
        content: 'Go to customer profile > Service Plans > Add Plan. Select the plan tier. Set start date and payment method. Show how recurring jobs auto-generate. Demonstrate the customer\'s view of their membership benefits.',
      },
    ],
  },

  // ===========================================================================
  // CATEGORY: ADDITIONAL TOOLS (12 items with sub-items)
  // ===========================================================================
  {
    id: 'material-detail-tracking',
    title: 'Material Detail Tracking',
    description: 'Track materials used on jobs.',
    type: 'rep_facing',
    category: 'additional-tools',
    repInstructions: 'Set up material tracking for job costing and inventory management.',
    estimatedMinutes: 15,
    contextSnippets: [
      {
        id: 'material-detail-tracking-value',
        title: 'Value Statement',
        content: 'Material tracking reveals your true job costs. Know exactly what parts went into each job for accurate costing, warranty tracking, and inventory management.',
      },
      {
        id: 'material-detail-tracking-guidance',
        title: 'Guidance',
        content: 'Enable material tracking in settings. Show how techs log materials used on jobs. Set up cost tracking for purchase vs. sell price. Review job costing reports showing material margins. Explain inventory alerts if applicable.',
      },
    ],
  },
  {
    id: 'checklists',
    title: 'Checklists',
    description: 'Create and use checklists for quality control.',
    type: 'rep_facing',
    category: 'additional-tools',
    repInstructions: 'Create job checklists for consistent service delivery.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'checklists-value',
        title: 'Value Statement',
        content: 'Checklists ensure consistent service quality across your team. Every tech follows the same steps, nothing gets missed, and customers receive the same great experience every time.',
      },
      {
        id: 'checklists-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Checklists. Create checklists for common job types (maintenance, install, diagnostic). Add required photos at key steps. Attach checklists to job templates. Show how techs complete checklists on mobile.',
      },
    ],
  },
  {
    id: 'property-profile',
    title: 'Property Profile',
    description: 'Set up property profiles for detailed location information.',
    type: 'rep_facing',
    category: 'additional-tools',
    repInstructions: 'Configure property profiles with equipment, access codes, and history.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'property-profile-value',
        title: 'Value Statement',
        content: 'Property profiles store critical location details: gate codes, equipment locations, pet warnings, and service history. Techs arrive prepared, impressing customers and working more efficiently.',
      },
      {
        id: 'property-profile-guidance',
        title: 'Guidance',
        content: 'Open a customer address > Property Profile. Show equipment tracking (model, serial, install date). Add access instructions and gate codes. Attach photos of equipment locations. Explain how techs see this info before arriving.',
      },
    ],
  },
  {
    id: 'tasks',
    title: 'Tasks',
    description: 'Use tasks for follow-ups and internal work.',
    type: 'rep_facing',
    category: 'additional-tools',
    repInstructions: 'Set up task management for internal follow-ups and reminders.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'tasks-value',
        title: 'Value Statement',
        content: 'Tasks keep your team organized beyond scheduled jobs. Follow-ups, parts orders, and internal to-dos all tracked in one place so nothing slips through the cracks.',
      },
      {
        id: 'tasks-guidance',
        title: 'Guidance',
        content: 'Show how to create tasks from jobs, customers, or standalone. Assign to team members with due dates. Set up task notifications. Demonstrate task dashboard and filtering. Use tasks for estimate follow-ups and pending parts orders.',
      },
    ],
  },
  {
    id: 'job-fields',
    title: 'Job Fields',
    description: 'Create custom fields for jobs.',
    type: 'rep_facing',
    category: 'additional-tools',
    repInstructions: 'Create custom job fields for capturing specific information.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'job-fields-value',
        title: 'Value Statement',
        content: 'Custom job fields capture the data unique to your business. Track permit numbers, warranty info, or anything else you need - then report on it all.',
      },
      {
        id: 'job-fields-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Custom Fields > Jobs. Create fields relevant to their industry (Permit #, Equipment Type, Warranty Expiration). Set field types (text, number, date, dropdown). Make fields required or optional. Show how fields appear on jobs.',
      },
    ],
  },
  {
    id: 'job-inbox',
    title: 'Job Inbox',
    description: 'Use the job inbox for managing incoming requests.',
    type: 'rep_facing',
    category: 'additional-tools',
    repInstructions: 'Configure and use the job inbox for lead management.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'job-inbox-value',
        title: 'Value Statement',
        content: 'Job inbox centralizes all incoming requests from online booking, forms, and integrations. Never miss a lead - every request lands in one place for quick response.',
      },
      {
        id: 'job-inbox-guidance',
        title: 'Guidance',
        content: 'Go to Job Inbox from main menu. Show how requests flow in from online booking, integrations. Demonstrate converting a request to a job or estimate. Set up notifications for new inbox items. Review inbox for unprocessed leads.',
      },
    ],
  },
  {
    id: 'time-tracking',
    title: 'Time Tracking',
    description: 'Track employee time for payroll and job costing.',
    type: 'rep_facing',
    category: 'additional-tools',
    repInstructions: 'Set up time tracking for employees including clock in/out.',
    estimatedMinutes: 10,
    subItems: [
      { id: 'time-on-job', title: 'Time on Job' },
    ],
    contextSnippets: [
      {
        id: 'time-tracking-value',
        title: 'Value Statement',
        content: 'Accurate time tracking feeds payroll and job costing. Know exactly how long jobs take, identify efficiency opportunities, and pay employees accurately without timesheet hassles.',
      },
      {
        id: 'time-tracking-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Time Tracking. Enable GPS clock-in if desired. Show techs how to clock in/out on mobile. Demonstrate time-on-job tracking linked to specific jobs. Review time reports and export for payroll.',
      },
    ],
  },
  {
    id: 'online-booking',
    title: 'Online Booking',
    description: 'Set up online booking for customers.',
    type: 'rep_facing',
    category: 'additional-tools',
    repInstructions: 'Configure online booking settings and availability.',
    estimatedMinutes: 20,
    subItems: [
      { id: 'olb-windows', title: 'OLB Windows' },
      { id: 'employee-availability', title: 'Employee Availability' },
      { id: 'poc', title: 'POC' },
      { id: 'services-available-olb', title: 'Services Available for OLB' },
    ],
    contextSnippets: [
      {
        id: 'online-booking-value',
        title: 'Value Statement',
        content: 'Online booking lets customers schedule 24/7 without calling. Capture after-hours leads, reduce phone time, and give customers the convenience they expect from modern businesses.',
      },
      {
        id: 'online-booking-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Online Booking. Enable and configure booking windows (arrival time windows offered). Set employee availability for online jobs. Configure which services are bookable online. Add booking widget to website. Show POC (point of contact) settings.',
      },
    ],
  },

  // ===========================================================================
  // CATEGORY: REPORTING (7 items)
  // ===========================================================================
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Learn to use and customize the dashboard.',
    type: 'rep_facing',
    category: 'reporting',
    repInstructions: 'Walk through dashboard features and key metrics.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'dashboard-value',
        title: 'Value Statement',
        content: 'Your dashboard is mission control for your business. See revenue, jobs, and key metrics at a glance. Spot problems early and celebrate wins as they happen.',
      },
      {
        id: 'dashboard-guidance',
        title: 'Guidance',
        content: 'Walk through dashboard widgets: revenue, jobs today, outstanding invoices. Show how to customize widget layout. Explain each key metric and what it tells you. Set up date range comparisons to track growth.',
      },
    ],
  },
  {
    id: 'filtering-tags',
    title: 'Filtering Customer/Job Tags',
    description: 'Use tags to filter reports and views.',
    type: 'rep_facing',
    category: 'reporting',
    repInstructions: 'Demonstrate using tags to filter reports and views.',
    estimatedMinutes: 5,
    contextSnippets: [
      {
        id: 'filtering-tags-value',
        title: 'Value Statement',
        content: 'Tag filtering lets you slice your data any way you need. See revenue by service type, jobs by lead source, or customers by segment - whatever matters to your business.',
      },
      {
        id: 'filtering-tags-guidance',
        title: 'Guidance',
        content: 'Show how to filter customer list by tags. Filter jobs by service type tags. Apply tag filters in reports to isolate specific data. Save commonly used filter combinations for quick access.',
      },
    ],
  },
  {
    id: 'tags-reporting',
    title: 'Tags-Reporting',
    description: 'Generate reports based on tags.',
    type: 'rep_facing',
    category: 'reporting',
    repInstructions: 'Show how to create reports filtered by customer and job tags.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'tags-reporting-value',
        title: 'Value Statement',
        content: 'Tag-based reports reveal business insights you can\'t see otherwise. Which service types are most profitable? Which lead sources convert best? Tags hold the answers.',
      },
      {
        id: 'tags-reporting-guidance',
        title: 'Guidance',
        content: 'Go to Reports. Create a report filtered by job tags. Show revenue breakdown by service type. Compare lead source performance. Export tag-based reports for deeper analysis or sharing with partners.',
      },
    ],
  },
  {
    id: 'tech-leaderboard',
    title: 'Tech Leaderboard',
    description: 'Use the tech leaderboard for performance tracking.',
    type: 'rep_facing',
    category: 'reporting',
    repInstructions: 'Explain the tech leaderboard and performance metrics.',
    estimatedMinutes: 10,
    contextSnippets: [
      {
        id: 'tech-leaderboard-value',
        title: 'Value Statement',
        content: 'The tech leaderboard drives healthy competition and identifies coaching opportunities. See who\'s crushing it and who needs support - all with objective, real-time data.',
      },
      {
        id: 'tech-leaderboard-guidance',
        title: 'Guidance',
        content: 'Go to Reports > Tech Leaderboard. Review metrics: revenue, jobs completed, average ticket, membership sales. Explain how to use for team meetings and individual coaching. Show how techs can see their own stats on mobile.',
      },
    ],
  },
  {
    id: 'job-costing',
    title: 'Job Costing',
    description: 'Track job costs and profitability.',
    type: 'rep_facing',
    category: 'reporting',
    repInstructions: 'Set up job costing for tracking labor and materials.',
    estimatedMinutes: 15,
    contextSnippets: [
      {
        id: 'job-costing-value',
        title: 'Value Statement',
        content: 'Job costing reveals your true profit on every job. Know which services make money and which need repricing. Make data-driven decisions about what work to pursue.',
      },
      {
        id: 'job-costing-guidance',
        title: 'Guidance',
        content: 'Go to Reports > Job Costing. Set up labor costs (loaded rate per tech or average). Configure material cost tracking. Review job profitability reports. Identify low-margin jobs and discuss pricing adjustments.',
      },
    ],
  },
  {
    id: 'commissions',
    title: 'Commissions',
    description: 'Set up and track sales commissions.',
    type: 'rep_facing',
    category: 'reporting',
    repInstructions: 'Configure commission tracking and reporting.',
    estimatedMinutes: 15,
    contextSnippets: [
      {
        id: 'commissions-value',
        title: 'Value Statement',
        content: 'Automated commission tracking motivates your team and ensures accurate pay. Techs see their earnings in real-time, and you save hours calculating payouts.',
      },
      {
        id: 'commissions-guidance',
        title: 'Guidance',
        content: 'Go to Settings > Commissions. Set up commission structures (flat fee, percentage, tiered). Assign to team members by role. Show commission reports. Demonstrate how techs see their commission earnings on mobile.',
      },
    ],
  },
  {
    id: 'custom-reports',
    title: 'Custom Reports',
    description: 'Create custom reports for specific needs.',
    type: 'rep_facing',
    category: 'reporting',
    repInstructions: 'Show how to create custom reports with specific filters and metrics.',
    estimatedMinutes: 15,
    contextSnippets: [
      {
        id: 'custom-reports-value',
        title: 'Value Statement',
        content: 'Custom reports answer the specific questions your business has. Build exactly the report you need, save it, and run it anytime to track what matters most to you.',
      },
      {
        id: 'custom-reports-guidance',
        title: 'Guidance',
        content: 'Go to Reports > Custom Reports. Create a new report selecting fields that matter to them. Add filters and groupings. Save the report for future use. Set up scheduled email delivery for regular reports they need.',
      },
    ],
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

// Helper to get items by category
export function getOnboardingItemsByCategory(category: string): OnboardingItemDefinition[] {
  return onboardingItems.filter(item => item.category === category);
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

  // Account Setup
  COMPANY_PROFILE: 'company-profile',
  BUSINESS_HOURS: 'business-hours',
  ADD_EMPLOYEES: 'add-employees',
  NOTIFICATIONS_SETTINGS: 'notifications-settings',
  CUSTOM_SMS: 'custom-sms',
  ESTIMATES_SETTINGS: 'estimates-settings',
  INVOICE_SETTINGS: 'invoice-settings',
  CONNECT_BANK_ACCOUNT: 'connect-bank-account',
  CONSUMER_FINANCING: 'consumer-financing',

  // The Basics
  ADD_NEW_CUSTOMERS: 'add-new-customers',
  CUSTOMER_PROFILE_DETAILS: 'customer-profile-details',
  CUSTOMER_PORTAL: 'customer-portal',
  CUSTOMER_TAGS: 'customer-tags',
  CC_ON_FILE: 'cc-on-file',
  PARENT_CHILD_BILLING: 'parent-child-billing',
  MULTIPLE_ADDRESSES: 'multiple-addresses',
  CUSTOMER_NOTIFICATIONS: 'customer-notifications',

  // Add Ons
  PIPELINE: 'pipeline',
  PROFIT_RHINO: 'profit-rhino',
  MARKETING_CENTER: 'marketing-center',
  VOICE_CALL_TRACKING: 'voice-call-tracking',
  HCPA: 'hcpa',
  PAYROLL: 'payroll',
  CONQUER: 'conquer',
  INHA_ACCOUNTING: 'inha-accounting',

  // Estimates (category)
  CUSTOMER_INTAKE_ESTIMATES: 'customer-intake-estimates',
  ESTIMATES_BASICS: 'estimates-basics',
  ESTIMATE_TEMPLATES: 'estimate-templates',
  MULTI_OPTION_ESTIMATES: 'multi-option-estimates',
  SALES_PROPOSAL_TOOL: 'sales-proposal-tool',

  // Jobs
  CUSTOMER_INTAKE_JOBS: 'customer-intake-jobs',
  JOBS_BASICS: 'jobs-basics',
  JOB_TAGS: 'job-tags',
  JOB_TEMPLATES: 'job-templates',
  MULTI_DAY_APPOINTMENTS: 'multi-day-appointments',
  SEGMENTS: 'segments',
  RECURRING_JOBS: 'recurring-jobs',
  SCHEDULING_DISPATCHING: 'scheduling-dispatching',
  CALENDAR_SETTINGS: 'calendar-settings',

  // Invoicing (category)
  PROCESSING_PAYMENTS: 'processing-payments',
  PROGRESS_INVOICING: 'progress-invoicing',
  CANCEL_EDIT_INVOICE: 'cancel-edit-invoice',
  AUTO_INVOICING: 'auto-invoicing',
  BATCHED_INVOICES: 'batched-invoices',
  INVOICE_CHECKLIST: 'invoice-checklist',
  INVOICE_ATTACHMENTS: 'invoice-attachments',

  // Service Plans
  SERVICE_PLANS_SETTINGS: 'service-plans-settings',
  SERVICE_PLANS_TEMPLATES: 'service-plans-templates',
  EDIT_DELETE_SERVICE_PLAN: 'edit-delete-service-plan',
  ADD_SERVICE_PLAN_CUSTOMER: 'add-service-plan-customer',

  // Additional Tools
  PRICEBOOK: 'pricebook',
  MATERIAL_DETAIL_TRACKING: 'material-detail-tracking',
  CHECKLISTS: 'checklists',
  PROPERTY_PROFILE: 'property-profile',
  TASKS: 'tasks',
  JOB_FIELDS: 'job-fields',
  JOB_INBOX: 'job-inbox',
  TIME_TRACKING: 'time-tracking',
  ONLINE_BOOKING: 'online-booking',
  REVIEWS_TOOL: 'reviews-tool',

  // Reporting
  DASHBOARD: 'dashboard',
  FILTERING_TAGS: 'filtering-tags',
  TAGS_REPORTING: 'tags-reporting',
  TECH_LEADERBOARD: 'tech-leaderboard',
  JOB_COSTING: 'job-costing',
  COMMISSIONS: 'commissions',
  CUSTOM_REPORTS: 'custom-reports',
} as const;
