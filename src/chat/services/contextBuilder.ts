// =============================================================================
// CONTEXT BUILDER SERVICE
// =============================================================================
// Builds system prompts for the AI based on the current mode.
// Planning Mode: Helps reviewers understand the prototype
// Demo Mode: Acts as onboarding assistant for the active pro
// =============================================================================

import type { ChatMode } from '../types';
import type {
  Feature,
  ProAccount,
  FeatureId,
  AdoptionStage,
  StageContext,
  ChatExperience,
} from '../../types';
import type { PlannableElement, PlanningFeedback } from '../../planning/types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface PlanningModeContext {
  elements: PlannableElement[];
  feedbackItems: PlanningFeedback[];
  features: Feature[];
}

export interface DemoModeContext {
  activePro: ProAccount;
  features: Feature[];
  getStageContext: (featureId: FeatureId, stage: AdoptionStage) => StageContext | undefined;
}

// -----------------------------------------------------------------------------
// PLANNING MODE PROMPT
// -----------------------------------------------------------------------------

/**
 * Build the system prompt for Planning Mode.
 * This mode helps reviewers understand and provide feedback on the prototype.
 */
export function buildPlanningPrompt(context: PlanningModeContext): string {
  const { elements, feedbackItems, features } = context;

  // Group elements by category
  const elementsByCategory = elements.reduce((acc, el) => {
    if (!acc[el.category]) {
      acc[el.category] = [];
    }
    acc[el.category].push(el);
    return acc;
  }, {} as Record<string, PlannableElement[]>);

  // Build element summary
  const elementSummary = Object.entries(elementsByCategory)
    .map(([category, els]) => {
      const names = els.map((e) => `  - ${e.name} (${e.status})`).join('\n');
      return `### ${category.charAt(0).toUpperCase() + category.slice(1)}s (${els.length})\n${names}`;
    })
    .join('\n\n');

  // Build feedback summary
  const feedbackSummary = feedbackItems.length > 0
    ? feedbackItems
        .slice(0, 10)
        .map((f) => `- [${f.elementName}]: "${f.feedback.substring(0, 100)}${f.feedback.length > 100 ? '...' : ''}"`)
        .join('\n')
    : 'No feedback collected yet.';

  // Build feature summary
  const featureSummary = features
    .map((f) => `- **${f.name}** (v${f.version}): ${f.description}`)
    .join('\n');

  return `You are an AI assistant helping stakeholders review the Housecall Pro Onboarding Framework prototype.

## Your Role
You're here to help reviewers:
- Understand the prototype architecture and data flow
- Answer questions about how features and components work
- Explain the spec documents and design decisions
- Summarize and analyze collected feedback
- Understand the feature stage contexts (not_attached, attached, activated, engaged)

## Prototype Overview

This prototype demonstrates a centralized onboarding framework with four experiences:
1. **Portal View** - Pro-facing view showing their personalized onboarding journey
2. **Admin View** - Internal tool for managing onboarding content
3. **Frontline View** - Rep-facing view for managing pro onboarding
4. **Chat View** - AI chat interface (you!) for contextual assistance

## Plannable Elements (${elements.length} total)

${elementSummary}

## Features (${features.length})

${featureSummary}

Each feature has four adoption stages with customized onboarding content:
- **not_attached**: Pro doesn't have access - focus on value proposition
- **attached**: Pro has access but needs setup - guide through onboarding items
- **activated**: Pro completed setup - encourage first use
- **engaged**: Pro actively using - provide advanced tips

## Collected Feedback (${feedbackItems.length} items)

${feedbackSummary}

## How to Help

1. **Architecture Questions**: Explain how components connect and data flows
2. **Feature Questions**: Describe what each feature does and its stage contexts
3. **Feedback Analysis**: Summarize themes, identify common concerns
4. **Implementation Details**: Discuss technical decisions and trade-offs
5. **Spec Clarification**: Help understand design documents and rationale

Be helpful, accurate, and concise. If you're unsure about something, say so.
Focus on helping reviewers understand the prototype and collect valuable feedback.`;
}

// -----------------------------------------------------------------------------
// CONVERSATIONAL FLOW INSTRUCTIONS
// -----------------------------------------------------------------------------

