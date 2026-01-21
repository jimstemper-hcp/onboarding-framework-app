import type { Feature } from '../../types';

export const csrAiFeature: Feature = {
  id: 'csr-ai',
  name: 'AI Voice Agent',
  description: '24/7 AI-powered phone answering and chat for your business',
  icon: 'SmartToy',
  version: '2.0.0',

  stages: {
    // =========================================================================
    // NOT ATTACHED - Pro doesn't have access to AI Voice
    // =========================================================================
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.csrAi', negated: true },
          { variable: 'addons.csrAi', negated: true },
        ],
      },

      onboardingItems: [],

      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Never miss a call again. AI answers your phone 24/7, books appointments, and captures leads when you can\'t answer.',
        },
        {
          id: 'stat-highlight',
          title: 'Key Statistic',
          content: 'Capture leads 24/7, even when you\'re on a job or after hours.',
        },
      ],

      navigation: [
        {
          name: 'AI Voice Agent Overview',
          description: 'Complete guide to 24/7 AI phone answering',
          url: 'https://help.housecallpro.com/ai-voice-setup',
          navigationType: 'hcp_help',
        },
        {
          name: 'Hear AI Voice in Action',
          description: 'Demo video of the AI answering a call',
          url: 'https://www.youtube.com/watch?v=hcp-ai-demo',
          navigationType: 'hcp_video',
        },
        {
          name: 'AI Voice Pricing',
          description: 'Self-serve page for AI Voice pricing',
          url: '/pricing/ai-voice',
          navigationType: 'hcp_external',
        },
        {
          name: 'AI Voice Overview',
          description: 'Help article explaining AI Voice features',
          url: 'https://help.housecallpro.com/ai-voice',
          navigationType: 'hcp_help',
        },
      ],

      calendlyTypes: [
        {
          name: 'AI Voice Demo',
          url: 'https://calendly.com/hcp-sales/ai-voice',
          team: 'sales',
          description: 'See AI Voice in action and hear a sample call',
        },
      ],

      prompt: `When user asks about AI Voice or phone answering:
1. First, explain how AI Voice answers calls 24/7 when you can't
2. Reference the help article: "AI Voice Agent Overview"
3. Mention the key benefit: capture leads 24/7
4. Offer: "Would you like to hear a sample of how the AI sounds?" or "I can schedule a demo for you."
5. If interested, provide the Calendly link or demo recording

Key points to emphasize:
- Never miss another call
- AI sounds natural and professional
- Books appointments directly on your calendar
- Captures lead info for follow-up
- Works 24/7, even after hours

## Chat Experience
When the user asks about AI Voice at this stage:
- Response: "Great question about AI Voice! Let me explain how it answers your calls 24/7."
- Priority Action: call
- Suggested CTA: "Hear Sample" - AI Voice isn't enabled on your account yet. Would you like to hear a sample of how the AI sounds, or schedule a demo to see it in action?
- Escalation Triggers: pricing, how much, live person`,

      tools: [
        {
          name: 'check_plan_eligibility',
          description: 'Check if the pro is eligible to add AI Voice',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'play_sample_call',
          description: 'Play a sample AI Voice call recording',
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
    // ATTACHED - Pro has access but hasn't configured AI
    // =========================================================================
    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.csrAi', negated: false },
          { variable: 'csrAi.setup_complete', negated: true },
        ],
      },

      onboardingItems: [
        { itemId: 'customize-ai-greeting', required: true },
        { itemId: 'add-business-info', required: true, stageSpecificNote: 'Teach the AI about your services' },
        { itemId: 'test-ai-call', required: true },
        { itemId: 'enable-ai-answering', required: true },
        { itemId: 'rep-intro-call-completed', required: false },
      ],

      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Customize your AI greeting, add your business info, and make a test call to hear it in action.',
        },
        {
          id: 'sample-flow',
          title: 'Sample Data Option',
          content: 'Offer to set up a sample greeting or make a test call right away.',
        },
      ],

      navigation: [
        {
          name: 'AI Voice Configuration Guide',
          description: 'How to set up and customize your AI',
          url: 'https://help.housecallpro.com/ai-voice-config',
          navigationType: 'hcp_help',
        },
        {
          name: 'Customizing Your Greeting',
          description: 'Video on creating the perfect AI greeting',
          url: 'https://youtube.com/watch?v=hcp-ai-greeting',
          navigationType: 'hcp_video',
        },
        {
          name: 'AI Voice Settings',
          description: 'Configure your AI Voice agent',
          url: '/settings/ai-voice',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Test Your AI',
          description: 'Make a test call to your AI',
          url: '/settings/ai-voice/test',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [
        {
          name: 'AI Voice Setup Help',
          url: 'https://calendly.com/hcp-onboarding/ai-voice',
          team: 'onboarding',
          description: 'Get help setting up your AI',
        },
      ],

      prompt: `When user asks about AI Voice:
1. First explain how AI Voice configuration works with help article reference
2. Then ask: "Would you like to set up your AI greeting now, or make a test call to hear the default first?"

If SETUP GREETING:
- Guide through greeting customization
- Show preview of what caller hears
- Help add business info for Q&A

If TEST CALL:
- Explain how to call from personal phone
- Share the AI phone number
- Offer to review the transcript after

Always get confirmation before enabling live answering.

## Chat Experience
When the user asks about AI Voice at this stage:
- Response: "You have AI Voice! Let's get your AI configured and ready to answer calls."
- Priority Action: onboarding
- Suggested CTA: "Test AI" - Would you like to set up your AI greeting now, or make a test call to hear the default AI first?
- Escalation Triggers: not working, wrong number, forwarding issue`,

      tools: [
        {
          name: 'preview_greeting',
          description: 'Show preview of AI greeting',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'customize_greeting',
          description: 'Customize the AI greeting message',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            greeting: { type: 'string', description: 'Custom greeting text' },
          },
        },
        {
          name: 'get_test_number',
          description: 'Get number for test call',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'add_business_faq',
          description: 'Add Q&A for AI to answer',
          parameters: {
            question: { type: 'string', description: 'Question customers ask', required: true },
            answer: { type: 'string', description: 'Answer AI should give', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ACTIVATED - Pro has AI configured
    // =========================================================================
    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'csrAi.setup_complete', negated: false },
          { variable: 'csrAi.call_count', negated: true },
        ],
      },

      onboardingItems: [],

      contextSnippets: [
        {
          id: 'ready-to-go',
          title: 'AI Active',
          content: 'Your AI is ready! Add the chat widget to your website for even more lead capture.',
        },
        {
          id: 'pro-tip',
          title: 'Pro Tip',
          content: 'Add the chat widget to capture leads from your website 24/7.',
        },
      ],

      navigation: [
        {
          name: 'Chat Widget Setup Guide',
          description: 'How to add AI chat to your website',
          url: 'https://help.housecallpro.com/ai-chat-widget',
          navigationType: 'hcp_help',
        },
        {
          name: 'Optimizing Your AI',
          description: 'Video on improving AI responses',
          url: 'https://www.youtube.com/watch?v=hcp-ai-optimize',
          navigationType: 'hcp_video',
        },
        {
          name: 'AI Voice Settings',
          description: 'Configure your AI',
          url: '/settings/ai-voice',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Chat Widget',
          description: 'Get embed code for website',
          url: '/settings/ai-voice/chat-widget',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [],

      prompt: `When user asks about AI Voice:
1. Provide help content - AI is configured
2. Offer these specific actions:
   - "Would you like to make a test call to hear your AI in action?"
   - "Would you like to add the chat widget to your website for more leads?"
   - "Would you like to review and customize your AI greeting?"
3. For each action, explain the benefit and guide them through

Key actions to offer:
1. Test call - hear the AI themselves
2. Chat widget - capture website leads
3. Review greeting - ensure it sounds right

## Chat Experience
When the user asks about AI Voice at this stage:
- Response: "Your AI Voice is configured! Ready to answer calls 24/7."
- Priority Action: navigation
- Suggested CTA: "Test Call" - What would you like to do? 1. Make a test call to hear your AI 2. Add the chat widget to your website 3. Review your AI greeting
- Escalation Triggers: ai not answering, call not forwarding, wrong greeting`,

      tools: [
        {
          name: 'make_test_call',
          description: 'Initiate a test call to the AI',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'get_chat_widget_code',
          description: 'Get embed code for chat widget',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'review_greeting',
          description: 'Show current AI greeting',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ENGAGED - Pro is actively using AI Voice
    // =========================================================================
    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'csrAi.call_count', negated: false },
          { variable: 'csrAi.recent_activity', negated: false },
        ],
      },

      onboardingItems: [],

      contextSnippets: [
        {
          id: 'success',
          title: 'AI Working Great',
          content: 'Your AI is capturing leads! Train it with custom Q&A to handle more questions.',
        },
        {
          id: 'advanced-tip',
          title: 'Advanced Tip',
          content: 'Review call transcripts and add custom Q&A to improve AI responses.',
        },
      ],

      navigation: [
        {
          name: 'AI Training Guide',
          description: 'How to train your AI with custom Q&A',
          url: 'https://help.housecallpro.com/ai-training',
          navigationType: 'hcp_help',
        },
        {
          name: 'Call Analytics Tutorial',
          description: 'Video on understanding call analytics',
          url: 'https://www.youtube.com/watch?v=hcp-call-analytics',
          navigationType: 'hcp_video',
        },
        {
          name: 'Call History',
          description: 'Review AI call transcripts',
          url: '/ai-voice/calls',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'AI Training',
          description: 'Add custom Q&A for your AI',
          url: '/settings/ai-voice/training',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [],

      prompt: `When user asks about AI Voice:
1. Provide advanced tips for power users
2. Offer to help with optimization:
   - "Would you like to train your AI with custom Q&A for better responses?"
   - "Would you like to review recent call transcripts?"
   - "Would you like to set up escalation rules for complex calls?"
3. Explain how training improves AI performance

Advanced features to highlight:
- Custom Q&A training
- Call transcript review
- Escalation rules for complex calls
- Call analytics and insights

## Chat Experience
When the user asks about AI Voice at this stage:
- Response: "Your AI is working great! It's capturing leads around the clock."
- Priority Action: tip
- Suggested CTA: "Train AI" - Would you like to train your AI with custom Q&A to handle more types of questions? You can also review call transcripts to see how it's doing.
- Escalation Triggers: ai giving wrong info, customers frustrated, booking errors`,

      tools: [
        {
          name: 'add_custom_qa',
          description: 'Train AI with custom Q&A',
          parameters: {
            question: { type: 'string', description: 'Question pattern', required: true },
            answer: { type: 'string', description: 'AI response', required: true },
          },
        },
        {
          name: 'get_call_transcripts',
          description: 'Get recent call transcripts',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            limit: { type: 'number', description: 'Number of transcripts' },
          },
        },
        {
          name: 'setup_escalation_rules',
          description: 'Configure when to escalate to human',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            triggers: { type: 'array', description: 'Escalation triggers' },
          },
        },
        {
          name: 'get_call_analytics',
          description: 'Get AI call performance metrics',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            period: { type: 'string', description: 'Time period' },
          },
        },
      ],
    },
  },
};
