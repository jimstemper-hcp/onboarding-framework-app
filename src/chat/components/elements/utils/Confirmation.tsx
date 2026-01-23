// =============================================================================
// CONFIRMATION COMPONENT
// =============================================================================
// Action confirmation dialog for destructive actions.
// Uses MUI Dialog with customizable actions.
// =============================================================================

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface ConfirmationProps {
  /** Whether dialog is open */
  open: boolean;
  /** Close callback */
  onClose: () => void;
  /** Confirm callback */
  onConfirm: () => void;
  /** Dialog title */
  title?: string;
  /** Dialog message */
  message?: string | ReactNode;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button color */
  confirmColor?: 'primary' | 'error' | 'warning' | 'success';
  /** Show warning icon */
  showIcon?: boolean;
  /** Disable confirm button */
  confirmDisabled?: boolean;
  /** Loading state for confirm button */
  isLoading?: boolean;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Confirmation({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  showIcon = true,
  confirmDisabled = false,
  isLoading = false,
}: ConfirmationProps) {
  const handleConfirm = () => {
    if (!isLoading && !confirmDisabled) {
      onConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showIcon && (
              <WarningAmberIcon
                color={confirmColor === 'error' ? 'error' : 'warning'}
              />
            )}
            <Typography variant="h6" component="span">
              {title}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="close"
            sx={{ ml: 2 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {typeof message === 'string' ? (
          <DialogContentText id="confirmation-dialog-description">
            {message}
          </DialogContentText>
        ) : (
          <Box id="confirmation-dialog-description">{message}</Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          color={confirmColor}
          variant="contained"
          disabled={confirmDisabled || isLoading}
          autoFocus
        >
          {isLoading ? 'Loading...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Confirmation;
