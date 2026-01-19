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
          gap: 0.75,
          bgcolor: isPlanningMode ? '#7C3AED' : 'rgba(255,255,255,0.15)',
          border: '1px solid',
          borderColor: isPlanningMode ? '#7C3AED' : 'rgba(255,255,255,0.3)',
          borderRadius: 1.5,
          px: 1.5,
          py: 0.25,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: isPlanningMode ? '#6D28D9' : 'rgba(255,255,255,0.25)',
            borderColor: isPlanningMode ? '#6D28D9' : 'rgba(255,255,255,0.5)',
          },
        }}
        onClick={togglePlanningMode}
      >
        {isPlanningMode ? (
          <Architecture sx={{ fontSize: 16, color: 'white' }} />
        ) : (
          <PlayArrow sx={{ fontSize: 16, color: 'white' }} />
        )}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'white',
            userSelect: 'none',
            letterSpacing: 0.5,
          }}
        >
          {isPlanningMode ? 'PLANNING' : 'DEMO'}
        </Typography>
        <Switch
          size="small"
          checked={isPlanningMode}
          onChange={togglePlanningMode}
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: 32,
            height: 18,
            p: 0,
            '& .MuiSwitch-switchBase': {
              p: 0,
              m: '2px',
              '&.Mui-checked': {
                transform: 'translateX(14px)',
                color: 'white',
                '& + .MuiSwitch-track': {
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  opacity: 1,
                },
              },
            },
            '& .MuiSwitch-thumb': {
              width: 14,
              height: 14,
              bgcolor: 'white',
            },
            '& .MuiSwitch-track': {
              borderRadius: 9,
              backgroundColor: 'rgba(255,255,255,0.3)',
              opacity: 1,
            },
          }}
        />
      </Box>
    </Tooltip>
  );
}

export default PlanningModeToggle;
