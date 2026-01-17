import type { Feature } from '../../types';

export const reviewsFeature: Feature = {
  id: 'reviews',
  name: 'Reviews',
  description: 'Collect and manage customer reviews to build your reputation',
  icon: 'Star',

  stages: {
    notAttached: {
      valueProp: 'Build your online reputation automatically. Request reviews after every job and watch your ratings grow.',
      sellPageUrl: '/pricing/reviews',
      learnMoreResources: [
        { title: 'Reviews Management Guide', url: 'https://help.housecallpro.com/reviews', type: 'guide' },
      ],
      calendlyTypes: [
        { name: 'Reviews Demo', url: 'https://calendly.com/hcp-sales/reviews', team: 'sales', description: 'See the reviews features' },
      ],
      upgradeTools: [],
      upgradePrompt: 'Help the pro understand how automated review collection can build their online reputation.',
      repTalkingPoints: [
        '90% of customers read reviews before hiring a pro',
        'Automated review requests make it easy to collect positive feedback',
        'Respond to reviews directly from Housecall Pro',
      ],
    },
    attached: {
      requiredTasks: [
        { id: 'reviews-connect-google', title: 'Connect your Google Business Profile', description: 'Link your Google listing to manage reviews in one place', estimatedMinutes: 3, actionUrl: '/settings/reviews/google', completionEvent: 'reviews.google_connected' },
        { id: 'reviews-enable-requests', title: 'Enable review requests', description: 'Automatically ask for reviews after completed jobs', estimatedMinutes: 2, actionUrl: '/settings/reviews/requests', completionEvent: 'reviews.requests_enabled' },
      ],
      productPages: [
        { name: 'Reviews Dashboard', path: '/reviews', description: 'View and manage reviews' },
        { name: 'Review Settings', path: '/settings/reviews', description: 'Configure review requests' },
      ],
      tooltipUrls: [],
      videos: [
        { title: 'Setting Up Review Requests', url: 'https://youtube.com/watch?v=hcp-reviews-setup', durationSeconds: 180 },
      ],
      calendlyTypes: [
        { name: 'Reviews Setup', url: 'https://calendly.com/hcp-onboarding/reviews', team: 'onboarding', description: 'Get help with reviews' },
      ],
      mcpTools: [],
      agenticPrompt: 'Guide the pro through connecting their Google Business Profile and enabling automatic review requests.',
      repTalkingPoints: [
        'Let\'s connect your Google Business Profile first',
        'Once connected, you can see all your reviews in one place',
        'We\'ll automatically ask happy customers for reviews',
      ],
    },
    activated: {
      optionalTasks: [
        { id: 'reviews-customize-request', title: 'Customize review request message', description: 'Personalize the message customers receive', estimatedMinutes: 3, actionUrl: '/settings/reviews/message', completionEvent: 'reviews.message_customized' },
        { id: 'reviews-add-facebook', title: 'Connect Facebook page', description: 'Manage Facebook reviews too', estimatedMinutes: 3, actionUrl: '/settings/reviews/facebook', completionEvent: 'reviews.facebook_connected' },
      ],
      productPages: [{ name: 'Reviews Dashboard', path: '/reviews', description: 'View all your reviews' }],
      calendlyTypes: [],
      mcpTools: [],
      engagementPrompt: 'Encourage the pro to customize their review request message and respond to existing reviews.',
      repTalkingPoints: [
        'Your review requests are active!',
        'Pro tip: Respond to every review - it shows you care',
        'Want to customize the message customers receive?',
      ],
    },
    engaged: {
      advancedTips: ['Respond to negative reviews professionally - it shows others you care', 'Share positive reviews on social media'],
      successMetrics: ['Review request conversion over 20%', 'Average rating 4.5+ stars'],
      upsellOpportunities: ['Add marketing features to showcase your reviews'],
      repTalkingPoints: ['Your reviews are growing nicely!', 'Have you tried sharing reviews on social media?'],
    },
  },
};
