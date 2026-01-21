// =============================================================================
// CHAT FAB (FLOATING ACTION BUTTON) COMPONENT
// =============================================================================
// Blue floating action button that opens the chat drawer.
// Only visible on the Portal view when the drawer is closed.
//
// LLM INSTRUCTIONS:
// - This component is rendered once at the app level (in App.tsx)
// - Only shows on Portal view (currentView === 'portal')
// - Hidden when chat drawer is already open
// =============================================================================

import { Fab, Zoom } from '@mui/material';
import { Chat } from '@mui/icons-material';
import { useOnboarding } from '../../context';

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function ChatFab() {
  const { currentView, isChatDrawerOpen, openChatDrawer } = useOnboarding();

  // Only show on Portal view and when drawer is closed
  const isVisible = currentView === 'portal' && !isChatDrawerOpen;

  return (
    <Zoom in={isVisible}>
      <Fab
        color="primary"
        aria-label="Open AI Assistant"
        onClick={openChatDrawer}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1050,
        }}
      >
        <Chat />
      </Fab>
    </Zoom>
  );
}

export default ChatFab;
