/**
 * API Service for Onboarding Context Registry Backend
 *
 * This service provides all API calls to the backend server.
 * The backend must be running for the application to work.
 */

import type {
  Feature,
  OnboardingItemDefinition,
  CompletionStep,
  NavigationItem,
  CalendlyLink,
  McpTool,
  ProAccount,
} from '../types';

// API base URL from environment variable, defaults to localhost:3001
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error ${response.status}`);
  }
  return response.json();
}

// =============================================================================
// PRO ENDPOINTS
// =============================================================================

export const prosApi = {
  getAll: async (): Promise<ProAccount[]> => {
    const response = await fetch(`${API_BASE}/api/onboarding/pros`);
    return handleResponse<ProAccount[]>(response);
  },

  getById: async (proId: string): Promise<ProAccount> => {
    const response = await fetch(`${API_BASE}/api/onboarding/pros/${proId}`);
    return handleResponse<ProAccount>(response);
  },

  update: async (proId: string, data: Partial<ProAccount>): Promise<ProAccount> => {
    const response = await fetch(`${API_BASE}/api/onboarding/pros/${proId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ProAccount>(response);
  },

  completeItem: async (proId: string, itemId: string): Promise<{ success: boolean; completedItems: string[] }> => {
    const response = await fetch(`${API_BASE}/api/onboarding/items/${itemId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pro_id: proId }),
    });
    return handleResponse(response);
  },

  uncompleteItem: async (proId: string, itemId: string): Promise<{ success: boolean; completedItems: string[] }> => {
    const response = await fetch(`${API_BASE}/api/onboarding/items/${itemId}/uncomplete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pro_id: proId }),
    });
    return handleResponse(response);
  },
};

// =============================================================================
// ADMIN ENDPOINTS - FEATURES
// =============================================================================

export const featuresApi = {
  getAll: async (): Promise<Feature[]> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/features`);
    return handleResponse<Feature[]>(response);
  },

  getById: async (featureId: string): Promise<Feature> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/features/${featureId}`);
    return handleResponse<Feature>(response);
  },

  update: async (featureId: string, data: Feature): Promise<{ success: boolean; feature: Feature }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/features/${featureId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  create: async (data: Feature): Promise<{ success: boolean; feature: Feature }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/features/${data.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// =============================================================================
// ADMIN ENDPOINTS - ONBOARDING ITEMS
// =============================================================================

export const itemsApi = {
  getAll: async (): Promise<OnboardingItemDefinition[]> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/items`);
    return handleResponse<OnboardingItemDefinition[]>(response);
  },

  getById: async (itemId: string): Promise<OnboardingItemDefinition> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/items/${itemId}`);
    return handleResponse<OnboardingItemDefinition>(response);
  },

  update: async (itemId: string, data: OnboardingItemDefinition): Promise<{ success: boolean; item: OnboardingItemDefinition }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  create: async (data: OnboardingItemDefinition): Promise<{ success: boolean; item: OnboardingItemDefinition }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (itemId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/items/${itemId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// =============================================================================
// ADMIN ENDPOINTS - COMPLETION STEPS (HP-5118)
// =============================================================================

export const completionStepsApi = {
  getAll: async (): Promise<CompletionStep[]> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/completion-steps`);
    return handleResponse<CompletionStep[]>(response);
  },

  getById: async (stepId: string): Promise<CompletionStep> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/completion-steps/${stepId}`);
    return handleResponse<CompletionStep>(response);
  },

  update: async (stepId: string, data: CompletionStep): Promise<{ success: boolean; step: CompletionStep }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/completion-steps/${stepId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  create: async (data: CompletionStep): Promise<{ success: boolean; step: CompletionStep }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/completion-steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (stepId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/completion-steps/${stepId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// =============================================================================
// ADMIN ENDPOINTS - NAVIGATION
// =============================================================================

export const navigationApi = {
  getAll: async (): Promise<NavigationItem[]> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/navigation`);
    return handleResponse<NavigationItem[]>(response);
  },

  getById: async (slugId: string): Promise<NavigationItem> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/navigation/${slugId}`);
    return handleResponse<NavigationItem>(response);
  },

  update: async (slugId: string, data: NavigationItem): Promise<{ success: boolean; item: NavigationItem }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/navigation/${slugId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  create: async (data: NavigationItem): Promise<{ success: boolean; item: NavigationItem }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/navigation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (slugId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/navigation/${slugId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// =============================================================================
// ADMIN ENDPOINTS - CALLS (CALENDLY)
// =============================================================================

export const callsApi = {
  getAll: async (): Promise<CalendlyLink[]> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/calls`);
    return handleResponse<CalendlyLink[]>(response);
  },

  getById: async (slugId: string): Promise<CalendlyLink> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/calls/${slugId}`);
    return handleResponse<CalendlyLink>(response);
  },

  update: async (slugId: string, data: CalendlyLink): Promise<{ success: boolean; item: CalendlyLink }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/calls/${slugId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  create: async (data: CalendlyLink): Promise<{ success: boolean; item: CalendlyLink }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/calls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (slugId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/calls/${slugId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// =============================================================================
// ADMIN ENDPOINTS - TOOLS
// =============================================================================

export const toolsApi = {
  getAll: async (): Promise<McpTool[]> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/tools`);
    return handleResponse<McpTool[]>(response);
  },

  getById: async (name: string): Promise<McpTool> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/tools/${name}`);
    return handleResponse<McpTool>(response);
  },

  update: async (name: string, data: McpTool): Promise<{ success: boolean; tool: McpTool }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/tools/${name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  create: async (data: McpTool): Promise<{ success: boolean; tool: McpTool }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/tools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (name: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE}/api/admin/onboarding/tools/${name}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// =============================================================================
// MCP ENDPOINTS
// =============================================================================

export const mcpApi = {
  getContext: async (proId: string, featureId?: string) => {
    const params = new URLSearchParams({ pro_id: proId });
    if (featureId) params.append('feature_id', featureId);
    const response = await fetch(`${API_BASE}/api/mcp/onboarding/context?${params}`);
    return handleResponse(response);
  },

  getFeatureDetails: async (proId: string, featureId: string) => {
    const params = new URLSearchParams({ pro_id: proId });
    const response = await fetch(`${API_BASE}/api/mcp/onboarding/feature/${featureId}?${params}`);
    return handleResponse(response);
  },

  getNextSteps: async (proId: string, limit = 5) => {
    const params = new URLSearchParams({ pro_id: proId, limit: String(limit) });
    const response = await fetch(`${API_BASE}/api/mcp/onboarding/next-steps?${params}`);
    return handleResponse(response);
  },

  getProSummary: async (proId: string) => {
    const params = new URLSearchParams({ pro_id: proId });
    const response = await fetch(`${API_BASE}/api/mcp/onboarding/pro-summary?${params}`);
    return handleResponse(response);
  },
};

// =============================================================================
// HEALTH CHECK
// =============================================================================

export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await fetch(`${API_BASE}/health`);
  return handleResponse(response);
};

// =============================================================================
// RELOAD CONFIG
// =============================================================================

export const reloadConfig = async (): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE}/api/admin/onboarding/reload`, {
    method: 'POST',
  });
  return handleResponse(response);
};

// =============================================================================
// COMBINED API OBJECT
// =============================================================================

export const onboardingApi = {
  pros: prosApi,
  features: featuresApi,
  items: itemsApi,
  completionSteps: completionStepsApi,
  navigation: navigationApi,
  calls: callsApi,
  tools: toolsApi,
  mcp: mcpApi,
  healthCheck,
  reloadConfig,
};

export default onboardingApi;
