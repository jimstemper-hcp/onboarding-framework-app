import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import BuildIcon from '@mui/icons-material/Build';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import CategoryIcon from '@mui/icons-material/Category';
import PhoneIcon from '@mui/icons-material/Phone';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useOnboarding } from '../../context';
import { onboardingItems } from '../../data';
import type {
  Feature,
  CalendlyLink,
  McpTool,
  AccessConditionRule,
  NavigationItem,
  NavigationType,
  ContextSnippet,
  OnboardingItemAssignment,
  OnboardingItemDefinition,
} from '../../types';

// =============================================================================
// PALETTE & CONFIG
// =============================================================================

const palette = {
  primary: '#0062FF',
  secondary: '#7C3AED',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  grey: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    600: '#475569',
    800: '#1E293B',
  },
};

type StageKey = 'notAttached' | 'attached' | 'activated' | 'engaged';

const stageConfig: Record<StageKey, { label: string; color: string }> = {
  notAttached: { label: 'Not Attached', color: palette.grey[600] },
  attached: { label: 'Attached', color: palette.warning },
  activated: { label: 'Activated', color: palette.primary },
  engaged: { label: 'Engaged', color: palette.success },
};

const stageKeys: StageKey[] = ['notAttached', 'attached', 'activated', 'engaged'];

type AdminPage = 'features' | 'navigation' | 'calls' | 'onboarding-items' | 'tools';

const navigationTypes: { value: NavigationType; label: string }[] = [
  { value: 'hcp_sell_page', label: 'Sell Page' },
  { value: 'hcp_navigate', label: 'Navigate' },
  { value: 'hcp_tours', label: 'Tours' },
  { value: 'hcp_help_article', label: 'Help Article' },
  { value: 'hcp_video', label: 'Video' },
  { value: 'hcp_modal', label: 'Modal' },
  { value: 'hcp_section_header', label: 'Section Header' },
  { value: 'hcp_training_article', label: 'Training Article' },
];

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

function SectionHeader({ icon, title, count }: { icon: React.ReactNode; title: string; count?: number }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
      <Box sx={{ color: palette.primary }}>{icon}</Box>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      {count !== undefined && (
        <Chip label={count} size="small" sx={{ height: 20, fontSize: '0.75rem' }} />
      )}
    </Stack>
  );
}

