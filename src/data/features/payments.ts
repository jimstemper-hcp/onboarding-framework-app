import type { Feature } from '../../types';

export const paymentsFeature: Feature = {
  id: 'payments',
  name: 'Collecting Payment',
  description: 'Accept credit cards and get paid online',
  icon: 'CreditCard',
  version: '1.0.0',

  stages: {
    notAttached: {
      conditions: [
        'Pro does not have Payments feature in their current plan',
        'Pro has not purchased Payments as an add-on',
      ],
      valueProp: 'Accept credit cards and get paid instantly. No more chasing checks or waiting for cash.',
      sellPageUrl: '/pricing/payments',
      learnMoreResources: [
        { title: 'Payment Processing Overview', url: 'https://help.housecallpro.com/payments', type: 'article' },
      ],
      calendlyTypes: [
        { name: 'Payments Demo', url: 'https://calendly.com/hcp-sales/payments', team: 'sales', description: 'Learn about payment processing' },
      ],
      upgradeTools: [],
      upgradePrompt: 'Help the pro understand the value of accepting online payments.',
      repTalkingPoints: [
        'Online payments mean you get paid 2x faster',
        'Customers prefer paying by card - it\'s convenient',
        'No more chasing checks or handling cash',
      ],
    },
    attached: {
      conditions: [
        'Pro has Payments feature in their plan',
        'Pro has not connected their bank account or verified identity',
      ],
      requiredTasks: [
        { id: 'payments-connect-stripe', title: 'Connect your bank account', description: 'Link your bank account to receive payments', estimatedMinutes: 5, actionUrl: '/settings/payments/connect', completionEvent: 'payments.stripe_connected' },
        { id: 'payments-verify', title: 'Verify your identity', description: 'Quick verification required by payment processors', estimatedMinutes: 3, actionUrl: '/settings/payments/verify', completionEvent: 'payments.verified' },
      ],
      productPages: [{ name: 'Payment Settings', path: '/settings/payments', description: 'Configure payment processing' }],
      tooltipUrls: [],
      videos: [],
      calendlyTypes: [
        { name: 'Payments Setup Help', url: 'https://calendly.com/hcp-onboarding/payments', team: 'onboarding', description: 'Get help connecting payments' },
      ],
      mcpTools: [],
      agenticPrompt: 'Help the pro connect their bank account and verify their identity to start accepting payments.',
      repTalkingPoints: [
        'You need to connect your bank account to receive payments',
        'Verification is quick and required by payment processors',
        'Once set up, you can accept cards immediately',
      ],
    },
    activated: {
      conditions: [
        'Pro has connected bank account and verified identity',
        'Pro has processed fewer than 10 payments',
      ],
      optionalTasks: [
        { id: 'payments-enable-tips', title: 'Enable tipping', description: 'Let customers add tips when paying', estimatedMinutes: 1, actionUrl: '/settings/payments/tips', completionEvent: 'payments.tips_enabled' },
      ],
      productPages: [{ name: 'Payments Dashboard', path: '/payments', description: 'View payment history and payouts' }],
      calendlyTypes: [],
      mcpTools: [],
      engagementPrompt: 'Encourage the pro to process their first payment and enable tipping.',
      repTalkingPoints: [
        'You\'re all set to accept payments!',
        'Try enabling tips - your techs will appreciate it',
      ],
    },
    engaged: {
      conditions: [
        'Pro has processed 10 or more payments',
        'Pro has processed a payment within the last 30 days',
      ],
      advancedTips: ['Enable tipping for your field techs', 'Use the mobile app to take payments on-site'],
      successMetrics: ['Card payment adoption over 70%'],
      upsellOpportunities: ['Consider financing options for larger jobs'],
      repTalkingPoints: ['Great payment adoption!', 'Have you tried our financing options?'],
    },
  },
};
