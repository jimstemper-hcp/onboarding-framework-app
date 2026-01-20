import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  LinearProgress,
  Button,
  Checkbox,
  alpha,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LabelIcon from '@mui/icons-material/Label';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LinkIcon from '@mui/icons-material/Link';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PhoneIcon from '@mui/icons-material/Phone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GroupsIcon from '@mui/icons-material/Groups';
import * as MuiIcons from '@mui/icons-material';
import { useOnboarding } from '../../context';
import { onboardingItems as allOnboardingItems, onboardingCategories } from '../../data';
import { PlanningWrapper } from '../../planning';
import type { Feature, AdoptionStage, FeatureId, ProAccount, OnboardingItemAssignment, OnboardingCategoryId, OnboardingCategory, OnboardingItemDefinition } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

type FrontlinePage = 'information' | 'onboarding-plan' | 'features-list' | 'calls';

type CategoryStatus = 'not-covered' | 'in-progress' | 'completed';

type OnboardingPlanViewMode = 'category' | 'weekly';

type WeekNumber = 1 | 2 | 3 | 4;

interface WeeklyPlanItem {
  itemId: string;
  order: number;
}

interface WeeklyPlanState {
  week1: WeeklyPlanItem[];
  week2: WeeklyPlanItem[];
  week3: WeeklyPlanItem[];
  week4: WeeklyPlanItem[];
}

// =============================================================================
// PALETTE
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
    400: '#94A3B8',
    600: '#475569',
    800: '#1E293B',
  },
};

const stageColors: Record<AdoptionStage, string> = {
  not_attached: palette.grey[400],
  attached: palette.warning,
  activated: palette.primary,
  engaged: palette.success,
};

const stageLabels: Record<AdoptionStage, string> = {
  not_attached: 'Not Attached',
  attached: 'Attached',
  activated: 'Activated',
  engaged: 'Engaged',
};

const categoryStatusColors: Record<CategoryStatus, string> = {
  'not-covered': palette.grey[400],
  'in-progress': palette.warning,
  'completed': palette.success,
};

