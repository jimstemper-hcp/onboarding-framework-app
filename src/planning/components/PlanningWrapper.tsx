// =============================================================================
// PLANNING WRAPPER COMPONENT
// =============================================================================
// Wraps any component to add a planning mode info icon.
// When planning mode is active, an info icon appears that opens the planning modal.
//
// LLM INSTRUCTIONS:
// - Wrap any view, page, modal, or component with this
// - Pass the elementId that matches a registry entry
// - The icon position can be customized with iconPosition prop
// - Example: <PlanningWrapper elementId="view-portal">...</PlanningWrapper>
// =============================================================================

import { type ReactNode } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { usePlanningMode } from '../context/PlanningContext';
import type { PlannableId } from '../types';

interface PlanningWrapperProps {
  /** The element ID from the plannable registry */
  elementId: PlannableId;
  /** The content to wrap */
  children: ReactNode;
  /** Position of the info icon */
  iconPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  /** Whether to show a subtle border when in planning mode */
  showBorder?: boolean;
  /** Custom label to show in tooltip (defaults to element name from registry) */
  label?: string;
}

export function PlanningWrapper({
  elementId,
  children,
  iconPosition = 'top-right',
  showBorder = false,
  label,
}: PlanningWrapperProps) {
  const { isPlanningMode, openElement, getElement } = usePlanningMode();

  const element = getElement(elementId);
  const displayLabel = label || element?.name || elementId;

  if (!isPlanningMode) {
    // In demo mode, just render children without any wrapper
    return <>{children}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openElement(elementId);
  };

  // Position styles for the icon
  const positionStyles: Record<string, object> = {
    'top-right': { top: 8, right: 8 },
    'top-left': { top: 8, left: 8 },
    'bottom-right': { bottom: 8, right: 8 },
    'bottom-left': { bottom: 8, left: 8 },
    inline: { position: 'relative', display: 'inline-flex' },
  };

  if (iconPosition === 'inline') {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
        {children}
        <Tooltip title={`View spec: ${displayLabel}`}>
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              color: 'primary.main',
              bgcolor: 'primary.50',
              '&:hover': {
                bgcolor: 'primary.100',
              },
            }}
          >
            <Info sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        ...(showBorder && {
          border: '1px dashed',
          borderColor: 'primary.light',
          borderRadius: 1,
        }),
      }}
    >
      {children}
      <Tooltip title={`View spec: ${displayLabel}`}>
        <IconButton
          size="small"
          onClick={handleClick}
          sx={{
            position: 'absolute',
            ...positionStyles[iconPosition],
            color: 'primary.contrastText',
            bgcolor: 'primary.main',
            boxShadow: 2,
            zIndex: 1000,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <Info sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

/**
 * Inline planning info button - use this for headers and titles.
 *
 * LLM INSTRUCTIONS:
 * - Use this for inline placement next to headings
 * - Example: <Typography>Portal View <PlanningInfoButton elementId="view-portal" /></Typography>
 */
export function PlanningInfoButton({ elementId, label }: { elementId: PlannableId; label?: string }) {
  const { isPlanningMode, openElement, getElement } = usePlanningMode();

  if (!isPlanningMode) {
    return null;
  }

  const element = getElement(elementId);
  const displayLabel = label || element?.name || elementId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openElement(elementId);
  };

  return (
    <Tooltip title={`View spec: ${displayLabel}`}>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          ml: 1,
          color: 'primary.main',
          bgcolor: 'primary.50',
          '&:hover': {
            bgcolor: 'primary.100',
          },
        }}
      >
        <Info sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>
  );
}

export default PlanningWrapper;
