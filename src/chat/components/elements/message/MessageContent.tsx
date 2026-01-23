// =============================================================================
// MESSAGE CONTENT COMPONENT
// =============================================================================
// Content container with role-specific styling.
// Provides the bubble/paper wrapper for message content.
// =============================================================================

import { Paper, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface MessageContentProps {
  /** Message role for styling */
  role: 'user' | 'assistant';
  /** Content to display */
  children: ReactNode;
  /** Additional styles */
  sx?: SxProps<Theme>;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function MessageContent({
  role,
  children,
  sx,
}: MessageContentProps) {
  const isUser = role === 'user';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: isUser ? 'primary.main' : 'grey.100',
        color: isUser ? 'primary.contrastText' : 'text.primary',
        borderRadius: 2,
        borderTopLeftRadius: isUser ? 2 : 0,
        borderTopRightRadius: isUser ? 0 : 2,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

export default MessageContent;
