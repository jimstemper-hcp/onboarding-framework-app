// =============================================================================
// MOCK AI SERVICE
// =============================================================================
// Provides simulated AI responses for demo purposes when no API key is available.
// Uses stage prompts to generate feature-aware, stage-appropriate responses.
// Supports multi-turn conversational flows with sample/real data options.
// =============================================================================

import type { Feature, ProAccount, FeatureId, AdoptionStage, StageContext } from '../../types';
import type { FileAttachment, DebugConversationState, DebugFeatureInfo, DebugToolCall } from '../types';

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
 * Extracted invoice data from image analysis.
 */
export interface ExtractedInvoiceData {
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  lineItems: Array<{
    service: string;
    description?: string;
    quantity: number;
    unitPrice: number;
  }>;
  total: number;
}

/**
 * Conversation state for multi-turn flows.
 */
export interface ConversationState {
  currentFeature?: FeatureId;
  currentStage?: AdoptionStage;
  flowState: 'initial' | 'awaiting_choice' | 'awaiting_confirmation' | 'awaiting_input' | 'awaiting_invoice_confirmation';
  pendingAction?: {
    toolName: string;
    preview: Record<string, unknown>;
    type: 'sample' | 'real';
  };
  createdItems: Array<{ type: string; id: string; data: Record<string, unknown> }>;
  dataChoice?: 'sample' | 'real';
  awaitingField?: string;
  collectedData?: Record<string, unknown>;
  extractedInvoice?: ExtractedInvoiceData;
}

// Global conversation state (persisted across calls within session)
let conversationState: ConversationState = {
  flowState: 'initial',
  createdItems: [],
};

/**
 * Result from mock response generation including debug context.
 */
export interface MockResponseResult {
  content: string;
  debugContext: {
    conversationState: DebugConversationState;
    detectedFeature?: DebugFeatureInfo;
    toolCalls?: DebugToolCall[];
  };
}

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
 * Generate help content section using stageContext data.
 * Now pulls from the admin-editable feature definitions instead of hardcoded data.
 */
function generateHelpContent(stageContext: StageContext | undefined, _featureName: string): string {
  if (!stageContext) return '';

  // Get explanation from contextSnippets (value proposition or setup overview)
  const valueSnippet = stageContext.contextSnippets?.find(s =>
    s.id === 'value-prop' || s.id === 'setup-overview' || s.id === 'optimization-overview' || s.id === 'power-user'
  );

  // Get navigation items for help articles and videos
  const helpItems = stageContext.navigation?.filter(nav =>
    nav.navigationType === 'hcp_help' || nav.navigationType === 'hcp_video'
  ) || [];

  let content = '';

  if (valueSnippet) {
    content += valueSnippet.content + '\n\n';
  }

  if (helpItems.length > 0) {
    content += '**Learn more:**\n';
    helpItems.forEach(item => {
      const icon = item.navigationType === 'hcp_video' ? '🎥' : '📖';
      content += `${icon} [${item.name}](${item.url})\n`;
    });
  }

  return content;
}

/**
 * Get value proposition from stageContext.
 */
