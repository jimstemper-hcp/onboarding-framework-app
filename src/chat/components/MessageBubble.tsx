// =============================================================================
// MESSAGE BUBBLE COMPONENT
// =============================================================================
// Renders a single chat message with role-appropriate styling.
// Enhanced with AI Elements components for streaming, actions, and more.
// =============================================================================

import { useState } from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { DebugContextDropdown } from './DebugContextDropdown';
import {
  MessageActions,
  MessageAttachments,
  MessageResponse,
  Reasoning,
  ToolList,
  type FeedbackType,
} from './elements';
import type { ChatMessage, ToolCall, StreamingState } from '../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface MessageBubbleProps {
  message: ChatMessage;
  /** Whether this message is currently streaming */
  isStreaming?: boolean;
  /** Streaming state for progressive content display */
  streamingState?: StreamingState;
  /** Callback to regenerate this message */
  onRegenerate?: () => void;
  /** Show action buttons */
  showActions?: boolean;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function MessageBubble({
  message,
  isStreaming = false,
  streamingState,
  onRegenerate,
  showActions = true,
}: MessageBubbleProps) {
  const [showActionsOnHover, setShowActionsOnHover] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackType>(null);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const hasAttachments = message.attachments && message.attachments.length > 0;
  const showDebugContext = isAssistant && message.debugContext;

  // Get content to display (streaming or final)
  const displayContent = isStreaming && streamingState?.streamingContent
    ? streamingState.streamingContent
    : message.content;

  // Get thinking content if streaming
  const thinkingContent = isStreaming ? streamingState?.thinkingContent : null;

  // Get tool calls if streaming
  const toolCalls: ToolCall[] = isStreaming
    ? streamingState?.activeToolCalls || []
    : [];

  const handleFeedback = (newFeedback: FeedbackType) => {
    setFeedback(newFeedback);
    // Could emit this to analytics/backend
  };

  return (
    <Box
      onMouseEnter={() => setShowActionsOnHover(true)}
      onMouseLeave={() => setShowActionsOnHover(false)}
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1.5,
        mb: 2,
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
          width: 36,
          height: 36,
        }}
      >
        {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
      </Avatar>

      {/* Message Content Column */}
      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '75%', gap: 1 }}>
        {/* Thinking/Reasoning Block (for streaming) */}
        {thinkingContent && (
          <Reasoning
            content={thinkingContent}
            isStreaming={isStreaming}
            defaultOpen={true}
          />
        )}

        {/* Tool Calls (for streaming) */}
        {toolCalls.length > 0 && (
          <ToolList tools={toolCalls} />
        )}

        {/* Main Message Bubble */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: isUser ? 'primary.main' : 'grey.100',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
            borderTopLeftRadius: isUser ? 2 : 0,
            borderTopRightRadius: isUser ? 0 : 2,
          }}
        >
          {/* Image attachments (shown before text content) */}
          {hasAttachments && (
            <MessageAttachments
              attachments={message.attachments!}
              isUser={isUser}
            />
          )}

          {/* Message content - use markdown for assistant, plain text for user */}
          {displayContent && (
            isUser ? (
              <Typography
                variant="body1"
                component="div"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {displayContent}
              </Typography>
            ) : (
              <MessageResponse
                content={displayContent}
                isStreaming={isStreaming}
                showCursor={isStreaming}
              />
            )
          )}

          {/* Debug Context Dropdown - shown for assistant messages with debug context */}
          {showDebugContext && !isStreaming && (
            <DebugContextDropdown debugContext={message.debugContext!} />
          )}

          {/* Timestamp */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              opacity: 0.7,
              textAlign: isUser ? 'right' : 'left',
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Paper>

        {/* Actions (for assistant messages) */}
        {isAssistant && showActions && !isStreaming && (
          <MessageActions
            content={message.content}
            visible={showActionsOnHover || feedback !== null}
            onRegenerate={onRegenerate}
            showRegenerate={!!onRegenerate}
            showFeedback={true}
            feedback={feedback}
            onFeedback={handleFeedback}
          />
        )}
      </Box>
    </Box>
  );
}

export default MessageBubble;
