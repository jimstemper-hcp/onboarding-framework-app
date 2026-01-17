import type { Feature } from '../../types';

export const automatedCommsFeature: Feature = {
  id: 'automated-comms',
  name: 'Automated Communications',
  description: 'Automated texts and emails to keep customers informed',
  icon: 'Sms',
  version: '2.1.0',

  stages: {
    notAttached: {
      conditions: [
        'Pro does not have Automated Communications in their current plan',
        'Pro has not purchased Communications as an add-on',
      ],
      valueProp: 'Never miss a follow-up again. Automated texts and emails keep your customers informed and coming back.',
      sellPageUrl: '/pricing/communications',
      learnMoreResources: [
        { title: 'Automated Communications Guide', url: 'https://help.housecallpro.com/auto-comms', type: 'guide' },
      ],
      calendlyTypes: [
        { name: 'Communications Demo', url: 'https://calendly.com/hcp-sales/comms', team: 'sales', description: 'See automated communications in action' },
      ],
      upgradeTools: [],
      upgradePrompt: 'Help the pro understand how automated communications save time and improve customer satisfaction.',
      repTalkingPoints: [
        'Automated texts keep customers informed without you lifting a finger',
        'On-my-way texts reduce no-shows significantly',
        'Follow-up emails bring customers back for repeat business',
      ],
    },
    attached: {
      conditions: [
        'Pro has Automated Communications in their plan',
        'Pro has not enabled on-my-way texts or verified their phone number',
      ],
      requiredTasks: [
        { id: 'comms-enable-otw', title: 'Enable on-my-way texts', description: 'Automatically notify customers when you\'re heading to their location', estimatedMinutes: 2, actionUrl: '/settings/communications/otw', completionEvent: 'comms.otw_enabled' },
        { id: 'comms-verify-number', title: 'Verify your business phone', description: 'Verify your number so texts come from your business', estimatedMinutes: 3, actionUrl: '/settings/communications/verify', completionEvent: 'comms.number_verified' },
      ],
      productPages: [{ name: 'Communication Settings', path: '/settings/communications', description: 'Configure automated messages' }],
      tooltipUrls: [],
      videos: [
        { title: 'Setting Up Automated Texts', url: 'https://youtube.com/watch?v=hcp-auto-texts', durationSeconds: 180 },
      ],
      calendlyTypes: [
        { name: 'Communications Setup', url: 'https://calendly.com/hcp-onboarding/comms', team: 'onboarding', description: 'Get help setting up automated messages' },
      ],
      mcpTools: [],
      agenticPrompt: 'Guide the pro through enabling on-my-way texts and verifying their business phone number.',
      repTalkingPoints: [
        'Let\'s get your on-my-way texts set up first - customers love these',
        'You\'ll need to verify your phone number so texts come from your business',
      ],
    },
    activated: {
      conditions: [
        'Pro has enabled on-my-way texts and verified phone number',
        'Pro has sent fewer than 20 automated messages',
      ],
      optionalTasks: [
        { id: 'comms-review-request', title: 'Set up review requests', description: 'Automatically ask for reviews after completed jobs', estimatedMinutes: 3, actionUrl: '/settings/communications/reviews', completionEvent: 'comms.review_requests_enabled' },
        { id: 'comms-follow-up', title: 'Create follow-up campaigns', description: 'Bring customers back with automated follow-ups', estimatedMinutes: 5, actionUrl: '/settings/communications/campaigns', completionEvent: 'comms.campaigns_created' },
      ],
      productPages: [{ name: 'Message History', path: '/communications', description: 'View sent messages' }],
      calendlyTypes: [],
      mcpTools: [],
      engagementPrompt: 'Encourage the pro to set up review requests and follow-up campaigns.',
      repTalkingPoints: [
        'Your on-my-way texts are working great!',
        'Want to set up automatic review requests? They really help build your reputation',
      ],
    },
    engaged: {
      conditions: [
        'Pro has sent 20 or more automated messages',
        'Pro has sent automated messages within the last 14 days',
      ],
      advancedTips: ['Customize your message templates for a personal touch', 'Use follow-up campaigns for seasonal services'],
      successMetrics: ['Customer response rate over 80%', 'Review request conversion over 20%'],
      upsellOpportunities: ['Add marketing campaigns to reach past customers'],
      repTalkingPoints: ['Your customers are responding well to your messages!', 'Have you tried our marketing campaign features?'],
    },
  },
};
