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
  alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import BuildIcon from '@mui/icons-material/Build';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import { useOnboarding } from '../../context';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
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

// Palette for consistent styling
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

// Stage key type (matches Feature.stages keys)
type StageKey = 'notAttached' | 'attached' | 'activated' | 'engaged';

// Stage configuration
const stageConfig: Record<StageKey, { label: string; color: string }> = {
  notAttached: { label: 'Not Attached', color: palette.grey[600] },
  attached: { label: 'Attached', color: palette.warning },
  activated: { label: 'Activated', color: palette.primary },
  engaged: { label: 'Engaged', color: palette.success },
};

const stageKeys: StageKey[] = ['notAttached', 'attached', 'activated', 'engaged'];

// Navigation type options
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

// Section header component
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

// Context snippets editor (for Important Context section)
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
    // Don't allow removing the value prop (first item)
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
                  disabled={index === 0} // Value prop title is fixed
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

// Navigation editor (stacked format for readability)
function NavigationEditor({
  items,
  onChange,
}: {
  items: NavigationItem[];
  onChange: (items: NavigationItem[]) => void;
}) {
  const handleItemChange = (index: number, field: keyof NavigationItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddItem = () => {
    onChange([...items, { name: '', description: '', url: '', navigationType: 'hcp_help_article' }]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleOpenUrl = (url: string) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <Box>
      <Stack spacing={1.5}>
        {items.map((item, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Navigation Item {index + 1}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenUrl(item.url)}
                    disabled={!item.url}
                    title="Open URL"
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleRemoveItem(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              <TextField
                size="small"
                label="Name"
                fullWidth
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              />
              <TextField
                size="small"
                label="LLM Description"
                fullWidth
                multiline
                rows={2}
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              />
              <TextField
                size="small"
                label="URL"
                fullWidth
                value={item.url}
                onChange={(e) => handleItemChange(index, 'url', e.target.value)}
                InputProps={{
                  sx: { fontFamily: 'monospace', fontSize: '0.85rem' },
                }}
              />
              <FormControl size="small" fullWidth>
                <Select
                  value={item.navigationType}
                  onChange={(e) => handleItemChange(index, 'navigationType', e.target.value)}
                  displayEmpty
                >
                  {navigationTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>
        ))}
      </Stack>
      <Button startIcon={<AddIcon />} size="small" onClick={handleAddItem} sx={{ mt: 1.5 }}>
        Add Navigation
      </Button>
    </Box>
  );
}

// Calendly editor component (stacked format for readability)
function CalendlyEditor({
  links,
  onChange,
}: {
  links: CalendlyLink[];
  onChange: (links: CalendlyLink[]) => void;
}) {
  const handleLinkChange = (index: number, field: keyof CalendlyLink, value: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddLink = () => {
    onChange([...links, { name: '', url: '', team: 'onboarding', description: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const handleOpenUrl = (url: string) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <Box>
      <Stack spacing={1.5}>
        {links.map((link, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Calendly Event Type {index + 1}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenUrl(link.url)}
                    disabled={!link.url}
                    title="Open URL"
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleRemoveLink(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              <TextField
                size="small"
                label="Call Type Name"
                fullWidth
                value={link.name}
                onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
              />
              <TextField
                size="small"
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={link.description}
                onChange={(e) => handleLinkChange(index, 'description', e.target.value)}
              />
              <TextField
                size="small"
                label="Calendly URL"
                fullWidth
                value={link.url}
                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                InputProps={{
                  sx: { fontFamily: 'monospace', fontSize: '0.85rem' },
                }}
              />
            </Stack>
          </Paper>
        ))}
      </Stack>
      <Button startIcon={<AddIcon />} size="small" onClick={handleAddLink} sx={{ mt: 1.5 }}>
        Add Calendly Event Type
      </Button>
    </Box>
  );
}

// MCP Tool editor component (stacked format for readability)
function ToolEditor({
  tools,
  onChange,
}: {
  tools: McpTool[];
  onChange: (tools: McpTool[]) => void;
}) {
  const handleToolChange = (index: number, field: keyof McpTool, value: string | object) => {
    const updated = [...tools];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddTool = () => {
    onChange([...tools, { name: '', description: '', parameters: {} }]);
  };

  const handleRemoveTool = (index: number) => {
    onChange(tools.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Stack spacing={1.5}>
        {tools.map((tool, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Tool {index + 1}
                </Typography>
                <IconButton size="small" onClick={() => handleRemoveTool(index)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
              <TextField
                size="small"
                label="Tool Name"
                fullWidth
                value={tool.name}
                onChange={(e) => handleToolChange(index, 'name', e.target.value)}
                InputProps={{
                  sx: { fontFamily: 'monospace' },
                }}
              />
              <TextField
                size="small"
                label="Tool Description"
                fullWidth
                multiline
                rows={2}
                value={tool.description}
                onChange={(e) => handleToolChange(index, 'description', e.target.value)}
              />
              <TextField
                size="small"
                label="Parameters (JSON)"
                fullWidth
                multiline
                rows={4}
                value={JSON.stringify(tool.parameters, null, 2)}
                onChange={(e) => {
                  try {
                    handleToolChange(index, 'parameters', JSON.parse(e.target.value));
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                InputProps={{
                  sx: { fontFamily: 'monospace', fontSize: '0.85rem' },
                }}
                helperText="JSON object defining tool parameters"
              />
            </Stack>
          </Paper>
        ))}
      </Stack>
      <Button startIcon={<AddIcon />} size="small" onClick={handleAddTool} sx={{ mt: 1.5 }}>
        Add Tool
      </Button>
    </Box>
  );
}

// Onboarding items editor component (for centralized onboarding items)
function OnboardingItemsEditor({
  assignments,
  onChange,
}: {
  assignments: OnboardingItemAssignment[];
  onChange: (assignments: OnboardingItemAssignment[]) => void;
}) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Get assigned item IDs
  const assignedIds = assignments.map((a) => a.itemId);

  // Get available items (not yet assigned)
  const availableItems = onboardingItems.filter((item) => !assignedIds.includes(item.id));

  const handleAddItem = (itemId: string) => {
    onChange([...assignments, { itemId, required: true }]);
    setShowAddDialog(false);
  };

  const handleRemoveItem = (itemId: string) => {
    onChange(assignments.filter((a) => a.itemId !== itemId));
  };

  const handleToggleRequired = (itemId: string) => {
    onChange(
      assignments.map((a) =>
        a.itemId === itemId ? { ...a, required: !a.required } : a
      )
    );
  };

  const handleUpdateNote = (itemId: string, note: string) => {
    onChange(
      assignments.map((a) =>
        a.itemId === itemId ? { ...a, stageSpecificNote: note || undefined } : a
      )
    );
  };

  // Get item definition by ID
  const getItemDef = (itemId: string): OnboardingItemDefinition | undefined => {
    return onboardingItems.find((item) => item.id === itemId);
  };

  return (
    <Box>
      <Stack spacing={1.5}>
        {assignments.map((assignment) => {
          const itemDef = getItemDef(assignment.itemId);
          if (!itemDef) return null;

          return (
            <Paper key={assignment.itemId} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                {/* Header row */}
                <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {itemDef.type === 'in_product' ? (
                        <ComputerIcon fontSize="small" sx={{ color: palette.primary }} />
                      ) : (
                        <PersonIcon fontSize="small" sx={{ color: palette.secondary }} />
                      )}
                      <Typography variant="subtitle2" fontWeight={600}>
                        {itemDef.title}
                      </Typography>
                      <Chip
                        label={itemDef.type === 'in_product' ? 'In-Product' : 'Rep-Facing'}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor:
                            itemDef.type === 'in_product'
                              ? alpha(palette.primary, 0.1)
                              : alpha(palette.secondary, 0.1),
                          color: itemDef.type === 'in_product' ? palette.primary : palette.secondary,
                        }}
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {itemDef.description}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => handleRemoveItem(assignment.itemId)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {/* Completion API info for in_product items */}
                {itemDef.type === 'in_product' && itemDef.completionApi && (
                  <Box
                    sx={{
                      bgcolor: alpha(palette.primary, 0.04),
                      p: 1.5,
                      borderRadius: 1,
                      border: `1px solid ${alpha(palette.primary, 0.1)}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Completion Tracking
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          color: palette.grey[800],
                        }}
                      >
                        Event: {itemDef.completionApi.eventName}
                      </Typography>
                      {itemDef.completionApi.endpoint && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            color: palette.grey[600],
                          }}
                        >
                          Endpoint: {itemDef.completionApi.endpoint}
                        </Typography>
                      )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {itemDef.completionApi.description}
                    </Typography>
                  </Box>
                )}

                {/* Rep instructions for rep_facing items */}
                {itemDef.type === 'rep_facing' && itemDef.repInstructions && (
                  <Box
                    sx={{
                      bgcolor: alpha(palette.secondary, 0.04),
                      p: 1.5,
                      borderRadius: 1,
                      border: `1px solid ${alpha(palette.secondary, 0.1)}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Rep Instructions
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {itemDef.repInstructions}
                    </Typography>
                  </Box>
                )}

                {/* Required toggle and stage-specific note */}
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={assignment.required ? 'required' : 'optional'}
                      onChange={(e) => handleToggleRequired(assignment.itemId)}
                    >
                      <MenuItem value="required">Required</MenuItem>
                      <MenuItem value="optional">Optional</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    fullWidth
                    label="Stage-specific note"
                    placeholder="Add context for this feature's use of this item..."
                    value={assignment.stageSpecificNote || ''}
                    onChange={(e) => handleUpdateNote(assignment.itemId, e.target.value)}
                  />
                </Stack>

                {/* Meta info */}
                <Stack direction="row" spacing={2}>
                  {itemDef.estimatedMinutes && (
                    <Typography variant="caption" color="text.secondary">
                      ~{itemDef.estimatedMinutes} min
                    </Typography>
                  )}
                  {itemDef.actionUrl && (
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: 'monospace', color: palette.grey[600] }}
                    >
                      {itemDef.actionUrl}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      {/* Add item button */}
      <Button
        startIcon={<AddIcon />}
        size="small"
        onClick={() => setShowAddDialog(true)}
        sx={{ mt: 1.5 }}
        disabled={availableItems.length === 0}
      >
        Add Onboarding Item
      </Button>

      {/* Add item dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Onboarding Item</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select an item from the central repository to add to this feature's stage.
          </Typography>
          <Stack spacing={1}>
            {availableItems.map((item) => (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: alpha(palette.primary, 0.04),
                    borderColor: palette.primary,
                  },
                }}
                onClick={() => handleAddItem(item.id)}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {item.type === 'in_product' ? (
                        <ComputerIcon fontSize="small" sx={{ color: palette.primary }} />
                      ) : (
                        <PersonIcon fontSize="small" sx={{ color: palette.secondary }} />
                      )}
                      <Typography variant="subtitle2" fontWeight={600}>
                        {item.title}
                      </Typography>
                      <Chip
                        label={item.type === 'in_product' ? 'In-Product' : 'Rep-Facing'}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.65rem',
                          bgcolor:
                            item.type === 'in_product'
                              ? alpha(palette.primary, 0.1)
                              : alpha(palette.secondary, 0.1),
                          color: item.type === 'in_product' ? palette.primary : palette.secondary,
                        }}
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {item.description}
                    </Typography>
                    {item.type === 'in_product' && item.completionApi && (
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          display: 'block',
                          fontFamily: 'monospace',
                          color: palette.grey[600],
                        }}
                      >
                        Event: {item.completionApi.eventName}
                      </Typography>
                    )}
                  </Box>
                  <Button size="small" variant="outlined">
                    Add
                  </Button>
                </Stack>
              </Paper>
            ))}
            {availableItems.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                All available items have been added to this stage.
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Access conditions logic builder for Not Attached stage
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

      {/* Operator selector */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight={500}>
          Match:
        </Typography>
        <ToggleButtonGroup
          value={rule.operator}
          exclusive
          onChange={handleOperatorChange}
          size="small"
        >
          <ToggleButton value="AND" sx={{ px: 2 }}>
            ALL (AND)
          </ToggleButton>
          <ToggleButton value="OR" sx={{ px: 2 }}>
            ANY (OR)
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Conditions list */}
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
                  '&:hover': {
                    bgcolor: condition.negated ? alpha(palette.error, 0.2) : alpha(palette.success, 0.2),
                  },
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
                  color: palette.grey[800],
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
        {rule.conditions.length > 1 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', my: 1 }}
          >
            {rule.operator === 'AND' ? 'All conditions must be true' : 'At least one condition must be true'}
          </Typography>
        )}
      </Box>

      {/* Add new condition */}
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
        <Button variant="outlined" size="small" onClick={handleAddCondition}>
          Add
        </Button>
      </Stack>
    </Box>
  );
}

// Unified stage editor - all stages share the same sections
function StageEditor({
  feature,
  stageName,
  onChange,
}: {
  feature: Feature;
  stageName: 'notAttached' | 'attached' | 'activated' | 'engaged';
  onChange: (feature: Feature) => void;
}) {
  const context = feature.stages[stageName];

  const updateContext = (updates: Partial<typeof context>) => {
    onChange({
      ...feature,
      stages: {
        ...feature.stages,
        [stageName]: { ...context, ...updates },
      },
    });
  };

  return (
    <Stack spacing={3}>
      {/* Access Conditions Section */}
      <Paper sx={{ p: 3 }}>
        <AccessConditionsEditor
          rule={context.accessConditions}
          onChange={(accessConditions) => updateContext({ accessConditions })}
        />
      </Paper>

      {/* Onboarding Items Section */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader
          icon={<ChecklistIcon />}
          title="Onboarding Items"
          count={context.onboardingItems?.length || 0}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Centralized onboarding items assigned to this feature. Items are tracked once across all features -
          completing an item for one feature marks it complete everywhere.
        </Typography>
        <OnboardingItemsEditor
          assignments={context.onboardingItems || []}
          onChange={(items) => updateContext({ onboardingItems: items })}
        />
      </Paper>

      {/* Important Context Section */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader icon={<TextSnippetIcon />} title="Important Context" count={context.contextSnippets?.length || 0} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Context snippets that help describe this feature at this stage. Add value propositions, tips, or other relevant information.
        </Typography>
        <ContextSnippetsEditor
          snippets={context.contextSnippets || []}
          onChange={(snippets) => updateContext({ contextSnippets: snippets })}
        />
      </Paper>

      {/* Navigation Section */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader icon={<LinkIcon />} title="Navigation" count={context.navigation?.length || 0} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Links to pages, articles, videos, and other resources for this feature at this stage.
        </Typography>
        <NavigationEditor
          items={context.navigation || []}
          onChange={(items) => updateContext({ navigation: items })}
        />
      </Paper>

      {/* Calendly Event Types Section */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader icon={<CalendarMonthIcon />} title="Calendly Event Types" count={context.calendlyTypes?.length || 0} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Calendly call types that can be booked for this feature at this stage.
        </Typography>
        <CalendlyEditor
          links={context.calendlyTypes || []}
          onChange={(links) => updateContext({ calendlyTypes: links })}
        />
      </Paper>

      {/* Prompt Section */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader icon={<SmartToyIcon />} title="Prompt" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          AI prompt for this stage. Guides how the AI should interact with pros at this point in their journey.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={context.prompt || ''}
          onChange={(e) => updateContext({ prompt: e.target.value })}
          placeholder="AI prompt for this stage..."
        />
      </Paper>

      {/* Tools Section */}
      <Paper sx={{ p: 3 }}>
        <SectionHeader icon={<BuildIcon />} title="Tools" count={context.tools?.length || 0} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          MCP tools that the AI can use at this stage to help the pro.
        </Typography>
        <ToolEditor
          tools={context.tools || []}
          onChange={(tools) => updateContext({ tools: tools })}
        />
      </Paper>
    </Stack>
  );
}

// Feature editor modal
function FeatureEditorModal({
  feature,
  open,
  onClose,
  onSave,
}: {
  feature: Feature | null;
  open: boolean;
  onClose: () => void;
  onSave: (feature: Feature) => void;
}) {
  const [editedFeature, setEditedFeature] = useState<Feature | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Update local state when feature prop changes
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">Edit Feature: {editedFeature.name}</Typography>
          <Chip
            label={editedFeature.id}
            size="small"
            sx={{ bgcolor: alpha(palette.primary, 0.1), color: palette.primary }}
          />
        </Stack>
      </DialogTitle>

      {/* Feature metadata - above tabs */}
      <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            label="Feature Name"
            value={editedFeature.name}
            onChange={(e) =>
              setEditedFeature({ ...editedFeature, name: e.target.value })
            }
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Version"
            value={editedFeature.version}
            onChange={(e) =>
              setEditedFeature({ ...editedFeature, version: e.target.value })
            }
            placeholder="1.0.0"
            sx={{ width: 120 }}
            inputProps={{ style: { fontFamily: 'monospace' } }}
          />
          <TextField
            size="small"
            label="Icon"
            value={editedFeature.icon}
            onChange={(e) =>
              setEditedFeature({ ...editedFeature, icon: e.target.value })
            }
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
          onChange={(e) =>
            setEditedFeature({ ...editedFeature, description: e.target.value })
          }
          sx={{ mt: 2 }}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          {stageKeys.map((stage) => (
            <Tab
              key={stage}
              label={stageConfig[stage].label}
              sx={{
                '&.Mui-selected': {
                  color: stageConfig[stage].color,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: palette.grey[50] }}>
        {/* All stages use the same unified editor */}
        <StageEditor
          feature={editedFeature}
          stageName={stageKeys[activeTab]}
          onChange={setEditedFeature}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Main Admin View
export function AdminView() {
  const { features, updateFeature } = useOnboarding();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const handleEditFeature = (feature: Feature) => {
    setSelectedFeature(feature);
    setEditorOpen(true);
  };

  const handleSaveFeature = (feature: Feature) => {
    updateFeature(feature);
    setSelectedFeature(null);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Feature Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage onboarding content for all features and adoption stages
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disabled>
          Add Feature
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Feature</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Version
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature) => (
              <TableRow
                key={feature.id}
                hover
                sx={{ '&:last-child td': { border: 0 } }}
              >
                <TableCell>
                  <Typography fontWeight={500}>{feature.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={`v${feature.version}`}
                    size="small"
                    sx={{
                      bgcolor: alpha(palette.primary, 0.1),
                      color: palette.primary,
                      fontFamily: 'monospace',
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleEditFeature(feature)}
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
        onClose={() => {
          setEditorOpen(false);
          setSelectedFeature(null);
        }}
        onSave={handleSaveFeature}
      />
    </Box>
  );
}
