import type { Feature } from '../../types';

export const invoicingFeature: Feature = {
  id: 'invoicing',
  name: 'Invoicing',
  description: 'Create and send professional invoices to your customers',
  icon: 'Receipt',
  version: '1.2.0',
  releaseStatus: 'published',

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
        {
          id: 'stat-highlight',
          title: 'Key Statistic',
          content: 'Pros using Housecall Pro invoicing get paid 2x faster than those using paper invoices.',
        },
      ],

      navigation: [
        {
          name: 'Getting Started with Invoicing',
          description: 'Complete guide to creating and sending professional invoices',
          url: 'https://help.housecallpro.com/invoicing-getting-started',
          navigationType: 'hcp_help',
        },
        {
          name: 'Invoice Best Practices Video',
          description: 'Video walkthrough of invoice features and tips for getting paid faster',
          url: 'https://www.youtube.com/watch?v=hcp-invoice-tips',
          navigationType: 'hcp_video',
        },
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
      ],

      calendlyTypes: [
        {
          name: 'Invoicing Demo',
          url: 'https://calendly.com/hcp-sales/invoicing-demo',
          team: 'sales',
          description: 'Learn how invoicing can help your business get paid faster',
        },
      ],

      prompt: `When user asks about invoicing:
1. First, explain how invoicing helps pros get paid faster with professional invoices
2. Reference the help article: "Getting Started with Invoicing"
3. Mention the key statistic: pros get paid 2x faster with digital invoices
4. Then say: "I notice you don't have invoicing enabled yet. I can schedule a call with our team to show you how it works and get you set up. Would you like to book a time?"
5. If yes, provide the Calendly link for sales

Key points to emphasize:
- Professional appearance builds customer trust
- Automated payment reminders reduce chasing customers
- Customers can pay online with one click
- Average 2x faster payment collection than paper invoices

## Chat Experience
When the user asks about invoicing at this stage:
- Response: "Great question about invoicing! Let me explain how it works."
- Priority Action: call
- Suggested CTA: "Schedule Demo" - Invoicing isn't enabled on your account yet. I can schedule a quick call with our team to show you how pros are getting paid 2x faster with professional invoices.
- Escalation Triggers: speak to someone, talk to sales, pricing question`,

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
          name: 'schedule_sales_call',
          description: 'Schedule a sales demo call to learn about invoicing',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            preferredTime: { type: 'string', description: 'Preferred time slot' },
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
        {
          id: 'sample-flow',
          title: 'Sample Data Option',
          content: 'Offer to walk through with sample data to demonstrate the full invoice workflow without affecting real customer data.',
        },
        {
          id: 'image-upload-capability',
          title: 'Invoice Image Upload',
          content: 'Users can upload a photo or screenshot of an existing invoice, receipt, or estimate. The AI will use the extract_invoice_from_image tool to analyze the image and extract: customer name, address, phone, email, line items with descriptions and prices, and totals. After extraction, show the data in a structured preview and ask for confirmation before creating the customer, job, and invoice using the hcp_create_customer, hcp_create_job, and hcp_complete_job tools.',
        },
      ],

      navigation: [
        {
          name: 'Creating Your First Invoice',
          description: 'Step-by-step guide for your first invoice',
          url: 'https://help.housecallpro.com/first-invoice',
          navigationType: 'hcp_help',
        },
        {
          name: 'Jobs to Invoice Workflow',
          description: 'Video explaining how jobs convert to invoices',
          url: 'https://www.youtube.com/watch?v=hcp-jobs-to-invoice',
          navigationType: 'hcp_video',
        },
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
      ],

      calendlyTypes: [
        {
          name: 'Invoicing Setup Help',
          url: 'https://calendly.com/hcp-onboarding/invoicing-setup',
          team: 'onboarding',
          description: 'Get help setting up your invoicing workflow',
        },
      ],

      prompt: `When user asks about invoicing:
1. First explain how invoicing works with help article reference
2. Then ask: "Would you like to try this with sample data to see how it works, or use your real customer information?"

If SAMPLE:
- Say "Great! Let me create a sample customer for you."
- Show preview table with sample customer data
- Ask: "Does this look good? Reply 'yes' to create this sample customer."
- After confirmation, create sample job with line items
- Show the resulting invoice
- Offer next steps: "Now you can: 1) Upload your logo, 2) Review settings, 3) Send a test invoice"

If REAL:
- Ask: "What's your customer's name?"
- Collect info conversationally OR say "You can also take a photo of any existing paperwork and I'll extract the details."
- Same preview/confirm/execute flow

## INVOICE IMAGE UPLOAD WORKFLOW

When user uploads an image (photo of invoice, receipt, estimate, or any document):

1. **Acknowledge the upload**: "I see you've uploaded an image. Let me analyze it to extract the invoice details."

2. **Extract data using extract_invoice_from_image tool**:
   - Customer info: first name, last name, address (street, city, state, zip), phone, email
   - Service address (may be different from billing address)
   - Line items: service name, description, quantity, unit price
   - Totals: subtotal, tax (if any), total amount due
   - Job details: job number, due date, payment terms

3. **Display extracted data in structured format**:
   Show the extracted information in clear markdown tables:

   **Customer Information**
   | Field | Value |
   |-------|-------|
   | Name | [First] [Last] |
   | Address | [Street], [City], [State] [Zip] |
   | Phone | [Phone] |
   | Email | [Email] |

   **Service Details**
   | Service | Description | Qty | Price |
   |---------|-------------|-----|-------|
   | [Service name] | [Description] | [Qty] | $[Price] |

   **Totals**
   | | Amount |
   |------|--------|
   | Subtotal | $[Amount] |
   | Total | $[Amount] |

4. **Ask for confirmation**: "Does this information look correct? Reply 'yes' to create this customer and invoice, or let me know what needs to be changed."

5. **On confirmation, execute in sequence**:
   a. Call hcp_create_customer with extracted customer data
   b. Call hcp_create_job with customer_id and line_items
   c. Call hcp_complete_job to generate the invoice
   d. Show success message with created IDs and next action options

6. **Offer next steps**:
   - "Send Invoice" - to email/text to customer
   - "View Invoice" - link to invoice page
   - "View Customer" - link to customer page

Always show structured previews before executing actions and get explicit confirmation.

## Chat Experience
When the user asks about invoicing at this stage:
- Response: "I see you have invoicing available! You haven't sent your first invoice yet - let me help you get started."
- Priority Action: onboarding
- Suggested CTA: "Try Sample" - Would you like to try invoicing with sample data to see how it works, or use your real customer information?
- Escalation Triggers: stuck, not working, help me`,

      tools: [
        {
          name: 'extract_invoice_from_image',
          description: 'Analyze an uploaded invoice image and extract customer info, line items, and totals',
          parameters: {
            imageBase64: { type: 'string', description: 'Base64-encoded image data', required: true },
            mediaType: { type: 'string', description: 'Image MIME type (image/jpeg, image/png)', required: true },
          },
        },
        {
          name: 'hcp_create_customer',
          description: 'Create a new customer in Housecall Pro with name, contact info, and address',
          parameters: {
            first_name: { type: 'string', description: 'Customer first name', required: true },
            last_name: { type: 'string', description: 'Customer last name', required: true },
            email: { type: 'string', description: 'Customer email address' },
            mobile_number: { type: 'string', description: 'Customer phone number' },
            company: { type: 'string', description: 'Company name if business customer' },
            street: { type: 'string', description: 'Street address' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State abbreviation' },
            zip: { type: 'string', description: 'ZIP code' },
            notifications_enabled: { type: 'boolean', description: 'Enable SMS/email notifications' },
          },
        },
        {
          name: 'hcp_create_job',
          description: 'Create a new job in Housecall Pro linked to a customer and address',
          parameters: {
            customer_id: { type: 'string', description: 'ID of existing customer', required: true },
            address_id: { type: 'string', description: 'ID of customer address', required: true },
            description: { type: 'string', description: 'Job description/notes' },
            scheduled_start: { type: 'string', description: 'ISO datetime for scheduled start' },
            scheduled_end: { type: 'string', description: 'ISO datetime for scheduled end' },
            line_items: { type: 'array', description: 'Array of {name, description, unit_price, quantity}' },
          },
        },
        {
          name: 'hcp_complete_job',
          description: 'Mark a job as completed, which generates the invoice',
          parameters: {
            job_id: { type: 'string', description: 'ID of the job to complete', required: true },
          },
        },
        {
          name: 'create_sample_customer',
          description: 'Create a sample customer for demo purposes',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'create_sample_job',
          description: 'Create a sample job with line items for demo',
          parameters: {
            customerId: { type: 'string', description: 'The customer ID', required: true },
          },
        },
        {
          name: 'create_customer',
          description: 'Create a real customer from provided info',
          parameters: {
            name: { type: 'string', description: 'Customer name', required: true },
            email: { type: 'string', description: 'Customer email' },
            phone: { type: 'string', description: 'Customer phone number' },
            address: { type: 'string', description: 'Customer address' },
          },
        },
        {
          name: 'create_job',
          description: 'Create a real job for a customer',
          parameters: {
            customerId: { type: 'string', description: 'The customer ID', required: true },
            description: { type: 'string', description: 'Job description', required: true },
            lineItems: { type: 'array', description: 'Services and prices for the job' },
          },
        },
        {
          name: 'complete_job',
          description: 'Mark a job as completed to generate invoice',
          parameters: {
            jobId: { type: 'string', description: 'The job ID to complete', required: true },
          },
        },
        {
          name: 'preview_invoice',
          description: 'Show invoice preview before sending',
          parameters: {
            invoiceId: { type: 'string', description: 'The invoice ID', required: true },
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
          name: 'Customizing Your Invoices',
          description: 'Guide to branding and customization options',
          url: 'https://help.housecallpro.com/customize-invoices',
          navigationType: 'hcp_help',
        },
        {
          name: 'Invoice Settings Guide',
          description: 'Video walkthrough of all invoice settings',
          url: 'https://www.youtube.com/watch?v=hcp-invoice-settings',
          navigationType: 'hcp_video',
        },
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

      prompt: `When user asks about invoicing:
1. Provide help content - they're set up and ready
2. Offer these specific actions:
   - "Would you like to upload your company logo to make invoices look more professional?"
   - "Would you like me to review your invoice settings?"
   - "Would you like to send a test invoice to yourself to see how it looks?"
3. For each action, show preview and get confirmation before executing

Key actions to offer:
1. Upload logo - navigate to branding settings
2. Review settings - show current configuration
3. Send test invoice - create and send to their email

## Chat Experience
When the user asks about invoicing at this stage:
- Response: "You're all set up with invoicing! Here's how to make the most of it."
- Priority Action: navigation
- Suggested CTA: "Send Test Invoice" - What would you like to do? 1. Upload your logo 2. Review your settings 3. Send a test invoice to yourself
- Escalation Triggers: payment issue, invoice not received`,

      tools: [
        {
          name: 'extract_invoice_from_image',
          description: 'Analyze an uploaded invoice image and extract customer info, line items, and totals',
          parameters: {
            imageBase64: { type: 'string', description: 'Base64-encoded image data', required: true },
            mediaType: { type: 'string', description: 'Image MIME type (image/jpeg, image/png)', required: true },
          },
        },
        {
          name: 'hcp_send_invoice',
          description: 'Send an invoice to the customer via email or SMS',
          parameters: {
            invoice_id: { type: 'string', description: 'ID of the invoice to send', required: true },
            method: { type: 'string', description: 'Delivery method: email or sms' },
          },
        },
        {
          name: 'upload_logo',
          description: 'Navigate to logo upload for invoices',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'review_invoice_settings',
          description: 'Show current invoice configuration',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'send_test_invoice',
          description: 'Send test invoice to pro\'s own email',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
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
          name: 'Advanced Invoice Features',
          description: 'Power-user guide for templates and recurring invoices',
          url: 'https://help.housecallpro.com/advanced-invoicing',
          navigationType: 'hcp_help',
        },
        {
          name: 'Invoice Templates Tutorial',
          description: 'Video on creating and using invoice templates',
          url: 'https://www.youtube.com/watch?v=hcp-invoice-templates',
          navigationType: 'hcp_video',
        },
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

      prompt: `When user asks about invoicing:
1. Provide advanced tips and help content for power users
2. Offer to help create an invoice through conversation:
   "I can help you create an invoice right here. Just tell me about the job - who's the customer and what work was done?"
3. Walk through conversationally, showing previews at each step
4. Suggest related features: invoice templates, recurring invoices, aging reports

Advanced features to highlight:
- Invoice templates for common job types
- Recurring invoices for maintenance contracts
- Aging reports to track overdue payments
- Payment analytics and insights

## Chat Experience
When the user asks about invoicing at this stage:
- Response: "You're using invoicing like a pro! Here are some advanced tips."
- Priority Action: tip
- Suggested CTA: "Create Invoice" - I can help you create a new invoice right here. Just describe the job and I'll set it up for you, or ask about advanced features like templates and recurring invoices.
- Escalation Triggers: not getting paid, customer dispute, refund`,

      tools: [
        {
          name: 'extract_invoice_from_image',
          description: 'Analyze an uploaded invoice image and extract customer info, line items, and totals',
          parameters: {
            imageBase64: { type: 'string', description: 'Base64-encoded image data', required: true },
            mediaType: { type: 'string', description: 'Image MIME type (image/jpeg, image/png)', required: true },
          },
        },
        {
          name: 'hcp_create_customer',
          description: 'Create a new customer in Housecall Pro with name, contact info, and address',
          parameters: {
            first_name: { type: 'string', description: 'Customer first name', required: true },
            last_name: { type: 'string', description: 'Customer last name', required: true },
            email: { type: 'string', description: 'Customer email address' },
            mobile_number: { type: 'string', description: 'Customer phone number' },
            company: { type: 'string', description: 'Company name if business customer' },
            street: { type: 'string', description: 'Street address' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State abbreviation' },
            zip: { type: 'string', description: 'ZIP code' },
            notifications_enabled: { type: 'boolean', description: 'Enable SMS/email notifications' },
          },
        },
        {
          name: 'hcp_create_job',
          description: 'Create a new job in Housecall Pro linked to a customer and address',
          parameters: {
            customer_id: { type: 'string', description: 'ID of existing customer', required: true },
            address_id: { type: 'string', description: 'ID of customer address', required: true },
            description: { type: 'string', description: 'Job description/notes' },
            scheduled_start: { type: 'string', description: 'ISO datetime for scheduled start' },
            scheduled_end: { type: 'string', description: 'ISO datetime for scheduled end' },
            line_items: { type: 'array', description: 'Array of {name, description, unit_price, quantity}' },
          },
        },
        {
          name: 'hcp_complete_job',
          description: 'Mark a job as completed, which generates the invoice',
          parameters: {
            job_id: { type: 'string', description: 'ID of the job to complete', required: true },
          },
        },
        {
          name: 'hcp_send_invoice',
          description: 'Send an invoice to the customer via email or SMS',
          parameters: {
            invoice_id: { type: 'string', description: 'ID of the invoice to send', required: true },
            method: { type: 'string', description: 'Delivery method: email or sms' },
          },
        },
        {
          name: 'create_invoice_via_chat',
          description: 'Create invoice through conversational flow',
          parameters: {
            customerName: { type: 'string', description: 'Customer name', required: true },
            jobDescription: { type: 'string', description: 'Job description' },
            lineItems: { type: 'array', description: 'Services and prices' },
          },
        },
        {
          name: 'create_invoice_template',
          description: 'Save current invoice as reusable template',
          parameters: {
            name: { type: 'string', description: 'Template name', required: true },
            lineItems: { type: 'array', description: 'Default line items' },
          },
        },
        {
          name: 'get_invoice_analytics',
          description: 'Get invoicing performance metrics',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            period: { type: 'string', description: 'Time period: week, month, quarter' },
          },
        },
        {
          name: 'setup_recurring_invoice',
          description: 'Create recurring invoice for regular customers',
          parameters: {
            customerId: { type: 'string', description: 'Customer ID', required: true },
            frequency: { type: 'string', description: 'weekly, monthly, quarterly' },
            lineItems: { type: 'array', description: 'Services and prices' },
          },
        },
      ],
    },
  },
};
