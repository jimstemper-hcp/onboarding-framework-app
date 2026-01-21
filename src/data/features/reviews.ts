import type { Feature } from '../../types';

export const reviewsFeature: Feature = {
  id: 'reviews',
  name: 'Reviews',
  description: 'Collect and manage customer reviews to build your reputation',
  icon: 'Star',
  version: '1.1.0',

  stages: {
    // =========================================================================
    // NOT ATTACHED - Pro doesn't have access to reviews
    // =========================================================================
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
        {
          id: 'stat-highlight',
          title: 'Key Statistic',
          content: 'More reviews = more new customers. 90% of customers read reviews before hiring.',
        },
      ],

      navigation: [
        {
          name: 'Building Your Online Reputation',
          description: 'Complete guide to collecting customer reviews',
          url: 'https://help.housecallpro.com/reviews-guide',
          navigationType: 'hcp_help',
        },
        {
          name: 'Getting More 5-Star Reviews',
          description: 'Video tips for improving your ratings',
          url: 'https://www.youtube.com/watch?v=hcp-reviews',
          navigationType: 'hcp_video',
        },
        {
          name: 'Reviews Pricing',
          description: 'Self-serve page for reviews management pricing',
          url: '/pricing/reviews',
          navigationType: 'hcp_external',
        },
        {
          name: 'Reviews Management Guide',
          description: 'Guide explaining how to collect and manage customer reviews',
          url: 'https://help.housecallpro.com/reviews',
          navigationType: 'hcp_help',
        },
      ],

      calendlyTypes: [
        {
          name: 'Reviews Demo',
          url: 'https://calendly.com/hcp-sales/reviews',
          team: 'sales',
          description: 'See how automated review collection works',
        },
      ],

      prompt: `When user asks about reviews:
1. First, explain how automated review requests build reputation effortlessly
2. Reference the help article: "Building Your Online Reputation"
3. Mention the statistic: 90% of customers read reviews before hiring
4. Then say: "I notice you don't have review management enabled yet. I can schedule a demo to show you how pros are automatically building their online reputation."
5. If interested, provide the Calendly link

Key points to emphasize:
- Automatic review requests after every job
- Direct link to Google reviews
- Reputation monitoring dashboard
- More reviews = more new customers

## Chat Experience
When the user asks about reviews at this stage:
- Response: "Great question about reviews! Building your online reputation is key to winning new customers."
- Priority Action: call
- Suggested CTA: "Talk to Sales" - Reviews isn't enabled on your account yet. I can schedule a demo to show you how pros are automatically building their online reputation after every job.
- Escalation Triggers: pricing, cost, how much`,

      tools: [
        {
          name: 'check_plan_eligibility',
          description: 'Check if the pro is eligible to add reviews',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'schedule_sales_call',
          description: 'Schedule a sales demo call',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ATTACHED - Pro has access but hasn't set up reviews
    // =========================================================================
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
        { itemId: 'customize-review-message', required: false, stageSpecificNote: 'Personalize for better response rates' },
        { itemId: 'rep-reviewed-account-health', required: false },
      ],

      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Connect your Google Business Profile and enable automatic review requests to start building your reputation.',
        },
        {
          id: 'sample-flow',
          title: 'Sample Data Option',
          content: 'Offer to show a sample review request or help connect their Google profile.',
        },
      ],

      navigation: [
        {
          name: 'Connecting Google Business',
          description: 'How to link your Google Business Profile',
          url: 'https://help.housecallpro.com/connect-google',
          navigationType: 'hcp_help',
        },
        {
          name: 'Setting Up Review Requests',
          description: 'Video tutorial on configuring automatic reviews',
          url: 'https://youtube.com/watch?v=hcp-reviews-setup',
          navigationType: 'hcp_video',
        },
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
      ],

      calendlyTypes: [
        {
          name: 'Reviews Setup Help',
          url: 'https://calendly.com/hcp-onboarding/reviews',
          team: 'onboarding',
          description: 'Get help setting up review requests',
        },
      ],

      prompt: `When user asks about reviews:
1. First explain how review requests work with help article reference
2. Then ask: "Would you like to see a sample review request to understand the flow, or connect your Google Business Profile now?"

If SAMPLE:
- Show what the review request looks like to customers
- Explain the timing (2 hours after job completion)
- Show how it links to Google
- Offer next steps: connect Google, enable requests

If REAL:
- Guide through Google Business connection
- Help enable review requests
- Offer to customize the message

Always show previews and get confirmation.

## Chat Experience
When the user asks about reviews at this stage:
- Response: "You have reviews! Let's get your automatic review requests set up."
- Priority Action: onboarding
- Suggested CTA: "Connect Google" - Would you like to see a sample review request to understand how it works, or connect your Google Business Profile now?
- Escalation Triggers: google not connecting, wrong business, stuck`,

      tools: [
        {
          name: 'preview_review_request',
          description: 'Show sample review request message',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'connect_google_business',
          description: 'Start Google Business Profile connection',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'enable_review_requests',
          description: 'Enable automatic review requests',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            timing: { type: 'string', description: 'Hours after job completion' },
          },
        },
      ],
    },

    // =========================================================================
    // ACTIVATED - Pro has reviews set up
    // =========================================================================
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
        {
          id: 'pro-tip',
          title: 'Pro Tip',
          content: 'Respond to reviews promptly - it shows potential customers you care.',
        },
      ],

      navigation: [
        {
          name: 'Review Response Templates',
          description: 'Professional templates for responding to reviews',
          url: 'https://help.housecallpro.com/review-responses',
          navigationType: 'hcp_help',
        },
        {
          name: 'Customizing Review Requests',
          description: 'Video on personalizing your review messages',
          url: 'https://www.youtube.com/watch?v=hcp-customize-reviews',
          navigationType: 'hcp_video',
        },
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

      prompt: `When user asks about reviews:
1. Provide help content - reviews are ready
2. Offer these specific actions:
   - "Would you like to send a test review request to yourself to see what customers receive?"
   - "Would you like to customize your review request message?"
   - "Would you like to respond to any existing reviews?"
3. For each action, explain the benefit and guide them through

Key actions to offer:
1. Test request - see customer experience
2. Customize message - improve response rate
3. Respond to reviews - show you care

## Chat Experience
When the user asks about reviews at this stage:
- Response: "Your review requests are active! Ready to start building your reputation."
- Priority Action: navigation
- Suggested CTA: "Test Request" - What would you like to do? 1. Send a test review request to yourself 2. Customize your review request message 3. Respond to existing reviews
- Escalation Triggers: reviews not sending, customer didn't receive, wrong link`,

      tools: [
        {
          name: 'send_test_review_request',
          description: 'Send test review request to pro',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'customize_review_message',
          description: 'Edit review request message',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            message: { type: 'string', description: 'Custom message' },
          },
        },
        {
          name: 'get_recent_reviews',
          description: 'Get reviews that need responses',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ENGAGED - Pro is actively collecting reviews
    // =========================================================================
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
          title: 'Reviews Growing',
          content: 'Your reputation is growing! Share positive reviews on social media to reach more customers.',
        },
        {
          id: 'advanced-tip',
          title: 'Advanced Tip',
          content: 'Respond to every review - positive responses thank customers, negative responses show you care.',
        },
      ],

      navigation: [
        {
          name: 'Social Sharing Guide',
          description: 'How to share reviews on social media',
          url: 'https://help.housecallpro.com/share-reviews',
          navigationType: 'hcp_help',
        },
        {
          name: 'Reputation Dashboard Tutorial',
          description: 'Video on using the reputation dashboard',
          url: 'https://www.youtube.com/watch?v=hcp-reputation',
          navigationType: 'hcp_video',
        },
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

      prompt: `When user asks about reviews:
1. Provide advanced tips for power users
2. Offer to help with reputation management:
   - "Would you like to share your positive reviews on social media?"
   - "Would you like me to help you respond to recent reviews?"
   - "Would you like to see your reputation trends over time?"
3. Explain how responding to reviews helps your reputation

Advanced features to highlight:
- Social media sharing for positive reviews
- Professional response templates
- Reputation trends and analytics
- Review monitoring across platforms

## Chat Experience
When the user asks about reviews at this stage:
- Response: "Great reputation! Your reviews are growing and bringing in new customers."
- Priority Action: tip
- Suggested CTA: "Share Reviews" - Would you like to share your best reviews on social media to reach more potential customers? I can also help you respond to recent reviews.
- Escalation Triggers: negative review, bad rating, fake review`,

      tools: [
        {
          name: 'share_review_social',
          description: 'Share a review on social media',
          parameters: {
            reviewId: { type: 'string', description: 'Review to share', required: true },
            platform: { type: 'string', description: 'Facebook, Instagram, etc.' },
          },
        },
        {
          name: 'draft_review_response',
          description: 'Generate response for a review',
          parameters: {
            reviewId: { type: 'string', description: 'Review to respond to', required: true },
            tone: { type: 'string', description: 'Professional, friendly, apologetic' },
          },
        },
        {
          name: 'get_reputation_analytics',
          description: 'Get reputation trends and metrics',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            period: { type: 'string', description: 'Time period' },
          },
        },
      ],
    },
  },
};
