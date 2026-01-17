import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Checkbox,
  Collapse,
  Stack,
  Avatar,
  alpha,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import * as MuiIcons from '@mui/icons-material';
import { useState } from 'react';
import { useOnboarding, useActivePro } from '../../context';
import { onboardingItems as allOnboardingItems } from '../../data';
import { PlanningWrapper } from '../../planning';
import type { Feature, FeatureStatus, ProAccount, OnboardingItemAssignment } from '../../types';

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
// POINTS SYSTEM
// =============================================================================

const POINTS = {
  TASK_COMPLETE: 25,
  FEATURE_ATTACHED: 50,
  FEATURE_ACTIVATED: 100,
  FEATURE_ENGAGED: 150,
};

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

// Get required items for attached stage
function getRequiredItems(feature: Feature): OnboardingItemAssignment[] {
  return (feature.stages.attached.onboardingItems || []).filter(item => item.required);
}

// Get optional items (from activated and engaged stages or non-required attached)
function getOptionalItems(feature: Feature): OnboardingItemAssignment[] {
  const attached = (feature.stages.attached.onboardingItems || []).filter(item => !item.required);
  const activated = feature.stages.activated.onboardingItems || [];
  const engaged = feature.stages.engaged.onboardingItems || [];

  // Deduplicate
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

function calculateFeaturePoints(feature: Feature, status: FeatureStatus) {
  const allItems = getFeatureOnboardingItems(feature);

  const totalPossible =
    POINTS.FEATURE_ATTACHED +
    POINTS.FEATURE_ACTIVATED +
    POINTS.FEATURE_ENGAGED +
    (allItems.length * POINTS.TASK_COMPLETE);

  let earned = 0;
  if (status.stage !== 'not_attached') {
    earned += POINTS.FEATURE_ATTACHED;
    earned += status.completedTasks.length * POINTS.TASK_COMPLETE;
    if (status.stage === 'activated' || status.stage === 'engaged') {
      earned += POINTS.FEATURE_ACTIVATED;
    }
    if (status.stage === 'engaged') {
      earned += POINTS.FEATURE_ENGAGED;
    }
  }

  return { earned, totalPossible };
}

function calculateTotalPoints(pro: ProAccount, features: Feature[]) {
  let earned = 0;
  let totalPossible = 0;

  features.forEach((feature) => {
    const status = pro.featureStatus[feature.id];
    const points = calculateFeaturePoints(feature, status);
    earned += points.earned;
    totalPossible += points.totalPossible;
  });

  return { earned, totalPossible };
}

function calculateStreak(pro: ProAccount): number {
  const totalUsage = Object.values(pro.featureStatus).reduce((sum, s) => sum + s.usageCount, 0);
  if (totalUsage > 500) return 30;
  if (totalUsage > 200) return 14;
  if (totalUsage > 50) return 7;
  if (totalUsage > 10) return 3;
  return 1;
}

// =============================================================================
// COMPONENTS
// =============================================================================

function FeatureIcon({ iconName, ...props }: { iconName: string } & Record<string, unknown>) {
  const Icon = (MuiIcons as Record<string, React.ComponentType<Record<string, unknown>>>)[iconName] || MuiIcons.HelpOutlineRounded;
  return <Icon {...props} />;
}

// Timeline milestone status
type MilestoneStatus = 'completed' | 'current' | 'upcoming' | 'locked';

function getMilestoneStatus(status: FeatureStatus, requiredItems: OnboardingItemAssignment[]): MilestoneStatus {
  if (status.stage === 'not_attached') return 'locked';
  if (status.stage === 'engaged' || status.stage === 'activated') return 'completed';

  // For attached stage, check if they've started
  const completedCount = requiredItems.filter(item => status.completedTasks.includes(item.itemId)).length;
  const totalRequired = requiredItems.length;

  if (completedCount >= totalRequired) return 'completed';
  if (completedCount > 0) return 'current';

  return 'upcoming';
}

// Progress Summary Card at the top
function ProgressSummaryCard({
  pro,
  features,
  streak,
}: {
  pro: ProAccount;
  features: Feature[];
  streak: number;
}) {
  const { earned, totalPossible } = calculateTotalPoints(pro, features);
  const progressPercent = (earned / totalPossible) * 100;

  const completedFeatures = features.filter((f) => {
    const status = pro.featureStatus[f.id];
    return status.stage === 'engaged' || status.stage === 'activated';
  }).length;

  const availableFeatures = features.filter((f) => {
    const status = pro.featureStatus[f.id];
    return status.stage !== 'not_attached';
  }).length;

  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background: `linear-gradient(135deg, ${alpha(palette.primary, 0.03)} 0%, ${alpha(palette.success, 0.03)} 100%)`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={4} alignItems="center">
          {/* Points */}
          <Box sx={{ textAlign: 'center', minWidth: 100 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: palette.primary, lineHeight: 1 }}>
              {earned.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: palette.text.muted, mt: 0.5 }}>
              of {totalPossible.toLocaleString()} pts
            </Typography>
          </Box>

          {/* Progress */}
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight={500} sx={{ color: palette.text.secondary }}>
                Your Progress
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ color: palette.primary }}>
                {Math.round(progressPercent)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: alpha(palette.primary, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: palette.primary,
                  borderRadius: 5,
                },
              }}
            />
            <Typography variant="caption" sx={{ color: palette.text.muted, mt: 1, display: 'block' }}>
              {completedFeatures} of {availableFeatures} features mastered
            </Typography>
          </Box>

          {/* Streak */}
          <Box
            sx={{
              textAlign: 'center',
              px: 2.5,
              py: 1.5,
              borderRadius: 2,
              bgcolor: alpha(palette.orange, 0.08),
              border: '1px solid',
              borderColor: alpha(palette.orange, 0.2),
            }}
          >
            <LocalFireDepartmentIcon sx={{ fontSize: 24, color: palette.orange, mb: 0.25 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: palette.orange, lineHeight: 1 }}>
              {streak}
            </Typography>
            <Typography variant="caption" sx={{ color: palette.text.muted }}>
              day streak
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Single Timeline Milestone
function TimelineMilestone({
  feature,
  status,
  milestoneStatus,
  isFirst,
  isLast,
  isCurrent,
  onToggleTask,
}: {
  feature: Feature;
  status: FeatureStatus;
  milestoneStatus: MilestoneStatus;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
  onToggleTask: (taskId: string) => void;
}) {
  const [expanded, setExpanded] = useState(isCurrent);
  const requiredItems = getRequiredItems(feature);
  const optionalItems = getOptionalItems(feature);
  const { earned, totalPossible } = calculateFeaturePoints(feature, status);

  const completedRequiredItems = requiredItems.filter((item) => status.completedTasks.includes(item.itemId));
  const completedOptionalItems = optionalItems.filter((item) => status.completedTasks.includes(item.itemId));
  const nextItem = requiredItems.find((item) => !status.completedTasks.includes(item.itemId));

  const statusColors = {
    completed: palette.success,
    current: palette.primary,
    upcoming: palette.slate,
    locked: palette.text.muted,
  };

  const color = statusColors[milestoneStatus];

  // Get item definition by assignment
  const getItemDef = (assignment: OnboardingItemAssignment) => {
    return allOnboardingItems.find(item => item.id === assignment.itemId);
  };

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      {/* Timeline Track */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 3, width: 40 }}>
        {/* Top connector */}
        {!isFirst && (
          <Box
            sx={{
              width: 3,
              height: 24,
              bgcolor: milestoneStatus === 'completed' || isCurrent ? color : palette.bg.muted,
              borderRadius: 1,
            }}
          />
        )}

        {/* Node */}
        <Box
          sx={{
            width: isCurrent ? 48 : 40,
            height: isCurrent ? 48 : 40,
            borderRadius: '50%',
            bgcolor: milestoneStatus === 'completed' ? color : 'white',
            border: '3px solid',
            borderColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: milestoneStatus === 'completed' ? 'white' : color,
            boxShadow: isCurrent ? `0 0 0 4px ${alpha(color, 0.2)}` : 'none',
            transition: 'all 0.2s',
            zIndex: 1,
          }}
        >
          {milestoneStatus === 'completed' ? (
            <CheckCircleIcon sx={{ fontSize: 22 }} />
          ) : milestoneStatus === 'locked' ? (
            <LockOutlinedIcon sx={{ fontSize: 20 }} />
          ) : (
            <FeatureIcon iconName={feature.icon} sx={{ fontSize: 20 }} />
          )}
        </Box>

        {/* Bottom connector */}
        {!isLast && (
          <Box
            sx={{
              width: 3,
              flex: 1,
              minHeight: 24,
              bgcolor: milestoneStatus === 'completed' ? color : palette.bg.muted,
              borderRadius: 1,
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, pb: isLast ? 0 : 3, pt: isFirst ? 0 : 1 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 2.5,
            border: '1px solid',
            borderColor: isCurrent ? alpha(color, 0.3) : 'divider',
            bgcolor: isCurrent ? alpha(color, 0.02) : 'white',
            opacity: milestoneStatus === 'locked' ? 0.7 : 1,
            transition: 'all 0.2s',
            '&:hover': milestoneStatus !== 'locked' ? {
              borderColor: alpha(color, 0.4),
              boxShadow: `0 4px 12px ${alpha(color, 0.08)}`,
            } : {},
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            {/* Header */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ cursor: milestoneStatus !== 'locked' ? 'pointer' : 'default' }}
              onClick={() => milestoneStatus !== 'locked' && setExpanded(!expanded)}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha(color, 0.1),
                  color: color,
                }}
              >
                <FeatureIcon iconName={feature.icon} sx={{ fontSize: 20 }} />
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: palette.text.primary }}>
                    {feature.name}
                  </Typography>
                  {isCurrent && (
                    <Chip
                      label="You are here"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        bgcolor: color,
                        color: 'white',
                      }}
                    />
                  )}
                  {milestoneStatus === 'completed' && (
                    <Chip
                      label="Complete"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        bgcolor: alpha(palette.success, 0.1),
                        color: '#047857',
                      }}
                    />
                  )}
                </Stack>
                <Typography variant="body2" sx={{ color: palette.text.muted, mt: 0.25 }}>
                  {feature.description}
                </Typography>
              </Box>

              {/* Points */}
              <Box sx={{ textAlign: 'right', minWidth: 70 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ color: milestoneStatus === 'completed' ? palette.success : color }}
                >
                  {earned} pts
                </Typography>
                <Typography variant="caption" sx={{ color: palette.text.muted }}>
                  of {totalPossible}
                </Typography>
              </Box>

              {milestoneStatus !== 'locked' && (
                <IconButton size="small" sx={{ color: palette.text.muted }}>
                  <ExpandMoreIcon
                    sx={{
                      transform: expanded ? 'rotate(180deg)' : 'none',
                      transition: '0.2s',
                    }}
                  />
                </IconButton>
              )}
            </Stack>

            {/* Expanded Content */}
            <Collapse in={expanded && milestoneStatus !== 'locked'}>
              <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                {/* Current task highlight */}
                {nextItem && milestoneStatus === 'current' && (
                  <Box
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: alpha(palette.primary, 0.06),
                      border: '1px solid',
                      borderColor: alpha(palette.primary, 0.15),
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: palette.primary,
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {completedRequiredItems.length + 1}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={500}>
                            {getItemDef(nextItem)?.title || nextItem.itemId}
                          </Typography>
                          <Chip
                            label="Next step"
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              fontWeight: 500,
                              bgcolor: alpha(palette.primary, 0.15),
                              color: palette.primary,
                            }}
                          />
                          <Chip
                            label={`+${POINTS.TASK_COMPLETE} pts`}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              fontWeight: 600,
                              bgcolor: alpha(palette.success, 0.1),
                              color: '#047857',
                            }}
                          />
                        </Stack>
                        <Typography variant="caption" sx={{ color: palette.text.muted }}>
                          {getItemDef(nextItem)?.estimatedMinutes || 5} min
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        disableElevation
                        startIcon={<PlayArrowRoundedIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTask(nextItem.itemId);
                        }}
                        sx={{
                          bgcolor: palette.primary,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                        }}
                      >
                        Start
                      </Button>
                    </Stack>
                  </Box>
                )}

                {/* Required Tasks */}
                {requiredItems.length > 0 && (
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: palette.text.muted,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        Required Steps
                      </Typography>
                      <Chip
                        label={`${completedRequiredItems.length}/${requiredItems.length}`}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.6rem',
                          bgcolor: palette.bg.muted,
                          color: palette.text.muted,
                        }}
                      />
                    </Stack>

                    <Stack spacing={0.5}>
                      {requiredItems.map((item, index) => {
                        const itemDef = getItemDef(item);
                        const isComplete = status.completedTasks.includes(item.itemId);
                        const isNext = item.itemId === nextItem?.itemId;
                        return (
                          <Stack
                            key={item.itemId}
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{
                              py: 0.75,
                              px: 1.5,
                              borderRadius: 1.5,
                              bgcolor: isNext ? alpha(palette.primary, 0.04) : 'transparent',
                            }}
                          >
                            {isComplete ? (
                              <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: palette.success }} />
                            ) : (
                              <Avatar
                                sx={{
                                  width: 20,
                                  height: 20,
                                  bgcolor: isNext ? palette.primary : palette.bg.muted,
                                  color: isNext ? 'white' : palette.text.muted,
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                }}
                              >
                                {index + 1}
                              </Avatar>
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                flex: 1,
                                color: isComplete ? palette.text.muted : palette.text.primary,
                                textDecoration: isComplete ? 'line-through' : 'none',
                              }}
                            >
                              {itemDef?.title || item.itemId}
                            </Typography>
                            <Typography variant="caption" sx={{ color: palette.text.muted }}>
                              {isComplete ? `+${POINTS.TASK_COMPLETE}` : `${POINTS.TASK_COMPLETE} pts`}
                            </Typography>
                            {!isComplete && (
                              <Checkbox
                                checked={false}
                                onChange={() => onToggleTask(item.itemId)}
                                size="small"
                                sx={{ p: 0, color: palette.text.muted }}
                              />
                            )}
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Box>
                )}

                {/* Optional Tasks */}
                {optionalItems.length > 0 && (
                  <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: palette.text.muted,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        Bonus Steps
                      </Typography>
                      <Chip
                        label={`${completedOptionalItems.length}/${optionalItems.length}`}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.6rem',
                          bgcolor: alpha(palette.purple, 0.1),
                          color: palette.purple,
                        }}
                      />
                    </Stack>

                    <Stack spacing={0.5}>
                      {optionalItems.map((item) => {
                        const itemDef = getItemDef(item);
                        const isComplete = status.completedTasks.includes(item.itemId);
                        return (
                          <Stack
                            key={item.itemId}
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{ py: 0.75, px: 1.5 }}
                          >
                            {isComplete ? (
                              <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: palette.success }} />
                            ) : (
                              <StarRoundedIcon sx={{ fontSize: 18, color: palette.purple }} />
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                flex: 1,
                                color: isComplete ? palette.text.muted : palette.text.secondary,
                                textDecoration: isComplete ? 'line-through' : 'none',
                              }}
                            >
                              {itemDef?.title || item.itemId}
                            </Typography>
                            <Typography variant="caption" sx={{ color: palette.purple }}>
                              {isComplete ? `+${POINTS.TASK_COMPLETE}` : `${POINTS.TASK_COMPLETE} pts`}
                            </Typography>
                            {!isComplete && (
                              <Checkbox
                                checked={false}
                                onChange={() => onToggleTask(item.itemId)}
                                size="small"
                                sx={{ p: 0, color: palette.text.muted }}
                              />
                            )}
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Box>
                )}

                {/* Completion Bonus */}
                {milestoneStatus === 'completed' ? (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(palette.success, 0.06),
                      border: '1px solid',
                      borderColor: alpha(palette.success, 0.15),
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmojiEventsRoundedIcon sx={{ fontSize: 20, color: palette.success }} />
                      <Typography variant="body2" fontWeight={500} sx={{ color: '#047857' }}>
                        Feature mastered! +{POINTS.FEATURE_ACTIVATED + POINTS.FEATURE_ENGAGED} bonus pts earned
                      </Typography>
                    </Stack>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: palette.bg.subtle,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FlagRoundedIcon sx={{ fontSize: 20, color: palette.text.muted }} />
                      <Typography variant="body2" sx={{ color: palette.text.secondary }}>
                        Complete all steps to earn +{POINTS.FEATURE_ACTIVATED + POINTS.FEATURE_ENGAGED} bonus pts
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

// =============================================================================
// MAIN VIEW
// =============================================================================

export function PortalView() {
  const { features, pros, activeProId, setActivePro, completeTask, uncompleteTask } = useOnboarding();
  const activePro = useActivePro();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!activePro) {
    return <Typography>No pro selected</Typography>;
  }

  const streak = calculateStreak(activePro);

  const handleToggleTask = (featureId: string, taskId: string) => {
    const status = activePro.featureStatus[featureId as keyof typeof activePro.featureStatus];
    if (status.completedTasks.includes(taskId)) {
      uncompleteTask(activePro.id, featureId as keyof typeof activePro.featureStatus, taskId);
    } else {
      completeTask(activePro.id, featureId as keyof typeof activePro.featureStatus, taskId);
    }
  };

  // Sort features into timeline order:
  // 1. Completed features (oldest first)
  // 2. Current feature (in progress)
  // 3. Upcoming features (recommended first)
  // 4. Locked features
  const timelineFeatures = [...features].sort((a, b) => {
    const statusA = activePro.featureStatus[a.id];
    const statusB = activePro.featureStatus[b.id];
    const milestoneA = getMilestoneStatus(statusA, getRequiredItems(a));
    const milestoneB = getMilestoneStatus(statusB, getRequiredItems(b));

    const order = { completed: 0, current: 1, upcoming: 2, locked: 3 };
    return order[milestoneA] - order[milestoneB];
  });

  // Find the current milestone index
  const currentIndex = timelineFeatures.findIndex((f) => {
    const status = activePro.featureStatus[f.id];
    const milestone = getMilestoneStatus(status, getRequiredItems(f));
    return milestone === 'current';
  });

  // If no "current", find first "upcoming"
  const activeIndex = currentIndex >= 0 ? currentIndex : timelineFeatures.findIndex((f) => {
    const status = activePro.featureStatus[f.id];
    const milestone = getMilestoneStatus(status, getRequiredItems(f));
    return milestone === 'upcoming';
  });

  const goalTitle = activePro.goal === 'growth'
    ? `${activePro.companyName.replace(/\s+(LLC|Inc|Co\.|Corp|Ltd)\.?$/i, '')} Growth Plan`
    : `${activePro.companyName.replace(/\s+(LLC|Inc|Co\.|Corp|Ltd)\.?$/i, '')} Efficiency Plan`;

  return (
    <PlanningWrapper elementId="view-portal">
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary, letterSpacing: '-0.5px' }}>
            {goalTitle}
          </Typography>
          <Typography variant="body1" sx={{ color: palette.text.secondary, mt: 0.5 }}>
            Your personalized onboarding journey
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            borderColor: 'divider',
            color: palette.text.secondary,
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          Switch Pro
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            elevation: 0,
            sx: { border: '1px solid', borderColor: 'divider', borderRadius: 2, mt: 1 },
          }}
        >
          {pros.map((pro) => {
            const { earned } = calculateTotalPoints(pro, features);
            return (
              <MenuItem
                key={pro.id}
                selected={pro.id === activeProId}
                onClick={() => {
                  setActivePro(pro.id);
                  setAnchorEl(null);
                }}
                sx={{ py: 1.5, px: 2 }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {pro.companyName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: palette.text.muted }}>
                    {earned} pts earned
                  </Typography>
                </Box>
              </MenuItem>
            );
          })}
        </Menu>
      </Stack>

      {/* Progress Summary */}
      <ProgressSummaryCard pro={activePro} features={features} streak={streak} />

      {/* Timeline Section Header */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <FlagRoundedIcon sx={{ color: palette.primary, fontSize: 22 }} />
        <Typography variant="h6" fontWeight={600}>
          Your Onboarding Plan
        </Typography>
      </Stack>

      {/* Jump to current */}
      {activeIndex > 0 && (
        <Button
          size="small"
          startIcon={<ArrowDownwardRoundedIcon />}
          onClick={() => {
            document.getElementById(`milestone-${activeIndex}`)?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }}
          sx={{
            mb: 2,
            color: palette.primary,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Jump to current milestone
        </Button>
      )}

      {/* Timeline */}
      <Box sx={{ pl: 1 }}>
        {timelineFeatures.map((feature, index) => {
          const status = activePro.featureStatus[feature.id];
          const milestoneStatus = getMilestoneStatus(status, getRequiredItems(feature));
          const isCurrent = index === activeIndex;

          return (
            <Box key={feature.id} id={`milestone-${index}`}>
              <TimelineMilestone
                feature={feature}
                status={status}
                milestoneStatus={milestoneStatus}
                isFirst={index === 0}
                isLast={index === timelineFeatures.length - 1}
                isCurrent={isCurrent}
                onToggleTask={(taskId) => handleToggleTask(feature.id, taskId)}
              />
            </Box>
          );
        })}
      </Box>

      {/* Completion message */}
      {activeIndex === -1 && (
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
