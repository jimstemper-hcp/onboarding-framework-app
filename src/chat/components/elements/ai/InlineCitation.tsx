// =============================================================================
// INLINE CITATION COMPONENT
// =============================================================================
// Superscript link markers for inline source references.
// Shows tooltip with source details on hover.
// =============================================================================

import { Tooltip, Link, Typography } from '@mui/material';
import type { Source } from '../../../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface InlineCitationProps {
  /** Citation number */
  number: number;
  /** Source data */
  source: Source;
  /** Click handler */
  onClick?: () => void;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function InlineCitation({
  number,
  source,
  onClick,
}: InlineCitationProps) {
  const tooltipContent = (
    <Typography variant="caption" component="div">
      <strong>{source.title}</strong>
      {source.snippet && (
        <Typography
          variant="caption"
          component="div"
          sx={{
            mt: 0.5,
            opacity: 0.9,
            maxWidth: 300,
          }}
        >
          {source.snippet}
        </Typography>
      )}
    </Typography>
  );

  return (
    <Tooltip title={tooltipContent} arrow>
      <Link
        component="span"
        onClick={onClick}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 16,
          height: 16,
          px: 0.5,
          mx: 0.25,
          fontSize: '0.65rem',
          fontWeight: 600,
          lineHeight: 1,
          borderRadius: '4px',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          textDecoration: 'none',
          cursor: onClick ? 'pointer' : 'default',
          verticalAlign: 'super',
          '&:hover': onClick ? {
            bgcolor: 'primary.dark',
          } : undefined,
        }}
      >
        {number}
      </Link>
    </Tooltip>
  );
}

export default InlineCitation;
