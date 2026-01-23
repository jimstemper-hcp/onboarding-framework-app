// =============================================================================
// CHAIN OF THOUGHT COMPONENT
// =============================================================================
// Extended reasoning display with step-by-step breakdown.
// Alternative to Reasoning for more detailed thinking visualization.
// =============================================================================

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Divider,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { MarkdownRenderer } from '../../MarkdownRenderer';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface ThoughtStep {
  id: string;
  content: string;
  label?: string;
}

export interface ChainOfThoughtProps {
  /** Array of thought steps or single content string */
  steps: ThoughtStep[] | string;
  /** Whether thinking is currently streaming */
  isStreaming?: boolean;
  /** Default expanded state */
  defaultOpen?: boolean;
  /** Title */
  title?: string;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function ChainOfThought({
  steps,
  isStreaming = false,
  defaultOpen = false,
  title = 'Chain of Thought',
}: ChainOfThoughtProps) {
  const [expanded, setExpanded] = useState(defaultOpen || isStreaming);

  // Handle both string and array formats
  const thoughtSteps: ThoughtStep[] = typeof steps === 'string'
    ? [{ id: '1', content: steps }]
    : steps;

  if (thoughtSteps.length === 0 && !isStreaming) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        bgcolor: 'grey.50',
        mb: 1,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'grey.100',
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
            <CircularProgress size={18} color="inherit" />
          ) : (
            <PsychologyIcon fontSize="small" />
          )}
          <Typography variant="body2" fontWeight={500}>
            {isStreaming ? `${title}...` : title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {thoughtSteps.length} step{thoughtSteps.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Content */}
      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ p: 2 }}>
          {thoughtSteps.map((step, index) => (
            <Box
              key={step.id}
              sx={{
                mb: index < thoughtSteps.length - 1 ? 2 : 0,
              }}
            >
              {step.label && (
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mb: 0.5,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  >
                    {index + 1}
                  </Box>
                  {step.label}
                </Typography>
              )}

              <Box
                sx={{
                  pl: step.label ? 3 : 0,
                  borderLeft: step.label ? 2 : 0,
                  borderColor: 'grey.300',
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              >
                <MarkdownRenderer content={step.content} isUserMessage={false} />
              </Box>
            </Box>
          ))}

          {isStreaming && thoughtSteps.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Processing...
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}

export default ChainOfThought;
