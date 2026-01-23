// =============================================================================
// MESSAGE ACTIONS COMPONENT
// =============================================================================
// Action buttons for message interactions.
// Supports copy, regenerate, like/dislike actions.
// =============================================================================

import { useState, useCallback } from 'react';
import { Box, IconButton, Tooltip, Fade } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export type FeedbackType = 'like' | 'dislike' | null;

export interface MessageActionsProps {
  /** Content to copy */
  content: string;
  /** Show regenerate button */
  showRegenerate?: boolean;
  /** Show feedback buttons */
  showFeedback?: boolean;
  /** Callback when regenerate is clicked */
  onRegenerate?: () => void;
  /** Callback when feedback is given */
  onFeedback?: (feedback: FeedbackType) => void;
  /** Current feedback state */
  feedback?: FeedbackType;
  /** Whether actions are visible */
  visible?: boolean;
  /** Disable all actions */
  disabled?: boolean;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function MessageActions({
  content,
  showRegenerate = true,
  showFeedback = true,
  onRegenerate,
  onFeedback,
  feedback,
  visible = true,
  disabled = false,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [content]);

  const handleFeedback = useCallback((type: FeedbackType) => {
    // Toggle feedback if clicking the same one
    const newFeedback = feedback === type ? null : type;
    onFeedback?.(newFeedback);
  }, [feedback, onFeedback]);

  return (
    <Fade in={visible}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mt: 1,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        {/* Copy button */}
        <Tooltip title={copied ? 'Copied!' : 'Copy'}>
          <IconButton
            size="small"
            onClick={handleCopy}
            disabled={disabled}
            sx={{
              color: copied ? 'success.main' : 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            {copied ? (
              <CheckIcon fontSize="small" />
            ) : (
              <ContentCopyIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        {/* Regenerate button */}
        {showRegenerate && onRegenerate && (
          <Tooltip title="Regenerate">
            <IconButton
              size="small"
              onClick={onRegenerate}
              disabled={disabled}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* Feedback buttons */}
        {showFeedback && onFeedback && (
          <>
            <Tooltip title="Good response">
              <IconButton
                size="small"
                onClick={() => handleFeedback('like')}
                disabled={disabled}
                sx={{
                  color: feedback === 'like' ? 'success.main' : 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {feedback === 'like' ? (
                  <ThumbUpIcon fontSize="small" />
                ) : (
                  <ThumbUpOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Bad response">
              <IconButton
                size="small"
                onClick={() => handleFeedback('dislike')}
                disabled={disabled}
                sx={{
                  color: feedback === 'dislike' ? 'error.main' : 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {feedback === 'dislike' ? (
                  <ThumbDownIcon fontSize="small" />
                ) : (
                  <ThumbDownOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </Fade>
  );
}

export default MessageActions;
