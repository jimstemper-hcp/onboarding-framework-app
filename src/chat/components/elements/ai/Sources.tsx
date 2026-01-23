// =============================================================================
// SOURCES COMPONENT
// =============================================================================
// Collapsible citations/references display.
// Shows sources used in generating the response.
// =============================================================================

import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import ArticleIcon from '@mui/icons-material/Article';
import type { Source } from '../../../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface SourcesProps {
  /** List of sources */
  sources: Source[];
  /** Default expanded state */
  defaultOpen?: boolean;
  /** Custom label */
  label?: string;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Sources({
  sources,
  defaultOpen = false,
  label = 'Sources',
}: SourcesProps) {
  const [expanded, setExpanded] = useState(defaultOpen);

  if (sources.length === 0) {
    return null;
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      sx={{
        bgcolor: 'grey.50',
        borderRadius: 1,
        '&:before': { display: 'none' },
        boxShadow: 'none',
        mt: 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          minHeight: 40,
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            gap: 1,
            my: 0.5,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
          }}
        >
          <LinkIcon fontSize="small" />
          <Typography variant="body2" fontWeight={500}>
            {label}
          </Typography>
          <Chip
            label={sources.length}
            size="small"
            sx={{ height: 20, fontSize: '0.75rem' }}
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0, pb: 1.5 }}>
        <List dense disablePadding>
          {sources.map((source, index) => (
            <ListItem key={source.id} disablePadding sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                >
                  {index + 1}
                </Typography>
              </ListItemIcon>

              <ListItemText
                primary={
                  source.url ? (
                    <Link
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      {source.title}
                      <ArticleIcon fontSize="inherit" />
                    </Link>
                  ) : (
                    <Typography variant="body2">{source.title}</Typography>
                  )
                }
                secondary={source.snippet}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{
                  variant: 'caption',
                  sx: {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

export default Sources;