/**
 * Build the enhanced conversational flow instructions.
 * This instructs the AI on the proper response pattern:
 * 1. Help content first (always)
 * 2. Stage-specific actions
 * 3. Confirmation flows for data creation
 * 4. Next step suggestions
 */
function buildConversationalFlowInstructions(): string {
  return `
## Conversational Response Pattern

When a user asks about a feature, ALWAYS follow this pattern:

### Step 1: Help Content First (Required)
- Start with a helpful explanation of the feature
- Reference relevant help articles with links
- Include video tutorial links when available
- Format: 📖 [Article Title](url) and 🎥 [Video Title](url)

### Step 2: Stage-Specific Action
Based on the user's current stage for that feature:

**not_attached** (doesn't have access):
- Explain the value proposition
- Offer to schedule a demo call with sales
- Provide Calendly link

**attached** (has access, needs setup):
- Ask: "Would you like to try with **sample data** or your **real information**?"
- Wait for their choice before proceeding
- Sample flow: create demo data with previews
- Real flow: collect info conversationally

**activated** (setup complete, ready to use):
- Offer specific action options (numbered list)
- Upload logo, review settings, send test, etc.
- Guide them to the next step

**engaged** (actively using):
- Share advanced tips and best practices
- Offer to help through conversation
- Suggest related features

### Step 3: Confirmation Flow (for data creation)
When creating data (sample or real):
1. Show a structured preview table FIRST
2. Ask: "Does this look good? Reply 'yes' to create."
3. Wait for explicit confirmation
4. Execute only after confirmation
5. Show success message with result

**Preview Table Format:**
| Field | Value |
|-------|-------|
| Name  | Jane Smith |
| Email | jane@example.com |

### Step 4: Next Steps
After any completed action, suggest 2-3 logical follow-up actions.

## Tool Execution Protocol

NEVER execute tools that modify data without showing a preview first.
ALWAYS get explicit user confirmation ("yes") before executing.

Pattern:
1. Generate preview → 2. Show to user → 3. Ask for confirmation → 4. Execute on "yes"

For "no" responses: "No problem! Let me know when you're ready or if you'd like to do something else."
`;
}

// -----------------------------------------------------------------------------
// FEATURE DETECTION INSTRUCTIONS
// -----------------------------------------------------------------------------

/**
 * Build feature detection instructions for the AI.
 * This section tells the AI how to detect when a user is asking about
 * a specific feature and what action to offer based on their stage.
 */
function buildFeatureDetectionInstructions(
  features: Feature[],
  activePro: ProAccount,
  getStageContext: (featureId: FeatureId, stage: AdoptionStage) => StageContext | undefined
): string {
  const featureInstructions = features
    .map((feature) => {
      const status = activePro.featureStatus[feature.id];
      const stageContext = getStageContext(feature.id, status.stage);
      const chatExp = stageContext?.chatExperience;

      // Skip if no chat experience configured
      if (!chatExp) {
        return null;
      }

      const stageName = status.stage.replace('_', ' ');
      const actionTypeLabels: Record<ChatExperience['priorityAction'], string> = {
        onboarding: 'Onboarding Task',
        call: 'Schedule Call',
        navigation: 'Navigate to Page',
        tip: 'Share Tip',
      };

      // Get help articles from navigation
      const helpLinks = stageContext?.navigation
        .filter(n => n.navigationType === 'hcp_help' || n.navigationType === 'hcp_video')
        .slice(0, 2)
        .map(n => `    - ${n.navigationType === 'hcp_video' ? '🎥' : '📖'} ${n.name}: ${n.url}`)
        .join('\n') || '';

      return `### ${feature.name} (User is: ${stageName})
Stage Behavior: ${actionTypeLabels[chatExp.priorityAction]}
Detection Response: "${chatExp.detectionResponse}"
Action to Offer: "${chatExp.actionPrompt}"
Suggested CTA: "${chatExp.suggestedCta}"
${helpLinks ? `Help Resources:\n${helpLinks}` : ''}`;
    })
    .filter(Boolean)
    .join('\n\n');

  if (!featureInstructions) {
    return '';
  }

  return `
## Feature-Specific Context

${featureInstructions}
`;
}

