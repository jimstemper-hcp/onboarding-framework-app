import type { Feature } from '../../types';

export const accountSetupFeature: Feature = {
  id: 'account-setup',
  name: 'Account Setup',
  description: 'Configure your account settings, business profile, and team permissions',
  icon: 'Settings',
  version: '1.0.0',
  releaseStatus: 'draft',

  stages: {
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'account.setup_started', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'A properly configured account ensures your business runs smoothly and your team has the right access.',
        },
      ],
      navigation: [],
      calendlyTypes: [],
      prompt: 'Help the pro understand the importance of account setup for their business operations.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'account.setup_started', negated: false },
          { variable: 'account.setup_complete', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'company-profile', required: true },
        { itemId: 'business-hours', required: true },
        { itemId: 'add-employees', required: false },
        { itemId: 'notifications-settings', required: false },
        { itemId: 'custom-sms', required: false },
        { itemId: 'estimates-settings', required: false },
        { itemId: 'invoice-settings', required: false },
        { itemId: 'connect-bank-account', required: true },
        { itemId: 'consumer-financing', required: false },
      ],
      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Complete your account setup to unlock all features. Start with company profile and business hours.',
        },
      ],
      navigation: [
        {
          name: 'Company Settings',
          description: 'Configure your company profile and branding',
          url: '/settings/company',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Team Management',
          description: 'Add and manage team members',
          url: '/settings/team',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [
        {
          name: 'Account Setup Help',
          url: 'https://calendly.com/hcp-onboarding/account-setup',
          team: 'onboarding',
          description: 'Get help configuring your account settings',
        },
      ],
      prompt: 'Guide the pro through completing their account setup. Prioritize company profile and payment setup.',
      tools: [],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'account.setup_complete', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'ready',
          title: 'Setup Complete',
          content: 'Account setup is complete. Review settings periodically to keep information current.',
        },
      ],
      navigation: [
        {
          name: 'Settings',
          description: 'Review and update your settings',
          url: '/settings',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Account is set up. Help with any questions about settings or adjustments.',
      tools: [],
    },

    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'account.setup_complete', negated: false },
          { variable: 'account.settings_updated', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'optimized',
          title: 'Optimized',
          content: 'Account is fully configured and being actively maintained.',
        },
      ],
      navigation: [],
      calendlyTypes: [],
      prompt: 'Account is well-maintained. Offer advanced configuration tips as needed.',
      tools: [],
    },
  },
};
