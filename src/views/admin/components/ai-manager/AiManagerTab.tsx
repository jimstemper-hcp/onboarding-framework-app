// =============================================================================
// AI MANAGER TAB
// =============================================================================
// Admin interface for managing AI agents, prompts, and tools.
// =============================================================================

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { PlanningAwareDialog } from '../../../../components/common/PlanningAwareDialog';
import type {
  AgentDefinition,
  AgentId,
  AgentStatus,
  AiManagedTool,
  AiToolCategory,
  AiToolStatus,
  AiManagerConfig,
} from '../../../../types';

// =============================================================================
// PALETTE & CONFIG
// =============================================================================

const palette = {
  primary: '#0062FF',
  secondary: '#7C3AED',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  grey: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    600: '#475569',
    800: '#1E293B',
  },
};

const agentStatusOptions: { value: AgentStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: palette.success },
  { value: 'inactive', label: 'Inactive', color: palette.grey[600] },
  { value: 'draft', label: 'Draft', color: palette.warning },
];

const toolStatusOptions: { value: AiToolStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: palette.success },
  { value: 'inactive', label: 'Inactive', color: palette.grey[600] },
];

const toolCategoryOptions: { value: AiToolCategory; label: string }[] = [
  { value: 'help', label: 'Help' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'object', label: 'Object' },
];

// =============================================================================
// API HELPERS
// =============================================================================

const API_BASE = 'http://localhost:3001/api/admin/ai-manager';

async function fetchAgents(): Promise<AgentDefinition[]> {
  const res = await fetch(`${API_BASE}/agents`);
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
}

async function fetchTools(): Promise<AiManagedTool[]> {
  const res = await fetch(`${API_BASE}/tools`);
  if (!res.ok) throw new Error('Failed to fetch tools');
  return res.json();
}

async function fetchConfig(): Promise<AiManagerConfig> {
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok) throw new Error('Failed to fetch config');
  return res.json();
}

async function saveAgent(agent: AgentDefinition): Promise<void> {
  const res = await fetch(`${API_BASE}/agents/${agent.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agent),
  });
  if (!res.ok) throw new Error('Failed to save agent');
}

async function saveTool(tool: AiManagedTool): Promise<void> {
  const res = await fetch(`${API_BASE}/tools/${tool.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tool),
  });
  if (!res.ok) throw new Error('Failed to save tool');
}

