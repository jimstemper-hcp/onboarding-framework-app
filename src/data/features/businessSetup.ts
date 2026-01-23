import type { Feature } from '../../types';

export const businessSetupFeature: Feature = {
  id: 'business-setup',
  name: 'Business Setup',
  description: 'Configure your company profile, business information, and core settings',
  icon: 'Business',
  version: '1.0.0',
  releaseStatus: 'published',

  stages: {
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'business.setup_started', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'A properly configured business profile helps customers trust you and ensures your business information appears correctly on invoices and estimates.',
        },
      ],
      navigation: [],
      calendlyTypes: [],
      prompt: 'Help the pro understand the importance of business setup for their professional appearance.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'business.setup_started', negated: false },
          { variable: 'business.setup_complete', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'company-profile', required: true },
        { itemId: 'business-hours', required: true },
        { itemId: 'add-company-logo', required: false },
        { itemId: 'add-service-area', required: false },
      ],
      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Complete your business profile to look professional to customers. Add your logo, business hours, and service area.',
        },
      ],
      navigation: [
        {
          name: 'Company Settings',
          description: 'Configure your company information',
          url: '/settings/company',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Business Hours',
          description: 'Set your operating hours',
          url: '/settings/business-hours',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [
        {
          name: 'Business Setup Help',
          url: 'https://calendly.com/hcp-onboarding/business-setup',
          team: 'onboarding',
          description: 'Get help configuring your business profile',
        },
      ],
      prompt: 'Guide the pro through completing their business profile setup.',
      tools: [],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'business.setup_complete', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'complete',
          title: 'Setup Complete',
          content: 'Your business profile is set up. You can update your information anytime in Settings.',
        },
      ],
      navigation: [
        {
          name: 'Company Settings',
          description: 'Update your company information',
          url: '/settings/company',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'The pro has completed business setup. Help them with any updates or questions.',
      tools: [],
    },

  },
};
