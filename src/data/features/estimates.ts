import type { Feature } from '../../types';

export const estimatesFeature: Feature = {
  id: 'estimates',
  name: 'Estimates',
  description: 'Create and send professional estimates that win jobs',
  icon: 'RequestQuote',
  version: '1.1.0',
  releaseStatus: 'published',

  stages: {
    // =========================================================================
    // NOT ATTACHED - Pro doesn't have access to estimates
    // =========================================================================
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.estimates', negated: true },
          { variable: 'addons.estimates', negated: true },
        ],
      },

      onboardingItems: [],

      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Win more jobs with professional estimates. Send beautiful quotes that customers can approve with one click.',
        },
        {
          id: 'stat-highlight',
          title: 'Key Statistic',
          content: 'Pros using Good/Better/Best pricing see 20-30% higher average ticket sizes.',
        },
      ],

      navigation: [
        {
          name: 'Creating Winning Estimates',
          description: 'Complete guide to professional estimates',
          url: 'https://help.housecallpro.com/estimates-guide',
          navigationType: 'hcp_help',
        },
        {
          name: 'Good/Better/Best Pricing Video',
          description: 'Video on tiered pricing strategies',
          url: 'https://www.youtube.com/watch?v=hcp-gbb',
          navigationType: 'hcp_video',
        },
        {
          name: 'Estimates Pricing',
          description: 'Self-serve page for estimates feature pricing',
          url: '/pricing/estimates',
          navigationType: 'hcp_external',
        },
        {
          name: 'Estimates Overview',
          description: 'Help article explaining how to create and send estimates',
          url: 'https://help.housecallpro.com/estimates',
          navigationType: 'hcp_help',
        },
      ],

      calendlyTypes: [
        {
          name: 'Estimates Demo',
          url: 'https://calendly.com/hcp-sales/estimates',
          team: 'sales',
          description: 'See how professional estimates work',
        },
      ],

      prompt: `When user asks about estimates:
1. First, explain how professional estimates help win more jobs
2. Reference the help article: "Creating Winning Estimates"
3. Mention the Good/Better/Best pricing strategy and its benefits
4. Then say: "I notice you don't have estimates enabled yet. I can schedule a demo to show you how pros are winning more jobs with professional quotes."
5. If interested, provide the Calendly link

Key points to emphasize:
- Professional, branded estimates
- One-click customer approval
- Good/Better/Best pricing increases average ticket 20-30%
- Estimates convert directly to jobs

## Chat Experience
When the user asks about estimates at this stage:
- Response: "Great question about estimates! Let me explain how professional quotes help win more jobs."
- Priority Action: call
- Suggested CTA: "Talk to Sales" - Estimates isn't enabled on your account yet. I can schedule a demo to show you how pros are winning more jobs with professional quotes that customers approve with one click.
- Escalation Triggers: pricing, cost, how much`,

      tools: [
        {
          name: 'check_plan_eligibility',
          description: 'Check if the pro is eligible to add estimates',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'schedule_sales_call',
          description: 'Schedule a sales demo call',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ATTACHED - Pro has access but hasn't set up price book
    // =========================================================================
    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.estimates', negated: false },
          { variable: 'estimates.setup_complete', negated: true },
        ],
      },

      onboardingItems: [
        { itemId: 'create-first-customer', required: true },
        { itemId: 'add-price-book-item', required: true, stageSpecificNote: 'Add your most common services to speed up estimate creation' },
        { itemId: 'create-first-estimate', required: true },
        { itemId: 'send-first-estimate', required: true },
        { itemId: 'rep-documented-goals', required: false },
      ],

      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Set up your price book and create your first estimate to start winning more jobs.',
        },
        {
          id: 'sample-flow',
          title: 'Sample Data Option',
          content: 'Offer to create a sample estimate to demonstrate the workflow.',
        },
      ],

      navigation: [
        {
          name: 'Price Book Setup Guide',
          description: 'How to set up your services and pricing',
          url: 'https://help.housecallpro.com/price-book',
          navigationType: 'hcp_help',
        },
        {
          name: 'Creating Your First Estimate',
          description: 'Video tutorial on creating estimates',
          url: 'https://youtube.com/watch?v=hcp-estimates',
          navigationType: 'hcp_video',
        },
        {
          name: 'Estimates',
          description: 'View and create estimates',
          url: '/estimates',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Price Book',
          description: 'Manage your services and prices',
          url: '/settings/price-book',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [
        {
          name: 'Estimates Setup',
          url: 'https://calendly.com/hcp-onboarding/estimates',
          team: 'onboarding',
          description: 'Get help with estimate setup',
        },
      ],

      prompt: `When user asks about estimates:
1. First explain how estimates work with help article reference
2. Then ask: "Would you like to create a sample estimate to see how it works, or create a real estimate for a customer?"

If SAMPLE:
- Create sample customer
- Show estimate with Good/Better/Best pricing
- Demonstrate one-click approval
- Offer next steps: set up price book, create templates

If REAL:
- Ask for customer info and job description
- Help build the estimate with line items
- Show preview before sending

Always show structured previews and get confirmation.

## Chat Experience
When the user asks about estimates at this stage:
- Response: "You have estimates! Let's create your first professional quote."
- Priority Action: onboarding
- Suggested CTA: "Create Estimate" - Would you like to create a sample estimate to see how it works, or create a real estimate for a customer?
- Escalation Triggers: price book not working, estimate error, stuck`,

      tools: [
        {
          name: 'create_sample_estimate',
          description: 'Create a sample estimate for demo',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'create_estimate',
          description: 'Create a real estimate',
          parameters: {
            customerId: { type: 'string', description: 'Customer ID', required: true },
            lineItems: { type: 'array', description: 'Services and prices' },
          },
        },
        {
          name: 'add_price_book_item',
          description: 'Add item to price book',
          parameters: {
            name: { type: 'string', description: 'Service name', required: true },
            price: { type: 'number', description: 'Default price' },
          },
        },
      ],
    },

    // =========================================================================
    // ACTIVATED - Pro has estimates set up
    // =========================================================================
    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'estimates.setup_complete', negated: false },
          { variable: 'estimates.sent_count', negated: true },
        ],
      },

      onboardingItems: [],

      contextSnippets: [
        {
          id: 'ready-to-go',
          title: 'Estimates Active',
          content: 'You\'re ready to send estimates! Try Good/Better/Best pricing to increase your average ticket.',
        },
        {
          id: 'pro-tip',
          title: 'Pro Tip',
          content: 'Create estimate templates for your common job types to save time.',
        },
      ],

      navigation: [
        {
          name: 'Good/Better/Best Setup Guide',
          description: 'How to set up tiered pricing',
          url: 'https://help.housecallpro.com/gbb-pricing',
          navigationType: 'hcp_help',
        },
        {
          name: 'Estimate Templates Tutorial',
          description: 'Video on creating estimate templates',
          url: 'https://www.youtube.com/watch?v=hcp-estimate-templates',
          navigationType: 'hcp_video',
        },
        {
          name: 'Estimates',
          description: 'Manage your estimates',
          url: '/estimates',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Estimate Templates',
          description: 'Save time with templates',
          url: '/settings/templates/estimates',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [],

      prompt: `When user asks about estimates:
1. Provide help content - estimates are ready
2. Offer these specific actions:
   - "Would you like to try Good/Better/Best pricing to increase your average ticket?"
   - "Would you like to create an estimate template for common jobs?"
   - "Would you like to send a test estimate to see the customer experience?"
3. For each action, explain the benefit and guide them through

Key actions to offer:
1. Good/Better/Best - explain tiered pricing benefits
2. Templates - save time on common estimates
3. Test estimate - see customer approval experience

## Chat Experience
When the user asks about estimates at this stage:
- Response: "You're set up for estimates! Ready to send your first one."
- Priority Action: navigation
- Suggested CTA: "Send Estimate" - What would you like to do? 1. Try Good/Better/Best pricing to increase average ticket 2. Create an estimate template for common jobs 3. Send a test estimate to see the customer view
- Escalation Triggers: customer can't approve, estimate not sending, pricing wrong`,

      tools: [
        {
          name: 'setup_gbb_pricing',
          description: 'Configure Good/Better/Best pricing',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            tiers: { type: 'object', description: 'Pricing tiers' },
          },
        },
        {
          name: 'create_estimate_template',
          description: 'Create an estimate template',
          parameters: {
            name: { type: 'string', description: 'Template name', required: true },
            lineItems: { type: 'array', description: 'Default line items' },
          },
        },
        {
          name: 'send_test_estimate',
          description: 'Send test estimate to pro',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

  },
};