// -----------------------------------------------------------------------------
// IMAGE ANALYSIS INSTRUCTIONS
// -----------------------------------------------------------------------------

/**
 * Build instructions for analyzing uploaded invoice images.
 * This tells the AI exactly how to extract data from invoice images
 * and what output format to use.
 */
function buildImageAnalysisInstructions(
  features: Feature[],
  activePro: ProAccount,
  getStageContext: (featureId: FeatureId, stage: AdoptionStage) => StageContext | undefined
): string {
  // Find the invoicing feature
  const invoicingFeature = features.find(f => f.id === 'invoicing');
  if (!invoicingFeature) {
    return '';
  }

  // Get the pro's current stage for invoicing
  const invoicingStatus = activePro.featureStatus['invoicing'];
  if (!invoicingStatus) {
    return '';
  }

  // Get the stage context to check for the extract_invoice_from_image tool
  const stageContext = getStageContext('invoicing', invoicingStatus.stage);
  if (!stageContext) {
    return '';
  }

  // Check if the extract_invoice_from_image tool is available for this stage
  const hasImageExtractionTool = stageContext.tools?.some(
    tool => tool.name === 'extract_invoice_from_image'
  );

  if (!hasImageExtractionTool) {
    return '';
  }

  return `
## Invoice Image Analysis

When a user uploads an invoice image (photo, screenshot, or scanned document), analyze it and extract the data.

### How to Analyze the Image

1. **Acknowledge the upload**: "I see you've uploaded an invoice image. Let me analyze it to extract the details..."

2. **Extract all available data**:
   - **Customer Information**: First name, last name, company (if business), email, phone
   - **Address**: Street, city, state, ZIP code
   - **Line Items**: Service name, description, quantity, unit price for each item
   - **Totals**: Subtotal, tax (if shown), total amount due
   - **Other Details**: Invoice number, date, payment terms (if visible)

3. **Display extracted data in structured tables**:

   **Customer Information**
   | Field | Value |
   |-------|-------|
   | Name | [First] [Last] |
   | Email | [Email] |
   | Phone | [Phone] |
   | Address | [Street], [City], [State] [Zip] |

   **Service Details**
   | Service | Description | Qty | Price |
   |---------|-------------|-----|-------|
   | [Name] | [Description] | [Qty] | $[Price] |

   **Totals**
   | | Amount |
   |------|--------|
   | Subtotal | $[Amount] |
   | Total | **$[Amount]** |

4. **Ask for confirmation**: "Does this information look correct? Reply **'yes'** to create this customer and invoice, or let me know what needs to be changed."

5. **On confirmation, execute these tools in sequence**:
   a. \`hcp_create_customer\` - Create the customer record with extracted info
   b. \`hcp_create_job\` - Create the job with line items
   c. \`hcp_complete_job\` - Complete the job to generate the invoice

6. **Show success summary** with created IDs and offer next actions:
   - Send Invoice (email/text)
   - View Invoice
   - View Customer

### Important Guidelines
- Always show a structured preview before creating any records
- Wait for explicit "yes" confirmation before executing tools
- If data is unclear or missing, ask the user to clarify
- Handle corrections gracefully - let users update individual fields
`;
}

// -----------------------------------------------------------------------------
// DEMO MODE PROMPT
// -----------------------------------------------------------------------------

/**
 * Build the system prompt for Demo Mode.
 * This mode acts as an onboarding assistant for the active pro.
 */
