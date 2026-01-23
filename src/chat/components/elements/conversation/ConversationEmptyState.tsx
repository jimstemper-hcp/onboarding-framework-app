// =============================================================================
// CONVERSATION EMPTY STATE COMPONENT
// =============================================================================
// Placeholder shown when there are no messages.
// Customizable icon, title, and description.
// =============================================================================

import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface ConversationEmptyStateProps {
  /** Custom icon */
  icon?: ReactNode;
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Action element (e.g., suggestions) */
  action?: ReactNode;
  /** Additional styles */
  sx?: SxProps<Theme>;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function ConversationEmptyState({
  icon = <ChatBubbleOutlineIcon sx={{ fontSize: 64, opacity: 0.3 }} />,
  title = 'Start a conversation',
  description = 'Send a message to begin.',
  action,
  sx,
}: ConversationEmptyStateProps) {
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
        textAlign: 'center',
        ...sx,
      }}
    >
      {icon}

      {title && (
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="body2"
          sx={{ maxWidth: 400, mb: action ? 3 : 0 }}
        >
          {description}
        </Typography>
      )}

      {action}
    </Box>
  );
}

export default ConversationEmptyState;
