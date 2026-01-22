import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Checkbox,
  Stack,
  Avatar,
  alpha,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import * as MuiIcons from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useOnboarding, useActivePro } from '../../context';
import { onboardingItems as allOnboardingItems } from '../../data';
import { PlanningWrapper, usePlanningMode } from '../../planning';
import type { Feature, OnboardingItemAssignment, WeeklyPlan } from '../../types';

// =============================================================================
// MODERN COLOR PALETTE
// =============================================================================

const palette = {
  primary: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  orange: '#f97316',
  purple: '#8b5cf6',
  slate: '#64748b',
  text: {
    primary: '#0f172a',
    secondary: '#64748b',
    muted: '#94a3b8',
  },
  bg: {
    subtle: '#f8fafc',
    muted: '#f1f5f9',
  },
};

// =============================================================================
// PORTAL VIEW TYPES
// =============================================================================

type PortalViewMode = 'journey' | 'weekly';

type WeekNumber = 1 | 2 | 3 | 4;

// Helper to create an empty weekly plan
function createDefaultWeeklyPlan(): WeeklyPlan {
  return { week1: [], week2: [], week3: [], week4: [] };
}

// Get all onboarding items for a feature across stages
function getFeatureOnboardingItems(feature: Feature): OnboardingItemAssignment[] {
  const attached = feature.stages.attached.onboardingItems || [];
  const activated = feature.stages.activated.onboardingItems || [];
  const engaged = feature.stages.engaged.onboardingItems || [];

  // Deduplicate by itemId
  const seen = new Set<string>();
  const items: OnboardingItemAssignment[] = [];

  for (const item of [...attached, ...activated, ...engaged]) {
    if (!seen.has(item.itemId)) {
      seen.add(item.itemId);
      items.push(item);
    }
  }

  return items;
}


// =============================================================================
// COMPONENTS
// =============================================================================

function FeatureIcon({ iconName, ...props }: { iconName: string } & Record<string, unknown>) {
  const Icon = (MuiIcons as Record<string, React.ComponentType<Record<string, unknown>>>)[iconName] || MuiIcons.HelpOutlineRounded;
  return <Icon {...props} />;
}

