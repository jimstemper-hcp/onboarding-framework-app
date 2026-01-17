import type { Feature } from '../../types';

export const csrAiFeature: Feature = {
  id: 'csr-ai',
  name: 'AI Voice Agent',
  description: 'AI assistant that answers calls and books jobs for you 24/7',
  icon: 'SupportAgent',
  version: '0.9.0',

  stages: {
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
          content: 'Never miss a call again. Our AI answers your phone 24/7, books jobs, and sounds just like a real person.',
        },
      ],
      navigation: [
        {
          name: 'AI Voice Pricing',
          description: 'Self-serve page for AI voice agent pricing and plans',
          url: '/pricing/ai-voice',
          navigationType: 'hcp_external',
        },
        {
          name: 'AI Voice Agent Overview',
          description: 'Help article explaining how the AI voice agent works',
          url: 'https://help.housecallpro.com/ai-voice',
          navigationType: 'hcp_help',
        },
        {
          name: 'Hear the AI in Action',
          description: 'Demo video showing the AI voice agent answering a call',
          url: 'https://youtube.com/watch?v=hcp-ai-demo',
          navigationType: 'hcp_video',
        },
      ],
      calendlyTypes: [
        { name: 'AI Voice Demo', url: 'https://calendly.com/hcp-sales/ai-voice', team: 'sales', description: 'Hear the AI answer a sample call' },
      ],
      prompt: 'Help the pro understand how the AI voice agent can capture more leads and book jobs automatically.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.csrAi', negated: false },
          { variable: 'ai.setup_complete', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'configure-ai-greeting', required: true },
        { itemId: 'configure-ai-services', required: true, stageSpecificNote: 'List all services so the AI can answer questions accurately' },
        { itemId: 'setup-call-forwarding', required: true },
        { itemId: 'rep-training-session-completed', required: false, stageSpecificNote: 'AI Voice training session covers best practices' },
      ],
      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Configure your AI greeting, list your services, and set up call forwarding to start capturing more leads.',
        },
      ],
      navigation: [
        {
          name: 'AI Voice Settings',
          description: 'Configure your AI assistant',
          url: '/settings/ai-voice',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Setting Up AI Voice',
          description: 'Video tutorial on configuring the AI',
          url: 'https://youtube.com/watch?v=hcp-ai-setup',
          navigationType: 'hcp_video',
        },
      ],
      calendlyTypes: [
        { name: 'AI Voice Setup Help', url: 'https://calendly.com/hcp-onboarding/ai-voice', team: 'onboarding', description: 'Get help configuring your AI' },
      ],
      prompt: 'Guide the pro through configuring their AI greeting, listing their services, and setting up call forwarding.',
      tools: [],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'ai.setup_complete', negated: false },
          { variable: 'ai.call_count', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'ready-to-go',
          title: 'AI Ready',
          content: 'Your AI is ready to take calls! Add the chat widget to your website for even more leads.',
        },
      ],
      navigation: [
        {
          name: 'AI Call History',
          description: 'Review AI-handled calls',
          url: '/ai-voice/calls',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Chat Widget',
          description: 'Add AI chat to your website',
          url: '/settings/ai-voice/chat-widget',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Encourage the pro to review AI call recordings and add the chat widget to their website.',
      tools: [],
    },

    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'ai.call_count', negated: false },
          { variable: 'ai.recent_activity', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'success',
          title: 'AI Champion',
          content: 'Your AI is booking jobs while you work! Review transcripts to improve responses.',
        },
      ],
      navigation: [
        {
          name: 'AI Call History',
          description: 'Review AI-handled calls',
          url: '/ai-voice/calls',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'AI Q&A Training',
          description: 'Improve AI responses with custom Q&A',
          url: '/settings/ai-voice/qa',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the experienced AI user optimize responses and expand capabilities.',
      tools: [],
    },
  },
};
