import { Box, Typography, Chip } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useOnboarding } from '../../context';

export function ConnectionIndicator() {
  const { features, pros } = useOnboarding();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        py: 1,
        px: 2,
        bgcolor: 'secondary.main',
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <FiberManualRecordIcon sx={{ fontSize: 12, color: '#4caf50' }} />
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          Live
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StorageIcon sx={{ fontSize: 16, opacity: 0.8 }} />
        <Typography variant="caption">
          Connected to Onboarding Context Repository
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Chip
          label={`${features.length} features`}
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.15)',
            color: 'white',
            fontSize: '0.7rem',
            height: 22,
          }}
        />
        <Chip
          label={`${pros.length} pros`}
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.15)',
            color: 'white',
            fontSize: '0.7rem',
            height: 22,
          }}
        />
      </Box>
    </Box>
  );
}
