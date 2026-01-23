// =============================================================================
// AI ELEMENTS COMPONENTS - MASTER BARREL EXPORT
// =============================================================================
// Vercel AI Elements-inspired components with MUI styling.
// Organized into categories for easy importing.
// =============================================================================

// Message Suite
export {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageBranch,
  MessageAttachments,
  type MessageProps,
  type MessageContentProps,
  type MessageResponseProps,
  type MessageActionsProps,
  type MessageBranchProps,
  type MessageAttachmentsProps,
  type FeedbackType,
} from './message';

// Conversation Suite
export {
  Conversation,
  ConversationEmptyState,
  ConversationScrollButton,
  useConversationScroll,
  type ConversationProps,
  type ConversationEmptyStateProps,
  type ConversationScrollButtonProps,
} from './conversation';

// Input Suite
export {
  PromptInput,
  ModelSelector,
  DEFAULT_MODELS,
  type PromptInputProps,
  type ModelSelectorProps,
  type ModelOption,
} from './input';

// AI Features
export {
  Reasoning,
  Tool,
  ToolList,
  Suggestion,
  Suggestions,
  Sources,
  InlineCitation,
  Plan,
  ChainOfThought,
  type ReasoningProps,
  type ToolProps,
  type ToolListProps,
  type SuggestionProps,
  type SuggestionsProps,
  type SourcesProps,
  type InlineCitationProps,
  type PlanProps,
  type ChainOfThoughtProps,
  type ThoughtStep,
} from './ai';

// Utilities
export {
  Shimmer,
  Checkpoint,
  Confirmation,
  Queue,
  Context,
  Attachments,
  type ShimmerProps,
  type CheckpointProps,
  type CheckpointStatus,
  type ConfirmationProps,
  type QueueProps,
  type QueueItem,
  type ContextProps,
  type ContextItem,
  type AttachmentsProps,
} from './utils';
