// =============================================================================
// CONFLUENCE SYNC UTILITIES
// =============================================================================
// Handles syncing spec documents to Confluence based on version level.
//
// Sync behavior by version level:
// - Major (first): Create page "{Spec Name} v1.x.x"
// - Major (subsequent): Create sibling page "{Spec Name} v2.x.x"
// - Minor/Patch: Update existing page from last major
// =============================================================================

import {
  createConfluenceClient,
  CONFLUENCE_STATUS,
  type ConfluenceClient,
  type ConfluenceResult,
  type ConfluenceStatusType,
} from './confluenceClient';
import type { SpecVersionEntry, SpecVersionRelease, VersionLevel } from '../../specs/versions/types';
import { parseVersion } from '../../specs/versions/types';

/**
 * Converts markdown to Confluence storage format (basic conversion).
 * For full conversion, consider using a library like markdown-to-confluence.
 */
export function markdownToConfluence(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">$1</ac:parameter><ac:plain-text-body><![CDATA[$2]]></ac:plain-text-body></ac:structured-macro>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Unordered lists
  html = html.replace(/^\s*[-*] (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Ordered lists
  html = html.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');

  // Tables (basic)
  html = html.replace(/\|(.+)\|/g, (match, content) => {
    const cells = content.split('|').map((cell: string) => cell.trim());
    const row = cells.map((cell: string) => `<td>${cell}</td>`).join('');
    return `<tr>${row}</tr>`;
  });

  // Paragraphs (wrap remaining lines)
  html = html.split('\n\n').map(para => {
    if (para.startsWith('<')) return para;
    return `<p>${para}</p>`;
  }).join('\n');

  return html;
}

/**
 * Creates the page title for a spec version.
 */
export function createPageTitle(specName: string, majorVersion: number): string {
  return `${specName} v${majorVersion}.x.x`;
}

/**
 * Gets the Confluence status for a given version level.
 * - Patch: Rough draft (early planning iteration)
 * - Minor: In progress (design iteration)
 * - Major: Verified (ready for engineering)
 */
export function getStatusForVersionLevel(level: VersionLevel): ConfluenceStatusType {
  switch (level) {
    case 'patch':
      return CONFLUENCE_STATUS.ROUGH_DRAFT;
    case 'minor':
      return CONFLUENCE_STATUS.IN_PROGRESS;
    case 'major':
      return CONFLUENCE_STATUS.VERIFIED;
  }
}

/**
 * Gets the major version number from a version string.
 */
export function getMajorVersion(version: string): number {
  const parsed = parseVersion(version);
  return parsed?.major ?? 0;
}

/**
 * Finds the Confluence doc ID from the last major release.
 */
export function findLastMajorConfluenceDoc(releases: SpecVersionRelease[]): string | undefined {
  // Find the most recent major release that has a Confluence doc
  for (const release of releases) {
    const parsed = parseVersion(release.version);
    if (parsed && release.confluenceDocId) {
      return release.confluenceDocId;
    }
  }
  return undefined;
}

/**
 * Determines if this is the first release for a major version.
 */
export function isFirstMajorRelease(releases: SpecVersionRelease[], newVersion: string): boolean {
  const newMajor = getMajorVersion(newVersion);

  // Check if any existing release has the same major version
  for (const release of releases) {
    const releaseMajor = getMajorVersion(release.version);
    if (releaseMajor === newMajor) {
      return false;
    }
  }

  return true;
}

/**
 * Options for syncing a spec to Confluence.
 */
export interface SyncOptions {
  specEntry: SpecVersionEntry;
  newVersion: string;
  versionLevel: VersionLevel;
  specContent: string;
  vercelPreviewUrl?: string;
  gitTag: string;
  /** Stored Confluence page ID from previous release (if any) */
  storedConfluenceDocId?: string;
}

/**
 * Syncs a spec to Confluence based on the version level.
 */
export async function syncSpecToConfluence(options: SyncOptions): Promise<ConfluenceResult> {
  const client = createConfluenceClient();

  if (!client) {
    return {
      success: false,
      error: 'Confluence not configured. Set VITE_CONFLUENCE_* environment variables.',
    };
  }

  const { specEntry, newVersion, versionLevel, specContent, vercelPreviewUrl, gitTag, storedConfluenceDocId } = options;

  try {
    // Convert markdown to Confluence format
    let confluenceBody = markdownToConfluence(specContent);

    // Add metadata section at the top
    const metadataHtml = createMetadataSection(newVersion, vercelPreviewUrl, gitTag);
    confluenceBody = metadataHtml + confluenceBody;

    const majorVersion = getMajorVersion(newVersion);
    const pageTitle = createPageTitle(specEntry.displayName, majorVersion);

    if (versionLevel === 'major') {
      // Major release: Create new page or update first major page
      return await handleMajorRelease(client, specEntry, pageTitle, confluenceBody, storedConfluenceDocId, versionLevel);
    } else {
      // Minor/Patch: Update existing page from last major
      return await handleMinorPatchRelease(client, specEntry, pageTitle, confluenceBody, storedConfluenceDocId, versionLevel);
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Creates a metadata section for the Confluence page.
 */
function createMetadataSection(version: string, previewUrl?: string, gitTag?: string): string {
  let html = '<ac:structured-macro ac:name="info"><ac:rich-text-body>';
  html += `<p><strong>Version:</strong> ${version}</p>`;

  if (previewUrl) {
    html += `<p><strong>Prototype:</strong> <a href="${previewUrl}">View Preview</a></p>`;
  }

  if (gitTag) {
    html += `<p><strong>Git Tag:</strong> <code>${gitTag}</code></p>`;
    html += `<p><strong>Checkout:</strong> <code>git checkout ${gitTag}</code></p>`;
  }

  html += `<p><strong>Last Updated:</strong> ${new Date().toISOString()}</p>`;
  html += '</ac:rich-text-body></ac:structured-macro>';

  return html;
}

/**
 * Handles major version releases - creates new page or updates first major.
 */
async function handleMajorRelease(
  client: ConfluenceClient,
  specEntry: SpecVersionEntry,
  pageTitle: string,
  body: string,
  storedConfluenceDocId?: string,
  versionLevel?: VersionLevel
): Promise<ConfluenceResult> {
  // First: Try to use stored page ID if available
  if (storedConfluenceDocId) {
    const existingPage = await client.getPageById(storedConfluenceDocId);
    if (existingPage) {
      const updatedPage = await client.updatePage(existingPage.id, {
        title: pageTitle,
        body,
      });
      // Set page status based on version level
      if (versionLevel) {
        await client.setPageStatus(updatedPage.id, getStatusForVersionLevel(versionLevel));
      }
      return {
        success: true,
        pageId: updatedPage.id,
        pageUrl: client.getPageUrl(updatedPage),
      };
    }
    // If stored ID is invalid, fall through to title search
  }

  // Fallback: Check if a page with this title already exists
  const existingPage = await client.findPageByTitle(pageTitle);

  if (existingPage) {
    // Update existing page
    const updatedPage = await client.updatePage(existingPage.id, {
      title: pageTitle,
      body,
    });
    // Set page status based on version level
    if (versionLevel) {
      await client.setPageStatus(updatedPage.id, getStatusForVersionLevel(versionLevel));
    }
    return {
      success: true,
      pageId: updatedPage.id,
      pageUrl: client.getPageUrl(updatedPage),
    };
  } else {
    // Create new page under category
    const categoryPage = await client.findOrCreateCategoryPage(specEntry.category);

    const newPage = await client.createPage({
      title: pageTitle,
      body,
      parentId: categoryPage.id,
    });
    // Set page status based on version level
    if (versionLevel) {
      await client.setPageStatus(newPage.id, getStatusForVersionLevel(versionLevel));
    }
    return {
      success: true,
      pageId: newPage.id,
      pageUrl: client.getPageUrl(newPage),
    };
  }
}

/**
 * Handles minor/patch releases - updates existing page.
 */
async function handleMinorPatchRelease(
  client: ConfluenceClient,
  specEntry: SpecVersionEntry,
  pageTitle: string,
  body: string,
  storedConfluenceDocId?: string,
  versionLevel?: VersionLevel
): Promise<ConfluenceResult> {
  // First: Try to use stored page ID if available (most reliable)
  if (storedConfluenceDocId) {
    const existingPage = await client.getPageById(storedConfluenceDocId);
    if (existingPage) {
      const updatedPage = await client.updatePage(existingPage.id, {
        title: pageTitle,
        body,
      });
      // Set page status based on version level
      if (versionLevel) {
        await client.setPageStatus(updatedPage.id, getStatusForVersionLevel(versionLevel));
      }
      return {
        success: true,
        pageId: updatedPage.id,
        pageUrl: client.getPageUrl(updatedPage),
      };
    }
    // If stored ID is invalid, fall through to title search
  }

  // Fallback: Find the existing page for this major version by title
  const existingPage = await client.findPageByTitle(pageTitle);

  if (!existingPage) {
    // No existing page - create one under category (shouldn't normally happen)
    const categoryPage = await client.findOrCreateCategoryPage(specEntry.category);

    const newPage = await client.createPage({
      title: pageTitle,
      body,
      parentId: categoryPage.id,
    });
    // Set page status based on version level
    if (versionLevel) {
      await client.setPageStatus(newPage.id, getStatusForVersionLevel(versionLevel));
    }
    return {
      success: true,
      pageId: newPage.id,
      pageUrl: client.getPageUrl(newPage),
    };
  }

  // Update the existing page
  const updatedPage = await client.updatePage(existingPage.id, {
    title: pageTitle,
    body,
  });
  // Set page status based on version level
  if (versionLevel) {
    await client.setPageStatus(updatedPage.id, getStatusForVersionLevel(versionLevel));
  }
  return {
    success: true,
    pageId: updatedPage.id,
    pageUrl: client.getPageUrl(updatedPage),
  };
}

/**
 * Checks if Confluence sync is available.
 */
export function isConfluenceConfigured(): boolean {
  return createConfluenceClient() !== null;
}
