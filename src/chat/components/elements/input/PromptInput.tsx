// =============================================================================
// PROMPT INPUT COMPONENT
// =============================================================================
// Auto-resize textarea with drag-drop file support.
// Enhanced input with attachment previews and send button.
// =============================================================================

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import StopIcon from '@mui/icons-material/Stop';
import type { FileAttachment, ImageMediaType } from '../../../types';

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

const ACCEPTED_IMAGE_TYPES: ImageMediaType[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface PromptInputProps {
  /** Send callback */
  onSend: (message: string, attachments?: FileAttachment[]) => void;
  /** Stop/cancel callback */
  onStop?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Loading/streaming state */
  isLoading?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Max rows for textarea */
  maxRows?: number;
  /** Initial value */
  value?: string;
  /** External value change handler */
  onChange?: (value: string) => void;
  /** Auto focus */
  autoFocus?: boolean;
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

function isValidImageType(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type as ImageMediaType);
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function PromptInput({
  onSend,
  onStop,
  disabled = false,
  isLoading = false,
  placeholder = 'Type a message...',
  maxRows = 4,
  value: externalValue,
  onChange: externalOnChange,
  autoFocus = true,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Use controlled or uncontrolled value
  const value = externalValue !== undefined ? externalValue : internalValue;
  const setValue = externalOnChange || setInternalValue;

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, [setValue]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if ((trimmed || attachments.length > 0) && !disabled && !isLoading) {
      onSend(trimmed, attachments.length > 0 ? attachments : undefined);
      setValue('');
      attachments.forEach(att => {
        if (att.previewUrl) URL.revokeObjectURL(att.previewUrl);
      });
      setAttachments([]);
      setTimeout(() => textInputRef.current?.focus(), 10);
    }
  }, [value, attachments, disabled, isLoading, onSend, setValue]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const newAttachments: FileAttachment[] = [];

    for (const file of Array.from(files)) {
      if (!isValidImageType(file)) {
        console.warn(`Skipping ${file.name}: not a supported image type`);
        continue;
      }
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
  }, []);

  const handleFileInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments(prev => {
      const removed = prev.find(att => att.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter(att => att.id !== id);
    });
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  // Auto focus when not disabled
  useEffect(() => {
    if (!disabled && autoFocus) {
      setTimeout(() => textInputRef.current?.focus(), 50);
    }
  }, [disabled, autoFocus]);

  const canSend = (value.trim().length > 0 || attachments.length > 0) && !disabled && !isLoading;

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 2,
        borderTop: 1,
        borderColor: isDragOver ? 'primary.main' : 'divider',
        bgcolor: isDragOver ? 'primary.50' : 'background.paper',
        transition: 'all 0.2s',
        position: 'relative',
      }}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(25, 118, 210, 0.1)',
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 1,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <Typography color="primary" fontWeight={500}>
            Drop files to attach
          </Typography>
        </Box>
      )}

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
              sx={{ maxWidth: 200, '& .MuiChip-icon': { ml: 0.5 } }}
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
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {/* Attach button */}
        <Tooltip title="Attach image">
          <span>
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isLoading}
              sx={{
                alignSelf: 'flex-end',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
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
          maxRows={maxRows}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={attachments.length > 0 ? 'Add a message about the image...' : placeholder}
          disabled={disabled || isLoading}
          size="small"
          inputRef={textInputRef}
          autoFocus={autoFocus}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'grey.50',
            },
          }}
        />

        {/* Send/Stop button */}
        {isLoading && onStop ? (
          <Tooltip title="Stop generating">
            <IconButton
              color="error"
              onClick={onStop}
              sx={{
                alignSelf: 'flex-end',
                bgcolor: 'error.main',
                color: 'error.contrastText',
                '&:hover': { bgcolor: 'error.dark' },
              }}
            >
              <StopIcon />
            </IconButton>
          </Tooltip>
        ) : (
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
                  '&:hover': { bgcolor: canSend ? 'primary.dark' : 'grey.300' },
                  '&.Mui-disabled': { bgcolor: 'grey.200', color: 'grey.500' },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

export default PromptInput;
