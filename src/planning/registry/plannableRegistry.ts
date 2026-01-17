// =============================================================================
// PLANNABLE ELEMENT REGISTRY
// =============================================================================
// This file contains the central registry of all plannable elements in the app.
// Each element has a spec document, status, and can receive feedback.
//
// LLM INSTRUCTIONS FOR ADDING NEW ELEMENTS:
// 1. Add a new entry to the registry Map below
// 2. Use the helper function createPlannableElement() for consistency
// 3. Create a corresponding spec file at /src/specs/{specPath}
// 4. Use consistent ID naming: "{category}-{name}" in kebab-case
//
// Categories:
// - 'view': Main views (Portal, Admin, Frontline, Chat)
// - 'page': Sub-pages within views (Admin > Navigation, Calls, etc.)
// - 'modal': Modal dialogs (Feature Edit, Navigation Edit, etc.)
// - 'component': Reusable components (ViewSwitcher, etc.)
// - 'feature': Product features (Invoicing, Payments, etc.)
// =============================================================================

import type { PlannableElement, PlannableCategory, ReleaseStatus, PlannableId } from '../types';

// -----------------------------------------------------------------------------
// HELPER FUNCTION
// -----------------------------------------------------------------------------

/**
 * Helper to create a plannable element with consistent defaults.
 *
 * LLM INSTRUCTIONS:
 * - Always use this function to create new registry entries
 * - specPath should be relative to /src/specs/ (e.g., "views/portal-view.md")
 * - Use kebab-case for IDs
 */
function createPlannableElement(
  id: PlannableId,
  name: string,
  category: PlannableCategory,
  specPath: string,
  status: ReleaseStatus,
  options?: {
    releaseDate?: string;
    releaseNotes?: string;
    owners?: string[];
    dependencies?: PlannableId[];
    tags?: string[];
  }
): PlannableElement {
  return {
    id,
    name,
    category,
    specPath,
    status,
    ...options,
  };
}

// -----------------------------------------------------------------------------
// REGISTRY
// -----------------------------------------------------------------------------

export const plannableRegistry = new Map<PlannableId, PlannableElement>();

// =============================================================================
// VIEWS
// =============================================================================

plannableRegistry.set(
  'view-portal',
  createPlannableElement('view-portal', 'Portal View', 'view', 'views/portal-view.md', 'prototype', {
    releaseNotes: 'Pro-facing portal showing their onboarding journey',
    owners: ['Product Team'],
    tags: ['pro-facing', 'onboarding'],
  })
);

plannableRegistry.set(
  'view-admin',
  createPlannableElement('view-admin', 'Admin View', 'view', 'views/admin-view.md', 'prototype', {
    releaseNotes: 'Internal admin tool for managing onboarding content',
    owners: ['Product Team'],
    tags: ['internal', 'content-management'],
  })
);

plannableRegistry.set(
  'view-frontline',
  createPlannableElement('view-frontline', 'Frontline View', 'view', 'views/frontline-view.md', 'prototype', {
    releaseNotes: 'Rep-facing view for managing pro onboarding',
    owners: ['Product Team'],
    tags: ['rep-facing', 'onboarding'],
  })
);

plannableRegistry.set(
  'view-chat',
  createPlannableElement('view-chat', 'Chat View', 'view', 'views/chat-view.md', 'prototype', {
    releaseNotes: 'AI chat interface for onboarding assistance',
    owners: ['Product Team'],
    tags: ['ai', 'chat', 'pro-facing'],
  })
);

// =============================================================================
// ADMIN PAGES
// =============================================================================

plannableRegistry.set(
  'page-admin-features',
  createPlannableElement('page-admin-features', 'Features Page', 'page', 'admin/features-page.md', 'prototype', {
    releaseNotes: 'Manage feature definitions and stage contexts',
    owners: ['Product Team'],
    dependencies: ['view-admin'],
    tags: ['content-management', 'features'],
  })
);

