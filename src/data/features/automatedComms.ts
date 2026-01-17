import type { Feature } from '../../types';

export const automatedCommsFeature: Feature = {
  id: 'automated-comms',
  name: 'Automated Communications',
  description: 'Automated texts and emails to keep customers informed',
  icon: 'Sms',
  version: '2.1.0',

  stages: {
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
      ],
      navigation: [
        {
          name: 'Communications Pricing',
          description: 'Self-serve page for automated communications pricing and upgrade',
          url: '/pricing/communications',
          navigationType: 'hcp_sell_page',
        },
        {
          name: 'Automated Communications Guide',
          description: 'Comprehensive guide explaining automated messaging features',
          url: 'https://help.housecallpro.com/auto-comms',
          navigationType: 'hcp_training_article',
        },
      ],
      calendlyTypes: [
        { name: 'Communications Demo', url: 'https://calendly.com/hcp-sales/comms', team: 'sales', description: 'See automated communications in action' },
      ],
      prompt: 'Help the pro understand how automated communications save time and improve customer satisfaction.',
      tools: [],
    },

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
      ],
      navigation: [
        {
          name: 'Communication Settings',
          description: 'Configure automated messages',
          url: '/settings/communications',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Setting Up Automated Texts',
          description: 'Video tutorial on configuring automated texts',
          url: 'https://youtube.com/watch?v=hcp-auto-texts',
          navigationType: 'hcp_video',
        },
      ],
      calendlyTypes: [
        { name: 'Communications Setup', url: 'https://calendly.com/hcp-onboarding/comms', team: 'onboarding', description: 'Get help setting up automated messages' },
      ],
      prompt: 'Guide the pro through enabling on-my-way texts and verifying their business phone number.',
      tools: [],
    },

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
      ],
      navigation: [
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
      prompt: 'Encourage the pro to set up review requests and follow-up campaigns.',
      tools: [],
    },

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
      ],
      navigation: [
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
      prompt: 'Help the experienced user optimize their messaging and explore marketing campaigns.',
      tools: [],
    },
  },
};
