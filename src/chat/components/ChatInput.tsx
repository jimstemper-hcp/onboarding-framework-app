// =============================================================================
// CHAT INPUT COMPONENT
// =============================================================================
// Multi-line text input with send button.
// Supports Enter to send, Shift+Enter for new line.
// =============================================================================

import { useState, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import { Box, TextField, IconButton, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
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

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue('');
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'grey.50',
          },
        }}
      />
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
  );
}

export default ChatInput;
