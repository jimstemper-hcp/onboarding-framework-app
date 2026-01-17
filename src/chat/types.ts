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
 * A single chat message.
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO timestamp
}

/**
 * Chat state managed by the context.
 */
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  mode: ChatMode;
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
  sendMessage: (content: string) => Promise<void>;
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
 * Anthropic API message format.
 */
export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
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
