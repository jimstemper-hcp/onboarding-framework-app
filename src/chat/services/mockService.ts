// =============================================================================
// MOCK AI SERVICE
// =============================================================================
// Provides simulated AI responses for demo purposes when no API key is available.
// Uses the chatExperience data to generate feature-aware, stage-appropriate responses.
// Supports multi-turn conversational flows with sample/real data options.
// =============================================================================

import type { Feature, ProAccount, FeatureId, AdoptionStage, StageContext } from '../../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface MockContext {
  activePro: ProAccount;
  features: Feature[];
  getStageContext: (featureId: FeatureId, stage: AdoptionStage) => StageContext | undefined;
}

interface DetectedFeature {
  feature: Feature;
  stage: AdoptionStage;
  stageContext: StageContext | undefined;
}

/**
 * Conversation state for multi-turn flows.
 */
export interface ConversationState {
  currentFeature?: FeatureId;
  currentStage?: AdoptionStage;
  flowState: 'initial' | 'awaiting_choice' | 'awaiting_confirmation' | 'awaiting_input';
  pendingAction?: {
    toolName: string;
    preview: Record<string, unknown>;
    type: 'sample' | 'real';
  };
  createdItems: Array<{ type: string; id: string; data: Record<string, unknown> }>;
  dataChoice?: 'sample' | 'real';
  awaitingField?: string;
  collectedData?: Record<string, unknown>;
}

// Global conversation state (persisted across calls within session)
let conversationState: ConversationState = {
  flowState: 'initial',
  createdItems: [],
};

/**
 * Reset conversation state (useful for testing or starting fresh).
 */
export function resetConversationState(): void {
  conversationState = {
    flowState: 'initial',
    createdItems: [],
  };
}

/**
 * Get current conversation state (for debugging/testing).
 */
export function getConversationState(): ConversationState {
  return { ...conversationState };
}

// -----------------------------------------------------------------------------
// FEATURE DETECTION
// -----------------------------------------------------------------------------

/**
 * Keywords that map to each feature for detection.
 */
const featureKeywords: Record<FeatureId, string[]> = {
  'invoicing': ['invoice', 'invoicing', 'bill', 'billing', 'get paid', 'send invoice', 'payment reminder'],
  'payments': ['payment', 'credit card', 'card payment', 'online payment', 'accept payment', 'pay online', 'card on file'],
  'automated-comms': ['automated', 'auto', 'text', 'sms', 'email', 'reminder', 'on my way', 'communication', 'message', 'notify'],
  'scheduling': ['schedule', 'scheduling', 'calendar', 'dispatch', 'book', 'appointment', 'job scheduling'],
  'estimates': ['estimate', 'quote', 'proposal', 'bid', 'pricing', 'price book'],
  'csr-ai': ['ai', 'voice', 'phone', 'call', 'answer calls', 'ai voice', 'virtual assistant', 'csr'],
  'reviews': ['review', 'rating', 'reputation', 'google review', 'feedback', 'testimonial'],
};

/**
 * Detect which feature the user is asking about based on keywords.
 */
function detectFeature(
  message: string,
  features: Feature[],
  activePro: ProAccount,
  getStageContext: (featureId: FeatureId, stage: AdoptionStage) => StageContext | undefined
): DetectedFeature | null {
  const lowerMessage = message.toLowerCase();

  for (const feature of features) {
    const keywords = featureKeywords[feature.id] || [];
    const hasKeyword = keywords.some(keyword => lowerMessage.includes(keyword));

    if (hasKeyword) {
      const stage = activePro.featureStatus[feature.id]?.stage || 'not_attached';
      const stageContext = getStageContext(feature.id, stage);
      return { feature, stage, stageContext };
    }
  }

  return null;
}

// -----------------------------------------------------------------------------
// HELP CONTENT GENERATION
// -----------------------------------------------------------------------------

/**
 * Help article references for each feature.
 */
const featureHelpArticles: Record<FeatureId, Array<{ title: string; url: string; type: 'article' | 'video' }>> = {
  'invoicing': [
    { title: 'Getting Started with Invoicing', url: 'https://help.housecallpro.com/invoicing-getting-started', type: 'article' },
    { title: 'Invoice Best Practices', url: 'https://www.youtube.com/watch?v=hcp-invoice-tips', type: 'video' },
  ],
  'payments': [
    { title: 'Payment Processing Setup', url: 'https://help.housecallpro.com/payments-setup', type: 'article' },
    { title: 'Getting Paid Faster Guide', url: 'https://www.youtube.com/watch?v=hcp-payments', type: 'video' },
  ],
  'automated-comms': [
    { title: 'Automated Messaging Guide', url: 'https://help.housecallpro.com/auto-messaging', type: 'article' },
    { title: 'Setting Up On-My-Way Texts', url: 'https://www.youtube.com/watch?v=hcp-omw', type: 'video' },
  ],
  'scheduling': [
    { title: 'Scheduling & Calendar Overview', url: 'https://help.housecallpro.com/scheduling-overview', type: 'article' },
    { title: 'Dispatch Board Tutorial', url: 'https://www.youtube.com/watch?v=hcp-dispatch', type: 'video' },
  ],
  'estimates': [
    { title: 'Creating Winning Estimates', url: 'https://help.housecallpro.com/estimates-guide', type: 'article' },
    { title: 'Good/Better/Best Pricing', url: 'https://www.youtube.com/watch?v=hcp-gbb', type: 'video' },
  ],
  'csr-ai': [
    { title: 'AI Voice Agent Setup', url: 'https://help.housecallpro.com/ai-voice-setup', type: 'article' },
    { title: 'Hear AI Voice in Action', url: 'https://www.youtube.com/watch?v=hcp-ai-demo', type: 'video' },
  ],
  'reviews': [
    { title: 'Building Your Online Reputation', url: 'https://help.housecallpro.com/reviews-guide', type: 'article' },
    { title: 'Getting More 5-Star Reviews', url: 'https://www.youtube.com/watch?v=hcp-reviews', type: 'video' },
  ],
};

