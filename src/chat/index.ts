// =============================================================================
// CHAT MODULE - PUBLIC EXPORTS
// =============================================================================
// This file exports all public components, hooks, and types from the chat module.
// =============================================================================

// Context
export { ChatProvider, useChatContext } from './context/ChatContext';

// Hooks
export { useChat } from './hooks/useChat';

// Services
export {
  sendToAnthropic,
  getApiKey,
  getApiKeyConfig,
  setStoredApiKey,
  clearStoredApiKey,
  isValidApiKeyFormat,
} from './services/anthropicService';

export {
  buildSystemPrompt,
  buildPlanningPrompt,
  buildDemoPrompt,
} from './services/contextBuilder';

// Components (will be added as they are created)
export { ChatContainer } from './components/ChatContainer';
export { ChatHeader } from './components/ChatHeader';
export { MessageList } from './components/MessageList';
export { MessageBubble } from './components/MessageBubble';
export { ChatInput } from './components/ChatInput';
export { TypingIndicator } from './components/TypingIndicator';
export { ApiKeyModal } from './components/ApiKeyModal';

// Types
export type {
  ChatMode,
  ChatMessage,
  ChatState,
  ChatActions,
  ChatContextValue,
  MessageRole,
  ApiKeyConfig,
  AnthropicMessage,
  AnthropicRequest,
  AnthropicResponse,
  AnthropicError,
} from './types';
