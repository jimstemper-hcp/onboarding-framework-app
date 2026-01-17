import { Box, Typography, Paper, Alert } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export function AdminView() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AdminPanelSettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4">Admin Management</Typography>
          <Typography variant="subtitle2">
            Manage onboarding content for all features and stages
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This view allows the content team to manage the onboarding context repository.
        Changes made here will reflect in all other views.
      </Alert>

      <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6" gutterBottom>
          Coming Soon
        </Typography>
        <Typography>
          Feature list, stage editors, and content management tools will appear here.
        </Typography>
      </Paper>
    </Box>
  );
}
