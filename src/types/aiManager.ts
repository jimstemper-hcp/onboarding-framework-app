// =============================================================================
// AI MANAGER - TYPE DEFINITIONS
// =============================================================================
// This file defines the data model for the AI Manager system that orchestrates
// intelligent agents (Help, Onboarding, Object sub-agents) with managed prompts
// and tools.
// =============================================================================

import type { AdoptionStage } from './onboarding';

// -----------------------------------------------------------------------------
// AGENT TYPES
// -----------------------------------------------------------------------------

/**
 * Unique identifiers for each agent type.
 * - help: Main entry point, handles general queries
 * - onboarding: Guides pros through setup steps
 * - object-*: Sub-agents for specific record types
 */
export type AgentId =
  | 'help'
  | 'onboarding'
  | 'object-customer'
  | 'object-job'
  | 'object-invoice'
  | 'object-estimate'
  | 'object-employee';

/**
 * Agent operational status.
 * - active: Agent is available for use
 * - inactive: Agent exists but is disabled
 * - draft: Agent is being developed/configured
 */
export type AgentStatus = 'active' | 'inactive' | 'draft';

/**
 * Trigger condition types for automatic handoffs between agents.
 */
export type HandoffConditionType = 'intent' | 'keyword' | 'object_mentioned';

/**
 * Condition definition for triggering handoffs.
 */
export interface HandoffCondition {
  type: HandoffConditionType;
  values: string[];
}

/**
 * Trigger definition for automatic agent handoffs.
 */
export interface HandoffTrigger {
  id: string;
  targetAgent: AgentId;
  condition: HandoffCondition;
  description: string;
}

/**
 * Configuration for how an agent can hand off to other agents.
 */
export interface HandoffConfig {
  canHandoffTo: AgentId[];
  triggers: HandoffTrigger[];
}

/**
 * Complete definition of an AI agent.
 */
export interface AgentDefinition {
  id: AgentId;
  name: string;
  description: string;
  status: AgentStatus;
  systemPrompt: string;
  stageOverrides?: Partial<Record<AdoptionStage, string>>;
  toolIds: string[];
  handoffConfig?: HandoffConfig;
}

// -----------------------------------------------------------------------------
// PROMPT TEMPLATE TYPES
// -----------------------------------------------------------------------------

/**
 * Status of a prompt template.
 */
export type PromptStatus = 'active' | 'draft' | 'archived';

/**
 * Variable definition used in prompt templates.
 */
export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  source: string; // e.g., 'pro.companyName', 'feature.status', 'context.stage'
  required: boolean;
  description?: string;
}

/**
 * Reusable prompt template that can be shared across agents.
 */
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  status: PromptStatus;
  template: string;
  variables: PromptVariable[];
  usedByAgents: AgentId[];
}

// -----------------------------------------------------------------------------
// AI-MANAGED TOOL TYPES
// -----------------------------------------------------------------------------

/**
 * Categories of AI-managed tools.
 */
export type AiToolCategory = 'help' | 'navigation' | 'onboarding' | 'object';

/**
 * Status of an AI-managed tool.
 */
export type AiToolStatus = 'active' | 'inactive';

/**
 * Parameter definition for AI-managed tools.
 */
export interface AiToolParameter {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required?: boolean;
  default?: unknown;
  enum?: string[];
}

/**
 * RAG configuration for help_search tool.
 */
export interface RagConfig {
  dataSource: string;
  indexName: string;
  similarityThreshold: number;
}

/**
 * Complete definition of an AI-managed tool.
 */
export interface AiManagedTool {
  id: string;
  name: string;
  description: string;
  category: AiToolCategory;
  status: AiToolStatus;
  allowedAgents: AgentId[];
  parameters: Record<string, AiToolParameter>;
  ragConfig?: RagConfig;
}

// -----------------------------------------------------------------------------
// AGENT SESSION TYPES
// -----------------------------------------------------------------------------

/**
 * Session state for managing agent interactions.
 */
export interface AgentSession {
  id: string;
  activeAgent: AgentId;
  agentStack: AgentId[]; // For returning after sub-agent completes
  context: Record<string, unknown>;
  createdAt: string;
  lastActivityAt: string;
}

/**
 * Result from evaluating handoff conditions.
 */
export interface HandoffEvaluation {
  shouldHandoff: boolean;
  targetAgent?: AgentId;
  triggerId?: string;
  reason?: string;
}

// -----------------------------------------------------------------------------
// ORCHESTRATOR TYPES
// -----------------------------------------------------------------------------

/**
 * Tool execution request from the orchestrator.
 */
export interface ToolExecutionRequest {
  toolId: string;
  parameters: Record<string, unknown>;
  agentId: AgentId;
}

/**
 * Tool execution result.
 */
export interface ToolExecutionResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Response from the agent orchestrator.
 */
export interface OrchestratorResponse {
  content: string;
  agentId: AgentId;
  handoff?: {
    from: AgentId;
    to: AgentId;
    reason: string;
  };
  toolCalls?: Array<{
    toolId: string;
    result: ToolExecutionResult;
  }>;
  debugInfo?: {
    systemPrompt: string;
    activeTools: string[];
    sessionState: Record<string, unknown>;
  };
}

// -----------------------------------------------------------------------------
// AI MANAGER CONFIGURATION
// -----------------------------------------------------------------------------

/**
 * Global configuration for the AI Manager system.
 */
export interface AiManagerConfig {
  defaultAgent: AgentId;
  enableHandoffs: boolean;
  maxAgentStackDepth: number;
  sessionTimeoutMinutes: number;
  debugMode: boolean;
}

// -----------------------------------------------------------------------------
// CONTEXT STATE & ACTIONS (for OnboardingContext integration)
// -----------------------------------------------------------------------------

/**
 * AI Manager state to be integrated into OnboardingContext.
 */
export interface AiManagerState {
  agents: AgentDefinition[];
  prompts: PromptTemplate[];
  tools: AiManagedTool[];
  config: AiManagerConfig;
  currentSession: AgentSession | null;
}

/**
 * AI Manager actions for OnboardingContext.
 */
export interface AiManagerActions {
  // Agent CRUD
  updateAgent: (agent: AgentDefinition) => void;
  addAgent: (agent: AgentDefinition) => void;
  deleteAgent: (agentId: AgentId) => void;

  // Prompt CRUD
  updatePrompt: (prompt: PromptTemplate) => void;
  addPrompt: (prompt: PromptTemplate) => void;
  deletePrompt: (promptId: string) => void;

  // Tool CRUD
  updateAiTool: (tool: AiManagedTool) => void;
  addAiTool: (tool: AiManagedTool) => void;
  deleteAiTool: (toolId: string) => void;

  // Config
  updateAiConfig: (config: Partial<AiManagerConfig>) => void;

  // Session management
  startAgentSession: (initialContext?: Record<string, unknown>) => AgentSession;
  endAgentSession: () => void;
  setActiveAgent: (agentId: AgentId) => void;
}

// -----------------------------------------------------------------------------
// DEFAULT VALUES
// -----------------------------------------------------------------------------

/**
 * Default AI Manager configuration.
 */
export const DEFAULT_AI_MANAGER_CONFIG: AiManagerConfig = {
  defaultAgent: 'help',
  enableHandoffs: true,
  maxAgentStackDepth: 3,
  sessionTimeoutMinutes: 30,
  debugMode: false,
};
