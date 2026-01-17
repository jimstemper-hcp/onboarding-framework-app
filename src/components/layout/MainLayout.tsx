import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import { ViewSwitcher } from './ViewSwitcher';
import { ConnectionIndicator } from './ConnectionIndicator';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            {/* Simple logo placeholder */}
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}
            >
              H
            </Box>
            <Box>
              <Typography variant="h6" component="h1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Housecall Pro
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1 }}>
                Onboarding Framework Prototype
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Demo Mode
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Connection Indicator */}
      <ConnectionIndicator />

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
