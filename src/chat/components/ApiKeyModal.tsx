// =============================================================================
// API KEY MODAL COMPONENT
// =============================================================================
// Modal for configuring the Anthropic API key.
// Shows environment variable status and allows user key entry.
// =============================================================================

import { useState, useCallback, type ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { isValidApiKeyFormat } from '../services/anthropicService';
import type { ApiKeyConfig } from '../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  apiKeyConfig: ApiKeyConfig;
  onSaveKey: (key: string) => void;
  onClearKey: () => void;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function ApiKeyModal({
  open,
  onClose,
  apiKeyConfig,
  onSaveKey,
  onClearKey,
}: ApiKeyModalProps) {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputKey(e.target.value);
    setError(null);
  }, []);

  const handleSave = useCallback(() => {
    const trimmedKey = inputKey.trim();

    if (!trimmedKey) {
      setError('Please enter an API key');
      return;
    }

    if (!isValidApiKeyFormat(trimmedKey)) {
      setError('Invalid API key format. Keys should start with "sk-ant-"');
      return;
    }

    onSaveKey(trimmedKey);
    setInputKey('');
    setError(null);
    onClose();
  }, [inputKey, onSaveKey, onClose]);

  const handleClear = useCallback(() => {
    onClearKey();
    setInputKey('');
    setError(null);
  }, [onClearKey]);

  const handleClose = useCallback(() => {
    setInputKey('');
    setError(null);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>API Key Settings</DialogTitle>
      <DialogContent>
        {/* Status Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Status
          </Typography>

          {apiKeyConfig.hasEnvKey ? (
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              sx={{ mb: 2 }}
            >
              Using API key from environment variable (VITE_ANTHROPIC_API_KEY)
            </Alert>
          ) : apiKeyConfig.userKey ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                icon={<CheckCircleIcon />}
                label="User-provided key configured"
                color="success"
                size="small"
              />
              <Button size="small" color="error" onClick={handleClear}>
                Remove
              </Button>
            </Box>
          ) : (
            <Alert
              severity="warning"
              icon={<WarningIcon />}
              sx={{ mb: 2 }}
            >
              No API key configured. Enter your Anthropic API key below.
            </Alert>
          )}
        </Box>

        {/* Key Input Section */}
        {!apiKeyConfig.hasEnvKey && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {apiKeyConfig.userKey ? 'Update API Key' : 'Enter API Key'}
            </Typography>

            <TextField
              fullWidth
              type="password"
              value={inputKey}
              onChange={handleInputChange}
              placeholder="sk-ant-..."
              error={Boolean(error)}
              helperText={error || 'Your key is stored locally in your browser'}
              size="small"
              sx={{ mb: 2 }}
            />

            <Typography variant="caption" color="text.secondary">
              Get your API key from{' '}
              <Box
                component="a"
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main' }}
              >
                console.anthropic.com
              </Box>
            </Typography>
          </Box>
        )}

        {apiKeyConfig.hasEnvKey && (
          <Typography variant="body2" color="text.secondary">
            The environment variable takes precedence. To use a different key,
            remove VITE_ANTHROPIC_API_KEY from your .env.local file.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {!apiKeyConfig.hasEnvKey && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!inputKey.trim()}
          >
            Save Key
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ApiKeyModal;
