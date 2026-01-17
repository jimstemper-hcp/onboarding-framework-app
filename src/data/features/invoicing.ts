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
      conditions: [
        'Pro does not have Invoicing feature in their current plan',
        'Pro has not purchased Invoicing as an add-on',
      ],

      valueProp:
        'Look professional to your customers and automate your invoice reminders to ensure you get paid.',

      sellPageUrl: '/pricing/invoicing',

      learnMoreResources: [
        {
          title: 'How Invoicing Helps You Get Paid Faster',
          url: 'https://help.housecallpro.com/invoicing-overview',
          type: 'article',
        },
        {
          title: 'Invoicing Feature Tour',
          url: 'https://www.youtube.com/watch?v=hcp-invoicing-tour',
          type: 'video',
        },
        {
          title: 'Invoicing Best Practices Guide',
          url: 'https://help.housecallpro.com/invoicing-best-practices',
          type: 'guide',
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

      upgradeTools: [
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

      upgradePrompt: `You are helping a home service professional understand the value of Housecall Pro's invoicing feature.

Key value proposition: "Look professional to your customers and automate your invoice reminders to ensure you get paid."

When discussing invoicing:
1. Emphasize the professional appearance it gives their business
2. Highlight automated payment reminders that reduce chasing customers
3. Mention faster payment collection (average 2x faster than paper invoices)
4. Offer to check their plan eligibility using the check_plan_eligibility tool
5. If they're interested, use get_upgrade_options to show them their options
6. Guide them through the upgrade with initiate_upgrade when ready

Be conversational and helpful, not pushy. Focus on solving their payment collection challenges.`,

      repTalkingPoints: [
        'Invoicing lets you look professional and get paid faster with automated reminders',
        'Pros using our invoicing get paid 2x faster on average',
        'You can customize invoices with your logo and branding',
        'Automated reminders mean you spend less time chasing payments',
        'Would you like me to show you how to add invoicing to your account?',
      ],
    },

    // =========================================================================
    // ATTACHED - Pro has access but hasn't completed required setup
    // =========================================================================
    attached: {
      conditions: [
        'Pro has Invoicing feature in their plan',
        'Pro has not completed all required setup tasks',
      ],

      requiredTasks: [
        {
          id: 'invoicing-create-customer',
          title: 'Create your first customer',
          description:
            'Add a customer to your account so you have someone to send invoices to.',
          estimatedMinutes: 2,
          actionUrl: '/customers/new',
          completionEvent: 'customer.created',
        },
        {
          id: 'invoicing-create-job',
          title: 'Create a job',
          description:
            'Create a job for your customer. Jobs track the work you do and generate invoices.',
          estimatedMinutes: 3,
          actionUrl: '/jobs/new',
          completionEvent: 'job.created',
        },
        {
          id: 'invoicing-complete-job',
          title: 'Mark the job as done',
          description:
            'When you finish the work, mark the job as done to generate an invoice.',
          estimatedMinutes: 1,
          actionUrl: '/jobs',
          completionEvent: 'job.completed',
        },
      ],

      productPages: [
        {
          name: 'Customers',
          path: '/customers',
          description: 'Manage your customer list',
        },
        {
          name: 'Jobs',
          path: '/jobs',
          description: 'Create and manage jobs',
        },
        {
          name: 'Invoices',
          path: '/invoices',
          description: 'View and send invoices',
        },
      ],

      tooltipUrls: [
        '/tooltips/create-customer',
        '/tooltips/create-job',
        '/tooltips/complete-job',
      ],

      videos: [
        {
          title: 'Creating Your First Customer',
          url: 'https://www.youtube.com/watch?v=hcp-create-customer',
          durationSeconds: 120,
        },
        {
          title: 'Creating and Completing Jobs',
          url: 'https://www.youtube.com/watch?v=hcp-jobs-workflow',
          durationSeconds: 180,
        },
        {
          title: 'Sending Your First Invoice',
          url: 'https://www.youtube.com/watch?v=hcp-send-invoice',
          durationSeconds: 150,
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

      mcpTools: [
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

      agenticPrompt: `You are helping a home service professional set up invoicing in Housecall Pro.

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

      repTalkingPoints: [
        'I see you have invoicing but haven\'t sent your first invoice yet',
        'You need to create a customer and complete a job first - it only takes a few minutes',
        'Would you like me to walk you through creating your first customer?',
        'Once you complete a job, the invoice is automatically generated',
        'I can book you a call with our onboarding team if you\'d prefer hands-on help',
      ],
    },

    // =========================================================================
    // ACTIVATED - Pro has completed setup, ready to send invoices
    // =========================================================================
    activated: {
      conditions: [
        'Pro has completed all required setup tasks',
        'Pro has sent fewer than 5 invoices',
      ],

      optionalTasks: [
        {
          id: 'invoicing-add-logo',
          title: 'Add your company logo',
          description: 'Make your invoices look more professional with your logo',
          estimatedMinutes: 2,
          actionUrl: '/settings/branding',
          completionEvent: 'branding.logo_uploaded',
        },
        {
          id: 'invoicing-setup-reminders',
          title: 'Configure payment reminders',
          description: 'Set up automatic reminders so customers pay on time',
          estimatedMinutes: 3,
          actionUrl: '/settings/invoicing/reminders',
          completionEvent: 'invoicing.reminders_configured',
        },
        {
          id: 'invoicing-add-payment-method',
          title: 'Enable online payments',
          description: 'Let customers pay invoices online with credit card',
          estimatedMinutes: 5,
          actionUrl: '/settings/payments',
          completionEvent: 'payments.method_added',
        },
      ],

      productPages: [
        {
          name: 'Invoices',
          path: '/invoices',
          description: 'View, send, and manage invoices',
        },
        {
          name: 'Invoice Settings',
          path: '/settings/invoicing',
          description: 'Customize invoice appearance and reminders',
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

      mcpTools: [
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

      engagementPrompt: `You are helping a home service professional who has invoicing set up and is ready to use it.

Encourage them to:
1. Send their first invoice if they haven't yet
2. Add their logo for a professional look
3. Set up payment reminders to get paid faster
4. Enable online payments for customer convenience

Use the tools to help them send invoices and manage payments.
Celebrate their progress - they're on their way to getting paid faster!`,

      repTalkingPoints: [
        'Great news - you\'re all set up to send invoices!',
        'Have you sent your first invoice yet? I can help you with that',
        'Pro tip: Adding your logo makes invoices look more professional',
        'Setting up automatic payment reminders can really help with collections',
        'Would you like to enable online payments? Customers love paying by card',
      ],
    },

    // =========================================================================
    // ENGAGED - Pro is actively using invoicing
    // =========================================================================
    engaged: {
      conditions: [
        'Pro has sent 5 or more invoices',
        'Pro has used Invoicing within the last 30 days',
      ],

      advancedTips: [
        'Use invoice templates for common job types to save time',
        'Set up recurring invoices for repeat customers',
        'Review your aging report weekly to catch overdue invoices early',
        'Consider offering a small discount for early payment',
        'Use the mobile app to send invoices right from the job site',
      ],

      successMetrics: [
        'Average time to payment under 7 days',
        'Less than 10% of invoices overdue',
        'Online payment adoption over 50%',
      ],

      upsellOpportunities: [
        'Upgrade to accept ACH payments for lower fees',
        'Add automated follow-up campaigns for overdue invoices',
        'Enable financing options for larger jobs',
      ],

      repTalkingPoints: [
        'Great job! You\'re using invoicing like a pro',
        'I see you\'ve sent [X] invoices - your customers must love the professional look',
        'Have you tried setting up recurring invoices for your repeat customers?',
        'Your average time to payment is looking good - want some tips to make it even faster?',
        'You might be interested in our ACH payment option for lower transaction fees',
      ],
    },
  },
};
