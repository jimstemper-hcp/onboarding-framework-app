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
  /** Streaming state for progressive response display */
  streamingState: StreamingState;
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
  sendMessageStreaming: (content: string, attachments?: FileAttachment[]) => Promise<void>;
  clearMessages: () => void;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  retryLastMessage: () => Promise<void>;
  cancelStream: () => void;
  regenerateResponse: (messageId: string) => Promise<void>;
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
// STREAMING & AI ELEMENTS TYPES
// -----------------------------------------------------------------------------

/**
 * Status of a tool call during streaming.
 */
export type ToolCallStatus = 'pending' | 'running' | 'completed' | 'error';

/**
 * Tool call information for visualization.
 */
export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, unknown>;
  status: ToolCallStatus;
  result?: unknown;
  error?: string;
}

/**
 * Thinking/reasoning block from extended thinking.
 */
export interface ThinkingBlock {
  type: 'thinking';
  content: string;
  isStreaming: boolean;
}

/**
 * State for streaming responses.
 */
export interface StreamingState {
  isStreaming: boolean;
  streamingContent: string;
  thinkingContent: string | null;
  activeToolCalls: ToolCall[];
}

/**
 * Source/citation reference for AI responses.
 */
export interface Source {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
}

/**
 * Plan step for multi-step visualization.
 */
export interface PlanStep {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

/**
 * Response branch for message versioning.
 */
export interface ResponseBranch {
  id: string;
  content: string;
  timestamp: string;
  isActive: boolean;
}

/**
 * Streaming event types from SSE.
 */
export type StreamEventType =
  | 'message_start'
  | 'content_block_start'
  | 'content_block_delta'
  | 'content_block_stop'
  | 'message_delta'
  | 'message_stop'
  | 'ping'
  | 'error';

/**
 * SSE streaming event.
 */
export interface StreamEvent {
  type: StreamEventType;
  index?: number;
  content_block?: {
    type: 'text' | 'thinking' | 'tool_use';
    text?: string;
    thinking?: string;
    id?: string;
    name?: string;
    input?: Record<string, unknown>;
  };
  delta?: {
    type: 'text_delta' | 'thinking_delta' | 'input_json_delta';
    text?: string;
    thinking?: string;
    partial_json?: string;
  };
  message?: {
    id: string;
    type: string;
    role: string;
    model: string;
    stop_reason?: string;
    stop_sequence?: string | null;
    usage?: {
      input_tokens: number;
      output_tokens: number;
    };
  };
  usage?: {
    output_tokens: number;
  };
  error?: {
    type: string;
    message: string;
  };
}

/**
 * Callbacks for streaming events.
 */
export interface StreamCallbacks {
  onToken?: (token: string) => void;
  onThinking?: (thinking: string) => void;
  onToolStart?: (tool: ToolCall) => void;
  onToolUpdate?: (toolId: string, update: Partial<ToolCall>) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
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
