// =============================================================================
// ATTACHMENTS COMPONENT
// =============================================================================
// File attachment manager with add/remove functionality.
// Displays attachments as chips with preview thumbnails.
// =============================================================================

import { useCallback, useRef, type ChangeEvent } from 'react';
import {
  Box,
  Chip,
  Stack,
  Typography,
  Tooltip,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import type { FileAttachment, ImageMediaType } from '../../../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface AttachmentsProps {
  /** Current attachments */
  attachments: FileAttachment[];
  /** Callback when attachments change */
  onChange: (attachments: FileAttachment[]) => void;
  /** Accepted file types */
  accept?: string;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Maximum number of attachments */
  maxFiles?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Show add button */
  showAddButton?: boolean;
  /** Compact display */
  compact?: boolean;
}

// -----------------------------------------------------------------------------
// UTILITIES
// -----------------------------------------------------------------------------

async function fileToAttachment(file: File): Promise<FileAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type as ImageMediaType,
        size: file.size,
        base64Data: base64,
        previewUrl: URL.createObjectURL(file),
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Attachments({
  attachments,
  onChange,
  accept = 'image/jpeg,image/png,image/gif,image/webp',
  maxFileSize = 20 * 1024 * 1024, // 20MB
  maxFiles = 10,
  disabled = false,
  showAddButton = true,
  compact = false,
}: AttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const remainingSlots = maxFiles - attachments.length;
      const files = Array.from(e.target.files).slice(0, remainingSlots);

      const newAttachments: FileAttachment[] = [];

      for (const file of files) {
        if (file.size > maxFileSize) {
          console.warn(`Skipping ${file.name}: exceeds size limit`);
          continue;
        }

        try {
          const attachment = await fileToAttachment(file);
          newAttachments.push(attachment);
        } catch (err) {
          console.error(`Failed to process ${file.name}:`, err);
        }
      }

      if (newAttachments.length > 0) {
        onChange([...attachments, ...newAttachments]);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [attachments, maxFiles, maxFileSize, onChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      const removed = attachments.find((att) => att.id === id);
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      onChange(attachments.filter((att) => att.id !== id));
    },
    [attachments, onChange]
  );

  const canAddMore = attachments.length < maxFiles && !disabled;

  if (attachments.length === 0 && !showAddButton) {
    return null;
  }

  return (
    <Box>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        alignItems="center"
      >
        {/* Attachment chips */}
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
                    width: compact ? 20 : 24,
                    height: compact ? 20 : 24,
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
            label={
              compact ? (
                att.name.length > 12 ? att.name.slice(0, 9) + '...' : att.name
              ) : (
                <Box>
                  <Typography variant="caption" component="span">
                    {att.name.length > 20 ? att.name.slice(0, 17) + '...' : att.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{ ml: 0.5, opacity: 0.7 }}
                  >
                    ({formatFileSize(att.size)})
                  </Typography>
                </Box>
              )
            }
            onDelete={disabled ? undefined : () => handleRemove(att.id)}
            deleteIcon={<CloseIcon />}
            variant="outlined"
            size={compact ? 'small' : 'medium'}
            sx={{
              maxWidth: compact ? 150 : 250,
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />
        ))}

        {/* Add button */}
        {showAddButton && canAddMore && (
          <Tooltip title="Add attachment">
            <Paper
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: compact ? 32 : 40,
                height: compact ? 32 : 40,
                borderRadius: 1,
                borderStyle: 'dashed',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                },
              }}
            >
              <AddIcon
                fontSize={compact ? 'small' : 'medium'}
                color="action"
              />
            </Paper>
          </Tooltip>
        )}
      </Stack>

      {/* File limit info */}
      {attachments.length > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: 'block' }}
        >
          {attachments.length}/{maxFiles} files attached
        </Typography>
      )}
    </Box>
  );
}

export default Attachments;
