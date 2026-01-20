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
// PAGES - HCP WEB (Portal View)
// =============================================================================

plannableRegistry.set(
  'page-hcp-web-index',
  createPlannableElement('page-hcp-web-index', 'Housecall Pro Web', 'page', 'pages/hcp-web/index.md', 'prototype', {
    releaseNotes: 'Pro-facing web portal overview',
    owners: ['Product Team'],
    tags: ['pro-facing', 'portal'],
  })
);

plannableRegistry.set(
  'page-hcp-web-journey',
  createPlannableElement('page-hcp-web-journey', 'Journey View', 'page', 'pages/hcp-web/journey.md', 'prototype', {
    releaseNotes: 'Gamified onboarding journey timeline',
    owners: ['Product Team'],
    dependencies: ['view-portal'],
    tags: ['pro-facing', 'gamification'],
  })
);

plannableRegistry.set(
  'page-hcp-web-weekly',
  createPlannableElement('page-hcp-web-weekly', 'Weekly Planning View', 'page', 'pages/hcp-web/weekly.md', 'prototype', {
    releaseNotes: 'Weekly task planning view for pros',
    owners: ['Product Team'],
    dependencies: ['view-portal'],
    tags: ['pro-facing', 'planning'],
  })
);

// =============================================================================
// PAGES - AI CHAT
// =============================================================================

plannableRegistry.set(
  'page-ai-chat-index',
  createPlannableElement('page-ai-chat-index', 'AI Chat Assistant', 'page', 'pages/ai-chat/index.md', 'prototype', {
    releaseNotes: 'AI-powered chat assistant for onboarding help',
    owners: ['AI Team'],
    dependencies: ['view-chat'],
    tags: ['ai', 'chat', 'pro-facing'],
  })
);

// =============================================================================
// PAGES - ORG INSIGHTS (Frontline View)
// =============================================================================

plannableRegistry.set(
  'page-org-insights-index',
  createPlannableElement('page-org-insights-index', 'Org Insights Admin Panel', 'page', 'pages/org-insights/index.md', 'prototype', {
    releaseNotes: 'Rep-facing admin panel for managing pro onboarding',
    owners: ['Product Team'],
    dependencies: ['view-frontline'],
    tags: ['rep-facing', 'admin'],
  })
);

plannableRegistry.set(
  'page-org-insights-information',
  createPlannableElement('page-org-insights-information', 'Information Page', 'page', 'pages/org-insights/information.md', 'prototype', {
    releaseNotes: 'Pro information overview for reps',
    owners: ['Product Team'],
    dependencies: ['view-frontline'],
    tags: ['rep-facing', 'information'],
  })
);

plannableRegistry.set(
  'page-org-insights-onboarding-plan',
  createPlannableElement('page-org-insights-onboarding-plan', 'Onboarding Plan', 'page', 'pages/org-insights/onboarding-plan.md', 'prototype', {
    releaseNotes: 'Pro onboarding plan management',
    owners: ['Product Team'],
    dependencies: ['view-frontline'],
    tags: ['rep-facing', 'onboarding'],
  })
);

plannableRegistry.set(
  'page-org-insights-onboarding-plan-category',
  createPlannableElement('page-org-insights-onboarding-plan-category', 'Category View', 'page', 'pages/org-insights/onboarding-plan-category.md', 'prototype', {
    releaseNotes: 'Category-based onboarding plan view',
    owners: ['Product Team'],
    dependencies: ['view-frontline'],
    tags: ['rep-facing', 'onboarding'],
  })
);

plannableRegistry.set(
  'page-org-insights-onboarding-plan-weekly',
  createPlannableElement('page-org-insights-onboarding-plan-weekly', 'Weekly Planning', 'page', 'pages/org-insights/onboarding-plan-weekly.md', 'prototype', {
    releaseNotes: 'Weekly planning view for reps',
    owners: ['Product Team'],
    dependencies: ['view-frontline'],
    tags: ['rep-facing', 'planning'],
  })
);

