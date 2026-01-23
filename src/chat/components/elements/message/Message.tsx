// =============================================================================
// MESSAGE COMPONENT
// =============================================================================
// Base message wrapper with role-specific alignment and styling.
// Provides consistent layout for user and assistant messages.
// =============================================================================

import { Box, Avatar, type SxProps, type Theme } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface MessageProps {
  /** Message role for styling */
  role: 'user' | 'assistant';
  /** Message content */
  children: ReactNode;
  /** Optional avatar override */
  avatar?: ReactNode;
  /** Hide avatar */
  hideAvatar?: boolean;
  /** Additional styles */
  sx?: SxProps<Theme>;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Message({
  role,
  children,
  avatar,
  hideAvatar = false,
  sx,
}: MessageProps) {
  const isUser = role === 'user';

  const defaultAvatar = isUser ? (
    <PersonIcon fontSize="small" />
  ) : (
    <SmartToyIcon fontSize="small" />
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1.5,
        mb: 2,
        ...sx,
      }}
    >
      {/* Avatar */}
      {!hideAvatar && (
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            width: 36,
            height: 36,
          }}
        >
          {avatar || defaultAvatar}
        </Avatar>
      )}

      {/* Message content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '75%',
          gap: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Message;
