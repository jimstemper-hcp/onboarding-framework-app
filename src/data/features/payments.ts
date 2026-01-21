import type { Feature } from '../../types';

export const paymentsFeature: Feature = {
  id: 'payments',
  name: 'Payments',
  description: 'Accept credit cards and get paid online',
  icon: 'CreditCard',
  version: '1.0.0',
  releaseStatus: 'published',

  stages: {
    // =========================================================================
    // NOT ATTACHED - Pro doesn't have access to payments
    // =========================================================================
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
        {
          id: 'stat-highlight',
          title: 'Key Statistic',
          content: 'Pros accepting card payments see deposits within 1-2 business days.',
        },
      ],

      navigation: [
        {
          name: 'Payment Processing Setup Guide',
          description: 'Complete guide to accepting online payments',
          url: 'https://help.housecallpro.com/payments-setup',
          navigationType: 'hcp_help',
        },
        {
          name: 'Getting Paid Faster Video',
          description: 'Video showing the customer payment experience',
          url: 'https://www.youtube.com/watch?v=hcp-payments',
          navigationType: 'hcp_video',
        },
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
        {
          name: 'Payments Demo',
          url: 'https://calendly.com/hcp-sales/payments',
          team: 'sales',
          description: 'Learn about payment processing rates and features',
        },
      ],

      prompt: `When user asks about payments:
1. First, explain how online payments let customers pay instantly with credit cards
2. Reference the help article: "Payment Processing Setup Guide"
3. Mention deposits arrive within 1-2 business days
4. Then say: "I notice you don't have payment processing enabled yet. I can schedule a call with our team to walk you through rates and show you how easy it is to get paid faster."
5. If interested, provide the Calendly link

Key points to emphasize:
- Instant credit card payments
- Fast deposits (1-2 business days)
- Professional checkout experience
- Competitive processing rates

## Chat Experience
When the user asks about payments at this stage:
- Response: "Great question about payments! Let me explain how online payment processing works."
- Priority Action: call
- Suggested CTA: "Talk to Sales" - Payment processing isn't enabled on your account yet. I can schedule a call with our team to walk you through rates and show you how easy it is to get paid faster.
- Escalation Triggers: pricing, rates, fees`,

      tools: [
        {
          name: 'check_plan_eligibility',
          description: 'Check if the pro is eligible to add payments',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'get_payment_rates',
          description: 'Get current payment processing rates',
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
    // ATTACHED - Pro has access but hasn't connected bank
    // =========================================================================
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
        {
          id: 'sample-flow',
          title: 'Sample Data Option',
          content: 'Offer to show a sample payment flow or help connect their real bank account.',
        },
      ],

      navigation: [
        {
          name: 'Connecting Your Bank Account',
          description: 'Step-by-step guide for payment setup',
          url: 'https://help.housecallpro.com/connect-bank',
          navigationType: 'hcp_help',
        },
        {
          name: 'Payment Setup Tutorial',
          description: 'Video walkthrough of the setup process',
          url: 'https://www.youtube.com/watch?v=hcp-payment-setup',
          navigationType: 'hcp_video',
        },
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
        {
          name: 'Payments Setup Help',
          url: 'https://calendly.com/hcp-onboarding/payments',
          team: 'onboarding',
          description: 'Get help connecting your bank account',
        },
      ],

      prompt: `When user asks about payments:
1. First explain how payment processing works with help article reference
2. Then ask: "Would you like to see a sample payment flow, or are you ready to connect your real bank account?"

If SAMPLE:
- Show preview of what customer sees when paying
- Demonstrate the payment confirmation flow
- Explain deposit timing
- Offer next steps: connect bank when ready

If REAL:
- Guide them to Payment Settings
- Explain the verification steps
- Offer to answer questions during setup

Always show previews and get confirmation before making changes.

## Chat Experience
When the user asks about payments at this stage:
- Response: "You have payments enabled! Let's get your bank account connected so you can start accepting cards."
- Priority Action: onboarding
- Suggested CTA: "Connect Bank" - Would you like to see a sample payment flow to understand how it works, or are you ready to connect your bank account?
- Escalation Triggers: verification failed, bank error, stuck`,

      tools: [
        {
          name: 'preview_payment_flow',
          description: 'Show sample customer payment experience',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'start_bank_connection',
          description: 'Navigate to bank connection setup',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'check_verification_status',
          description: 'Check identity verification status',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ACTIVATED - Pro is set up, ready to accept payments
    // =========================================================================
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
        {
          id: 'pro-tip',
          title: 'Pro Tip',
          content: 'Enable tipping and card-on-file to improve the customer experience and get repeat business.',
        },
      ],

      navigation: [
        {
          name: 'Enabling Tips & Card on File',
          description: 'Guide to payment enhancement features',
          url: 'https://help.housecallpro.com/payment-features',
          navigationType: 'hcp_help',
        },
        {
          name: 'Payment Features Video',
          description: 'Video showing tipping and card-on-file setup',
          url: 'https://www.youtube.com/watch?v=hcp-payment-features',
          navigationType: 'hcp_video',
        },
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

      prompt: `When user asks about payments:
1. Provide help content - they're ready to accept payments
2. Offer these specific actions:
   - "Would you like to enable tipping to boost your technicians' earnings?"
   - "Would you like to test a payment to see the customer experience?"
   - "Would you like to set up card-on-file for repeat customers?"
3. For each action, explain the benefit and guide them through

Key actions to offer:
1. Enable tipping - navigate to settings with instructions
2. Test payment - create and send test payment link
3. Card on file - explain benefits and setup

## Chat Experience
When the user asks about payments at this stage:
- Response: "You're all set up for payments! Ready to accept your first online payment."
- Priority Action: navigation
- Suggested CTA: "Enable Tipping" - What would you like to do? 1. Enable tipping for your team 2. Test a payment to see the experience 3. Set up card-on-file for repeat customers
- Escalation Triggers: payment failed, not receiving, where is my money`,

      tools: [
        {
          name: 'enable_tipping',
          description: 'Enable tipping for customer payments',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            tipOptions: { type: 'array', description: 'Suggested tip percentages' },
          },
        },
        {
          name: 'send_test_payment',
          description: 'Send test payment link to pro',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'setup_card_on_file',
          description: 'Configure card-on-file settings',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ENGAGED - Pro is actively accepting payments
    // =========================================================================
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
        {
          id: 'advanced-tip',
          title: 'Advanced Tip',
          content: 'Offer financing for larger jobs to help customers afford bigger projects and increase your average ticket.',
        },
      ],

      navigation: [
        {
          name: 'Financing Options Guide',
          description: 'How to offer customer financing',
          url: 'https://help.housecallpro.com/financing',
          navigationType: 'hcp_help',
        },
        {
          name: 'Payment Analytics Tutorial',
          description: 'Video on tracking payment performance',
          url: 'https://www.youtube.com/watch?v=hcp-payment-analytics',
          navigationType: 'hcp_video',
        },
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

      prompt: `When user asks about payments:
1. Provide advanced tips and help content for power users
2. Offer to help with advanced features:
   - "Would you like to explore financing options to help customers afford larger jobs?"
   - "Would you like to see your payment analytics?"
   - "Would you like to set up tap-to-pay for field payments?"
3. Explain how financing can increase average ticket size

Advanced features to highlight:
- Customer financing for larger jobs
- Tap-to-pay mobile payments
- Payment analytics and insights
- Recurring payment setup

## Chat Experience
When the user asks about payments at this stage:
- Response: "Your customers love paying online! You're doing great with card payments."
- Priority Action: tip
- Suggested CTA: "Explore Financing" - Would you like to explore financing options for larger jobs? It can help customers afford bigger projects and increase your average ticket size.
- Escalation Triggers: chargeback, dispute, fraud`,

      tools: [
        {
          name: 'setup_financing',
          description: 'Enable customer financing options',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'get_payment_analytics',
          description: 'Get payment performance metrics',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            period: { type: 'string', description: 'Time period: week, month, quarter' },
          },
        },
        {
          name: 'setup_tap_to_pay',
          description: 'Configure mobile tap-to-pay',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },
  },
};
