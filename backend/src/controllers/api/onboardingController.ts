import { Router, Request, Response } from 'express';
import { Pro } from '../../models/Pro';
import { FeatureRegistry } from '../../services/onboarding/FeatureRegistry';
import type { AdoptionStage, FeatureStateResult } from '../../types';

export const onboardingRoutes = Router();

// Helper to safely get string param (Express v5 types params as string | string[])
const getParam = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

/**
 * GET /api/onboarding/context
 * Returns computed context for current pro (demo: uses pro_id query param)
 */
onboardingRoutes.get('/context', (req: Request, res: Response) => {
  const proId = (req.query.pro_id as string) || 'pro-001';
  const pro = Pro.find(proId);

  if (!pro) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }

  // Compute feature states for this pro
  const features: FeatureStateResult[] = [];
  const allFeatures = FeatureRegistry.getAllFeatures();

  for (const feature of allFeatures) {
    const status = pro.featureStatus[feature.id];
    const stage = status?.stage || 'not_attached';
    const stageKey = stage === 'not_attached' ? 'notAttached' : stage;
    const stageContext = feature.stages[stageKey as keyof typeof feature.stages];

    if (stageContext) {
      features.push({
        featureId: feature.id,
        state: stage as AdoptionStage,
        completedSteps: status?.completedTasks || [],
        pendingSteps: stageContext.onboardingItems.filter(
          (item) => !status?.completedTasks?.includes(item.itemId)
        ),
        context: stageContext,
      });
    }
  }

  // Get next steps (uncompleted items from current week)
  const allItems = FeatureRegistry.getAllItems();
  const completedItems = pro.completedItems || [];
  const nextSteps = allItems
    .filter((item) => !completedItems.includes(item.id))
    .slice(0, 5);

  res.json({
    pro,
    features,
    nextSteps,
    weeklyPlan: pro.weeklyPlan,
  });
});

/**
 * GET /api/onboarding/features/:id
 * Returns single feature context for a pro
 */
onboardingRoutes.get('/features/:id', (req: Request, res: Response) => {
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

  res.json({
    featureId: feature.id,
    state: stage,
    completedSteps: status?.completedTasks || [],
    pendingSteps: stageContext?.onboardingItems.filter(
      (item) => !status?.completedTasks?.includes(item.itemId)
    ) || [],
    context: stageContext,
  });
});

/**
 * POST /api/onboarding/items/:id/complete
 * Mark an onboarding item as complete for a pro
 */
onboardingRoutes.post('/items/:id/complete', (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const proId = (req.body.pro_id as string) || 'pro-001';

  const updatedPro = Pro.completeItem(proId, id);
  if (!updatedPro) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }

  res.json({ success: true, completedItems: updatedPro.completedItems });
});

/**
 * POST /api/onboarding/items/:id/uncomplete
 * Mark an onboarding item as incomplete for a pro
 */
onboardingRoutes.post('/items/:id/uncomplete', (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const proId = (req.body.pro_id as string) || 'pro-001';

  const updatedPro = Pro.uncompleteItem(proId, id);
  if (!updatedPro) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }

  res.json({ success: true, completedItems: updatedPro.completedItems });
});

/**
 * GET /api/onboarding/pros
 * List all pros (for demo/admin)
 */
onboardingRoutes.get('/pros', (_req: Request, res: Response) => {
  res.json(Pro.all());
});

/**
 * GET /api/onboarding/pros/:id
 * Get a specific pro
 */
onboardingRoutes.get('/pros/:id', (req: Request, res: Response) => {
  const pro = Pro.find(getParam(req.params.id));
  if (!pro) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }
  res.json(pro);
});

/**
 * PUT /api/onboarding/pros/:id
 * Update a pro
 */
onboardingRoutes.put('/pros/:id', (req: Request, res: Response) => {
  const updatedPro = Pro.update(getParam(req.params.id), req.body);
  if (!updatedPro) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }
  res.json(updatedPro);
});