const categoryStatusLabels: Record<CategoryStatus, string> = {
  'not-covered': 'Not Covered',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

// =============================================================================
// HELPERS
// =============================================================================

function FeatureIcon({ iconName, ...props }: { iconName: string } & Record<string, unknown>) {
  const Icon = (MuiIcons as Record<string, React.ComponentType<Record<string, unknown>>>)[iconName] || MuiIcons.HelpOutlineRounded;
  return <Icon {...props} />;
}

function getStageKey(stage: AdoptionStage): 'notAttached' | 'attached' | 'activated' | 'engaged' {
  switch (stage) {
    case 'not_attached': return 'notAttached';
    case 'attached': return 'attached';
    case 'activated': return 'activated';
    case 'engaged': return 'engaged';
  }
}

function getItemsByCategory(categoryId: OnboardingCategoryId): OnboardingItemDefinition[] {
  return allOnboardingItems.filter(item => item.category === categoryId);
}

// =============================================================================
// PRO SELECTOR (for sidebar)
// =============================================================================

function ProSelectorSidebar({
  pros,
  selectedProId,
  onSelect,
}: {
  pros: ProAccount[];
  selectedProId: string | null;
  onSelect: (proId: string) => void;
}) {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel>Pro Account</InputLabel>
      <Select
        value={selectedProId || ''}
        label="Pro Account"
        onChange={(e) => onSelect(e.target.value)}
        sx={{ bgcolor: 'white' }}
      >
        {pros.map((pro) => (
          <MenuItem key={pro.id} value={pro.id}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(palette.primary, 0.1), color: palette.primary, fontSize: '0.65rem' }}>
                {pro.ownerName.charAt(0)}
              </Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="body2" fontWeight={500} noWrap>
                  {pro.companyName}
                </Typography>
              </Box>
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// =============================================================================
// PRO SELECTOR (original for Features List page)
// =============================================================================

function ProSelector({
  pros,
  selectedProId,
  onSelect,
}: {
  pros: ProAccount[];
  selectedProId: string | null;
  onSelect: (proId: string) => void;
}) {
  return (
    <FormControl size="small" sx={{ minWidth: 300 }}>
      <InputLabel>Select Pro Account</InputLabel>
      <Select
        value={selectedProId || ''}
        label="Select Pro Account"
        onChange={(e) => onSelect(e.target.value)}
      >
        {pros.map((pro) => (
          <MenuItem key={pro.id} value={pro.id}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(palette.primary, 0.1), color: palette.primary, fontSize: '0.75rem' }}>
                {pro.ownerName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {pro.companyName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {pro.ownerName} • {pro.plan.charAt(0).toUpperCase() + pro.plan.slice(1)} Plan
                </Typography>
              </Box>
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// =============================================================================
// FEATURE STAGE CARD
// =============================================================================

function FeatureStageCard({
  feature,
  stage,
  isSelected,
  onClick,
}: {
  feature: Feature;
  stage: AdoptionStage;
  isSelected: boolean;
  onClick: () => void;
}) {
  const color = stageColors[stage];

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        border: '2px solid',
        borderColor: isSelected ? color : 'divider',
        borderRadius: 2,
        transition: 'all 0.15s ease',
        bgcolor: isSelected ? alpha(color, 0.04) : 'white',
        '&:hover': {
          borderColor: color,
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${alpha(color, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(color, 0.15),
              color: color,
            }}
          >
            {stage === 'not_attached' ? (
              <LockOutlinedIcon sx={{ fontSize: 20 }} />
            ) : (
              <FeatureIcon iconName={feature.icon} sx={{ fontSize: 20 }} />
            )}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              {feature.name}
            </Typography>
            <Chip
              label={stageLabels[stage]}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 600,
                bgcolor: alpha(color, 0.15),
                color: color,
                mt: 0.5,
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// ONBOARDING ITEMS PANEL
// =============================================================================

function OnboardingItemsPanel({
  feature,
  stage,
  completedTaskIds,
  onToggleTask,
}: {
  feature: Feature;
  stage: AdoptionStage;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}) {
  const stageKey = getStageKey(stage);
  const stageContext = feature.stages[stageKey];
  const assignments = stageContext.onboardingItems || [];

  if (assignments.length === 0) {
    return (
      <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">No onboarding items for this stage</Typography>
      </Box>
    );
  }

  // Separate required and optional items
  const requiredItems = assignments.filter((a) => a.required);
  const optionalItems = assignments.filter((a) => !a.required);
  const completedCount = assignments.filter((a) => completedTaskIds.includes(a.itemId)).length;

  return (
    <Box>
      {/* Progress bar */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Progress
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            {completedCount}/{assignments.length}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={(completedCount / assignments.length) * 100}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: palette.grey[200],
            '& .MuiLinearProgress-bar': {
              bgcolor: palette.success,
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* Required items */}
      {requiredItems.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Required
          </Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {requiredItems.map((assignment) => (
              <OnboardingItemRow
                key={assignment.itemId}
                assignment={assignment}
                isCompleted={completedTaskIds.includes(assignment.itemId)}
                onToggle={() => onToggleTask(assignment.itemId)}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Optional items */}
      {optionalItems.length > 0 && (
        <Box>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Optional
          </Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {optionalItems.map((assignment) => (
              <OnboardingItemRow
                key={assignment.itemId}
                assignment={assignment}
                isCompleted={completedTaskIds.includes(assignment.itemId)}
                onToggle={() => onToggleTask(assignment.itemId)}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

function OnboardingItemRow({
  assignment,
  isCompleted,
  onToggle,
}: {
  assignment: OnboardingItemAssignment;
  isCompleted: boolean;
  onToggle: () => void;
}) {
  const itemDef = allOnboardingItems.find((i) => i.id === assignment.itemId);
  if (!itemDef) return null;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        bgcolor: isCompleted ? alpha(palette.success, 0.04) : 'white',
        borderColor: isCompleted ? alpha(palette.success, 0.3) : 'divider',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Checkbox
          checked={isCompleted}
          onChange={onToggle}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          sx={{
            p: 0,
            color: palette.grey[400],
            '&.Mui-checked': { color: palette.success },
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {itemDef.type === 'in_product' ? (
              <ComputerIcon sx={{ fontSize: 14, color: palette.primary }} />
            ) : (
              <PersonIcon sx={{ fontSize: 14, color: palette.secondary }} />
            )}
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? 'text.secondary' : 'text.primary',
              }}
            >
              {itemDef.title}
            </Typography>
          </Stack>
          {assignment.stageSpecificNote && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
              {assignment.stageSpecificNote}
            </Typography>
          )}
          {itemDef.type === 'rep_facing' && itemDef.repInstructions && (
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: palette.secondary, fontStyle: 'italic' }}>
              {itemDef.repInstructions}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

// =============================================================================
// CONTEXT DETAIL PANEL
// =============================================================================

function ContextDetailPanel({
  feature,
  stage,
  completedTaskIds,
  onToggleTask,
}: {
  feature: Feature;
  stage: AdoptionStage;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}) {
  const stageKey = getStageKey(stage);
  const stageContext = feature.stages[stageKey];
  const color = stageColors[stage];

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 48, height: 48, bgcolor: alpha(color, 0.15), color: color }}>
            <FeatureIcon iconName={feature.icon} sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {feature.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={stageLabels[stage]}
                size="small"
                sx={{
                  height: 22,
                  fontWeight: 600,
                  bgcolor: alpha(color, 0.15),
                  color: color,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                v{feature.version}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          {feature.description}
        </Typography>
      </Box>

      <Divider />

      {/* Context Snippets */}
      {stageContext.contextSnippets && stageContext.contextSnippets.length > 0 && (
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <TextSnippetIcon sx={{ fontSize: 18, color: palette.primary }} />
            <Typography variant="subtitle2" fontWeight={600}>
              Important Context
            </Typography>
          </Stack>
          <Stack spacing={1.5}>
            {stageContext.contextSnippets.map((snippet) => (
              <Paper key={snippet.id} variant="outlined" sx={{ p: 2, bgcolor: alpha(palette.primary, 0.02) }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                  {snippet.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {snippet.content}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {/* Onboarding Items */}
      <Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <ChecklistIcon sx={{ fontSize: 18, color: palette.success }} />
          <Typography variant="subtitle2" fontWeight={600}>
            Onboarding Items
          </Typography>
        </Stack>
        <OnboardingItemsPanel
          feature={feature}
          stage={stage}
          completedTaskIds={completedTaskIds}
          onToggleTask={onToggleTask}
        />
      </Box>

      {/* Navigation Links */}
      {stageContext.navigation && stageContext.navigation.length > 0 && (
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <LinkIcon sx={{ fontSize: 18, color: palette.warning }} />
            <Typography variant="subtitle2" fontWeight={600}>
              Navigation & Resources
            </Typography>
          </Stack>
          <Stack spacing={1}>
            {stageContext.navigation.map((item, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight={500}>
                        {item.name}
                      </Typography>
                      <Chip
                        label={item.navigationType.replace('hcp_', '').replace(/_/g, ' ')}
                        size="small"
                        sx={{ height: 18, fontSize: '0.6rem' }}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', fontFamily: 'monospace', color: palette.grey[600] }}>
                      {item.url}
                    </Typography>
                  </Box>
                  <Tooltip title="Open link">
                    <IconButton size="small" onClick={() => window.open(item.url, '_blank')}>
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {/* Calendly Links */}
      {stageContext.calendlyTypes && stageContext.calendlyTypes.length > 0 && (
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <CalendarMonthIcon sx={{ fontSize: 18, color: palette.secondary }} />
            <Typography variant="subtitle2" fontWeight={600}>
              Schedule a Call
            </Typography>
          </Stack>
          <Stack spacing={1}>
            {stageContext.calendlyTypes.map((calendly, index) => (
              <Button
                key={index}
                variant="outlined"
                startIcon={<CalendarMonthIcon />}
                endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                onClick={() => window.open(calendly.url, '_blank')}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.5,
                  px: 2,
                  borderColor: alpha(palette.secondary, 0.3),
                  '&:hover': {
                    borderColor: palette.secondary,
                    bgcolor: alpha(palette.secondary, 0.04),
                  },
                }}
              >
                <Box sx={{ textAlign: 'left', flex: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {calendly.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {calendly.description} • {calendly.team} team
                  </Typography>
                </Box>
              </Button>
            ))}
          </Stack>
        </Box>
      )}

      {/* AI Prompt */}
      {stageContext.prompt && (
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <SmartToyIcon sx={{ fontSize: 18, color: palette.primary }} />
            <Typography variant="subtitle2" fontWeight={600}>
              AI Guidance Prompt
            </Typography>
          </Stack>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: alpha(palette.primary, 0.02),
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              whiteSpace: 'pre-wrap',
              color: palette.grey[600],
              maxHeight: 200,
              overflow: 'auto',
            }}
          >
            {stageContext.prompt}
          </Paper>
        </Box>
      )}
    </Stack>
  );
}

// =============================================================================
// PRO OVERVIEW CARD
// =============================================================================

function ProOverviewCard({ pro, features }: { pro: ProAccount; features: Feature[] }) {
  const stageCounts = {
    not_attached: 0,
    attached: 0,
    activated: 0,
    engaged: 0,
  };

  features.forEach((feature) => {
    const status = pro.featureStatus[feature.id];
    if (status) {
      stageCounts[status.stage]++;
    }
  });

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 56, height: 56, bgcolor: alpha(palette.primary, 0.1), color: palette.primary, fontSize: '1.25rem' }}>
            {pro.ownerName.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              {pro.companyName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pro.ownerName} • {pro.businessType.charAt(0).toUpperCase() + pro.businessType.slice(1)}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              <Chip
                label={`${pro.plan.charAt(0).toUpperCase() + pro.plan.slice(1)} Plan`}
                size="small"
                sx={{ height: 20, fontSize: '0.65rem' }}
              />
              <Chip
                label={pro.goal === 'growth' ? 'Growth Focus' : 'Efficiency Focus'}
                size="small"
                sx={{ height: 20, fontSize: '0.65rem', bgcolor: alpha(palette.success, 0.1), color: palette.success }}
              />
            </Stack>
          </Box>
          <Stack direction="row" spacing={2}>
            {Object.entries(stageCounts).map(([stage, count]) => (
              <Box key={stage} sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: stageColors[stage as AdoptionStage] }}>
                  {count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stageLabels[stage as AdoptionStage]}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// ONBOARDING ITEM MODAL
// =============================================================================

function OnboardingItemModal({
  item,
  open,
  onClose,
  isCompleted,
  onToggleComplete,
}: {
  item: OnboardingItemDefinition | null;
  open: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: () => void;
}) {
  if (!item) return null;

  const isRepFacing = item.type === 'rep_facing';
  const isInProduct = item.type === 'in_product';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              {isInProduct ? (
                <ComputerIcon sx={{ fontSize: 20, color: palette.primary }} />
              ) : (
                <PersonIcon sx={{ fontSize: 20, color: palette.secondary }} />
              )}
              <Chip
                label={isInProduct ? 'In-Product' : 'Rep Task'}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: isInProduct ? alpha(palette.primary, 0.1) : alpha(palette.secondary, 0.1),
                  color: isInProduct ? palette.primary : palette.secondary,
                }}
              />
              {isCompleted && (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                  label="Completed"
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    bgcolor: alpha(palette.success, 0.1),
                    color: palette.success,
                  }}
                />
              )}
            </Stack>
            <Typography variant="h6" fontWeight={600}>
              {item.title}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ mt: -0.5 }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Description / What the pro should do */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <InfoOutlinedIcon sx={{ fontSize: 16 }} />
              {isInProduct ? 'What the Pro Should Do' : 'Description'}
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(palette.grey[400], 0.04) }}>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Paper>
          </Box>

          {/* For In-Product items: Completion API info */}
          {isInProduct && item.completionApi && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Completion Tracking
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(palette.primary, 0.02) }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <strong>Event:</strong> <code style={{ fontSize: '0.8rem', background: alpha(palette.grey[400], 0.1), padding: '2px 6px', borderRadius: 4 }}>{item.completionApi.eventName}</code>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.completionApi.description}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* For Rep-Facing items: Instructions */}
          {isRepFacing && item.repInstructions && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Rep Instructions
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(palette.secondary, 0.02) }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {item.repInstructions}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Important Context / Value Statement */}
          {item.contextSnippets && item.contextSnippets.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TextSnippetIcon sx={{ fontSize: 16 }} />
                Important Context
              </Typography>
              <Stack spacing={1.5}>
                {item.contextSnippets.map((snippet) => (
                  <Paper key={snippet.id} variant="outlined" sx={{ p: 2, bgcolor: alpha(palette.primary, 0.02) }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {snippet.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {snippet.content}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}

          {/* Sub-items */}
          {item.subItems && item.subItems.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Sub-items
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={0.5}>
                  {item.subItems.map((subItem) => (
                    <Typography key={subItem.id} variant="body2" color="text.secondary">
                      • {subItem.title}
                    </Typography>
                  ))}
                </Stack>
              </Paper>
            </Box>
          )}

          {/* Labels */}
          {item.labels && item.labels.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LabelIcon sx={{ fontSize: 16 }} />
                Labels
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {item.labels.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: '0.7rem',
                      bgcolor: alpha(palette.grey[400], 0.1),
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Estimated time */}
          {item.estimatedMinutes && (
            <Typography variant="caption" color="text.secondary">
              Estimated time: {item.estimatedMinutes} minutes
            </Typography>
          )}
        </Stack>
      </DialogContent>

      {/* Only show action button for rep-facing items */}
      {isRepFacing && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant={isCompleted ? 'outlined' : 'contained'}
            color={isCompleted ? 'inherit' : 'primary'}
            startIcon={isCompleted ? <RadioButtonUncheckedIcon /> : <CheckCircleIcon />}
            onClick={onToggleComplete}
            sx={{ minWidth: 180 }}
          >
            {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

// =============================================================================
// ONBOARDING CATEGORY SECTION (Expandable Accordion)
// =============================================================================

function OnboardingCategorySection({
  category,
  completedItemIds,
  onOpenItem,
  categoryStatus,
  onStatusChange,
  expanded,
  onToggleExpanded,
}: {
  category: OnboardingCategory;
  completedItemIds: string[];
  onOpenItem: (item: OnboardingItemDefinition) => void;
  categoryStatus: CategoryStatus;
  onStatusChange: (status: CategoryStatus) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const items = getItemsByCategory(category.id);
  const completedCount = items.filter(item => completedItemIds.includes(item.id)).length;
  const color = categoryStatusColors[categoryStatus];

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggleExpanded}
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: expanded ? color : 'divider',
        borderRadius: '8px !important',
        '&:before': { display: 'none' },
        mb: 1.5,
        overflow: 'hidden',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: expanded ? alpha(color, 0.02) : 'white',
          '& .MuiAccordionSummary-content': { my: 1.5 },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, pr: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(color, 0.15),
              color: color,
            }}
          >
            <FeatureIcon iconName={category.icon} sx={{ fontSize: 20 }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {category.label}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                {completedCount}/{items.length} completed
              </Typography>
              <LinearProgress
                variant="determinate"
                value={items.length > 0 ? (completedCount / items.length) * 100 : 0}
                sx={{
                  flex: 1,
                  maxWidth: 120,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    bgcolor: palette.success,
                    borderRadius: 2,
                  },
                }}
              />
            </Stack>
          </Box>
          <FormControl
            size="small"
            sx={{ minWidth: 140 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Select
              value={categoryStatus}
              onChange={(e) => {
                e.stopPropagation();
                onStatusChange(e.target.value as CategoryStatus);
              }}
              sx={{
                '& .MuiSelect-select': { py: 0.5, fontSize: '0.8rem' },
                bgcolor: alpha(color, 0.08),
              }}
            >
              <MenuItem value="not-covered">{categoryStatusLabels['not-covered']}</MenuItem>
              <MenuItem value="in-progress">{categoryStatusLabels['in-progress']}</MenuItem>
              <MenuItem value="completed">{categoryStatusLabels['completed']}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0, pb: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1}>
          {items.map((item) => {
            const isCompleted = completedItemIds.includes(item.id);
            const isRepFacing = item.type === 'rep_facing';

            return (
              <Paper
                key={item.id}
                variant="outlined"
                onClick={() => onOpenItem(item)}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  bgcolor: isCompleted ? alpha(palette.success, 0.04) : 'white',
                  borderColor: isCompleted ? alpha(palette.success, 0.3) : 'divider',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: palette.primary,
                    bgcolor: alpha(palette.primary, 0.02),
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  {/* Status indicator */}
                  {isCompleted ? (
                    <CheckCircleIcon sx={{ fontSize: 20, color: palette.success, mt: 0.25 }} />
                  ) : (
                    <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: palette.grey[400], mt: 0.25 }} />
                  )}

                  <Box sx={{ flex: 1 }}>
                    {/* Title */}
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        color: isCompleted ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {item.title}
                    </Typography>

                    {/* Type and labels row */}
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.75 }} flexWrap="wrap" useFlexGap>
                      <Chip
                        icon={isRepFacing ? <PersonIcon sx={{ fontSize: '14px !important' }} /> : <ComputerIcon sx={{ fontSize: '14px !important' }} />}
                        label={isRepFacing ? 'Rep Task' : 'In-Product'}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          bgcolor: isRepFacing ? alpha(palette.secondary, 0.1) : alpha(palette.primary, 0.1),
                          color: isRepFacing ? palette.secondary : palette.primary,
                          '& .MuiChip-icon': { ml: 0.5 },
                        }}
                      />
                      {item.labels?.slice(0, 2).map((label) => (
                        <Chip
                          key={label}
                          label={label}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: alpha(palette.grey[400], 0.1),
                          }}
                        />
                      ))}
                      {item.labels && item.labels.length > 2 && (
                        <Chip
                          label={`+${item.labels.length - 2}`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: alpha(palette.grey[400], 0.1),
                          }}
                        />
                      )}
                    </Stack>

                    {/* Sub-items preview */}
                    {item.subItems && item.subItems.length > 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {item.subItems.length} sub-item{item.subItems.length > 1 ? 's' : ''}: {item.subItems.map(s => s.title).join(', ')}
                      </Typography>
                    )}
                  </Box>

                  {/* Arrow indicator */}
                  <IconButton size="small" sx={{ mt: -0.5 }}>
                    <OpenInNewIcon sx={{ fontSize: 16, color: palette.grey[400] }} />
                  </IconButton>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

// =============================================================================
// WEEKLY PLANNING VIEW
// =============================================================================
// Allows organizing onboarding items into Week 1-4 categories with
// add, remove, and reorder functionality.
// =============================================================================

interface WeeklyPlanningViewProps {
  weeklyPlan: WeeklyPlanState;
  onUpdateWeeklyPlan: (plan: WeeklyPlanState) => void;
  completedItemIds: string[];
}

function WeeklyPlanningView({
  weeklyPlan,
  onUpdateWeeklyPlan,
  completedItemIds,
}: WeeklyPlanningViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWeek, setExpandedWeek] = useState<WeekNumber | null>(1);

  // Get all items currently assigned to any week
  const assignedItemIds = new Set([
    ...weeklyPlan.week1.map(i => i.itemId),
    ...weeklyPlan.week2.map(i => i.itemId),
    ...weeklyPlan.week3.map(i => i.itemId),
    ...weeklyPlan.week4.map(i => i.itemId),
  ]);

  // Filter available items (not yet assigned to any week)
  const availableItems = allOnboardingItems.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.labels?.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
    return !assignedItemIds.has(item.id) && matchesSearch;
  });

  // Helper to get week key
  const getWeekKey = (week: WeekNumber): keyof WeeklyPlanState => `week${week}` as keyof WeeklyPlanState;

  // Add item to a week
  const handleAddToWeek = (itemId: string, week: WeekNumber) => {
    const weekKey = getWeekKey(week);
    const currentItems = weeklyPlan[weekKey];
    const newOrder = currentItems.length > 0 ? Math.max(...currentItems.map(i => i.order)) + 1 : 0;
    onUpdateWeeklyPlan({
      ...weeklyPlan,
      [weekKey]: [...currentItems, { itemId, order: newOrder }],
    });
  };

  // Remove item from a week
  const handleRemoveFromWeek = (itemId: string, week: WeekNumber) => {
    const weekKey = getWeekKey(week);
    onUpdateWeeklyPlan({
      ...weeklyPlan,
      [weekKey]: weeklyPlan[weekKey].filter(i => i.itemId !== itemId),
    });
  };

  // Move item up within a week
  const handleMoveUp = (itemId: string, week: WeekNumber) => {
    const weekKey = getWeekKey(week);
    const items = [...weeklyPlan[weekKey]];
    const index = items.findIndex(i => i.itemId === itemId);
    if (index > 0) {
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
      // Re-number orders
      items.forEach((item, idx) => { item.order = idx; });
      onUpdateWeeklyPlan({ ...weeklyPlan, [weekKey]: items });
    }
  };

  // Move item down within a week
  const handleMoveDown = (itemId: string, week: WeekNumber) => {
    const weekKey = getWeekKey(week);
    const items = [...weeklyPlan[weekKey]];
    const index = items.findIndex(i => i.itemId === itemId);
    if (index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      // Re-number orders
      items.forEach((item, idx) => { item.order = idx; });
      onUpdateWeeklyPlan({ ...weeklyPlan, [weekKey]: items });
    }
  };

  // Render a single week column
  const renderWeekColumn = (week: WeekNumber) => {
    const weekKey = getWeekKey(week);
    const items = weeklyPlan[weekKey].sort((a, b) => a.order - b.order);
    const weekColors = {
      1: palette.primary,
      2: palette.secondary,
      3: palette.warning,
      4: palette.success,
    };
    const color = weekColors[week];

    return (
      <Paper
        key={week}
        variant="outlined"
        sx={{
          flex: 1,
          minWidth: 280,
          maxWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'white',
        }}
      >
        {/* Week Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: alpha(color, 0.05),
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: alpha(color, 0.15),
                  color: color,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {week}
              </Avatar>
              <Typography variant="subtitle2" fontWeight={600}>
                Week {week}
              </Typography>
            </Stack>
            <Chip
              label={`${items.length} items`}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                bgcolor: alpha(color, 0.1),
                color: color,
              }}
            />
          </Stack>
        </Box>

        {/* Week Items */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 1, minHeight: 200, maxHeight: 400 }}>
          {items.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: palette.grey[200],
                borderRadius: 1,
                m: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ p: 2 }}>
                No items assigned
                <br />
                <Typography variant="caption" color="text.secondary">
                  Add items from the pool below
                </Typography>
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {items.map((planItem, index) => {
                const itemDef = allOnboardingItems.find(i => i.id === planItem.itemId);
                if (!itemDef) return null;
                const isCompleted = completedItemIds.includes(planItem.itemId);
                const isRepFacing = itemDef.type === 'rep_facing';

                return (
                  <Paper
                    key={planItem.itemId}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      bgcolor: isCompleted ? alpha(palette.success, 0.04) : 'white',
                      borderColor: isCompleted ? alpha(palette.success, 0.3) : 'divider',
                      '&:hover': {
                        borderColor: color,
                        bgcolor: alpha(color, 0.02),
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      {/* Drag/Order indicator */}
                      <Stack spacing={0} sx={{ pt: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleMoveUp(planItem.itemId, week)}
                          disabled={index === 0}
                          sx={{ p: 0.25 }}
                        >
                          <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleMoveDown(planItem.itemId, week)}
                          disabled={index === items.length - 1}
                          sx={{ p: 0.25 }}
                        >
                          <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Stack>

                      {/* Item content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            color: isCompleted ? 'text.secondary' : 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {itemDef.title}
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          <Chip
                            icon={isRepFacing ? <PersonIcon sx={{ fontSize: '12px !important' }} /> : <ComputerIcon sx={{ fontSize: '12px !important' }} />}
                            label={isRepFacing ? 'Rep' : 'In-Product'}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              bgcolor: isRepFacing ? alpha(palette.secondary, 0.1) : alpha(palette.primary, 0.1),
                              color: isRepFacing ? palette.secondary : palette.primary,
                              '& .MuiChip-icon': { ml: 0.5 },
                            }}
                          />
                          {itemDef.category && (
                            <Chip
                              label={itemDef.category.replace(/-/g, ' ')}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.6rem',
                                bgcolor: alpha(palette.grey[400], 0.1),
                                textTransform: 'capitalize',
                              }}
                            />
                          )}
                        </Stack>
                      </Box>

                      {/* Remove button */}
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFromWeek(planItem.itemId, week)}
                        sx={{
                          p: 0.5,
                          color: palette.grey[400],
                          '&:hover': { color: palette.error, bgcolor: alpha(palette.error, 0.1) },
                        }}
                      >
                        <RemoveIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Box>
      {/* Week Columns */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Weekly Schedule
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            overflowX: 'auto',
            pb: 1,
          }}
        >
          {([1, 2, 3, 4] as WeekNumber[]).map(week => renderWeekColumn(week))}
        </Stack>
      </Box>

      {/* Available Items Pool */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Available Onboarding Items ({availableItems.length})
          </Typography>
          <TextField
            size="small"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: palette.grey[400] }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        </Stack>

        {/* Items grouped by category */}
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {onboardingCategories.map(category => {
            const categoryItems = availableItems.filter(item => item.category === category.id);
            if (categoryItems.length === 0) return null;

            return (
              <Box key={category.id} sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}
                >
                  {category.label} ({categoryItems.length})
                </Typography>
                <Stack spacing={0.5}>
                  {categoryItems.map(item => {
                    const isRepFacing = item.type === 'rep_facing';
                    return (
                      <Paper
                        key={item.id}
                        variant="outlined"
                        sx={{
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          '&:hover': {
                            borderColor: palette.primary,
                            bgcolor: alpha(palette.primary, 0.02),
                          },
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Chip
                              icon={isRepFacing ? <PersonIcon sx={{ fontSize: '12px !important' }} /> : <ComputerIcon sx={{ fontSize: '12px !important' }} />}
                              label={isRepFacing ? 'Rep' : 'In-Product'}
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: '0.55rem',
                                bgcolor: isRepFacing ? alpha(palette.secondary, 0.1) : alpha(palette.primary, 0.1),
                                color: isRepFacing ? palette.secondary : palette.primary,
                                '& .MuiChip-icon': { ml: 0.25 },
                              }}
                            />
                            {item.estimatedMinutes && (
                              <Typography variant="caption" color="text.secondary">
                                ~{item.estimatedMinutes}min
                              </Typography>
                            )}
                          </Stack>
                        </Box>

                        {/* Add to week buttons */}
                        <Stack direction="row" spacing={0.5}>
                          {([1, 2, 3, 4] as WeekNumber[]).map(week => (
                            <Tooltip key={week} title={`Add to Week ${week}`}>
                              <IconButton
                                size="small"
                                onClick={() => handleAddToWeek(item.id, week)}
                                sx={{
                                  p: 0.5,
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  width: 24,
                                  height: 24,
                                  border: 1,
                                  borderColor: 'divider',
                                  '&:hover': {
                                    bgcolor: alpha(palette.primary, 0.1),
                                    borderColor: palette.primary,
                                  },
                                }}
                              >
                                {week}
                              </IconButton>
                            </Tooltip>
                          ))}
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              </Box>
            );
          })}

          {availableItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {searchQuery ? 'No items match your search' : 'All items have been assigned to weeks'}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

// =============================================================================
// ONBOARDING PLAN PAGE
// =============================================================================

function OnboardingPlanPage({
  selectedPro,
  completedItemIds,
  onToggleItem,
  categoryStatuses,
  onCategoryStatusChange,
}: {
  selectedPro: ProAccount | undefined;
  completedItemIds: string[];
  onToggleItem: (itemId: string) => void;
  categoryStatuses: Record<OnboardingCategoryId, CategoryStatus>;
  onCategoryStatusChange: (categoryId: OnboardingCategoryId, status: CategoryStatus) => void;
}) {
  const [expandedCategory, setExpandedCategory] = useState<OnboardingCategoryId | null>('account-setup');
  const [selectedItem, setSelectedItem] = useState<OnboardingItemDefinition | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<OnboardingPlanViewMode>('category');
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanState>({
    week1: [],
    week2: [],
    week3: [],
    week4: [],
  });

  if (!selectedPro) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a pro account to view their onboarding plan
        </Typography>
      </Paper>
    );
  }

  const handleOpenItem = (item: OnboardingItemDefinition) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleToggleItemComplete = () => {
    if (selectedItem) {
      onToggleItem(selectedItem.id);
    }
  };

  // Calculate overall progress
  const allCategoryItems = onboardingCategories.flatMap(cat => getItemsByCategory(cat.id));
  const totalItems = allCategoryItems.length;
  const totalCompleted = allCategoryItems.filter(item => completedItemIds.includes(item.id)).length;

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Onboarding Plan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {viewMode === 'category'
                ? `Track ${selectedPro.companyName}'s onboarding progress across 9 categories`
                : `Organize ${selectedPro.companyName}'s onboarding items into weekly milestones`
              }
            </Typography>
          </Box>

          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                px: 2,
                py: 0.75,
              },
            }}
          >
            <ToggleButton value="category">
              <ViewListIcon sx={{ fontSize: 18, mr: 0.75 }} />
              Category View
            </ToggleButton>
            <ToggleButton value="weekly">
              <ViewWeekIcon sx={{ fontSize: 18, mr: 0.75 }} />
              Weekly Planning
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* Overall progress - only show in category view */}
        {viewMode === 'category' && (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={500}>
              Overall Progress: {totalCompleted}/{totalItems}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={totalItems > 0 ? (totalCompleted / totalItems) * 100 : 0}
              sx={{
                flex: 1,
                maxWidth: 300,
                height: 8,
                borderRadius: 4,
                bgcolor: palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  bgcolor: palette.success,
                  borderRadius: 4,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0}%
            </Typography>
          </Stack>
        )}
      </Box>

      {/* Content based on view mode */}
      {viewMode === 'category' ? (
        <>
          {/* Category sections */}
          <Box>
            {onboardingCategories.map((category) => (
              <OnboardingCategorySection
                key={category.id}
                category={category}
                completedItemIds={completedItemIds}
                onOpenItem={handleOpenItem}
                categoryStatus={categoryStatuses[category.id]}
                onStatusChange={(status) => onCategoryStatusChange(category.id, status)}
                expanded={expandedCategory === category.id}
                onToggleExpanded={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              />
            ))}
          </Box>

          {/* Item Detail Modal */}
          <OnboardingItemModal
            item={selectedItem}
            open={modalOpen}
            onClose={handleCloseModal}
            isCompleted={selectedItem ? completedItemIds.includes(selectedItem.id) : false}
            onToggleComplete={handleToggleItemComplete}
          />
        </>
      ) : (
        /* Weekly Planning View */
        <WeeklyPlanningView
          weeklyPlan={weeklyPlan}
          onUpdateWeeklyPlan={setWeeklyPlan}
          completedItemIds={completedItemIds}
        />
      )}
    </Box>
  );
}

// =============================================================================
// FEATURE DETAIL MODAL
// =============================================================================

function FeatureDetailModal({
  feature,
  stage,
  open,
  onClose,
  completedTaskIds,
  onToggleTask,
}: {
  feature: Feature | null;
  stage: AdoptionStage | null;
  open: boolean;
  onClose: () => void;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}) {
  if (!feature || !stage) return null;

  const stageKey = getStageKey(stage);
  const stageContext = feature.stages[stageKey];
  const color = stageColors[stage];
  const assignments = stageContext.onboardingItems || [];
  const completedCount = assignments.filter((a) => completedTaskIds.includes(a.itemId)).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: '90vh' },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 48, height: 48, bgcolor: alpha(color, 0.15), color: color }}>
              <FeatureIcon iconName={feature.icon} sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {feature.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={stageLabels[stage]}
                  size="small"
                  sx={{
                    height: 22,
                    fontWeight: 600,
                    bgcolor: alpha(color, 0.15),
                    color: color,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  v{feature.version}
                </Typography>
              </Stack>
            </Box>
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Stack spacing={0}>
          {/* Feature Description */}
          <Box sx={{ p: 3, bgcolor: alpha(palette.grey[400], 0.02) }}>
            <Typography variant="body2" color="text.secondary">
              {feature.description}
            </Typography>
          </Box>

          {/* Context Snippets */}
          {stageContext.contextSnippets && stageContext.contextSnippets.length > 0 && (
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <TextSnippetIcon sx={{ fontSize: 18, color: palette.primary }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Important Context
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                {stageContext.contextSnippets.map((snippet) => (
                  <Paper key={snippet.id} variant="outlined" sx={{ p: 2, bgcolor: alpha(palette.primary, 0.02) }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {snippet.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {snippet.content}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}

          {/* Onboarding Items */}
          {assignments.length > 0 && (
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <ChecklistIcon sx={{ fontSize: 18, color: palette.success }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Onboarding Items ({completedCount}/{assignments.length} completed)
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={assignments.length > 0 ? (completedCount / assignments.length) * 100 : 0}
                sx={{
                  mb: 2,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    bgcolor: palette.success,
                    borderRadius: 3,
                  },
                }}
              />
              <Stack spacing={1}>
                {assignments.map((assignment) => {
                  const itemDef = allOnboardingItems.find((i) => i.id === assignment.itemId);
                  if (!itemDef) return null;
                  const isCompleted = completedTaskIds.includes(assignment.itemId);
                  const isRepFacing = itemDef.type === 'rep_facing';

                  return (
                    <Paper
                      key={assignment.itemId}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        bgcolor: isCompleted ? alpha(palette.success, 0.04) : 'white',
                        borderColor: isCompleted ? alpha(palette.success, 0.3) : 'divider',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          borderColor: palette.primary,
                          bgcolor: alpha(palette.primary, 0.02),
                        },
                      }}
                      onClick={() => onToggleTask(assignment.itemId)}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Checkbox
                          checked={isCompleted}
                          onChange={() => onToggleTask(assignment.itemId)}
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<CheckCircleIcon />}
                          sx={{
                            p: 0,
                            color: palette.grey[400],
                            '&.Mui-checked': { color: palette.success },
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                color: isCompleted ? 'text.secondary' : 'text.primary',
                              }}
                            >
                              {itemDef.title}
                            </Typography>
                            {assignment.required && (
                              <Chip
                                label="Required"
                                size="small"
                                sx={{ height: 18, fontSize: '0.6rem', bgcolor: alpha(palette.error, 0.1), color: palette.error }}
                              />
                            )}
                          </Stack>
                          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                            <Chip
                              icon={isRepFacing ? <PersonIcon sx={{ fontSize: '14px !important' }} /> : <ComputerIcon sx={{ fontSize: '14px !important' }} />}
                              label={isRepFacing ? 'Rep Task' : 'In-Product'}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.6rem',
                                bgcolor: isRepFacing ? alpha(palette.secondary, 0.1) : alpha(palette.primary, 0.1),
                                color: isRepFacing ? palette.secondary : palette.primary,
                                '& .MuiChip-icon': { ml: 0.5 },
                              }}
                            />
                          </Stack>
                          {assignment.stageSpecificNote && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {assignment.stageSpecificNote}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* Navigation Links */}
          {stageContext.navigation && stageContext.navigation.length > 0 && (
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <LinkIcon sx={{ fontSize: 18, color: palette.warning }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Navigation & Resources
                </Typography>
              </Stack>
              <Stack spacing={1}>
                {stageContext.navigation.map((item, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={500}>
                            {item.name}
                          </Typography>
                          <Chip
                            label={item.navigationType.replace('hcp_', '').replace(/_/g, ' ')}
                            size="small"
                            sx={{ height: 18, fontSize: '0.6rem' }}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                      <Tooltip title="Open link">
                        <IconButton size="small" onClick={() => window.open(item.url, '_blank')}>
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}

          {/* Calendly Links */}
          {stageContext.calendlyTypes && stageContext.calendlyTypes.length > 0 && (
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <CalendarMonthIcon sx={{ fontSize: 18, color: palette.secondary }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Schedule a Call
                </Typography>
              </Stack>
              <Stack spacing={1}>
                {stageContext.calendlyTypes.map((calendly, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={<CalendarMonthIcon />}
                    endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                    onClick={() => window.open(calendly.url, '_blank')}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      py: 1,
                      px: 2,
                      borderColor: alpha(palette.secondary, 0.3),
                      '&:hover': {
                        borderColor: palette.secondary,
                        bgcolor: alpha(palette.secondary, 0.04),
                      },
                    }}
                  >
                    <Box sx={{ textAlign: 'left', flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {calendly.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {calendly.team} team
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </Box>
          )}

          {/* AI Prompt */}
          {stageContext.prompt && (
            <Box sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <SmartToyIcon sx={{ fontSize: 18, color: palette.primary }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  AI Guidance Prompt
                </Typography>
              </Stack>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: alpha(palette.primary, 0.02),
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  color: palette.grey[600],
                  maxHeight: 150,
                  overflow: 'auto',
                }}
              >
                {stageContext.prompt}
              </Paper>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// FEATURE STAGE SECTION (Expandable Accordion for Features List)
// =============================================================================

function FeatureStageSection({
  stage,
  featuresAtStage,
  selectedPro,
  expandedFeatureId,
  onToggleFeatureExpanded,
  onOpenFeatureDetail,
  expanded,
  onToggleExpanded,
}: {
  stage: AdoptionStage;
  featuresAtStage: Feature[];
  selectedPro: ProAccount;
  expandedFeatureId: FeatureId | null;
  onToggleFeatureExpanded: (featureId: FeatureId) => void;
  onOpenFeatureDetail: (feature: Feature) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const color = stageColors[stage];
  const featureCount = featuresAtStage.length;

  // Calculate total onboarding items progress for this stage
  let totalItems = 0;
  let completedItems = 0;
  featuresAtStage.forEach((feature) => {
    const status = selectedPro.featureStatus[feature.id];
    const stageKey = getStageKey(stage);
    const stageContext = feature.stages[stageKey];
    const assignments = stageContext.onboardingItems || [];
    totalItems += assignments.length;
    completedItems += assignments.filter((a) => status?.completedTasks?.includes(a.itemId)).length;
  });

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggleExpanded}
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: expanded ? color : 'divider',
        borderRadius: '8px !important',
        '&:before': { display: 'none' },
        mb: 1.5,
        overflow: 'hidden',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: expanded ? alpha(color, 0.02) : 'white',
          '& .MuiAccordionSummary-content': { my: 1.5 },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, pr: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(color, 0.15),
              color: color,
            }}
          >
            {stage === 'not_attached' ? (
              <LockOutlinedIcon sx={{ fontSize: 20 }} />
            ) : stage === 'attached' ? (
              <PlayArrowIcon sx={{ fontSize: 20 }} />
            ) : stage === 'activated' ? (
              <CheckCircleIcon sx={{ fontSize: 20 }} />
            ) : (
              <CheckCircleIcon sx={{ fontSize: 20 }} />
            )}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" fontWeight={600}>
                {stageLabels[stage]}
              </Typography>
              <Chip
                label={`${featureCount} feature${featureCount !== 1 ? 's' : ''}`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: alpha(color, 0.15),
                  color: color,
                }}
              />
            </Stack>
            {totalItems > 0 && (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {completedItems}/{totalItems} items completed
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={totalItems > 0 ? (completedItems / totalItems) * 100 : 0}
                  sx={{
                    flex: 1,
                    maxWidth: 120,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: palette.grey[200],
                    '& .MuiLinearProgress-bar': {
                      bgcolor: palette.success,
                      borderRadius: 2,
                    },
                  }}
                />
              </Stack>
            )}
          </Box>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0, pb: 2 }}>
        <Divider sx={{ mb: 2 }} />
        {featuresAtStage.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No features at this stage
          </Typography>
        ) : (
          <Stack spacing={1}>
            {featuresAtStage.map((feature) => {
              const status = selectedPro.featureStatus[feature.id];
              const stageKey = getStageKey(stage);
              const stageContext = feature.stages[stageKey];
              const assignments = stageContext.onboardingItems || [];
              const completedCount = assignments.filter((a) => status?.completedTasks?.includes(a.itemId)).length;

              return (
                <Paper
                  key={feature.id}
                  variant="outlined"
                  onClick={() => onOpenFeatureDetail(feature)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: color,
                      bgcolor: alpha(color, 0.02),
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    {/* Feature Icon */}
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: alpha(color, 0.1),
                        color: color,
                      }}
                    >
                      <FeatureIcon iconName={feature.icon} sx={{ fontSize: 18 }} />
                    </Avatar>

                    {/* Feature Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {feature.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {feature.description}
                      </Typography>
                      {assignments.length > 0 && (
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {completedCount}/{assignments.length} items
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={assignments.length > 0 ? (completedCount / assignments.length) * 100 : 0}
                            sx={{
                              width: 60,
                              height: 3,
                              borderRadius: 1.5,
                              bgcolor: palette.grey[200],
                              '& .MuiLinearProgress-bar': {
                                bgcolor: palette.success,
                                borderRadius: 1.5,
                              },
                            }}
                          />
                        </Stack>
                      )}
                    </Box>

                    {/* View Details affordance */}
                    <Tooltip title="View feature details">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenFeatureDetail(feature);
                        }}
                        sx={{
                          color: palette.grey[400],
                          '&:hover': { color: color, bgcolor: alpha(color, 0.1) },
                        }}
                      >
                        <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

// =============================================================================
// FEATURES LIST PAGE (stage-based sections design)
// =============================================================================

function FeaturesListPage({
  features,
  selectedPro,
  onToggleTask,
}: {
  features: Feature[];
  selectedPro: ProAccount | undefined;
  onToggleTask: (taskId: string, featureId: FeatureId) => void;
}) {
  const [expandedStage, setExpandedStage] = useState<AdoptionStage | null>('attached');
  const [expandedFeature, setExpandedFeature] = useState<FeatureId | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [selectedStage, setSelectedStage] = useState<AdoptionStage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (!selectedPro) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a pro account to view their feature stages
        </Typography>
      </Paper>
    );
  }

  // Filter features that have a valid status for this pro
  const activeFeatures = features.filter((f) => selectedPro.featureStatus[f.id] !== undefined);

  // Group features by their current stage
  const featuresByStage: Record<AdoptionStage, Feature[]> = {
    not_attached: [],
    attached: [],
    activated: [],
    engaged: [],
  };
  activeFeatures.forEach((feature) => {
    const status = selectedPro.featureStatus[feature.id];
    if (status) {
      featuresByStage[status.stage].push(feature);
    }
  });

  // Sort each stage group by rank (lower = higher priority, undefined = last)
  (Object.keys(featuresByStage) as AdoptionStage[]).forEach((stage) => {
    featuresByStage[stage].sort((a, b) => {
      const rankA = selectedPro.featureStatus[a.id]?.rank ?? Infinity;
      const rankB = selectedPro.featureStatus[b.id]?.rank ?? Infinity;
      return rankA - rankB;
    });
  });

  // Calculate overall progress
  let totalItems = 0;
  let totalCompleted = 0;
  activeFeatures.forEach((feature) => {
    const status = selectedPro.featureStatus[feature.id];
    if (status) {
      const stageKey = getStageKey(status.stage);
      const stageContext = feature.stages[stageKey];
      const assignments = stageContext.onboardingItems || [];
      totalItems += assignments.length;
      totalCompleted += assignments.filter((a) => status.completedTasks?.includes(a.itemId)).length;
    }
  });

  const handleOpenDetail = (feature: Feature) => {
    const status = selectedPro.featureStatus[feature.id];
    setSelectedFeature(feature);
    setSelectedStage(status?.stage || 'not_attached');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Stage order for display
  const stageOrder: AdoptionStage[] = ['not_attached', 'attached', 'activated', 'engaged'];

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Features List
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View {selectedPro.companyName}'s feature adoption across {activeFeatures.length} features
        </Typography>
        {/* Overall progress */}
        {totalItems > 0 && (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={500}>
              Overall Progress: {totalCompleted}/{totalItems}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={totalItems > 0 ? (totalCompleted / totalItems) * 100 : 0}
              sx={{
                flex: 1,
                maxWidth: 300,
                height: 8,
                borderRadius: 4,
                bgcolor: palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  bgcolor: palette.success,
                  borderRadius: 4,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0}%
            </Typography>
          </Stack>
        )}
      </Box>

      {/* Feature Stage Summary */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <CategoryIcon sx={{ color: palette.primary }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Feature Stage Summary
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          {(Object.entries(featuresByStage) as [AdoptionStage, Feature[]][]).map(([stage, featuresAtStage]) => (
            <Paper
              key={stage}
              variant="outlined"
              sx={{
                flex: 1,
                p: 2,
                textAlign: 'center',
                borderColor: alpha(stageColors[stage], 0.3),
                bgcolor: alpha(stageColors[stage], 0.02),
              }}
            >
              <Typography variant="h4" fontWeight={700} sx={{ color: stageColors[stage] }}>
                {featuresAtStage.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stageLabels[stage]}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Paper>

      {/* Stage sections */}
      <Box>
        {stageOrder.map((stage) => (
          <FeatureStageSection
            key={stage}
            stage={stage}
            featuresAtStage={featuresByStage[stage]}
            selectedPro={selectedPro}
            expandedFeatureId={expandedFeature}
            onToggleFeatureExpanded={(featureId) => setExpandedFeature(expandedFeature === featureId ? null : featureId)}
            onOpenFeatureDetail={handleOpenDetail}
            expanded={expandedStage === stage}
            onToggleExpanded={() => setExpandedStage(expandedStage === stage ? null : stage)}
          />
        ))}
      </Box>

      {/* Feature Detail Modal */}
      <FeatureDetailModal
        feature={selectedFeature}
        stage={selectedStage}
        open={modalOpen}
        onClose={handleCloseModal}
        completedTaskIds={selectedFeature && selectedPro ? (selectedPro.featureStatus[selectedFeature.id]?.completedTasks || []) : []}
        onToggleTask={(taskId) => selectedFeature && onToggleTask(taskId, selectedFeature.id)}
      />
    </Box>
  );
}

// =============================================================================
// INFORMATION PAGE
// =============================================================================

function InformationPage({
  selectedPro,
}: {
  selectedPro: ProAccount | undefined;
}) {
  if (!selectedPro) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a pro account to view their information
        </Typography>
      </Paper>
    );
  }

  // Helper to render a read-only field
  const ReadOnlyField = ({ label, value, isChip = false, chipColor }: { label: string; value: string | number | boolean | undefined | null; isChip?: boolean; chipColor?: string }) => {
    if (value === undefined || value === null || value === '') return null;
    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);

    return (
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {label}
        </Typography>
        {isChip ? (
          <Chip
            label={displayValue}
            size="small"
            sx={{
              mt: 0.5,
              display: 'block',
              width: 'fit-content',
              bgcolor: chipColor ? alpha(chipColor, 0.1) : palette.grey[100],
              color: chipColor || palette.grey[600],
              fontWeight: 600,
            }}
          />
        ) : (
          <Typography variant="body1" fontWeight={500}>
            {displayValue}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Organization Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete Pro Data profile for {selectedPro.companyName}
        </Typography>
      </Box>

      {/* Basic Information */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <PersonIcon sx={{ color: palette.primary }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Basic Information
          </Typography>
        </Stack>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 3
        }}>
          <ReadOnlyField label="Company Name" value={selectedPro.companyName} />
          <ReadOnlyField label="Owner Name" value={selectedPro.ownerName} />
          <ReadOnlyField label="Plan" value={selectedPro.plan} isChip chipColor={selectedPro.plan === 'max' ? palette.primary : undefined} />
          <ReadOnlyField label="Company Goal" value={selectedPro.goal} isChip />
          <ReadOnlyField label="Created At" value={selectedPro.createdAt} />
        </Box>
      </Paper>

      {/* Organization IDs */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <LabelIcon sx={{ color: palette.primary }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Organization IDs
          </Typography>
        </Stack>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 3
        }}>
          <ReadOnlyField label="Business ID" value={selectedPro.businessId} />
          <ReadOnlyField label="Organization UUID" value={selectedPro.organizationUuid} />
          <ReadOnlyField label="Salesforce Account ID" value={selectedPro.salesforceAccountId} />
          <ReadOnlyField label="Salesforce Lead ID" value={selectedPro.salesforceLeadId} />
        </Box>
      </Paper>

      {/* Industry & Segment */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <CategoryIcon sx={{ color: palette.primary }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Industry & Segment
          </Typography>
        </Stack>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 3
        }}>
          <ReadOnlyField label="Industry" value={selectedPro.industry} />
          <ReadOnlyField label="Industry Standardized" value={selectedPro.industryStandardized} isChip />
          <ReadOnlyField label="Industry Type" value={selectedPro.industryType} isChip />
          <ReadOnlyField label="Segment" value={selectedPro.segment} isChip chipColor={palette.primary} />
          <ReadOnlyField label="Organization Bin Size" value={selectedPro.organizationBinSize} isChip />
          <ReadOnlyField label="Organization Size" value={selectedPro.organizationSize} />
          <ReadOnlyField label="Tech Readiness" value={selectedPro.techReadiness} isChip chipColor={selectedPro.techReadiness ? palette.success : palette.grey[400]} />
        </Box>
      </Paper>

      {/* Status Information */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <AssignmentIcon sx={{ color: palette.primary }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Status Information
          </Typography>
        </Stack>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 3
        }}>
          <ReadOnlyField
            label="Billing Status"
            value={selectedPro.billingStatus}
            isChip
            chipColor={selectedPro.billingStatus === 'enrolled' ? palette.success : selectedPro.billingStatus === 'trial' ? palette.warning : undefined}
          />
          <ReadOnlyField label="Organization Status" value={selectedPro.organizationStatus?.replace(/_/g, ' ')} isChip />
          <ReadOnlyField label="Customer Status" value={selectedPro.customerStatusDisplayName} />
          <ReadOnlyField label="Lead Status" value={selectedPro.leadStatus?.replace(/_/g, ' ')} isChip />
          <ReadOnlyField
            label="Fraud Status"
            value={selectedPro.fraudStatus?.replace(/_/g, ' ')}
            isChip
            chipColor={selectedPro.fraudStatus === 'risk_review_approved' ? palette.success : selectedPro.fraudStatus === 'risk_review_denied' ? palette.error : undefined}
          />
          <ReadOnlyField label="Retention Status" value={selectedPro.retentionStatus} isChip />
        </Box>
      </Paper>

      {/* Pain Points */}
      {selectedPro.painPoints && selectedPro.painPoints.length > 0 && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <InfoOutlinedIcon sx={{ color: palette.primary }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Pain Points
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {selectedPro.painPoints.map((painPoint) => (
              <Chip
                key={painPoint}
                label={painPoint}
                size="small"
                sx={{
                  bgcolor: alpha(palette.warning, 0.1),
                  color: palette.warning,
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
        </Paper>
      )}

      {/* Legacy Fields */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <ComputerIcon sx={{ color: palette.grey[400] }} />
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            Legacy Fields
          </Typography>
        </Stack>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 3
        }}>
          <ReadOnlyField label="Business Type" value={selectedPro.businessType} isChip />
        </Box>
      </Paper>
    </Box>
  );
}

// =============================================================================
// CALLS PAGE
// =============================================================================

function CallsPage({ selectedPro }: { selectedPro: ProAccount | undefined }) {
  const [expandedCallId, setExpandedCallId] = useState<string | null>('2');

  if (!selectedPro) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a pro account to manage their calls
        </Typography>
      </Paper>
    );
  }

  // Mock upcoming scheduled calls data
  const scheduledCalls = [
    {
      id: '1',
      callName: 'Pricing & Contract Review',
      assignedRep: 'Sarah Johnson',
      dateTime: '12/12/2025, 03:00 PM',
      calendlyEventUrl: 'https://calendly.com/event/123',
      zoomLink: 'https://zoom.us/j/123456789',
    },
    {
      id: '2',
      callName: 'Technical Onboarding Session',
      assignedRep: 'Michael Chen',
      dateTime: '12/15/2025, 10:00 AM',
      calendlyEventUrl: 'https://calendly.com/event/456',
      zoomLink: 'https://zoom.us/j/987654321',
    },
  ];

  // Mock past calls data with AI-generated details
  const pastCalls = [
    {
      id: '1',
      callName: 'Initial Discovery Call',
      dateTime: 'Dec 3, 2025 at 2:00 PM',
      rep: 'Sarah Johnson',
      customer: 'Mike Peterson',
      aiGenerated: true,
      summary: 'Introduced Housecall Pro features and discussed current business challenges. Mike expressed interest in streamlining his scheduling and invoicing processes. He mentioned they currently use paper-based systems and are looking to modernize.',
      proData: {
        organizationSize: '5-10 employees',
        industry: 'HVAC',
        painPoints: 'Manual scheduling, paper invoices, missed appointments',
        companyGoal: 'Reduce admin time by 50%',
        techReadiness: 'Low - Coming from pen and paper',
        decisionMaker: 'Mike Peterson (Owner)',
        currentTools: 'Paper calendars, Excel spreadsheets',
        budgetRange: '$2,000 - $5,000 annually',
      },
      featuresDiscussed: [
        {
          name: 'Online Scheduling',
          mappingStatus: 'mapped',
          sentiment: 'positive',
          snippet: '"This would save us so much time on phone calls."',
        },
        {
          name: 'Digital Invoicing',
          mappingStatus: 'mapped',
          sentiment: 'positive',
          snippet: '"I need to stop chasing paper invoices."',
        },
      ],
    },
    {
      id: '2',
      callName: 'Technical Deep Dive',
      dateTime: 'Dec 5, 2025 at 10:30 AM',
      rep: 'James Martinez',
      customer: 'Mike Peterson & Lisa Chen (Operations Manager)',
      aiGenerated: true,
      summary: 'Walked through the technical implementation with Mike and his operations manager Lisa. They were particularly impressed with the integration capabilities with QuickBooks. Lisa had detailed questions about the mobile app functionality and offline capabilities. Both expressed concerns about the learning curve for their existing team members.',
      proData: {
        organizationSize: '10-25 employees',
        industry: 'Plumbing & HVAC',
        painPoints: 'Team training, system migration, data import',
        companyGoal: 'Fully operational on new system within 60 days',
        techReadiness: 'Medium - Team has varying tech comfort levels',
        decisionMaker: 'Mike Peterson (Owner), Lisa Chen (Ops Manager)',
        currentTools: 'QuickBooks, Google Sheets, ServiceTitan (trial)',
        budgetRange: '$5,000 - $10,000 annually',
      },
      featuresDiscussed: [
        {
          name: 'QuickBooks Integration',
          mappingStatus: 'mapped',
          sentiment: 'positive',
          snippet: '"This is a must-have. We cannot afford to lose our financial data."',
        },
        {
          name: 'Offline Mobile Access',
          mappingStatus: 'mapped',
          sentiment: 'positive',
          snippet: '"Some of our jobs are in areas with poor cell coverage, so this is critical."',
        },
        {
          name: 'Training & Onboarding',
          mappingStatus: 'mapped',
          sentiment: 'neutral',
          snippet: '"We need to make sure the team can actually use this. What kind of support do you offer?"',
        },
      ],
    },
  ];

  const toggleExpanded = (callId: string) => {
    setExpandedCallId(expandedCallId === callId ? null : callId);
  };

  return (
    <Box>
      {/* Upcoming Scheduled Calls */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Upcoming Scheduled Calls
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 500, color: palette.grey[600] }}>Call name</TableCell>
              <TableCell sx={{ fontWeight: 500, color: palette.grey[600] }}>Assigned rep</TableCell>
              <TableCell sx={{ fontWeight: 500, color: palette.grey[600] }}>Time & date</TableCell>
              <TableCell sx={{ fontWeight: 500, color: palette.grey[600] }}>Calendly event</TableCell>
              <TableCell sx={{ fontWeight: 500, color: palette.grey[600] }}>Phone/Zoom link</TableCell>
              <TableCell sx={{ fontWeight: 500, color: palette.grey[600] }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduledCalls.map((call) => (
              <TableRow key={call.id} hover>
                <TableCell>{call.callName}</TableCell>
                <TableCell>{call.assignedRep}</TableCell>
                <TableCell>{call.dateTime}</TableCell>
                <TableCell>
                  <Link
                    href={call.calendlyEventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: palette.primary, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    View event
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={call.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: palette.primary, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Join Zoom
                  </Link>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Send email">
                      <IconButton size="small">
                        <EmailOutlinedIcon fontSize="small" sx={{ color: palette.grey[600] }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View notes">
                      <IconButton size="small">
                        <DescriptionOutlinedIcon fontSize="small" sx={{ color: palette.grey[600] }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Past Calls */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Past Calls
      </Typography>
      <Stack spacing={2}>
        {pastCalls.map((call) => {
          const isExpanded = expandedCallId === call.id;
          return (
            <Paper
              key={call.id}
              variant="outlined"
              sx={{
                overflow: 'hidden',
                borderLeft: 4,
                borderLeftColor: palette.primary,
              }}
            >
              {/* Call Header */}
              <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 20, color: palette.grey[600] }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {call.callName}
                      </Typography>
                      {call.aiGenerated && (
                        <Chip
                          label="AI Generated"
                          size="small"
                          sx={{
                            bgcolor: alpha('#FF6B35', 0.1),
                            color: '#FF6B35',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: 22,
                          }}
                        />
                      )}
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ color: palette.grey[600] }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarMonthIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{call.dateTime}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PersonIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">Rep: {call.rep}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <GroupsIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">Customer: {call.customer}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EmailOutlinedIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      Generate Follow-up Email
                    </Button>
                    <IconButton size="small" onClick={() => toggleExpanded(call.id)}>
                      {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>

              {/* Expanded Content */}
              <Collapse in={isExpanded}>
                <Box sx={{ px: 2, pb: 2 }}>
                  <Divider sx={{ mb: 2 }} />

                  {/* Call Summary */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Call Summary
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {call.summary}
                    </Typography>
                  </Box>

                  {/* Pro Data */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                      Pro Data
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2,
                        pl: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Organization Size
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {call.proData.organizationSize}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Industry
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {call.proData.industry}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pain Points
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {call.proData.painPoints}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Company Goal
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {call.proData.companyGoal}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tech Readiness
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {call.proData.techReadiness}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Decision Maker
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {call.proData.decisionMaker}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Current Tools
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {call.proData.currentTools}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Budget Range
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {call.proData.budgetRange}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Features Discussed */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                      Features Discussed
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 500, color: palette.grey[600], borderBottom: `1px solid ${palette.grey[200]}` }}>
                              Feature Name
                            </TableCell>
                            <TableCell sx={{ fontWeight: 500, color: palette.grey[600], borderBottom: `1px solid ${palette.grey[200]}` }}>
                              Mapping Status
                            </TableCell>
                            <TableCell sx={{ fontWeight: 500, color: palette.grey[600], borderBottom: `1px solid ${palette.grey[200]}` }}>
                              Sentiment
                            </TableCell>
                            <TableCell sx={{ fontWeight: 500, color: palette.grey[600], borderBottom: `1px solid ${palette.grey[200]}` }}>
                              Snippet
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {call.featuresDiscussed.map((feature, idx) => (
                            <TableRow key={idx}>
                              <TableCell sx={{ borderBottom: `1px solid ${palette.grey[100]}` }}>
                                {feature.name}
                              </TableCell>
                              <TableCell sx={{ borderBottom: `1px solid ${palette.grey[100]}` }}>
                                <Chip
                                  label={feature.mappingStatus === 'mapped' ? 'Mapped' : 'Unmapped'}
                                  size="small"
                                  sx={{
                                    bgcolor: feature.mappingStatus === 'mapped' ? palette.success : palette.grey[400],
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    height: 22,
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ borderBottom: `1px solid ${palette.grey[100]}` }}>
                                <Chip
                                  label={feature.sentiment.charAt(0).toUpperCase() + feature.sentiment.slice(1)}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor:
                                      feature.sentiment === 'positive'
                                        ? palette.success
                                        : feature.sentiment === 'negative'
                                        ? palette.error
                                        : palette.grey[400],
                                    color:
                                      feature.sentiment === 'positive'
                                        ? palette.success
                                        : feature.sentiment === 'negative'
                                        ? palette.error
                                        : palette.grey[600],
                                    fontWeight: 500,
                                    fontSize: '0.7rem',
                                    height: 22,
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom: `1px solid ${palette.grey[100]}`,
                                  fontStyle: 'italic',
                                  color: palette.grey[600],
                                }}
                              >
                                {feature.snippet}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}

// =============================================================================
// SIDEBAR MENU ITEMS
// =============================================================================

const menuItems: { id: FrontlinePage; label: string; icon: React.ReactNode }[] = [
  { id: 'information', label: 'Information', icon: <InfoOutlinedIcon /> },
  { id: 'onboarding-plan', label: 'Onboarding Plan', icon: <AssignmentIcon /> },
  { id: 'features-list', label: 'Features List', icon: <CategoryIcon /> },
  { id: 'calls', label: 'Calls', icon: <PhoneIcon /> },
];

// =============================================================================
// MAIN VIEW
// =============================================================================

export function FrontlineView() {
  const { features, pros, activeProId, completeTask, uncompleteTask } = useOnboarding();
  const [currentPage, setCurrentPage] = useState<FrontlinePage>('information');

  // Track category statuses (in a real app, this would be persisted per pro)
  const [categoryStatuses, setCategoryStatuses] = useState<Record<OnboardingCategoryId, CategoryStatus>>({
    'account-setup': 'not-covered',
    'the-basics': 'not-covered',
    'add-ons': 'not-covered',
    'estimates': 'not-covered',
    'jobs': 'not-covered',
    'invoicing': 'not-covered',
    'service-plans': 'not-covered',
    'additional-tools': 'not-covered',
    'reporting': 'not-covered',
  });

  // Track completed onboarding items (in a real app, this would be persisted per pro)
  const [completedOnboardingItems, setCompletedOnboardingItems] = useState<string[]>([]);

  const selectedPro = pros.find((p) => p.id === activeProId);

  const handleToggleTask = (taskId: string, featureId: FeatureId) => {
    if (!selectedPro || !featureId) return;
    const status = selectedPro.featureStatus[featureId];
    if (!status) return;
    if (status.completedTasks.includes(taskId)) {
      uncompleteTask(selectedPro.id, featureId, taskId);
    } else {
      completeTask(selectedPro.id, featureId, taskId);
    }
  };

  const handleToggleOnboardingItem = (itemId: string) => {
    setCompletedOnboardingItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleCategoryStatusChange = (categoryId: OnboardingCategoryId, status: CategoryStatus) => {
    setCategoryStatuses(prev => ({
      ...prev,
      [categoryId]: status,
    }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'information':
        return (
          <InformationPage
            selectedPro={selectedPro}
          />
        );
      case 'onboarding-plan':
        return (
          <OnboardingPlanPage
            selectedPro={selectedPro}
            completedItemIds={completedOnboardingItems}
            onToggleItem={handleToggleOnboardingItem}
            categoryStatuses={categoryStatuses}
            onCategoryStatusChange={handleCategoryStatusChange}
          />
        );
      case 'features-list':
        return (
          <FeaturesListPage
            features={features}
            selectedPro={selectedPro}
            onToggleTask={handleToggleTask}
          />
        );
      case 'calls':
        return <CallsPage selectedPro={selectedPro} />;
      default:
        return null;
    }
  };

  return (
    <PlanningWrapper elementId="view-frontline">
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
          {/* Sidebar Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <SupportAgentIcon sx={{ fontSize: 24, color: palette.primary }} />
              <Typography variant="h6" fontWeight={600}>
                Org Insights
              </Typography>
            </Stack>
          </Box>

          {/* Menu Items */}
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
