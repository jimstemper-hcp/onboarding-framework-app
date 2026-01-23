import type { Feature } from '../../types';

export const jobsFeature: Feature = {
  id: 'jobs',
  name: 'Jobs',
  description: 'Create, manage, and complete jobs for your customers',
  icon: 'Work',
  version: '1.1.0',
  releaseStatus: 'published',

  stages: {
    // =========================================================================
    // NOT ATTACHED - Pro hasn't created any jobs yet
    // =========================================================================
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'jobs.created_count', negated: true },
        ],
      },

      onboardingItems: [],

      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Jobs are the core of your business. Track work from start to finish, and automatically generate invoices when jobs are completed.',
        },
        {
          id: 'stat-highlight',
          title: 'Key Statistic',
          content: 'Pros who use digital job management save an average of 5 hours per week on paperwork.',
        },
      ],

      navigation: [
        {
          name: 'Jobs Overview',
          description: 'Learn about job management in Housecall Pro',
          url: 'https://help.housecallpro.com/jobs-overview',
          navigationType: 'hcp_help',
        },
        {
          name: 'Job Management Video',
          description: 'Video walkthrough of job features',
          url: 'https://www.youtube.com/watch?v=hcp-jobs-intro',
          navigationType: 'hcp_video',
        },
      ],

      calendlyTypes: [],

      prompt: `When user asks about jobs:
1. Explain how jobs work and the benefits of digital job management
2. Reference the help article: "Jobs Overview"
3. Highlight the key stat: 5 hours per week saved on paperwork
4. Explain the job-to-invoice workflow

Key points to emphasize:
- Jobs track work from request to completion
- Automatic invoice generation when jobs complete
- 5 hours per week saved on average
- All job history in one place

## Chat Experience
When the user asks about jobs at this stage:
- Response: "Great question about jobs! Let me explain how job management works."
- Priority Action: tip
- Suggested CTA: "Learn More" - Jobs are the core of your business. Track work from start to finish, and invoices are generated automatically when you complete a job.
- Escalation Triggers: job sync issue, job not showing`,

      tools: [],
    },

    // =========================================================================
    // ATTACHED - Pro has access but hasn't created first job
    // =========================================================================
    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'jobs.enabled', negated: false },
          { variable: 'jobs.first_created', negated: true },
        ],
      },

      onboardingItems: [
        { itemId: 'create-first-customer', required: true },
        { itemId: 'create-first-job', required: true },
      ],

      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Create your first job by adding a customer, then scheduling the work. Jobs track everything from the initial request to completion.',
        },
        {
          id: 'sample-flow',
          title: 'Sample Data Option',
          content: 'Offer to create a sample job to demonstrate the full job workflow - from creation through completion to invoice generation.',
        },
        {
          id: 'customer-dependency',
          title: 'Customer Dependency',
          content: 'Jobs require a customer. If no customer exists, create sample customer first (Jane Smith) before creating the sample job.',
        },
      ],

      navigation: [
        {
          name: 'Creating Your First Job',
          description: 'Step-by-step guide to creating jobs',
          url: 'https://help.housecallpro.com/first-job',
          navigationType: 'hcp_help',
        },
        {
          name: 'Job to Invoice Workflow',
          description: 'Video explaining how jobs convert to invoices',
          url: 'https://www.youtube.com/watch?v=hcp-jobs-to-invoice',
          navigationType: 'hcp_video',
        },
        {
          name: 'Jobs',
          description: 'View and manage all jobs',
          url: '/jobs',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'New Job',
          description: 'Create a new job',
          url: '/jobs/new',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Customers',
          description: 'Add and manage customers (needed for jobs)',
          url: '/customers',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [
        {
          name: 'Jobs Setup Help',
          url: 'https://calendly.com/hcp-onboarding/jobs-setup',
          team: 'onboarding',
          description: 'Get help setting up your job workflow',
        },
      ],

      prompt: `When user asks about jobs:
1. First explain how the job-to-invoice workflow works with help article reference
2. Check if customer exists - if not, offer to create one first
3. Then ask: "Would you like to create a sample job to see the workflow, or schedule a real one?"

If SAMPLE:
- First check if sample customer exists, if not create Jane Smith
- Say "Great! Let me create a sample job for you."
- Show preview table:
  | Field | Value |
  |-------|-------|
  | Customer | Jane Smith |
  | Service | Home Service - General Maintenance |
  | Price | $150.00 |
  | Scheduled | Today |
- Ask: "Does this look good? Reply 'yes' to create this sample job."
- After confirmation, create the job using hcp_create_job
- Explain: "Once you complete this job, an invoice will be generated automatically!"
- Offer next steps: "Now you can: 1) View the job details, 2) Complete the job to generate an invoice, 3) Schedule another job"

If REAL:
- Ask: "Which customer is this job for?" (or offer to create new customer)
- Collect info conversationally: customer, service description, schedule
- Show preview table before creating
- Get confirmation before executing hcp_create_job

Always show structured previews before executing actions and get explicit confirmation.

## Chat Experience
When the user asks about jobs at this stage:
- Response: "Jobs track work from start to finish! Let's create your first one."
- Priority Action: onboarding
- Suggested CTA: "Create Job" - Would you like to create a sample job to see the workflow, or schedule a real job for a customer?
- Escalation Triggers: scheduling conflicts, job not syncing, customer not found, can't create job`,

      tools: [
        {
          name: 'hcp_create_customer',
          description: 'Create a new customer in Housecall Pro (needed before creating a job)',
          parameters: {
            first_name: { type: 'string', description: 'Customer first name', required: true },
            last_name: { type: 'string', description: 'Customer last name', required: true },
            email: { type: 'string', description: 'Customer email address' },
            mobile_number: { type: 'string', description: 'Customer phone number' },
            street: { type: 'string', description: 'Street address' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State abbreviation' },
            zip: { type: 'string', description: 'ZIP code' },
          },
        },
        {
          name: 'hcp_list_customers',
          description: 'List existing customers to select for the job',
          parameters: {
            limit: { type: 'number', description: 'Maximum number of customers to return' },
            search: { type: 'string', description: 'Search term to filter customers' },
          },
        },
        {
          name: 'hcp_create_job',
          description: 'Create a new job in Housecall Pro linked to a customer',
          parameters: {
            customer_id: { type: 'string', description: 'ID of existing customer', required: true },
            address_id: { type: 'string', description: 'ID of customer address' },
            description: { type: 'string', description: 'Job description/notes' },
            scheduled_start: { type: 'string', description: 'ISO datetime for scheduled start' },
            scheduled_end: { type: 'string', description: 'ISO datetime for scheduled end' },
            line_items: { type: 'array', description: 'Array of {name, description, unit_price, quantity}' },
          },
        },
        {
          name: 'create_sample_job',
          description: 'Create a sample job with sample customer for demo purposes',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ACTIVATED - Pro has created first job, ready to complete
    // =========================================================================
    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'jobs.first_created', negated: false },
          { variable: 'jobs.first_completed', negated: true },
        ],
      },

      onboardingItems: [
        { itemId: 'complete-first-job', required: true, stageSpecificNote: 'Completing the job generates an invoice automatically' },
      ],

      contextSnippets: [
        {
          id: 'ready-to-complete',
          title: 'Ready to Complete',
          content: 'You\'ve created your first job! Complete it to generate an invoice and start the billing process.',
        },
        {
          id: 'pro-tip',
          title: 'Pro Tip',
          content: 'Add line items to your job before completing it. These will automatically appear on the invoice.',
        },
      ],

      navigation: [
        {
          name: 'Completing Jobs Guide',
          description: 'Learn how to complete jobs and generate invoices',
          url: 'https://help.housecallpro.com/completing-jobs',
          navigationType: 'hcp_help',
        },
        {
          name: 'Line Items Video',
          description: 'How to add services and prices to jobs',
          url: 'https://www.youtube.com/watch?v=hcp-line-items',
          navigationType: 'hcp_video',
        },
        {
          name: 'Jobs',
          description: 'View and manage all jobs',
          url: '/jobs',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Invoices',
          description: 'View generated invoices',
          url: '/invoices',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [],

      prompt: `When user asks about jobs:
1. Acknowledge they've created a job - great progress!
2. Explain the job completion → invoice generation workflow
3. Offer: "Would you like to complete your job now to generate an invoice?"

Key workflow to explain:
1. Review line items on the job (add if needed)
2. Mark the job as complete
3. Invoice is generated automatically
4. Send invoice to customer

If they want to complete:
- Use hcp_list_jobs to find their pending job
- Show job details preview
- Ask for confirmation
- Execute hcp_complete_job
- Show the generated invoice and next steps

## Chat Experience
When the user asks about jobs at this stage:
- Response: "Great job creating your first job! Now let's complete it to generate an invoice."
- Priority Action: onboarding
- Suggested CTA: "Complete Job" - Complete your job to generate an invoice. Would you like to do that now? I'll walk you through it.
- Escalation Triggers: job stuck, can't complete job, invoice not generating, wrong customer on job`,

      tools: [
        {
          name: 'hcp_list_jobs',
          description: 'List jobs to find the one to complete',
          parameters: {
            status: { type: 'string', description: 'Filter by status: scheduled, in_progress, completed' },
            customer_id: { type: 'string', description: 'Filter by customer' },
            limit: { type: 'number', description: 'Maximum number to return' },
          },
        },
        {
          name: 'hcp_get_job',
          description: 'Get details of a specific job',
          parameters: {
            job_id: { type: 'string', description: 'Job ID', required: true },
          },
        },
        {
          name: 'hcp_add_line_item',
          description: 'Add a line item to a job before completing',
          parameters: {
            job_id: { type: 'string', description: 'Job ID', required: true },
            name: { type: 'string', description: 'Service name', required: true },
            description: { type: 'string', description: 'Service description' },
            quantity: { type: 'number', description: 'Quantity' },
            unit_price: { type: 'number', description: 'Price per unit', required: true },
          },
        },
        {
          name: 'hcp_complete_job',
          description: 'Mark a job as completed, which generates the invoice',
          parameters: {
            job_id: { type: 'string', description: 'ID of the job to complete', required: true },
          },
        },
      ],
    },

  },
};