plannableRegistry.set(
  'page-org-insights-features-list',
  createPlannableElement('page-org-insights-features-list', 'Features List', 'page', 'pages/org-insights/features-list.md', 'prototype', {
    releaseNotes: 'Feature adoption status list for reps',
    owners: ['Product Team'],
    dependencies: ['view-frontline'],
    tags: ['rep-facing', 'features'],
  })
);

plannableRegistry.set(
  'page-org-insights-calls',
  createPlannableElement('page-org-insights-calls', 'Calls Page', 'page', 'pages/org-insights/calls.md', 'prototype', {
    releaseNotes: 'Calendly call scheduling for reps',
    owners: ['Product Team'],
    dependencies: ['view-frontline'],
    tags: ['rep-facing', 'calls', 'calendly'],
  })
);

// =============================================================================
// PAGES - HCP CONTEXT (Admin View)
// =============================================================================

plannableRegistry.set(
  'page-hcp-context-index',
  createPlannableElement('page-hcp-context-index', '@HCP Context Manager', 'page', 'pages/hcp-context/index.md', 'prototype', {
    releaseNotes: 'Internal admin tool for managing onboarding context',
    owners: ['Product Team'],
    dependencies: ['view-admin'],
    tags: ['internal', 'content-management'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-index',
  createPlannableElement('page-hcp-context-features-index', 'Features Tab', 'page', 'pages/hcp-context/features/index.md', 'prototype', {
    releaseNotes: 'Feature management tab overview',
    owners: ['Product Team'],
    dependencies: ['view-admin'],
    tags: ['internal', 'features'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-invoicing',
  createPlannableElement('page-hcp-context-features-invoicing', 'Invoicing Feature', 'page', 'pages/hcp-context/features/invoicing.md', 'shipped', {
    releaseDate: '2024-01-01',
    releaseNotes: 'Invoicing feature context and configuration',
    owners: ['Payments Team'],
    tags: ['billing', 'core'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-collecting-payment',
  createPlannableElement('page-hcp-context-features-collecting-payment', 'Collecting Payment Feature', 'page', 'pages/hcp-context/features/collecting-payment.md', 'shipped', {
    releaseDate: '2024-01-01',
    releaseNotes: 'Payment collection feature context',
    owners: ['Payments Team'],
    tags: ['billing', 'core'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-automated-communications',
  createPlannableElement('page-hcp-context-features-automated-communications', 'Automated Communications Feature', 'page', 'pages/hcp-context/features/automated-communications.md', 'shipped', {
    releaseDate: '2024-03-01',
    releaseNotes: 'Automated communications feature context',
    owners: ['Engagement Team'],
    tags: ['communication', 'automation'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-job-scheduling',
  createPlannableElement('page-hcp-context-features-job-scheduling', 'Job Scheduling Feature', 'page', 'pages/hcp-context/features/job-scheduling.md', 'shipped', {
    releaseDate: '2024-01-01',
    releaseNotes: 'Job scheduling feature context',
    owners: ['Operations Team'],
    tags: ['scheduling', 'core'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-estimates',
  createPlannableElement('page-hcp-context-features-estimates', 'Estimates Feature', 'page', 'pages/hcp-context/features/estimates.md', 'shipped', {
    releaseDate: '2024-02-01',
    releaseNotes: 'Estimates feature context',
    owners: ['Sales Team'],
    tags: ['sales', 'core'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-ai-voice-agent',
  createPlannableElement('page-hcp-context-features-ai-voice-agent', 'AI Voice Agent Feature', 'page', 'pages/hcp-context/features/ai-voice-agent.md', 'in-development', {
    releaseDate: 'Q2 2025',
    releaseNotes: 'AI voice agent feature context',
    owners: ['AI Team'],
    tags: ['ai', 'voice', 'new'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-reviews',
  createPlannableElement('page-hcp-context-features-reviews', 'Reviews Feature', 'page', 'pages/hcp-context/features/reviews.md', 'shipped', {
    releaseDate: '2024-06-01',
    releaseNotes: 'Reviews feature context',
    owners: ['Marketing Team'],
    tags: ['marketing', 'reputation'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-account-setup',
  createPlannableElement('page-hcp-context-features-account-setup', 'Account Setup Feature', 'page', 'pages/hcp-context/features/account-setup.md', 'prototype', {
    releaseNotes: 'Account setup feature context',
    owners: ['Product Team'],
    tags: ['onboarding', 'setup'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-customers',
  createPlannableElement('page-hcp-context-features-customers', 'Customers Feature', 'page', 'pages/hcp-context/features/customers.md', 'prototype', {
    releaseNotes: 'Customer management feature context',
    owners: ['Product Team'],
    tags: ['crm', 'customers'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-add-ons',
  createPlannableElement('page-hcp-context-features-add-ons', 'Add-ons Feature', 'page', 'pages/hcp-context/features/add-ons.md', 'prototype', {
    releaseNotes: 'Add-ons and upsells feature context',
    owners: ['Product Team'],
    tags: ['monetization', 'add-ons'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-service-plans',
  createPlannableElement('page-hcp-context-features-service-plans', 'Service Plans Feature', 'page', 'pages/hcp-context/features/service-plans.md', 'prototype', {
    releaseNotes: 'Service plans feature context',
    owners: ['Product Team'],
    tags: ['recurring', 'service-plans'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-online-booking',
  createPlannableElement('page-hcp-context-features-online-booking', 'Online Booking Feature', 'page', 'pages/hcp-context/features/online-booking.md', 'prototype', {
    releaseNotes: 'Online booking feature context',
    owners: ['Product Team'],
    tags: ['booking', 'scheduling'],
  })
);

plannableRegistry.set(
  'page-hcp-context-features-reporting',
  createPlannableElement('page-hcp-context-features-reporting', 'Reporting Feature', 'page', 'pages/hcp-context/features/reporting.md', 'prototype', {
    releaseNotes: 'Reporting and analytics feature context',
    owners: ['Product Team'],
    tags: ['analytics', 'reporting'],
  })
);

plannableRegistry.set(
  'page-hcp-context-navigation',
  createPlannableElement('page-hcp-context-navigation', 'Navigation Tab', 'page', 'pages/hcp-context/navigation.md', 'prototype', {
    releaseNotes: 'Navigation resources management',
    owners: ['Product Team'],
    dependencies: ['view-admin'],
    tags: ['internal', 'navigation'],
  })
);

plannableRegistry.set(
  'page-hcp-context-calls',
  createPlannableElement('page-hcp-context-calls', 'Calls Tab', 'page', 'pages/hcp-context/calls.md', 'prototype', {
    releaseNotes: 'Calendly call types management',
    owners: ['Product Team'],
    dependencies: ['view-admin'],
    tags: ['internal', 'calendly'],
  })
);

plannableRegistry.set(
  'page-hcp-context-onboarding-items',
  createPlannableElement('page-hcp-context-onboarding-items', 'Onboarding Items Tab', 'page', 'pages/hcp-context/onboarding-items.md', 'prototype', {
    releaseNotes: 'Centralized onboarding item definitions',
    owners: ['Product Team'],
    dependencies: ['view-admin'],
    tags: ['internal', 'onboarding-items'],
  })
);

plannableRegistry.set(
  'page-hcp-context-tools',
  createPlannableElement('page-hcp-context-tools', 'Tools Tab', 'page', 'pages/hcp-context/tools.md', 'proposed', {
    releaseNotes: 'MCP tools management for AI assistance',
    owners: ['AI Team'],
    dependencies: ['view-admin'],
    tags: ['internal', 'ai', 'mcp'],
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
