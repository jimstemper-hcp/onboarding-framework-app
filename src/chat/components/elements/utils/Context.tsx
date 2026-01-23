// =============================================================================
// CONTEXT COMPONENT
// =============================================================================
// Collapsible context/memory display panel.
// Shows system context, conversation memory, and relevant data.
// =============================================================================

import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MemoryIcon from '@mui/icons-material/Memory';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface ContextItem {
  id: string;
  label: string;
  value: string | number | boolean;
  category?: 'user' | 'system' | 'history';
}

export interface ContextProps {
  /** Context items to display */
  items: ContextItem[];
  /** Title */
  title?: string;
  /** Default expanded state */
  defaultOpen?: boolean;
  /** Compact display */
  compact?: boolean;
}

// -----------------------------------------------------------------------------
// CATEGORY CONFIG
// -----------------------------------------------------------------------------

const categoryConfig = {
  user: {
    icon: <PersonIcon fontSize="small" />,
    label: 'User Context',
    color: 'primary.main',
  },
  system: {
    icon: <SettingsIcon fontSize="small" />,
    label: 'System Context',
    color: 'secondary.main',
  },
  history: {
    icon: <HistoryIcon fontSize="small" />,
    label: 'Conversation History',
    color: 'text.secondary',
  },
};

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Context({
  items,
  title = 'Context',
  defaultOpen = false,
  compact = false,
}: ContextProps) {
  const [expanded, setExpanded] = useState(defaultOpen);

  if (items.length === 0) {
    return null;
  }

  // Group items by category
  const groupedItems = items.reduce(
    (acc, item) => {
      const category = item.category || 'system';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, ContextItem[]>
  );

  const categories = Object.keys(groupedItems) as Array<keyof typeof categoryConfig>;

  if (compact) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          bgcolor: 'grey.50',
          borderRadius: 1,
        }}
      >
        <MemoryIcon fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary">
          {items.length} context item{items.length !== 1 ? 's' : ''} loaded
        </Typography>
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={`${groupedItems[cat].length} ${cat}`}
            size="small"
            sx={{ height: 18, fontSize: '0.65rem' }}
          />
        ))}
      </Box>
    );
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
          <MemoryIcon fontSize="small" />
          <Typography variant="body2" fontWeight={500}>
            {title}
          </Typography>
          <Chip
            label={items.length}
            size="small"
            sx={{ height: 20, fontSize: '0.75rem' }}
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0, pb: 1.5 }}>
        {categories.map((category, catIndex) => (
          <Box key={category}>
            {catIndex > 0 && <Divider sx={{ my: 1 }} />}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.5,
                color: categoryConfig[category].color,
              }}
            >
              {categoryConfig[category].icon}
              <Typography variant="caption" fontWeight={500}>
                {categoryConfig[category].label}
              </Typography>
            </Box>

            <List dense disablePadding>
              {groupedItems[category].map((item) => (
                <ListItem key={item.id} disablePadding sx={{ py: 0.25 }}>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight={500}
                          sx={{
                            maxWidth: '50%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {typeof item.value === 'boolean'
                            ? item.value
                              ? 'Yes'
                              : 'No'
                            : String(item.value)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

export default Context;
