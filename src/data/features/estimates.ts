import type { Feature } from '../../types';

export const estimatesFeature: Feature = {
  id: 'estimates',
  name: 'Estimates',
  description: 'Create and send professional estimates that win jobs',
  icon: 'RequestQuote',
  version: '1.1.0',

  stages: {
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
      ],
      navigation: [
        {
          name: 'Estimates Pricing',
          description: 'Self-serve page for estimates feature pricing',
          url: '/pricing/estimates',
          navigationType: 'hcp_sell_page',
        },
        {
          name: 'Estimates Overview',
          description: 'Help article explaining how to create and send estimates',
          url: 'https://help.housecallpro.com/estimates',
          navigationType: 'hcp_help_article',
        },
      ],
      calendlyTypes: [
        { name: 'Estimates Demo', url: 'https://calendly.com/hcp-sales/estimates', team: 'sales', description: 'See how estimates work' },
      ],
      prompt: 'Help the pro understand how professional estimates can help them win more jobs.',
      tools: [],
    },

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
      ],
      navigation: [
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
        {
          name: 'Creating Your First Estimate',
          description: 'Video tutorial on creating estimates',
          url: 'https://youtube.com/watch?v=hcp-estimates',
          navigationType: 'hcp_video',
        },
      ],
      calendlyTypes: [
        { name: 'Estimates Setup', url: 'https://calendly.com/hcp-onboarding/estimates', team: 'onboarding', description: 'Get help with estimates' },
      ],
      prompt: 'Guide the pro through setting up their price book and creating their first estimate.',
      tools: [],
    },

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
      ],
      navigation: [
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
      prompt: 'Encourage the pro to create templates and try Good/Better/Best pricing.',
      tools: [],
    },

    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'estimates.sent_count', negated: false },
          { variable: 'estimates.recent_activity', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'success',
          title: 'Estimates Pro',
          content: 'Your estimates are winning jobs! Consider adding financing for larger jobs.',
        },
      ],
      navigation: [
        {
          name: 'Estimates',
          description: 'Manage your estimates',
          url: '/estimates',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Financing Options',
          description: 'Offer financing for larger estimates',
          url: '/settings/financing',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the experienced estimates user optimize approval rates and explore financing.',
      tools: [],
    },
  },
};
