import type { Feature } from '../../types';

export const paymentsFeature: Feature = {
  id: 'payments',
  name: 'Collecting Payment',
  description: 'Accept credit cards and get paid online',
  icon: 'CreditCard',
  version: '1.0.0',

  stages: {
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.payments', negated: true },
          { variable: 'addons.payments', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Accept credit cards and get paid instantly. No more chasing checks or waiting for cash.',
        },
      ],
      navigation: [
        {
          name: 'Payments Pricing',
          description: 'Self-serve page where pros can learn about payment processing pricing',
          url: '/pricing/payments',
          navigationType: 'hcp_external',
        },
        {
          name: 'Payment Processing Overview',
          description: 'Help article explaining how payment processing works',
          url: 'https://help.housecallpro.com/payments',
          navigationType: 'hcp_help',
        },
      ],
      calendlyTypes: [
        { name: 'Payments Demo', url: 'https://calendly.com/hcp-sales/payments', team: 'sales', description: 'Learn about payment processing' },
      ],
      prompt: 'Help the pro understand the value of accepting online payments.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.payments', negated: false },
          { variable: 'payments.setup_complete', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'connect-payment-processor', required: true },
        { itemId: 'collect-first-payment', required: true, stageSpecificNote: 'Process a test payment or your first real payment' },
        { itemId: 'rep-intro-call-completed', required: false },
      ],
      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Connect your bank account and verify your identity to start accepting card payments.',
        },
      ],
      navigation: [
        {
          name: 'Payment Settings',
          description: 'Configure payment processing',
          url: '/settings/payments',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Payments Setup Guide',
          description: 'Step-by-step guide for setting up payments',
          url: 'https://help.housecallpro.com/payments-setup',
          navigationType: 'hcp_help',
        },
      ],
      calendlyTypes: [
        { name: 'Payments Setup Help', url: 'https://calendly.com/hcp-onboarding/payments', team: 'onboarding', description: 'Get help connecting payments' },
      ],
      prompt: 'Help the pro connect their bank account and verify their identity to start accepting payments.',
      tools: [],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'payments.setup_complete', negated: false },
          { variable: 'payments.processed_count', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'enable-card-on-file', required: false, stageSpecificNote: 'Let customers save cards for faster checkout' },
      ],
      contextSnippets: [
        {
          id: 'ready-to-go',
          title: 'Ready to Go',
          content: 'You\'re all set to accept payments! Enable tipping to boost your technicians\' earnings.',
        },
      ],
      navigation: [
        {
          name: 'Payments Dashboard',
          description: 'View payment history and payouts',
          url: '/payments',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Payment Settings',
          description: 'Manage tips and card on file',
          url: '/settings/payments',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Encourage the pro to process their first payment and enable tipping.',
      tools: [],
    },

    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'payments.processed_count', negated: false },
          { variable: 'payments.recent_activity', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'success',
          title: 'Great Payment Adoption',
          content: 'Your customers love paying by card! Consider financing options for larger jobs.',
        },
      ],
      navigation: [
        {
          name: 'Payments Dashboard',
          description: 'View payment history and payouts',
          url: '/payments',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Financing Options',
          description: 'Offer financing for larger jobs',
          url: '/settings/financing',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the experienced payments user optimize their payment collection and explore financing options.',
      tools: [],
    },
  },
};
