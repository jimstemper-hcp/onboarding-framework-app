import type { Feature } from '../../types';

export const customersFeature: Feature = {
  id: 'customers',
  name: 'Customers',
  description: 'Manage your customer database, profiles, and communication preferences',
  icon: 'Person',
  version: '1.0.0',
  releaseStatus: 'published',

  stages: {
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
          content: 'A well-organized customer database is the foundation of your business operations.',
        },
      ],
      navigation: [],
      calendlyTypes: [],
      prompt: 'Explain the importance of customer management for business operations.',
      tools: [],
    },

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
          content: 'Start by adding your first customer. You can import existing customers or add them manually.',
        },
      ],
      navigation: [
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
      ],
      calendlyTypes: [
        {
          name: 'Customer Setup Help',
          url: 'https://calendly.com/hcp-onboarding/customer-setup',
          team: 'onboarding',
          description: 'Get help setting up your customer database',
        },
      ],
      prompt: 'Guide the pro through adding and organizing their customers.',
      tools: [],
    },

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
        { itemId: 'customer-portal', required: false, stageSpecificNote: 'Let customers self-serve' },
      ],
      contextSnippets: [
        {
          id: 'next-steps',
          title: 'Next Steps',
          content: 'Great start! Now organize your customers with tags and enable the customer portal.',
        },
      ],
      navigation: [
        {
          name: 'Customer Tags',
          description: 'Create and manage customer tags',
          url: '/settings/customer-tags',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the pro organize their growing customer database with tags and advanced features.',
      tools: [],
    },

    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'customers.regular_use', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'power-user',
          title: 'Power User',
          content: 'You\'re managing customers like a pro! Consider parent/child billing for commercial clients.',
        },
      ],
      navigation: [],
      calendlyTypes: [],
      prompt: 'Offer advanced customer management tips like parent/child billing and multi-address management.',
      tools: [],
    },
  },
};