/**
 * Generate help content section with article references.
 */
function generateHelpContent(featureId: FeatureId, stage: AdoptionStage): string {
  const articles = featureHelpArticles[featureId] || [];
  if (articles.length === 0) return '';

  const explanations: Record<FeatureId, string> = {
    'invoicing': 'With Housecall Pro invoicing, you can create professional invoices automatically when you complete a job. Invoices can be sent via email or text, and customers can pay online with one click.',
    'payments': 'Online payments let your customers pay invoices instantly with a credit card. The money is deposited directly to your bank account, usually within 1-2 business days.',
    'automated-comms': 'Automated communications send texts and emails to your customers at key moments - appointment confirmations, on-my-way notifications, follow-ups, and review requests.',
    'scheduling': 'The scheduling system gives you a visual calendar to manage all your jobs. You can drag and drop to reschedule, see your whole team\'s availability, and dispatch jobs to technicians.',
    'estimates': 'Create professional estimates with your pricing and send them to customers for approval. Customers can approve with one click, and approved estimates convert directly into jobs.',
    'csr-ai': 'The AI Voice Agent answers your business calls 24/7 when you can\'t. It sounds natural, can answer questions about your services, book appointments, and capture lead information.',
    'reviews': 'Automated review requests go out after every completed job, making it easy for happy customers to leave you 5-star reviews on Google.',
  };

  let content = explanations[featureId] + '\n\n';
  content += '**Learn more:**\n';
  articles.forEach(article => {
    const icon = article.type === 'video' ? '🎥' : '📖';
    content += `${icon} [${article.title}](${article.url})\n`;
  });

  return content;
}

// -----------------------------------------------------------------------------
// SAMPLE DATA GENERATION
// -----------------------------------------------------------------------------

/**
 * Sample data generators for each feature.
 */
const sampleDataGenerators: Record<FeatureId, () => {
  customer: Record<string, unknown>;
  job?: Record<string, unknown>;
  lineItems?: Array<Record<string, unknown>>;
}> = {
  'invoicing': () => ({
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      address: '456 Oak Street, Springfield, IL 62701',
    },
    job: {
      description: 'Annual HVAC maintenance and filter replacement',
      scheduledDate: 'Today',
      status: 'Completed',
    },
    lineItems: [
      { service: 'HVAC Tune-Up', quantity: 1, price: 149.00 },
      { service: 'Air Filter (MERV 13)', quantity: 2, price: 24.99 },
      { service: 'Coil Cleaning', quantity: 1, price: 89.00 },
    ],
  }),
  'payments': () => ({
    customer: {
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      phone: '(555) 123-7890',
    },
    job: {
      description: 'Emergency pipe repair',
      total: 425.00,
    },
  }),
  'automated-comms': () => ({
    customer: {
      name: 'Sarah Williams',
      phone: '(555) 456-7890',
      email: 'sarah.w@example.com',
    },
    job: {
      description: 'Kitchen faucet installation',
      scheduledDate: 'Tomorrow at 2:00 PM',
    },
  }),
  'scheduling': () => ({
    customer: {
      name: 'David Brown',
      phone: '(555) 234-5678',
      address: '789 Pine Ave, Springfield, IL 62702',
    },
    job: {
      description: 'Electrical panel inspection',
      scheduledDate: 'Next Monday at 9:00 AM',
      assignedTo: 'You',
    },
  }),
  'estimates': () => ({
    customer: {
      name: 'Lisa Chen',
      email: 'lisa.chen@example.com',
      phone: '(555) 345-6789',
      address: '321 Maple Dr, Springfield, IL 62703',
    },
    lineItems: [
      { service: 'Water Heater Replacement (50 gal)', quantity: 1, price: 1299.00 },
      { service: 'Installation Labor', quantity: 1, price: 450.00 },
      { service: 'Permit Fee', quantity: 1, price: 75.00 },
      { service: 'Old Unit Disposal', quantity: 1, price: 50.00 },
    ],
  }),
  'csr-ai': () => ({
    customer: {
      name: 'Incoming Caller',
      phone: '(555) 999-8888',
    },
    job: {
      description: 'Test call to hear AI greeting',
    },
  }),
  'reviews': () => ({
    customer: {
      name: 'Tom Anderson',
      email: 'tom.a@example.com',
      phone: '(555) 567-8901',
    },
    job: {
      description: 'Bathroom remodel - completed last week',
      status: 'Completed',
    },
  }),
};

/**
 * Format data as a markdown table preview.
 */
function formatDataPreview(data: Record<string, unknown>, title: string): string {
  let preview = `**${title}**\n\n`;
  preview += '| Field | Value |\n';
  preview += '|-------|-------|\n';

  for (const [key, value] of Object.entries(data)) {
    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    preview += `| ${formattedKey} | ${value} |\n`;
  }

  return preview;
}

/**
 * Format line items as a markdown table.
 */
function formatLineItemsPreview(lineItems: Array<Record<string, unknown>>): string {
  let preview = '**Line Items**\n\n';
  preview += '| Service | Qty | Price |\n';
  preview += '|---------|-----|-------|\n';

  let total = 0;
  for (const item of lineItems) {
    const qty = item.quantity as number;
    const price = item.price as number;
    const lineTotal = qty * price;
    total += lineTotal;
    preview += `| ${item.service} | ${qty} | $${price.toFixed(2)} |\n`;
  }

  preview += `| **Total** | | **$${total.toFixed(2)}** |\n`;

  return preview;
}

// -----------------------------------------------------------------------------
// STAGE-SPECIFIC FLOW HANDLERS
// -----------------------------------------------------------------------------

/**
 * Generate response for not_attached stage.
 */
