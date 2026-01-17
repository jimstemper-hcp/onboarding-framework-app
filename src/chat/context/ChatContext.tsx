// =============================================================================
// CHAT CONTEXT
// =============================================================================
// Manages chat state including messages, loading state, and mode switching.
// Integrates with Planning and Onboarding contexts for contextual prompts.
// =============================================================================

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type {
  ChatContextValue,
  ChatMessage,
  ChatMode,
  ApiKeyConfig,
  AnthropicMessage,
} from '../types';
import {
  sendToAnthropic,
  getApiKeyConfig,
  setStoredApiKey,
  clearStoredApiKey,
} from '../services/anthropicService';
import {
  buildSystemPrompt,
  type PlanningModeContext,
  type DemoModeContext,
} from '../services/contextBuilder';
import { usePlanningMode } from '../../planning/context/PlanningContext';
import { useOnboarding, useActivePro } from '../../context/OnboardingContext';

// -----------------------------------------------------------------------------
// CONTEXT
// -----------------------------------------------------------------------------

const ChatContext = createContext<ChatContextValue | null>(null);

// -----------------------------------------------------------------------------
// PROVIDER
// -----------------------------------------------------------------------------

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyConfig, setApiKeyConfigState] = useState<ApiKeyConfig>(getApiKeyConfig);

  // ---------------------------------------------------------------------------
  // EXTERNAL CONTEXTS
  // ---------------------------------------------------------------------------

  const {
    isPlanningMode,
    getAllElements,
    feedbackItems,
  } = usePlanningMode();

  const {
    features,
    getStageContext,
  } = useOnboarding();

  const activePro = useActivePro();

  // ---------------------------------------------------------------------------
  // DERIVED STATE
  // ---------------------------------------------------------------------------

  // Chat mode is determined by planning mode toggle
  const mode: ChatMode = isPlanningMode ? 'planning' : 'demo';

  // ---------------------------------------------------------------------------
  // CONTEXT BUILDERS
  // ---------------------------------------------------------------------------

  const buildContext = useCallback(() => {
    if (mode === 'planning') {
      const planningContext: PlanningModeContext = {
        elements: getAllElements(),
        feedbackItems,
        features,
      };
      return buildSystemPrompt('planning', planningContext);
    }

    if (mode === 'demo' && activePro) {
      const demoContext: DemoModeContext = {
        activePro,
        features,
        getStageContext,
      };
      return buildSystemPrompt('demo', undefined, demoContext);
    }

    // Fallback
    return buildSystemPrompt('demo');
  }, [mode, getAllElements, feedbackItems, features, activePro, getStageContext]);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Clear any previous error
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for API
      const conversationHistory: AnthropicMessage[] = [
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content: content.trim() },
      ];

      // Build system prompt based on current mode
      const systemPrompt = buildContext();

      // Send to Anthropic
      const response = await sendToAnthropic(conversationHistory, systemPrompt);

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [messages, buildContext]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const setApiKey = useCallback((key: string) => {
    setStoredApiKey(key);
    setApiKeyConfigState(getApiKeyConfig());
  }, []);

  const clearApiKey = useCallback(() => {
    clearStoredApiKey();
    setApiKeyConfigState(getApiKeyConfig());
  }, []);

  const retryLastMessage = useCallback(async () => {
    if (messages.length === 0) return;

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant message if it exists (and the error)
    setMessages((prev) => {
      const lastIndex = prev.length - 1;
      if (prev[lastIndex]?.role === 'assistant') {
        return prev.slice(0, lastIndex);
      }
      return prev;
    });

    setError(null);

    // Resend the last user message
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  // ---------------------------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------------------------

  const contextValue = useMemo<ChatContextValue>(
    () => ({
      messages,
      isLoading,
      error,
      mode,
      apiKeyConfig,
      sendMessage,
      clearMessages,
      setApiKey,
      clearApiKey,
      retryLastMessage,
    }),
    [
      messages,
      isLoading,
      error,
      mode,
      apiKeyConfig,
      sendMessage,
      clearMessages,
      setApiKey,
      clearApiKey,
      retryLastMessage,
    ]
  );

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// HOOK
// -----------------------------------------------------------------------------

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

export default ChatContext;
