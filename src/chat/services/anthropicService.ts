// =============================================================================
// ANTHROPIC API SERVICE
// =============================================================================
// Handles communication with the Anthropic Claude API.
// Supports both environment variable and user-provided API keys.
// =============================================================================

import type {
  AnthropicMessage,
  AnthropicRequest,
  AnthropicResponse,
  AnthropicError,
  ApiKeyConfig,
} from '../types';

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 2048;
const STORAGE_KEY = 'anthropic-api-key';

// -----------------------------------------------------------------------------
// API KEY MANAGEMENT
// -----------------------------------------------------------------------------

/**
 * Get the API key from environment or localStorage.
 */
export function getApiKey(): string | null {
  // Environment variable takes precedence
  const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (envKey) {
    return envKey;
  }

  // Fall back to localStorage
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Check API key configuration.
 */
export function getApiKeyConfig(): ApiKeyConfig {
  const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const userKey = localStorage.getItem(STORAGE_KEY);

  return {
    hasEnvKey: Boolean(envKey),
    userKey,
    hasKey: Boolean(envKey || userKey),
  };
}

/**
 * Store API key in localStorage.
 */
export function setStoredApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}

/**
 * Remove API key from localStorage.
 */
export function clearStoredApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// -----------------------------------------------------------------------------
// API CALL
// -----------------------------------------------------------------------------

/**
 * Send a message to the Anthropic API.
 *
 * @param messages - Conversation history
 * @param systemPrompt - System prompt for the AI
 * @returns The assistant's response text
 * @throws Error if API call fails
 */
export async function sendToAnthropic(
  messages: AnthropicMessage[],
  systemPrompt: string
): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('No API key configured. Please add your Anthropic API key.');
  }

  const request: AnthropicRequest = {
    model: DEFAULT_MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages,
  };

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as AnthropicError;
    const errorMessage = errorData.error?.message || `API error: ${response.status}`;

    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your Anthropic API key.');
    }

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }

    throw new Error(errorMessage);
  }

  const data = (await response.json()) as AnthropicResponse;

  // Extract text from the response
  const textContent = data.content.find((block) => block.type === 'text');
  if (!textContent) {
    throw new Error('No text content in response');
  }

  return textContent.text;
}

// -----------------------------------------------------------------------------
// VALIDATION
// -----------------------------------------------------------------------------

/**
 * Validate an API key format (basic check).
 */
export function isValidApiKeyFormat(key: string): boolean {
  // Anthropic keys start with 'sk-ant-' and are quite long
  return key.startsWith('sk-ant-') && key.length > 40;
}
