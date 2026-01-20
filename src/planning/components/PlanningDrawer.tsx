// =============================================================================
// PLANNING DRAWER COMPONENT
// =============================================================================
// Right-side drawer that displays spec, feedback, and status for the current page.
// The drawer is always open when planning mode is ON, and closed when OFF.
//
// LLM INSTRUCTIONS:
// - This drawer is rendered once at the app level (in App.tsx)
// - It uses the currentPageId from PlanningContext to determine what to show
// - Has 3 tabs: Specification, Feedback, Status
// - Spec tab has a toggle between formatted (markdown) and raw view
// =============================================================================

import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Chip,
  TextField,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close,
  Description,
  Feedback,
  Schedule,
  Delete,
  Send,
  CheckCircle,
  Build,
  Lightbulb,
  HelpOutline,
  Science,
  Code,
  Article,
} from '@mui/icons-material';
import { usePlanningMode } from '../context/PlanningContext';
import { MarkdownRenderer } from '../../chat/components/MarkdownRenderer';
import type { PlanningTab, ReleaseStatus, SpecViewMode } from '../types';

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

export const DRAWER_WIDTH = 480;

// -----------------------------------------------------------------------------
// STATUS HELPERS
// -----------------------------------------------------------------------------

const statusConfig: Record<ReleaseStatus, { label: string; color: 'success' | 'info' | 'warning' | 'default' | 'secondary'; icon: React.ReactNode }> = {
  shipped: { label: 'Shipped', color: 'success', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
  'in-development': { label: 'In Development', color: 'info', icon: <Build sx={{ fontSize: 16 }} /> },
  planned: { label: 'Planned', color: 'warning', icon: <Schedule sx={{ fontSize: 16 }} /> },
  proposed: { label: 'Proposed', color: 'default', icon: <Lightbulb sx={{ fontSize: 16 }} /> },
  prototype: { label: 'Prototype', color: 'secondary', icon: <Science sx={{ fontSize: 16 }} /> },
};

// -----------------------------------------------------------------------------
// TAB PANEL
// -----------------------------------------------------------------------------

interface TabPanelProps {
  children?: React.ReactNode;
  value: PlanningTab;
  tab: PlanningTab;
}

function TabPanel({ children, value, tab }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== tab} sx={{ height: '100%' }}>
      {value === tab && children}
    </Box>
  );
}

// -----------------------------------------------------------------------------
// SPECIFICATION TAB
// -----------------------------------------------------------------------------

interface SpecificationTabProps {
  specPath: string;
  viewMode: SpecViewMode;
  onViewModeChange: (mode: SpecViewMode) => void;
}

function SpecificationTab({ specPath, viewMode, onViewModeChange }: SpecificationTabProps) {
  const [specContent, setSpecContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSpec() {
      setLoading(true);
      setError(null);
      try {
        // Try to load the spec file from /src/specs/
        const response = await fetch(`/src/specs/${specPath}`);
        if (response.ok) {
          const content = await response.text();
          setSpecContent(content);
        } else {
          setError(`Spec file not found: ${specPath}`);
        }
      } catch {
        setError(`Could not load spec: ${specPath}`);
      }
      setLoading(false);
    }
    loadSpec();
  }, [specPath]);

  if (loading) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Loading specification...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create this spec file to document this element. The spec should include:
        </Typography>
        <Box component="ul" sx={{ mt: 1, mb: 0 }}>
          <li>Purpose and overview</li>
          <li>Key features and functionality</li>
          <li>Data model and dependencies</li>
          <li>UI/UX specifications</li>
          <li>Future enhancements</li>
        </Box>
      </Alert>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* View mode toggle */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && onViewModeChange(newMode)}
          size="small"
        >
          <ToggleButton value="formatted" sx={{ textTransform: 'none', px: 2 }}>
            <Article sx={{ fontSize: 18, mr: 0.5 }} />
            Formatted
          </ToggleButton>
          <ToggleButton value="markdown" sx={{ textTransform: 'none', px: 2 }}>
            <Code sx={{ fontSize: 18, mr: 0.5 }} />
            Markdown
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {viewMode === 'formatted' ? (
          <MarkdownRenderer content={specContent || ''} />
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              fontFamily: 'monospace',
              fontSize: 13,
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
            }}
          >
            {specContent}
          </Paper>
        )}
      </Box>
    </Box>
  );
}

// -----------------------------------------------------------------------------
// FEEDBACK TAB
// -----------------------------------------------------------------------------

