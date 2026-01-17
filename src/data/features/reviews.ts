import type { Feature } from '../../types';

export const reviewsFeature: Feature = {
  id: 'reviews',
  name: 'Reviews',
  description: 'Collect and manage customer reviews to build your reputation',
  icon: 'Star',
  version: '1.0.2',

  stages: {
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.reviews', negated: true },
          { variable: 'addons.reviews', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Build your online reputation automatically. Request reviews after every job and watch your ratings grow.',
        },
      ],
      navigation: [
        {
          name: 'Reviews Pricing',
          description: 'Self-serve page for reviews management pricing',
          url: '/pricing/reviews',
          navigationType: 'hcp_sell_page',
        },
        {
          name: 'Reviews Management Guide',
          description: 'Guide explaining how to collect and manage customer reviews',
          url: 'https://help.housecallpro.com/reviews',
          navigationType: 'hcp_training_article',
        },
      ],
      calendlyTypes: [
        { name: 'Reviews Demo', url: 'https://calendly.com/hcp-sales/reviews', team: 'sales', description: 'See the reviews features' },
      ],
      prompt: 'Help the pro understand how automated review collection can build their online reputation.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.reviews', negated: false },
          { variable: 'reviews.setup_complete', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'connect-google-business', required: true },
        { itemId: 'enable-review-requests', required: true, stageSpecificNote: 'Automatically request reviews after completed jobs' },
        { itemId: 'rep-reviewed-account-health', required: false },
      ],
      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Connect your Google Business Profile and enable automatic review requests to start building your reputation.',
        },
      ],
      navigation: [
        {
          name: 'Reviews Dashboard',
          description: 'View and manage reviews',
          url: '/reviews',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Review Settings',
          description: 'Configure review requests',
          url: '/settings/reviews',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Setting Up Review Requests',
          description: 'Video tutorial on configuring reviews',
          url: 'https://youtube.com/watch?v=hcp-reviews-setup',
          navigationType: 'hcp_video',
        },
      ],
      calendlyTypes: [
        { name: 'Reviews Setup', url: 'https://calendly.com/hcp-onboarding/reviews', team: 'onboarding', description: 'Get help with reviews' },
      ],
      prompt: 'Guide the pro through connecting their Google Business Profile and enabling automatic review requests.',
      tools: [],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'reviews.setup_complete', negated: false },
          { variable: 'reviews.request_count', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'ready-to-go',
          title: 'Reviews Active',
          content: 'Your review requests are active! Customize your message for better response rates.',
        },
      ],
      navigation: [
        {
          name: 'Reviews Dashboard',
          description: 'View all your reviews',
          url: '/reviews',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Review Message',
          description: 'Customize your review request message',
          url: '/settings/reviews/message',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Encourage the pro to customize their review request message and respond to existing reviews.',
      tools: [],
    },

    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'reviews.request_count', negated: false },
          { variable: 'reviews.recent_activity', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'success',
          title: 'Review Champion',
          content: 'Your reviews are growing! Share positive reviews on social media to reach more customers.',
        },
      ],
      navigation: [
        {
          name: 'Reviews Dashboard',
          description: 'View all your reviews',
          url: '/reviews',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Social Sharing',
          description: 'Share reviews on social media',
          url: '/reviews/share',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the experienced reviews user optimize conversion rates and share success on social media.',
      tools: [],
    },
  },
};
