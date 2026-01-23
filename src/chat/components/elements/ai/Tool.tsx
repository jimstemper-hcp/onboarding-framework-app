// =============================================================================
// TOOL COMPONENT
// =============================================================================
// Tool call visualization with status states.
// Shows tool name, parameters, and result with collapsible details.
// =============================================================================

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { ToolCall, ToolCallStatus } from '../../../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface ToolProps {
  /** Tool call data */
  tool: ToolCall;
  /** Callback to retry on error */
  onRetry?: () => void;
  /** Show expanded details by default */
  defaultExpanded?: boolean;
}

// -----------------------------------------------------------------------------
// STATUS STYLING
// -----------------------------------------------------------------------------

const statusConfig: Record<ToolCallStatus, {
  color: 'default' | 'primary' | 'success' | 'error';
  icon: React.ReactNode;
  label: string;
}> = {
  pending: {
    color: 'default',
    icon: <CircularProgress size={12} />,
    label: 'Pending',
  },
  running: {
    color: 'primary',
    icon: <CircularProgress size={12} />,
    label: 'Running',
  },
  completed: {
    color: 'success',
    icon: <CheckCircleIcon fontSize="small" />,
    label: 'Completed',
  },
  error: {
    color: 'error',
    icon: <ErrorIcon fontSize="small" />,
    label: 'Error',
  },
};

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Tool({
  tool,
  onRetry,
  defaultExpanded = false,
}: ToolProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const config = statusConfig[tool.status];

  const hasDetails = Object.keys(tool.parameters).length > 0 || tool.result !== undefined || !!tool.error;

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        bgcolor: 'grey.50',
        borderColor: tool.status === 'error' ? 'error.light' : 'grey.200',
      }}
    >
      <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BuildIcon fontSize="small" color="action" />
            <Typography variant="body2" fontWeight={500}>
              {tool.name}
            </Typography>
            <Chip
              size="small"
              label={config.label}
              color={config.color}
              icon={config.icon as React.ReactElement}
              sx={{
                height: 22,
                '& .MuiChip-icon': {
                  ml: 0.5,
                },
              }}
            />
          </Box>

          {hasDetails && (
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ ml: 1 }}
            >
              {expanded ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )}
            </IconButton>
          )}
        </Box>

        {/* Collapsible Details */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 1.5 }}>
            {/* Parameters */}
            {Object.keys(tool.parameters).length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Parameters
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    mt: 0.5,
                    p: 1,
                    bgcolor: 'grey.100',
                    borderRadius: 0.5,
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: 150,
                    fontFamily: 'monospace',
                  }}
                >
                  {JSON.stringify(tool.parameters, null, 2) as string}
                </Box>
              </Box>
            )}

            {/* Result */}
            {tool.result !== undefined && (
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Result
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    mt: 0.5,
                    p: 1,
                    bgcolor: 'success.50',
                    borderRadius: 0.5,
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: 150,
                    fontFamily: 'monospace',
                    borderLeft: 2,
                    borderColor: 'success.main',
                  }}
                >
                  {typeof tool.result === 'string'
                    ? tool.result
                    : JSON.stringify(tool.result, null, 2) as string}
                </Box>
              </Box>
            )}

            {/* Error */}
            {tool.error && (
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="caption"
                  color="error"
                  fontWeight={500}
                >
                  Error
                </Typography>
                <Box
                  sx={{
                    mt: 0.5,
                    p: 1,
                    bgcolor: 'error.50',
                    borderRadius: 0.5,
                    borderLeft: 2,
                    borderColor: 'error.main',
                  }}
                >
                  <Typography variant="body2" color="error">
                    {tool.error}
                  </Typography>
                </Box>

                {onRetry && (
                  <Button
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={onRetry}
                    sx={{ mt: 1 }}
                  >
                    Retry
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default Tool;