function FeedbackTab({ elementId, elementName }: { elementId: string; elementName: string }) {
  const { submitFeedback, getFeedbackForElement, clearFeedback } = usePlanningMode();
  const [feedbackText, setFeedbackText] = useState('');
  const [authorName, setAuthorName] = useState('');

  const feedbackItems = getFeedbackForElement(elementId);

  const handleSubmit = () => {
    if (feedbackText.trim()) {
      submitFeedback(elementId, elementName, feedbackText.trim(), authorName.trim() || undefined);
      setFeedbackText('');
    }
  };

  return (
    <Box>
      {/* Read-only element info */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Element ID"
          value={elementId}
          fullWidth
          size="small"
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          label="Element Name"
          value={elementName}
          fullWidth
          size="small"
          disabled
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Feedback form */}
      <Typography variant="subtitle2" gutterBottom>
        Submit Feedback
      </Typography>
      <TextField
        label="Your Name (optional)"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Feedback"
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        fullWidth
        multiline
        rows={3}
        placeholder="Share your thoughts, questions, or suggestions about this element..."
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        startIcon={<Send />}
        onClick={handleSubmit}
        disabled={!feedbackText.trim()}
      >
        Submit Feedback
      </Button>

      {/* Feedback history */}
      {feedbackItems.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Previous Feedback ({feedbackItems.length})
          </Typography>
          <List dense>
            {feedbackItems.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  mb: 1,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <ListItemText
                  primary={item.feedback}
                  secondary={
                    <>
                      {item.submittedBy && `${item.submittedBy} • `}
                      {new Date(item.submittedAt).toLocaleString()}
                    </>
                  }
                  sx={{ pr: 4 }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => clearFeedback(item.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <Delete sx={{ fontSize: 18 }} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

// -----------------------------------------------------------------------------
// STATUS TAB
// -----------------------------------------------------------------------------

function StatusTab({
  status,
  releaseDate,
  releaseNotes,
  owners,
  dependencies,
  tags,
}: {
  status: ReleaseStatus;
  releaseDate?: string;
  releaseNotes?: string;
  owners?: string[];
  dependencies?: string[];
  tags?: string[];
}) {
  const config = statusConfig[status];

  return (
    <Box>
      {/* Status chip */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Release Status
        </Typography>
        <Chip
          icon={config.icon as React.ReactElement}
          label={config.label}
          color={config.color}
          sx={{ fontSize: 14, py: 2 }}
        />
      </Box>

      {/* Release date */}
      {releaseDate && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Release Date / Timeline
          </Typography>
          <Typography variant="body1">{releaseDate}</Typography>
        </Box>
      )}

      {/* Release notes */}
      {releaseNotes && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Notes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {releaseNotes}
          </Typography>
        </Box>
      )}

      {/* Owners */}
      {owners && owners.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Owners
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {owners.map((owner) => (
              <Chip key={owner} label={owner} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>
      )}

      {/* Dependencies */}
      {dependencies && dependencies.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Dependencies
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {dependencies.map((dep) => (
              <Chip key={dep} label={dep} size="small" color="info" variant="outlined" />
            ))}
          </Box>
        </Box>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
        </Box>
      )}

      {/* Placeholder for missing info */}
      {!releaseDate && !releaseNotes && !owners?.length && !dependencies?.length && (
        <Alert severity="info" icon={<HelpOutline />}>
          Additional status information can be added in the plannable registry.
        </Alert>
      )}
    </Box>
  );
}

// -----------------------------------------------------------------------------
// MAIN DRAWER
// -----------------------------------------------------------------------------

export function PlanningDrawer() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const {
    isPlanningMode,
    setPlanningMode,
    currentPageId,
    activeTab,
    setActiveTab,
    specViewMode,
    setSpecViewMode,
    getElement,
  } = usePlanningMode();

  // Get the element for the current page
  const element = currentPageId ? getElement(currentPageId) : null;

  // Drawer is open when planning mode is ON
  const isDrawerOpen = isPlanningMode;

  const handleClose = () => {
    setPlanningMode(false);
  };

  // If no element is found for the current page, show a placeholder
  const showPlaceholder = !element;

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      variant={isSmallScreen ? 'temporary' : 'persistent'}
      onClose={handleClose}
      sx={{
        width: isDrawerOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
          {element ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h6" component="h2">
                  {element.name}
                </Typography>
                <Chip
                  icon={statusConfig[element.status].icon as React.ReactElement}
                  label={statusConfig[element.status].label}
                  color={statusConfig[element.status].color}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {element.category} • {element.id}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" component="h2">
                Planning Mode
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Navigate to a page to view its specification
              </Typography>
            </>
          )}
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Close planning drawer"
          >
            <Close />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab
            value="spec"
            label="Spec"
            icon={<Description sx={{ fontSize: 18 }} />}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            value="feedback"
            label="Feedback"
            icon={<Feedback sx={{ fontSize: 18 }} />}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            value="status"
            label="Status"
            icon={<Schedule sx={{ fontSize: 18 }} />}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {showPlaceholder ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                No page specification is available for this view. Navigate to a different page or ensure the page is registered in the planning system.
              </Typography>
            </Alert>
          ) : (
            <>
              <TabPanel value={activeTab} tab="spec">
                <SpecificationTab
                  specPath={element.specPath}
                  viewMode={specViewMode}
                  onViewModeChange={setSpecViewMode}
                />
              </TabPanel>

              <TabPanel value={activeTab} tab="feedback">
                <FeedbackTab elementId={element.id} elementName={element.name} />
              </TabPanel>

              <TabPanel value={activeTab} tab="status">
                <StatusTab
                  status={element.status}
                  releaseDate={element.releaseDate}
                  releaseNotes={element.releaseNotes}
                  owners={element.owners}
                  dependencies={element.dependencies}
                  tags={element.tags}
                />
              </TabPanel>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}

export default PlanningDrawer;
