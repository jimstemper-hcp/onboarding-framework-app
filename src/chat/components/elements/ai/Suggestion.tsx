// =============================================================================
// SUGGESTION COMPONENT
// =============================================================================
// Clickable prompt suggestions displayed as chips.
// Context-aware suggestions based on current stage.
// =============================================================================

import { Box, Chip, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface SuggestionProps {
  /** Suggestion text */
  text: string;
  /** Callback when clicked */
  onClick: () => void;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

export interface SuggestionsProps {
  /** List of suggestions */
  suggestions: string[];
  /** Callback when a suggestion is selected */
  onSelect: (suggestion: string) => void;
  /** Optional label */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom icon for suggestions */
  icon?: React.ReactNode;
  /** Maximum suggestions to show */
  maxItems?: number;
}

// -----------------------------------------------------------------------------
// SINGLE SUGGESTION COMPONENT
// -----------------------------------------------------------------------------

export function Suggestion({
  text,
  onClick,
  icon,
  disabled = false,
}: SuggestionProps) {
  return (
    <Chip
      label={text}
      onClick={onClick}
      disabled={disabled}
      icon={icon as React.ReactElement | undefined}
      variant="outlined"
      sx={{
        maxWidth: '100%',
        height: 'auto',
        '& .MuiChip-label': {
          whiteSpace: 'normal',
          py: 1,
        },
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.2s',
        '&:hover:not(.Mui-disabled)': {
          bgcolor: 'primary.50',
          borderColor: 'primary.main',
        },
      }}
    />
  );
}

// -----------------------------------------------------------------------------
// SUGGESTIONS LIST COMPONENT
// -----------------------------------------------------------------------------

export function Suggestions({
  suggestions,
  onSelect,
  label = 'Suggested questions',
  disabled = false,
  icon,
  maxItems = 4,
}: SuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  const displaySuggestions = suggestions.slice(0, maxItems);

  return (
    <Box sx={{ my: 2 }}>
      {label && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 1,
          }}
        >
          <AutoAwesomeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {displaySuggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            text={suggestion}
            onClick={() => onSelect(suggestion)}
            icon={icon as React.ReactNode}
            disabled={disabled}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Suggestions;
