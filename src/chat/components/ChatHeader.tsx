// =============================================================================
// CHAT HEADER COMPONENT
// =============================================================================
// Displays current mode, settings button, and clear chat action.
// =============================================================================

import { Box, Typography, IconButton, Chip, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import SchoolIcon from '@mui/icons-material/School';
import type { ChatMode } from '../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface ChatHeaderProps {
  mode: ChatMode;
  onSettingsClick: () => void;
  onClearClick: () => void;
  hasMessages: boolean;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function ChatHeader({
  mode,
  onSettingsClick,
  onClearClick,
  hasMessages,
}: ChatHeaderProps) {
  const isPlanningMode = mode === 'planning';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* Mode Indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={isPlanningMode ? <ArchitectureIcon /> : <SchoolIcon />}
          label={isPlanningMode ? 'Planning Mode' : 'Demo Mode'}
          color={isPlanningMode ? 'secondary' : 'primary'}
          size="small"
          variant="filled"
        />
        <Typography variant="body2" color="text.secondary">
          {isPlanningMode
            ? 'Reviewing prototype specs & feedback'
            : 'Onboarding assistant for active pro'}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {hasMessages && (
          <Tooltip title="Clear chat">
            <IconButton size="small" onClick={onClearClick}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="API Settings">
          <IconButton size="small" onClick={onSettingsClick}>
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default ChatHeader;