function generateNotAttachedResponse(detected: DetectedFeature, proName: string): string {
  const { feature, stageContext } = detected;
  const chatExp = stageContext?.chatExperience;
  const helpContent = generateHelpContent(feature.id, 'not_attached');

  let response = `Great question about ${feature.name.toLowerCase()}! Let me explain how it works.\n\n`;
  response += helpContent;
  response += '\n---\n\n';

  // Value proposition
  const valueProps: Record<FeatureId, string> = {
    'invoicing': 'Pros using Housecall Pro invoicing get paid **2x faster** than those using paper invoices.',
    'payments': 'Accept credit cards instantly and see deposits in your account within **1-2 business days**.',
    'automated-comms': 'Save **5+ hours per week** on customer communication with automated texts and emails.',
    'scheduling': 'Never double-book again - see your entire team\'s schedule at a glance.',
    'estimates': 'Win more jobs with professional estimates customers can approve with **one click**.',
    'csr-ai': 'Capture leads **24/7** even when you\'re on a job or after hours.',
    'reviews': 'Build your reputation automatically - more reviews = more new customers.',
  };

  response += valueProps[feature.id] + '\n\n';
  response += `I notice ${feature.name.toLowerCase()} isn't enabled on your account yet. `;
  response += `I can schedule a call with our team to show you how it works and get you set up.\n\n`;
  response += `**Would you like to book a time?**\n\n`;
  response += `**[Schedule Demo](${stageContext?.calendlyTypes[0]?.url || 'https://calendly.com/hcp-sales'})**`;

  return response;
}

/**
 * Generate response for attached stage (offers sample/real choice).
 */
function generateAttachedResponse(detected: DetectedFeature, proName: string): string {
  const { feature, stageContext } = detected;
  const helpContent = generateHelpContent(feature.id, 'attached');

  let response = `I see you have ${feature.name.toLowerCase()} available, ${proName}! Let me help you get started.\n\n`;
  response += helpContent;
  response += '\n---\n\n';
  response += `You haven't sent your first ${feature.name.toLowerCase() === 'invoicing' ? 'invoice' : feature.name.toLowerCase()} yet. `;
  response += `Would you like to try this with **sample data** to see how it works, or use your **real information**?\n\n`;
  response += `Reply with:\n`;
  response += `- **"sample"** - I'll walk you through with example data\n`;
  response += `- **"real"** - We'll use your actual customer info\n`;

  // Update conversation state
  conversationState = {
    ...conversationState,
    flowState: 'awaiting_choice',
    currentFeature: feature.id,
    currentStage: 'attached',
  };

  return response;
}

/**
 * Generate response for activated stage.
 */
function generateActivatedResponse(detected: DetectedFeature, proName: string): string {
  const { feature, stageContext } = detected;
  const helpContent = generateHelpContent(feature.id, 'activated');

  let response = `You're all set up with ${feature.name.toLowerCase()}, ${proName}! Here's how to make the most of it.\n\n`;
  response += helpContent;
  response += '\n---\n\n';

  // Feature-specific action offers
  const actionOffers: Record<FeatureId, string> = {
    'invoicing': `What would you like to do?\n\n1. **Upload your logo** - Make invoices look more professional\n2. **Review your settings** - Check your invoice configuration\n3. **Send a test invoice** - See how it looks to customers\n\nJust let me know which option you'd like!`,
    'payments': `What would you like to do?\n\n1. **Enable tipping** - Boost your technicians' earnings\n2. **Test a payment** - See the customer experience\n3. **Save a card on file** - For repeat customers\n\nJust let me know which option!`,
    'automated-comms': `What would you like to do?\n\n1. **Configure review requests** - Get more 5-star reviews\n2. **Customize your messages** - Add a personal touch\n3. **Preview an on-my-way text** - See what customers receive\n\nJust let me know!`,
    'scheduling': `What would you like to do?\n\n1. **Enable online booking** - Let customers book 24/7\n2. **Create your first job** - Try the calendar\n3. **Set up dispatch** - If you have a team\n\nWhich interests you?`,
    'estimates': `What would you like to do?\n\n1. **Try Good/Better/Best pricing** - Increase average ticket\n2. **Create an estimate template** - Save time on quotes\n3. **Send a test estimate** - See the customer view\n\nLet me know your preference!`,
    'csr-ai': `What would you like to do?\n\n1. **Make a test call** - Hear your AI in action\n2. **Add the chat widget** - Capture website leads\n3. **Review your greeting** - Make sure it sounds right\n\nWhich would you like?`,
    'reviews': `What would you like to do?\n\n1. **Send a test review request** - See what customers get\n2. **Customize your message** - Add a personal touch\n3. **Respond to existing reviews** - Engage with customers\n\nJust tell me!`,
  };

  response += actionOffers[feature.id];

  // Update conversation state
  conversationState = {
    ...conversationState,
    flowState: 'awaiting_choice',
    currentFeature: feature.id,
    currentStage: 'activated',
  };

  return response;
}

/**
 * Generate response for engaged stage.
 */
