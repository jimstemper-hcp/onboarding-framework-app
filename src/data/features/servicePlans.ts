import type { Feature } from '../../types';

export const servicePlansFeature: Feature = {
  id: 'service-plans',
  name: 'Service Plans',
  description: 'Create and manage recurring service plans for maintenance contracts',
  icon: 'EventRepeat',
  version: '1.0.0',

  stages: {
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'service_plans.access', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Service plans create recurring revenue and help you retain customers with maintenance contracts.',
        },
      ],
      navigation: [
        {
          name: 'Service Plans Overview',
          description: 'Learn about service plans',
          url: 'https://help.housecallpro.com/service-plans',
          navigationType: 'hcp_help',
        },
      ],
      calendlyTypes: [
        {
          name: 'Service Plans Demo',
          url: 'https://calendly.com/hcp-sales/service-plans',
          team: 'sales',
          description: 'See how service plans can grow your recurring revenue',
        },
      ],
      prompt: 'Explain the benefits of service plans for recurring revenue and customer retention.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'service_plans.access', negated: false },
          { variable: 'service_plans.first_created', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'service-plans-settings', required: true },
        { itemId: 'service-plans-templates', required: true },
        { itemId: 'edit-delete-service-plan', required: false },
        { itemId: 'add-service-plan-customer', required: true },
      ],
      contextSnippets: [
        {
          id: 'getting-started',
          title: 'Getting Started',
          content: 'Start by configuring settings and creating your first service plan template.',
        },
      ],
      navigation: [
        {
          name: 'Service Plans',
          description: 'Manage your service plans',
          url: '/service-plans',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Service Plan Settings',
          description: 'Configure service plan options',
          url: '/settings/service-plans',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [
        {
          name: 'Service Plans Setup',
          url: 'https://calendly.com/hcp-onboarding/service-plans',
          team: 'onboarding',
          description: 'Get help setting up your service plans',
        },
      ],
      prompt: 'Guide the pro through creating their first service plan template.',
      tools: [],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'service_plans.first_created', negated: false },
          { variable: 'service_plans.customers_enrolled', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'add-service-plan-customer', required: true, stageSpecificNote: 'Enroll your first customer' },
      ],
      contextSnippets: [
        {
          id: 'enroll-customers',
          title: 'Enroll Customers',
          content: 'Great template! Now start enrolling customers in your service plans.',
        },
      ],
      navigation: [
        {
          name: 'Customers',
          description: 'Find customers to enroll in service plans',
          url: '/customers',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the pro start enrolling customers in their service plans.',
      tools: [],
    },

    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'service_plans.customers_enrolled', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'success',
          title: 'Growing Recurring Revenue',
          content: 'You\'re building recurring revenue with service plans! Keep enrolling customers.',
        },
      ],
      navigation: [
        {
          name: 'Service Plan Report',
          description: 'View service plan metrics',
          url: '/reports/service-plans',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Offer tips for growing service plan enrollment and managing renewals.',
      tools: [],
    },
  },
};
