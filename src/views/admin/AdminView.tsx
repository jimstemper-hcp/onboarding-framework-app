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
import { PlanningWrapper } from '../../planning';
import type {
  Feature,
  CalendlyLink,
  CalendlyTeam,
  CalendlyStatus,
  McpTool,
  AccessConditionRule,
  NavigationItem,
  NavigationType,
  NavigationStatus,
  NavigationTypeData,
  ContextSnippet,
  OnboardingItemAssignment,
  OnboardingItemDefinition,
  OnboardingItemStatus,
  OnboardingItemType,
  CompletionApi,
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

const navigationTypes: { value: NavigationType; label: string; description: string }[] = [
  { value: 'hcp_navigate', label: 'Page Navigation', description: 'Navigate to a page path in the product' },
  { value: 'hcp_modal', label: 'Modal', description: 'Open a modal in the product' },
  { value: 'hcp_video', label: 'Video', description: 'Embed a video in the chat' },
  { value: 'hcp_help', label: 'Help Article', description: 'Link to a help center article' },
  { value: 'hcp_external', label: 'External URL', description: 'Link to an external website' },
  { value: 'hcp_tour', label: 'Product Tour', description: 'Launch an Appcue product tour' },
];

const navigationStatusOptions: { value: NavigationStatus; label: string; color: string }[] = [
  { value: 'published', label: 'Published', color: palette.success },
  { value: 'draft', label: 'Draft', color: palette.warning },
  { value: 'archived', label: 'Archived', color: palette.grey[600] },
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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [navType, setNavType] = useState<NavigationType>('hcp_help');

  const handleAdd = () => {
    if (name && url) {
      const slugId = generateSlugId(name);
      const nav: NavigationItem = {
        slugId,
        name,
        status: 'draft',
        navigationType: navType,
        typeData: getTypeDataFromUrl(navType, url),
        contextSnippets: [{ id: 'llm-desc', title: 'LLM Description', content: description }],
        description,
        url,
      };
      onAdd(nav);
      setName('');
      setDescription('');
      setUrl('');
      setNavType('hcp_help');
    }
  };

  // Helper to populate typeData based on nav type and URL
  const getTypeDataFromUrl = (type: NavigationType, urlValue: string): NavigationTypeData => {
    switch (type) {
      case 'hcp_navigate': return { pagePath: urlValue };
      case 'hcp_modal': return { modalPath: urlValue };
      case 'hcp_video': return { videoUrl: urlValue };
      case 'hcp_help': return { helpArticleUrl: urlValue };
      case 'hcp_external': return { externalUrl: urlValue };
      case 'hcp_tour': return { appcueId: urlValue };
      default: return {};
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            size="small"
            label="Description (for AI)"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl size="small" fullWidth>
            <Select
              value={navType}
              onChange={(e) => setNavType(e.target.value as NavigationType)}
            >
              {navigationTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            label={navType === 'hcp_tour' ? 'Appcue ID' : 'URL / Path'}
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            inputProps={{ style: { fontFamily: 'monospace' } }}
            placeholder={
              navType === 'hcp_navigate' ? '/settings/invoicing' :
              navType === 'hcp_tour' ? 'abc123-def456' :
              'https://...'
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!name || !url}>Add</Button>
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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [team, setTeam] = useState<CalendlyTeam>('onboarding');

  const handleAdd = () => {
    if (name && url) {
      const slugId = generateSlugId(name);
      const cal: CalendlyLink = {
        slugId,
        name,
        status: 'draft',
        team,
        url,
        contextSnippets: [{ id: 'llm-desc', title: 'LLM Description', content: description }],
        description,
      };
      onAdd(cal);
      setName('');
      setDescription('');
      setUrl('');
      setTeam('onboarding');
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            size="small"
            label="Description (for AI)"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl size="small" fullWidth>
            <Select
              value={team}
              onChange={(e) => setTeam(e.target.value as CalendlyTeam)}
            >
              <MenuItem value="sales">Sales</MenuItem>
              <MenuItem value="onboarding">Onboarding</MenuItem>
              <MenuItem value="support">Support</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Calendly Booking URL"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            inputProps={{ style: { fontFamily: 'monospace' } }}
            placeholder="https://calendly.com/..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!name || !url}>Add</Button>
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

// Helper to generate slugId from name
function generateSlugId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper to get URL from navigation item
function getNavigationUrl(item: NavigationItem): string {
  if (item.url) return item.url;
  const td = item.typeData || {};
  switch (item.navigationType) {
    case 'hcp_navigate': return td.pagePath || '';
    case 'hcp_modal': return td.modalPath || td.modalId || '';
    case 'hcp_video': return td.videoUrl || '';
    case 'hcp_help': return td.helpArticleUrl || '';
    case 'hcp_external': return td.externalUrl || '';
    case 'hcp_tour': return td.appcueId || '';
    default: return '';
  }
}

// Create default navigation item
function createDefaultNavigationItem(): NavigationItem {
  return {
    slugId: '',
    name: '',
    status: 'draft',
    navigationType: 'hcp_navigate',
    typeData: {},
    contextSnippets: [{ id: 'llm-desc', title: 'LLM Description', content: '' }],
    prompt: '',
    tools: [],
    description: '',
    url: '',
  };
}

// Type-specific form fields component
function NavigationTypeFields({
  navigationType,
  typeData,
  onChange,
}: {
  navigationType: NavigationType;
  typeData: NavigationTypeData;
  onChange: (typeData: NavigationTypeData) => void;
}) {
  switch (navigationType) {
    case 'hcp_navigate':
      return (
        <TextField
          size="small"
          fullWidth
          label="Page Path"
          placeholder="/settings/invoicing"
          value={typeData.pagePath || ''}
          onChange={(e) => onChange({ ...typeData, pagePath: e.target.value })}
          inputProps={{ style: { fontFamily: 'monospace' } }}
          helperText="The path in the product to navigate to"
        />
      );

    case 'hcp_modal':
      return (
        <Stack spacing={2}>
          <TextField
            size="small"
            fullWidth
            label="Modal Path (optional)"
            placeholder="/settings/invoicing?modal=create"
            value={typeData.modalPath || ''}
            onChange={(e) => onChange({ ...typeData, modalPath: e.target.value })}
            inputProps={{ style: { fontFamily: 'monospace' } }}
            helperText="URL path that opens this modal"
          />
          <TextField
            size="small"
            fullWidth
            label="Modal ID"
            placeholder="create-invoice-modal"
            value={typeData.modalId || ''}
            onChange={(e) => onChange({ ...typeData, modalId: e.target.value })}
            inputProps={{ style: { fontFamily: 'monospace' } }}
            helperText="Programmatic ID for opening the modal directly"
          />
        </Stack>
      );

    case 'hcp_video':
      return (
        <Stack spacing={2}>
          <TextField
            size="small"
            fullWidth
            label="Video URL"
            placeholder="https://youtube.com/watch?v=..."
            value={typeData.videoUrl || ''}
            onChange={(e) => onChange({ ...typeData, videoUrl: e.target.value })}
            inputProps={{ style: { fontFamily: 'monospace' } }}
            helperText="YouTube, Vimeo, or other embeddable video URL"
          />
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              label="Duration (seconds)"
              type="number"
              value={typeData.videoDurationSeconds || ''}
              onChange={(e) => onChange({ ...typeData, videoDurationSeconds: parseInt(e.target.value) || undefined })}
              sx={{ width: 150 }}
            />
            <TextField
              size="small"
              fullWidth
              label="Thumbnail URL (optional)"
              placeholder="https://..."
              value={typeData.videoThumbnail || ''}
              onChange={(e) => onChange({ ...typeData, videoThumbnail: e.target.value })}
            />
          </Stack>
        </Stack>
      );

    case 'hcp_help':
      return (
        <Stack spacing={2}>
          <TextField
            size="small"
            fullWidth
            label="Help Article URL"
            placeholder="https://help.housecallpro.com/article/..."
            value={typeData.helpArticleUrl || ''}
            onChange={(e) => onChange({ ...typeData, helpArticleUrl: e.target.value })}
            inputProps={{ style: { fontFamily: 'monospace' } }}
          />
          <TextField
            size="small"
            fullWidth
            label="Article ID (optional)"
            placeholder="12345"
            value={typeData.helpArticleId || ''}
            onChange={(e) => onChange({ ...typeData, helpArticleId: e.target.value })}
            inputProps={{ style: { fontFamily: 'monospace' } }}
            helperText="Internal article ID for tracking"
          />
        </Stack>
      );

    case 'hcp_external':
      return (
        <TextField
          size="small"
          fullWidth
          label="External URL"
          placeholder="https://example.com/..."
          value={typeData.externalUrl || ''}
          onChange={(e) => onChange({ ...typeData, externalUrl: e.target.value })}
          inputProps={{ style: { fontFamily: 'monospace' } }}
          helperText="Full URL to an external website"
        />
      );

    case 'hcp_tour':
      return (
        <Stack spacing={2}>
          <TextField
            size="small"
            fullWidth
            label="Appcue Flow ID"
            placeholder="abc123-def456"
            value={typeData.appcueId || ''}
            onChange={(e) => onChange({ ...typeData, appcueId: e.target.value })}
            inputProps={{ style: { fontFamily: 'monospace' } }}
            helperText="The Appcue flow/tour ID to launch"
          />
          <TextField
            size="small"
            fullWidth
            label="Tour Name (optional)"
            placeholder="Invoice Setup Tour"
            value={typeData.tourName || ''}
            onChange={(e) => onChange({ ...typeData, tourName: e.target.value })}
            helperText="Human-readable name for reference"
          />
        </Stack>
      );

    default:
      return null;
  }
}

// Navigation edit modal
function NavigationEditModal({
  item,
  open,
  onClose,
  onSave,
  onDelete,
}: {
  item: NavigationItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (item: NavigationItem) => void;
  onDelete?: () => void;
}) {
  const [editedItem, setEditedItem] = useState<NavigationItem>(createDefaultNavigationItem());
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (item) {
      // Ensure contextSnippets has at least the LLM Description
      const snippets = item.contextSnippets?.length > 0
        ? item.contextSnippets
        : [{ id: 'llm-desc', title: 'LLM Description', content: item.description || '' }];
      setEditedItem({
        ...createDefaultNavigationItem(),
        ...item,
        contextSnippets: snippets,
        typeData: item.typeData || {},
      });
    } else {
      setEditedItem(createDefaultNavigationItem());
    }
    setActiveTab(0);
  }, [item, open]);

  // Auto-generate slugId from name if empty
  const handleNameChange = (name: string) => {
    const updates: Partial<NavigationItem> = { name };
    if (!editedItem.slugId || editedItem.slugId === generateSlugId(editedItem.name)) {
      updates.slugId = generateSlugId(name);
    }
    setEditedItem({ ...editedItem, ...updates });
  };

  // Update context snippets
  const handleSnippetChange = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...editedItem.contextSnippets];
    updated[index] = { ...updated[index], [field]: value };
    // Also update description from first snippet
    const newDesc = index === 0 && field === 'content' ? value : editedItem.description;
    setEditedItem({ ...editedItem, contextSnippets: updated, description: newDesc });
  };

  const handleAddSnippet = () => {
    const newId = `snippet-${Date.now()}`;
    setEditedItem({
      ...editedItem,
      contextSnippets: [...editedItem.contextSnippets, { id: newId, title: 'New Context', content: '' }],
    });
  };

  const handleRemoveSnippet = (index: number) => {
    if (index === 0) return; // Can't remove LLM Description
    setEditedItem({
      ...editedItem,
      contextSnippets: editedItem.contextSnippets.filter((_, i) => i !== index),
    });
  };

  // Build JSON payload
  const buildJsonPayload = () => {
    const payload: Record<string, unknown> = {
      slugId: editedItem.slugId,
      name: editedItem.name,
      status: editedItem.status,
      type: editedItem.navigationType,
      typeData: editedItem.typeData,
      context: editedItem.contextSnippets,
    };
    if (editedItem.prompt) payload.prompt = editedItem.prompt;
    if (editedItem.tools?.length) payload.tools = editedItem.tools;
    return payload;
  };

  const handleSave = () => {
    // Derive url from typeData
    const url = getNavigationUrl(editedItem);
    onSave({ ...editedItem, url, description: editedItem.contextSnippets[0]?.content || '' });
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6">
              {item ? 'Edit Navigation Resource' : 'New Navigation Resource'}
            </Typography>
            {editedItem.status && (
              <Chip
                label={navigationStatusOptions.find((s) => s.value === editedItem.status)?.label || editedItem.status}
                size="small"
                sx={{
                  bgcolor: alpha(
                    navigationStatusOptions.find((s) => s.value === editedItem.status)?.color || palette.grey[600],
                    0.1
                  ),
                  color: navigationStatusOptions.find((s) => s.value === editedItem.status)?.color || palette.grey[600],
                }}
              />
            )}
          </Stack>
          {onDelete && (
            <Button
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this navigation resource?')) {
                  onDelete();
                  onClose();
                }
              }}
            >
              Delete
            </Button>
          )}
        </Stack>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Basic Info" />
          <Tab label="Important Context" />
          <Tab label="AI Config" />
          <Tab label="JSON Payload" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: palette.grey[50] }}>
        {/* Tab 0: Basic Info */}
        {activeTab === 0 && (
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<LinkIcon />} title="Identity" />
              <Stack spacing={2}>
                <TextField
                  size="small"
                  fullWidth
                  label="Name"
                  value={editedItem.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Invoice Settings Page"
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    label="Slug ID"
                    value={editedItem.slugId}
                    onChange={(e) => setEditedItem({ ...editedItem, slugId: e.target.value })}
                    placeholder="invoice-settings-page"
                    inputProps={{ style: { fontFamily: 'monospace' } }}
                    helperText="Unique identifier (auto-generated from name)"
                    sx={{ flex: 1 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={editedItem.status}
                      onChange={(e) => setEditedItem({ ...editedItem, status: e.target.value as NavigationStatus })}
                    >
                      {navigationStatusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: opt.color,
                              }}
                            />
                            <span>{opt.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<CategoryIcon />} title="Type & Configuration" />
              <Stack spacing={3}>
                <FormControl fullWidth size="small">
                  <Select
                    value={editedItem.navigationType}
                    onChange={(e) => setEditedItem({
                      ...editedItem,
                      navigationType: e.target.value as NavigationType,
                      typeData: {}, // Reset type data when type changes
                    })}
                  >
                    {navigationTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Stack>
                          <Typography variant="body2" fontWeight={500}>{type.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{type.description}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ pl: 2, borderLeft: 3, borderColor: palette.primary }}>
                  <NavigationTypeFields
                    navigationType={editedItem.navigationType}
                    typeData={editedItem.typeData || {}}
                    onChange={(typeData) => setEditedItem({ ...editedItem, typeData })}
                  />
                </Box>
              </Stack>
            </Paper>
          </Stack>
        )}

        {/* Tab 1: Important Context */}
        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <SectionHeader icon={<TextSnippetIcon />} title="Important Context" count={editedItem.contextSnippets.length} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Context snippets help the AI understand when and how to use this navigation resource.
            </Typography>
            <Stack spacing={2}>
              {editedItem.contextSnippets.map((snippet, index) => (
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
                      {index === 0 && (
                        <Chip label="Required" size="small" color="primary" variant="outlined" />
                      )}
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
                      placeholder={index === 0 ? "Describe this resource for the AI..." : "Additional context..."}
                      value={snippet.content}
                      onChange={(e) => handleSnippetChange(index, 'content', e.target.value)}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
            <Button startIcon={<AddIcon />} size="small" onClick={handleAddSnippet} sx={{ mt: 2 }}>
              Add Context Snippet
            </Button>
          </Paper>
        )}

        {/* Tab 2: AI Config */}
        {activeTab === 2 && (
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<SmartToyIcon />} title="Prompt" />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Additional instructions for the AI when this navigation resource is relevant.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editedItem.prompt || ''}
                onChange={(e) => setEditedItem({ ...editedItem, prompt: e.target.value })}
                placeholder="e.g., When the user asks about invoice settings, guide them to this page and explain the key options available..."
              />
            </Paper>

            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<BuildIcon />} title="Tools" count={editedItem.tools?.length || 0} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                MCP tools that can be used with this navigation resource.
              </Typography>
              {(editedItem.tools?.length || 0) === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No tools configured
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {editedItem.tools?.map((tool, i) => (
                    <Paper key={i} variant="outlined" sx={{ p: 1.5 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                            {tool.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tool.description}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => setEditedItem({
                            ...editedItem,
                            tools: editedItem.tools?.filter((_, idx) => idx !== i),
                          })}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
              <Button
                startIcon={<AddIcon />}
                size="small"
                sx={{ mt: 1 }}
                onClick={() => {
                  const toolName = window.prompt('Enter tool name:');
                  if (toolName) {
                    const toolDesc = window.prompt('Enter tool description:') || '';
                    setEditedItem({
                      ...editedItem,
                      tools: [...(editedItem.tools || []), { name: toolName, description: toolDesc, parameters: {} }],
                    });
                  }
                }}
              >
                Add Tool
              </Button>
            </Paper>
          </Stack>
        )}

        {/* Tab 3: JSON Payload */}
        {activeTab === 3 && (
          <Paper sx={{ p: 3 }}>
            <SectionHeader icon={<TextSnippetIcon />} title="JSON Payload" />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This is the complete JSON representation of this navigation resource.
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: palette.grey[800],
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                overflow: 'auto',
                maxHeight: 500,
              }}
            >
              <pre style={{ margin: 0 }}>
                {JSON.stringify(buildJsonPayload(), null, 2)}
              </pre>
            </Paper>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!editedItem.name || !editedItem.slugId}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function NavigationManagementPage() {
  const { features, updateFeature } = useOnboarding();
  const [selectedItem, setSelectedItem] = useState<{
    item: NavigationItem;
    featureId: string;
    stageKey: StageKey;
    index: number;
  } | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Collect all navigation items across all features/stages
  const allNavItems: {
    featureId: string;
    featureName: string;
    stageKey: StageKey;
    stageName: string;
    item: NavigationItem;
    index: number;
  }[] = [];

  features.forEach((feature) => {
    stageKeys.forEach((stageKey) => {
      const stage = feature.stages[stageKey];
      (stage.navigation || []).forEach((nav, index) => {
        allNavItems.push({
          featureId: feature.id,
          featureName: feature.name,
          stageKey,
          stageName: stageConfig[stageKey].label,
          item: nav,
          index,
        });
      });
    });
  });

  const handleEdit = (entry: typeof allNavItems[0]) => {
    setSelectedItem({
      item: entry.item,
      featureId: entry.featureId,
      stageKey: entry.stageKey,
      index: entry.index,
    });
    setIsCreating(false);
    setEditorOpen(true);
  };

  const handleDelete = (entry: typeof allNavItems[0]) => {
    if (!window.confirm(`Delete "${entry.item.name}"?`)) return;

    const feature = features.find((f) => f.id === entry.featureId);
    if (!feature) return;

    const updatedFeature = {
      ...feature,
      stages: {
        ...feature.stages,
        [entry.stageKey]: {
          ...feature.stages[entry.stageKey],
          navigation: feature.stages[entry.stageKey].navigation.filter((_, i) => i !== entry.index),
        },
      },
    };
    updateFeature(updatedFeature);
  };

  const handleSave = (updatedItem: NavigationItem) => {
    if (!selectedItem) return;

    const feature = features.find((f) => f.id === selectedItem.featureId);
    if (!feature) return;

    const currentNav = [...feature.stages[selectedItem.stageKey].navigation];
    currentNav[selectedItem.index] = updatedItem;

    const updatedFeature = {
      ...feature,
      stages: {
        ...feature.stages,
        [selectedItem.stageKey]: {
          ...feature.stages[selectedItem.stageKey],
          navigation: currentNav,
        },
      },
    };
    updateFeature(updatedFeature);
    setSelectedItem(null);
  };

  const handleDeleteFromModal = () => {
    if (!selectedItem) return;

    const feature = features.find((f) => f.id === selectedItem.featureId);
    if (!feature) return;

    const updatedFeature = {
      ...feature,
      stages: {
        ...feature.stages,
        [selectedItem.stageKey]: {
          ...feature.stages[selectedItem.stageKey],
          navigation: feature.stages[selectedItem.stageKey].navigation.filter((_, i) => i !== selectedItem.index),
        },
      },
    };
    updateFeature(updatedFeature);
    setSelectedItem(null);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Navigation Resources</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage navigation items, links, and resources used across features
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disabled>
          Add Navigation
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>URL / ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Used In</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allNavItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No navigation resources defined
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              allNavItems.map((entry, i) => (
                <TableRow key={i} hover>
                  <TableCell>
                    <Stack>
                      <Typography fontWeight={500}>{entry.item.name}</Typography>
                      {entry.item.slugId && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {entry.item.slugId}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={navigationTypes.find((t) => t.value === entry.item.navigationType)?.label || entry.item.navigationType}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={navigationStatusOptions.find((s) => s.value === entry.item.status)?.label || entry.item.status || 'Draft'}
                      size="small"
                      sx={{
                        bgcolor: alpha(
                          navigationStatusOptions.find((s) => s.value === entry.item.status)?.color || palette.warning,
                          0.1
                        ),
                        color: navigationStatusOptions.find((s) => s.value === entry.item.status)?.color || palette.warning,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getNavigationUrl(entry.item) || entry.item.url || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {entry.featureName} → {entry.stageName}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(entry)}
                      sx={{ color: palette.primary }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(entry)}
                      sx={{ color: palette.error }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <NavigationEditModal
        item={selectedItem?.item || null}
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        onDelete={selectedItem ? handleDeleteFromModal : undefined}
      />
    </Box>
  );
}

// =============================================================================
// CALLS MANAGEMENT PAGE
// =============================================================================

const calendlyTeamOptions: { value: CalendlyTeam; label: string; color: string }[] = [
  { value: 'sales', label: 'Sales', color: palette.warning },
  { value: 'onboarding', label: 'Onboarding', color: palette.primary },
  { value: 'support', label: 'Support', color: palette.grey[600] },
];

const calendlyStatusOptions: { value: CalendlyStatus; label: string; color: string }[] = [
  { value: 'published', label: 'Published', color: palette.success },
  { value: 'draft', label: 'Draft', color: palette.warning },
  { value: 'archived', label: 'Archived', color: palette.grey[600] },
];

// Create default CalendlyLink
function createDefaultCalendlyLink(): CalendlyLink {
  return {
    slugId: '',
    name: '',
    status: 'draft',
    team: 'onboarding',
    eventType: '',
    url: '',
    contextSnippets: [{ id: 'llm-desc', title: 'LLM Description', content: '' }],
    prompt: '',
    tools: [],
    description: '',
  };
}

// Calls edit modal
function CallsEditModal({
  item,
  open,
  onClose,
  onSave,
  onDelete,
}: {
  item: CalendlyLink | null;
  open: boolean;
  onClose: () => void;
  onSave: (item: CalendlyLink) => void;
  onDelete?: () => void;
}) {
  const [editedItem, setEditedItem] = useState<CalendlyLink>(createDefaultCalendlyLink());
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (item) {
      const snippets = item.contextSnippets?.length
        ? item.contextSnippets
        : [{ id: 'llm-desc', title: 'LLM Description', content: item.description || '' }];
      setEditedItem({
        ...createDefaultCalendlyLink(),
        ...item,
        contextSnippets: snippets,
      });
    } else {
      setEditedItem(createDefaultCalendlyLink());
    }
    setActiveTab(0);
  }, [item, open]);

  // Auto-generate slugId from name
  const handleNameChange = (name: string) => {
    const updates: Partial<CalendlyLink> = { name };
    if (!editedItem.slugId || editedItem.slugId === generateSlugId(editedItem.name)) {
      updates.slugId = generateSlugId(name);
    }
    setEditedItem({ ...editedItem, ...updates });
  };

  // Update context snippets
  const handleSnippetChange = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...(editedItem.contextSnippets || [])];
    updated[index] = { ...updated[index], [field]: value };
    const newDesc = index === 0 && field === 'content' ? value : editedItem.description;
    setEditedItem({ ...editedItem, contextSnippets: updated, description: newDesc });
  };

  const handleAddSnippet = () => {
    const newId = `snippet-${Date.now()}`;
    setEditedItem({
      ...editedItem,
      contextSnippets: [...(editedItem.contextSnippets || []), { id: newId, title: 'New Context', content: '' }],
    });
  };

  const handleRemoveSnippet = (index: number) => {
    if (index === 0) return;
    setEditedItem({
      ...editedItem,
      contextSnippets: (editedItem.contextSnippets || []).filter((_, i) => i !== index),
    });
  };

  // Build JSON payload
  const buildJsonPayload = () => {
    const payload: Record<string, unknown> = {
      slugId: editedItem.slugId,
      name: editedItem.name,
      status: editedItem.status,
      team: editedItem.team,
      eventType: editedItem.eventType,
      bookingUrl: editedItem.url,
      context: editedItem.contextSnippets,
    };
    if (editedItem.prompt) payload.prompt = editedItem.prompt;
    if (editedItem.tools?.length) payload.tools = editedItem.tools;
    return payload;
  };

  const handleSave = () => {
    onSave({ ...editedItem, description: editedItem.contextSnippets?.[0]?.content || '' });
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6">
              {item ? 'Edit Call Type' : 'New Call Type'}
            </Typography>
            {editedItem.status && (
              <Chip
                label={calendlyStatusOptions.find((s) => s.value === editedItem.status)?.label || editedItem.status}
                size="small"
                sx={{
                  bgcolor: alpha(
                    calendlyStatusOptions.find((s) => s.value === editedItem.status)?.color || palette.grey[600],
                    0.1
                  ),
                  color: calendlyStatusOptions.find((s) => s.value === editedItem.status)?.color || palette.grey[600],
                }}
              />
            )}
          </Stack>
          {onDelete && (
            <Button
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this call type?')) {
                  onDelete();
                  onClose();
                }
              }}
            >
              Delete
            </Button>
          )}
        </Stack>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Basic Info" />
          <Tab label="Important Context" />
          <Tab label="AI Config" />
          <Tab label="JSON Payload" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: palette.grey[50] }}>
        {/* Tab 0: Basic Info */}
        {activeTab === 0 && (
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<PhoneIcon />} title="Identity" />
              <Stack spacing={2}>
                <TextField
                  size="small"
                  fullWidth
                  label="Name"
                  value={editedItem.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Invoicing Setup Call"
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    label="Slug ID"
                    value={editedItem.slugId || ''}
                    onChange={(e) => setEditedItem({ ...editedItem, slugId: e.target.value })}
                    placeholder="invoicing-setup-call"
                    inputProps={{ style: { fontFamily: 'monospace' } }}
                    helperText="Unique identifier"
                    sx={{ flex: 1 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={editedItem.status || 'draft'}
                      onChange={(e) => setEditedItem({ ...editedItem, status: e.target.value as CalendlyStatus })}
                    >
                      {calendlyStatusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: opt.color }} />
                            <span>{opt.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<CalendarMonthIcon />} title="Calendly Configuration" />
              <Stack spacing={2}>
                <FormControl fullWidth size="small">
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>Team</Typography>
                  <Select
                    value={editedItem.team}
                    onChange={(e) => setEditedItem({ ...editedItem, team: e.target.value as CalendlyTeam })}
                  >
                    {calendlyTeamOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: opt.color }} />
                          <span>{opt.label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  fullWidth
                  label="Calendly Event Type"
                  value={editedItem.eventType || ''}
                  onChange={(e) => setEditedItem({ ...editedItem, eventType: e.target.value })}
                  placeholder="e.g., 30-minute-onboarding-call"
                  helperText="The event type name in Calendly"
                />
                <TextField
                  size="small"
                  fullWidth
                  label="Calendly Booking Link"
                  value={editedItem.url}
                  onChange={(e) => setEditedItem({ ...editedItem, url: e.target.value })}
                  placeholder="https://calendly.com/hcp-onboarding/invoicing"
                  inputProps={{ style: { fontFamily: 'monospace' } }}
                  helperText="Full Calendly booking URL"
                />
              </Stack>
            </Paper>
          </Stack>
        )}

        {/* Tab 1: Important Context */}
        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <SectionHeader icon={<TextSnippetIcon />} title="Important Context" count={editedItem.contextSnippets?.length || 0} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Context snippets help the AI understand when to recommend this call type.
            </Typography>
            <Stack spacing={2}>
              {(editedItem.contextSnippets || []).map((snippet, index) => (
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
                      {index === 0 && (
                        <Chip label="Required" size="small" color="primary" variant="outlined" />
                      )}
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
                      placeholder={index === 0 ? "Describe when to recommend this call..." : "Additional context..."}
                      value={snippet.content}
                      onChange={(e) => handleSnippetChange(index, 'content', e.target.value)}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
            <Button startIcon={<AddIcon />} size="small" onClick={handleAddSnippet} sx={{ mt: 2 }}>
              Add Context Snippet
            </Button>
          </Paper>
        )}

        {/* Tab 2: AI Config */}
        {activeTab === 2 && (
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<SmartToyIcon />} title="Prompt" />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Additional instructions for the AI when recommending this call type.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editedItem.prompt || ''}
                onChange={(e) => setEditedItem({ ...editedItem, prompt: e.target.value })}
                placeholder="e.g., Recommend this call when the pro needs help setting up their first invoice..."
              />
            </Paper>

            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<BuildIcon />} title="Tools" count={editedItem.tools?.length || 0} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                MCP tools that can be used with this call type.
              </Typography>
              {(editedItem.tools?.length || 0) === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No tools configured
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {editedItem.tools?.map((tool, i) => (
                    <Paper key={i} variant="outlined" sx={{ p: 1.5 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                            {tool.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tool.description}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => setEditedItem({
                            ...editedItem,
                            tools: editedItem.tools?.filter((_, idx) => idx !== i),
                          })}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
              <Button
                startIcon={<AddIcon />}
                size="small"
                sx={{ mt: 1 }}
                onClick={() => {
                  const toolName = window.prompt('Enter tool name:');
                  if (toolName) {
                    const toolDesc = window.prompt('Enter tool description:') || '';
                    setEditedItem({
                      ...editedItem,
                      tools: [...(editedItem.tools || []), { name: toolName, description: toolDesc, parameters: {} }],
                    });
                  }
                }}
              >
                Add Tool
              </Button>
            </Paper>
          </Stack>
        )}

        {/* Tab 3: JSON Payload */}
        {activeTab === 3 && (
          <Paper sx={{ p: 3 }}>
            <SectionHeader icon={<TextSnippetIcon />} title="JSON Payload" />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This is the complete JSON representation of this call type.
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: palette.grey[800],
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                overflow: 'auto',
                maxHeight: 500,
              }}
            >
              <pre style={{ margin: 0 }}>
                {JSON.stringify(buildJsonPayload(), null, 2)}
              </pre>
            </Paper>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!editedItem.name || !editedItem.url}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function CallsManagementPage() {
  const { features, updateFeature } = useOnboarding();
  const [selectedItem, setSelectedItem] = useState<{
    item: CalendlyLink;
    featureId: string;
    stageKey: StageKey;
    index: number;
  } | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  // Collect all calendly items across all features/stages
  const allCallItems: {
    featureId: string;
    featureName: string;
    stageKey: StageKey;
    stageName: string;
    item: CalendlyLink;
    index: number;
  }[] = [];

  features.forEach((feature) => {
    stageKeys.forEach((stageKey) => {
      const stage = feature.stages[stageKey];
      (stage.calendlyTypes || []).forEach((cal, index) => {
        allCallItems.push({
          featureId: feature.id,
          featureName: feature.name,
          stageKey,
          stageName: stageConfig[stageKey].label,
          item: cal,
          index,
        });
      });
    });
  });

  const handleEdit = (entry: typeof allCallItems[0]) => {
    setSelectedItem({
      item: entry.item,
      featureId: entry.featureId,
      stageKey: entry.stageKey,
      index: entry.index,
    });
    setEditorOpen(true);
  };

  const handleDelete = (entry: typeof allCallItems[0]) => {
    if (!window.confirm(`Delete "${entry.item.name}"?`)) return;

    const feature = features.find((f) => f.id === entry.featureId);
    if (!feature) return;

    const updatedFeature = {
      ...feature,
      stages: {
        ...feature.stages,
        [entry.stageKey]: {
          ...feature.stages[entry.stageKey],
          calendlyTypes: feature.stages[entry.stageKey].calendlyTypes.filter((_, i) => i !== entry.index),
        },
      },
    };
    updateFeature(updatedFeature);
  };

  const handleSave = (updatedItem: CalendlyLink) => {
    if (!selectedItem) return;

    const feature = features.find((f) => f.id === selectedItem.featureId);
    if (!feature) return;

    const currentCalls = [...feature.stages[selectedItem.stageKey].calendlyTypes];
    currentCalls[selectedItem.index] = updatedItem;

    const updatedFeature = {
      ...feature,
      stages: {
        ...feature.stages,
        [selectedItem.stageKey]: {
          ...feature.stages[selectedItem.stageKey],
          calendlyTypes: currentCalls,
        },
      },
    };
    updateFeature(updatedFeature);
    setSelectedItem(null);
  };

  const handleDeleteFromModal = () => {
    if (!selectedItem) return;

    const feature = features.find((f) => f.id === selectedItem.featureId);
    if (!feature) return;

    const updatedFeature = {
      ...feature,
      stages: {
        ...feature.stages,
        [selectedItem.stageKey]: {
          ...feature.stages[selectedItem.stageKey],
          calendlyTypes: feature.stages[selectedItem.stageKey].calendlyTypes.filter((_, i) => i !== selectedItem.index),
        },
      },
    };
    updateFeature(updatedFeature);
    setSelectedItem(null);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Calls</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage Calendly event types and call scheduling
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disabled>
          Add Call Type
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Team</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Booking Link</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Used In</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allCallItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No call types defined
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              allCallItems.map((entry, i) => (
                <TableRow key={i} hover>
                  <TableCell>
                    <Stack>
                      <Typography fontWeight={500}>{entry.item.name}</Typography>
                      {entry.item.eventType && (
                        <Typography variant="caption" color="text.secondary">
                          {entry.item.eventType}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={entry.item.team.charAt(0).toUpperCase() + entry.item.team.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: alpha(
                          calendlyTeamOptions.find((t) => t.value === entry.item.team)?.color || palette.grey[600],
                          0.1
                        ),
                        color: calendlyTeamOptions.find((t) => t.value === entry.item.team)?.color || palette.grey[600],
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={calendlyStatusOptions.find((s) => s.value === entry.item.status)?.label || 'Draft'}
                      size="small"
                      sx={{
                        bgcolor: alpha(
                          calendlyStatusOptions.find((s) => s.value === entry.item.status)?.color || palette.warning,
                          0.1
                        ),
                        color: calendlyStatusOptions.find((s) => s.value === entry.item.status)?.color || palette.warning,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.item.url}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {entry.featureName} → {entry.stageName}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(entry)}
                      sx={{ color: palette.primary }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(entry)}
                      sx={{ color: palette.error }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CallsEditModal
        item={selectedItem?.item || null}
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        onDelete={selectedItem ? handleDeleteFromModal : undefined}
      />
    </Box>
  );
}

// =============================================================================
// ONBOARDING ITEMS MANAGEMENT PAGE
// =============================================================================

const onboardingItemStatusOptions: { value: OnboardingItemStatus; label: string; color: string }[] = [
  { value: 'published', label: 'Published', color: palette.success },
  { value: 'draft', label: 'Draft', color: palette.warning },
  { value: 'archived', label: 'Archived', color: palette.grey[600] },
];

const onboardingItemTypeOptions: { value: OnboardingItemType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'in_product', label: 'In-Product', icon: <ComputerIcon fontSize="small" />, color: palette.primary },
  { value: 'rep_facing', label: 'Rep-Facing', icon: <PersonIcon fontSize="small" />, color: palette.secondary },
];

// Create default context snippets for onboarding items
function createDefaultOnboardingItemSnippets(description: string): ContextSnippet[] {
  return [
    { id: 'llm-desc', title: 'LLM Description', content: description || '' },
    { id: 'value-statement', title: 'Value Statement', content: '' },
  ];
}

// Create default OnboardingItemDefinition
function createDefaultOnboardingItem(): OnboardingItemDefinition {
  return {
    id: '',
    title: '',
    status: 'draft',
    type: 'in_product',
    labels: [],
    contextSnippets: createDefaultOnboardingItemSnippets(''),
    prompt: '',
    tools: [],
    description: '',
  };
}

// Onboarding Item edit modal
function OnboardingItemEditModal({
  item,
  open,
  onClose,
  onSave,
  onDelete,
}: {
  item: OnboardingItemDefinition | null;
  open: boolean;
  onClose: () => void;
  onSave: (item: OnboardingItemDefinition) => void;
  onDelete?: () => void;
}) {
  const [editedItem, setEditedItem] = useState<OnboardingItemDefinition>(createDefaultOnboardingItem());
  const [activeTab, setActiveTab] = useState(0);
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    if (item) {
      // Ensure contextSnippets has the required default snippets
      const snippets = item.contextSnippets?.length
        ? item.contextSnippets
        : createDefaultOnboardingItemSnippets(item.description || '');
      setEditedItem({
        ...createDefaultOnboardingItem(),
        ...item,
        contextSnippets: snippets,
      });
    } else {
      setEditedItem(createDefaultOnboardingItem());
    }
    setActiveTab(0);
  }, [item, open]);

  // Auto-generate ID from title if empty
  const handleTitleChange = (title: string) => {
    const updates: Partial<OnboardingItemDefinition> = { title };
    if (!editedItem.id || editedItem.id === generateSlugId(editedItem.title)) {
      updates.id = generateSlugId(title);
    }
    setEditedItem({ ...editedItem, ...updates });
  };

  // Update context snippets
  const handleSnippetChange = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...(editedItem.contextSnippets || [])];
    updated[index] = { ...updated[index], [field]: value };
    // Update description from first snippet
    const newDesc = index === 0 && field === 'content' ? value : editedItem.description;
    setEditedItem({ ...editedItem, contextSnippets: updated, description: newDesc });
  };

  const handleAddSnippet = () => {
    const newId = `snippet-${Date.now()}`;
    setEditedItem({
      ...editedItem,
      contextSnippets: [...(editedItem.contextSnippets || []), { id: newId, title: 'New Context', content: '' }],
    });
  };

  const handleRemoveSnippet = (index: number) => {
    if (index < 2) return; // Can't remove LLM Description or Value Statement
    setEditedItem({
      ...editedItem,
      contextSnippets: (editedItem.contextSnippets || []).filter((_, i) => i !== index),
    });
  };

  // Label management
  const handleAddLabel = () => {
    if (newLabel.trim() && !editedItem.labels?.includes(newLabel.trim())) {
      setEditedItem({
        ...editedItem,
        labels: [...(editedItem.labels || []), newLabel.trim()],
      });
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (label: string) => {
    setEditedItem({
      ...editedItem,
      labels: (editedItem.labels || []).filter((l) => l !== label),
    });
  };

  // Completion API handling
  const handleCompletionApiChange = (field: keyof CompletionApi, value: string) => {
    setEditedItem({
      ...editedItem,
      completionApi: {
        eventName: editedItem.completionApi?.eventName || '',
        description: editedItem.completionApi?.description || '',
        ...editedItem.completionApi,
        [field]: value,
      },
    });
  };

  // Build JSON payload
  const buildJsonPayload = () => {
    const payload: Record<string, unknown> = {
      id: editedItem.id,
      title: editedItem.title,
      status: editedItem.status,
      type: editedItem.type,
    };
    if (editedItem.type === 'in_product' && editedItem.completionApi) {
      payload.completionApi = editedItem.completionApi;
    }
    if (editedItem.type === 'rep_facing' && editedItem.repInstructions) {
      payload.repInstructions = editedItem.repInstructions;
    }
    if (editedItem.labels?.length) payload.labels = editedItem.labels;
    payload.context = editedItem.contextSnippets;
    if (editedItem.prompt) payload.prompt = editedItem.prompt;
    if (editedItem.tools?.length) payload.tools = editedItem.tools;
    if (editedItem.estimatedMinutes) payload.estimatedMinutes = editedItem.estimatedMinutes;
    if (editedItem.actionUrl) payload.actionUrl = editedItem.actionUrl;
    return payload;
  };

  const handleSave = () => {
    onSave({ ...editedItem, description: editedItem.contextSnippets?.[0]?.content || '' });
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6">
              {item ? 'Edit Onboarding Item' : 'New Onboarding Item'}
            </Typography>
            {editedItem.status && (
              <Chip
                label={onboardingItemStatusOptions.find((s) => s.value === editedItem.status)?.label || editedItem.status}
                size="small"
                sx={{
                  bgcolor: alpha(
                    onboardingItemStatusOptions.find((s) => s.value === editedItem.status)?.color || palette.grey[600],
                    0.1
                  ),
                  color: onboardingItemStatusOptions.find((s) => s.value === editedItem.status)?.color || palette.grey[600],
                }}
              />
            )}
          </Stack>
          {onDelete && (
            <Button
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this onboarding item?')) {
                  onDelete();
                  onClose();
                }
              }}
            >
              Delete
            </Button>
          )}
        </Stack>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Basic Info" />
          <Tab label="Important Context" />
          <Tab label="AI Config" />
          <Tab label="JSON Payload" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: palette.grey[50] }}>
        {/* Tab 0: Basic Info */}
        {activeTab === 0 && (
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<ChecklistIcon />} title="Identity" />
              <Stack spacing={2}>
                <TextField
                  size="small"
                  fullWidth
                  label="Name"
                  value={editedItem.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Create First Invoice"
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    label="ID"
                    value={editedItem.id}
                    onChange={(e) => setEditedItem({ ...editedItem, id: e.target.value })}
                    placeholder="create-first-invoice"
                    inputProps={{ style: { fontFamily: 'monospace' } }}
                    helperText="Unique identifier"
                    sx={{ flex: 1 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={editedItem.status || 'draft'}
                      onChange={(e) => setEditedItem({ ...editedItem, status: e.target.value as OnboardingItemStatus })}
                    >
                      {onboardingItemStatusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: opt.color }} />
                            <span>{opt.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<CategoryIcon />} title="Type" />
              <FormControl fullWidth size="small">
                <Select
                  value={editedItem.type}
                  onChange={(e) => setEditedItem({ ...editedItem, type: e.target.value as OnboardingItemType })}
                >
                  {onboardingItemTypeOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ color: opt.color }}>{opt.icon}</Box>
                        <span>{opt.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {editedItem.type === 'in_product'
                  ? 'Completion is tracked automatically via product events'
                  : 'Completion is tracked manually by reps'}
              </Typography>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<FlagRoundedIcon />} title="Completion Logic" />
              {editedItem.type === 'in_product' ? (
                <Stack spacing={2}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Event Name"
                    value={editedItem.completionApi?.eventName || ''}
                    onChange={(e) => handleCompletionApiChange('eventName', e.target.value)}
                    placeholder="e.g., invoice.created"
                    inputProps={{ style: { fontFamily: 'monospace' } }}
                    helperText="The event that triggers completion"
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="API Endpoint (optional)"
                    value={editedItem.completionApi?.endpoint || ''}
                    onChange={(e) => handleCompletionApiChange('endpoint', e.target.value)}
                    placeholder="e.g., /api/invoices/status"
                    inputProps={{ style: { fontFamily: 'monospace' } }}
                    helperText="Endpoint to check completion status"
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="Description"
                    value={editedItem.completionApi?.description || ''}
                    onChange={(e) => handleCompletionApiChange('description', e.target.value)}
                    placeholder="e.g., Triggers when the pro creates their first invoice"
                    multiline
                    rows={2}
                    helperText="Human-readable explanation of when this completes"
                  />
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Rep Instructions"
                    value={editedItem.repInstructions || ''}
                    onChange={(e) => setEditedItem({ ...editedItem, repInstructions: e.target.value })}
                    placeholder="e.g., Mark complete after verifying the pro understands..."
                    multiline
                    rows={3}
                    helperText="Instructions for reps on when to mark this complete"
                  />
                </Stack>
              )}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<CategoryIcon />} title="Labels" count={editedItem.labels?.length || 0} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Labels for categorization and visual representation.
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {(editedItem.labels || []).map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    size="small"
                    onDelete={() => handleRemoveLabel(label)}
                  />
                ))}
                {(editedItem.labels || []).length === 0 && (
                  <Typography variant="body2" color="text.secondary">No labels added</Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Add label..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLabel()}
                  sx={{ flex: 1 }}
                />
                <Button variant="outlined" size="small" onClick={handleAddLabel}>Add</Button>
              </Stack>
            </Paper>
          </Stack>
        )}

        {/* Tab 1: Important Context */}
        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <SectionHeader icon={<TextSnippetIcon />} title="Important Context" count={editedItem.contextSnippets?.length || 0} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Context snippets help the AI understand this onboarding item.
            </Typography>
            <Stack spacing={2}>
              {(editedItem.contextSnippets || []).map((snippet, index) => (
                <Paper key={snippet.id} variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        size="small"
                        label="Title"
                        value={snippet.title}
                        onChange={(e) => handleSnippetChange(index, 'title', e.target.value)}
                        sx={{ flex: 1 }}
                        disabled={index < 2} // LLM Description and Value Statement titles are fixed
                      />
                      {index < 2 && (
                        <Chip label="Required" size="small" color="primary" variant="outlined" />
                      )}
                      {index >= 2 && (
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
                      placeholder={
                        index === 0 ? "Describe this item for the AI..." :
                        index === 1 ? "Why is this valuable for the pro?" :
                        "Additional context..."
                      }
                      value={snippet.content}
                      onChange={(e) => handleSnippetChange(index, 'content', e.target.value)}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
            <Button startIcon={<AddIcon />} size="small" onClick={handleAddSnippet} sx={{ mt: 2 }}>
              Add Context Snippet
            </Button>
          </Paper>
        )}

        {/* Tab 2: AI Config */}
        {activeTab === 2 && (
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<SmartToyIcon />} title="Prompt" />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Additional instructions for the AI when this onboarding item is relevant.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editedItem.prompt || ''}
                onChange={(e) => setEditedItem({ ...editedItem, prompt: e.target.value })}
                placeholder="e.g., When helping with this item, guide the pro through the invoice creation flow step by step..."
              />
            </Paper>

            <Paper sx={{ p: 3 }}>
              <SectionHeader icon={<BuildIcon />} title="Tools" count={editedItem.tools?.length || 0} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                MCP tools that can be used to help complete this item.
              </Typography>
              {(editedItem.tools?.length || 0) === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No tools configured
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {editedItem.tools?.map((tool, i) => (
                    <Paper key={i} variant="outlined" sx={{ p: 1.5 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                            {tool.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tool.description}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => setEditedItem({
                            ...editedItem,
                            tools: editedItem.tools?.filter((_, idx) => idx !== i),
                          })}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
              <Button
                startIcon={<AddIcon />}
                size="small"
                sx={{ mt: 1 }}
                onClick={() => {
                  const toolName = window.prompt('Enter tool name:');
                  if (toolName) {
                    const toolDesc = window.prompt('Enter tool description:') || '';
                    setEditedItem({
                      ...editedItem,
                      tools: [...(editedItem.tools || []), { name: toolName, description: toolDesc, parameters: {} }],
                    });
                  }
                }}
              >
                Add Tool
              </Button>
            </Paper>
          </Stack>
        )}

        {/* Tab 3: JSON Payload */}
        {activeTab === 3 && (
          <Paper sx={{ p: 3 }}>
            <SectionHeader icon={<TextSnippetIcon />} title="JSON Payload" />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This is the complete JSON representation of this onboarding item.
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: palette.grey[800],
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                overflow: 'auto',
                maxHeight: 500,
              }}
            >
              <pre style={{ margin: 0 }}>
                {JSON.stringify(buildJsonPayload(), null, 2)}
              </pre>
            </Paper>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!editedItem.title || !editedItem.id}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function OnboardingItemsManagementPage() {
  const [selectedItem, setSelectedItem] = useState<OnboardingItemDefinition | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [localItems, setLocalItems] = useState<OnboardingItemDefinition[]>(onboardingItems);

  const handleEdit = (item: OnboardingItemDefinition) => {
    setSelectedItem(item);
    setEditorOpen(true);
  };

  const handleDelete = (item: OnboardingItemDefinition) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setLocalItems(localItems.filter((i) => i.id !== item.id));
  };

  const handleSave = (updatedItem: OnboardingItemDefinition) => {
    const index = localItems.findIndex((i) => i.id === selectedItem?.id);
    if (index >= 0) {
      const updated = [...localItems];
      updated[index] = updatedItem;
      setLocalItems(updated);
    }
    setSelectedItem(null);
  };

  const handleDeleteFromModal = () => {
    if (!selectedItem) return;
    setLocalItems(localItems.filter((i) => i.id !== selectedItem.id));
    setSelectedItem(null);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Onboarding Items</Typography>
          <Typography variant="body2" color="text.secondary">
            Centralized repository of onboarding tasks and actions
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disabled>
          Add Item
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Labels</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Completion</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No onboarding items defined
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              localItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {item.type === 'in_product' ? (
                        <ComputerIcon fontSize="small" sx={{ color: palette.primary }} />
                      ) : (
                        <PersonIcon fontSize="small" sx={{ color: palette.secondary }} />
                      )}
                      <Stack>
                        <Typography fontWeight={500}>{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {item.id}
                        </Typography>
                      </Stack>
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
                    <Chip
                      label={onboardingItemStatusOptions.find((s) => s.value === item.status)?.label || 'Draft'}
                      size="small"
                      sx={{
                        bgcolor: alpha(
                          onboardingItemStatusOptions.find((s) => s.value === item.status)?.color || palette.warning,
                          0.1
                        ),
                        color: onboardingItemStatusOptions.find((s) => s.value === item.status)?.color || palette.warning,
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
                    {item.type === 'in_product' && item.completionApi ? (
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {item.completionApi.eventName}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {item.type === 'rep_facing' ? 'Manual' : '—'}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(item)}
                      sx={{ color: palette.primary }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(item)}
                      sx={{ color: palette.error }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <OnboardingItemEditModal
        item={selectedItem}
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        onDelete={selectedItem ? handleDeleteFromModal : undefined}
      />
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
    <PlanningWrapper elementId="view-admin">
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
    </PlanningWrapper>
  );
}
