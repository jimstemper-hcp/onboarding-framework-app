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
    isMockMode,
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

  // In demo mode, we can use mock responses without an API key
  // In planning mode, we need an API key
  const needsApiKey = mode === 'planning' && !apiKeyConfig.hasKey;
  const isDisabled = isLoading || needsApiKey;

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
