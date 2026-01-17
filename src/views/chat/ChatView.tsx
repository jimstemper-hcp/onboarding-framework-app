import { Box, Typography, Paper, Alert } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

export function ChatView() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <ChatIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4">AI Chat Assistant</Typography>
          <Typography variant="subtitle2">
            Contextual AI help powered by onboarding data
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This AI assistant knows which features the pro has and their current stage.
        It provides contextual help and can guide them through onboarding.
      </Alert>

      <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6" gutterBottom>
          Coming Soon
        </Typography>
        <Typography>
          Chat interface, feature detection, and stage-aware responses will appear here.
        </Typography>
      </Paper>
    </Box>
  );
}