async function saveConfig(config: Partial<AiManagerConfig>): Promise<void> {
  const res = await fetch(`${API_BASE}/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error('Failed to save config');
}

// Note: reloadConfig can be used to reload from YAML files when needed
// async function reloadConfig(): Promise<void> {
//   const res = await fetch(`${API_BASE}/reload`, { method: 'POST' });
//   if (!res.ok) throw new Error('Failed to reload config');
// }

// =============================================================================
// AGENTS TABLE
// =============================================================================

interface AgentsTableProps {
  agents: AgentDefinition[];
  onEdit: (agent: AgentDefinition) => void;
  onRefresh: () => void;
}

function AgentsTable({ agents, onEdit, onRefresh }: AgentsTableProps) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          AI Agents ({agents.length})
        </Typography>
        <Button startIcon={<RefreshIcon />} size="small" onClick={onRefresh}>
          Refresh
        </Button>
      </Stack>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Agent</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tools</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Handoffs</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, width: 80 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agents.map((agent) => {
              const statusOption = agentStatusOptions.find(s => s.value === agent.status);
              return (
                <TableRow key={agent.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {agent.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {agent.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusOption?.label || agent.status}
                      size="small"
                      sx={{
                        bgcolor: alpha(statusOption?.color || palette.grey[600], 0.1),
                        color: statusOption?.color || palette.grey[600],
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {agent.toolIds.length} tools
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {agent.handoffConfig?.canHandoffTo.length || 0} targets
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => onEdit(agent)} title="Edit agent">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// =============================================================================
// AGENT EDITOR DIALOG
// =============================================================================

interface AgentEditorProps {
  agent: AgentDefinition | null;
  open: boolean;
  onClose: () => void;
  onSave: (agent: AgentDefinition) => void;
  allTools: AiManagedTool[];
  allAgents: AgentDefinition[];
}

function AgentEditor({ agent, open, onClose, onSave, allTools, allAgents }: AgentEditorProps) {
  const [editedAgent, setEditedAgent] = useState<AgentDefinition | null>(null);

  useEffect(() => {
    setEditedAgent(agent ? { ...agent } : null);
  }, [agent]);

  if (!editedAgent) return null;

  const handleSave = () => {
    onSave(editedAgent);
    onClose();
  };

  return (
    <PlanningAwareDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Agent: {editedAgent.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Basic Info */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Name"
              value={editedAgent.name}
              onChange={(e) => setEditedAgent({ ...editedAgent, name: e.target.value })}
              fullWidth
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={editedAgent.status}
                onChange={(e) => setEditedAgent({ ...editedAgent, status: e.target.value as AgentStatus })}
              >
                {agentStatusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Description */}
          <TextField
            label="Description"
            value={editedAgent.description}
            onChange={(e) => setEditedAgent({ ...editedAgent, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />

          {/* System Prompt */}
          <TextField
            label="System Prompt"
            value={editedAgent.systemPrompt}
            onChange={(e) => setEditedAgent({ ...editedAgent, systemPrompt: e.target.value })}
            fullWidth
            multiline
            rows={8}
            placeholder="Enter the system prompt for this agent..."
          />

          {/* Tools */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Available Tools ({editedAgent.toolIds.length})
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {allTools.map((tool) => {
                const isSelected = editedAgent.toolIds.includes(tool.id);
                return (
                  <Chip
                    key={tool.id}
                    label={tool.name}
                    size="small"
                    variant={isSelected ? 'filled' : 'outlined'}
                    color={isSelected ? 'primary' : 'default'}
                    onClick={() => {
                      const newToolIds = isSelected
                        ? editedAgent.toolIds.filter((t) => t !== tool.id)
                        : [...editedAgent.toolIds, tool.id];
                      setEditedAgent({ ...editedAgent, toolIds: newToolIds });
                    }}
                    sx={{ cursor: 'pointer' }}
                  />
                );
              })}
            </Stack>
          </Box>

          {/* Handoff Targets */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Can Hand Off To ({editedAgent.handoffConfig?.canHandoffTo.length || 0})
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {allAgents.filter(a => a.id !== editedAgent.id).map((a) => {
                const isSelected = editedAgent.handoffConfig?.canHandoffTo.includes(a.id) || false;
                return (
                  <Chip
                    key={a.id}
                    label={a.name}
                    size="small"
                    variant={isSelected ? 'filled' : 'outlined'}
                    color={isSelected ? 'secondary' : 'default'}
                    onClick={() => {
                      const currentTargets = editedAgent.handoffConfig?.canHandoffTo || [];
                      const newTargets = isSelected
                        ? currentTargets.filter((t) => t !== a.id)
                        : [...currentTargets, a.id];
                      setEditedAgent({
                        ...editedAgent,
                        handoffConfig: {
                          ...editedAgent.handoffConfig,
                          canHandoffTo: newTargets as AgentId[],
                          triggers: editedAgent.handoffConfig?.triggers || [],
                        },
                      });
                    }}
                    sx={{ cursor: 'pointer' }}
                  />
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
    </PlanningAwareDialog>
  );
}

// =============================================================================
// TOOLS TABLE
// =============================================================================

interface ToolsTableProps {
  tools: AiManagedTool[];
  onEdit: (tool: AiManagedTool) => void;
  onRefresh: () => void;
}

function ToolsTable({ tools, onEdit, onRefresh }: ToolsTableProps) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          AI Tools ({tools.length})
        </Typography>
        <Button startIcon={<RefreshIcon />} size="small" onClick={onRefresh}>
          Refresh
        </Button>
      </Stack>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Tool</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Allowed Agents</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, width: 80 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tools.map((tool) => {
              const statusOption = toolStatusOptions.find(s => s.value === tool.status);
              const categoryOption = toolCategoryOptions.find(c => c.value === tool.category);
              return (
                <TableRow key={tool.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {tool.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tool.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={categoryOption?.label || tool.category}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusOption?.label || tool.status}
                      size="small"
                      sx={{
                        bgcolor: alpha(statusOption?.color || palette.grey[600], 0.1),
                        color: statusOption?.color || palette.grey[600],
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {tool.allowedAgents.length} agents
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => onEdit(tool)} title="Edit tool">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// =============================================================================
// TOOL EDITOR DIALOG
// =============================================================================

interface ToolEditorProps {
  tool: AiManagedTool | null;
  open: boolean;
  onClose: () => void;
  onSave: (tool: AiManagedTool) => void;
  allAgents: AgentDefinition[];
}

function ToolEditor({ tool, open, onClose, onSave, allAgents }: ToolEditorProps) {
  const [editedTool, setEditedTool] = useState<AiManagedTool | null>(null);

  useEffect(() => {
    setEditedTool(tool ? { ...tool } : null);
  }, [tool]);

  if (!editedTool) return null;

  const handleSave = () => {
    onSave(editedTool);
    onClose();
  };

  return (
    <PlanningAwareDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Tool: {editedTool.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Basic Info */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Name"
              value={editedTool.name}
              onChange={(e) => setEditedTool({ ...editedTool, name: e.target.value })}
              fullWidth
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={editedTool.category}
                onChange={(e) => setEditedTool({ ...editedTool, category: e.target.value as AiToolCategory })}
              >
                {toolCategoryOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={editedTool.status}
                onChange={(e) => setEditedTool({ ...editedTool, status: e.target.value as AiToolStatus })}
              >
                {toolStatusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Description */}
          <TextField
            label="Description"
            value={editedTool.description}
            onChange={(e) => setEditedTool({ ...editedTool, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />

          {/* Allowed Agents */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Allowed Agents ({editedTool.allowedAgents.length})
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {allAgents.map((agent) => {
                const isSelected = editedTool.allowedAgents.includes(agent.id);
                return (
                  <Chip
                    key={agent.id}
                    label={agent.name}
                    size="small"
                    variant={isSelected ? 'filled' : 'outlined'}
                    color={isSelected ? 'primary' : 'default'}
                    onClick={() => {
                      const newAgents = isSelected
                        ? editedTool.allowedAgents.filter((a) => a !== agent.id)
                        : [...editedTool.allowedAgents, agent.id];
                      setEditedTool({ ...editedTool, allowedAgents: newAgents as AgentId[] });
                    }}
                    sx={{ cursor: 'pointer' }}
                  />
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
    </PlanningAwareDialog>
  );
}

// =============================================================================
// CONFIG PANEL
// =============================================================================

interface ConfigPanelProps {
  config: AiManagerConfig | null;
  onSave: (config: Partial<AiManagerConfig>) => void;
  agents: AgentDefinition[];
}

function ConfigPanel({ config, onSave, agents }: ConfigPanelProps) {
  const [editedConfig, setEditedConfig] = useState<AiManagerConfig | null>(null);

  useEffect(() => {
    setEditedConfig(config ? { ...config } : null);
  }, [config]);

  if (!editedConfig) return null;

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Configuration
      </Typography>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Default Agent */}
          <FormControl fullWidth>
            <InputLabel>Default Agent</InputLabel>
            <Select
              label="Default Agent"
              value={editedConfig.defaultAgent}
              onChange={(e) => setEditedConfig({ ...editedConfig, defaultAgent: e.target.value as AgentId })}
            >
              {agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Toggles */}
          <FormControlLabel
            control={
              <Switch
                checked={editedConfig.enableHandoffs}
                onChange={(e) => setEditedConfig({ ...editedConfig, enableHandoffs: e.target.checked })}
              />
            }
            label="Enable Agent Handoffs"
          />

          <FormControlLabel
            control={
              <Switch
                checked={editedConfig.debugMode}
                onChange={(e) => setEditedConfig({ ...editedConfig, debugMode: e.target.checked })}
              />
            }
            label="Debug Mode"
          />

          {/* Numbers */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Max Agent Stack Depth"
              type="number"
              value={editedConfig.maxAgentStackDepth}
              onChange={(e) => setEditedConfig({ ...editedConfig, maxAgentStackDepth: parseInt(e.target.value) || 3 })}
              fullWidth
            />
            <TextField
              label="Session Timeout (minutes)"
              type="number"
              value={editedConfig.sessionTimeoutMinutes}
              onChange={(e) => setEditedConfig({ ...editedConfig, sessionTimeoutMinutes: parseInt(e.target.value) || 30 })}
              fullWidth
            />
          </Stack>

          <Button variant="contained" onClick={() => onSave(editedConfig)}>
            Save Configuration
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

// =============================================================================
// MAIN AI MANAGER TAB
// =============================================================================

export function AiManagerTab() {
  const [tabIndex, setTabIndex] = useState(0);
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [tools, setTools] = useState<AiManagedTool[]>([]);
  const [config, setConfig] = useState<AiManagerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit dialogs
  const [editingAgent, setEditingAgent] = useState<AgentDefinition | null>(null);
  const [editingTool, setEditingTool] = useState<AiManagedTool | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [agentsData, toolsData, configData] = await Promise.all([
        fetchAgents(),
        fetchTools(),
        fetchConfig(),
      ]);
      setAgents(agentsData);
      setTools(toolsData);
      setConfig(configData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load AI Manager data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAgent = async (agent: AgentDefinition) => {
    try {
      await saveAgent(agent);
      setAgents(agents.map(a => a.id === agent.id ? agent : a));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save agent');
    }
  };

  const handleSaveTool = async (tool: AiManagedTool) => {
    try {
      await saveTool(tool);
      setTools(tools.map(t => t.id === tool.id ? tool : t));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tool');
    }
  };

  const handleSaveConfig = async (newConfig: Partial<AiManagerConfig>) => {
    try {
      await saveConfig(newConfig);
      setConfig(newConfig as AiManagerConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save config');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading AI Manager...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, bgcolor: alpha(palette.error, 0.1), border: 1, borderColor: palette.error }}>
          <Typography color="error" fontWeight={500}>
            {error}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Make sure the backend server is running on port 3001.
          </Typography>
          <Button onClick={loadData} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          AI Manager
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure AI agents, prompts, and tools for the chat assistant.
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper variant="outlined" sx={{ mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Agents (${agents.length})`} />
          <Tab label={`Tools (${tools.length})`} />
          <Tab label="Configuration" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {tabIndex === 0 && (
          <AgentsTable
            agents={agents}
            onEdit={setEditingAgent}
            onRefresh={loadData}
          />
        )}
        {tabIndex === 1 && (
          <ToolsTable
            tools={tools}
            onEdit={setEditingTool}
            onRefresh={loadData}
          />
        )}
        {tabIndex === 2 && (
          <ConfigPanel
            config={config}
            onSave={handleSaveConfig}
            agents={agents}
          />
        )}
      </Box>

      {/* Agent Editor Dialog */}
      <AgentEditor
        agent={editingAgent}
        open={editingAgent !== null}
        onClose={() => setEditingAgent(null)}
        onSave={handleSaveAgent}
        allTools={tools}
        allAgents={agents}
      />

      {/* Tool Editor Dialog */}
      <ToolEditor
        tool={editingTool}
        open={editingTool !== null}
        onClose={() => setEditingTool(null)}
        onSave={handleSaveTool}
        allAgents={agents}
      />
    </Box>
  );
}

export default AiManagerTab;