function getValueProp(stageContext: StageContext | undefined): string | undefined {
  if (!stageContext?.contextSnippets) return undefined;

  // Look for value prop or key statistic
  const valueProp = stageContext.contextSnippets.find(s =>
    s.id === 'value-prop' || s.id === 'stat-highlight'
  );

  return valueProp?.content;
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

// -----------------------------------------------------------------------------
// INVOICE EXTRACTION SIMULATION
// -----------------------------------------------------------------------------

/**
 * Sample invoices for demo extraction.
 * These represent realistic extracted data from different invoice types.
 */
const sampleExtractedInvoices: ExtractedInvoiceData[] = [
  // Sample 1: Home services invoice (matches user's provided sample)
  {
    customer: {
      firstName: 'Contact',
      lastName: 'Us',
      email: 'jim.stemper@housecallpro.com',
      phone: '(414) 899-0758',
      address: {
        street: '2330 N 90th St',
        city: 'Wauwatosa',
        state: 'WI',
        zip: '53226',
      },
    },
    lineItems: [
      {
        service: 'Home services',
        description: 'This is a description for home services. Square footage: 501 - 1000, Bathrooms: 0',
        quantity: 1,
        unitPrice: 200.00,
      },
    ],
    total: 200.00,
  },
  // Sample 2: HVAC service invoice
  {
    customer: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(555) 234-5678',
      address: {
        street: '456 Oak Avenue',
        city: 'Springfield',
        state: 'IL',
        zip: '62701',
      },
    },
    lineItems: [
      {
        service: 'HVAC Tune-Up',
        description: 'Annual maintenance service - checked refrigerant levels, cleaned coils',
        quantity: 1,
        unitPrice: 149.00,
      },
      {
        service: 'Air Filter Replacement',
        description: 'MERV 13 high-efficiency filter',
        quantity: 2,
        unitPrice: 24.99,
      },
    ],
    total: 198.98,
  },
  // Sample 3: Plumbing service invoice
  {
    customer: {
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'mchen@example.com',
      phone: '(555) 876-5432',
      address: {
        street: '789 Pine Street',
        city: 'Lakewood',
        state: 'CO',
        zip: '80226',
      },
    },
    lineItems: [
      {
        service: 'Drain Cleaning',
        description: 'Kitchen sink main drain - snaked and cleared blockage',
        quantity: 1,
        unitPrice: 125.00,
      },
      {
        service: 'Faucet Repair',
        description: 'Replaced washers and cartridge in bathroom faucet',
        quantity: 1,
        unitPrice: 85.00,
      },
      {
        service: 'Service Call',
        description: 'Standard service call fee',
        quantity: 1,
        unitPrice: 49.00,
      },
    ],
    total: 259.00,
  },
];

/**
 * Simulated invoice extraction from image.
 * In reality, this would use the vision API to analyze the image.
 * For demo purposes, we return a realistic sample that demonstrates the capability.
 */
function simulateInvoiceExtraction(): ExtractedInvoiceData {
  // For demo, use the first sample (matches user's provided invoice format)
  // In production with real API, this would analyze the actual image
  return sampleExtractedInvoices[0];
}

/**
 * Format extracted invoice data as markdown preview.
 */
function formatExtractedInvoicePreview(data: ExtractedInvoiceData): string {
  let preview = '## Extracted Invoice Details\n\n';
  preview += '*(Using `extract_invoice_from_image` tool)*\n\n';

  // Customer info
  preview += '### Customer Information\n\n';
  preview += `| Field | Value |\n`;
  preview += `|-------|-------|\n`;
  preview += `| Name | ${data.customer.firstName} ${data.customer.lastName} |\n`;
  if (data.customer.email) {
    preview += `| Email | ${data.customer.email} |\n`;
  }
  if (data.customer.phone) {
    preview += `| Phone | ${data.customer.phone} |\n`;
  }
  if (data.customer.address) {
    const addr = data.customer.address;
    preview += `| Address | ${addr.street} |\n`;
    preview += `| City/State/Zip | ${addr.city}, ${addr.state} ${addr.zip} |\n`;
  }

  // Line items with descriptions
  preview += '\n### Service Details\n\n';
  preview += '| Service | Description | Qty | Price |\n';
  preview += '|---------|-------------|-----|-------|\n';

  for (const item of data.lineItems) {
    const desc = item.description ? item.description.substring(0, 50) + (item.description.length > 50 ? '...' : '') : '-';
    preview += `| ${item.service} | ${desc} | ${item.quantity} | $${item.unitPrice.toFixed(2)} |\n`;
  }

  // Totals
  preview += '\n### Totals\n\n';
  preview += `| | Amount |\n`;
  preview += `|------|--------|\n`;

  const subtotal = data.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  preview += `| Subtotal | $${subtotal.toFixed(2)} |\n`;
  preview += `| **Total** | **$${data.total.toFixed(2)}** |\n`;

  return preview;
}

/**
 * Handle invoice image upload - explains limitations in mock mode and offers choices.
 * In mock mode (no API key), we can't actually analyze the image, so we:
 * 1. Acknowledge the upload
 * 2. Explain that real analysis requires an API key
 * 3. Offer: "demo" to see the workflow with sample data, or "api key" for setup instructions
 */
