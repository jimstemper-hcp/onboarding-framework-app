// =============================================================================
// USE CHAT HOOK
// =============================================================================
// Convenience hook for accessing chat functionality.
// Provides a simplified interface for chat components.
// =============================================================================

import { useChatContext } from '../context/ChatContext';

/**
 * Convenience hook for chat functionality.
 * This is the primary way components should access chat features.
 */
export function useChat() {
  return useChatContext();
}

export default useChat;
