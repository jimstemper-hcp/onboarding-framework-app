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
} from '@mui/material';
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
import * as MuiIcons from '@mui/icons-material';
import { useOnboarding } from '../../context';
import { onboardingItems as allOnboardingItems } from '../../data';
import type { Feature, AdoptionStage, FeatureId, ProAccount, OnboardingItemAssignment } from '../../types';

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

// =============================================================================
// PRO SELECTOR
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
    stageCounts[status.stage]++;
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
// MAIN VIEW
// =============================================================================

export function FrontlineView() {
  const { features, pros, completeTask, uncompleteTask } = useOnboarding();
  const [selectedProId, setSelectedProId] = useState<string | null>(pros[0]?.id || null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<FeatureId | null>(null);

  const selectedPro = pros.find((p) => p.id === selectedProId);
  const selectedFeature = features.find((f) => f.id === selectedFeatureId);
  const selectedFeatureStatus = selectedPro && selectedFeatureId
    ? selectedPro.featureStatus[selectedFeatureId]
    : null;

  const handleToggleTask = (taskId: string) => {
    if (!selectedPro || !selectedFeatureId) return;
    const status = selectedPro.featureStatus[selectedFeatureId];
    if (status.completedTasks.includes(taskId)) {
      uncompleteTask(selectedPro.id, selectedFeatureId, taskId);
    } else {
      completeTask(selectedPro.id, selectedFeatureId, taskId);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SupportAgentIcon sx={{ fontSize: 32, color: palette.primary }} />
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Frontline Rep View
            </Typography>
            <Typography variant="body2" color="text.secondary">
              See customer progress and get stage-appropriate context
            </Typography>
          </Box>
        </Box>
        <ProSelector pros={pros} selectedProId={selectedProId} onSelect={setSelectedProId} />
      </Stack>

      {selectedPro ? (
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
                return (
                  <FeatureStageCard
                    key={feature.id}
                    feature={feature}
                    stage={status.stage}
                    isSelected={selectedFeatureId === feature.id}
                    onClick={() => setSelectedFeatureId(feature.id)}
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
                completedTaskIds={selectedFeatureStatus.completedTasks}
                onToggleTask={handleToggleTask}
              />
            </Paper>
          )}
        </Stack>
      ) : (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Select a pro account to view their feature stages and context
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
