// =============================================================================
// MESSAGE RESPONSE COMPONENT
// =============================================================================
// Markdown rendering with streaming support.
// Displays assistant responses with progressive text appearance.
// =============================================================================

import { Box, Typography, Skeleton } from '@mui/material';
import { MarkdownRenderer } from '../../MarkdownRenderer';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface MessageResponseProps {
  /** Content to render (plain text or markdown) */
  content: string;
  /** Whether content is currently streaming */
  isStreaming?: boolean;
  /** Show cursor during streaming */
  showCursor?: boolean;
  /** Use plain text instead of markdown */
  plainText?: boolean;
}

// -----------------------------------------------------------------------------
// STREAMING CURSOR
// -----------------------------------------------------------------------------

function StreamingCursor() {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        width: '2px',
        height: '1em',
        bgcolor: 'text.primary',
        ml: 0.5,
        animation: 'blink 1s step-end infinite',
        '@keyframes blink': {
          '0%, 50%': { opacity: 1 },
          '51%, 100%': { opacity: 0 },
        },
      }}
    />
  );
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function MessageResponse({
  content,
  isStreaming = false,
  showCursor = true,
  plainText = false,
}: MessageResponseProps) {
  // Show skeleton if streaming but no content yet
  if (isStreaming && !content) {
    return (
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="70%" />
      </Box>
    );
  }

  if (plainText) {
    return (
      <Typography
        variant="body1"
        component="div"
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {content}
        {isStreaming && showCursor && <StreamingCursor />}
      </Typography>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <MarkdownRenderer content={content} isUserMessage={false} />
      {isStreaming && showCursor && (
        <Box
          component="span"
          sx={{
            display: 'inline',
            position: 'absolute',
            bottom: 0,
          }}
        >
          <StreamingCursor />
        </Box>
      )}
    </Box>
  );
}

export default MessageResponse;
