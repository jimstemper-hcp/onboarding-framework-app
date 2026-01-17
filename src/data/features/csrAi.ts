import type { Feature } from '../../types';

export const csrAiFeature: Feature = {
  id: 'csr-ai',
  name: 'AI Voice Agent',
  description: 'AI assistant that answers calls and books jobs for you 24/7',
  icon: 'SupportAgent',

  stages: {
    notAttached: {
      valueProp: 'Never miss a call again. Our AI answers your phone 24/7, books jobs, and sounds just like a real person.',
      sellPageUrl: '/pricing/ai-voice',
      learnMoreResources: [
        { title: 'AI Voice Agent Overview', url: 'https://help.housecallpro.com/ai-voice', type: 'article' },
        { title: 'Hear the AI in Action', url: 'https://youtube.com/watch?v=hcp-ai-demo', type: 'video' },
      ],
      calendlyTypes: [
        { name: 'AI Voice Demo', url: 'https://calendly.com/hcp-sales/ai-voice', team: 'sales', description: 'Hear the AI answer a sample call' },
      ],
      upgradeTools: [],
      upgradePrompt: 'Help the pro understand how the AI voice agent can capture more leads and book jobs automatically.',
      repTalkingPoints: [
        'The AI answers calls when you can\'t - nights, weekends, when you\'re on a job',
        'It sounds natural and can book jobs right into your calendar',
        'Pros using AI Voice capture 30% more leads on average',
      ],
    },
    attached: {
      requiredTasks: [
        { id: 'csr-configure-greeting', title: 'Configure your AI greeting', description: 'Customize how the AI introduces itself and your business', estimatedMinutes: 5, actionUrl: '/settings/ai-voice/greeting', completionEvent: 'ai.greeting_configured' },
        { id: 'csr-set-services', title: 'Tell the AI your services', description: 'List the services you offer so the AI can answer questions', estimatedMinutes: 5, actionUrl: '/settings/ai-voice/services', completionEvent: 'ai.services_configured' },
        { id: 'csr-forward-number', title: 'Set up call forwarding', description: 'Forward calls to the AI when you can\'t answer', estimatedMinutes: 3, actionUrl: '/settings/ai-voice/forwarding', completionEvent: 'ai.forwarding_enabled' },
      ],
      productPages: [
        { name: 'AI Voice Settings', path: '/settings/ai-voice', description: 'Configure your AI assistant' },
      ],
      tooltipUrls: [],
      videos: [
        { title: 'Setting Up AI Voice', url: 'https://youtube.com/watch?v=hcp-ai-setup', durationSeconds: 300 },
      ],
      calendlyTypes: [
        { name: 'AI Voice Setup Help', url: 'https://calendly.com/hcp-onboarding/ai-voice', team: 'onboarding', description: 'Get help configuring your AI' },
      ],
      mcpTools: [],
      agenticPrompt: 'Guide the pro through configuring their AI greeting, listing their services, and setting up call forwarding.',
      repTalkingPoints: [
        'Let\'s customize how the AI greets your callers',
        'The AI needs to know your services to answer questions accurately',
        'You can set it to only take over when you miss calls, or handle all calls',
      ],
    },
    activated: {
      optionalTasks: [
        { id: 'csr-chat-widget', title: 'Add chat to your website', description: 'Let the AI handle website chats too', estimatedMinutes: 5, actionUrl: '/settings/ai-voice/chat-widget', completionEvent: 'ai.chat_enabled' },
        { id: 'csr-custom-responses', title: 'Add custom Q&A', description: 'Train the AI on your most common questions', estimatedMinutes: 10, actionUrl: '/settings/ai-voice/qa', completionEvent: 'ai.qa_added' },
      ],
      productPages: [{ name: 'AI Call History', path: '/ai-voice/calls', description: 'Review AI-handled calls' }],
      calendlyTypes: [],
      mcpTools: [],
      engagementPrompt: 'Encourage the pro to review AI call recordings and add the chat widget to their website.',
      repTalkingPoints: [
        'Your AI is ready to take calls!',
        'Review the call recordings to see how it\'s doing',
        'Want to add AI chat to your website too?',
      ],
    },
    engaged: {
      advancedTips: ['Review call transcripts weekly to improve AI responses', 'Add FAQs for questions the AI struggles with'],
      successMetrics: ['Call booking rate over 40%', 'Customer satisfaction over 4 stars'],
      upsellOpportunities: ['Add more AI minutes for busier seasons'],
      repTalkingPoints: ['Your AI is booking jobs while you work!', 'Want to expand its capabilities?'],
    },
  },
};
