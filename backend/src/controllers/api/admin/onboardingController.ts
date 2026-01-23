import { Router, Request, Response } from 'express';
import { FeatureRegistry } from '../../../services/onboarding/FeatureRegistry';
import { Pro } from '../../../models/Pro';
import type { Feature, OnboardingItemDefinition, CompletionStep, NavigationItem, CalendlyLink, McpTool, ProAccount } from '../../../types';

export const adminOnboardingRoutes = Router();

// Helper to safely get string param (Express v5 types params as string | string[])
const getParam = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

// =============================================================================
// FEATURES
// =============================================================================

/**
 * GET /api/admin/onboarding/features
 * List all features
 */
adminOnboardingRoutes.get('/features', (_req: Request, res: Response) => {
  res.json(FeatureRegistry.getAllFeatures());
});

/**
 * GET /api/admin/onboarding/features/:id
 * Get a specific feature
 */
adminOnboardingRoutes.get('/features/:id', (req: Request, res: Response) => {
  const feature = FeatureRegistry.findFeature(getParam(req.params.id));
  if (!feature) {
    res.status(404).json({ error: 'Feature not found' });
    return;
  }
  res.json(feature);
});

/**
 * POST /api/admin/onboarding/features/:id
 * Update a feature (creates or updates)
 */
adminOnboardingRoutes.post('/features/:id', (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const feature: Feature = { ...req.body, id } as Feature;
  FeatureRegistry.setFeature(feature);
  res.json({ success: true, feature });
});

/**
 * PUT /api/admin/onboarding/features/:id
 * Update a feature
 */
adminOnboardingRoutes.put('/features/:id', (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const existing = FeatureRegistry.findFeature(id);
  if (!existing) {
    res.status(404).json({ error: 'Feature not found' });
    return;
  }
  const feature: Feature = { ...existing, ...req.body, id } as Feature;
  FeatureRegistry.setFeature(feature);
  res.json({ success: true, feature });
});

// =============================================================================
// ONBOARDING ITEMS
// =============================================================================

/**
 * GET /api/admin/onboarding/items
 * List all onboarding items
 */
adminOnboardingRoutes.get('/items', (_req: Request, res: Response) => {
  res.json(FeatureRegistry.getAllItems());
});

/**
 * GET /api/admin/onboarding/items/:id
 * Get a specific onboarding item
 */
adminOnboardingRoutes.get('/items/:id', (req: Request, res: Response) => {
  const item = FeatureRegistry.findItem(getParam(req.params.id));
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  res.json(item);
});

/**
 * POST /api/admin/onboarding/items
 * Create a new onboarding item
 */
adminOnboardingRoutes.post('/items', (req: Request, res: Response) => {
  const item: OnboardingItemDefinition = req.body;
  FeatureRegistry.setItem(item);
  res.json({ success: true, item });
});

/**
 * PUT /api/admin/onboarding/items/:id
 * Update an onboarding item
 */
adminOnboardingRoutes.put('/items/:id', (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const existing = FeatureRegistry.findItem(id);
  if (!existing) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  const item: OnboardingItemDefinition = { ...existing, ...req.body, id };
  FeatureRegistry.setItem(item);
  res.json({ success: true, item });
});

/**
 * DELETE /api/admin/onboarding/items/:id
 * Delete an onboarding item
 */
adminOnboardingRoutes.delete('/items/:id', (req: Request, res: Response) => {
  const success = FeatureRegistry.deleteItem(getParam(req.params.id));
  if (!success) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  res.json({ success: true });
});

// =============================================================================
// COMPLETION STEPS (HP-5118)
// =============================================================================

/**
 * GET /api/admin/onboarding/completion-steps
 * List all completion steps
 */
adminOnboardingRoutes.get('/completion-steps', (_req: Request, res: Response) => {
  res.json(FeatureRegistry.getAllCompletionSteps());
});

/**
 * GET /api/admin/onboarding/completion-steps/:id
 * Get a specific completion step
 */
adminOnboardingRoutes.get('/completion-steps/:id', (req: Request, res: Response) => {
  const step = FeatureRegistry.findCompletionStep(getParam(req.params.id));
  if (!step) {
    res.status(404).json({ error: 'Completion step not found' });
    return;
  }
  res.json(step);
});

/**
 * POST /api/admin/onboarding/completion-steps
 * Create a new completion step
 */
