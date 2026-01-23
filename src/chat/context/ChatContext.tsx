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
  useRef,
  type ReactNode,
} from 'react';
import type {
  ChatContextValue,
  ChatMessage,
  ChatMode,
  ApiKeyConfig,
  AnthropicMessage,
  FileAttachment,
  AnthropicMessageContent,
  MessageDebugContext,
  StreamingState,
  ToolCall,
} from '../types';
import {
  sendToAnthropic,
  getApiKeyConfig,
  setStoredApiKey,
  clearStoredApiKey,
} from '../services/anthropicService';
import { streamToAnthropic, mockStream, createStreamController } from '../services/streamingService';
import {
  buildSystemPrompt,
  type PlanningModeContext,
  type DemoModeContext,
} from '../services/contextBuilder';
import { generateMockResponse, type MockContext, type MockResponseResult } from '../services/mockService';
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

  // Streaming state
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    streamingContent: '',
    thinkingContent: null,
    activeToolCalls: [],
  });
  const streamControllerRef = useRef<AbortController | null>(null);

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

  // Mock mode is active when no API key is configured (for demo purposes)
  const isMockMode = !apiKeyConfig.hasKey;

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

  /**
   * Convert a ChatMessage with attachments to Anthropic message format.
   */
  const formatMessageForApi = useCallback((
    content: string,
    attachments?: FileAttachment[]
  ): AnthropicMessageContent => {
    // If no attachments, just return the text content
    if (!attachments || attachments.length === 0) {
      return content;
    }

    // Build content array with images first, then text
    const contentBlocks: AnthropicMessageContent = [];

    // Add image blocks
    for (const attachment of attachments) {
      contentBlocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: attachment.type,
          data: attachment.base64Data,
        },
      });
    }

    // Add text block if there's content
    if (content.trim()) {
      contentBlocks.push({
        type: 'text',
        text: content.trim(),
      });
    }

    return contentBlocks;
  }, []);

  const sendMessage = useCallback(async (content: string, attachments?: FileAttachment[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    // Clear any previous error
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      attachments,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let response: string;
      let debugContext: MessageDebugContext | undefined;

      // Capture timing
      const requestedAt = new Date().toISOString();

      // Use mock mode if no API key and in demo mode with an active pro
      if (!apiKeyConfig.hasKey && mode === 'demo' && activePro) {
        const mockContext: MockContext = {
          activePro,
          features,
          getStageContext,
        };

        // Build system prompt for debug context (even in mock mode)
        const systemPrompt = buildContext();

        const mockResult: MockResponseResult = await generateMockResponse(content.trim(), mockContext, attachments);
        response = mockResult.content;

        // Build debug context from mock response
        const respondedAt = new Date().toISOString();
        debugContext = {
          pro: {
            id: activePro.id,
            companyName: activePro.companyName,
            ownerName: activePro.ownerName,
            plan: activePro.plan,
            goal: activePro.goal,
          },
          feature: mockResult.debugContext.detectedFeature,
          conversationState: mockResult.debugContext.conversationState,
          systemPrompt: {
            mode,
            fullPrompt: systemPrompt,
            promptLength: systemPrompt.length,
          },
          toolCalls: mockResult.debugContext.toolCalls,
          timing: {
            requestedAt,
            respondedAt,
            durationMs: new Date(respondedAt).getTime() - new Date(requestedAt).getTime(),
          },
          apiDetails: {
            model: 'mock',
            isMockMode: true,
          },
          stageContext: mockResult.debugContext.stageContext,
        };
      } else if (!apiKeyConfig.hasKey) {
        // No API key and not in demo mode (or no active pro)
        throw new Error('No API key configured. Please add your Anthropic API key to use the chat.');
      } else {
        // Build conversation history for API
        const conversationHistory: AnthropicMessage[] = [
          ...messages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: formatMessageForApi(m.content, m.attachments),
          })),
          { role: 'user', content: formatMessageForApi(content.trim(), attachments) },
        ];

        // Build system prompt based on current mode
        const systemPrompt = buildContext();

        // Send to Anthropic
        response = await sendToAnthropic(conversationHistory, systemPrompt);

        // Build debug context for real API call
        const respondedAt = new Date().toISOString();
        debugContext = {
          pro: activePro ? {
            id: activePro.id,
            companyName: activePro.companyName,
            ownerName: activePro.ownerName,
            plan: activePro.plan,
            goal: activePro.goal,
          } : undefined,
          systemPrompt: {
            mode,
            fullPrompt: systemPrompt,
            promptLength: systemPrompt.length,
          },
          timing: {
            requestedAt,
            respondedAt,
            durationMs: new Date(respondedAt).getTime() - new Date(requestedAt).getTime(),
          },
          apiDetails: {
            model: 'claude-3-5-sonnet-20241022',
            isMockMode: false,
          },
        };
      }

      // Add assistant message with debug context
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        debugContext,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [messages, buildContext, apiKeyConfig.hasKey, mode, activePro, features, getStageContext, formatMessageForApi]);

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

  /**
   * Cancel an ongoing stream.
   */
  const cancelStream = useCallback(() => {
    if (streamControllerRef.current) {
      streamControllerRef.current.abort();
      streamControllerRef.current = null;
    }
    setStreamingState({
      isStreaming: false,
      streamingContent: '',
      thinkingContent: null,
      activeToolCalls: [],
    });
  }, []);

  /**
   * Send a message with streaming response.
   */
  const sendMessageStreaming = useCallback(async (content: string, attachments?: FileAttachment[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    // Clear any previous error and cancel any ongoing stream
    setError(null);
    cancelStream();

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      attachments,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Initialize streaming state
    setStreamingState({
      isStreaming: true,
      streamingContent: '',
      thinkingContent: null,
      activeToolCalls: [],
    });

    // Create abort controller for this stream
    streamControllerRef.current = createStreamController();

    const requestedAt = new Date().toISOString();

    try {
      let finalContent = '';
      let thinkingContent: string | null = null;
      const toolCalls: ToolCall[] = [];

      // Use mock mode if no API key and in demo mode with an active pro
      if (!apiKeyConfig.hasKey && mode === 'demo' && activePro) {
        const mockContext: MockContext = {
          activePro,
          features,
          getStageContext,
        };

        const mockResult: MockResponseResult = await generateMockResponse(content.trim(), mockContext, attachments);

        // Simulate streaming for mock mode
        await mockStream({
          content: mockResult.content,
          thinkingContent: mockResult.debugContext.toolCalls && mockResult.debugContext.toolCalls.length > 0
            ? 'Analyzing the request and determining the best approach...'
            : undefined,
          callbacks: {
            onToken: (token) => {
              setStreamingState((prev) => ({
                ...prev,
                streamingContent: prev.streamingContent + token,
              }));
            },
            onThinking: (thinking) => {
              setStreamingState((prev) => ({
                ...prev,
                thinkingContent: (prev.thinkingContent || '') + thinking,
              }));
            },
            onToolStart: (tool) => {
              setStreamingState((prev) => ({
                ...prev,
                activeToolCalls: [...prev.activeToolCalls, tool],
              }));
            },
            onToolUpdate: (toolId, update) => {
              setStreamingState((prev) => ({
                ...prev,
                activeToolCalls: prev.activeToolCalls.map((t) =>
                  t.id === toolId ? { ...t, ...update } : t
                ),
              }));
            },
            onComplete: (full) => {
              finalContent = full;
            },
          },
          delay: 15,
        });

        // Build debug context
        const respondedAt = new Date().toISOString();
        const systemPrompt = buildContext();

        const debugContext: MessageDebugContext = {
          pro: {
            id: activePro.id,
            companyName: activePro.companyName,
            ownerName: activePro.ownerName,
            plan: activePro.plan,
            goal: activePro.goal,
          },
          feature: mockResult.debugContext.detectedFeature,
          conversationState: mockResult.debugContext.conversationState,
          systemPrompt: {
            mode,
            fullPrompt: systemPrompt,
            promptLength: systemPrompt.length,
          },
          toolCalls: mockResult.debugContext.toolCalls,
          timing: {
            requestedAt,
            respondedAt,
            durationMs: new Date(respondedAt).getTime() - new Date(requestedAt).getTime(),
          },
          apiDetails: {
            model: 'mock',
            isMockMode: true,
          },
          stageContext: mockResult.debugContext.stageContext,
        };

        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: mockResult.content,
          timestamp: new Date().toISOString(),
          debugContext,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else if (!apiKeyConfig.hasKey) {
        throw new Error('No API key configured. Please add your Anthropic API key to use the chat.');
      } else {
        // Build conversation history
        const conversationHistory: AnthropicMessage[] = [
          ...messages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: formatMessageForApi(m.content, m.attachments),
          })),
          { role: 'user', content: formatMessageForApi(content.trim(), attachments) },
        ];

        const systemPrompt = buildContext();

        // Stream from Anthropic
        finalContent = await streamToAnthropic({
          messages: conversationHistory,
          systemPrompt,
          signal: streamControllerRef.current?.signal,
          callbacks: {
            onToken: (token) => {
              setStreamingState((prev) => ({
                ...prev,
                streamingContent: prev.streamingContent + token,
              }));
            },
            onThinking: (thinking) => {
              thinkingContent = (thinkingContent || '') + thinking;
              setStreamingState((prev) => ({
                ...prev,
                thinkingContent: (prev.thinkingContent || '') + thinking,
              }));
            },
            onToolStart: (tool) => {
              toolCalls.push(tool);
              setStreamingState((prev) => ({
                ...prev,
                activeToolCalls: [...prev.activeToolCalls, tool],
              }));
            },
            onToolUpdate: (toolId, update) => {
              const idx = toolCalls.findIndex((t) => t.id === toolId);
              if (idx >= 0) {
                toolCalls[idx] = { ...toolCalls[idx], ...update };
              }
              setStreamingState((prev) => ({
                ...prev,
                activeToolCalls: prev.activeToolCalls.map((t) =>
                  t.id === toolId ? { ...t, ...update } : t
                ),
              }));
            },
            onError: (err) => {
              setError(err.message);
            },
          },
        });

        // Build debug context
        const respondedAt = new Date().toISOString();

        const debugContext: MessageDebugContext = {
          pro: activePro ? {
            id: activePro.id,
            companyName: activePro.companyName,
            ownerName: activePro.ownerName,
            plan: activePro.plan,
            goal: activePro.goal,
          } : undefined,
          systemPrompt: {
            mode,
            fullPrompt: systemPrompt,
            promptLength: systemPrompt.length,
          },
          timing: {
            requestedAt,
            respondedAt,
            durationMs: new Date(respondedAt).getTime() - new Date(requestedAt).getTime(),
          },
          apiDetails: {
            model: 'claude-sonnet-4-20250514',
            isMockMode: false,
          },
        };

        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: finalContent,
          timestamp: new Date().toISOString(),
          debugContext,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Stream was cancelled, don't show error
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setStreamingState({
        isStreaming: false,
        streamingContent: '',
        thinkingContent: null,
        activeToolCalls: [],
      });
      streamControllerRef.current = null;
    }
  }, [
    messages,
    buildContext,
    apiKeyConfig.hasKey,
    mode,
    activePro,
    features,
    getStageContext,
    formatMessageForApi,
    cancelStream,
  ]);

  /**
   * Regenerate a specific assistant message.
   */
  const regenerateResponse = useCallback(async (messageId: string) => {
    // Find the message and the preceding user message
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    // Find the preceding user message
    let userMessageIndex = -1;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMessageIndex = i;
        break;
      }
    }
    if (userMessageIndex === -1) return;

    const userMessage = messages[userMessageIndex];

    // Remove all messages from the user message onwards
    setMessages((prev) => prev.slice(0, userMessageIndex));

    // Resend with streaming
    await sendMessageStreaming(userMessage.content, userMessage.attachments);
  }, [messages, sendMessageStreaming]);

  // ---------------------------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------------------------

  const contextValue = useMemo<ChatContextValue>(
    () => ({
      messages,
      isLoading,
      error,
      mode,
      isMockMode,
      streamingState,
      apiKeyConfig,
      sendMessage,
      sendMessageStreaming,
      clearMessages,
      setApiKey,
      clearApiKey,
      retryLastMessage,
      cancelStream,
      regenerateResponse,
    }),
    [
      messages,
      isLoading,
      error,
      mode,
      isMockMode,
      streamingState,
      apiKeyConfig,
      sendMessage,
      sendMessageStreaming,
      clearMessages,
      setApiKey,
      clearApiKey,
      retryLastMessage,
      cancelStream,
      regenerateResponse,
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
