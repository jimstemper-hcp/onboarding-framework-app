import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { OnboardingProvider, useOnboarding } from './context';
import { PlanningModeProvider, PlanningModal } from './planning';
import { ChatProvider } from './chat';
import { MainLayout } from './components/layout';
import { AdminView } from './views/admin';
import { FrontlineView } from './views/frontline';
import { PortalView } from './views/portal';
import { ChatView } from './views/chat';

// View router component
function ViewRouter() {
  const { currentView } = useOnboarding();

  switch (currentView) {
    case 'admin':
      return <AdminView />;
    case 'frontline':
      return <FrontlineView />;
    case 'portal':
      return <PortalView />;
    case 'chat':
      return <ChatView />;
    default:
      return <PortalView />;
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlanningModeProvider>
        <OnboardingProvider>
          <ChatProvider>
            <MainLayout>
              <ViewRouter />
            </MainLayout>
            <PlanningModal />
          </ChatProvider>
        </OnboardingProvider>
      </PlanningModeProvider>
    </ThemeProvider>
  );
}

export default App;
