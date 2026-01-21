// =============================================================================
// CHAT DRAWER COMPONENT
// =============================================================================
// Right-side drawer that displays the AI Chat Assistant.
// Opens from the FAB on the Portal view or when openChatWithPrompt is called.
//
// LLM INSTRUCTIONS:
// - This drawer is rendered once at the app level (in App.tsx)
// - Uses isChatDrawerOpen from OnboardingContext to control visibility
// - Contains ChatContainer with pendingChatPrompt for auto-sending prompts
// =============================================================================

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close, SmartToy } from '@mui/icons-material';
import { useOnboarding } from '../../context';
import { ChatContainer } from './ChatContainer';

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

export const CHAT_DRAWER_WIDTH = 480;

// -----------------------------------------------------------------------------
// MAIN DRAWER
// -----------------------------------------------------------------------------

export function ChatDrawer() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const {
    isChatDrawerOpen,
    closeChatDrawer,
    pendingChatPrompt,
    clearPendingChatPrompt,
  } = useOnboarding();

  const handleClose = () => {
    closeChatDrawer();
  };

  return (
    <Drawer
      anchor="right"
      open={isChatDrawerOpen}
      variant={isSmallScreen ? 'temporary' : 'persistent'}
      onClose={handleClose}
      sx={{
        width: isChatDrawerOpen ? CHAT_DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: CHAT_DRAWER_WIDTH,
          boxSizing: 'border-box',
          zIndex: 1250, // Same as planning drawer
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <SmartToy color="primary" />
          <Typography variant="h6" component="h2">
            AI Assistant
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Close chat drawer"
          >
            <Close />
          </IconButton>
        </Box>

        {/* Chat Container */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ChatContainer
            initialPrompt={pendingChatPrompt}
            onPromptConsumed={clearPendingChatPrompt}
          />
        </Box>
      </Box>
    </Drawer>
  );
}

export default ChatDrawer;
