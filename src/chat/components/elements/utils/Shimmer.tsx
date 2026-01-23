// =============================================================================
// SHIMMER COMPONENT
// =============================================================================
// Loading skeleton animation for content placeholders.
// Uses MUI Skeleton with pulse animation.
// =============================================================================

import { Box, Skeleton, type SxProps, type Theme } from '@mui/material';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface ShimmerProps {
  /** Variant type */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded' | 'message';
  /** Width (CSS value or number for pixels) */
  width?: number | string;
  /** Height (CSS value or number for pixels) */
  height?: number | string;
  /** Number of lines for text variant */
  lines?: number;
  /** Animation type */
  animation?: 'pulse' | 'wave' | false;
  /** Additional styles */
  sx?: SxProps<Theme>;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Shimmer({
  variant = 'text',
  width,
  height,
  lines = 1,
  animation = 'pulse',
  sx,
}: ShimmerProps) {
  // Message shimmer - simulates a message bubble loading
  if (variant === 'message') {
    return (
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mb: 2,
          ...sx,
        }}
      >
        {/* Avatar skeleton */}
        <Skeleton
          variant="circular"
          width={36}
          height={36}
          animation={animation}
        />

        {/* Message content skeleton */}
        <Box sx={{ flex: 1, maxWidth: '75%' }}>
          <Skeleton
            variant="rounded"
            width="100%"
            height={80}
            animation={animation}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>
    );
  }

  // Multiple text lines
  if (variant === 'text' && lines > 1) {
    return (
      <Box sx={sx}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={
              width ||
              (index === lines - 1 ? '60%' : `${80 + Math.random() * 20}%`)
            }
            height={height}
            animation={animation}
            sx={{ mb: index < lines - 1 ? 0.5 : 0 }}
          />
        ))}
      </Box>
    );
  }

  // Single skeleton (variant is guaranteed to be text/circular/rectangular/rounded here)
  const skeletonVariant = variant as 'text' | 'circular' | 'rectangular' | 'rounded';
  return (
    <Skeleton
      variant={skeletonVariant}
      width={width}
      height={height}
      animation={animation}
      sx={sx}
    />
  );
}

export default Shimmer;
