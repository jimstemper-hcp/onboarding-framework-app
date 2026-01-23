// =============================================================================
// MESSAGE BRANCH COMPONENT
// =============================================================================
// Navigate between response versions.
// Shows branch indicator and navigation controls.
// =============================================================================

import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { ResponseBranch } from '../../../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface MessageBranchProps {
  /** Available response branches */
  branches: ResponseBranch[];
  /** Index of currently active branch */
  activeBranchIndex: number;
  /** Callback when branch changes */
  onBranchChange: (index: number) => void;
  /** Compact display mode */
  compact?: boolean;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function MessageBranch({
  branches,
  activeBranchIndex,
  onBranchChange,
  compact = false,
}: MessageBranchProps) {
  if (branches.length <= 1) {
    return null;
  }

  const canGoPrev = activeBranchIndex > 0;
  const canGoNext = activeBranchIndex < branches.length - 1;

  const handlePrev = () => {
    if (canGoPrev) {
      onBranchChange(activeBranchIndex - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onBranchChange(activeBranchIndex + 1);
    }
  };

  if (compact) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Tooltip title="Previous version">
          <span>
            <IconButton
              size="small"
              onClick={handlePrev}
              disabled={!canGoPrev}
              sx={{ p: 0.5 }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            minWidth: 40,
            textAlign: 'center',
          }}
        >
          {activeBranchIndex + 1}/{branches.length}
        </Typography>

        <Tooltip title="Next version">
          <span>
            <IconButton
              size="small"
              onClick={handleNext}
              disabled={!canGoNext}
              sx={{ p: 0.5 }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        bgcolor: 'grey.50',
        borderRadius: 1,
      }}
    >
      <Tooltip title="Previous version">
        <span>
          <IconButton
            size="small"
            onClick={handlePrev}
            disabled={!canGoPrev}
          >
            <ChevronLeftIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {branches.map((_, index) => (
          <Box
            key={index}
            onClick={() => onBranchChange(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: index === activeBranchIndex ? 'primary.main' : 'grey.300',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: index === activeBranchIndex ? 'primary.dark' : 'grey.400',
              },
            }}
          />
        ))}
      </Box>

      <Tooltip title="Next version">
        <span>
          <IconButton
            size="small"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            <ChevronRightIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Typography variant="caption" color="text.secondary">
        Version {activeBranchIndex + 1} of {branches.length}
      </Typography>
    </Box>
  );
}

export default MessageBranch;
