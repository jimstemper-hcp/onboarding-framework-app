// =============================================================================
// DEBUG CONTEXT DROPDOWN COMPONENT
// =============================================================================
// Shows the @HCP Context Manager information used to generate AI responses.
// Collapsible dropdown that displays Pro Info, Feature Context, Conversation
// State, System Prompt, Tool Calls, and Performance timing.
// Only visible when Planning Mode is enabled.
// =============================================================================

import { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Paper,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import TimerIcon from '@mui/icons-material/Timer';
import BuildIcon from '@mui/icons-material/Build';
import type { MessageDebugContext } from '../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface DebugContextDropdownProps {
  debugContext: MessageDebugContext;
}

// -----------------------------------------------------------------------------
// SECTION COMPONENTS
// -----------------------------------------------------------------------------

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {icon}
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ pl: 3.5 }}>{children}</Box>
    </Box>
  );
}

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
}

function InfoRow({ label, value }: InfoRowProps) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
        {label}:
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export function DebugContextDropdown({ debugContext }: DebugContextDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  const { pro, feature, conversationState, systemPrompt, toolCalls, timing, apiDetails } = debugContext;

  return (
    <Box sx={{ mt: 1.5, mb: 0.5 }}>
      {/* Toggle Button */}
      <Button
        size="small"
        variant="text"
        onClick={() => setIsOpen(!isOpen)}
        startIcon={<BugReportIcon sx={{ fontSize: 16 }} />}
        endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{
          textTransform: 'none',
          color: 'text.secondary',
          fontSize: '0.75rem',
          py: 0.5,
          px: 1,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        @HCP Context Manager
      </Button>

      {/* Collapsible Content */}
      <Collapse in={isOpen}>
        <Paper
          variant="outlined"
          sx={{
            mt: 1,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
            fontSize: '0.875rem',
          }}
        >
          {/* Pro Information */}
          {pro && (
            <Section icon={<PersonIcon sx={{ fontSize: 18, color: 'primary.main' }} />} title="Pro Information">
              <InfoRow label="Company" value={pro.companyName} />
              <InfoRow label="Owner" value={pro.ownerName} />
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <Chip label={pro.plan} size="small" variant="outlined" />
                <Chip label={pro.goal} size="small" variant="outlined" color="primary" />
              </Box>
            </Section>
          )}

          {/* Feature Context */}
          {feature && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Section icon={<InventoryIcon sx={{ fontSize: 18, color: 'secondary.main' }} />} title="Feature Context">
                <InfoRow label="Feature" value={feature.name} />
                <InfoRow label="Stage" value={feature.stage.replace('_', ' ')} />
                <InfoRow label="Progress" value={`${feature.completedTasks} tasks completed`} />
                <InfoRow label="Usage" value={`${feature.usageCount} times`} />
              </Section>
            </>
          )}

          {/* Conversation State */}
          {conversationState && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Section icon={<SettingsIcon sx={{ fontSize: 18, color: 'warning.main' }} />} title="Conversation State">
                <InfoRow label="Flow" value={conversationState.flowState} />
                {conversationState.currentFeature && (
                  <InfoRow label="Feature" value={conversationState.currentFeature} />
                )}
                {conversationState.currentStage && (
                  <InfoRow label="Stage" value={conversationState.currentStage} />
                )}
                {conversationState.dataChoice && (
                  <InfoRow label="Data Choice" value={conversationState.dataChoice} />
                )}
              </Section>
            </>
          )}

          {/* Tool Calls */}
          {toolCalls && toolCalls.length > 0 && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Section icon={<BuildIcon sx={{ fontSize: 18, color: 'info.main' }} />} title="Tool Calls">
                {toolCalls.map((tool, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Chip
                      label={tool.name}
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{ mb: 0.5 }}
                    />
                    {tool.parameters && (
                      <Typography
                        variant="caption"
                        component="pre"
                        sx={{
                          display: 'block',
                          bgcolor: 'grey.100',
                          p: 0.5,
                          borderRadius: 0.5,
                          overflow: 'auto',
                          fontSize: '0.7rem',
                        }}
                      >
                        {JSON.stringify(tool.parameters, null, 2)}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Section>
            </>
          )}

          {/* System Prompt */}
          {systemPrompt && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Section icon={<DescriptionIcon sx={{ fontSize: 18, color: 'success.main' }} />} title="System Prompt">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip label={systemPrompt.mode} size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {systemPrompt.promptLength.toLocaleString()} chars
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setShowFullPrompt(!showFullPrompt)}
                  sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                >
                  {showFullPrompt ? 'Hide full prompt' : 'Show full prompt'}
                </Button>
                <Collapse in={showFullPrompt}>
                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 1,
                      p: 1.5,
                      maxHeight: 300,
                      overflow: 'auto',
                      bgcolor: 'grey.100',
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="pre"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontFamily: 'monospace',
                        fontSize: '0.7rem',
                        m: 0,
                      }}
                    >
                      {systemPrompt.fullPrompt}
                    </Typography>
                  </Paper>
                </Collapse>
              </Section>
            </>
          )}

          {/* Performance / Timing */}
          {(timing || apiDetails) && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Section icon={<TimerIcon sx={{ fontSize: 18, color: 'error.main' }} />} title="Performance">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {timing && (
                    <Chip
                      label={`${timing.durationMs}ms`}
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  )}
                  {apiDetails && (
                    <Chip
                      label={apiDetails.isMockMode ? 'Mock Mode' : apiDetails.model}
                      size="small"
                      variant="outlined"
                      color={apiDetails.isMockMode ? 'warning' : 'success'}
                    />
                  )}
                  {apiDetails?.inputTokens !== undefined && (
                    <Chip
                      label={`${apiDetails.inputTokens} in`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {apiDetails?.outputTokens !== undefined && (
                    <Chip
                      label={`${apiDetails.outputTokens} out`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Section>
            </>
          )}
        </Paper>
      </Collapse>
    </Box>
  );
}

export default DebugContextDropdown;
