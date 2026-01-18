import type { OnboardingCategory } from '../types';

/**
 * Categories for the Frontline Onboarding Plan.
 * These organize onboarding items into logical groups for the 3x3 grid view.
 */
export const onboardingCategories: OnboardingCategory[] = [
  { id: 'account-setup', label: 'Account Setup', icon: 'Settings' },
  { id: 'the-basics', label: 'The Basics', icon: 'Person' },
  { id: 'add-ons', label: 'Add Ons', icon: 'Extension' },
  { id: 'estimates', label: 'Estimates', icon: 'RequestQuote' },
  { id: 'jobs', label: 'Jobs', icon: 'Work' },
  { id: 'invoicing', label: 'Invoicing', icon: 'Receipt' },
  { id: 'service-plans', label: 'Service Plans', icon: 'EventRepeat' },
  { id: 'additional-tools', label: 'Additional Tools', icon: 'Build' },
  { id: 'reporting', label: 'Reporting', icon: 'Analytics' },
];

// Helper to get category by ID
export function getCategoryById(id: string): OnboardingCategory | undefined {
  return onboardingCategories.find(cat => cat.id === id);
}
