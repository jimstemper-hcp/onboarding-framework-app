// =============================================================================
// PLAN COMPONENT
// =============================================================================
// Multi-step plan visualization using MUI Stepper.
// Shows progress through a sequence of steps.
// =============================================================================

import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Paper,
  CircularProgress,
  Collapse,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';
import type { PlanStep } from '../../../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface PlanProps {
  /** Plan steps */
  steps: PlanStep[];
  /** Active step index (0-based) */
  activeStep?: number;
  /** Orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Compact display */
  compact?: boolean;
  /** Title */
  title?: string;
}

// -----------------------------------------------------------------------------
// STEP ICON COMPONENT
// -----------------------------------------------------------------------------

interface StepIconProps {
  status: PlanStep['status'];
}

function StepIcon({ status }: StepIconProps) {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon color="success" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'in_progress':
      return <CircularProgress size={24} />;
    default:
      return (
        <RadioButtonUncheckedIcon
          sx={{ color: 'grey.400' }}
        />
      );
  }
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Plan({
  steps,
  activeStep,
  orientation = 'vertical',
  compact = false,
  title = 'Plan',
}: PlanProps) {
  const [expanded, setExpanded] = useState(!compact);

  if (steps.length === 0) {
    return null;
  }

  // Calculate active step from status if not provided
  const calculatedActiveStep = activeStep ?? steps.findIndex(
    (s) => s.status === 'in_progress' || s.status === 'pending'
  );

  const completedCount = steps.filter((s) => s.status === 'completed').length;

  // Compact header only
  if (compact && !expanded) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {completedCount}/{steps.length} completed
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setExpanded(true)}>
          <ExpandMoreIcon />
        </IconButton>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      {compact && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            {title}
          </Typography>
          <IconButton size="small" onClick={() => setExpanded(false)}>
            <ExpandLessIcon />
          </IconButton>
        </Box>
      )}

      <Collapse in={expanded || !compact}>
        <Stepper
          activeStep={calculatedActiveStep}
          orientation={orientation}
          sx={{
            '& .MuiStepConnector-line': {
              minHeight: orientation === 'vertical' ? 20 : undefined,
            },
          }}
        >
          {steps.map((step) => (
            <Step key={step.id} completed={step.status === 'completed'}>
              <StepLabel
                StepIconComponent={() => (
                  <StepIcon status={step.status} />
                )}
                error={step.status === 'error'}
              >
                <Typography
                  variant="body2"
                  fontWeight={step.status === 'in_progress' ? 600 : 400}
                  color={
                    step.status === 'error'
                      ? 'error'
                      : step.status === 'completed'
                      ? 'text.secondary'
                      : 'text.primary'
                  }
                >
                  {step.title}
                </Typography>
              </StepLabel>

              {orientation === 'vertical' && step.description && (
                <StepContent>
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepContent>
              )}
            </Step>
          ))}
        </Stepper>
      </Collapse>
    </Paper>
  );
}

export default Plan;
