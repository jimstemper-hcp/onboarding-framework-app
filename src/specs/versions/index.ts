// =============================================================================
// SPEC VERSIONING - REGISTRY UTILITIES
// =============================================================================
// This file provides utilities for loading and managing the spec versions registry.
// =============================================================================

import type {
  SpecVersionsRegistry,
  SpecVersionEntry,
  SpecVersionRelease,
  SpecCategory,
  VersionLevel,
} from './types';
import { getNextVersion, createGitTag, parseVersion } from './types';
import specVersionsData from './spec-versions.json';

// Re-export types for convenience
export * from './types';

/**
 * The loaded spec versions registry.
 */
export const specVersionsRegistry: SpecVersionsRegistry = specVersionsData as SpecVersionsRegistry;

/**
 * Gets all versioned specs.
 */
export function getAllSpecs(): SpecVersionEntry[] {
  return specVersionsRegistry.specs;
}

/**
 * Gets a spec by its ID.
 */
export function getSpecById(specId: string): SpecVersionEntry | undefined {
  return specVersionsRegistry.specs.find((s) => s.specId === specId);
}

/**
 * Gets all specs in a specific category.
 */
export function getSpecsByCategory(category: SpecCategory): SpecVersionEntry[] {
  return specVersionsRegistry.specs.filter((s) => s.category === category);
}

/**
 * Gets all specs that have been released at least once.
 */
export function getReleasedSpecs(): SpecVersionEntry[] {
  return specVersionsRegistry.specs.filter((s) => s.releases.length > 0);
}

/**
 * Gets the latest release for a spec, if any.
 */
export function getLatestRelease(specId: string): SpecVersionRelease | undefined {
  const spec = getSpecById(specId);
  if (!spec || spec.releases.length === 0) return undefined;
  return spec.releases[0]; // Releases are stored newest-first
}

/**
 * Calculates what the next version would be for a spec.
 */
export function calculateNextVersion(specId: string, level: VersionLevel): string {
  const spec = getSpecById(specId);
  const currentVersion = spec?.currentVersion === '0.0.0' ? null : spec?.currentVersion ?? null;
  return getNextVersion(currentVersion, level);
}

/**
 * Creates a new release entry object (does not persist - used by CLI).
 */
export function createReleaseEntry(
  specId: string,
  version: string,
  releaseNotes?: string
): SpecVersionRelease {
  return {
    version,
    releasedAt: new Date().toISOString(),
    releaseNotes,
    gitTag: createGitTag(specId, version),
  };
}

/**
 * Gets the spec ID from a spec file path.
 * Example: "pages/hcp-context/features/invoicing.md" -> "features/invoicing"
 */
export function getSpecIdFromPath(specPath: string): string | undefined {
  const spec = specVersionsRegistry.specs.find((s) => s.specPath === specPath);
  return spec?.specId;
}

/**
 * Gets all unique categories that have specs.
 */
export function getCategories(): SpecCategory[] {
  const categories = new Set<SpecCategory>();
  specVersionsRegistry.specs.forEach((s) => categories.add(s.category));
  return Array.from(categories);
}

/**
 * Formats a version for display with its level label.
 */
export function formatVersionWithLevel(version: string, prevVersion?: string): string {
  if (!prevVersion) {
    const parsed = parseVersion(version);
    if (!parsed) return version;
    if (parsed.major > 0) return `${version} (Major)`;
    if (parsed.minor > 0) return `${version} (Minor)`;
    return `${version} (Patch)`;
  }

  const oldParsed = parseVersion(prevVersion);
  const newParsed = parseVersion(version);

  if (!oldParsed || !newParsed) return version;

  if (newParsed.major > oldParsed.major) return `${version} (Major)`;
  if (newParsed.minor > oldParsed.minor) return `${version} (Minor)`;
  if (newParsed.patch > oldParsed.patch) return `${version} (Patch)`;

  return version;
}

/**
 * Gets version history for a spec with computed level labels.
 */
export function getVersionHistoryWithLabels(
  specId: string
): Array<SpecVersionRelease & { levelLabel: string }> {
  const spec = getSpecById(specId);
  if (!spec) return [];

  return spec.releases.map((release, index) => {
    const prevVersion = spec.releases[index + 1]?.version;
    const formatted = formatVersionWithLevel(release.version, prevVersion);
    const levelLabel = formatted.includes('(')
      ? formatted.split('(')[1].replace(')', '')
      : 'Initial';

    return {
      ...release,
      levelLabel,
    };
  });
}
