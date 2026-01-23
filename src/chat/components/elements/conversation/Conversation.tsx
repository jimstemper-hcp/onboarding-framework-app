// =============================================================================
// CONVERSATION COMPONENT
// =============================================================================
// Auto-scrolling container for chat messages.
// Provides scroll management and visibility detection.
// =============================================================================

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface ConversationProps {
  /** Child content (messages) */
  children: ReactNode;
  /** Whether to auto-scroll to bottom */
  autoScroll?: boolean;
  /** Callback when scroll position changes */
  onScrollChange?: (isAtBottom: boolean) => void;
  /** Threshold in pixels to consider "at bottom" */
  bottomThreshold?: number;
  /** Additional styles */
  sx?: SxProps<Theme>;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function Conversation({
  children,
  autoScroll = true,
  onScrollChange,
  bottomThreshold = 100,
  sx,
}: ConversationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Check if scrolled to bottom
  const checkIsAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= bottomThreshold;
  }, [bottomThreshold]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const newIsAtBottom = checkIsAtBottom();
    if (newIsAtBottom !== isAtBottom) {
      setIsAtBottom(newIsAtBottom);
      onScrollChange?.(newIsAtBottom);
    }
  }, [checkIsAtBottom, isAtBottom, onScrollChange]);

  // Auto-scroll to bottom when children change
  useEffect(() => {
    if (autoScroll && isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [children, autoScroll, isAtBottom]);

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {children}
      <div ref={bottomRef} />
    </Box>
  );
}

export default Conversation;

// Export hook for scroll control
export function useConversationScroll() {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollToBottomRef = useRef<(() => void) | null>(null);

  const handleScrollChange = useCallback((atBottom: boolean) => {
    setIsAtBottom(atBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    scrollToBottomRef.current?.();
  }, []);

  return {
    isAtBottom,
    handleScrollChange,
    scrollToBottom,
  };
}