function generateEngagedResponse(detected: DetectedFeature, proName: string): string {
  const { feature, stageContext } = detected;
  const chatExp = stageContext?.chatExperience;

  let response = `You're using ${feature.name.toLowerCase()} like a pro, ${proName}! `;

  // Advanced tips by feature
  const advancedTips: Record<FeatureId, string> = {
    'invoicing': `Here are some power-user tips:\n\n📊 **Invoice Templates** - Create templates for common job types to save time\n🔄 **Recurring Invoices** - Set up automatic billing for maintenance contracts\n📈 **Aging Reports** - Track overdue invoices and optimize collection\n\nI can help you create a new invoice right here through conversation. Just tell me about the job - who's the customer and what work was done?`,
    'payments': `Here are some advanced features:\n\n💳 **Financing Options** - Help customers afford larger jobs\n📱 **Tap to Pay** - Accept cards in the field with your phone\n📊 **Payment Analytics** - See your average payment times\n\nWould you like to explore financing options to increase your average ticket?`,
    'automated-comms': `Here's how to level up:\n\n📣 **Marketing Campaigns** - Reach past customers with targeted messages\n🎯 **Segmentation** - Send different messages to different customer types\n📊 **Message Analytics** - See open and response rates\n\nWant me to help you create a marketing campaign to past customers?`,
    'scheduling': `Advanced scheduling tips:\n\n🗺️ **Route Optimization** - Minimize drive time between jobs\n📍 **GPS Tracking** - See your team's location in real-time\n⏰ **Time Tracking** - Accurate records for every job\n\nWould you like to set up GPS tracking for your team?`,
    'estimates': `Power-user features:\n\n📝 **Estimate Templates** - Customize for different job types\n💰 **Financing** - Help customers afford larger projects\n📊 **Conversion Analytics** - Track your win rate\n\nWant me to help you create an estimate template for your most common job type?`,
    'csr-ai': `Optimization tips:\n\n🎓 **Custom Q&A Training** - Teach the AI about your specific services\n📊 **Call Analytics** - See what questions customers ask most\n🔧 **Escalation Rules** - Define when to route to a human\n\nWant to add some custom Q&A to improve your AI's responses?`,
    'reviews': `Build your reputation further:\n\n📱 **Social Sharing** - Amplify positive reviews on social media\n⭐ **Review Responses** - Professional templates for any review\n📊 **Reputation Dashboard** - Track your ratings over time\n\nWant me to help you create response templates for reviews?`,
  };

  response += advancedTips[feature.id];

  return response;
}

// -----------------------------------------------------------------------------
// CONFIRMATION FLOW HANDLERS
// -----------------------------------------------------------------------------

/**
 * Handle sample/real choice response.
 */
function handleChoiceResponse(message: string, context: MockContext): string {
  const lowerMessage = message.toLowerCase().trim();
  const { currentFeature } = conversationState;

  if (!currentFeature) {
    conversationState.flowState = 'initial';
    return "I'm not sure what we were discussing. What would you like help with?";
  }

  const proName = context.activePro.ownerName.split(' ')[0];

  // Check for sample/real choice
  if (lowerMessage.includes('sample') || lowerMessage === '1') {
    conversationState.dataChoice = 'sample';
    return generateSampleDataFlow(currentFeature, proName);
  }

  if (lowerMessage.includes('real') || lowerMessage === '2') {
    conversationState.dataChoice = 'real';
    return generateRealDataFlow(currentFeature, proName);
  }

  // Handle activated stage choices (numbered options)
  if (conversationState.currentStage === 'activated') {
    return handleActivatedChoice(lowerMessage, currentFeature, proName);
  }

  // If unclear, re-prompt
  return `I didn't catch that. Would you like to try with **sample data** or your **real information**?\n\nJust reply "sample" or "real".`;
}

/**
 * Handle activated stage option selection.
 */
function handleActivatedChoice(message: string, featureId: FeatureId, proName: string): string {
  // Map feature-specific options
  const optionResponses: Record<FeatureId, Record<string, string>> = {
    'invoicing': {
      'logo': generateLogoUploadFlow(proName),
      'upload': generateLogoUploadFlow(proName),
      '1': generateLogoUploadFlow(proName),
      'settings': generateSettingsReviewFlow(featureId, proName),
      'review': generateSettingsReviewFlow(featureId, proName),
      '2': generateSettingsReviewFlow(featureId, proName),
      'test': generateTestActionFlow(featureId, proName),
      '3': generateTestActionFlow(featureId, proName),
    },
    'payments': {
      'tip': generateTippingSetupFlow(proName),
      '1': generateTippingSetupFlow(proName),
      'test': generateTestActionFlow(featureId, proName),
      '2': generateTestActionFlow(featureId, proName),
      'card': generateCardOnFileFlow(proName),
      '3': generateCardOnFileFlow(proName),
    },
    'automated-comms': {
      'review': generateReviewRequestSetupFlow(proName),
      '1': generateReviewRequestSetupFlow(proName),
      'customize': generateCustomizeMessagesFlow(proName),
      '2': generateCustomizeMessagesFlow(proName),
      'preview': generateTestActionFlow(featureId, proName),
      '3': generateTestActionFlow(featureId, proName),
    },
    'scheduling': {
      'online': generateOnlineBookingFlow(proName),
      'booking': generateOnlineBookingFlow(proName),
      '1': generateOnlineBookingFlow(proName),
      'create': generateSampleDataFlow(featureId, proName),
      'job': generateSampleDataFlow(featureId, proName),
      '2': generateSampleDataFlow(featureId, proName),
      'dispatch': generateDispatchSetupFlow(proName),
      '3': generateDispatchSetupFlow(proName),
    },
    'estimates': {
      'good': generateGBBPricingFlow(proName),
      'better': generateGBBPricingFlow(proName),
      'best': generateGBBPricingFlow(proName),
      '1': generateGBBPricingFlow(proName),
      'template': generateTemplateCreationFlow(featureId, proName),
      '2': generateTemplateCreationFlow(featureId, proName),
      'test': generateTestActionFlow(featureId, proName),
      '3': generateTestActionFlow(featureId, proName),
    },
    'csr-ai': {
      'test': generateTestCallFlow(proName),
      'call': generateTestCallFlow(proName),
      '1': generateTestCallFlow(proName),
      'chat': generateChatWidgetFlow(proName),
      'widget': generateChatWidgetFlow(proName),
      '2': generateChatWidgetFlow(proName),
      'greeting': generateGreetingReviewFlow(proName),
      '3': generateGreetingReviewFlow(proName),
    },
    'reviews': {
      'test': generateTestActionFlow(featureId, proName),
      'send': generateTestActionFlow(featureId, proName),
      '1': generateTestActionFlow(featureId, proName),
      'customize': generateCustomizeMessagesFlow(proName),
      'message': generateCustomizeMessagesFlow(proName),
      '2': generateCustomizeMessagesFlow(proName),
      'respond': generateReviewResponseFlow(proName),
      '3': generateReviewResponseFlow(proName),
    },
  };

  const featureOptions = optionResponses[featureId];
  for (const [keyword, response] of Object.entries(featureOptions)) {
    if (message.includes(keyword)) {
      return response;
    }
  }

  return `I didn't catch which option you wanted. Please reply with a number (1, 2, or 3) or describe what you'd like to do.`;
}

