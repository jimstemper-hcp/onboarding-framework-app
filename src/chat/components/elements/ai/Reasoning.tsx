// =============================================================================
// REASONING COMPONENT
// =============================================================================
// Collapsible thinking/chain-of-thought display.
// Auto-expands during streaming, shows thinking icon and content.
// =============================================================================

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { MarkdownRenderer } from '../../MarkdownRenderer';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface ReasoningProps {
  /** Thinking content to display */
  content: string;
  /** Whether thinking is currently streaming */
  isStreaming?: boolean;
  /** Default expanded state */
  defaultOpen?: boolean;
  /** Custom label */
  label?: string;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Reasoning({
  content,
  isStreaming = false,
  defaultOpen = false,
  label = 'Thinking',
}: ReasoningProps) {
  const [expanded, setExpanded] = useState(defaultOpen || isStreaming);

  // Auto-expand when streaming starts, auto-collapse when done
  useEffect(() => {
    if (isStreaming) {
      setExpanded(true);
    }
  }, [isStreaming]);

  if (!content && !isStreaming) {
    return null;
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      sx={{
        bgcolor: 'grey.50',
        borderRadius: 1,
        '&:before': { display: 'none' },
        boxShadow: 'none',
        mb: 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          minHeight: 40,
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            gap: 1,
            my: 0.5,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
          }}
        >
          {isStreaming ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <PsychologyIcon fontSize="small" />
          )}
          <Typography variant="body2" fontWeight={500}>
            {isStreaming ? `${label}...` : label}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0, pb: 1.5 }}>
        <Box
          sx={{
            pl: 1,
            borderLeft: 2,
            borderColor: 'grey.300',
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}
        >
          {content ? (
            <MarkdownRenderer content={content} isUserMessage={false} />
          ) : (
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              Processing...
            </Typography>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default Reasoning;
