import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { PlanningWrapper, PlanningInfoButton, usePlanningMode } from '../../planning';
import { ChatContainer } from '../../chat';
import { useOnboarding } from '../../context';

export function ChatView() {
  const { setCurrentPage, isPlanningMode } = usePlanningMode();
  const { pendingChatPrompt, clearPendingChatPrompt } = useOnboarding();

  // Report current page to planning context
  useEffect(() => {
    if (isPlanningMode) {
      setCurrentPage('page-ai-chat-index');
    }
  }, [isPlanningMode, setCurrentPage]);

  return (
    <PlanningWrapper elementId="view-chat">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // Calculate height to fit within viewport minus header, tabs, padding, and footer
          height: 'calc(100vh - 220px)',
          minHeight: 400,
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexShrink: 0 }}>
          <ChatIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h4">AI Chat Assistant</Typography>
              <PlanningInfoButton elementId="view-chat" />
            </Box>
            <Typography variant="subtitle2" color="text.secondary">
              Contextual AI help powered by onboarding data
            </Typography>
          </Box>
        </Box>

        {/* Chat Container - fills remaining space */}
        <ChatContainer
          initialPrompt={pendingChatPrompt}
          onPromptConsumed={clearPendingChatPrompt}
        />
      </Box>
    </PlanningWrapper>
  );
}