/**
 * Generate sample data flow for a feature.
 */
function generateSampleDataFlow(featureId: FeatureId, proName: string): string {
  const generator = sampleDataGenerators[featureId];
  if (!generator) {
    return `Let me help you try ${featureId} with sample data. Go to the ${featureId} page to get started.`;
  }

  const sampleData = generator();
  let response = `Great choice, ${proName}! Let me create some sample data for you to try.\n\n`;

  response += formatDataPreview(sampleData.customer as Record<string, unknown>, 'Sample Customer');

  if (sampleData.job) {
    response += '\n' + formatDataPreview(sampleData.job as Record<string, unknown>, 'Sample Job');
  }

  if (sampleData.lineItems) {
    response += '\n' + formatLineItemsPreview(sampleData.lineItems);
  }

  response += '\n---\n\n';
  response += `**Does this look good?** Reply "yes" to create this sample data, or "no" to customize it.`;

  // Update state for confirmation
  conversationState = {
    ...conversationState,
    flowState: 'awaiting_confirmation',
    pendingAction: {
      toolName: `create_sample_${featureId}`,
      preview: sampleData,
      type: 'sample',
    },
  };

  return response;
}

/**
 * Generate real data collection flow.
 */
function generateRealDataFlow(featureId: FeatureId, proName: string): string {
  let response = `Let's use your real customer information, ${proName}.\n\n`;

  const prompts: Record<FeatureId, string> = {
    'invoicing': `What's your customer's name? Or if you have an estimate or job note, you can describe it and I'll extract the details.\n\n💡 **Tip:** You can also take a photo of any existing paperwork and I'll pull out the information.`,
    'payments': `Which customer would you like to collect a payment from? You can give me their name or describe the job.`,
    'automated-comms': `What's your customer's name and phone number? I'll show you how the automated messages will look.`,
    'scheduling': `Tell me about the job - who's the customer, what work needs to be done, and when would you like to schedule it?`,
    'estimates': `Who's the estimate for? Tell me the customer's name and describe the work, and I'll help you put together a professional quote.`,
    'csr-ai': `Let's test your AI! The best way is to call your business number from another phone. Ready to try?`,
    'reviews': `Which customer would you like to request a review from? They should be someone who recently had a job completed.`,
  };

  response += prompts[featureId];

  conversationState = {
    ...conversationState,
    flowState: 'awaiting_input',
    awaitingField: 'customer_info',
    collectedData: {},
  };

  return response;
}

/**
 * Handle confirmation response (yes/no).
 */
function handleConfirmationResponse(message: string, context: MockContext): string {
  const lowerMessage = message.toLowerCase().trim();
  const { pendingAction, currentFeature } = conversationState;
  const proName = context.activePro.ownerName.split(' ')[0];

  if (!pendingAction || !currentFeature) {
    conversationState.flowState = 'initial';
    return "I'm not sure what we're confirming. What would you like help with?";
  }

  if (lowerMessage === 'yes' || lowerMessage === 'y' || lowerMessage === 'confirm') {
    return executeAction(pendingAction, currentFeature, proName);
  }

  if (lowerMessage === 'no' || lowerMessage === 'n' || lowerMessage === 'cancel') {
    conversationState.flowState = 'initial';
    conversationState.pendingAction = undefined;
    return `No problem! Let me know when you're ready to try again, or if you'd like to do something else.`;
  }

  return `I didn't catch that. Reply "yes" to proceed or "no" to cancel.`;
}

/**
 * Execute the pending action and show result.
 */
function executeAction(
  action: { toolName: string; preview: Record<string, unknown>; type: 'sample' | 'real' },
  featureId: FeatureId,
  proName: string
): string {
  // Simulate action execution
  const newId = `SAMPLE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  conversationState.createdItems.push({
    type: action.toolName,
    id: newId,
    data: action.preview,
  });

  let response = `✅ **Done!** I've created the sample data for you.\n\n`;

  // Feature-specific success messages
  const successMessages: Record<FeatureId, string> = {
    'invoicing': `**Sample Invoice Created** (ID: ${newId})\n\nYou can view it in your [Invoices](/invoices) page. From there you can:\n- Send it to the customer\n- Mark it as paid\n- See how payment reminders work`,
    'payments': `**Sample Payment Ready** (ID: ${newId})\n\nThe customer can now pay online! Check your [Payments Dashboard](/payments) to see incoming payments.`,
    'automated-comms': `**Sample Messages Configured** (ID: ${newId})\n\nAutomatic messages are now set up. Check [Communications](/communications) to see the message templates.`,
    'scheduling': `**Sample Job Scheduled** (ID: ${newId})\n\nYou can see it on your [Calendar](/calendar). Try dragging it to reschedule!`,
    'estimates': `**Sample Estimate Created** (ID: ${newId})\n\nView it in [Estimates](/estimates). You can send it and see how one-click approval works.`,
    'csr-ai': `**AI Configured** (ID: ${newId})\n\nYour AI is ready to answer calls. Try calling your business number to test it!`,
    'reviews': `**Review Request Ready** (ID: ${newId})\n\nCheck [Reviews](/reviews) to see pending review requests and manage your reputation.`,
  };

  response += successMessages[featureId];
  response += '\n\n---\n\n';
  response += generateNextSteps(featureId, proName);

  // Reset flow state
  conversationState.flowState = 'initial';
  conversationState.pendingAction = undefined;

  return response;
}

/**
 * Generate next step suggestions after completing an action.
 */
