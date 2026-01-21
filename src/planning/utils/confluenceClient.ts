// =============================================================================
// CONFLUENCE API CLIENT
// =============================================================================
// Wrapper for Confluence Cloud REST API.
// Used for syncing spec documents to Confluence.
//
// Environment variables required:
// - VITE_CONFLUENCE_BASE_URL: https://company.atlassian.net/wiki
// - VITE_CONFLUENCE_SPACE_KEY: SPECS
// - VITE_CONFLUENCE_API_TOKEN: your-api-token
// - VITE_CONFLUENCE_USER_EMAIL: your-email@company.com
//
// Optional:
// - VITE_CONFLUENCE_PARENT_PAGE_ID: ID of parent page for all specs
// =============================================================================

/**
 * Confluence page status configuration.
 */
export const CONFLUENCE_STATUS = {
  ROUGH_DRAFT: { name: 'Rough draft', color: 'grey' },
  IN_PROGRESS: { name: 'In progress', color: 'blue' },
  VERIFIED: { name: 'Verified', color: 'green' },
} as const;

export type ConfluenceStatusType = typeof CONFLUENCE_STATUS[keyof typeof CONFLUENCE_STATUS];

/**
 * Confluence page content format.
 */
export interface ConfluencePageContent {
  title: string;
  body: string;
  parentId?: string;
}

/**
 * Confluence page response from API.
 */
export interface ConfluencePage {
  id: string;
  title: string;
  version: {
    number: number;
  };
  _links: {
    webui: string;
    base: string;
  };
}

/**
 * Result of a Confluence operation.
 */
export interface ConfluenceResult {
  success: boolean;
  pageId?: string;
  pageUrl?: string;
  error?: string;
}

/**
 * Confluence API configuration.
 */
export interface ConfluenceConfig {
  baseUrl: string;
  spaceKey: string;
  apiToken: string;
  userEmail: string;
  parentPageId?: string;
}

/**
 * Gets Confluence configuration from environment variables.
 * Returns null if not configured.
 */
export function getConfluenceConfig(): ConfluenceConfig | null {
  const baseUrl = import.meta.env.VITE_CONFLUENCE_BASE_URL;
  const spaceKey = import.meta.env.VITE_CONFLUENCE_SPACE_KEY;
  const apiToken = import.meta.env.VITE_CONFLUENCE_API_TOKEN;
  const userEmail = import.meta.env.VITE_CONFLUENCE_USER_EMAIL;
  const parentPageId = import.meta.env.VITE_CONFLUENCE_PARENT_PAGE_ID;

  if (!baseUrl || !spaceKey || !apiToken || !userEmail) {
    return null;
  }

  return { baseUrl, spaceKey, apiToken, userEmail, parentPageId };
}

/**
 * Creates the Authorization header for Confluence API.
 */
function getAuthHeader(config: ConfluenceConfig): string {
  const credentials = `${config.userEmail}:${config.apiToken}`;
  return `Basic ${btoa(credentials)}`;
}

/**
 * Confluence API client class.
 */
export class ConfluenceClient {
  private config: ConfluenceConfig;

  constructor(config: ConfluenceConfig) {
    this.config = config;
  }