function handleInvoiceImageUpload(_proName: string): string {
  // Update conversation state to await the demo/api-key choice
  conversationState = {
    ...conversationState,
    flowState: 'awaiting_choice',
    currentFeature: 'invoicing',
    dataChoice: undefined, // Will be set based on user's choice
  };

  let response = `I received your invoice image.\n\n`;
  response += `**Note:** Real image analysis requires an API key to use Claude's vision capabilities. `;
  response += `Without an API key, I can't extract the actual data from your image.\n\n`;
  response += `---\n\n`;
  response += `**What would you like to do?**\n\n`;
  response += `- **"demo"** - See how the invoice extraction workflow works using sample data\n`;
  response += `- **"api key"** - Learn how to add an API key to enable real image analysis\n`;

  return response;
}

/**
 * Handle the demo flow for invoice image upload.
 * Shows the extraction workflow with sample data and clear "simulated" messaging.
 */
function handleInvoiceImageDemoFlow(proName: string): string {
  // Get sample data
  const extractedData = simulateInvoiceExtraction();

  // Store in conversation state for confirmation
  conversationState = {
    ...conversationState,
    flowState: 'awaiting_invoice_confirmation',
    currentFeature: 'invoicing',
    extractedInvoice: extractedData,
  };

  let response = `## Simulated Invoice Extraction Demo\n\n`;
  response += `*This is a demonstration using sample data. With an API key, I would extract real data from your uploaded image.*\n\n`;
  response += `---\n\n`;
  response += `Here's what the extraction workflow looks like:\n\n`;
  response += formatExtractedInvoicePreview(extractedData);
  response += '\n---\n\n';
  response += `**Does this sample data look good for the demo?**\n\n`;
  response += `Reply **"yes"** to see how the customer and invoice creation works:\n`;
  response += `- \`hcp_create_customer\` - Create the customer record\n`;
  response += `- \`hcp_create_job\` - Create the job with line items\n`;
  response += `- \`hcp_complete_job\` - Complete the job and generate the invoice\n\n`;
  response += `Or reply **"no"** to cancel the demo.`;

  return response;
}

/**
 * Handle the API key instructions flow.
 * Provides information about how to add an API key for real image analysis.
 */
function handleApiKeyInstructions(): string {
  // Reset conversation state
  conversationState = {
    ...conversationState,
    flowState: 'initial',
  };

  let response = `## How to Enable Real Image Analysis\n\n`;
  response += `To analyze actual invoice images, you need to add an Anthropic API key.\n\n`;
  response += `### Steps to get an API key:\n\n`;
  response += `1. **Create an Anthropic account** at [console.anthropic.com](https://console.anthropic.com)\n`;
  response += `2. **Generate an API key** in the API Keys section\n`;
  response += `3. **Add the key** to your environment or application settings\n\n`;
  response += `### What you'll get with an API key:\n\n`;
  response += `- **Real image analysis** - Extract actual data from uploaded invoice photos\n`;
  response += `- **Claude's vision capabilities** - Accurate text and structure recognition\n`;
  response += `- **Automatic data extraction** - Customer info, line items, and totals\n\n`;
  response += `---\n\n`;
  response += `Once you have an API key configured, just upload an invoice image and I'll extract the real data from it.\n\n`;
  response += `Is there anything else I can help you with?`;

  return response;
}

/**
 * Handle confirmation for extracted invoice.
 */
