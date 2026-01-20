import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { PlanningWrapper, PlanningInfoButton, usePlanningMode } from '../../planning';
import { ChatContainer } from '../../chat';

export function ChatView() {
  const { setCurrentPage, isPlanningMode } = usePlanningMode();

  // Report current page to planning context
  useEffect(() => {
    if (isPlanningMode) {
      setCurrentPage('page-ai-chat-index');
    }
  }, [isPlanningMode, setCurrentPage]);

  return (
    <PlanningWrapper elementId="view-chat">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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

        {/* Chat Container */}
        <ChatContainer />
      </Box>
    </PlanningWrapper>
  );
}
