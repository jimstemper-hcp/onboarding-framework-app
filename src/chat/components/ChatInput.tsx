// =============================================================================
// CHAT INPUT COMPONENT
// =============================================================================
// Multi-line text input with send button and file attachment support.
// Supports Enter to send, Shift+Enter for new line.
// Supports image file attachments for vision API.
// =============================================================================

import { useState, useCallback, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { Box, TextField, IconButton, Tooltip, Chip, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import type { FileAttachment, ImageMediaType } from '../types';

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

const ACCEPTED_IMAGE_TYPES: ImageMediaType[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB limit for Anthropic vision API

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface ChatInputProps {
  onSend: (message: string, attachments?: FileAttachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

// -----------------------------------------------------------------------------
// UTILITIES
// -----------------------------------------------------------------------------

/**
 * Convert a File to a FileAttachment with base64 data.
 */
async function fileToAttachment(file: File): Promise<FileAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]; // Remove data URL prefix
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

/**
 * Check if a file is a valid image type.
 */
function isValidImageType(file: File): file is File & { type: ImageMediaType } {
  return ACCEPTED_IMAGE_TYPES.includes(file.type as ImageMediaType);
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if ((trimmed || attachments.length > 0) && !disabled) {
      onSend(trimmed, attachments.length > 0 ? attachments : undefined);
      setValue('');
      // Clean up preview URLs
      attachments.forEach(att => {
        if (att.previewUrl) {
          URL.revokeObjectURL(att.previewUrl);
        }
      });
      setAttachments([]);
      // Refocus the text input after sending with multiple attempts
      // to handle any async state updates that might steal focus
      const focusInput = () => textInputRef.current?.focus();
      focusInput();
      setTimeout(focusInput, 10);
      setTimeout(focusInput, 100);
    }
  }, [value, attachments, disabled, onSend]);

  // Refocus input when disabled changes from true to false (e.g., after loading completes)
  useEffect(() => {
    if (!disabled) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [disabled]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleFileSelect = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: FileAttachment[] = [];

    for (const file of Array.from(files)) {
      // Validate file type
      if (!isValidImageType(file)) {
        console.warn(`Skipping ${file.name}: not a supported image type`);
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        console.warn(`Skipping ${file.name}: exceeds 20MB limit`);
        continue;
      }

      try {
        const attachment = await fileToAttachment(file);
        newAttachments.push(attachment);
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
      }
    }

    setAttachments(prev => [...prev, ...newAttachments]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments(prev => {
      const removed = prev.find(att => att.id === id);
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter(att => att.id !== id);
    });
  }, []);

  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const canSend = (value.trim().length > 0 || attachments.length > 0) && !disabled;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {attachments.map(att => (
            <Chip
              key={att.id}
              icon={
                att.previewUrl ? (
                  <Box
                    component="img"
                    src={att.previewUrl}
                    alt={att.name}
                    sx={{
                      width: 24,
                      height: 24,
                      objectFit: 'cover',
                      borderRadius: 0.5,
                      ml: 0.5,
                    }}
                  />
                ) : (
                  <ImageIcon />
                )
              }
              label={att.name.length > 20 ? att.name.slice(0, 17) + '...' : att.name}
              onDelete={() => handleRemoveAttachment(att.id)}
              deleteIcon={<CloseIcon />}
              variant="outlined"
              size="small"
              sx={{
                maxWidth: 200,
                '& .MuiChip-icon': {
                  ml: 0.5,
                },
              }}
            />
          ))}
        </Stack>
      )}

      {/* Input row */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Attach button */}
        <Tooltip title="Attach image">
          <span>
            <IconButton
              onClick={handleAttachClick}
              disabled={disabled}
              sx={{
                alignSelf: 'flex-end',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <AttachFileIcon />
            </IconButton>
          </span>
        </Tooltip>

        {/* Text input */}
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={attachments.length > 0 ? 'Add a message about the image...' : placeholder}
          disabled={disabled}
          size="small"
          inputRef={textInputRef}
          autoFocus
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'grey.50',
            },
          }}
        />

        {/* Send button */}
        <Tooltip title={canSend ? 'Send message (Enter)' : ''}>
          <span>
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!canSend}
              sx={{
                alignSelf: 'flex-end',
                bgcolor: canSend ? 'primary.main' : 'grey.200',
                color: canSend ? 'primary.contrastText' : 'grey.500',
                '&:hover': {
                  bgcolor: canSend ? 'primary.dark' : 'grey.300',
                },
                '&.Mui-disabled': {
                  bgcolor: 'grey.200',
                  color: 'grey.500',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default ChatInput;
