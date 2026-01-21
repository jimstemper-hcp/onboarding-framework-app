// =============================================================================
// PLANNING AWARE DIALOG
// =============================================================================
// A Dialog wrapper that respects the planning drawer when in planning mode.
// On large screens with planning mode ON, the dialog shifts left to keep
// the planning drawer visible, allowing users to view specs while editing.
// =============================================================================

import { useEffect } from 'react';
import { Dialog, useTheme, useMediaQuery } from '@mui/material';
import type { DialogProps } from '@mui/material/Dialog';
import { usePlanningMode, DRAWER_WIDTH } from '../../planning';

interface PlanningAwareDialogProps extends DialogProps {
  plannableId?: string; // Optional: sync drawer to show this item's spec
}

export function PlanningAwareDialog({ plannableId, ...props }: PlanningAwareDialogProps) {
  const { children, sx, slotProps, ...rest } = props;
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const { isPlanningMode, setCurrentPage } = usePlanningMode();

  // When planning mode is on and screen is large, adjust dialog positioning
  const shouldAdjust = isPlanningMode && isLargeScreen;

  // When dialog opens with a plannableId, update drawer to show that spec
  useEffect(() => {
    if (props.open && plannableId && isPlanningMode) {
      setCurrentPage(plannableId);
    }
  }, [props.open, plannableId, isPlanningMode, setCurrentPage]);

  // Build backdrop props safely
  const existingBackdropProps = slotProps?.backdrop && typeof slotProps.backdrop === 'object'
    ? slotProps.backdrop
    : {};

  const backdropSx = 'sx' in existingBackdropProps
    ? existingBackdropProps.sx
    : {};

  return (
    <Dialog
      {...rest}
      sx={{
        ...sx,
        // Shift dialog container to leave room for drawer
        ...(shouldAdjust && {
          '& .MuiDialog-container': {
            marginRight: `${DRAWER_WIDTH}px`,
          },
        }),
      }}
      slotProps={{
        ...slotProps,
        backdrop: {
          ...existingBackdropProps,
          sx: {
            ...backdropSx,
            // clipPath removes the backdrop from drawer area entirely (visual + pointer events)
            ...(shouldAdjust && {
              clipPath: `inset(0 ${DRAWER_WIDTH}px 0 0)`,
            }),
          },
        },
      }}
    >
      {children}
    </Dialog>
  );
}

export default PlanningAwareDialog;