function handleInvoiceConfirmation(message: string, context: MockContext): string {
  const lowerMessage = message.toLowerCase().trim();
  const proName = context.activePro.ownerName.split(' ')[0];
  const { extractedInvoice } = conversationState;

  if (!extractedInvoice) {
    conversationState.flowState = 'initial';
    return "I'm not sure what we're confirming. Would you like to upload an invoice image?";
  }

  if (lowerMessage === 'yes' || lowerMessage === 'y' || lowerMessage === 'confirm') {
    return executeInvoiceCreation(extractedInvoice, proName);
  }

  if (lowerMessage === 'no' || lowerMessage === 'n' || lowerMessage === 'cancel') {
    conversationState.flowState = 'initial';
    conversationState.extractedInvoice = undefined;
    return `No problem! Let me know when you're ready to try again, or if you'd like to do something else.`;
  }

  // Handle partial corrections
  if (lowerMessage.includes('change') || lowerMessage.includes('wrong') || lowerMessage.includes('update')) {
    return `I can update the details. What would you like to change?\n\n` +
      `You can say things like:\n` +
      `- "Change the email to john@example.com"\n` +
      `- "The name should be John Doe"\n` +
      `- "Remove the filter line item"\n`;
  }

  return `I didn't catch that. Reply "yes" to proceed with creating the customer and invoice, or "no" to cancel. You can also tell me what needs to be changed.`;
}

/**
 * Execute the invoice creation from extracted data.
 */
