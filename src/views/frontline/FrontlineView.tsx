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
import PhoneIcon from '@mui/icons-material/Phone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import * as MuiIcons from '@mui/icons-material';
import { useOnboarding } from '../../context';
import { onboardingItems as allOnboardingItems, onboardingCategories } from '../../data';
import { PlanningWrapper } from '../../planning';
import type { Feature, AdoptionStage, FeatureId, ProAccount, OnboardingItemAssignment, OnboardingCategoryId, OnboardingCategory, OnboardingItemDefinition } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

type FrontlinePage = 'onboarding-plan' | 'features-list' | 'calls';

type CategoryStatus = 'not-covered' | 'in-progress' | 'completed';

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
        <Typography variant="h6" fontWeight={600}>
          Onboarding Plan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track {selectedPro.companyName}'s onboarding progress across 9 categories
        </Typography>
        {/* Overall progress */}
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
      </Box>

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
    </Box>
  );
}

// =============================================================================
// FEATURES LIST PAGE (current content)
// =============================================================================

function FeaturesListPage({
  features,
  selectedPro,
  selectedFeatureId,
  onSelectFeature,
  completedTaskIds,
  onToggleTask,
}: {
  features: Feature[];
  selectedPro: ProAccount | undefined;
  selectedFeatureId: FeatureId | null;
  onSelectFeature: (featureId: FeatureId) => void;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}) {
  const selectedFeature = features.find((f) => f.id === selectedFeatureId);
  const selectedFeatureStatus = selectedPro && selectedFeatureId
    ? selectedPro.featureStatus[selectedFeatureId]
    : null;

  if (!selectedPro) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a pro account to view their feature stages
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack direction="row" spacing={3}>
      {/* Left Column - Pro Overview + Feature Grid */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Pro Overview */}
        <ProOverviewCard pro={selectedPro} features={features} />

        {/* Feature Grid */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3, mb: 2 }}>
          Feature Stages
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 2,
          }}
        >
          {features.map((feature) => {
            const status = selectedPro.featureStatus[feature.id];
            if (!status) return null;
            return (
              <FeatureStageCard
                key={feature.id}
                feature={feature}
                stage={status.stage}
                isSelected={selectedFeatureId === feature.id}
                onClick={() => onSelectFeature(feature.id)}
              />
            );
          })}
        </Box>

        {/* Quick Actions */}
        {!selectedFeatureId && (
          <Paper
            variant="outlined"
            sx={{ mt: 3, p: 3, textAlign: 'center', bgcolor: palette.grey[50] }}
          >
            <PlayArrowIcon sx={{ fontSize: 40, color: palette.grey[400], mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              Select a feature to view stage-specific context and onboarding items
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Right Column - Feature Detail Panel */}
      {selectedFeature && selectedFeatureStatus && (
        <Paper
          elevation={0}
          sx={{
            width: 420,
            flexShrink: 0,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            maxHeight: 'calc(100vh - 180px)',
            overflow: 'auto',
          }}
        >
          <ContextDetailPanel
            feature={selectedFeature}
            stage={selectedFeatureStatus.stage}
            completedTaskIds={completedTaskIds}
            onToggleTask={onToggleTask}
          />
        </Paper>
      )}
    </Stack>
  );
}

// =============================================================================
// CALLS PAGE
// =============================================================================

function CallsPage({ selectedPro }: { selectedPro: ProAccount | undefined }) {
  if (!selectedPro) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a pro account to manage their calls
        </Typography>
      </Paper>
    );
  }

  // Mock call data - in a real app this would come from Calendly integration
  const scheduledCalls = [
    {
      id: '1',
      type: 'Onboarding Setup',
      date: 'Jan 20, 2026 at 2:00 PM',
      team: 'onboarding',
      status: 'scheduled',
    },
    {
      id: '2',
      type: 'Feature Training',
      date: 'Jan 22, 2026 at 10:00 AM',
      team: 'onboarding',
      status: 'scheduled',
    },
  ];

  const completedCalls = [
    {
      id: '3',
      type: 'Intro Call',
      date: 'Jan 15, 2026 at 3:00 PM',
      team: 'onboarding',
      status: 'completed',
      notes: 'Discussed invoicing goals and timeline',
    },
  ];

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Calls Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Schedule and manage Calendly calls for {selectedPro.companyName}
        </Typography>
      </Box>

      {/* Schedule new call button */}
      <Button
        variant="contained"
        startIcon={<CalendarMonthIcon />}
        sx={{ mb: 3 }}
        onClick={() => window.open('https://calendly.com/hcp-onboarding', '_blank')}
      >
        Schedule New Call
      </Button>

      {/* Scheduled Calls */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Scheduled Calls
      </Typography>
      {scheduledCalls.length > 0 ? (
        <Stack spacing={2} sx={{ mb: 4 }}>
          {scheduledCalls.map((call) => (
            <Paper key={call.id} variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {call.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {call.date}
                  </Typography>
                  <Chip
                    label={call.team}
                    size="small"
                    sx={{ mt: 0.5, height: 20, fontSize: '0.65rem' }}
                  />
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined">
                    Reschedule
                  </Button>
                  <Button size="small" color="error" variant="outlined">
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Paper variant="outlined" sx={{ p: 3, mb: 4, textAlign: 'center', bgcolor: palette.grey[50] }}>
          <Typography color="text.secondary">No scheduled calls</Typography>
        </Paper>
      )}

      {/* Completed Calls */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Completed Calls
      </Typography>
      {completedCalls.length > 0 ? (
        <Stack spacing={2}>
          {completedCalls.map((call) => (
            <Paper key={call.id} variant="outlined" sx={{ p: 2, bgcolor: alpha(palette.success, 0.02) }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon sx={{ fontSize: 18, color: palette.success }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      {call.type}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {call.date}
                  </Typography>
                  {call.notes && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                      Notes: {call.notes}
                    </Typography>
                  )}
                </Box>
                <Button size="small" variant="text">
                  View Details
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: palette.grey[50] }}>
          <Typography color="text.secondary">No completed calls</Typography>
        </Paper>
      )}
    </Box>
  );
}

// =============================================================================
// SIDEBAR MENU ITEMS
// =============================================================================

const menuItems: { id: FrontlinePage; label: string; icon: React.ReactNode }[] = [
  { id: 'onboarding-plan', label: 'Onboarding Plan', icon: <AssignmentIcon /> },
  { id: 'features-list', label: 'Features List', icon: <CategoryIcon /> },
  { id: 'calls', label: 'Calls', icon: <PhoneIcon /> },
];

// =============================================================================
// MAIN VIEW
// =============================================================================

export function FrontlineView() {
  const { features, pros, completeTask, uncompleteTask } = useOnboarding();
  const [selectedProId, setSelectedProId] = useState<string | null>(pros[0]?.id || null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<FeatureId | null>(null);
  const [currentPage, setCurrentPage] = useState<FrontlinePage>('onboarding-plan');

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

  const selectedPro = pros.find((p) => p.id === selectedProId);
  const selectedFeatureStatus = selectedPro && selectedFeatureId
    ? selectedPro.featureStatus[selectedFeatureId]
    : null;

  const handleToggleTask = (taskId: string) => {
    if (!selectedPro || !selectedFeatureId) return;
    const status = selectedPro.featureStatus[selectedFeatureId];
    if (!status) return;
    if (status.completedTasks.includes(taskId)) {
      uncompleteTask(selectedPro.id, selectedFeatureId, taskId);
    } else {
      completeTask(selectedPro.id, selectedFeatureId, taskId);
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
            selectedFeatureId={selectedFeatureId}
            onSelectFeature={setSelectedFeatureId}
            completedTaskIds={selectedFeatureStatus?.completedTasks || []}
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
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <SupportAgentIcon sx={{ fontSize: 24, color: palette.primary }} />
              <Typography variant="h6" fontWeight={600}>
                Org Insights
              </Typography>
            </Stack>
            <ProSelectorSidebar
              pros={pros}
              selectedProId={selectedProId}
              onSelect={setSelectedProId}
            />
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
