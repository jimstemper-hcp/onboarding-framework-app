import type { Feature } from '../../types';

export const reportingFeature: Feature = {
  id: 'reporting',
  name: 'Reporting',
  description: 'Dashboards, analytics, and custom reports to track your business performance',
  icon: 'Analytics',
  version: '1.0.0',
  releaseStatus: 'draft',

  stages: {
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'reporting.access', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Reporting gives you visibility into your business performance and helps you make data-driven decisions.',
        },
      ],
      navigation: [],
      calendlyTypes: [],
      prompt: 'Explain the importance of reporting for business insights.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'reporting.access', negated: false },
          { variable: 'reporting.dashboard_viewed', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'dashboard', required: true },
        { itemId: 'filtering-tags', required: false },
        { itemId: 'tags-reporting', required: false },
        { itemId: 'tech-leaderboard', required: false },
        { itemId: 'job-costing', required: false },
        { itemId: 'commissions', required: false },
        { itemId: 'custom-reports', required: false },
      ],
      contextSnippets: [
        {
          id: 'getting-started',
          title: 'Getting Started',
          content: 'Start with the dashboard to see your key metrics at a glance.',
        },
      ],
      navigation: [
        {
          name: 'Dashboard',
          description: 'View your business dashboard',
          url: '/dashboard',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Reports',
          description: 'Browse all available reports',
          url: '/reports',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [
        {
          name: 'Reporting Overview',
          url: 'https://calendly.com/hcp-onboarding/reporting',
          team: 'onboarding',
          description: 'Learn how to use reports effectively',
        },
      ],
      prompt: 'Guide the pro through the dashboard and key reports.',
      tools: [],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'reporting.dashboard_viewed', negated: false },
          { variable: 'reporting.regular_use', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'custom-reports', required: false, stageSpecificNote: 'Create reports for your specific needs' },
        { itemId: 'job-costing', required: false, stageSpecificNote: 'Track profitability by job' },
      ],
      contextSnippets: [
        {
          id: 'explore',
          title: 'Explore More',
          content: 'Great start! Now explore custom reports and job costing for deeper insights.',
        },
      ],
      navigation: [
        {
          name: 'Custom Reports',
          description: 'Create custom reports',
          url: '/reports/custom',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Job Costing',
          description: 'Track job profitability',
          url: '/reports/job-costing',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the pro explore advanced reporting features.',
      tools: [],
    },

  },
};