function executeInvoiceCreation(data: ExtractedInvoiceData, _proName: string): string {
  // Generate IDs for created items
  const customerId = `cust-${Math.random().toString(36).substr(2, 8)}`;
  const addressId = `addr-${Math.random().toString(36).substr(2, 8)}`;
  const jobId = `job-${Math.random().toString(36).substr(2, 8)}`;
  const invoiceId = `inv-${Math.floor(1000 + Math.random() * 9000)}`;

  // Store created items
  conversationState.createdItems.push(
    { type: 'customer', id: customerId, data: data.customer as unknown as Record<string, unknown> },
    { type: 'job', id: jobId, data: { lineItems: data.lineItems } as unknown as Record<string, unknown> },
    { type: 'invoice', id: invoiceId, data: { total: data.total } as unknown as Record<string, unknown> }
  );

  const addr = data.customer.address;

  let response = `## Creating Records from Extracted Data\n\n`;

  // Step 1: Create Customer
  response += `### Step 1: \`hcp_create_customer\`\n`;
  response += `\`\`\`json\n`;
  response += `{\n`;
  response += `  "first_name": "${data.customer.firstName}",\n`;
  response += `  "last_name": "${data.customer.lastName}",\n`;
  response += `  "email": "${data.customer.email || ''}",\n`;
  response += `  "mobile_number": "${data.customer.phone || ''}",\n`;
  if (addr) {
    response += `  "street": "${addr.street}",\n`;
    response += `  "city": "${addr.city}",\n`;
    response += `  "state": "${addr.state}",\n`;
    response += `  "zip": "${addr.zip}"\n`;
  }
  response += `}\n`;
  response += `\`\`\`\n`;
  response += `✅ Customer created: **${data.customer.firstName} ${data.customer.lastName}** (ID: \`${customerId}\`)\n\n`;

  // Step 2: Create Job
  response += `### Step 2: \`hcp_create_job\`\n`;
  response += `\`\`\`json\n`;
  response += `{\n`;
  response += `  "customer_id": "${customerId}",\n`;
  response += `  "address_id": "${addressId}",\n`;
  response += `  "line_items": [\n`;
  data.lineItems.forEach((item, idx) => {
    response += `    { "name": "${item.service}", "quantity": ${item.quantity}, "unit_price": ${item.unitPrice} }${idx < data.lineItems.length - 1 ? ',' : ''}\n`;
  });
  response += `  ]\n`;
  response += `}\n`;
  response += `\`\`\`\n`;
  response += `✅ Job created: **${data.lineItems.map(i => i.service).join(', ')}** (ID: \`${jobId}\`)\n\n`;

  // Step 3: Complete Job
  response += `### Step 3: \`hcp_complete_job\`\n`;
  response += `\`\`\`json\n`;
  response += `{ "job_id": "${jobId}" }\n`;
  response += `\`\`\`\n`;
  response += `✅ Job completed - Invoice generated: **#${invoiceId}** for **$${data.total.toFixed(2)}**\n\n`;

  response += `---\n\n`;
  response += `## Summary\n\n`;
  response += `| Resource | ID | Details |\n`;
  response += `|----------|----|---------|\n`;
  response += `| Customer | \`${customerId}\` | ${data.customer.firstName} ${data.customer.lastName} |\n`;
  response += `| Job | \`${jobId}\` | ${data.lineItems.map(i => i.service).join(', ')} |\n`;
  response += `| Invoice | \`${invoiceId}\` | $${data.total.toFixed(2)} |\n\n`;

  response += `**What's next?**\n\n`;
  response += `- 📤 **Send Invoice** - Use \`hcp_send_invoice\` to email or text the invoice\n`;
  response += `- 📄 **[View Invoice](/invoices/${invoiceId})** - Preview the invoice\n`;
  response += `- 👤 **[View Customer](/customers/${customerId})** - See customer details\n`;

  // Reset conversation state
  conversationState = {
    flowState: 'initial',
    createdItems: conversationState.createdItems,
  };

  return response;
}

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
function generateNotAttachedResponse(detected: DetectedFeature, _proName: string): string {
  const { feature, stageContext } = detected;
  const helpContent = generateHelpContent(stageContext, feature.name);

  let response = `Great question about ${feature.name.toLowerCase()}! Let me explain how it works.\n\n`;
  response += helpContent;
  response += '\n---\n\n';

  // Value proposition from stageContext (or fallback)
  const valueProp = getValueProp(stageContext);
  if (valueProp) {
    response += `**${valueProp}**\n\n`;
  }

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
  const helpContent = generateHelpContent(stageContext, feature.name);

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
  const helpContent = generateHelpContent(stageContext, feature.name);

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
  const { feature } = detected;

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
 * Also handles "demo" and "api key" choices for invoice image upload flow.
 */
function handleChoiceResponse(message: string, context: MockContext): string {
  const lowerMessage = message.toLowerCase().trim();
  const { currentFeature } = conversationState;

  if (!currentFeature) {
    conversationState.flowState = 'initial';
    return "I'm not sure what we were discussing. What would you like help with?";
  }

  const proName = context.activePro.ownerName.split(' ')[0];

  // Handle demo/api-key choices for invoice image upload (mock mode)
  if (currentFeature === 'invoicing') {
    // Check for "demo" choice - show simulated extraction workflow
    if (lowerMessage === 'demo' || lowerMessage.includes('demo')) {
      return handleInvoiceImageDemoFlow(proName);
    }

    // Check for "api key" choice - show setup instructions
    if (lowerMessage === 'api key' || lowerMessage.includes('api key') || lowerMessage.includes('apikey') || lowerMessage === 'api') {
      return handleApiKeyInstructions();
    }
  }

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

  // Check if we're in the invoice image upload context (waiting for demo/api key choice)
  // This provides a more helpful re-prompt for that specific flow
  if (currentFeature === 'invoicing' && !conversationState.currentStage) {
    return `I didn't catch that. Would you like to:\n\n` +
      `- **"demo"** - See the invoice extraction workflow with sample data\n` +
      `- **"api key"** - Learn how to enable real image analysis\n`;
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
function handleInputResponse(message: string, _context: MockContext): string {
  const { currentFeature, awaitingField, collectedData } = conversationState;

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
 * Generate a feature-aware response using stage prompts and conversation state.
 */
function generateFeatureResponse(detected: DetectedFeature, _message: string, context: MockContext): string {
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
 * Fallback response when feature is detected.
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
 * Check if user is asking about uploading or converting an invoice image.
 */
function isInvoiceUploadIntent(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const invoiceKeywords = ['invoice', 'receipt', 'bill'];
  const uploadKeywords = ['upload', 'picture', 'photo', 'image', 'convert', 'scan', 'attached', 'here is', 'here\'s'];

  const hasInvoiceKeyword = invoiceKeywords.some(k => lowerMessage.includes(k));
  const hasUploadKeyword = uploadKeywords.some(k => lowerMessage.includes(k));

  return hasInvoiceKeyword && hasUploadKeyword;
}

/**
 * Generate a mock AI response based on the user's message and pro context.
 * This simulates the AI behavior without requiring an API key.
 * Supports multi-turn conversational flows with sample/real data options.
 * Supports image attachments for invoice extraction flow.
 * Returns both the response content and debug context for inspection.
 */
export async function generateMockResponse(
  message: string,
  context: MockContext,
  attachments?: FileAttachment[]
): Promise<MockResponseResult> {
  const { activePro, features, getStageContext } = context;
  const proName = activePro.ownerName.split(' ')[0];

  // Track detected feature for debug context
  let detectedFeatureInfo: DebugFeatureInfo | undefined;
  let toolCalls: DebugToolCall[] = [];

  // Helper to build result with debug context
  const buildResult = (content: string): MockResponseResult => ({
    content,
    debugContext: {
      conversationState: {
        flowState: conversationState.flowState,
        currentFeature: conversationState.currentFeature,
        currentStage: conversationState.currentStage,
        dataChoice: conversationState.dataChoice,
      },
      detectedFeature: detectedFeatureInfo,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    },
  });

  // Simulate a brief delay to feel more natural
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

  // Check for image attachments - trigger invoice extraction flow
  if (attachments && attachments.length > 0) {
    // Check if any attachment is an image
    const hasImageAttachment = attachments.some(att =>
      att.type.startsWith('image/')
    );

    if (hasImageAttachment) {
      toolCalls.push({ name: 'image_analysis', parameters: { attachmentCount: attachments.length } });

      // If user mentions invoice/convert/etc OR we're in invoicing context, extract invoice
      const lowerMessage = message.toLowerCase();
      const isInvoiceRelated = isInvoiceUploadIntent(message) ||
        lowerMessage.includes('invoice') ||
        lowerMessage.includes('convert') ||
        lowerMessage.includes('create') ||
        conversationState.currentFeature === 'invoicing' ||
        message.trim() === ''; // Just uploaded an image with no text

      if (isInvoiceRelated || message.trim() === '') {
        return buildResult(handleInvoiceImageUpload(proName));
      }

      // For other image uploads, acknowledge and ask about intent
      return buildResult(`I see you've uploaded an image. Would you like me to:\n\n` +
        `1. **Extract invoice details** - If this is an invoice or receipt\n` +
        `2. **Something else** - Let me know what you need help with\n\n` +
        `Just let me know!`);
    }
  }

  // Check conversation state for pending flows
  if (conversationState.flowState === 'awaiting_invoice_confirmation') {
    if (conversationState.extractedInvoice) {
      toolCalls.push({ name: 'invoice_confirmation_flow', parameters: { action: 'confirm' } });
    }
    return buildResult(handleInvoiceConfirmation(message, context));
  }

  if (conversationState.flowState === 'awaiting_confirmation') {
    toolCalls.push({ name: 'confirmation_flow', parameters: { pending: conversationState.pendingAction?.toolName } });
    return buildResult(handleConfirmationResponse(message, context));
  }

  if (conversationState.flowState === 'awaiting_choice') {
    return buildResult(handleChoiceResponse(message, context));
  }

  if (conversationState.flowState === 'awaiting_input') {
    return buildResult(handleInputResponse(message, context));
  }

  // Check if user is asking about uploading an invoice (without attachment)
  if (isInvoiceUploadIntent(message)) {
    return buildResult(`I'd be happy to help convert your invoice! Upload your invoice image using the 📎 button and I'll extract all the details for you.\n\n` +
      `I can read:\n` +
      `- Photos of paper invoices\n` +
      `- Screenshots of digital invoices\n` +
      `- Scanned documents\n\n` +
      `Once you upload the image, I'll extract the customer info, line items, and totals automatically.`);
  }

  // Try to detect a feature mention
  const detectedFeature = detectFeature(message, features, activePro, getStageContext);

  if (detectedFeature) {
    // Capture detected feature info for debug context
    const status = activePro.featureStatus[detectedFeature.feature.id];
    detectedFeatureInfo = {
      id: detectedFeature.feature.id,
      name: detectedFeature.feature.name,
      stage: detectedFeature.stage,
      completedTasks: status?.completedTasks.length || 0,
      usageCount: status?.usageCount || 0,
    };
    return buildResult(generateFeatureResponse(detectedFeature, message, context));
  }

  // Fall back to general response
  return buildResult(generateGeneralResponse(message, activePro));
}
