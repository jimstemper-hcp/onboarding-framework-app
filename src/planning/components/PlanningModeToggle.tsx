// =============================================================================
// PLANNING MODE TOGGLE COMPONENT
// =============================================================================
// Toggle switch for the app header that switches between Demo and Planning modes.
//
// LLM INSTRUCTIONS:
// - This component goes in the MainLayout AppBar
// - It shows "Demo Mode" or "Planning Mode" with a switch
// - Uses the usePlanningMode hook for state
// =============================================================================

import { Box, Switch, Typography, Tooltip } from '@mui/material';
import { Architecture, PlayArrow } from '@mui/icons-material';
import { usePlanningMode } from '../context/PlanningContext';

export function PlanningModeToggle() {
  const { isPlanningMode, togglePlanningMode } = usePlanningMode();

  return (
    <Tooltip
      title={
        isPlanningMode
          ? 'Planning Mode: Click info icons to view specs and submit feedback'
          : 'Demo Mode: Normal prototype experience'
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: isPlanningMode ? 'primary.dark' : 'action.hover',
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: isPlanningMode ? 'primary.main' : 'action.selected',
          },
        }}
        onClick={togglePlanningMode}
      >
        {isPlanningMode ? (
          <Architecture sx={{ fontSize: 18, color: 'primary.contrastText' }} />
        ) : (
          <PlayArrow sx={{ fontSize: 18, color: 'text.secondary' }} />
        )}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: isPlanningMode ? 'primary.contrastText' : 'text.secondary',
            userSelect: 'none',
          }}
        >
          {isPlanningMode ? 'Planning' : 'Demo'}
        </Typography>
        <Switch
          size="small"
          checked={isPlanningMode}
          onChange={togglePlanningMode}
          onClick={(e) => e.stopPropagation()}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: 'primary.contrastText',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: 'primary.light',
            },
          }}
        />
      </Box>
    </Tooltip>
  );
}

export default PlanningModeToggle;
