import { Tabs, Tab, Box, Divider } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { useOnboarding } from '../../context';
import type { ViewType } from '../../types';

type ViewCategory = 'pro-facing' | 'internal' | 'demo';

interface ViewConfig {
  id: ViewType;
  label: string;
  sublabel: string;
  icon: React.ReactElement;
  category: ViewCategory;
}

// Ordered: Pro-facing first, then Internal, then Demo
const views: ViewConfig[] = [
  // Pro-facing pages
  {
    id: 'portal',
    label: 'Housecall Pro',
    sublabel: 'Web',
    icon: <PersonIcon />,
    category: 'pro-facing',
  },
  {
    id: 'chat',
    label: 'AI Chat',
    sublabel: 'Assistant',
    icon: <ChatIcon />,
    category: 'pro-facing',
  },
  // Internal pages
  {
    id: 'frontline',
    label: 'Org Insights',
    sublabel: 'Admin Panel',
    icon: <SupportAgentIcon />,
    category: 'internal',
  },
  {
    id: 'admin',
    label: '@HCP',
    sublabel: 'Context Manager',
    icon: <AdminPanelSettingsIcon />,
    category: 'internal',
  },
  // Demo-only page
  {
    id: 'sample-pros',
    label: 'Sample Pros',
    sublabel: 'Configurations',
    icon: <SettingsApplicationsIcon />,
    category: 'demo',
  },
];

const categoryColors: Record<ViewCategory, { bg: string; border: string; text: string }> = {
  'pro-facing': { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' },
  'internal': { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' },
  'demo': { bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
};

export function ViewSwitcher() {
  const { currentView, setCurrentView } = useOnboarding();

  const handleChange = (_event: React.SyntheticEvent, newValue: ViewType) => {
    setCurrentView(newValue);
  };

  // Group views by category for visual separation
  const proFacingViews = views.filter(v => v.category === 'pro-facing');
  const internalViews = views.filter(v => v.category === 'internal');
  const demoViews = views.filter(v => v.category === 'demo');

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        {/* Pro-facing section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {proFacingViews.map((view) => (
            <Tab
              key={view.id}
              value={view.id}
              onClick={() => setCurrentView(view.id)}
              icon={view.icon}
              label={
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontWeight: 600, fontSize: '0.75rem', lineHeight: 1.2 }}>{view.label}</Box>
                  <Box sx={{ fontSize: '0.65rem', opacity: 0.7, lineHeight: 1 }}>
                    {view.sublabel}
                  </Box>
                </Box>
              }
              sx={{
                minHeight: 64,
                py: 1,
                px: 2,
                minWidth: 110,
                borderBottom: 2,
                borderColor: currentView === view.id ? categoryColors[view.category].border : 'transparent',
                bgcolor: currentView === view.id ? categoryColors[view.category].bg : 'transparent',
                color: currentView === view.id ? categoryColors[view.category].text : 'text.secondary',
                '& .MuiTab-iconWrapper': {
                  fontSize: 20,
                  mb: 0.5,
                },
                '&:hover': {
                  bgcolor: categoryColors[view.category].bg,
                },
              }}
            />
          ))}
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />

        {/* Internal section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {internalViews.map((view) => (
            <Tab
              key={view.id}
              value={view.id}
              onClick={() => setCurrentView(view.id)}
              icon={view.icon}
              label={
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontWeight: 600, fontSize: '0.75rem', lineHeight: 1.2 }}>{view.label}</Box>
                  <Box sx={{ fontSize: '0.65rem', opacity: 0.7, lineHeight: 1 }}>
                    {view.sublabel}
                  </Box>
                </Box>
              }
              sx={{
                minHeight: 64,
                py: 1,
                px: 2,
                minWidth: 110,
                borderBottom: 2,
                borderColor: currentView === view.id ? categoryColors[view.category].border : 'transparent',
                bgcolor: currentView === view.id ? categoryColors[view.category].bg : 'transparent',
                color: currentView === view.id ? categoryColors[view.category].text : 'text.secondary',
                '& .MuiTab-iconWrapper': {
                  fontSize: 20,
                  mb: 0.5,
                },
                '&:hover': {
                  bgcolor: categoryColors[view.category].bg,
                },
              }}
            />
          ))}
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />

        {/* Demo section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {demoViews.map((view) => (
            <Tab
              key={view.id}
              value={view.id}
              onClick={() => setCurrentView(view.id)}
              icon={view.icon}
              label={
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontWeight: 600, fontSize: '0.75rem', lineHeight: 1.2 }}>{view.label}</Box>
                  <Box sx={{ fontSize: '0.65rem', opacity: 0.7, lineHeight: 1 }}>
                    {view.sublabel}
                  </Box>
                </Box>
              }
              sx={{
                minHeight: 64,
                py: 1,
                px: 2,
                minWidth: 110,
                borderBottom: 2,
                borderColor: currentView === view.id ? categoryColors[view.category].border : 'transparent',
                bgcolor: currentView === view.id ? categoryColors[view.category].bg : 'transparent',
                color: currentView === view.id ? categoryColors[view.category].text : 'text.secondary',
                '& .MuiTab-iconWrapper': {
                  fontSize: 20,
                  mb: 0.5,
                },
                '&:hover': {
                  bgcolor: categoryColors[view.category].bg,
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
