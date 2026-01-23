import { Router, Request, Response } from 'express';
import { Pro } from '../../../models/Pro';
import { FeatureRegistry } from '../../../services/onboarding/FeatureRegistry';
import type { AdoptionStage, WeeklyPlanItem, FeatureId } from '../../../types';

export const mcpOnboardingRoutes = Router();

// Helper to safely get string param (Express v5 types params as string | string[])
const getParam = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

/**
 * GET /api/mcp/onboarding/context
 * MCP Tool: get_onboarding_context
 * Returns context for AI agents to understand pro's current state
 * HP-5118 compliant response structure
 */
mcpOnboardingRoutes.get('/context', (req: Request, res: Response) => {
  const proId = (req.query.pro_id as string) || 'pro-001';
  const featureId = req.query.feature_id as string | undefined;
  const pro = Pro.find(proId);

  if (!pro) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }

  // Build pro info summary
  const proInfo = {
    id: pro.id,
    companyName: pro.companyName,
    ownerName: pro.ownerName,
    businessType: pro.businessType,
    plan: pro.plan,
    goal: pro.goal,
    currentWeek: pro.currentWeek,
  };

  // HP-5118: Build features array with state information
  const allFeatures = FeatureRegistry.getAllFeatures();
  const featuresWithState = allFeatures.map((feature) => {
    const status = pro.featureStatus[feature.id as FeatureId];
    const stage = status?.stage || 'not_attached';
    const stageKey = stage === 'not_attached' ? 'notAttached' : stage;
    const stageContext = feature.stages[stageKey as keyof typeof feature.stages];

    // Determine state per HP-5118: not_attached, attached, or activated
    let state: 'not_attached' | 'attached' | 'activated' = stage;

    return {
      id: feature.id,
      name: feature.name,
      value_statement: feature.value_statement || feature.description,
      feature_key: feature.feature_key || feature.id,
      permissions_required: feature.permissions_required || [],
      call_to_book_url: feature.call_to_book_url,
      sell_page_url: feature.sell_page_url,
      state,
      completion_steps: feature.completion_steps || [],
      completed_steps: status?.completedTasks || [],
      pending_steps: stageContext?.onboardingItems.filter(
        (item) => !status?.completedTasks?.includes(item.itemId)
      ) || [],
      context: stageContext,
    };
  });

  // If feature_id is specified, get that feature's detailed context
  let currentFeature = null;
  if (featureId) {
    const feature = FeatureRegistry.findFeature(featureId);
    if (feature) {
      const status = pro.featureStatus[feature.id as FeatureId];
      const stage = status?.stage || 'not_attached';
      const stageKey = stage === 'not_attached' ? 'notAttached' : stage;
      const stageContext = feature.stages[stageKey as keyof typeof feature.stages];

      currentFeature = {
        featureId: feature.id,
        name: feature.name,
        value_statement: feature.value_statement || feature.description,
        feature_key: feature.feature_key || feature.id,
        state: stage,
        completion_steps: feature.completion_steps || [],
        completedSteps: status?.completedTasks || [],
        pendingSteps: stageContext?.onboardingItems.filter(
          (item) => !status?.completedTasks?.includes(item.itemId)
        ) || [],
        context: stageContext,
        aiPrompt: stageContext?.prompt || '',
        tools: stageContext?.tools || [],
      };
    }
  }

  // Get next steps (top 3 uncompleted items)
  const allItems = FeatureRegistry.getAllItems();
  const completedItems = pro.completedItems || [];
  const nextSteps = allItems
    .filter((item) => !completedItems.includes(item.id))
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      estimatedMinutes: item.estimatedMinutes,
      actionUrl: item.actionUrl,
    }));

  // Get available tools for current stage
  const availableTools = currentFeature?.tools || FeatureRegistry.getAllTools();

  res.json({
    pro: proInfo,
    features: featuresWithState,
    currentFeature,
    next_steps: nextSteps,
    available_tools: availableTools,
  });
});

/**
 * GET /api/mcp/onboarding/feature/:id
 * MCP Tool: get_feature_details
 * Returns detailed information about a specific feature and its stage
 */
mcpOnboardingRoutes.get('/feature/:id', (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const proId = (req.query.pro_id as string) || 'pro-001';
  const pro = Pro.find(proId);

  if (!pro) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }

  const feature = FeatureRegistry.findFeature(id);
  if (!feature) {
    res.status(404).json({ error: 'Feature not found' });
    return;
  }

  const status = pro.featureStatus[feature.id];
  const stage = status?.stage || 'not_attached';
  const stageKey = stage === 'not_attached' ? 'notAttached' : stage;
  const stageContext = feature.stages[stageKey as keyof typeof feature.stages];

  // Resolve onboarding item details
  const onboardingItemDetails = stageContext?.onboardingItems.map((assignment) => {
    const item = FeatureRegistry.findItem(assignment.itemId);
    return {
      ...assignment,
      item,
      completed: status?.completedTasks?.includes(assignment.itemId) || false,
    };
  }) || [];

  res.json({
    feature: {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      icon: feature.icon,
      version: feature.version,
    },
    state: stage,
    stageContext: {
      contextSnippets: stageContext?.contextSnippets || [],
      navigation: stageContext?.navigation || [],
      calendlyTypes: stageContext?.calendlyTypes || [],
      onboardingItems: onboardingItemDetails,
    },
    aiPrompt: stageContext?.prompt || '',
    tools: stageContext?.tools || [],
  });
});

