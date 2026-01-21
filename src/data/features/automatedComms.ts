import type { Feature } from '../../types';

export const automatedCommsFeature: Feature = {
  id: 'automated-comms',
  name: 'Automated Communications',
  description: 'Automated texts and emails to keep customers informed',
  icon: 'Sms',
  version: '2.1.0',
  releaseStatus: 'draft',

  stages: {
    // =========================================================================
    // NOT ATTACHED - Pro doesn't have access to automated comms
    // =========================================================================
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.automatedComms', negated: true },
          { variable: 'addons.automatedComms', negated: true },
        ],
      },

      onboardingItems: [],

      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Never miss a follow-up again. Automated texts and emails keep your customers informed and coming back.',
        },
        {
          id: 'stat-highlight',
          title: 'Key Statistic',
          content: 'Pros save 5+ hours per week on customer communication with automated messages.',
        },
      ],

      navigation: [
        {
          name: 'Automated Messaging Guide',
          description: 'Complete guide to setting up automated communications',
          url: 'https://help.housecallpro.com/auto-messaging',
          navigationType: 'hcp_help',
        },
        {
          name: 'Setting Up On-My-Way Texts',
          description: 'Video tutorial on on-my-way notifications',
          url: 'https://www.youtube.com/watch?v=hcp-omw',
          navigationType: 'hcp_video',
        },
        {
          name: 'Communications Pricing',
          description: 'Self-serve page for automated communications pricing and upgrade',
          url: '/pricing/communications',
          navigationType: 'hcp_external',
        },
        {
          name: 'Automated Communications Overview',
          description: 'Help article explaining automated messaging features',
          url: 'https://help.housecallpro.com/auto-comms',
          navigationType: 'hcp_help',
        },
      ],

      calendlyTypes: [
        {
          name: 'Communications Demo',
          url: 'https://calendly.com/hcp-sales/comms',
          team: 'sales',
          description: 'See automated communications in action',
        },
      ],

      prompt: `When user asks about automated communications:
1. First, explain how automated messages save time and improve customer experience
2. Reference the help article: "Automated Messaging Guide"
3. Mention the time savings: 5+ hours per week
4. Then say: "I notice you don't have automated communications enabled yet. I can schedule a demo to show you how it works and the time you'll save."
5. If interested, provide the Calendly link

Key points to emphasize:
- Appointment confirmations sent automatically
- On-my-way texts improve customer experience
- Follow-up messages bring customers back
- Review requests build your reputation

## Chat Experience
When the user asks about automated communications at this stage:
- Response: "Great question about automated messages! Let me explain how they can save you hours every week."
- Priority Action: call
- Suggested CTA: "Talk to Sales" - Automated communications isn't enabled on your account yet. I can schedule a demo to show you how pros save 5+ hours per week with automated texts and emails.
- Escalation Triggers: pricing, cost, how much`,

      tools: [
        {
          name: 'check_plan_eligibility',
          description: 'Check if the pro is eligible to add automated comms',
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
    // ATTACHED - Pro has access but hasn't configured messages
    // =========================================================================
    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.automatedComms', negated: false },
          { variable: 'comms.setup_complete', negated: true },
        ],
      },

      onboardingItems: [
        { itemId: 'enable-appointment-reminders', required: true },
        { itemId: 'enable-on-my-way', required: true },
        { itemId: 'customize-message-templates', required: false, stageSpecificNote: 'Personalize your messages for better engagement' },
        { itemId: 'rep-sent-welcome-resources', required: false },
      ],

      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Enable on-my-way texts and appointment reminders to keep customers informed automatically.',
        },
        {
          id: 'sample-flow',
          title: 'Sample Data Option',
          content: 'Offer to show sample message previews or set up real automated messages.',
        },
      ],

      navigation: [
        {
          name: 'Message Templates Guide',
          description: 'How to customize your automated messages',
          url: 'https://help.housecallpro.com/message-templates',
          navigationType: 'hcp_help',
        },
        {
          name: 'Setting Up Automated Texts',
          description: 'Video tutorial on configuring automated texts',
          url: 'https://youtube.com/watch?v=hcp-auto-texts',
          navigationType: 'hcp_video',
        },
        {
          name: 'Communication Settings',
          description: 'Configure automated messages',
          url: '/settings/communications',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [
        {
          name: 'Communications Setup',
          url: 'https://calendly.com/hcp-onboarding/comms',
          team: 'onboarding',
          description: 'Get help setting up automated messages',
        },
      ],

      prompt: `When user asks about automated communications:
1. First explain how automated messages work with help article reference
2. Then ask: "Would you like to see sample messages to understand the flow, or enable your real automated messages?"

If SAMPLE:
- Show preview of on-my-way text
- Show preview of appointment reminder
- Show preview of follow-up message
- Offer next steps: enable when ready

If REAL:
- Guide through enabling on-my-way texts
- Help set up appointment reminders
- Offer to customize message templates

Always show previews before enabling and get confirmation.

## Chat Experience
When the user asks about automated communications at this stage:
- Response: "You have automated communications! Let's get your messages set up."
- Priority Action: onboarding
- Suggested CTA: "Enable Messages" - Would you like to see sample messages to understand the flow, or enable your real automated messages right away?
- Escalation Triggers: not sending, customers not receiving, phone number`,

      tools: [
        {
          name: 'preview_message_templates',
          description: 'Show sample automated messages',
          parameters: {
            messageType: { type: 'string', description: 'Type: reminder, omw, followup' },
          },
        },
        {
          name: 'enable_on_my_way',
          description: 'Enable on-my-way text notifications',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'enable_reminders',
          description: 'Enable appointment reminders',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            timing: { type: 'string', description: 'When to send: 24h, 2h, 30min' },
          },
        },
      ],
    },

    // =========================================================================
    // ACTIVATED - Pro has messages set up
    // =========================================================================
    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'comms.setup_complete', negated: false },
          { variable: 'comms.message_count', negated: true },
        ],
      },

      onboardingItems: [
        { itemId: 'enable-follow-up', required: false, stageSpecificNote: 'Bring customers back with automated follow-ups' },
      ],

      contextSnippets: [
        {
          id: 'ready-to-go',
          title: 'Messages Active',
          content: 'Your automated messages are working! Set up review requests to build your reputation.',
        },
        {
          id: 'pro-tip',
          title: 'Pro Tip',
          content: 'Enable review requests and follow-up messages to maximize customer engagement.',
        },
      ],

      navigation: [
        {
          name: 'Review Requests Guide',
          description: 'How to automatically request customer reviews',
          url: 'https://help.housecallpro.com/review-requests',
          navigationType: 'hcp_help',
        },
        {
          name: 'Message Customization Video',
          description: 'Video on personalizing your messages',
          url: 'https://www.youtube.com/watch?v=hcp-customize-messages',
          navigationType: 'hcp_video',
        },
        {
          name: 'Message History',
          description: 'View sent messages',
          url: '/communications',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Review Requests',
          description: 'Set up automated review requests',
          url: '/settings/communications/reviews',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [],

      prompt: `When user asks about automated communications:
1. Provide help content - messages are active
2. Offer these specific actions:
   - "Would you like to set up automatic review requests after jobs?"
   - "Would you like to customize your message templates for a personal touch?"
   - "Would you like to preview an on-my-way text to see what customers receive?"
3. For each action, show preview and guide them through

Key actions to offer:
1. Review requests - enable and customize
2. Customize templates - personalize messages
3. Preview messages - see customer experience

## Chat Experience
When the user asks about automated communications at this stage:
- Response: "Your automated messages are working! Now let's take it to the next level."
- Priority Action: navigation
- Suggested CTA: "Setup Reviews" - What would you like to do? 1. Set up review requests after jobs 2. Customize your message templates 3. Preview an on-my-way text
- Escalation Triggers: messages not sending, customer complained, wrong number`,

      tools: [
        {
          name: 'enable_review_requests',
          description: 'Enable automated review requests',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            timing: { type: 'string', description: 'Hours after job completion' },
          },
        },
        {
          name: 'customize_template',
          description: 'Edit a message template',
          parameters: {
            templateType: { type: 'string', description: 'Type of template', required: true },
            content: { type: 'string', description: 'New message content' },
          },
        },
        {
          name: 'preview_customer_message',
          description: 'Show what customer receives',
          parameters: {
            messageType: { type: 'string', description: 'Type of message', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ENGAGED - Pro is actively using automated communications
    // =========================================================================
    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'comms.message_count', negated: false },
          { variable: 'comms.recent_activity', negated: false },
        ],
      },

      onboardingItems: [],

      contextSnippets: [
        {
          id: 'success',
          title: 'Great Engagement',
          content: 'Your customers love your automated communications! Customize templates for a personal touch.',
        },
        {
          id: 'advanced-tip',
          title: 'Advanced Tip',
          content: 'Create marketing campaigns to reach past customers and segment your audience.',
        },
      ],

      navigation: [
        {
          name: 'Marketing Campaigns Guide',
          description: 'How to create targeted marketing campaigns',
          url: 'https://help.housecallpro.com/marketing-campaigns',
          navigationType: 'hcp_help',
        },
        {
          name: 'Campaign Creation Tutorial',
          description: 'Video on creating effective marketing campaigns',
          url: 'https://www.youtube.com/watch?v=hcp-campaigns',
          navigationType: 'hcp_video',
        },
        {
          name: 'Message History',
          description: 'View sent messages',
          url: '/communications',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Marketing Campaigns',
          description: 'Reach past customers with campaigns',
          url: '/marketing/campaigns',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [],

      prompt: `When user asks about automated communications:
1. Provide advanced tips for power users
2. Offer to help with marketing campaigns:
   - "Would you like to create a marketing campaign to reach past customers?"
   - "Would you like to see your message analytics and open rates?"
   - "Would you like to segment your customers for targeted messages?"
3. Explain how campaigns can bring back repeat business

Advanced features to highlight:
- Marketing campaigns for past customers
- Customer segmentation
- Message analytics and insights
- Seasonal/holiday campaigns

## Chat Experience
When the user asks about automated communications at this stage:
- Response: "Great engagement with automated communications! Your customers are staying informed."
- Priority Action: tip
- Suggested CTA: "Create Campaign" - Would you like to create a marketing campaign to reach past customers? You can also customize your templates for a more personal touch.
- Escalation Triggers: unsubscribe, opt out, too many messages`,

      tools: [
        {
          name: 'create_campaign',
          description: 'Create a marketing campaign',
          parameters: {
            name: { type: 'string', description: 'Campaign name', required: true },
            audience: { type: 'string', description: 'Target audience' },
            message: { type: 'string', description: 'Campaign message' },
          },
        },
        {
          name: 'get_message_analytics',
          description: 'Get message performance metrics',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            period: { type: 'string', description: 'Time period' },
          },
        },
        {
          name: 'segment_customers',
          description: 'Create customer segments for targeting',
          parameters: {
            criteria: { type: 'string', description: 'Segmentation criteria', required: true },
          },
        },
      ],
    },
  },
};
