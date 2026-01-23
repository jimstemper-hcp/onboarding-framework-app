// =============================================================================
// MESSAGE LIST COMPONENT
// =============================================================================
// Scrollable container for chat messages with auto-scroll behavior.
// Enhanced with AI Elements for streaming, suggestions, and scroll controls.
// =============================================================================

import { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import {
  ConversationScrollButton,
  Suggestions,
  Shimmer,
} from './elements';
import type { ChatMessage, ChatMode, StreamingState } from '../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  mode: ChatMode;
  /** Streaming state for the current response */
  streamingState?: StreamingState;
  /** Callback to regenerate a message */
  onRegenerate?: (messageId: string) => void;
  /** Callback when a suggestion is selected */
  onSelectSuggestion?: (suggestion: string) => void;
  /** Context-aware suggestions to show */
  suggestions?: string[];
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function MessageList({
  messages,
  isLoading,
  mode,
  streamingState,
  onRegenerate,
  onSelectSuggestion,
  suggestions = [],
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Check if scrolled to bottom
  const checkIsAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= 100;
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    setIsAtBottom(checkIsAtBottom());
  }, [checkIsAtBottom]);

  // Auto-scroll to bottom when new messages arrive (if at bottom)
  useEffect(() => {
    if (isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, streamingState?.streamingContent, isAtBottom]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsAtBottom(true);
  }, []);

  // Determine if streaming (last message is being streamed)
  const isStreaming = streamingState?.isStreaming ?? false;
  const lastMessage = messages[messages.length - 1];
  const isLastMessageStreaming = isStreaming && lastMessage?.role === 'assistant';

  // Show suggestions after assistant messages when not loading
  const showSuggestions = !isLoading && !isStreaming &&
    messages.length > 0 &&
    lastMessage?.role === 'assistant' &&
    suggestions.length > 0 &&
    onSelectSuggestion;

  // Empty state
  if (messages.length === 0 && !isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          color: 'text.secondary',
        }}
      >
        <ChatBubbleOutlineIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
        <Typography variant="h6" gutterBottom>
          Start a conversation
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ maxWidth: 400 }}>
          {mode === 'planning'
            ? 'Ask questions about the prototype, specs, features, or collected feedback.'
            : 'Ask questions about your features, get help with setup, or learn best practices.'}
        </Typography>

        {/* Show initial suggestions if available */}
        {suggestions.length > 0 && onSelectSuggestion && (
          <Box sx={{ mt: 4 }}>
            <Suggestions
              suggestions={suggestions}
              onSelect={onSelectSuggestion}
              label="Try asking"
            />
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Messages */}
      {messages.map((message, index) => {
        const isThisMessageStreaming = isLastMessageStreaming && index === messages.length - 1;

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isThisMessageStreaming}
            streamingState={isThisMessageStreaming ? streamingState : undefined}
            onRegenerate={
              message.role === 'assistant' && onRegenerate
                ? () => onRegenerate(message.id)
                : undefined
            }
          />
        );
      })}

      {/* Loading indicator (when waiting for response, not streaming yet) */}
      {isLoading && !isStreaming && (
        <Shimmer variant="message" />
      )}

      {/* Typing indicator during streaming */}
      {isStreaming && streamingState?.streamingContent === '' && (
        <TypingIndicator />
      )}

      {/* Suggestions after assistant response */}
      {showSuggestions && (
        <Suggestions
          suggestions={suggestions}
          onSelect={onSelectSuggestion!}
          label="Continue with"
        />
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />

      {/* Scroll to bottom button */}
      <ConversationScrollButton
        visible={!isAtBottom}
        onClick={scrollToBottom}
        bottom={24}
        right={24}
      />
    </Box>
  );
}

export default MessageList;
