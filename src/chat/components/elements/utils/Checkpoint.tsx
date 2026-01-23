// =============================================================================
// CHECKPOINT COMPONENT
// =============================================================================
// Progress checkpoint marker for multi-step processes.
// Shows status, label, and optional timestamp.
// =============================================================================

import { Box, Chip, Typography, type SxProps, type Theme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ErrorIcon from '@mui/icons-material/Error';
import ScheduleIcon from '@mui/icons-material/Schedule';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export type CheckpointStatus = 'pending' | 'in_progress' | 'completed' | 'error';

export interface CheckpointProps {
  /** Checkpoint label */
  label: string;
  /** Status */
  status: CheckpointStatus;
  /** Optional timestamp */
  timestamp?: string | Date;
  /** Optional description */
  description?: string;
  /** Inline display */
  inline?: boolean;
  /** Additional styles */
  sx?: SxProps<Theme>;
}

// -----------------------------------------------------------------------------
// STATUS CONFIG
// -----------------------------------------------------------------------------

const statusConfig: Record<
  CheckpointStatus,
  {
    icon: React.ReactNode;
    color: 'default' | 'primary' | 'success' | 'error';
    bgColor: string;
  }
> = {
  pending: {
    icon: <RadioButtonUncheckedIcon fontSize="small" />,
    color: 'default',
    bgColor: 'grey.100',
  },
  in_progress: {
    icon: <ScheduleIcon fontSize="small" />,
    color: 'primary',
    bgColor: 'primary.50',
  },
  completed: {
    icon: <CheckCircleIcon fontSize="small" />,
    color: 'success',
    bgColor: 'success.50',
  },
  error: {
    icon: <ErrorIcon fontSize="small" />,
    color: 'error',
    bgColor: 'error.50',
  },
};

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Checkpoint({
  label,
  status,
  timestamp,
  description,
  inline = false,
  sx,
}: CheckpointProps) {
  const config = statusConfig[status];

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  if (inline) {
    return (
      <Chip
        icon={config.icon as React.ReactElement}
        label={label}
        color={config.color}
        size="small"
        variant={status === 'completed' ? 'filled' : 'outlined'}
        sx={{
          '& .MuiChip-icon': { ml: 0.5 },
          ...sx,
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.5,
        bgcolor: config.bgColor,
        borderRadius: 1,
        ...sx,
      }}
    >
      <Box sx={{ color: `${config.color}.main`, mt: 0.25 }}>
        {config.icon}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            {label}
          </Typography>
          {formattedTime && (
            <Typography variant="caption" color="text.secondary">
              {formattedTime}
            </Typography>
          )}
        </Box>

        {description && (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Checkpoint;
