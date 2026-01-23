import type { Feature } from '../../types';

export const customersFeature: Feature = {
  id: 'customers',
  name: 'Customers',
  description: 'Manage your customer database, profiles, and communication preferences',
  icon: 'Person',
  version: '1.1.0',
  releaseStatus: 'published',

  stages: {
    // =========================================================================
    // NOT ATTACHED - Pro doesn't have access to customers
    // =========================================================================
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'customers.access', negated: true },
        ],
      },

      onboardingItems: [],

      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'A well-organized customer database is the foundation of your business operations. Track customer history, preferences, and contact info in one place.',
        },
        {
          id: 'stat-highlight',
          title: 'Key Statistic',
          content: 'Pros with organized customer databases report 40% faster job scheduling and better repeat business.',
        },
      ],

      navigation: [
        {
          name: 'Customer Management Overview',
          description: 'Learn how customer management helps your business',
          url: 'https://help.housecallpro.com/customer-management',
          navigationType: 'hcp_help',
        },
      ],

      calendlyTypes: [],

      prompt: `When user asks about customers:
1. Explain the importance of customer management for business operations
2. Reference the help article: "Customer Management Overview"
3. Highlight the benefits: organized customer history, faster scheduling, better repeat business

## Chat Experience
When the user asks about customers at this stage:
- Response: "Great question about customer management! Let me explain how it works."
- Priority Action: tip
- Suggested CTA: "Learn More" - A well-organized customer database is the foundation of your business. It helps you track history, schedule faster, and build repeat business.
- Escalation Triggers: can't access customers, customer page not working`,

      tools: [],
    },

    // =========================================================================
    // ATTACHED - Pro has access but hasn't added first customer
    // =========================================================================
    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'customers.access', negated: false },
          { variable: 'customers.first_added', negated: true },
        ],
      },

      onboardingItems: [
        { itemId: 'add-new-customers', required: true },
        { itemId: 'customer-profile-details', required: true },
        { itemId: 'customer-portal', required: false },
        { itemId: 'customer-tags', required: false },
        { itemId: 'cc-on-file', required: false },
        { itemId: 'parent-child-billing', required: false },
        { itemId: 'multiple-addresses', required: false },
        { itemId: 'customer-notifications', required: false },
      ],

      contextSnippets: [
        {
          id: 'getting-started',
          title: 'Getting Started',
          content: 'Start by adding your first customer. You can import existing customers or add them manually through conversation.',
        },
        {
          id: 'sample-flow',
          title: 'Sample Data Option',
          content: 'Offer to create a sample customer (Jane Smith) to demonstrate the customer management workflow without affecting real data.',
        },
      ],

      navigation: [
        {
          name: 'Adding Your First Customer',
          description: 'Step-by-step guide to adding customers',
          url: 'https://help.housecallpro.com/adding-customers',
          navigationType: 'hcp_help',
        },
        {
          name: 'Customer Management Video',
          description: 'Video walkthrough of customer features',
          url: 'https://www.youtube.com/watch?v=hcp-customer-management',
          navigationType: 'hcp_video',
        },
        {
          name: 'Customers',
          description: 'View and manage your customers',
          url: '/customers',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Import Customers',
          description: 'Import customers from a CSV file',
          url: '/customers/import',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'New Customer',
          description: 'Add a new customer',
          url: '/customers/new',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [
        {
          name: 'Customer Setup Help',
          url: 'https://calendly.com/hcp-onboarding/customer-setup',
          team: 'onboarding',
          description: 'Get help setting up your customer database',
        },
      ],

      prompt: `When user asks about customers:
1. First explain how customer management works with help article reference
2. Then ask: "Would you like to add a sample customer to see how it works, or add a real one?"

If SAMPLE:
- Say "Great! Let me create a sample customer for you."
- Show preview table with sample customer data:
  | Field | Value |
  |-------|-------|
  | Name | Jane Smith |
  | Email | jane.smith@example.com |
  | Phone | (555) 123-4567 |
  | Address | 123 Main St, Springfield, IL 62701 |
- Ask: "Does this look good? Reply 'yes' to create this sample customer."
- After confirmation, create the customer using hcp_create_customer
- Offer next steps: "Now you can: 1) Add more customers, 2) Set up customer tags, 3) Enable the customer portal"

If REAL:
- Ask: "What's your customer's name?"
- Collect info conversationally: name, email (optional), phone (optional), address
- Show preview table before creating
- Get confirmation before executing hcp_create_customer

Always show structured previews before executing actions and get explicit confirmation.

## Chat Experience
When the user asks about customers at this stage:
- Response: "Let's get your first customer added to Housecall Pro!"
- Priority Action: onboarding
- Suggested CTA: "Add Customer" - Would you like to add a sample customer to see how it works, or add a real one?
- Escalation Triggers: import issues, duplicate customers, bulk upload, can't add customer`,

      tools: [
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
          name: 'hcp_list_customers',
          description: 'List existing customers in Housecall Pro',
          parameters: {
            limit: { type: 'number', description: 'Maximum number of customers to return' },
            search: { type: 'string', description: 'Search term to filter customers' },
          },
        },
        {
          name: 'create_sample_customer',
          description: 'Create a sample customer (Jane Smith) for demo purposes',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ACTIVATED - Pro has added first customer, ready for organization
    // =========================================================================
    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'customers.first_added', negated: false },
          { variable: 'customers.regular_use', negated: true },
        ],
      },

      onboardingItems: [
        { itemId: 'customer-tags', required: false, stageSpecificNote: 'Organize customers for easier filtering' },
        { itemId: 'customer-portal', required: false, stageSpecificNote: 'Let customers self-serve and view their job history' },
        { itemId: 'customer-notifications', required: false, stageSpecificNote: 'Keep customers informed automatically' },
      ],

      contextSnippets: [
        {
          id: 'next-steps',
          title: 'Next Steps',
          content: 'Great start! Now organize your customers with tags and enable the customer portal for self-service.',
        },
        {
          id: 'pro-tip',
          title: 'Pro Tip',
          content: 'Use customer tags to segment your database - try tags like "VIP", "Commercial", or "Maintenance Plan" for easy filtering.',
        },
      ],

      navigation: [
        {
          name: 'Customer Tags Guide',
          description: 'Learn how to organize customers with tags',
          url: 'https://help.housecallpro.com/customer-tags',
          navigationType: 'hcp_help',
        },
        {
          name: 'Customer Portal Setup',
          description: 'Video on enabling customer self-service',
          url: 'https://www.youtube.com/watch?v=hcp-customer-portal',
          navigationType: 'hcp_video',
        },
        {
          name: 'Customers',
          description: 'View and manage your customers',
          url: '/customers',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Customer Tags',
          description: 'Create and manage customer tags',
          url: '/settings/customer-tags',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Customer Portal Settings',
          description: 'Enable customer self-service portal',
          url: '/settings/customer-portal',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Notification Settings',
          description: 'Configure customer notifications',
          url: '/settings/notifications',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [
        {
          name: 'Customer Organization Tips',
          url: 'https://calendly.com/hcp-success/customer-tips',
          team: 'support',
          description: 'Learn best practices for organizing customers',
        },
      ],

      prompt: `When user asks about customers:
1. Provide help content - they've added their first customer!
2. Offer these specific next steps toward engaged status:
   - "Would you like to set up customer tags to organize your database?"
   - "Would you like to enable the customer portal so customers can view their job history?"
   - "Would you like to configure automatic notifications to keep customers informed?"
3. For each action, explain the benefit and navigate to the appropriate settings page

Key actions to offer:
1. Customer tags - organize and filter customers easily
2. Customer portal - let customers self-serve
3. Notifications - automatic appointment reminders and updates

## Chat Experience
When the user asks about customers at this stage:
- Response: "Great job adding your first customer! Here's how to organize and grow your customer database."
- Priority Action: navigation
- Suggested CTA: "Set Up Tags" - What would you like to do? 1. Set up customer tags to organize your database 2. Enable the customer portal for self-service 3. Configure automatic notifications
- Escalation Triggers: can't find customer, customer data missing, duplicate customers, merge customers`,

      tools: [
        {
          name: 'hcp_list_customers',
          description: 'List existing customers in Housecall Pro',
          parameters: {
            limit: { type: 'number', description: 'Maximum number of customers to return' },
            search: { type: 'string', description: 'Search term to filter customers' },
          },
        },
        {
          name: 'hcp_update_customer',
          description: 'Update customer information',
          parameters: {
            customer_id: { type: 'string', description: 'Customer ID to update', required: true },
            first_name: { type: 'string', description: 'Customer first name' },
            last_name: { type: 'string', description: 'Customer last name' },
            email: { type: 'string', description: 'Customer email address' },
            mobile_number: { type: 'string', description: 'Customer phone number' },
            tags: { type: 'array', description: 'Customer tags' },
          },
        },
        {
          name: 'hcp_add_customer_tag',
          description: 'Add a tag to a customer',
          parameters: {
            customer_id: { type: 'string', description: 'Customer ID', required: true },
            tag: { type: 'string', description: 'Tag to add', required: true },
          },
        },
        {
          name: 'navigate_to_settings',
          description: 'Navigate to a settings page',
          parameters: {
            page: { type: 'string', description: 'Settings page: customer-tags, customer-portal, notifications', required: true },
          },
        },
      ],
    },

  },
};