function generateNextSteps(featureId: FeatureId, proName: string): string {
  const nextSteps: Record<FeatureId, string[]> = {
    'invoicing': [
      '📤 **Send the invoice** to see the customer experience',
      '🎨 **Upload your logo** to brand your invoices',
      '⏰ **Set up payment reminders** to get paid faster',
    ],
    'payments': [
      '💵 **Enable tipping** to boost technician earnings',
      '💳 **Save card on file** for repeat customers',
      '📊 **View payment reports** to track your earnings',
    ],
    'automated-comms': [
      '⭐ **Enable review requests** after completed jobs',
      '✏️ **Customize your templates** for a personal touch',
      '📈 **View message analytics** to see engagement',
    ],
    'scheduling': [
      '🌐 **Enable online booking** for 24/7 appointments',
      '👥 **Add team members** to use dispatching',
      '📍 **Set up GPS tracking** for your team',
    ],
    'estimates': [
      '📝 **Create a template** for common job types',
      '💰 **Try Good/Better/Best** pricing to upsell',
      '💳 **Add financing** for larger projects',
    ],
    'csr-ai': [
      '🌐 **Add chat widget** to your website',
      '🎓 **Train custom Q&A** for better answers',
      '📞 **Review call transcripts** to improve',
    ],
    'reviews': [
      '📱 **Share reviews** on social media',
      '💬 **Respond to reviews** to show you care',
      '📊 **Track your rating** over time',
    ],
  };

  const steps = nextSteps[featureId] || [];
  let response = `**What's next, ${proName}?**\n\n`;
  steps.forEach(step => {
    response += step + '\n';
  });
  response += '\nJust tell me what you\'d like to do!';

  return response;
}

// -----------------------------------------------------------------------------
// ACTIVATED STAGE ACTION FLOWS
// -----------------------------------------------------------------------------

function generateLogoUploadFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `Great idea, ${proName}! A logo makes your invoices look more professional.\n\n` +
    `**To upload your logo:**\n` +
    `1. Go to [Branding Settings](/settings/branding)\n` +
    `2. Click "Upload Logo"\n` +
    `3. Select your logo file (PNG or JPG, at least 200x200px)\n\n` +
    `Your logo will appear on all invoices, estimates, and customer-facing communications.\n\n` +
    `**[Go to Branding Settings](/settings/branding)**`;
}

function generateSettingsReviewFlow(featureId: FeatureId, proName: string): string {
  const settingsUrls: Record<FeatureId, string> = {
    'invoicing': '/settings/invoicing',
    'payments': '/settings/payments',
    'automated-comms': '/settings/communications',
    'scheduling': '/settings/scheduling',
    'estimates': '/settings/estimates',
    'csr-ai': '/settings/ai-voice',
    'reviews': '/settings/reviews',
  };

  conversationState.flowState = 'initial';
  return `Let me show you your current settings, ${proName}.\n\n` +
    `**Current Configuration:**\n` +
    `- Payment terms: Net 30\n` +
    `- Automatic reminders: Enabled (3, 7, 14 days)\n` +
    `- Default message: "Thank you for your business!"\n\n` +
    `You can adjust these anytime in your settings.\n\n` +
    `**[Review Settings](${settingsUrls[featureId]})**`;
}

function generateTestActionFlow(featureId: FeatureId, proName: string): string {
  conversationState.flowState = 'initial';
  const testActions: Record<FeatureId, string> = {
    'invoicing': `I'll send a test invoice to your email so you can see exactly what customers receive.\n\n` +
      `**Test Invoice Details:**\n` +
      `- To: Your email\n` +
      `- Amount: $150.00 (sample)\n` +
      `- Service: HVAC Maintenance\n\n` +
      `Ready to send? Reply "send test" and I'll deliver it right away!`,
    'payments': `I'll create a test payment link so you can see the customer payment experience.\n\n` +
      `This won't charge any card - it's just a preview.\n\n` +
      `Reply "send test" to receive the payment link!`,
    'automated-comms': `Here's a preview of what your customer would receive:\n\n` +
      `---\n` +
      `📱 **On-My-Way Text**\n` +
      `"Hi! This is ${proName}'s company. We're on our way and will arrive in approximately 15 minutes. See you soon!"\n` +
      `---\n\n` +
      `Want to customize this message? Just let me know what you'd like to change.`,
    'scheduling': `I'll create a test job on your calendar for tomorrow.\n\n` +
      `You can practice:\n` +
      `- Dragging to reschedule\n` +
      `- Adding notes\n` +
      `- Dispatching to team members\n\n` +
      `Reply "create test job" to add it to your calendar!`,
    'estimates': `I'll send a test estimate to your email so you can see the one-click approval experience.\n\n` +
      `**Test Estimate:**\n` +
      `- Service: Water Heater Installation\n` +
      `- Good: $1,500 | Better: $1,800 | Best: $2,200\n\n` +
      `Reply "send test" to receive it!`,
    'csr-ai': `Call your business number from another phone to hear your AI in action!\n\n` +
      `📞 **Your Business Number:** Check your AI Voice settings\n\n` +
      `The AI will answer, introduce your company, and can book test appointments.`,
    'reviews': `I'll send a test review request to your email so you can see what customers receive.\n\n` +
      `**Preview:**\n` +
      `"Thanks for choosing [Company]! We'd love to hear about your experience. Would you take a moment to leave us a review?"\n\n` +
      `Reply "send test" to receive it!`,
  };
  return testActions[featureId];
}

function generateTippingSetupFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `Tipping is a great way to boost your team's earnings, ${proName}!\n\n` +
    `**How it works:**\n` +
    `- Customers see tip options when paying online\n` +
    `- Suggested amounts: 15%, 20%, 25%, or custom\n` +
    `- Tips go directly to the assigned technician\n\n` +
    `**To enable tipping:**\n` +
    `1. Go to [Payment Settings](/settings/payments)\n` +
    `2. Toggle on "Enable Tipping"\n` +
    `3. Choose your suggested tip amounts\n\n` +
    `**[Enable Tipping Now](/settings/payments)**`;
}

function generateCardOnFileFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `Card on file makes checkout faster for repeat customers, ${proName}!\n\n` +
    `**Benefits:**\n` +
    `- Faster checkout for return visits\n` +
    `- Automatic billing for maintenance plans\n` +
    `- Reduced no-shows (card required to book)\n\n` +
    `Cards are stored securely and customers can manage them anytime.\n\n` +
    `**[Set Up Card on File](/settings/payments#card-on-file)**`;
}

function generateReviewRequestSetupFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `Review requests help build your online reputation automatically, ${proName}!\n\n` +
    `**When enabled:**\n` +
    `- Requests go out 2 hours after job completion\n` +
    `- Customers get a direct link to leave a Google review\n` +
    `- You can customize the timing and message\n\n` +
    `**[Enable Review Requests](/settings/communications/reviews)**`;
}

function generateCustomizeMessagesFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `Let's personalize your messages, ${proName}!\n\n` +
    `**Available Templates:**\n` +
    `- Appointment confirmation\n` +
    `- On-my-way notification\n` +
    `- Job completion\n` +
    `- Review request\n` +
    `- Follow-up\n\n` +
    `You can use variables like {customer_name}, {appointment_time}, and {technician_name}.\n\n` +
    `**[Customize Templates](/settings/communications/templates)**`;
}

function generateOnlineBookingFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `Online booking lets customers book appointments 24/7, ${proName}!\n\n` +
    `**Features:**\n` +
    `- Embed on your website or share a direct link\n` +
    `- Customers see your real-time availability\n` +
    `- Automatic confirmation texts\n` +
    `- Reduces phone calls and back-and-forth\n\n` +
    `**[Set Up Online Booking](/settings/online-booking)**`;
}

function generateDispatchSetupFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `The dispatch board helps you manage your team efficiently, ${proName}!\n\n` +
    `**With dispatch you can:**\n` +
    `- Drag and drop jobs to assign technicians\n` +
    `- See everyone's schedule at a glance\n` +
    `- Send jobs with one click\n` +
    `- Track who's where in real-time\n\n` +
    `First, make sure you've added your team members.\n\n` +
    `**[Add Team Members](/settings/team)** | **[Open Dispatch Board](/dispatch)**`;
}

function generateGBBPricingFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `Good/Better/Best pricing can increase your average ticket by 20-30%, ${proName}!\n\n` +
    `**How it works:**\n` +
    `- Offer 3 options at different price points\n` +
    `- Customers often choose the middle option\n` +
    `- More choices = higher customer satisfaction\n\n` +
    `**Example:**\n` +
    `| Option | Service | Price |\n` +
    `|--------|---------|-------|\n` +
    `| Good | Basic repair | $150 |\n` +
    `| Better | Repair + tune-up | $225 |\n` +
    `| Best | Repair + tune-up + warranty | $350 |\n\n` +
    `**[Create GBB Estimate](/estimates/new)**`;
}

function generateTemplateCreationFlow(featureId: FeatureId, proName: string): string {
  conversationState.flowState = 'initial';
  return `Templates save tons of time, ${proName}!\n\n` +
    `**Create a template for:**\n` +
    `- Your most common service\n` +
    `- A job type you do weekly\n` +
    `- A maintenance package\n\n` +
    `Once saved, you can create new ${featureId === 'estimates' ? 'estimates' : 'invoices'} in seconds.\n\n` +
    `**[Create Template](/settings/templates/${featureId})**`;
}

function generateTestCallFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `Let's test your AI, ${proName}! Here's how:\n\n` +
    `**Step 1:** Call your business number from your personal phone\n` +
    `**Step 2:** The AI will answer with your custom greeting\n` +
    `**Step 3:** Try asking about your services or booking an appointment\n\n` +
    `📞 **Your AI Phone Number:** Check [AI Voice Settings](/settings/ai-voice)\n\n` +
    `After the call, you can review the transcript in your call history.`;
}

function generateChatWidgetFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `The chat widget captures leads directly from your website, ${proName}!\n\n` +
    `**Features:**\n` +
    `- AI answers questions 24/7\n` +
    `- Captures contact info\n` +
    `- Books appointments\n` +
    `- Matches your brand colors\n\n` +
    `**To add it:**\n` +
    `1. Go to [Chat Widget Settings](/settings/ai-voice/chat-widget)\n` +
    `2. Copy the embed code\n` +
    `3. Paste it in your website's HTML\n\n` +
    `**[Get Chat Widget Code](/settings/ai-voice/chat-widget)**`;
}

function generateGreetingReviewFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `Let's review your AI greeting, ${proName}!\n\n` +
    `**Current Greeting:**\n` +
    `"Thank you for calling [Company Name]! I'm an AI assistant and I can help you schedule service, answer questions, or get you connected with our team. How can I help you today?"\n\n` +
    `**Tips for a great greeting:**\n` +
    `- Keep it under 15 seconds\n` +
    `- Mention your company name\n` +
    `- List 2-3 things the AI can do\n` +
    `- Sound friendly and professional\n\n` +
    `**[Edit Greeting](/settings/ai-voice/greeting)**`;
}

function generateReviewResponseFlow(proName: string): string {
  conversationState.flowState = 'initial';
  return `Responding to reviews shows you care about feedback, ${proName}!\n\n` +
    `**Templates ready to use:**\n\n` +
    `⭐⭐⭐⭐⭐ **5-Star Response:**\n` +
    `"Thank you so much! We loved working with you and appreciate you taking the time to share your experience."\n\n` +
    `⭐⭐⭐ **Mixed Response:**\n` +
    `"Thank you for your feedback. We're always looking to improve and would love to hear more about your experience. Please reach out directly..."\n\n` +
    `**[View All Reviews](/reviews)**`;
}

// -----------------------------------------------------------------------------
// INPUT HANDLING FOR REAL DATA
// -----------------------------------------------------------------------------

/**
 * Handle user input for real data collection.
 */
