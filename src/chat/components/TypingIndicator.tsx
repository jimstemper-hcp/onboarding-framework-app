// =============================================================================
// TYPING INDICATOR COMPONENT
// =============================================================================
// Shows an animated loading indicator when the AI is processing a response.
// =============================================================================

import { Box, Avatar, keyframes } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// -----------------------------------------------------------------------------
// ANIMATION
// -----------------------------------------------------------------------------

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
`;

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function TypingIndicator() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        mb: 2,
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          bgcolor: 'secondary.main',
          width: 36,
          height: 36,
        }}
      >
        <SmartToyIcon fontSize="small" />
      </Avatar>

      {/* Typing Dots */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 2,
          py: 1.5,
          bgcolor: 'grey.100',
          borderRadius: 2,
          borderTopLeftRadius: 0,
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              bgcolor: 'grey.500',
              borderRadius: '50%',
              animation: `${bounce} 1.4s ease-in-out infinite`,
              animationDelay: `${index * 0.16}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default TypingIndicator;