// Simple reference table for items (used in Feature Editor)
function ReferenceTable({
  items,
  onNavigate,
  onRemove,
  emptyMessage,
}: {
  items: { id: string; name: string; description: string }[];
  onNavigate: (id: string) => void;
  onRemove: (id: string) => void;
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
            <TableCell align="right" sx={{ width: 100 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {item.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    maxWidth: 300,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.description}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onNavigate(item.id)} title="Go to item">
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onRemove(item.id)} title="Remove">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// =============================================================================
// CONTEXT SNIPPETS EDITOR (stays in feature editor - not centralized)
// =============================================================================

function ContextSnippetsEditor({
  snippets,
  onChange,
}: {
  snippets: ContextSnippet[];
  onChange: (snippets: ContextSnippet[]) => void;
}) {
  const handleSnippetChange = (index: number, field: keyof ContextSnippet, value: string) => {
    const updated = [...snippets];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddSnippet = () => {
    const newId = `snippet-${Date.now()}`;
    onChange([...snippets, { id: newId, title: 'New Context', content: '' }]);
  };

  const handleRemoveSnippet = (index: number) => {
    if (index === 0) return;
    onChange(snippets.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Stack spacing={2}>
        {snippets.map((snippet, index) => (
          <Paper key={snippet.id} variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  size="small"
                  label="Title"
                  value={snippet.title}
                  onChange={(e) => handleSnippetChange(index, 'title', e.target.value)}
                  sx={{ flex: 1 }}
                  disabled={index === 0}
                />
                {index > 0 && (
                  <IconButton size="small" onClick={() => handleRemoveSnippet(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
              <TextField
                size="small"
                fullWidth
                multiline
                rows={3}
                placeholder="Context content..."
                value={snippet.content}
                onChange={(e) => handleSnippetChange(index, 'content', e.target.value)}
              />
            </Stack>
          </Paper>
        ))}
      </Stack>
      <Button startIcon={<AddIcon />} size="small" onClick={handleAddSnippet} sx={{ mt: 1 }}>
        Add Context Snippet
      </Button>
    </Box>
  );
}

// =============================================================================
// ACCESS CONDITIONS EDITOR
// =============================================================================

function AccessConditionsEditor({
  rule,
  onChange,
}: {
  rule: AccessConditionRule;
  onChange: (rule: AccessConditionRule) => void;
}) {
  const [newVariable, setNewVariable] = useState('');

  const handleAddCondition = () => {
    if (newVariable.trim()) {
      onChange({
        ...rule,
        conditions: [...rule.conditions, { variable: newVariable.trim(), negated: true }],
      });
      setNewVariable('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    onChange({
      ...rule,
      conditions: rule.conditions.filter((_, i) => i !== index),
    });
  };

  const handleToggleNegated = (index: number) => {
    const updated = [...rule.conditions];
    updated[index] = { ...updated[index], negated: !updated[index].negated };
    onChange({ ...rule, conditions: updated });
  };

  const handleOperatorChange = (_: React.MouseEvent<HTMLElement>, newOperator: 'AND' | 'OR' | null) => {
    if (newOperator) {
      onChange({ ...rule, operator: newOperator });
    }
  };

  return (
    <Box>
      <SectionHeader icon={<FlagRoundedIcon />} title="Access Conditions" count={rule.conditions.length} />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Feature access controller variables that determine when a pro is in this stage.
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight={500}>Match:</Typography>
        <ToggleButtonGroup value={rule.operator} exclusive onChange={handleOperatorChange} size="small">
          <ToggleButton value="AND" sx={{ px: 2 }}>ALL (AND)</ToggleButton>
          <ToggleButton value="OR" sx={{ px: 2 }}>ANY (OR)</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Box sx={{ mb: 2 }}>
        {rule.conditions.map((condition, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{
              p: 1.5,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: alpha(palette.grey[600], 0.02),
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Chip
                label={condition.negated ? 'NOT' : 'HAS'}
                size="small"
                onClick={() => handleToggleNegated(index)}
                sx={{
                  bgcolor: condition.negated ? alpha(palette.error, 0.1) : alpha(palette.success, 0.1),
                  color: condition.negated ? palette.error : palette.success,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  bgcolor: alpha(palette.primary, 0.08),
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                {condition.variable}
              </Typography>
            </Stack>
            <IconButton size="small" onClick={() => handleRemoveCondition(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Paper>
        ))}
      </Box>

      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          fullWidth
          placeholder="e.g., billing.plan.invoicing"
          value={newVariable}
          onChange={(e) => setNewVariable(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
          inputProps={{ style: { fontFamily: 'monospace' } }}
        />
        <Button variant="outlined" size="small" onClick={handleAddCondition}>Add</Button>
      </Stack>
    </Box>
  );
}

// =============================================================================
// SIMPLIFIED STAGE EDITOR (uses reference tables)
// =============================================================================

function SimplifiedStageEditor({
  feature,
  stageName,
  onChange,
  onNavigateToPage,
}: {
  feature: Feature;
  stageName: StageKey;
  onChange: (feature: Feature) => void;
  onNavigateToPage: (page: AdminPage) => void;
}) {
  const context = feature.stages[stageName];
  const [showAddNavigation, setShowAddNavigation] = useState(false);
  const [showAddCalendly, setShowAddCalendly] = useState(false);
  const [showAddOnboardingItem, setShowAddOnboardingItem] = useState(false);
  const [showAddTool, setShowAddTool] = useState(false);

  const updateContext = (updates: Partial<typeof context>) => {
    onChange({
      ...feature,
      stages: {
        ...feature.stages,
        [stageName]: { ...context, ...updates },
      },
    });
  };

  // Get item definition by ID
  const getOnboardingItemDef = (itemId: string): OnboardingItemDefinition | undefined => {
    return onboardingItems.find((item) => item.id === itemId);
  };

  // Navigation items for reference table
  const navigationTableItems = (context.navigation || []).map((nav, i) => ({
    id: `nav-${i}`,
    name: nav.name,
    description: nav.description,
  }));

  // Calendly items for reference table
  const calendlyTableItems = (context.calendlyTypes || []).map((cal, i) => ({
    id: `cal-${i}`,
    name: cal.name,
    description: cal.description,
  }));

  // Onboarding items for reference table
  const onboardingTableItems = (context.onboardingItems || []).map((assignment) => {
    const def = getOnboardingItemDef(assignment.itemId);
    return {
      id: assignment.itemId,
      name: def?.title || assignment.itemId,
      description: def?.description || '',
    };
  });

  // Tools for reference table
  const toolsTableItems = (context.tools || []).map((tool, i) => ({
    id: `tool-${i}`,
    name: tool.name,
    description: tool.description,
  }));

  // Remove handlers
  const handleRemoveNavigation = (id: string) => {
    const index = parseInt(id.replace('nav-', ''));
    updateContext({ navigation: context.navigation?.filter((_, i) => i !== index) });
  };

  const handleRemoveCalendly = (id: string) => {
    const index = parseInt(id.replace('cal-', ''));
    updateContext({ calendlyTypes: context.calendlyTypes?.filter((_, i) => i !== index) });
  };

  const handleRemoveOnboardingItem = (itemId: string) => {
    updateContext({ onboardingItems: context.onboardingItems?.filter((a) => a.itemId !== itemId) });
  };

  const handleRemoveTool = (id: string) => {
    const index = parseInt(id.replace('tool-', ''));
    updateContext({ tools: context.tools?.filter((_, i) => i !== index) });
  };

  // Get available onboarding items (not yet assigned)
  const assignedItemIds = (context.onboardingItems || []).map((a) => a.itemId);
  const availableOnboardingItems = onboardingItems.filter((item) => !assignedItemIds.includes(item.id));

  return (
    <Stack spacing={3}>
      {/* Access Conditions */}
      <Paper sx={{ p: 3 }}>
        <AccessConditionsEditor
          rule={context.accessConditions}
          onChange={(accessConditions) => updateContext({ accessConditions })}
        />
      </Paper>

      {/* Important Context (stays editable here) */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader icon={<TextSnippetIcon />} title="Important Context" count={context.contextSnippets?.length || 0} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Context snippets specific to this feature and stage.
        </Typography>
        <ContextSnippetsEditor
          snippets={context.contextSnippets || []}
          onChange={(snippets) => updateContext({ contextSnippets: snippets })}
        />
      </Paper>

      {/* Onboarding Items (reference table) */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader icon={<ChecklistIcon />} title="Onboarding Items" count={context.onboardingItems?.length || 0} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Centralized onboarding items assigned to this stage.
        </Typography>
        <ReferenceTable
          items={onboardingTableItems}
          onNavigate={() => onNavigateToPage('onboarding-items')}
          onRemove={handleRemoveOnboardingItem}
          emptyMessage="No onboarding items assigned"
        />
        <Button startIcon={<AddIcon />} size="small" onClick={() => setShowAddOnboardingItem(true)} sx={{ mt: 1 }}>
          Add Onboarding Item
        </Button>

        {/* Add Onboarding Item Dialog */}
        <Dialog open={showAddOnboardingItem} onClose={() => setShowAddOnboardingItem(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add Onboarding Item</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={1}>
              {availableOnboardingItems.map((item) => (
                <Paper
                  key={item.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: alpha(palette.primary, 0.04), borderColor: palette.primary },
                  }}
                  onClick={() => {
                    updateContext({
                      onboardingItems: [...(context.onboardingItems || []), { itemId: item.id, required: true }],
                    });
                    setShowAddOnboardingItem(false);
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {item.type === 'in_product' ? (
                      <ComputerIcon fontSize="small" sx={{ color: palette.primary }} />
                    ) : (
                      <PersonIcon fontSize="small" sx={{ color: palette.secondary }} />
                    )}
                    <Typography variant="subtitle2" fontWeight={600}>{item.title}</Typography>
                    <Chip
                      label={item.type === 'in_product' ? 'In-Product' : 'Rep-Facing'}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        bgcolor: item.type === 'in_product' ? alpha(palette.primary, 0.1) : alpha(palette.secondary, 0.1),
                        color: item.type === 'in_product' ? palette.primary : palette.secondary,
                      }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {item.description}
                  </Typography>
                </Paper>
              ))}
              {availableOnboardingItems.length === 0 && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  All items have been added.
                </Typography>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddOnboardingItem(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Paper>

      {/* Navigation (reference table) */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader icon={<LinkIcon />} title="Navigation" count={context.navigation?.length || 0} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Links to pages, articles, videos, and other resources.
        </Typography>
        <ReferenceTable
          items={navigationTableItems}
          onNavigate={() => onNavigateToPage('navigation')}
          onRemove={handleRemoveNavigation}
          emptyMessage="No navigation items"
        />
        <Button startIcon={<AddIcon />} size="small" onClick={() => setShowAddNavigation(true)} sx={{ mt: 1 }}>
          Add Navigation
        </Button>

        {/* Quick Add Navigation Dialog */}
        <QuickAddNavigationDialog
          open={showAddNavigation}
          onClose={() => setShowAddNavigation(false)}
          onAdd={(nav) => {
            updateContext({ navigation: [...(context.navigation || []), nav] });
            setShowAddNavigation(false);
          }}
        />
      </Paper>

      {/* Calendly (reference table) */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader icon={<CalendarMonthIcon />} title="Calls" count={context.calendlyTypes?.length || 0} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Calendly event types for scheduling calls.
        </Typography>
        <ReferenceTable
          items={calendlyTableItems}
          onNavigate={() => onNavigateToPage('calls')}
          onRemove={handleRemoveCalendly}
          emptyMessage="No call types"
        />
        <Button startIcon={<AddIcon />} size="small" onClick={() => setShowAddCalendly(true)} sx={{ mt: 1 }}>
          Add Call Type
        </Button>

        {/* Quick Add Calendly Dialog */}
        <QuickAddCalendlyDialog
          open={showAddCalendly}
          onClose={() => setShowAddCalendly(false)}
          onAdd={(cal) => {
            updateContext({ calendlyTypes: [...(context.calendlyTypes || []), cal] });
            setShowAddCalendly(false);
          }}
        />
      </Paper>

      {/* Prompt */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader icon={<SmartToyIcon />} title="Prompt" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          AI prompt for this stage.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={context.prompt || ''}
          onChange={(e) => updateContext({ prompt: e.target.value })}
          placeholder="AI prompt for this stage..."
        />
      </Paper>

      {/* Tools (reference table) */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader icon={<BuildIcon />} title="Tools" count={context.tools?.length || 0} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          MCP tools available at this stage.
        </Typography>
        <ReferenceTable
          items={toolsTableItems}
          onNavigate={() => onNavigateToPage('tools')}
          onRemove={handleRemoveTool}
          emptyMessage="No tools"
        />
        <Button startIcon={<AddIcon />} size="small" onClick={() => setShowAddTool(true)} sx={{ mt: 1 }}>
          Add Tool
        </Button>

        {/* Quick Add Tool Dialog */}
        <QuickAddToolDialog
          open={showAddTool}
          onClose={() => setShowAddTool(false)}
          onAdd={(tool) => {
            updateContext({ tools: [...(context.tools || []), tool] });
            setShowAddTool(false);
          }}
        />
      </Paper>
    </Stack>
  );
}

// =============================================================================
// QUICK ADD DIALOGS
// =============================================================================

function QuickAddNavigationDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (nav: NavigationItem) => void;
}) {
  const [nav, setNav] = useState<NavigationItem>({
    name: '',
    description: '',
    url: '',
    navigationType: 'hcp_help_article',
  });

  const handleAdd = () => {
    if (nav.name && nav.url) {
      onAdd(nav);
      setNav({ name: '', description: '', url: '', navigationType: 'hcp_help_article' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Navigation Item</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            size="small"
            label="Name"
            fullWidth
            value={nav.name}
            onChange={(e) => setNav({ ...nav, name: e.target.value })}
          />
          <TextField
            size="small"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={nav.description}
            onChange={(e) => setNav({ ...nav, description: e.target.value })}
          />
          <TextField
            size="small"
            label="URL"
            fullWidth
            value={nav.url}
            onChange={(e) => setNav({ ...nav, url: e.target.value })}
            inputProps={{ style: { fontFamily: 'monospace' } }}
          />
          <FormControl size="small" fullWidth>
            <Select
              value={nav.navigationType}
              onChange={(e) => setNav({ ...nav, navigationType: e.target.value as NavigationType })}
            >
              {navigationTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!nav.name || !nav.url}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

function QuickAddCalendlyDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (cal: CalendlyLink) => void;
}) {
  const [cal, setCal] = useState<CalendlyLink>({
    name: '',
    description: '',
    url: '',
    team: 'onboarding',
  });

  const handleAdd = () => {
    if (cal.name && cal.url) {
      onAdd(cal);
      setCal({ name: '', description: '', url: '', team: 'onboarding' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Call Type</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            size="small"
            label="Name"
            fullWidth
            value={cal.name}
            onChange={(e) => setCal({ ...cal, name: e.target.value })}
          />
          <TextField
            size="small"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={cal.description}
            onChange={(e) => setCal({ ...cal, description: e.target.value })}
          />
          <TextField
            size="small"
            label="Calendly URL"
            fullWidth
            value={cal.url}
            onChange={(e) => setCal({ ...cal, url: e.target.value })}
            inputProps={{ style: { fontFamily: 'monospace' } }}
          />
          <FormControl size="small" fullWidth>
            <Select
              value={cal.team}
              onChange={(e) => setCal({ ...cal, team: e.target.value as 'sales' | 'onboarding' | 'support' })}
            >
              <MenuItem value="sales">Sales</MenuItem>
              <MenuItem value="onboarding">Onboarding</MenuItem>
              <MenuItem value="support">Support</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!cal.name || !cal.url}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

function QuickAddToolDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (tool: McpTool) => void;
}) {
  const [tool, setTool] = useState<McpTool>({
    name: '',
    description: '',
    parameters: {},
  });

  const handleAdd = () => {
    if (tool.name) {
      onAdd(tool);
      setTool({ name: '', description: '', parameters: {} });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Tool</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            size="small"
            label="Tool Name"
            fullWidth
            value={tool.name}
            onChange={(e) => setTool({ ...tool, name: e.target.value })}
            inputProps={{ style: { fontFamily: 'monospace' } }}
          />
          <TextField
            size="small"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={tool.description}
            onChange={(e) => setTool({ ...tool, description: e.target.value })}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!tool.name}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

// =============================================================================
// FEATURE EDITOR MODAL
// =============================================================================

function FeatureEditorModal({
  feature,
  open,
  onClose,
  onSave,
  onNavigateToPage,
}: {
  feature: Feature | null;
  open: boolean;
  onClose: () => void;
  onSave: (feature: Feature) => void;
  onNavigateToPage: (page: AdminPage) => void;
}) {
  const [editedFeature, setEditedFeature] = useState<Feature | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setEditedFeature(feature ? { ...feature } : null);
    setActiveTab(0);
  }, [feature]);

  if (!editedFeature) return null;

  const handleSave = () => {
    if (editedFeature) {
      onSave(editedFeature);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">Edit Feature: {editedFeature.name}</Typography>
          <Chip label={editedFeature.id} size="small" sx={{ bgcolor: alpha(palette.primary, 0.1), color: palette.primary }} />
        </Stack>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            label="Feature Name"
            value={editedFeature.name}
            onChange={(e) => setEditedFeature({ ...editedFeature, name: e.target.value })}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Version"
            value={editedFeature.version}
            onChange={(e) => setEditedFeature({ ...editedFeature, version: e.target.value })}
            placeholder="1.0.0"
            sx={{ width: 120 }}
            inputProps={{ style: { fontFamily: 'monospace' } }}
          />
          <TextField
            size="small"
            label="Icon"
            value={editedFeature.icon}
            onChange={(e) => setEditedFeature({ ...editedFeature, icon: e.target.value })}
            sx={{ width: 150 }}
          />
        </Stack>
        <TextField
          size="small"
          label="Description"
          fullWidth
          multiline
          rows={2}
          value={editedFeature.description}
          onChange={(e) => setEditedFeature({ ...editedFeature, description: e.target.value })}
          sx={{ mt: 2 }}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          {stageKeys.map((stage) => (
            <Tab
              key={stage}
              label={stageConfig[stage].label}
              sx={{ '&.Mui-selected': { color: stageConfig[stage].color } }}
            />
          ))}
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: palette.grey[50] }}>
        <SimplifiedStageEditor
          feature={editedFeature}
          stageName={stageKeys[activeTab]}
          onChange={setEditedFeature}
          onNavigateToPage={(page) => {
            onClose();
            onNavigateToPage(page);
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
}

// =============================================================================
// FEATURE MANAGEMENT PAGE
// =============================================================================

function FeatureManagementPage({ onNavigateToPage }: { onNavigateToPage: (page: AdminPage) => void }) {
  const { features, updateFeature } = useOnboarding();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Feature Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage onboarding content for all features and adoption stages
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disabled>Add Feature</Button>
      </Stack>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Feature</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Version</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell><Typography fontWeight={500}>{feature.name}</Typography></TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {feature.description}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={`v${feature.version}`}
                    size="small"
                    sx={{ bgcolor: alpha(palette.primary, 0.1), color: palette.primary, fontFamily: 'monospace' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => { setSelectedFeature(feature); setEditorOpen(true); }}
                    sx={{ color: palette.primary }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FeatureEditorModal
        feature={selectedFeature}
        open={editorOpen}
        onClose={() => { setEditorOpen(false); setSelectedFeature(null); }}
        onSave={(f) => { updateFeature(f); setSelectedFeature(null); }}
        onNavigateToPage={onNavigateToPage}
      />
    </Box>
  );
}

// =============================================================================
// NAVIGATION MANAGEMENT PAGE
// =============================================================================

function NavigationManagementPage() {
  const { features } = useOnboarding();

  // Collect all unique navigation items across all features/stages
  const allNavItems: { featureName: string; stageName: string; item: NavigationItem }[] = [];
  features.forEach((feature) => {
    stageKeys.forEach((stageKey) => {
      const stage = feature.stages[stageKey];
      (stage.navigation || []).forEach((nav) => {
        allNavItems.push({
          featureName: feature.name,
          stageName: stageConfig[stageKey].label,
          item: nav,
        });
      });
    });
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Navigation</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage navigation items, links, and resources
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disabled>Add Navigation</Button>
      </Stack>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>URL</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Used In</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allNavItems.map((entry, i) => (
              <TableRow key={i} hover>
                <TableCell><Typography fontWeight={500}>{entry.item.name}</Typography></TableCell>
                <TableCell>
                  <Chip
                    label={navigationTypes.find((t) => t.value === entry.item.navigationType)?.label || entry.item.navigationType}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {entry.item.url}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {entry.featureName} → {entry.stageName}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" disabled><EditIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// =============================================================================
// CALLS MANAGEMENT PAGE
// =============================================================================

function CallsManagementPage() {
  const { features } = useOnboarding();

  // Collect all unique calendly items across all features/stages
  const allCallItems: { featureName: string; stageName: string; item: CalendlyLink }[] = [];
  features.forEach((feature) => {
    stageKeys.forEach((stageKey) => {
      const stage = feature.stages[stageKey];
      (stage.calendlyTypes || []).forEach((cal) => {
        allCallItems.push({
          featureName: feature.name,
          stageName: stageConfig[stageKey].label,
          item: cal,
        });
      });
    });
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Calls</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage Calendly event types and call scheduling
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disabled>Add Call Type</Button>
      </Stack>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Team</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>URL</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Used In</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allCallItems.map((entry, i) => (
              <TableRow key={i} hover>
                <TableCell><Typography fontWeight={500}>{entry.item.name}</Typography></TableCell>
                <TableCell>
                  <Chip
                    label={entry.item.team.charAt(0).toUpperCase() + entry.item.team.slice(1)}
                    size="small"
                    color={entry.item.team === 'sales' ? 'warning' : entry.item.team === 'onboarding' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {entry.item.url}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {entry.featureName} → {entry.stageName}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" disabled><EditIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// =============================================================================
// ONBOARDING ITEMS MANAGEMENT PAGE
// =============================================================================

function OnboardingItemsManagementPage() {
  const [selectedItem, setSelectedItem] = useState<OnboardingItemDefinition | null>(null);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Onboarding Items</Typography>
          <Typography variant="body2" color="text.secondary">
            Centralized repository of onboarding tasks and actions
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disabled>Add Item</Button>
      </Stack>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Labels</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Completion Event</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {onboardingItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {item.type === 'in_product' ? (
                      <ComputerIcon fontSize="small" sx={{ color: palette.primary }} />
                    ) : (
                      <PersonIcon fontSize="small" sx={{ color: palette.secondary }} />
                    )}
                    <Typography fontWeight={500}>{item.title}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.type === 'in_product' ? 'In-Product' : 'Rep-Facing'}
                    size="small"
                    sx={{
                      bgcolor: item.type === 'in_product' ? alpha(palette.primary, 0.1) : alpha(palette.secondary, 0.1),
                      color: item.type === 'in_product' ? palette.primary : palette.secondary,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(item.labels || []).slice(0, 3).map((label) => (
                      <Chip key={label} label={label} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                    ))}
                    {(item.labels || []).length > 3 && (
                      <Chip label={`+${(item.labels || []).length - 3}`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  {item.completionApi ? (
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {item.completionApi.eventName}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Manual</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setSelectedItem(item)} sx={{ color: palette.primary }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Item Dialog */}
      <Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Onboarding Item</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <Stack spacing={2}>
              <TextField size="small" label="Title" fullWidth value={selectedItem.title} disabled />
              <TextField size="small" label="Description" fullWidth multiline rows={2} value={selectedItem.description} disabled />
              <TextField size="small" label="Type" fullWidth value={selectedItem.type} disabled />
              {selectedItem.labels && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Labels</Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                    {selectedItem.labels.map((label) => (
                      <Chip key={label} label={label} size="small" />
                    ))}
                  </Stack>
                </Box>
              )}
              {selectedItem.completionApi && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Completion API</Typography>
                  <Paper variant="outlined" sx={{ p: 1.5, mt: 0.5, bgcolor: palette.grey[50] }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      Event: {selectedItem.completionApi.eventName}
                    </Typography>
                    {selectedItem.completionApi.endpoint && (
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        Endpoint: {selectedItem.completionApi.endpoint}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {selectedItem.completionApi.description}
                    </Typography>
                  </Paper>
                </Box>
              )}
              {selectedItem.repInstructions && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Rep Instructions</Typography>
                  <Paper variant="outlined" sx={{ p: 1.5, mt: 0.5, bgcolor: alpha(palette.secondary, 0.04) }}>
                    <Typography variant="body2">{selectedItem.repInstructions}</Typography>
                  </Paper>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedItem(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// =============================================================================
// TOOLS MANAGEMENT PAGE
// =============================================================================

function ToolsManagementPage() {
  const { features } = useOnboarding();

  // Collect all unique tools across all features/stages
  const allTools: { featureName: string; stageName: string; tool: McpTool }[] = [];
  features.forEach((feature) => {
    stageKeys.forEach((stageKey) => {
      const stage = feature.stages[stageKey];
      (stage.tools || []).forEach((tool) => {
        allTools.push({
          featureName: feature.name,
          stageName: stageConfig[stageKey].label,
          tool,
        });
      });
    });
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Tools</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage MCP tools available to the AI assistant
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disabled>Add Tool</Button>
      </Stack>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Used In</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allTools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No tools defined yet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              allTools.map((entry, i) => (
                <TableRow key={i} hover>
                  <TableCell>
                    <Typography fontWeight={500} sx={{ fontFamily: 'monospace' }}>{entry.tool.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.tool.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {entry.featureName} → {entry.stageName}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" disabled><EditIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// =============================================================================
// MAIN ADMIN VIEW WITH SIDEBAR
// =============================================================================

export function AdminView() {
  const [currentPage, setCurrentPage] = useState<AdminPage>('features');

  const menuItems: { id: AdminPage; label: string; icon: React.ReactNode }[] = [
    { id: 'features', label: 'Features', icon: <CategoryIcon /> },
    { id: 'navigation', label: 'Navigation', icon: <LinkIcon /> },
    { id: 'calls', label: 'Calls', icon: <PhoneIcon /> },
    { id: 'onboarding-items', label: 'Onboarding Items', icon: <ChecklistIcon /> },
    { id: 'tools', label: 'Tools', icon: <BuildIcon /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'features':
        return <FeatureManagementPage onNavigateToPage={setCurrentPage} />;
      case 'navigation':
        return <NavigationManagementPage />;
      case 'calls':
        return <CallsManagementPage />;
      case 'onboarding-items':
        return <OnboardingItemsManagementPage />;
      case 'tools':
        return <ToolsManagementPage />;
      default:
        return <FeatureManagementPage onNavigateToPage={setCurrentPage} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}>
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 240,
          flexShrink: 0,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: palette.grey[50],
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
            ADMIN
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            Manage Content
          </Typography>
        </Box>
        <List sx={{ p: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={currentPage === item.id}
                onClick={() => setCurrentPage(item.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: alpha(palette.primary, 0.08),
                    '&:hover': { bgcolor: alpha(palette.primary, 0.12) },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: currentPage === item.id ? palette.primary : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: currentPage === item.id ? 600 : 400,
                    color: currentPage === item.id ? palette.primary : 'inherit',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {renderPage()}
      </Box>
    </Box>
  );
}