function handleInputResponse(message: string, context: MockContext): string {
  const { currentFeature, awaitingField, collectedData } = conversationState;
  const proName = context.activePro.ownerName.split(' ')[0];

  if (!currentFeature) {
    conversationState.flowState = 'initial';
    return "I'm not sure what information we were collecting. What would you like help with?";
  }

  // Simple name extraction for demo purposes
  if (awaitingField === 'customer_info') {
    const customerName = message.trim();

    conversationState.collectedData = {
      ...collectedData,
      customerName,
    };

    let response = `Got it! Creating ${currentFeature} for **${customerName}**.\n\n`;

    // Generate preview with the provided name
    const generator = sampleDataGenerators[currentFeature];
    if (generator) {
      const baseData = generator();
      const customData = {
        ...baseData,
        customer: {
          ...(baseData.customer as Record<string, unknown>),
          name: customerName,
        },
      };

      response += formatDataPreview(customData.customer as Record<string, unknown>, 'Customer');

      if (customData.job) {
        response += '\n' + formatDataPreview(customData.job as Record<string, unknown>, 'Job');
      }

      if (customData.lineItems) {
        response += '\n' + formatLineItemsPreview(customData.lineItems);
      }

      response += '\n---\n\n';
      response += `**Does this look good?** Reply "yes" to create, or tell me what to change.`;

      conversationState.flowState = 'awaiting_confirmation';
      conversationState.pendingAction = {
        toolName: `create_${currentFeature}`,
        preview: customData,
        type: 'real',
      };
    }

    return response;
  }

  return `I received: "${message}". Let me process that for you...`;
}

// -----------------------------------------------------------------------------
// RESPONSE GENERATION
// -----------------------------------------------------------------------------

/**
 * Generate a feature-aware response using chatExperience data and conversation state.
 */
function generateFeatureResponse(detected: DetectedFeature, message: string, context: MockContext): string {
  const { feature, stage } = detected;
  const proName = context.activePro.ownerName.split(' ')[0];

  // Update current feature context
  conversationState.currentFeature = feature.id;
  conversationState.currentStage = stage;

  // Generate stage-specific response
  switch (stage) {
    case 'not_attached':
      return generateNotAttachedResponse(detected, proName);
    case 'attached':
      return generateAttachedResponse(detected, proName);
    case 'activated':
      return generateActivatedResponse(detected, proName);
    case 'engaged':
      return generateEngagedResponse(detected, proName);
    default:
      return generateGenericFeatureResponse(feature, stage);
  }
}

/**
 * Fallback response when no chatExperience is configured.
 */
function generateGenericFeatureResponse(feature: Feature, stage: AdoptionStage): string {
  const stageResponses: Record<AdoptionStage, string> = {
    'not_attached': `Great question about ${feature.name}! This feature isn't currently included in your plan, but I'd be happy to explain how it could help your business. Would you like to learn more or talk to our team about adding it?`,
    'attached': `I see you have ${feature.name} available! It looks like you're still getting set up. Would you like me to walk you through the setup process?`,
    'activated': `You're all set up with ${feature.name}! Ready to start using it? I can help you with any questions about how it works.`,
    'engaged': `Great to see you're actively using ${feature.name}! Is there anything specific you'd like to optimize or any questions I can help with?`,
  };

  return stageResponses[stage];
}

/**
 * Generate a general response for non-feature-specific questions.
 */
function generateGeneralResponse(message: string, activePro: ProAccount): string {
  const lowerMessage = message.toLowerCase();
  const proName = activePro.ownerName.split(' ')[0];

  // Greeting responses
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
    return `Hi ${proName}! I'm your Housecall Pro assistant. I can help you with invoicing, payments, scheduling, estimates, automated messages, reviews, and our AI Voice Agent.\n\nWhat would you like to explore today?`;
  }

  // Help/what can you do responses
  if (lowerMessage.match(/(help|what can you|how do i|where do i)/)) {
    return `I'm here to help you succeed with Housecall Pro, ${proName}! I can:\n\n` +
      `📄 **Invoicing** - Create and send professional invoices\n` +
      `💳 **Payments** - Accept credit cards and get paid faster\n` +
      `📅 **Scheduling** - Manage your calendar and dispatch\n` +
      `📝 **Estimates** - Create winning quotes with one-click approval\n` +
      `📱 **Auto Messages** - Set up texts and email reminders\n` +
      `⭐ **Reviews** - Build your online reputation\n` +
      `🤖 **AI Voice** - Answer calls 24/7\n\n` +
      `Just ask about any of these and I'll guide you step by step!`;
  }

  // Thank you responses
  if (lowerMessage.match(/(thank|thanks|appreciate)/)) {
    return `You're welcome, ${proName}! Let me know if there's anything else I can help with. I'm here to help you grow your business.`;
  }

  // Default response
  return `I'd be happy to help with that, ${proName}! Could you tell me a bit more about what you're trying to do?\n\nI can help with invoicing, payments, scheduling, estimates, automated messages, reviews, and our AI Voice Agent.`;
}

// -----------------------------------------------------------------------------
// MAIN EXPORT
// -----------------------------------------------------------------------------

/**
 * Generate a mock AI response based on the user's message and pro context.
 * This simulates the AI behavior without requiring an API key.
 * Supports multi-turn conversational flows with sample/real data options.
 */
export async function generateMockResponse(
  message: string,
  context: MockContext
): Promise<string> {
  const { activePro, features, getStageContext } = context;

  // Simulate a brief delay to feel more natural
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

  // Check conversation state for pending flows
  if (conversationState.flowState === 'awaiting_confirmation') {
    return handleConfirmationResponse(message, context);
  }

  if (conversationState.flowState === 'awaiting_choice') {
    return handleChoiceResponse(message, context);
  }

  if (conversationState.flowState === 'awaiting_input') {
    return handleInputResponse(message, context);
  }

  // Try to detect a feature mention
  const detectedFeature = detectFeature(message, features, activePro, getStageContext);

  if (detectedFeature) {
    return generateFeatureResponse(detectedFeature, message, context);
  }

  // Fall back to general response
  return generateGeneralResponse(message, activePro);
}
