// =============================================================================
// CHAT CONTAINER COMPONENT
// =============================================================================
// Main chat wrapper that composes all chat components.
// Handles the overall layout and error display.
// =============================================================================

import { useState, useCallback } from 'react';
import { Box, Paper, Alert, Button, AlertTitle } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ApiKeyModal } from './ApiKeyModal';
import { useChat } from '../hooks/useChat';

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function ChatContainer() {
  const {
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
  } = useChat();

  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSettingsOpen = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  const handleSend = useCallback(
    (content: string) => {
      sendMessage(content);
    },
    [sendMessage]
  );

  // Determine if chat should be disabled
  const isDisabled = isLoading || !apiKeyConfig.hasKey;

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 200px)',
        minHeight: 400,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <ChatHeader
        mode={mode}
        onSettingsClick={handleSettingsOpen}
        onClearClick={clearMessages}
        hasMessages={messages.length > 0}
      />

      {/* API Key Warning */}
      {!apiKeyConfig.hasKey && (
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
          Please configure your Anthropic API key to use the chat assistant.
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert
          severity="error"
          sx={{ m: 2, mb: 0 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={retryLastMessage}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} mode={mode} />

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isDisabled}
        placeholder={
          !apiKeyConfig.hasKey
            ? 'Configure API key to start chatting...'
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
