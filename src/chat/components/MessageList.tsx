// =============================================================================
// MESSAGE LIST COMPONENT
// =============================================================================
// Scrollable container for chat messages with auto-scroll behavior.
// =============================================================================

import { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { ChatMessage, ChatMode } from '../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  mode: ChatMode;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function MessageList({ messages, isLoading, mode }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Empty state
  if (messages.length === 0 && !isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
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
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </Box>
  );
}

export default MessageList;
