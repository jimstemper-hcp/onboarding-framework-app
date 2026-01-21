import { Box, AppBar, Toolbar, Typography, Container, Stack, useMediaQuery, useTheme } from '@mui/material';
import { ViewSwitcher } from './ViewSwitcher';
import { ProSelectorToolbar } from './ProSelectorToolbar';
import { PlanningModeToggle, usePlanningMode, DRAWER_WIDTH } from '../../planning';
import { CHAT_DRAWER_WIDTH } from '../../chat';
import { useOnboarding } from '../../context';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const { isPlanningMode } = usePlanningMode();
  const { isChatDrawerOpen } = useOnboarding();

  // Calculate margin for persistent drawers (only on large screens)
  // Only one drawer can push content at a time - planning takes priority
  const drawerMargin = isLargeScreen
    ? (isPlanningMode ? DRAWER_WIDTH : (isChatDrawerOpen ? CHAT_DRAWER_WIDTH : 0))
    : 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        marginRight: `${drawerMargin}px`,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      {/* Header */}
      <AppBar position="static">
        <Toolbar sx={{ minHeight: '56px !important', pt: 1.5, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flexGrow: 1 }}>
            {/* Simple logo placeholder */}
            <Box
              sx={{
                width: 28,
                height: 28,
                bgcolor: 'primary.main',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                flexShrink: 0,
              }}
            >
              H
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Typography variant="subtitle1" component="h1" sx={{ fontWeight: 700, lineHeight: 1.1, fontSize: '1rem' }}>
                Housecall Pro
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, lineHeight: 1, fontSize: '0.7rem' }}>
                Onboarding Framework Prototype
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <ProSelectorToolbar />
            <PlanningModeToggle />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* View Switcher (Tabs) */}
      <ViewSwitcher />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          py: 3,
        }}
      >
        <Container maxWidth="lg">{children}</Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 3,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Onboarding Framework Prototype • Built to demonstrate centralized onboarding context
        </Typography>
      </Box>
    </Box>
  );
}
