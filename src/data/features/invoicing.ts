import type { Feature } from '../../types';

export const invoicingFeature: Feature = {
  id: 'invoicing',
  name: 'Invoicing',
  description: 'Create and send professional invoices to your customers',
  icon: 'Receipt',
  version: '1.2.0',

  stages: {
    // =========================================================================
    // NOT ATTACHED - Pro doesn't have access to invoicing
    // =========================================================================
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.invoicing', negated: true },
          { variable: 'addons.invoicing', negated: true },
        ],
      },

      onboardingItems: [],

      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Look professional to your customers and automate your invoice reminders to ensure you get paid.',
        },
      ],

      navigation: [
        {
          name: 'Invoicing Pricing',
          description: 'Self-serve page where pros can learn about invoicing pricing and upgrade',
          url: '/pricing/invoicing',
          navigationType: 'hcp_external',
        },
        {
          name: 'How Invoicing Helps You Get Paid Faster',
          description: 'Overview article explaining the invoicing feature benefits',
          url: 'https://help.housecallpro.com/invoicing-overview',
          navigationType: 'hcp_help',
        },
        {
          name: 'Invoicing Feature Tour',
          description: 'Video walkthrough of invoicing features and workflow',
          url: 'https://www.youtube.com/watch?v=hcp-invoicing-tour',
          navigationType: 'hcp_video',
        },
        {
          name: 'Invoicing Best Practices Guide',
          description: 'Training article with tips for getting paid faster with invoicing',
          url: 'https://help.housecallpro.com/invoicing-best-practices',
          navigationType: 'hcp_help',
        },
      ],

      calendlyTypes: [
        {
          name: 'Talk to Sales',
          url: 'https://calendly.com/hcp-sales/invoicing-demo',
          team: 'sales',
          description: 'Learn how invoicing can help your business get paid faster',
        },
      ],

      prompt: `You are helping a home service professional understand the value of Housecall Pro's invoicing feature.

Key value proposition: "Look professional to your customers and automate your invoice reminders to ensure you get paid."

When discussing invoicing:
1. Emphasize the professional appearance it gives their business
2. Highlight automated payment reminders that reduce chasing customers
3. Mention faster payment collection (average 2x faster than paper invoices)
4. Offer to check their plan eligibility using the check_plan_eligibility tool
5. If they're interested, use get_upgrade_options to show them their options
6. Guide them through the upgrade with initiate_upgrade when ready

Be conversational and helpful, not pushy. Focus on solving their payment collection challenges.`,

      tools: [
        {
          name: 'check_plan_eligibility',
          description: 'Check if the pro is eligible to add invoicing to their current plan',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'get_upgrade_options',
          description: 'Get available plan upgrade options that include invoicing',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'initiate_upgrade',
          description: 'Start the plan upgrade process for the pro',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            targetPlan: { type: 'string', description: 'The plan to upgrade to', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ATTACHED - Pro has access but hasn't completed required setup
    // =========================================================================
    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.invoicing', negated: false },
          { variable: 'invoicing.setup_complete', negated: true },
        ],
      },

      onboardingItems: [
        { itemId: 'create-first-customer', required: true },
        { itemId: 'create-first-job', required: true },
        { itemId: 'complete-first-job', required: true, stageSpecificNote: 'Completing a job generates the invoice automatically' },
        { itemId: 'rep-intro-call-completed', required: false },
      ],

      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Get started with invoicing in 3 simple steps: create a customer, create a job, and complete the job to generate your first invoice.',
        },
      ],

      navigation: [
        {
          name: 'Customers',
          description: 'Add and manage your customer list',
          url: '/customers',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Jobs',
          description: 'Create and manage jobs for your customers',
          url: '/jobs',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Invoices',
          description: 'View and send invoices',
          url: '/invoices',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Creating Your First Customer',
          description: 'Video tutorial on adding customers to your account',
          url: 'https://www.youtube.com/watch?v=hcp-create-customer',
          navigationType: 'hcp_video',
        },
        {
          name: 'Jobs Workflow Guide',
          description: 'Video explaining how to create and complete jobs',
          url: 'https://www.youtube.com/watch?v=hcp-jobs-workflow',
          navigationType: 'hcp_video',
        },
      ],

      calendlyTypes: [
        {
          name: 'Invoicing Setup Help',
          url: 'https://calendly.com/hcp-onboarding/invoicing-setup',
          team: 'onboarding',
          description: 'Get help setting up your invoicing workflow',
        },
      ],

      prompt: `You are helping a home service professional set up invoicing in Housecall Pro.

They have access to invoicing but need to complete these steps before sending their first invoice:
1. Create a customer
2. Create a job for that customer
3. Mark the job as done (this generates the invoice)

Use the available tools to help them:
- Use get_setup_progress to see what they've already done
- Use create_customer to add their first customer
- Use create_job to create a job for that customer
- Use complete_job to mark the job done

Guide them step-by-step. After each action, confirm what was done and explain the next step.
Be encouraging - they're almost ready to send their first professional invoice!`,

      tools: [
        {
          name: 'create_customer',
          description: 'Create a new customer in the pro\'s account',
          parameters: {
            name: { type: 'string', description: 'Customer name', required: true },
            email: { type: 'string', description: 'Customer email' },
            phone: { type: 'string', description: 'Customer phone number' },
            address: { type: 'string', description: 'Customer address' },
          },
        },
        {
          name: 'create_job',
          description: 'Create a new job for an existing customer',
          parameters: {
            customerId: { type: 'string', description: 'The customer ID', required: true },
            description: { type: 'string', description: 'Job description', required: true },
            scheduledDate: { type: 'string', description: 'When the job is scheduled' },
            lineItems: { type: 'array', description: 'Services and prices for the job' },
          },
        },
        {
          name: 'complete_job',
          description: 'Mark a job as completed',
          parameters: {
            jobId: { type: 'string', description: 'The job ID to complete', required: true },
          },
        },
        {
          name: 'get_setup_progress',
          description: 'Check which invoicing setup steps the pro has completed',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ACTIVATED - Pro has completed setup, ready to send invoices
    // =========================================================================
    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'invoicing.setup_complete', negated: false },
          { variable: 'invoicing.sent_count', negated: true }, // Less than threshold
        ],
      },

      onboardingItems: [
        { itemId: 'send-first-invoice', required: true },
        { itemId: 'add-company-logo', required: false, stageSpecificNote: 'Makes invoices look more professional' },
        { itemId: 'setup-payment-reminders', required: false },
      ],

      contextSnippets: [
        {
          id: 'ready-to-go',
          title: 'Ready to Go',
          content: 'You\'re all set up! Send your first invoice and start getting paid faster.',
        },
        {
          id: 'pro-tip',
          title: 'Pro Tip',
          content: 'Add your company logo and set up payment reminders to look professional and reduce late payments.',
        },
      ],

      navigation: [
        {
          name: 'Invoices',
          description: 'View, send, and manage invoices',
          url: '/invoices',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Invoice Settings',
          description: 'Customize invoice appearance and reminders',
          url: '/settings/invoicing',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Branding Settings',
          description: 'Add your logo and customize colors',
          url: '/settings/branding',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [
        {
          name: 'Invoicing Best Practices',
          url: 'https://calendly.com/hcp-success/invoicing-tips',
          team: 'support',
          description: 'Learn tips to get paid faster',
        },
      ],

      prompt: `You are helping a home service professional who has invoicing set up and is ready to use it.

Encourage them to:
1. Send their first invoice if they haven't yet
2. Add their logo for a professional look
3. Set up payment reminders to get paid faster
4. Enable online payments for customer convenience

Use the tools to help them send invoices and manage payments.
Celebrate their progress - they're on their way to getting paid faster!`,

      tools: [
        {
          name: 'send_invoice',
          description: 'Send an invoice to a customer',
          parameters: {
            invoiceId: { type: 'string', description: 'The invoice ID to send', required: true },
            method: { type: 'string', description: 'Delivery method: email or sms' },
          },
        },
        {
          name: 'get_unpaid_invoices',
          description: 'Get list of unpaid invoices',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'send_payment_reminder',
          description: 'Send a payment reminder for an overdue invoice',
          parameters: {
            invoiceId: { type: 'string', description: 'The invoice ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ENGAGED - Pro is actively using invoicing
    // =========================================================================
    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'invoicing.sent_count', negated: false }, // Above threshold
          { variable: 'invoicing.recent_activity', negated: false },
        ],
      },

      onboardingItems: [],

      contextSnippets: [
        {
          id: 'success',
          title: 'Success',
          content: 'You\'re using invoicing like a pro! Here are some advanced tips to get paid even faster.',
        },
        {
          id: 'advanced-tip',
          title: 'Advanced Tip',
          content: 'Use invoice templates for common job types to save time. Set up recurring invoices for repeat customers.',
        },
      ],

      navigation: [
        {
          name: 'Invoices',
          description: 'View, send, and manage invoices',
          url: '/invoices',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Aging Report',
          description: 'Track overdue invoices and collections',
          url: '/reports/aging',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Invoice Templates',
          description: 'Create templates for common job types',
          url: '/settings/invoicing/templates',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [
        {
          name: 'Success Check-in',
          url: 'https://calendly.com/hcp-success/check-in',
          team: 'support',
          description: 'Review your invoicing success and get advanced tips',
        },
      ],

      prompt: `You are helping an experienced invoicing user get even more value from the feature.

They're already successfully using invoicing. Help them with:
1. Advanced tips like invoice templates and recurring invoices
2. Troubleshooting any payment collection issues
3. Answering power-user questions
4. Identifying opportunities for related features (payments, financing)

Celebrate their success and help them optimize their workflow.`,

      tools: [
        {
          name: 'get_invoice_analytics',
          description: 'Get invoicing performance metrics',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            period: { type: 'string', description: 'Time period: week, month, quarter' },
          },
        },
        {
          name: 'create_invoice_template',
          description: 'Create a reusable invoice template',
          parameters: {
            name: { type: 'string', description: 'Template name', required: true },
            lineItems: { type: 'array', description: 'Default line items' },
          },
        },
      ],
    },
  },
};
