// =============================================================================
// CONFLUENCE API CLIENT
// =============================================================================
// Wrapper for Confluence Cloud REST API.
// Used for syncing spec documents to Confluence.
//
// Environment variables required:
// - CONFLUENCE_BASE_URL: https://company.atlassian.net/wiki
// - CONFLUENCE_SPACE_KEY: SPECS
// - CONFLUENCE_API_TOKEN: your-api-token
// - CONFLUENCE_USER_EMAIL: your-email@company.com
// =============================================================================

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

  if (!baseUrl || !spaceKey || !apiToken || !userEmail) {
    return null;
  }

  return { baseUrl, spaceKey, apiToken, userEmail };
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
}

/**
 * Creates a Confluence client if configuration is available.
 */
export function createConfluenceClient(): ConfluenceClient | null {
  const config = getConfluenceConfig();
  if (!config) return null;
  return new ConfluenceClient(config);
}