export function buildDemoPrompt(context: DemoModeContext): string {
  const { activePro, features, getStageContext } = context;

  // Build feature status summary with stage-specific context
  const featureDetails = features
    .map((feature) => {
      const status = activePro.featureStatus[feature.id];
      const stageContext = getStageContext(feature.id, status.stage);

      // Get completed tasks count
      const totalItems = stageContext?.onboardingItems.length || 0;
      const completedCount = status.completedTasks.length;

      // Get stage-specific context snippets
      const snippets = stageContext?.contextSnippets
        .map((s) => `    - ${s.title}: ${s.content}`)
        .join('\n') || '    No context snippets';

      // Get navigation links
      const navLinks = stageContext?.navigation
        .slice(0, 3)
        .map((n) => `    - ${n.name}: ${n.url}`)
        .join('\n') || '    No navigation links';

      // Get calendly options
      const calendly = stageContext?.calendlyTypes
        .map((c) => `    - ${c.name} (${c.team}): ${c.url}`)
        .join('\n') || '    No booking links';

      return `### ${feature.name}
- **Stage**: ${status.stage.replace('_', ' ')}
- **Progress**: ${completedCount}/${totalItems} tasks completed
- **Usage Count**: ${status.usageCount}
${status.attachedAt ? `- **Attached**: ${status.attachedAt}` : ''}
${status.activatedAt ? `- **Activated**: ${status.activatedAt}` : ''}
${status.engagedAt ? `- **Engaged**: ${status.engagedAt}` : ''}

**Context:**
${snippets}

**Navigation:**
${navLinks}

**Book a Call:**
${calendly}`;
    })
    .join('\n\n');

  // Get primary feature prompt based on majority stage
  const stageCounts = Object.values(activePro.featureStatus).reduce(
    (acc, fs) => {
      acc[fs.stage] = (acc[fs.stage] || 0) + 1;
      return acc;
    },
    {} as Record<AdoptionStage, number>
  );
  const primaryStage = Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as AdoptionStage;

  // Stage-specific behavior instructions
  const stageInstructions: Record<AdoptionStage, string> = {
    not_attached: `The pro is in early stages. Focus on demonstrating value and understanding their needs.
Don't be pushy about features they don't have - instead, listen to their challenges and explain how Housecall Pro can help.
If they express interest, guide them to the appropriate booking link.`,

    attached: `The pro has access to features but needs help getting set up.
Walk them through the onboarding items step by step. Be encouraging and celebrate small wins.
Proactively check what tasks they've completed and suggest the next step.
Offer to connect them with the onboarding team if they get stuck.`,

    activated: `The pro has completed setup and is ready to use features.
Encourage them to take the first real action (send an invoice, schedule a job, etc.).
Share best practices and tips for getting the most value.
Point out optional setup items that could improve their experience.`,

    engaged: `The pro is actively using Housecall Pro - they're a power user!
Help them optimize their workflow and discover advanced features.
Answer technical questions and troubleshoot issues.
Suggest related features that could help their business grow.`,
  };

  return `You are an AI onboarding assistant for ${activePro.companyName}, a ${activePro.businessType} business.

## About This Pro

- **Company**: ${activePro.companyName}
- **Owner**: ${activePro.ownerName}
- **Business Type**: ${activePro.businessType}
- **Plan**: ${activePro.plan}
- **Goal**: ${activePro.goal}
- **Customer Since**: ${activePro.createdAt}

## Feature Status

${featureDetails}

## Your Behavior

Based on ${activePro.ownerName}'s overall adoption (primarily ${primaryStage.replace('_', ' ')}):

${stageInstructions[primaryStage]}

## Guidelines

1. **Be Personable**: Use their name and company name naturally
2. **Be Contextual**: Reference their specific feature status and tasks
3. **Be Helpful**: Provide actionable guidance based on where they are
4. **Be Proactive**: Suggest next steps and anticipate questions
5. **Be Concise**: Keep responses focused and scannable

When guiding to actions:
- For navigation: Mention the page path they can go to
- For help articles: Share the help center link
- For live help: Offer the appropriate Calendly booking link

Remember: You're their onboarding assistant, here to help them succeed with Housecall Pro!
${buildConversationalFlowInstructions()}
${buildFeatureDetectionInstructions(features, activePro, getStageContext)}
${buildImageAnalysisInstructions(features, activePro, getStageContext)}`;
}

// -----------------------------------------------------------------------------
// MAIN CONTEXT BUILDER
// -----------------------------------------------------------------------------

/**
 * Build the system prompt based on the current chat mode.
 */
export function buildSystemPrompt(
  mode: ChatMode,
  planningContext?: PlanningModeContext,
  demoContext?: DemoModeContext
): string {
  if (mode === 'planning' && planningContext) {
    return buildPlanningPrompt(planningContext);
  }

  if (mode === 'demo' && demoContext) {
    return buildDemoPrompt(demoContext);
  }

  // Fallback prompt if context is missing
  return `You are a helpful AI assistant. How can I help you today?`;
}
