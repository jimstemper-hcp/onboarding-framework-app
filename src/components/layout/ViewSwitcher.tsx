import { Tabs, Tab, Box } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { useOnboarding } from '../../context';
import type { ViewType } from '../../types';

interface ViewConfig {
  id: ViewType;
  label: string;
  sublabel: string;
  icon: React.ReactElement;
}

const views: ViewConfig[] = [
  {
    id: 'admin',
    label: '@HCP',
    sublabel: 'Context Manager',
    icon: <AdminPanelSettingsIcon />,
  },
  {
    id: 'frontline',
    label: 'Org Insights',
    sublabel: 'Admin Panel',
    icon: <SupportAgentIcon />,
  },
  {
    id: 'portal',
    label: 'Housecall Pro',
    sublabel: 'Web',
    icon: <PersonIcon />,
  },
  {
    id: 'chat',
    label: 'AI Chat',
    sublabel: 'Assistant',
    icon: <ChatIcon />,
  },
  {
    id: 'sample-pros',
    label: 'Sample Pros',
    sublabel: 'Configurations',
    icon: <SettingsApplicationsIcon />,
  },
];

export function ViewSwitcher() {
  const { currentView, setCurrentView } = useOnboarding();

  const handleChange = (_event: React.SyntheticEvent, newValue: ViewType) => {
    setCurrentView(newValue);
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        px: 2,
      }}
    >
      <Tabs
        value={currentView}
        onChange={handleChange}
        variant="fullWidth"
        sx={{
          maxWidth: 800,
          mx: 'auto',
          '& .MuiTab-root': {
            py: 2,
          },
        }}
      >
        {views.map((view) => (
          <Tab
            key={view.id}
            value={view.id}
            icon={view.icon}
            label={
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{view.label}</Box>
                <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>
                  {view.sublabel}
                </Box>
              </Box>
            }
            sx={{
              '&.Mui-selected': {
                color: 'primary.main',
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
