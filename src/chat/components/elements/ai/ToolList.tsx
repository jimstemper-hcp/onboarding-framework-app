// =============================================================================
// TOOL LIST COMPONENT
// =============================================================================
// Container for multiple tool call visualizations.
// Shows summary when collapsed, full list when expanded.
// =============================================================================

import { useState } from 'react';
import { Box, Button, Typography, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Tool } from './Tool';
import type { ToolCall } from '../../../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface ToolListProps {
  /** List of tool calls to display */
  tools: ToolCall[];
  /** Callback to retry a specific tool */
  onRetryTool?: (toolId: string) => void;
  /** Default expanded state */
  defaultExpanded?: boolean;
  /** Collapse tools when count exceeds this */
  collapseThreshold?: number;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function ToolList({
  tools,
  onRetryTool,
  defaultExpanded = true,
  collapseThreshold = 3,
}: ToolListProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || tools.length <= collapseThreshold);

  if (tools.length === 0) {
    return null;
  }

  const completedCount = tools.filter((t) => t.status === 'completed').length;
  const errorCount = tools.filter((t) => t.status === 'error').length;
  const runningCount = tools.filter((t) => t.status === 'running' || t.status === 'pending').length;

  // Show all tools if count is below threshold
  if (tools.length <= collapseThreshold) {
    return (
      <Box sx={{ my: 1 }}>
        {tools.map((tool) => (
          <Tool
            key={tool.id}
            tool={tool}
            onRetry={onRetryTool ? () => onRetryTool(tool.id) : undefined}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ my: 1 }}>
      {/* Summary header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1,
          bgcolor: 'grey.50',
          borderRadius: 1,
          mb: expanded ? 1 : 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" fontWeight={500}>
            {tools.length} tools executed
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {completedCount > 0 && (
              <Typography variant="caption" color="success.main">
                {completedCount} completed
              </Typography>
            )}
            {runningCount > 0 && (
              <Typography variant="caption" color="primary.main">
                {runningCount} running
              </Typography>
            )}
            {errorCount > 0 && (
              <Typography variant="caption" color="error.main">
                {errorCount} failed
              </Typography>
            )}
          </Box>
        </Box>

        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {expanded ? 'Hide' : 'Show'}
        </Button>
      </Box>

      {/* Tool list */}
      <Collapse in={expanded}>
        {tools.map((tool) => (
          <Tool
            key={tool.id}
            tool={tool}
            onRetry={onRetryTool ? () => onRetryTool(tool.id) : undefined}
          />
        ))}
      </Collapse>
    </Box>
  );
}

export default ToolList;
