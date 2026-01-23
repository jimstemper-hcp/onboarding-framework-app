// =============================================================================
// QUEUE COMPONENT
// =============================================================================
// Message queue indicator showing pending messages.
// Displays count badge and optional message preview.
// =============================================================================

import { Box, Badge, Typography, Tooltip, Chip } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface QueueItem {
  id: string;
  preview: string;
  timestamp?: string | Date;
}

export interface QueueProps {
  /** Number of items in queue */
  count: number;
  /** Queue items for preview */
  items?: QueueItem[];
  /** Maximum items to show in tooltip */
  maxPreviewItems?: number;
  /** Show as badge only */
  badgeOnly?: boolean;
  /** Custom label */
  label?: string;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Queue({
  count,
  items = [],
  maxPreviewItems = 3,
  badgeOnly = false,
  label = 'Queued',
}: QueueProps) {
  if (count === 0) {
    return null;
  }

  const previewItems = items.slice(0, maxPreviewItems);
  const remainingCount = Math.max(0, items.length - maxPreviewItems);

  const tooltipContent = items.length > 0 ? (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="caption" fontWeight={500}>
        {count} message{count !== 1 ? 's' : ''} queued
      </Typography>
      {previewItems.map((item, index) => (
        <Typography
          key={item.id}
          variant="caption"
          component="div"
          sx={{
            mt: 0.5,
            opacity: 0.9,
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {index + 1}. {item.preview}
        </Typography>
      ))}
      {remainingCount > 0 && (
        <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.7 }}>
          +{remainingCount} more
        </Typography>
      )}
    </Box>
  ) : (
    `${count} message${count !== 1 ? 's' : ''} queued`
  );

  if (badgeOnly) {
    return (
      <Tooltip title={tooltipContent}>
        <Badge
          badgeContent={count}
          color="primary"
          max={99}
          sx={{ cursor: 'default' }}
        >
          <HourglassEmptyIcon color="action" />
        </Badge>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltipContent}>
      <Chip
        icon={<ScheduleSendIcon fontSize="small" />}
        label={`${count} ${label}`}
        size="small"
        color="primary"
        variant="outlined"
        sx={{
          '& .MuiChip-icon': { ml: 0.5 },
        }}
      />
    </Tooltip>
  );
}

export default Queue;
