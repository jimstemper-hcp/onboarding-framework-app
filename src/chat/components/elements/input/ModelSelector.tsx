// =============================================================================
// MODEL SELECTOR COMPONENT
// =============================================================================
// Model picker dropdown for selecting AI model.
// Shows model name, description, and capability badges.
// =============================================================================

import { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CheckIcon from '@mui/icons-material/Check';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  capabilities?: string[];
  icon?: 'smart' | 'fast' | 'thinking';
  recommended?: boolean;
}

export interface ModelSelectorProps {
  /** Available models */
  models: ModelOption[];
  /** Currently selected model ID */
  selectedModel: string;
  /** Selection change callback */
  onModelChange: (modelId: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Compact display */
  compact?: boolean;
}

// -----------------------------------------------------------------------------
// ICON MAPPING
// -----------------------------------------------------------------------------

const iconMap = {
  smart: <AutoAwesomeIcon fontSize="small" />,
  fast: <SpeedIcon fontSize="small" />,
  thinking: <PsychologyIcon fontSize="small" />,
};

// -----------------------------------------------------------------------------
// DEFAULT MODELS
// -----------------------------------------------------------------------------

export const DEFAULT_MODELS: ModelOption[] = [
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    description: 'Best balance of speed and intelligence',
    capabilities: ['Fast', 'Smart'],
    icon: 'smart',
    recommended: true,
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    description: 'Fastest responses',
    capabilities: ['Fastest'],
    icon: 'fast',
  },
  {
    id: 'claude-opus-4-20250514',
    name: 'Claude Opus 4',
    description: 'Most capable for complex tasks',
    capabilities: ['Smartest', 'Thinking'],
    icon: 'thinking',
  },
];

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function ModelSelector({
  models = DEFAULT_MODELS,
  selectedModel,
  onModelChange,
  disabled = false,
  compact = false,
}: ModelSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const selectedOption = models.find(m => m.id === selectedModel) || models[0];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (modelId: string) => {
    onModelChange(modelId);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={disabled}
        variant="outlined"
        size="small"
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          textTransform: 'none',
          justifyContent: 'space-between',
          minWidth: compact ? 'auto' : 180,
          color: 'text.primary',
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'transparent',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {selectedOption.icon && iconMap[selectedOption.icon]}
          <Typography variant="body2" noWrap>
            {compact ? selectedOption.name.split(' ')[0] : selectedOption.name}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { minWidth: 280, mt: 0.5 },
        }}
      >
        {models.map((model, index) => (
          <Box key={model.id}>
            {index > 0 && <Divider />}
            <MenuItem
              onClick={() => handleSelect(model.id)}
              selected={model.id === selectedModel}
              sx={{
                py: 1.5,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <ListItemIcon sx={{ mt: 0.25 }}>
                {model.icon ? iconMap[model.icon] : <AutoAwesomeIcon fontSize="small" />}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {model.name}
                    </Typography>
                    {model.recommended && (
                      <Chip
                        label="Recommended"
                        size="small"
                        color="primary"
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {model.description}
                    </Typography>
                    {model.capabilities && model.capabilities.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        {model.capabilities.map(cap => (
                          <Chip
                            key={cap}
                            label={cap}
                            size="small"
                            variant="outlined"
                            sx={{ height: 16, fontSize: '0.6rem' }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                }
              />

              {model.id === selectedModel && (
                <CheckIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
              )}
            </MenuItem>
          </Box>
        ))}
      </Menu>
    </>
  );
}

export default ModelSelector;