adminOnboardingRoutes.post('/completion-steps', (req: Request, res: Response) => {
  const step: CompletionStep = req.body;
  FeatureRegistry.setCompletionStep(step);
  res.json({ success: true, step });
});

/**
 * PUT /api/admin/onboarding/completion-steps/:id
 * Update a completion step
 */
adminOnboardingRoutes.put('/completion-steps/:id', (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const existing = FeatureRegistry.findCompletionStep(id);
  if (!existing) {
    res.status(404).json({ error: 'Completion step not found' });
    return;
  }
  const step: CompletionStep = { ...existing, ...req.body, id };
  FeatureRegistry.setCompletionStep(step);
  res.json({ success: true, step });
});

/**
 * DELETE /api/admin/onboarding/completion-steps/:id
 * Delete a completion step
 */
adminOnboardingRoutes.delete('/completion-steps/:id', (req: Request, res: Response) => {
  const success = FeatureRegistry.deleteCompletionStep(getParam(req.params.id));
  if (!success) {
    res.status(404).json({ error: 'Completion step not found' });
    return;
  }
  res.json({ success: true });
});

// =============================================================================
// NAVIGATION
// =============================================================================

/**
 * GET /api/admin/onboarding/navigation
 * List all navigation items
 */
adminOnboardingRoutes.get('/navigation', (_req: Request, res: Response) => {
  res.json(FeatureRegistry.getAllNavigation());
});

/**
 * GET /api/admin/onboarding/navigation/:id
 * Get a specific navigation item
 */
adminOnboardingRoutes.get('/navigation/:id', (req: Request, res: Response) => {
  const item = FeatureRegistry.findNavigation(getParam(req.params.id));
  if (!item) {
    res.status(404).json({ error: 'Navigation item not found' });
    return;
  }
  res.json(item);
});

/**
 * POST /api/admin/onboarding/navigation
 * Create a new navigation item
 */
adminOnboardingRoutes.post('/navigation', (req: Request, res: Response) => {
  const item: NavigationItem = req.body;
  FeatureRegistry.setNavigation(item);
  res.json({ success: true, item });
});

/**
 * PUT /api/admin/onboarding/navigation/:id
 * Update a navigation item
 */
adminOnboardingRoutes.put('/navigation/:id', (req: Request, res: Response) => {
  const existing = FeatureRegistry.findNavigation(getParam(req.params.id));
  if (!existing) {
    res.status(404).json({ error: 'Navigation item not found' });
    return;
  }
  const item: NavigationItem = { ...existing, ...req.body };
  FeatureRegistry.setNavigation(item);
  res.json({ success: true, item });
});

/**
 * DELETE /api/admin/onboarding/navigation/:id
 * Delete a navigation item
 */
adminOnboardingRoutes.delete('/navigation/:id', (req: Request, res: Response) => {
  const success = FeatureRegistry.deleteNavigation(getParam(req.params.id));
  if (!success) {
    res.status(404).json({ error: 'Navigation item not found' });
    return;
  }
  res.json({ success: true });
});

// =============================================================================
// CALENDLY / CALLS
// =============================================================================

/**
 * GET /api/admin/onboarding/calls
 * List all calendly/call links
 */
adminOnboardingRoutes.get('/calls', (_req: Request, res: Response) => {
  res.json(FeatureRegistry.getAllCalendly());
});

/**
 * GET /api/admin/onboarding/calls/:id
 * Get a specific calendly link
 */
adminOnboardingRoutes.get('/calls/:id', (req: Request, res: Response) => {
  const item = FeatureRegistry.findCalendly(getParam(req.params.id));
  if (!item) {
    res.status(404).json({ error: 'Calendly link not found' });
    return;
  }
  res.json(item);
});

/**
 * POST /api/admin/onboarding/calls
 * Create a new calendly link
 */
adminOnboardingRoutes.post('/calls', (req: Request, res: Response) => {
  const item: CalendlyLink = req.body;
  FeatureRegistry.setCalendly(item);
  res.json({ success: true, item });
});

/**
 * PUT /api/admin/onboarding/calls/:id
 * Update a calendly link
 */
adminOnboardingRoutes.put('/calls/:id', (req: Request, res: Response) => {
  const existing = FeatureRegistry.findCalendly(getParam(req.params.id));
  if (!existing) {
    res.status(404).json({ error: 'Calendly link not found' });
    return;
  }
  const item: CalendlyLink = { ...existing, ...req.body };
  FeatureRegistry.setCalendly(item);
  res.json({ success: true, item });
});

