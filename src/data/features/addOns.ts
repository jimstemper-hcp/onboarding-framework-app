import type { Feature } from '../../types';

export const addOnsFeature: Feature = {
  id: 'add-ons',
  name: 'Add-Ons',
  description: 'Third-party integrations and premium add-ons to extend your capabilities',
  icon: 'Extension',
  version: '1.0.0',
  releaseStatus: 'draft',

  stages: {
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'addons.any_active', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Add-ons extend Housecall Pro with powerful integrations for marketing, accounting, and more.',
        },
      ],
      navigation: [
        {
          name: 'Add-Ons Marketplace',
          description: 'Browse available add-ons and integrations',
          url: '/settings/integrations',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [
        {
          name: 'Add-Ons Overview',
          url: 'https://calendly.com/hcp-sales/addons-overview',
          team: 'sales',
          description: 'Learn about available add-ons for your business',
        },
      ],
      prompt: 'Explain available add-ons and how they can benefit the pro\'s business.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'addons.any_active', negated: false },
          { variable: 'addons.configured', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'pipeline', required: false },
        { itemId: 'profit-rhino', required: false },
        { itemId: 'marketing-center', required: false },
        { itemId: 'voice-call-tracking', required: false },
        { itemId: 'hcpa', required: false },
        { itemId: 'payroll', required: false },
        { itemId: 'conquer', required: false },
        { itemId: 'inha-accounting', required: false },
      ],
      contextSnippets: [
        {
          id: 'setup',
          title: 'Setup Required',
          content: 'You have add-ons enabled! Complete the setup to start using them.',
        },
      ],
      navigation: [
        {
          name: 'Integration Settings',
          description: 'Configure your integrations',
          url: '/settings/integrations',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [
        {
          name: 'Add-Ons Setup Help',
          url: 'https://calendly.com/hcp-onboarding/addons-setup',
          team: 'onboarding',
          description: 'Get help configuring your add-ons',
        },
      ],
      prompt: 'Guide the pro through setting up their enabled add-ons.',
      tools: [],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'addons.configured', negated: false },
          { variable: 'addons.regular_use', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'ready',
          title: 'Ready to Use',
          content: 'Your add-ons are configured. Start using them to grow your business.',
        },
      ],
      navigation: [],
      calendlyTypes: [],
      prompt: 'Help the pro get the most out of their configured add-ons.',
      tools: [],
    },

  },
};
