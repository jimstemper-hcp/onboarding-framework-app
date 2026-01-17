import { Box, Typography, Paper, Alert } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export function FrontlineView() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <SupportAgentIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4">Frontline Rep View</Typography>
          <Typography variant="subtitle2">
            See customer progress and get stage-appropriate talking points
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This view helps support and success teams understand where each pro is in their
        onboarding journey and provides relevant talking points.
      </Alert>

      <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6" gutterBottom>
          Coming Soon
        </Typography>
        <Typography>
          Pro selector, progress dashboard, and talking points panel will appear here.
        </Typography>
      </Paper>
    </Box>
  );
}
