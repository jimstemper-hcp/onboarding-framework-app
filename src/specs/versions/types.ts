// =============================================================================
// SPEC VERSIONING - TYPE DEFINITIONS
// =============================================================================
// This file defines the data model for spec versioning and releases.
// Each spec can be independently versioned using semantic versioning.
// =============================================================================

/**
 * Semantic version level for releases.
 * - major: Ready for engineering (creates/updates Confluence doc)
 * - minor: Design iteration (updates existing Confluence doc)
 * - patch: Planning iteration (updates existing Confluence doc)
 */
export type VersionLevel = 'major' | 'minor' | 'patch';

/**
 * A single release of a spec document.
 */
export interface SpecVersionRelease {
  /** Semantic version string, e.g., "1.2.3" */
  version: string;

  /** ISO timestamp of when this version was released */
  releasedAt: string;

  /** Optional release notes describing what changed */
  releaseNotes?: string;

  /** Git tag for this release, e.g., "spec/features/invoicing/v1.2.3" */
  gitTag: string;

  /** Vercel preview URL for this specific version (persistent) */
  vercelDeployUrl?: string;

  /** Confluence document ID for tracking which doc to update */
  confluenceDocId?: string;

  /** Confluence document URL for viewing the synced spec */
  confluenceDocUrl?: string;
}

/**
 * Version tracking entry for a single spec document.
 */
export interface SpecVersionEntry {
  /** Unique identifier for the spec, e.g., "features/invoicing" */
  specId: string;

  /** Path to the spec file relative to /src/specs/, e.g., "pages/hcp-context/features/invoicing.md" */
  specPath: string;

  /** Category of the spec for organization */
  category: SpecCategory;

  /** Display name for the spec */
  displayName: string;

  /** Current version string, e.g., "1.2.3" */
  currentVersion: string;

  /** History of all releases for this spec */
  releases: SpecVersionRelease[];
}

/**
 * Categories of spec documents that can be versioned.
 */
export type SpecCategory =
  | 'features'
  | 'navigation'
  | 'calls'
  | 'onboarding-items'
  | 'tools'
  | 'pages'
  | 'views'
  | 'components';

/**
 * The full spec versions registry structure.
 */
export interface SpecVersionsRegistry {
  /** Schema version for the registry format */
  schemaVersion: string;

  /** When the registry was last updated */
  lastUpdated: string;

  /** All versioned specs */
  specs: SpecVersionEntry[];
}

/**
 * Semantic meaning of each version level for display purposes.
 */
export const VERSION_LEVEL_MEANINGS: Record<VersionLevel, { label: string; description: string; confluenceBehavior: string }> = {
  major: {
    label: 'Major',
    description: 'Ready for engineering',
    confluenceBehavior: 'Creates new doc OR updates first major, then future majors create sibling docs',
  },
  minor: {
    label: 'Minor',
    description: 'Design iteration',
    confluenceBehavior: 'Updates existing doc from last major',
  },
  patch: {
    label: 'Patch',
    description: 'Planning iteration',
    confluenceBehavior: 'Updates existing doc from last major',
  },
};

/**
 * Parses a version string into its components.
 */
export function parseVersion(version: string): { major: number; minor: number; patch: number } | null {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

/**
 * Calculates the next version based on the current version and bump level.
 */
export function getNextVersion(currentVersion: string | null, level: VersionLevel): string {
  if (!currentVersion) {
    // No existing version - start fresh
    switch (level) {
      case 'major':
        return '1.0.0';
      case 'minor':
        return '0.1.0';
      case 'patch':
        return '0.0.1';
    }
  }

  const parsed = parseVersion(currentVersion);
  if (!parsed) {
    // Invalid version format - start fresh
    return level === 'major' ? '1.0.0' : '0.1.0';
  }

  switch (level) {
    case 'major':
      return `${parsed.major + 1}.0.0`;
    case 'minor':
      return `${parsed.major}.${parsed.minor + 1}.0`;
    case 'patch':
      return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
  }
}

/**
 * Creates a git tag string for a spec version.
 */
export function createGitTag(specId: string, version: string): string {
  return `spec/${specId}/v${version}`;
}

/**
 * Determines the version level by comparing two versions.
 */
export function getVersionLevel(oldVersion: string, newVersion: string): VersionLevel | null {
  const oldParsed = parseVersion(oldVersion);
  const newParsed = parseVersion(newVersion);

  if (!oldParsed || !newParsed) return null;

  if (newParsed.major > oldParsed.major) return 'major';
  if (newParsed.minor > oldParsed.minor) return 'minor';
  if (newParsed.patch > oldParsed.patch) return 'patch';

  return null;
}