plannableRegistry.set(
  'page-admin-navigation',
  createPlannableElement('page-admin-navigation', 'Navigation Page', 'page', 'admin/navigation-page.md', 'prototype', {
    releaseNotes: 'Manage navigation resources (pages, videos, help articles)',
    owners: ['Product Team'],
    dependencies: ['view-admin'],
    tags: ['content-management', 'navigation'],
  })
);

plannableRegistry.set(
  'page-admin-calls',
  createPlannableElement('page-admin-calls', 'Calls Page', 'page', 'admin/calls-page.md', 'prototype', {
    releaseNotes: 'Manage Calendly call types and booking links',
    owners: ['Product Team'],
    dependencies: ['view-admin'],
    tags: ['content-management', 'calendly'],
  })
);

plannableRegistry.set(
  'page-admin-onboarding-items',
  createPlannableElement(
    'page-admin-onboarding-items',
    'Onboarding Items Page',
    'page',
    'admin/onboarding-items-page.md',
    'prototype',
    {
      releaseNotes: 'Manage centralized onboarding item definitions',
      owners: ['Product Team'],
      dependencies: ['view-admin'],
      tags: ['content-management', 'onboarding-items'],
    }
  )
);

plannableRegistry.set(
  'page-admin-tools',
  createPlannableElement('page-admin-tools', 'Tools Page', 'page', 'admin/tools-page.md', 'proposed', {
    releaseNotes: 'Manage MCP tools for AI assistance',
    owners: ['Product Team'],
    dependencies: ['view-admin'],
    tags: ['content-management', 'ai', 'mcp'],
  })
);

// =============================================================================
// MODALS
// =============================================================================

plannableRegistry.set(
  'modal-feature-edit',
  createPlannableElement('modal-feature-edit', 'Feature Edit Modal', 'modal', 'modals/feature-edit-modal.md', 'prototype', {
    releaseNotes: 'Edit feature definitions and all four stage contexts',
    owners: ['Product Team'],
    dependencies: ['page-admin-features'],
    tags: ['editing', 'features'],
  })
);

plannableRegistry.set(
  'modal-navigation-edit',
  createPlannableElement(
    'modal-navigation-edit',
    'Navigation Edit Modal',
    'modal',
    'modals/navigation-edit-modal.md',
    'prototype',
    {
      releaseNotes: 'Edit navigation resources with type-specific fields',
      owners: ['Product Team'],
      dependencies: ['page-admin-navigation'],
      tags: ['editing', 'navigation'],
    }
  )
);

plannableRegistry.set(
  'modal-calls-edit',
  createPlannableElement('modal-calls-edit', 'Calls Edit Modal', 'modal', 'modals/calls-edit-modal.md', 'prototype', {
    releaseNotes: 'Edit Calendly call types and booking configuration',
    owners: ['Product Team'],
    dependencies: ['page-admin-calls'],
    tags: ['editing', 'calendly'],
  })
);

plannableRegistry.set(
  'modal-onboarding-item-edit',
  createPlannableElement(
    'modal-onboarding-item-edit',
    'Onboarding Item Edit Modal',
    'modal',
    'modals/onboarding-item-edit-modal.md',
    'prototype',
    {
      releaseNotes: 'Edit onboarding item definitions with completion logic',
      owners: ['Product Team'],
      dependencies: ['page-admin-onboarding-items'],
      tags: ['editing', 'onboarding-items'],
    }
  )
);

// =============================================================================
// FEATURES (Product Features)
// =============================================================================

plannableRegistry.set(
  'feature-invoicing',
  createPlannableElement('feature-invoicing', 'Invoicing', 'feature', 'features/invoicing.md', 'shipped', {
    releaseDate: '2024-01-01',
    releaseNotes: 'Core invoicing feature for billing customers',
    owners: ['Payments Team'],
    tags: ['billing', 'core'],
  })
);

plannableRegistry.set(
  'feature-payments',
  createPlannableElement('feature-payments', 'Payments', 'feature', 'features/payments.md', 'shipped', {
    releaseDate: '2024-01-01',
    releaseNotes: 'Payment processing for invoices',
    owners: ['Payments Team'],
    dependencies: ['feature-invoicing'],
    tags: ['billing', 'core'],
  })
);

