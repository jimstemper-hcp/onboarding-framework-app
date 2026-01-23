// =============================================================================
// MESSAGE ATTACHMENTS COMPONENT
// =============================================================================
// Display file/image attachments in messages.
// Supports single and multiple image layouts.
// =============================================================================

import { Box, Typography, ImageList, ImageListItem, Chip, Stack } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import type { FileAttachment } from '../../../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface MessageAttachmentsProps {
  /** Attachments to display */
  attachments: FileAttachment[];
  /** Whether this is a user message */
  isUser?: boolean;
  /** Compact display mode */
  compact?: boolean;
  /** Max height for images */
  maxHeight?: number;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function MessageAttachments({
  attachments,
  isUser = false,
  compact = false,
  maxHeight = 300,
}: MessageAttachmentsProps) {
  if (attachments.length === 0) {
    return null;
  }

  // Compact mode - show as chips
  if (compact) {
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
        {attachments.map((att) => (
          <Chip
            key={att.id}
            icon={
              att.previewUrl ? (
                <Box
                  component="img"
                  src={att.previewUrl}
                  alt={att.name}
                  sx={{
                    width: 20,
                    height: 20,
                    objectFit: 'cover',
                    borderRadius: 0.5,
                    ml: 0.5,
                  }}
                />
              ) : att.type.startsWith('image/') ? (
                <ImageIcon fontSize="small" />
              ) : (
                <InsertDriveFileIcon fontSize="small" />
              )
            }
            label={att.name.length > 15 ? att.name.slice(0, 12) + '...' : att.name}
            size="small"
            variant="outlined"
            sx={{ '& .MuiChip-icon': { ml: 0.5 } }}
          />
        ))}
      </Stack>
    );
  }

  // Single image - show larger
  if (attachments.length === 1) {
    const att = attachments[0];
    const imageSrc = att.previewUrl || `data:${att.type};base64,${att.base64Data}`;

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
          src={imageSrc}
          alt={att.name}
          sx={{
            maxWidth: '100%',
            maxHeight,
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
        sx={{ width: '100%', maxHeight }}
        cols={Math.min(attachments.length, 2)}
        rowHeight={140}
        gap={8}
      >
        {attachments.map((att) => {
          const imageSrc = att.previewUrl || `data:${att.type};base64,${att.base64Data}`;
          return (
            <ImageListItem key={att.id}>
              <Box
                component="img"
                src={imageSrc}
                alt={att.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            </ImageListItem>
          );
        })}
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

export default MessageAttachments;