  /**
   * Makes an authenticated request to the Confluence API.
   */
  private async request<T>(
    method: string,
    endpoint: string,
    body?: object
  ): Promise<T> {
    const url = `${this.config.baseUrl}/rest/api${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: getAuthHeader(this.config),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Confluence API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Searches for a page by title in the configured space.
   */
  async findPageByTitle(title: string): Promise<ConfluencePage | null> {
    const cql = `title="${title}" AND space="${this.config.spaceKey}"`;
    const endpoint = `/content/search?cql=${encodeURIComponent(cql)}`;

    const result = await this.request<{ results: ConfluencePage[] }>('GET', endpoint);

    return result.results.length > 0 ? result.results[0] : null;
  }

  /**
   * Gets a page by ID.
   */
  async getPage(pageId: string): Promise<ConfluencePage> {
    return this.request<ConfluencePage>('GET', `/content/${pageId}?expand=version`);
  }

  /**
   * Creates a new page in the configured space.
   */
  async createPage(content: ConfluencePageContent): Promise<ConfluencePage> {
    const body = {
      type: 'page',
      title: content.title,
      space: { key: this.config.spaceKey },
      body: {
        storage: {
          value: content.body,
          representation: 'storage',
        },
      },
      ...(content.parentId && {
        ancestors: [{ id: content.parentId }],
      }),
    };

    return this.request<ConfluencePage>('POST', '/content', body);
  }

  /**
   * Updates an existing page.
   */
  async updatePage(pageId: string, content: ConfluencePageContent): Promise<ConfluencePage> {
    // First get the current version
    const currentPage = await this.getPage(pageId);

    const body = {
      type: 'page',
      title: content.title,
      version: { number: currentPage.version.number + 1 },
      body: {
        storage: {
          value: content.body,
          representation: 'storage',
        },
      },
    };

    return this.request<ConfluencePage>('PUT', `/content/${pageId}`, body);
  }

  /**
   * Gets the full URL to a page.
   */
  getPageUrl(page: ConfluencePage): string {
    return `${page._links.base}${page._links.webui}`;
  }

  /**
   * Gets page by ID directly. More reliable than title search.
   */
  async getPageById(pageId: string): Promise<ConfluencePage | null> {
    try {
      return await this.request<ConfluencePage>('GET', `/content/${pageId}?expand=version`);
    } catch (error) {
      // Return null if page not found (404)
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Gets child pages under a parent page.
   */
  async getChildPages(parentId: string): Promise<ConfluencePage[]> {
    const endpoint = `/content/${parentId}/child/page?expand=version`;
    const result = await this.request<{ results: ConfluencePage[] }>('GET', endpoint);
    return result.results;
  }

  /**
   * Gets the configured parent page ID.
   */
  getParentPageId(): string | undefined {
    return this.config.parentPageId;
  }

  /**
   * Verifies the space exists and credentials work.
   */
  async verifyConnection(): Promise<{ success: boolean; spaceName?: string; error?: string }> {
    try {
      const space = await this.request<{ name: string }>('GET', `/space/${this.config.spaceKey}`);
      return { success: true, spaceName: space.name };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Finds a child page by title under a specific parent.
   */
  async findChildPageByTitle(parentId: string, title: string): Promise<ConfluencePage | null> {
    const children = await this.getChildPages(parentId);
    return children.find(page => page.title === title) || null;
  }

  /**
   * Sets the status label on a Confluence page.
   * Uses the Content States API: PUT /content/{pageId}/state
   */
  async setPageStatus(pageId: string, status: ConfluenceStatusType): Promise<void> {
    await this.request('PUT', `/content/${pageId}/state`, {
      name: status.name,
      color: status.color,
    });
  }

  /**
   * Finds or creates a category page under the configured parent.
   * Categories are organized as: Parent > Features, Parent > Navigation, etc.
   */
  async findOrCreateCategoryPage(category: string): Promise<ConfluencePage> {
    const parentId = this.config.parentPageId;
    const categoryTitle = getCategoryDisplayName(category);

    if (parentId) {
      // Look for existing category page under parent
      const existingCategory = await this.findChildPageByTitle(parentId, categoryTitle);
      if (existingCategory) {
        return existingCategory;
      }

      // Create new category page under parent
      return await this.createPage({
        title: categoryTitle,
        body: `<p>Spec documents for <strong>${categoryTitle}</strong>.</p>`,
        parentId,
      });
    } else {
      // No parent configured - search by title in space
      const existingCategory = await this.findPageByTitle(categoryTitle);
      if (existingCategory) {
        return existingCategory;
      }

      // Create new category page at space root
      return await this.createPage({
        title: categoryTitle,
        body: `<p>Spec documents for <strong>${categoryTitle}</strong>.</p>`,
      });
    }
  }
}

/**
 * Converts a category slug to a display name.
 * Examples: "features" -> "Features", "onboarding-items" -> "Onboarding Items"
 */
export function getCategoryDisplayName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Creates a Confluence client if configuration is available.
 */
export function createConfluenceClient(): ConfluenceClient | null {
  const config = getConfluenceConfig();
  if (!config) return null;
  return new ConfluenceClient(config);
}
