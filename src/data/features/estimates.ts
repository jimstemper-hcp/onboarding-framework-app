import type { Feature } from '../../types';

export const estimatesFeature: Feature = {
  id: 'estimates',
  name: 'Estimates',
  description: 'Create and send professional estimates that win jobs',
  icon: 'RequestQuote',

  stages: {
    notAttached: {
      valueProp: 'Win more jobs with professional estimates. Send beautiful quotes that customers can approve with one click.',
      sellPageUrl: '/pricing/estimates',
      learnMoreResources: [
        { title: 'Estimates Overview', url: 'https://help.housecallpro.com/estimates', type: 'article' },
      ],
      calendlyTypes: [
        { name: 'Estimates Demo', url: 'https://calendly.com/hcp-sales/estimates', team: 'sales', description: 'See how estimates work' },
      ],
      upgradeTools: [],
      upgradePrompt: 'Help the pro understand how professional estimates can help them win more jobs.',
      repTalkingPoints: [
        'Professional estimates help you win more jobs',
        'Customers can approve estimates with one click',
        'Approved estimates convert directly to jobs',
      ],
    },
    attached: {
      requiredTasks: [
        { id: 'estimates-price-book', title: 'Add items to your price book', description: 'Set up your services and prices for quick estimates', estimatedMinutes: 5, actionUrl: '/settings/price-book', completionEvent: 'pricebook.item_added' },
        { id: 'estimates-create-first', title: 'Create your first estimate', description: 'Send a professional estimate to a customer', estimatedMinutes: 3, actionUrl: '/estimates/new', completionEvent: 'estimate.created' },
      ],
      productPages: [
        { name: 'Estimates', path: '/estimates', description: 'View and create estimates' },
        { name: 'Price Book', path: '/settings/price-book', description: 'Manage your services and prices' },
      ],
      tooltipUrls: [],
      videos: [
        { title: 'Creating Your First Estimate', url: 'https://youtube.com/watch?v=hcp-estimates', durationSeconds: 180 },
      ],
      calendlyTypes: [
        { name: 'Estimates Setup', url: 'https://calendly.com/hcp-onboarding/estimates', team: 'onboarding', description: 'Get help with estimates' },
      ],
      mcpTools: [],
      agenticPrompt: 'Guide the pro through setting up their price book and creating their first estimate.',
      repTalkingPoints: [
        'Let\'s set up your price book first - it makes creating estimates much faster',
        'Once you have your services listed, estimates take just seconds to create',
      ],
    },
    activated: {
      optionalTasks: [
        { id: 'estimates-templates', title: 'Create estimate templates', description: 'Save time with templates for common jobs', estimatedMinutes: 5, actionUrl: '/settings/templates/estimates', completionEvent: 'template.created' },
        { id: 'estimates-good-better-best', title: 'Set up Good/Better/Best options', description: 'Give customers pricing options to increase ticket size', estimatedMinutes: 5, actionUrl: '/settings/estimates/options', completionEvent: 'estimates.options_enabled' },
      ],
      productPages: [{ name: 'Estimates', path: '/estimates', description: 'Manage your estimates' }],
      calendlyTypes: [],
      mcpTools: [],
      engagementPrompt: 'Encourage the pro to create templates and try Good/Better/Best pricing.',
      repTalkingPoints: [
        'You\'re ready to send estimates!',
        'Pro tip: Good/Better/Best options can increase your average ticket by 30%',
      ],
    },
    engaged: {
      advancedTips: ['Use the mobile app to create estimates on-site', 'Follow up on pending estimates within 24 hours'],
      successMetrics: ['Estimate approval rate over 60%', 'Average time to approval under 2 days'],
      upsellOpportunities: ['Add financing options for larger estimates'],
      repTalkingPoints: ['Your estimate approval rate is looking good!', 'Have you tried offering financing for larger jobs?'],
    },
  },
};