// Simple Feature Card for Journey View
function FeatureCard({
  feature,
  isCompleted,
  onClick,
}: {
  feature: Feature;
  isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        mb: 1.5,
        cursor: 'pointer',
        borderRadius: 2,
        border: '1px solid',
        borderColor: isCompleted ? alpha(palette.success, 0.3) : 'divider',
        bgcolor: isCompleted ? alpha(palette.success, 0.04) : 'white',
        '&:hover': { borderColor: palette.primary, boxShadow: 1 },
      }}
    >
      <CardContent sx={{ py: 2, px: 2.5, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Icon */}
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: isCompleted ? palette.success : alpha(palette.slate, 0.1),
              color: isCompleted ? 'white' : palette.slate,
            }}
          >
            {isCompleted ? (
              <CheckCircleIcon sx={{ fontSize: 24 }} />
            ) : (
              <FeatureIcon iconName={feature.icon} sx={{ fontSize: 20 }} />
            )}
          </Avatar>

          {/* Content */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: isCompleted ? palette.success : palette.text.primary }}
            >
              {feature.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feature.description}
            </Typography>
          </Box>

          {/* Time + Arrow */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              1-3 mins
            </Typography>
            <ChevronRightIcon sx={{ color: palette.text.muted }} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// WEEKLY JOURNEY VIEW
// =============================================================================
// Focuses on current week's tasks with catch-up section for incomplete prior items.
// =============================================================================

interface WeeklyJourneyViewProps {
  currentWeek: WeekNumber;
  completedItemIds: string[];
  onToggleTask: (itemId: string) => void;
  weeklyPlan: WeeklyPlan;
}

function WeeklyJourneyView({ currentWeek, completedItemIds, onToggleTask, weeklyPlan }: WeeklyJourneyViewProps) {
  const totalWeeks = 4;
  const weekColor = palette.primary;

  const weekDescriptions: Record<WeekNumber, string> = {
    1: 'Set up your account basics',
    2: 'Create your first jobs & invoices',
    3: 'Enable time-saving automations',
    4: 'Optimize your business operations',
  };

  // Get week items from the weeklyPlan prop
  const getWeekItems = (week: WeekNumber) => {
    const weekKey = `week${week}` as keyof WeeklyPlan;
    return weeklyPlan[weekKey] || [];
  };

  // Get current week's items
  const currentWeekItems = getWeekItems(currentWeek).sort((a, b) => a.order - b.order);
  const currentWeekCompletedCount = currentWeekItems.filter(item => completedItemIds.includes(item.itemId)).length;
  const currentWeekProgress = currentWeekItems.length > 0 ? (currentWeekCompletedCount / currentWeekItems.length) * 100 : 0;

  // Get incomplete items from prior weeks
  const incompleteFromPriorWeeks: Array<{ itemId: string; fromWeek: WeekNumber }> = [];
  for (let week = 1 as WeekNumber; week < currentWeek; week++) {
    const weekItems = getWeekItems(week);
    for (const item of weekItems) {
      if (!completedItemIds.includes(item.itemId)) {
        incompleteFromPriorWeeks.push({ itemId: item.itemId, fromWeek: week });
      }
    }
  }

  // Render a task item
  const renderTaskItem = (
    itemId: string,
    index: number,
    totalItems: number,
    showWeekBadge?: WeekNumber
  ) => {
    const itemDef = allOnboardingItems.find(i => i.id === itemId);
    const isCompleted = completedItemIds.includes(itemId);

    if (!itemDef) {
      return (
        <Box
          key={itemId}
          sx={{
            px: 3,
            py: 2,
            borderBottom: index < totalItems - 1 ? '1px solid' : 'none',
            borderColor: alpha(palette.slate, 0.08),
          }}
        >
          <Typography variant="body2" color={palette.text.muted}>
            Task: {itemId}
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        key={itemId}
        sx={{
          px: 3,
          py: 2,
          borderBottom: index < totalItems - 1 ? '1px solid' : 'none',
          borderColor: alpha(palette.slate, 0.08),
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
          '&:hover': {
            bgcolor: alpha(palette.primary, 0.03),
          },
        }}
        onClick={() => onToggleTask(itemId)}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Checkbox
            checked={isCompleted}
            onChange={() => onToggleTask(itemId)}
            icon={<CheckCircleOutlinedIcon />}
            checkedIcon={<CheckCircleIcon />}
            sx={{
              p: 0,
              color: palette.slate,
              '&.Mui-checked': { color: palette.success },
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? palette.text.muted : palette.text.primary,
              }}
            >
              {itemDef.title}
            </Typography>
            {showWeekBadge && (
              <Chip
                label={`Week ${showWeekBadge}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  bgcolor: alpha(palette.warning, 0.15),
                  color: palette.warning,
                }}
              />
            )}
            <Box sx={{ flex: 1 }} />
            {itemDef.estimatedMinutes && (
              <Typography variant="caption" color={palette.text.muted}>
                ~{itemDef.estimatedMinutes} min
              </Typography>
            )}
          </Stack>
          {isCompleted && (
            <CheckCircleIcon sx={{ fontSize: 20, color: palette.success }} />
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <Box>
      {/* Catch-up Section - Incomplete items from prior weeks */}
      {incompleteFromPriorWeeks.length > 0 && (
        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: alpha(palette.warning, 0.3),
            bgcolor: alpha(palette.warning, 0.02),
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: '1px solid',
              borderColor: alpha(palette.warning, 0.15),
              bgcolor: alpha(palette.warning, 0.05),
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: alpha(palette.warning, 0.15),
                  color: palette.warning,
                }}
              >
                <FlagRoundedIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} color={palette.text.primary}>
                  Catch Up ({incompleteFromPriorWeeks.length})
                </Typography>
                <Typography variant="caption" color={palette.text.secondary}>
                  Complete these items from previous weeks
                </Typography>
              </Box>
            </Stack>
          </Box>
          <CardContent sx={{ p: 0 }}>
            {incompleteFromPriorWeeks.map((item, index) =>
              renderTaskItem(item.itemId, index, incompleteFromPriorWeeks.length, item.fromWeek)
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Week's Tasks (with integrated week status header) */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: alpha(weekColor, 0.2),
          overflow: 'hidden',
        }}
      >
        {/* Week Status Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: '1px solid',
            borderColor: alpha(palette.slate, 0.1),
            bgcolor: alpha(weekColor, 0.03),
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: weekColor,
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                {currentWeek}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} color={palette.text.primary}>
                  Week {currentWeek} of {totalWeeks}
                </Typography>
                <Typography variant="body2" color={palette.text.secondary}>
                  {weekDescriptions[currentWeek]}
                </Typography>
              </Box>
            </Stack>

            {/* Week indicator dots */}
            <Stack direction="row" spacing={1} alignItems="center">
              {([1, 2, 3, 4] as WeekNumber[]).map(week => (
                <Box
                  key={week}
                  sx={{
                    width: week === currentWeek ? 24 : 10,
                    height: 10,
                    borderRadius: 5,
                    bgcolor: week < currentWeek
                      ? palette.success
                      : week === currentWeek
                        ? weekColor
                        : alpha(palette.slate, 0.2),
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Stack>
          </Stack>

          {/* Progress bar */}
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="caption" fontWeight={500} color={palette.text.secondary}>
                Progress
              </Typography>
              <Typography variant="caption" fontWeight={600} color={palette.text.primary}>
                {currentWeekCompletedCount}/{currentWeekItems.length} tasks
                {currentWeekCompletedCount === currentWeekItems.length && currentWeekItems.length > 0 && ' ✓'}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={currentWeekProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(palette.slate, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: currentWeekCompletedCount === currentWeekItems.length ? palette.success : weekColor,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        </Box>

        {/* Task List */}
        <CardContent sx={{ p: 0 }}>
          {currentWeekItems.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color={palette.text.muted}>
                No tasks assigned for this week
              </Typography>
            </Box>
          ) : (
            currentWeekItems.map((item, index) =>
              renderTaskItem(item.itemId, index, currentWeekItems.length)
            )
          )}
        </CardContent>
      </Card>

      {/* Next Week Preview (if not on final week) */}
      {currentWeek < 4 && (
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: 2,
            bgcolor: palette.bg.subtle,
            border: '1px dashed',
            borderColor: alpha(palette.slate, 0.2),
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: alpha(palette.slate, 0.1),
                color: palette.slate,
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {currentWeek + 1}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={500} color={palette.text.secondary}>
                Coming up: Week {currentWeek + 1}
              </Typography>
              <Typography variant="caption" color={palette.text.muted}>
                {weekDescriptions[(currentWeek + 1) as WeekNumber]} • {getWeekItems((currentWeek + 1) as WeekNumber).length} tasks
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}

// =============================================================================
// MAIN VIEW
// =============================================================================

export function PortalView() {
  const { features: allFeatures, completeTask, uncompleteTask, openChatWithPrompt } = useOnboarding();
  const activePro = useActivePro();
  const [viewMode, setViewMode] = useState<PortalViewMode>('journey');
  const { setCurrentPage, isPlanningMode } = usePlanningMode();

  // Filter to only show published features in user-facing view
  const features = allFeatures.filter((f) => f.releaseStatus === 'published');

  // Report current page to planning context
  useEffect(() => {
    if (isPlanningMode) {
      const pageId = viewMode === 'journey' ? 'page-hcp-web-journey' : 'page-hcp-web-weekly';
      setCurrentPage(pageId);
    }
  }, [isPlanningMode, viewMode, setCurrentPage]);

  if (!activePro) {
    return <Typography>No pro selected</Typography>;
  }

  // Collect all completed task IDs across all features for weekly view
  const allCompletedItemIds = Object.values(activePro.featureStatus)
    .flatMap(status => status.completedTasks);

  const handleToggleTask = (featureId: string, taskId: string) => {
    const status = activePro.featureStatus[featureId as keyof typeof activePro.featureStatus];
    if (!status) return;
    if (status.completedTasks.includes(taskId)) {
      uncompleteTask(activePro.id, featureId as keyof typeof activePro.featureStatus, taskId);
    } else {
      completeTask(activePro.id, featureId as keyof typeof activePro.featureStatus, taskId);
    }
  };

  // Handler for weekly view task toggle (finds the feature containing the task)
  const handleWeeklyTaskToggle = (itemId: string) => {
    // Find which feature this item belongs to by checking all feature's onboarding items
    for (const feature of features) {
      const allItems = getFeatureOnboardingItems(feature);
      if (allItems.some(item => item.itemId === itemId)) {
        handleToggleTask(feature.id, itemId);
        return;
      }
    }
    // If not found in features, it might be a general onboarding item
    // For now, just toggle it in the first feature that has it in completedTasks
    for (const featureId of Object.keys(activePro.featureStatus)) {
      const status = activePro.featureStatus[featureId as keyof typeof activePro.featureStatus];
      if (status && (status.completedTasks.includes(itemId) || status.stage !== 'not_attached')) {
        handleToggleTask(featureId, itemId);
        return;
      }
    }
  };

  // Filter features that have status data for this pro and are not "not_attached"
  const journeyFeatures = features.filter((f) => {
    const status = activePro.featureStatus[f.id];
    return status && status.stage !== 'not_attached';
  });

  // Calculate progress for the simple progress bar
  const completedCount = journeyFeatures.filter((f) => {
    const status = activePro.featureStatus[f.id];
    return status && (status.stage === 'activated' || status.stage === 'engaged');
  }).length;
  const totalCount = journeyFeatures.length;
  const allComplete = totalCount > 0 && completedCount === totalCount;

  const goalTitle = activePro.goal === 'growth'
    ? `${activePro.companyName.replace(/\s+(LLC|Inc|Co\.|Corp|Ltd)\.?$/i, '')} Growth Plan`
    : `${activePro.companyName.replace(/\s+(LLC|Inc|Co\.|Corp|Ltd)\.?$/i, '')} Efficiency Plan`;

  return (
    <PlanningWrapper elementId="view-portal">
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary, letterSpacing: '-0.5px' }}>
              {goalTitle}
            </Typography>
            <Typography variant="body1" sx={{ color: palette.text.secondary, mt: 0.5 }}>
              {viewMode === 'journey'
                ? 'Your personalized onboarding journey'
                : `Week ${activePro.currentWeek} of your onboarding plan`
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
                borderColor: alpha(palette.slate, 0.2),
                '&.Mui-selected': {
                  bgcolor: alpha(palette.primary, 0.08),
                  color: palette.primary,
                  borderColor: alpha(palette.primary, 0.3),
                },
              },
            }}
          >
            <ToggleButton value="journey">
              <ViewListIcon sx={{ fontSize: 18, mr: 0.75 }} />
              Journey
            </ToggleButton>
            <ToggleButton value="weekly">
              <ViewWeekIcon sx={{ fontSize: 18, mr: 0.75 }} />
              Weekly
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {/* Content based on view mode */}
      {viewMode === 'journey' ? (
        <>
          {/* Simple Progress Bar */}
          <Box sx={{ mb: 3 }}>
            <LinearProgress
              variant="determinate"
              value={totalCount > 0 ? (completedCount / totalCount) * 100 : 0}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: palette.success,
                  borderRadius: 4,
                },
              }}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress {completedCount} of {totalCount}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 16, color: palette.success }} />
                <Typography variant="caption">Completed</Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Feature List */}
          {journeyFeatures.map((feature) => {
            const status = activePro.featureStatus[feature.id];
            const isCompleted = status && (status.stage === 'activated' || status.stage === 'engaged');

            return (
              <FeatureCard
                key={feature.id}
                feature={feature}
                isCompleted={isCompleted}
                onClick={() => openChatWithPrompt(`How do I get started with ${feature.name}?`)}
              />
            );
          })}
        </>
      ) : (
        /* Weekly Planning View */
        <>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
            <CalendarTodayIcon sx={{ color: palette.primary, fontSize: 22 }} />
            <Typography variant="h6" fontWeight={600}>
              Weekly Onboarding Plan
            </Typography>
          </Stack>
          <WeeklyJourneyView
            currentWeek={activePro.currentWeek}
            completedItemIds={allCompletedItemIds}
            onToggleTask={handleWeeklyTaskToggle}
            weeklyPlan={activePro.weeklyPlan || createDefaultWeeklyPlan()}
          />
        </>
      )}

      {/* Completion message - only show in journey mode when all complete */}
      {viewMode === 'journey' && allComplete && (
        <Card
          elevation={0}
          sx={{
            mt: 4,
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid',
            borderColor: alpha(palette.success, 0.3),
            bgcolor: alpha(palette.success, 0.04),
          }}
        >
          <EmojiEventsRoundedIcon sx={{ fontSize: 48, color: palette.success, mb: 2 }} />
          <Typography variant="h5" fontWeight={600} sx={{ color: palette.text.primary, mb: 1 }}>
            Congratulations!
          </Typography>
          <Typography variant="body1" sx={{ color: palette.text.secondary }}>
            You've completed your onboarding journey. You're now a Housecall Pro power user!
          </Typography>
        </Card>
      )}
    </Box>
    </PlanningWrapper>
  );
}
