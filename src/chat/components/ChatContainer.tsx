// =============================================================================
// CHAT CONTAINER COMPONENT
// =============================================================================
// Main chat wrapper that composes all chat components.
// Enhanced with streaming support and AI Elements integration.
// =============================================================================

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Paper, Alert, Button, AlertTitle } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import StopIcon from '@mui/icons-material/Stop';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ApiKeyModal } from './ApiKeyModal';
import { useChat } from '../hooks/useChat';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface ChatContainerProps {
  initialPrompt?: string | null;
  onPromptConsumed?: () => void;
  /** Enable streaming mode (default: true) */
  enableStreaming?: boolean;
  /** Context-aware suggestions */
  suggestions?: string[];
}

// -----------------------------------------------------------------------------
// DEFAULT SUGGESTIONS
// -----------------------------------------------------------------------------

const defaultDemoSuggestions = [
  'How do I get started?',
  'What features are available?',
  'Help me set up my first job',
  'How do I add a customer?',
];

const defaultPlanningSuggestions = [
  'What features are in this prototype?',
  'Show me the current feedback',
  'What is the onboarding flow?',
  'Summarize the specs',
];

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function ChatContainer({
  initialPrompt,
  onPromptConsumed,
  enableStreaming = true,
  suggestions: externalSuggestions,
}: ChatContainerProps) {
  const {
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
  } = useChat();

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Use appropriate send function based on streaming preference
  const send = enableStreaming ? sendMessageStreaming : sendMessage;

  // Get suggestions based on mode
  const suggestions = useMemo(() => {
    if (externalSuggestions && externalSuggestions.length > 0) {
      return externalSuggestions;
    }
    return mode === 'planning' ? defaultPlanningSuggestions : defaultDemoSuggestions;
  }, [mode, externalSuggestions]);

  const handleSettingsOpen = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  const handleSend = useCallback(
    (content: string) => {
      send(content);
    },
    [send]
  );

  const handleSuggestionSelect = useCallback(
    (suggestion: string) => {
      send(suggestion);
    },
    [send]
  );

  const handleRegenerate = useCallback(
    (messageId: string) => {
      regenerateResponse(messageId);
    },
    [regenerateResponse]
  );

  // Track if we've already sent the initial prompt to prevent duplicate sends
  const initialPromptSentRef = useRef(false);

  // Auto-send initial prompt when provided
  useEffect(() => {
    if (initialPrompt && !isLoading && !initialPromptSentRef.current) {
      initialPromptSentRef.current = true;
      send(initialPrompt);
      onPromptConsumed?.();
    }
  }, [initialPrompt, isLoading, send, onPromptConsumed]);

  // Reset the ref when initialPrompt changes to null
  useEffect(() => {
    if (!initialPrompt) {
      initialPromptSentRef.current = false;
    }
  }, [initialPrompt]);

  // In demo mode, we can use mock responses without an API key
  // In planning mode, we need an API key
  const needsApiKey = mode === 'planning' && !apiKeyConfig.hasKey;
  const isStreaming = streamingState?.isStreaming ?? false;
  const isDisabled = isLoading || needsApiKey;

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0, // Important: allows flex child to shrink below content size
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <ChatHeader
        mode={mode}
        isMockMode={isMockMode}
        onSettingsClick={handleSettingsOpen}
        onClearClick={clearMessages}
        hasMessages={messages.length > 0}
      />

      {/* API Key Warning - only show in planning mode */}
      {needsApiKey && (
        <Alert
          severity="warning"
          sx={{ m: 2, mb: 0 }}
          action={
            <Button color="inherit" size="small" onClick={handleSettingsOpen}>
              Configure
            </Button>
          }
        >
          <AlertTitle>API Key Required</AlertTitle>
          Planning mode requires an Anthropic API key. Demo mode works without one.
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert
          severity="error"
          sx={{ m: 2, mb: 0 }}
          action={
            isStreaming ? (
              <Button
                color="inherit"
                size="small"
                startIcon={<StopIcon />}
                onClick={cancelStream}
              >
                Stop
              </Button>
            ) : (
              <Button
                color="inherit"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={retryLastMessage}
              >
                Retry
              </Button>
            )
          }
        >
          {error}
        </Alert>
      )}

      {/* Messages */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        mode={mode}
        streamingState={streamingState}
        onRegenerate={handleRegenerate}
        onSelectSuggestion={handleSuggestionSelect}
        suggestions={suggestions}
      />

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isDisabled}
        placeholder={
          needsApiKey
            ? 'Configure API key for planning mode...'
            : isLoading
              ? 'Waiting for response...'
              : mode === 'planning'
                ? 'Ask about specs, features, or feedback...'
                : 'Ask about your onboarding journey...'
        }
      />

      {/* Settings Modal */}
      <ApiKeyModal
        open={settingsOpen}
        onClose={handleSettingsClose}
        apiKeyConfig={apiKeyConfig}
        onSaveKey={setApiKey}
        onClearKey={clearApiKey}
      />
    </Paper>
  );
}

export default ChatContainer;