/**
 * DELETE /api/admin/onboarding/calls/:id
 * Delete a calendly link
 */
adminOnboardingRoutes.delete('/calls/:id', (req: Request, res: Response) => {
  const success = FeatureRegistry.deleteCalendly(getParam(req.params.id));
  if (!success) {
    res.status(404).json({ error: 'Calendly link not found' });
    return;
  }
  res.json({ success: true });
});

// =============================================================================
// MCP TOOLS
// =============================================================================

/**
 * GET /api/admin/onboarding/tools
 * List all MCP tools
 */
adminOnboardingRoutes.get('/tools', (_req: Request, res: Response) => {
  res.json(FeatureRegistry.getAllTools());
});

/**
 * GET /api/admin/onboarding/tools/:name
 * Get a specific MCP tool
 */
adminOnboardingRoutes.get('/tools/:name', (req: Request, res: Response) => {
  const tool = FeatureRegistry.findTool(getParam(req.params.name));
  if (!tool) {
    res.status(404).json({ error: 'Tool not found' });
    return;
  }
  res.json(tool);
});

/**
 * POST /api/admin/onboarding/tools
 * Create a new MCP tool
 */
adminOnboardingRoutes.post('/tools', (req: Request, res: Response) => {
  const tool: McpTool = req.body;
  FeatureRegistry.setTool(tool);
  res.json({ success: true, tool });
});

/**
 * PUT /api/admin/onboarding/tools/:name
 * Update an MCP tool
 */
adminOnboardingRoutes.put('/tools/:name', (req: Request, res: Response) => {
  const existing = FeatureRegistry.findTool(getParam(req.params.name));
  if (!existing) {
    res.status(404).json({ error: 'Tool not found' });
    return;
  }
  const tool: McpTool = { ...existing, ...req.body };
  FeatureRegistry.setTool(tool);
  res.json({ success: true, tool });
});

/**
 * DELETE /api/admin/onboarding/tools/:name
 * Delete an MCP tool
 */
adminOnboardingRoutes.delete('/tools/:name', (req: Request, res: Response) => {
  const success = FeatureRegistry.deleteTool(getParam(req.params.name));
  if (!success) {
    res.status(404).json({ error: 'Tool not found' });
    return;
  }
  res.json({ success: true });
});

// =============================================================================
// PROS
// =============================================================================

/**
 * GET /api/admin/onboarding/pros
 * List all pros
 */
adminOnboardingRoutes.get('/pros', (_req: Request, res: Response) => {
  res.json(Pro.all());
});

/**
 * GET /api/admin/onboarding/pros/:id
 * Get a specific pro
 */
adminOnboardingRoutes.get('/pros/:id', (req: Request, res: Response) => {
  const pro = Pro.find(getParam(req.params.id));
  if (!pro) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }
  res.json(pro);
});

/**
 * POST /api/admin/onboarding/pros
 * Create a new pro
 */
adminOnboardingRoutes.post('/pros', (req: Request, res: Response) => {
  const pro: ProAccount = req.body;
  const created = Pro.create(pro);
  res.json({ success: true, pro: created });
});

/**
 * PUT /api/admin/onboarding/pros/:id
 * Update a pro
 */
adminOnboardingRoutes.put('/pros/:id', (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const existing = Pro.find(id);
  if (!existing) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }
  const updated = Pro.update(id, req.body);
  res.json({ success: true, pro: updated });
});

/**
 * DELETE /api/admin/onboarding/pros/:id
 * Delete a pro
 */
adminOnboardingRoutes.delete('/pros/:id', (req: Request, res: Response) => {
  const success = Pro.delete(getParam(req.params.id));
  if (!success) {
    res.status(404).json({ error: 'Pro not found' });
    return;
  }
  res.json({ success: true });
});

// =============================================================================
// RELOAD CONFIG
// =============================================================================

/**
 * POST /api/admin/onboarding/reload
 * Reload all configuration from YAML files
 */
adminOnboardingRoutes.post('/reload', (_req: Request, res: Response) => {
  FeatureRegistry.reload();
  Pro.reload();
  res.json({ success: true, message: 'Configuration reloaded' });
});
