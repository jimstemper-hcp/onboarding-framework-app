// =============================================================================
// STREAMING SERVICE
// =============================================================================
// Handles streaming communication with the Anthropic Claude API.
// Parses SSE events and emits progressive tokens, thinking blocks, and tool calls.
// =============================================================================

import type {
  AnthropicMessage,
  StreamEvent,
  StreamCallbacks,
  ToolCall,
} from '../types';
import { getApiKey } from './anthropicService';

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;

// -----------------------------------------------------------------------------
// STREAMING API
// -----------------------------------------------------------------------------

export interface StreamOptions {
  messages: AnthropicMessage[];
  systemPrompt: string;
  callbacks: StreamCallbacks;
  signal?: AbortSignal;
  enableThinking?: boolean;
}

/**
 * Parse a single SSE line into an event.
 */
function parseSSELine(line: string): StreamEvent | null {
  if (!line.startsWith('data: ')) {
    return null;
  }

  const data = line.slice(6).trim();
  if (data === '[DONE]') {
    return null;
  }

  try {
    return JSON.parse(data) as StreamEvent;
  } catch {
    console.warn('Failed to parse SSE data:', data);
    return null;
  }
}

/**
 * Process a stream event and invoke appropriate callbacks.
 */
function processStreamEvent(
  event: StreamEvent,
  state: {
    currentContent: string;
    currentThinking: string;
    activeTools: Map<number, ToolCall>;
    currentBlockType: string | null;
    currentBlockIndex: number;
  },
  callbacks: StreamCallbacks
): void {
  switch (event.type) {
    case 'content_block_start':
      if (event.content_block) {
        state.currentBlockIndex = event.index ?? 0;
        state.currentBlockType = event.content_block.type;

        if (event.content_block.type === 'tool_use') {
          const tool: ToolCall = {
            id: event.content_block.id || crypto.randomUUID(),
            name: event.content_block.name || 'unknown',
            parameters: event.content_block.input || {},
            status: 'pending',
          };
          state.activeTools.set(state.currentBlockIndex, tool);
          callbacks.onToolStart?.(tool);
        }
      }
      break;

    case 'content_block_delta':
      if (event.delta) {
        if (event.delta.type === 'text_delta' && event.delta.text) {
          state.currentContent += event.delta.text;
          callbacks.onToken?.(event.delta.text);
        } else if (event.delta.type === 'thinking_delta' && event.delta.thinking) {
          state.currentThinking += event.delta.thinking;
          callbacks.onThinking?.(event.delta.thinking);
        } else if (event.delta.type === 'input_json_delta' && event.delta.partial_json) {
          // Update tool parameters as they stream in
          const tool = state.activeTools.get(event.index ?? state.currentBlockIndex);
          if (tool) {
            try {
              // Accumulate partial JSON (this is simplified - real impl may need buffering)
              const currentParams = JSON.stringify(tool.parameters);
              const newParams = currentParams === '{}'
                ? event.delta.partial_json
                : currentParams.slice(0, -1) + event.delta.partial_json;
              try {
                tool.parameters = JSON.parse(newParams);
              } catch {
                // JSON not complete yet, keep accumulating
              }
            } catch {
              // Ignore parse errors for partial JSON
            }
          }
        }
      }
      break;

    case 'content_block_stop':
      if (state.currentBlockType === 'tool_use') {
        const tool = state.activeTools.get(event.index ?? state.currentBlockIndex);
        if (tool) {
          tool.status = 'running';
          callbacks.onToolUpdate?.(tool.id, { status: 'running' });
        }
      }
      state.currentBlockType = null;
      break;

    case 'message_stop':
      callbacks.onComplete?.(state.currentContent);
      break;

    case 'error':
      if (event.error) {
        callbacks.onError?.(new Error(event.error.message));
      }
      break;
  }
}

/**
 * Stream a message to the Anthropic API and process responses.
 */
export async function streamToAnthropic(options: StreamOptions): Promise<string> {
  const { messages, systemPrompt, callbacks, signal, enableThinking = false } = options;
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('No API key configured. Please add your Anthropic API key.');
  }

  const requestBody: Record<string, unknown> = {
    model: DEFAULT_MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages,
    stream: true,
  };

  // Enable extended thinking if requested
  if (enableThinking) {
    requestBody.metadata = {
      thinking: {
        type: 'enabled',
        budget_tokens: 1024,
      },
    };
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(requestBody),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.error?.message || `API error: ${response.status}`;

    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your Anthropic API key.');
    }

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }

    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  // Process the stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const state = {
    currentContent: '',
    currentThinking: '',
    activeTools: new Map<number, ToolCall>(),
    currentBlockType: null as string | null,
    currentBlockIndex: 0,
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const event = parseSSELine(trimmedLine);
        if (event) {
          processStreamEvent(event, state, callbacks);
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      const event = parseSSELine(buffer.trim());
      if (event) {
        processStreamEvent(event, state, callbacks);
      }
    }
  } finally {
    reader.releaseLock();
  }

  return state.currentContent;
}

/**
 * Create an AbortController for cancelling streams.
 */
export function createStreamController(): AbortController {
  return new AbortController();
}

// -----------------------------------------------------------------------------
// MOCK STREAMING (for demo mode)
// -----------------------------------------------------------------------------

export interface MockStreamOptions {
  content: string;
  callbacks: StreamCallbacks;
  thinkingContent?: string;
  toolCalls?: ToolCall[];
  delay?: number;
}

/**
 * Simulate streaming for mock mode with realistic token-by-token delivery.
 */
export async function mockStream(options: MockStreamOptions): Promise<void> {
  const {
    content,
    callbacks,
    thinkingContent,
    toolCalls,
    delay = 20
  } = options;

  // Stream thinking first if present
  if (thinkingContent) {
    const thinkingWords = thinkingContent.split(' ');
    for (const word of thinkingWords) {
      callbacks.onThinking?.(word + ' ');
      await sleep(delay / 2);
    }
  }

  // Simulate tool calls if present
  if (toolCalls && toolCalls.length > 0) {
    for (const tool of toolCalls) {
      callbacks.onToolStart?.({ ...tool, status: 'pending' });
      await sleep(100);
      callbacks.onToolUpdate?.(tool.id, { status: 'running' });
      await sleep(200);
      callbacks.onToolUpdate?.(tool.id, { status: 'completed', result: tool.result });
      await sleep(100);
    }
  }

  // Stream content token by token
  const words = content.split(' ');
  for (let i = 0; i < words.length; i++) {
    const token = words[i] + (i < words.length - 1 ? ' ' : '');
    callbacks.onToken?.(token);
    await sleep(delay);
  }

  callbacks.onComplete?.(content);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
