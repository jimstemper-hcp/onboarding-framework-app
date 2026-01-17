import { createTheme } from '@mui/material/styles';

// Housecall Pro brand colors (approximated)
const HCP_ORANGE = '#FF6B35';
const HCP_BLUE = '#1E3A5F';
const HCP_LIGHT_BLUE = '#4A90A4';

// Stage colors for visual distinction
export const stageColors = {
  not_attached: {
    main: '#9e9e9e',
    light: '#f5f5f5',
    dark: '#616161',
    contrastText: '#ffffff',
  },
  attached: {
    main: '#ff9800',
    light: '#fff3e0',
    dark: '#f57c00',
    contrastText: '#ffffff',
  },
  activated: {
    main: '#2196f3',
    light: '#e3f2fd',
    dark: '#1976d2',
    contrastText: '#ffffff',
  },
  engaged: {
    main: '#4caf50',
    light: '#e8f5e9',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
} as const;

export const theme = createTheme({
  palette: {
    primary: {
      main: HCP_ORANGE,
      light: '#ff9a6c',
      dark: '#c43e00',
      contrastText: '#ffffff',
    },
    secondary: {
      main: HCP_BLUE,
      light: '#4a6489',
      dark: '#001536',
      contrastText: '#ffffff',
    },
    info: {
      main: HCP_LIGHT_BLUE,
      light: '#7dc0d4',
      dark: '#006277',
    },
    success: {
      main: '#4caf50',
      light: '#80e27e',
      dark: '#087f23',
    },
    warning: {
      main: '#ff9800',
      light: '#ffc947',
      dark: '#c66900',
    },
    error: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1E3A5F',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: HCP_BLUE,
    },
    h2: {
      fontWeight: 700,
      color: HCP_BLUE,
    },
    h3: {
      fontWeight: 600,
      color: HCP_BLUE,
    },
    h4: {
      fontWeight: 600,
      color: HCP_BLUE,
    },
    h5: {
      fontWeight: 600,
      color: HCP_BLUE,
    },
    h6: {
      fontWeight: 600,
      color: HCP_BLUE,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
      color: '#546e7a',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: HCP_BLUE,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: '1px solid #e0e0e0',
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        },
        elevation2: {
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
