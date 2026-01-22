// =============================================================================
// MESSAGE BUBBLE COMPONENT
// =============================================================================
// Renders a single chat message with role-appropriate styling.
// Uses MarkdownRenderer for assistant messages to display formatted content.
// Supports displaying image attachments.
// =============================================================================

import { Box, Paper, Typography, Avatar, ImageList, ImageListItem } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { MarkdownRenderer } from './MarkdownRenderer';
import { DebugContextDropdown } from './DebugContextDropdown';
import type { ChatMessage, FileAttachment } from '../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface MessageBubbleProps {
  message: ChatMessage;
}

// -----------------------------------------------------------------------------
// ATTACHMENT DISPLAY COMPONENT
// -----------------------------------------------------------------------------

interface AttachmentDisplayProps {
  attachments: FileAttachment[];
  isUser: boolean;
}

function AttachmentDisplay({ attachments, isUser }: AttachmentDisplayProps) {
  if (attachments.length === 0) return null;

  // Single image - show larger
  if (attachments.length === 1) {
    const att = attachments[0];
    return (
      <Box
        sx={{
          mt: 1,
          mb: 1,
          borderRadius: 1,
          overflow: 'hidden',
          maxWidth: '100%',
        }}
      >
        <Box
          component="img"
          src={att.previewUrl || `data:${att.type};base64,${att.base64Data}`}
          alt={att.name}
          sx={{
            maxWidth: '100%',
            maxHeight: 300,
            objectFit: 'contain',
            borderRadius: 1,
            display: 'block',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            opacity: 0.7,
            color: isUser ? 'inherit' : 'text.secondary',
          }}
        >
          {att.name}
        </Typography>
      </Box>
    );
  }

  // Multiple images - show in grid
  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      <ImageList
        sx={{ width: '100%', maxHeight: 300 }}
        cols={Math.min(attachments.length, 2)}
        rowHeight={140}
        gap={8}
      >
        {attachments.map(att => (
          <ImageListItem key={att.id}>
            <Box
              component="img"
              src={att.previewUrl || `data:${att.type};base64,${att.base64Data}`}
              alt={att.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mt: 0.5,
          opacity: 0.7,
          color: isUser ? 'inherit' : 'text.secondary',
        }}
      >
        {attachments.length} images attached
      </Typography>
    </Box>
  );
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const hasAttachments = message.attachments && message.attachments.length > 0;
  const showDebugContext = isAssistant && message.debugContext;

  return (
    <Box
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

      {/* Message Content */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          maxWidth: '75%',
          bgcolor: isUser ? 'primary.main' : 'grey.100',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          borderRadius: 2,
          borderTopLeftRadius: isUser ? 2 : 0,
          borderTopRightRadius: isUser ? 0 : 2,
        }}
      >
        {/* Image attachments (shown before text content) */}
        {hasAttachments && (
          <AttachmentDisplay attachments={message.attachments!} isUser={isUser} />
        )}

        {/* Message content - use markdown for assistant, plain text for user */}
        {message.content && (
          isUser ? (
            <Typography
              variant="body1"
              component="div"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {message.content}
            </Typography>
          ) : (
            <MarkdownRenderer content={message.content} isUserMessage={false} />
          )
        )}

        {/* Debug Context Dropdown - shown for assistant messages with debug context */}
        {showDebugContext && (
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
    </Box>
  );
}

export default MessageBubble;
