// =============================================================================
// CONVERSATION SCROLL BUTTON COMPONENT
// =============================================================================
// Floating FAB that appears when scrolled up.
// Shows optional unread count badge.
// =============================================================================

import { Fab, Badge, Zoom, type SxProps, type Theme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface ConversationScrollButtonProps {
  /** Whether button is visible */
  visible: boolean;
  /** Click handler */
  onClick: () => void;
  /** Optional unread count */
  unreadCount?: number;
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Position from bottom */
  bottom?: number;
  /** Position from right */
  right?: number;
  /** Additional styles */
  sx?: SxProps<Theme>;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function ConversationScrollButton({
  visible,
  onClick,
  unreadCount = 0,
  size = 'small',
  bottom = 16,
  right = 16,
  sx,
}: ConversationScrollButtonProps) {
  return (
    <Zoom in={visible}>
      <Badge
        badgeContent={unreadCount}
        color="primary"
        max={99}
        sx={{
          position: 'absolute',
          bottom,
          right,
          zIndex: 10,
          ...sx,
        }}
      >
        <Fab
          size={size}
          onClick={onClick}
          color="default"
          aria-label="Scroll to bottom"
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'grey.100',
            },
          }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      </Badge>
    </Zoom>
  );
}

export default ConversationScrollButton;
