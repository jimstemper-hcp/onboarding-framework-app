// =============================================================================
// CHAT MODULE - TYPE DEFINITIONS
// =============================================================================
// This file defines the data model for the dual-mode AI chat assistant.
// The chat behaves differently based on Planning Mode vs Demo Mode.
// =============================================================================

/**
 * Chat mode determines the AI's personality and context.
 * - planning: Reviewer chat about prototype specs, feedback, status
 * - demo: Onboarding assistant for the active pro
 */
export type ChatMode = 'planning' | 'demo';

/**
 * Role in the conversation.
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Supported image MIME types for file attachments.
 */
export type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

/**
 * File attachment for messages (supports images for vision API).
 */
export interface FileAttachment {
  id: string;
  name: string;
  type: ImageMediaType;    // MIME type
  size: number;            // File size in bytes
  base64Data: string;      // Base64-encoded content
  previewUrl?: string;     // Object URL for preview (client-side only)
}

/**
 * A single chat message.
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO timestamp
  attachments?: FileAttachment[];  // Optional file attachments (images)
  debugContext?: MessageDebugContext;  // Debug context for assistant messages
}

/**
 * Chat state managed by the context.
 */
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  mode: ChatMode;
  /** True when using mock responses (no API key available) */
  isMockMode: boolean;
}

/**
 * API key configuration.
 */
export interface ApiKeyConfig {
  // Environment variable takes precedence
  hasEnvKey: boolean;
  // User-provided key in localStorage
  userKey: string | null;
  // Whether we have any valid key
  hasKey: boolean;
}

/**
 * Chat context actions.
 */
export interface ChatActions {
  sendMessage: (content: string, attachments?: FileAttachment[]) => Promise<void>;
  clearMessages: () => void;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  retryLastMessage: () => Promise<void>;
}

/**
 * Combined chat context value.
 */
export type ChatContextValue = ChatState & ChatActions & {
  apiKeyConfig: ApiKeyConfig;
};

/**
 * Anthropic vision content block for images.
 */
export interface AnthropicImageBlock {
  type: 'image';
  source: {
    type: 'base64';
    media_type: ImageMediaType;
    data: string;  // Base64-encoded image data
  };
}

/**
 * Anthropic text content block.
 */
export interface AnthropicTextBlock {
  type: 'text';
  text: string;
}

/**
 * Content can be a string (text only) or array of blocks (vision).
 */
export type AnthropicMessageContent = string | Array<AnthropicImageBlock | AnthropicTextBlock>;

/**
 * Anthropic API message format.
 */
export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: AnthropicMessageContent;
}

/**
 * Anthropic API request payload.
 */
export interface AnthropicRequest {
  model: string;
  max_tokens: number;
  system?: string;
  messages: AnthropicMessage[];
}

/**
 * Anthropic API response.
 */
export interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Anthropic API error response.
 */
export interface AnthropicError {
  type: string;
  error: {
    type: string;
    message: string;
  };
}

// -----------------------------------------------------------------------------
// DEBUG CONTEXT TYPES
// -----------------------------------------------------------------------------

/**
 * Pro information captured for debug context.
 */
export interface DebugProInfo {
  id: string;
  companyName: string;
  ownerName: string;
  plan: string;
  goal: string;
}

/**
 * Feature context captured for debug context.
 */
export interface DebugFeatureInfo {
  id: string;
  name: string;
  stage: string;
  completedTasks: number;
  usageCount: number;
}

/**
 * Conversation state from mock service.
 */
export interface DebugConversationState {
  flowState: string;
  currentFeature?: string;
  currentStage?: string;
  dataChoice?: string;
}

/**
 * System prompt information.
 */
export interface DebugSystemPrompt {
  mode: ChatMode;
  fullPrompt: string;
  promptLength: number;
}

/**
 * Tool call information.
 */
export interface DebugToolCall {
  name: string;
  parameters?: Record<string, unknown>;
  result?: string;
}

/**
 * Timing information.
 */
export interface DebugTiming {
  requestedAt: string;
  respondedAt: string;
  durationMs: number;
}

/**
 * API details.
 */
export interface DebugApiDetails {
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  isMockMode: boolean;
}

/**
 * Onboarding item for debug context.
 */
export interface DebugOnboardingItem {
  id: string;
  title: string;
  completed: boolean;
}

/**
 * Navigation link for debug context.
 */
export interface DebugNavigation {
  name: string;
  url: string;
  navigationType: string;
}

/**
 * Context snippet for debug context.
 */
export interface DebugContextSnippet {
  id: string;
  title: string;
  content: string;
}

/**
 * Calendly link for debug context.
 */
export interface DebugCalendlyLink {
  id: string;
  label: string;
  url: string;
}

/**
 * Stage context data for debug context.
 */
export interface DebugStageContext {
  onboardingItems?: DebugOnboardingItem[];
  navigation?: DebugNavigation[];
  contextSnippets?: DebugContextSnippet[];
  calendlyLinks?: DebugCalendlyLink[];
  tools?: string[];
}

/**
 * Complete debug context attached to assistant messages.
 * Shows the @HCP Context Manager information used to generate the response.
 */
export interface MessageDebugContext {
  pro?: DebugProInfo;
  feature?: DebugFeatureInfo;
  conversationState?: DebugConversationState;
  systemPrompt?: DebugSystemPrompt;
  toolCalls?: DebugToolCall[];
  timing?: DebugTiming;
  apiDetails?: DebugApiDetails;
  stageContext?: DebugStageContext;
}