/**
 * GET /api/mcp/onboarding/next-steps
 * MCP Tool: get_next_steps
 * Returns prioritized list of next actions for a pro
 */
mcpOnboardingRoutes.get('/next-steps', (req: Request, res: Response) => {
  const proId = (req.query.pro_id as string) || 'pro-001';
  const limit = parseInt(req.query.limit as string) || 5;
  const pro = Pro.find(proId);

  if (!pro) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }

  const allItems = FeatureRegistry.getAllItems();
  const completedItems = pro.completedItems || [];

  // Get items for current week from weekly plan
  const currentWeekKey = `week${pro.currentWeek}` as keyof typeof pro.weeklyPlan;
  const weeklyPlanItems: WeeklyPlanItem[] = pro.weeklyPlan?.[currentWeekKey] || [];
  const weeklyItemIds = weeklyPlanItems.map((item: WeeklyPlanItem) => item.itemId);

  // Prioritize weekly plan items, then other incomplete items
  const weeklyItems = allItems.filter(
    (item) => weeklyItemIds.includes(item.id) && !completedItems.includes(item.id)
  );

  const otherItems = allItems.filter(
    (item) => !weeklyItemIds.includes(item.id) && !completedItems.includes(item.id)
  );

  const prioritizedItems = [...weeklyItems, ...otherItems].slice(0, limit);

  res.json({
    proId,
    currentWeek: pro.currentWeek,
    completedCount: completedItems.length,
    nextSteps: prioritizedItems.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      category: item.category,
      estimatedMinutes: item.estimatedMinutes,
      actionUrl: item.actionUrl,
      points: item.points,
      isWeeklyPlanItem: weeklyItemIds.includes(item.id),
    })),
  });
});

/**
 * POST /api/mcp/onboarding/complete-step
 * MCP Tool: complete_onboarding_step
 * Marks an onboarding step as complete
 */
mcpOnboardingRoutes.post('/complete-step', (req: Request, res: Response) => {
  const { pro_id: proId, item_id: itemId } = req.body;

  if (!proId || !itemId) {
    res.status(400).json({ error: 'pro_id and item_id are required' });
    return;
  }

  const updatedPro = Pro.completeItem(proId, itemId);
  if (!updatedPro) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }

  const item = FeatureRegistry.findItem(itemId);

  res.json({
    success: true,
    completedItem: {
      id: itemId,
      title: item?.title,
      points: item?.points,
    },
    totalCompleted: updatedPro.completedItems?.length || 0,
  });
});

/**
 * GET /api/mcp/onboarding/pro-summary
 * MCP Tool: get_pro_summary
 * Returns a high-level summary of a pro's onboarding progress
 */
mcpOnboardingRoutes.get('/pro-summary', (req: Request, res: Response) => {
  const proId = (req.query.pro_id as string) || 'pro-001';
  const pro = Pro.find(proId);

  if (!pro) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }

  const allItems = FeatureRegistry.getAllItems();
  const completedItems = pro.completedItems || [];

  // Calculate points
  const totalPoints = completedItems.reduce((sum, itemId) => {
    const item = FeatureRegistry.findItem(itemId);
    return sum + (item?.points || 0);
  }, 0);

  // Count features by stage
  const featuresByStage: Record<AdoptionStage, number> = {
    not_attached: 0,
    attached: 0,
    activated: 0,
  };

  for (const status of Object.values(pro.featureStatus)) {
    const stage = status.stage as AdoptionStage;
    if (featuresByStage[stage] !== undefined) {
      featuresByStage[stage]++;
    }
  }

  res.json({
    pro: {
      id: pro.id,
      companyName: pro.companyName,
      ownerName: pro.ownerName,
      plan: pro.plan,
      currentWeek: pro.currentWeek,
    },
    progress: {
      completedItems: completedItems.length,
      totalItems: allItems.length,
      percentComplete: Math.round((completedItems.length / allItems.length) * 100),
      totalPoints,
    },
    featuresByStage,
    topPriorities: allItems
      .filter((item) => !completedItems.includes(item.id))
      .slice(0, 3)
      .map((item) => item.title),
  });
});