plannableRegistry.set(
  'feature-automated-comms',
  createPlannableElement(
    'feature-automated-comms',
    'Automated Communications',
    'feature',
    'features/automated-comms.md',
    'shipped',
    {
      releaseDate: '2024-03-01',
      releaseNotes: 'Automated customer communication workflows',
      owners: ['Engagement Team'],
      tags: ['communication', 'automation'],
    }
  )
);

plannableRegistry.set(
  'feature-scheduling',
  createPlannableElement('feature-scheduling', 'Scheduling', 'feature', 'features/scheduling.md', 'shipped', {
    releaseDate: '2024-01-01',
    releaseNotes: 'Job scheduling and calendar management',
    owners: ['Operations Team'],
    tags: ['scheduling', 'core'],
  })
);

plannableRegistry.set(
  'feature-estimates',
  createPlannableElement('feature-estimates', 'Estimates', 'feature', 'features/estimates.md', 'shipped', {
    releaseDate: '2024-02-01',
    releaseNotes: 'Create and send estimates to customers',
    owners: ['Sales Team'],
    tags: ['sales', 'core'],
  })
);

plannableRegistry.set(
  'feature-csr-ai',
  createPlannableElement('feature-csr-ai', 'AI Voice Agent', 'feature', 'features/csr-ai.md', 'in-development', {
    releaseDate: 'Q2 2025',
    releaseNotes: 'AI-powered voice agent for call handling',
    owners: ['AI Team'],
    tags: ['ai', 'voice', 'new'],
  })
);

plannableRegistry.set(
  'feature-reviews',
  createPlannableElement('feature-reviews', 'Reviews', 'feature', 'features/reviews.md', 'shipped', {
    releaseDate: '2024-06-01',
    releaseNotes: 'Customer review collection and management',
    owners: ['Marketing Team'],
    tags: ['marketing', 'reputation'],
  })
);

// =============================================================================
// COMPONENTS
// =============================================================================

plannableRegistry.set(
  'component-view-switcher',
  createPlannableElement(
    'component-view-switcher',
    'View Switcher',
    'component',
    'components/view-switcher.md',
    'prototype',
    {
      releaseNotes: 'Tab component for switching between views',
      owners: ['Product Team'],
      tags: ['navigation', 'ui'],
    }
  )
);

plannableRegistry.set(
  'component-pro-selector',
  createPlannableElement('component-pro-selector', 'Pro Selector', 'component', 'components/pro-selector.md', 'prototype', {
    releaseNotes: 'Dropdown for selecting a pro account',
    owners: ['Product Team'],
    tags: ['selection', 'ui'],
  })
);

plannableRegistry.set(
  'component-planning-mode',
  createPlannableElement(
    'component-planning-mode',
    'Planning Mode System',
    'component',
    'components/planning-mode.md',
    'in-development',
    {
      releaseNotes: 'Meta-system for spec viewing, feedback, and status tracking',
      owners: ['Product Team'],
      tags: ['meta', 'planning', 'documentation'],
    }
  )
);

// -----------------------------------------------------------------------------
// REGISTRY UTILITIES
// -----------------------------------------------------------------------------

/**
 * Get all elements in a specific category.
 *
 * LLM INSTRUCTIONS:
 * - Use this to list all views, pages, modals, etc.
 * - Returns array sorted by name
 */
export function getElementsByCategory(category: PlannableCategory): PlannableElement[] {
  return Array.from(plannableRegistry.values())
    .filter((el) => el.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get all elements with a specific status.
 *
 * LLM INSTRUCTIONS:
 * - Use this to find shipped, in-development, or proposed elements
 */
export function getElementsByStatus(status: ReleaseStatus): PlannableElement[] {
  return Array.from(plannableRegistry.values())
    .filter((el) => el.status === status)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get all elements with a specific tag.
 *
 * LLM INSTRUCTIONS:
 * - Tags are useful for cross-cutting concerns
 * - Example: getElementsByTag('ai') returns all AI-related elements
 */
export function getElementsByTag(tag: string): PlannableElement[] {
  return Array.from(plannableRegistry.values())
    .filter((el) => el.tags?.includes(tag))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default plannableRegistry;
