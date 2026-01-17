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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  Stack,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import LinkIcon from '@mui/icons-material/Link';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import BuildIcon from '@mui/icons-material/Build';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import WebIcon from '@mui/icons-material/Web';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import { useOnboarding } from '../../context';
import type {
  Feature,
  AdoptionStage,
  OnboardingTask,
  Resource,
  CalendlyLink,
  McpTool,
  Video,
  ProductPage,
} from '../../types';

// Palette for consistent styling
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

// Stage configuration
const stageConfig: Record<AdoptionStage, { label: string; color: string }> = {
  not_attached: { label: 'Not Attached', color: palette.grey[600] },
  attached: { label: 'Attached', color: palette.warning },
  activated: { label: 'Activated', color: palette.primary },
  engaged: { label: 'Engaged', color: palette.success },
};

const stageKeys: AdoptionStage[] = ['not_attached', 'attached', 'activated', 'engaged'];

// Section header component
function SectionHeader({ icon, title, count }: { icon: React.ReactNode; title: string; count?: number }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
      <Box sx={{ color: palette.primary }}>{icon}</Box>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      {count !== undefined && (
        <Chip label={count} size="small" sx={{ height: 20, fontSize: '0.75rem' }} />
      )}
    </Stack>
  );
}

// Editable string list component
function EditableStringList({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button variant="outlined" size="small" onClick={handleAdd}>
          Add
        </Button>
      </Stack>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {items.map((item, index) => (
          <Chip
            key={index}
            label={item}
            size="small"
            onDelete={() => handleRemove(index)}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Box>
    </Box>
  );
}

// Task editor component
function TaskEditor({
  tasks,
  onChange,
}: {
  tasks: OnboardingTask[];
  onChange: (tasks: OnboardingTask[]) => void;
}) {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleTaskChange = (index: number, field: keyof OnboardingTask, value: string | number) => {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddTask = () => {
    const newTask: OnboardingTask = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      description: '',
      estimatedMinutes: 5,
      actionUrl: '',
      completionEvent: '',
    };
    onChange([...tasks, newTask]);
    setExpanded(newTask.id);
  };

  const handleRemoveTask = (index: number) => {
    onChange(tasks.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {tasks.map((task, index) => (
        <Accordion
          key={task.id}
          expanded={expanded === task.id}
          onChange={(_, isExpanded) => setExpanded(isExpanded ? task.id : false)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1, mr: 2 }}>
              <Typography variant="body2" fontWeight={500}>
                {task.title}
              </Typography>
              <Chip label={`${task.estimatedMinutes} min`} size="small" />
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label="Title"
                size="small"
                fullWidth
                value={task.title}
                onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
              />
              <TextField
                label="Description"
                size="small"
                fullWidth
                multiline
                rows={2}
                value={task.description}
                onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Est. Minutes"
                  size="small"
                  type="number"
                  value={task.estimatedMinutes}
                  onChange={(e) => handleTaskChange(index, 'estimatedMinutes', parseInt(e.target.value) || 0)}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="Action URL"
                  size="small"
                  fullWidth
                  value={task.actionUrl}
                  onChange={(e) => handleTaskChange(index, 'actionUrl', e.target.value)}
                />
              </Stack>
              <TextField
                label="Completion Event"
                size="small"
                fullWidth
                value={task.completionEvent}
                onChange={(e) => handleTaskChange(index, 'completionEvent', e.target.value)}
                helperText="Event name that triggers task completion"
              />
              <Button
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleRemoveTask(index)}
              >
                Remove Task
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
      <Button startIcon={<AddIcon />} onClick={handleAddTask} sx={{ mt: 1 }}>
        Add Task
      </Button>
    </Box>
  );
}

// Resource editor component
function ResourceEditor({
  resources,
  onChange,
}: {
  resources: Resource[];
  onChange: (resources: Resource[]) => void;
}) {
  const handleResourceChange = (index: number, field: keyof Resource, value: string) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddResource = () => {
    onChange([...resources, { title: '', url: '', type: 'article' }]);
  };

  const handleRemoveResource = (index: number) => {
    onChange(resources.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <List dense>
        {resources.map((resource, index) => (
          <ListItem key={index} sx={{ px: 0 }}>
            <Stack direction="row" spacing={1} sx={{ flex: 1 }} alignItems="center">
              <TextField
                size="small"
                placeholder="Title"
                value={resource.title}
                onChange={(e) => handleResourceChange(index, 'title', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                placeholder="URL"
                value={resource.url}
                onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                sx={{ flex: 2 }}
              />
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={resource.type}
                  onChange={(e) => handleResourceChange(index, 'type', e.target.value)}
                >
                  <MenuItem value="article">Article</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="guide">Guide</MenuItem>
                  <MenuItem value="help-center">Help Center</MenuItem>
                </Select>
              </FormControl>
              <IconButton size="small" onClick={() => handleRemoveResource(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </ListItem>
        ))}
      </List>
      <Button startIcon={<AddIcon />} size="small" onClick={handleAddResource}>
        Add Resource
      </Button>
    </Box>
  );
}

// Calendly editor component
function CalendlyEditor({
  links,
  onChange,
}: {
  links: CalendlyLink[];
  onChange: (links: CalendlyLink[]) => void;
}) {
  const handleLinkChange = (index: number, field: keyof CalendlyLink, value: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddLink = () => {
    onChange([...links, { name: '', url: '', team: 'onboarding', description: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {links.map((link, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                label="Name"
                value={link.name}
                onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                sx={{ flex: 1 }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Team</InputLabel>
                <Select
                  label="Team"
                  value={link.team}
                  onChange={(e) => handleLinkChange(index, 'team', e.target.value)}
                >
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="onboarding">Onboarding</MenuItem>
                  <MenuItem value="support">Support</MenuItem>
                </Select>
              </FormControl>
              <IconButton size="small" onClick={() => handleRemoveLink(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
            <TextField
              size="small"
              label="URL"
              fullWidth
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
            />
            <TextField
              size="small"
              label="Description"
              fullWidth
              value={link.description}
              onChange={(e) => handleLinkChange(index, 'description', e.target.value)}
            />
          </Stack>
        </Paper>
      ))}
      <Button startIcon={<AddIcon />} size="small" onClick={handleAddLink}>
        Add Calendly Link
      </Button>
    </Box>
  );
}

// MCP Tool editor component
function ToolEditor({
  tools,
  onChange,
}: {
  tools: McpTool[];
  onChange: (tools: McpTool[]) => void;
}) {
  const handleToolChange = (index: number, field: keyof McpTool, value: string | object) => {
    const updated = [...tools];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddTool = () => {
    onChange([...tools, { name: '', description: '', parameters: {} }]);
  };

  const handleRemoveTool = (index: number) => {
    onChange(tools.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {tools.map((tool, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <TextField
                size="small"
                label="Tool Name"
                value={tool.name}
                onChange={(e) => handleToolChange(index, 'name', e.target.value)}
                sx={{ flex: 1 }}
              />
              <IconButton size="small" onClick={() => handleRemoveTool(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
            <TextField
              size="small"
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={tool.description}
              onChange={(e) => handleToolChange(index, 'description', e.target.value)}
            />
            <TextField
              size="small"
              label="Parameters (JSON)"
              fullWidth
              multiline
              rows={3}
              value={JSON.stringify(tool.parameters, null, 2)}
              onChange={(e) => {
                try {
                  handleToolChange(index, 'parameters', JSON.parse(e.target.value));
                } catch {
                  // Invalid JSON, don't update
                }
              }}
              helperText="JSON object defining tool parameters"
            />
          </Stack>
        </Paper>
      ))}
      <Button startIcon={<AddIcon />} size="small" onClick={handleAddTool}>
        Add MCP Tool
      </Button>
    </Box>
  );
}

// Video editor component
function VideoEditor({
  videos,
  onChange,
}: {
  videos: Video[];
  onChange: (videos: Video[]) => void;
}) {
  const handleVideoChange = (index: number, field: keyof Video, value: string | number) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddVideo = () => {
    onChange([...videos, { title: '', url: '', durationSeconds: 0 }]);
  };

  const handleRemoveVideo = (index: number) => {
    onChange(videos.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <List dense>
        {videos.map((video, index) => (
          <ListItem key={index} sx={{ px: 0 }}>
            <Stack direction="row" spacing={1} sx={{ flex: 1 }} alignItems="center">
              <TextField
                size="small"
                placeholder="Title"
                value={video.title}
                onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                placeholder="URL"
                value={video.url}
                onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                sx={{ flex: 2 }}
              />
              <TextField
                size="small"
                placeholder="Seconds"
                type="number"
                value={video.durationSeconds}
                onChange={(e) => handleVideoChange(index, 'durationSeconds', parseInt(e.target.value) || 0)}
                sx={{ width: 100 }}
              />
              <IconButton size="small" onClick={() => handleRemoveVideo(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </ListItem>
        ))}
      </List>
      <Button startIcon={<AddIcon />} size="small" onClick={handleAddVideo}>
        Add Video
      </Button>
    </Box>
  );
}

// Product page editor component
function ProductPageEditor({
  pages,
  onChange,
}: {
  pages: ProductPage[];
  onChange: (pages: ProductPage[]) => void;
}) {
  const handlePageChange = (index: number, field: keyof ProductPage, value: string) => {
    const updated = [...pages];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddPage = () => {
    onChange([...pages, { name: '', path: '', description: '' }]);
  };

  const handleRemovePage = (index: number) => {
    onChange(pages.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <List dense>
        {pages.map((page, index) => (
          <ListItem key={index} sx={{ px: 0 }}>
            <Stack direction="row" spacing={1} sx={{ flex: 1 }} alignItems="center">
              <TextField
                size="small"
                placeholder="Page Name"
                value={page.name}
                onChange={(e) => handlePageChange(index, 'name', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                placeholder="Path"
                value={page.path}
                onChange={(e) => handlePageChange(index, 'path', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                placeholder="Description"
                value={page.description}
                onChange={(e) => handlePageChange(index, 'description', e.target.value)}
                sx={{ flex: 2 }}
              />
              <IconButton size="small" onClick={() => handleRemovePage(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </ListItem>
        ))}
      </List>
      <Button startIcon={<AddIcon />} size="small" onClick={handleAddPage}>
        Add Product Page
      </Button>
    </Box>
  );
}

// Stage conditions section component
function StageConditionsSection({
  conditions,
  onChange,
}: {
  conditions: string[];
  onChange: (conditions: string[]) => void;
}) {
  return (
    <Box>
      <SectionHeader icon={<FlagRoundedIcon />} title="Stage Conditions" count={conditions.length} />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Conditions that must be true for a pro to be in this stage.
      </Typography>
      <EditableStringList
        items={conditions}
        onChange={onChange}
        placeholder="Add a condition..."
      />
    </Box>
  );
}

// Stage editor for Not Attached
function NotAttachedEditor({
  feature,
  onChange,
}: {
  feature: Feature;
  onChange: (feature: Feature) => void;
}) {
  const context = feature.stages.notAttached;

  const updateContext = (updates: Partial<typeof context>) => {
    onChange({
      ...feature,
      stages: {
        ...feature.stages,
        notAttached: { ...context, ...updates },
      },
    });
  };

  return (
    <Stack spacing={3}>
      <StageConditionsSection
        conditions={context.conditions}
        onChange={(conditions) => updateContext({ conditions })}
      />

      <Divider />

      <Box>
        <SectionHeader icon={<TipsAndUpdatesIcon />} title="Value Proposition" />
        <TextField
          fullWidth
          multiline
          rows={3}
          value={context.valueProp}
          onChange={(e) => updateContext({ valueProp: e.target.value })}
          placeholder="Why should the pro get this feature?"
        />
      </Box>

      <Divider />

      <Box>
        <SectionHeader icon={<LinkIcon />} title="Sell Page" />
        <TextField
          fullWidth
          size="small"
          label="Sell Page URL"
          value={context.sellPageUrl}
          onChange={(e) => updateContext({ sellPageUrl: e.target.value })}
        />
      </Box>

      <Divider />

      <Box>
        <SectionHeader icon={<LinkIcon />} title="Learn More Resources" count={context.learnMoreResources.length} />
        <ResourceEditor
          resources={context.learnMoreResources}
          onChange={(resources) => updateContext({ learnMoreResources: resources })}
        />
      </Box>

      <Divider />

      <Box>
        <SectionHeader icon={<CalendarMonthIcon />} title="Calendly Links" count={context.calendlyTypes.length} />
        <CalendlyEditor
          links={context.calendlyTypes}
          onChange={(links) => updateContext({ calendlyTypes: links })}
        />
      </Box>

      <Divider />

      <Box>
        <SectionHeader icon={<BuildIcon />} title="Upgrade Tools (MCP)" count={context.upgradeTools.length} />
        <ToolEditor
          tools={context.upgradeTools}
          onChange={(tools) => updateContext({ upgradeTools: tools })}
        />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Upgrade Prompt (for AI)
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={context.upgradePrompt}
          onChange={(e) => updateContext({ upgradePrompt: e.target.value })}
          placeholder="AI prompt for helping user upgrade to get this feature"
        />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Rep Talking Points
        </Typography>
        <EditableStringList
          items={context.repTalkingPoints}
          onChange={(points) => updateContext({ repTalkingPoints: points })}
          placeholder="Add a talking point..."
        />
      </Box>
    </Stack>
  );
}

// Stage editor for Attached
function AttachedEditor({
  feature,
  onChange,
}: {
  feature: Feature;
  onChange: (feature: Feature) => void;
}) {
  const context = feature.stages.attached;

  const updateContext = (updates: Partial<typeof context>) => {
    onChange({
      ...feature,
      stages: {
        ...feature.stages,
        attached: { ...context, ...updates },
      },
    });
  };

  return (
    <Stack spacing={3}>
      <StageConditionsSection
        conditions={context.conditions}
        onChange={(conditions) => updateContext({ conditions })}
      />

      <Divider />

      <Box>
        <SectionHeader icon={<TaskAltIcon />} title="Required Tasks" count={context.requiredTasks.length} />
        <TaskEditor
          tasks={context.requiredTasks}
          onChange={(tasks) => updateContext({ requiredTasks: tasks })}
        />
      </Box>

      <Divider />

      <Box>
        <SectionHeader icon={<WebIcon />} title="Product Pages" count={context.productPages.length} />
        <ProductPageEditor
          pages={context.productPages}
          onChange={(pages) => updateContext({ productPages: pages })}
        />
      </Box>

      <Divider />

      <Box>
        <SectionHeader icon={<VideoLibraryIcon />} title="Tutorial Videos" count={context.videos.length} />
        <VideoEditor
          videos={context.videos}
          onChange={(videos) => updateContext({ videos: videos })}
        />
      </Box>

      <Divider />

      <Box>
        <SectionHeader icon={<CalendarMonthIcon />} title="Calendly Links" count={context.calendlyTypes.length} />
        <CalendlyEditor
          links={context.calendlyTypes}
          onChange={(links) => updateContext({ calendlyTypes: links })}
        />
      </Box>

      <Divider />

      <Box>
        <SectionHeader icon={<BuildIcon />} title="MCP Tools" count={context.mcpTools.length} />
        <ToolEditor
          tools={context.mcpTools}
          onChange={(tools) => updateContext({ mcpTools: tools })}
        />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Agentic Prompt (for AI)
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={context.agenticPrompt}
          onChange={(e) => updateContext({ agenticPrompt: e.target.value })}
          placeholder="AI prompt for guiding user through setup tasks"
        />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Rep Talking Points
        </Typography>
        <EditableStringList
          items={context.repTalkingPoints}
          onChange={(points) => updateContext({ repTalkingPoints: points })}
          placeholder="Add a talking point..."
        />
      </Box>
    </Stack>
  );
}

// Stage editor for Activated
function ActivatedEditor({
  feature,
  onChange,
}: {
  feature: Feature;
  onChange: (feature: Feature) => void;
}) {
  const context = feature.stages.activated;

  const updateContext = (updates: Partial<typeof context>) => {
    onChange({
      ...feature,
      stages: {
        ...feature.stages,
        activated: { ...context, ...updates },
      },
    });
  };

  return (
    <Stack spacing={3}>
      <StageConditionsSection
        conditions={context.conditions}
        onChange={(conditions) => updateContext({ conditions })}
      />

      <Divider />

      <Box>
        <SectionHeader icon={<TaskAltIcon />} title="Optional Tasks" count={context.optionalTasks.length} />
        <TaskEditor
          tasks={context.optionalTasks}
          onChange={(tasks) => updateContext({ optionalTasks: tasks })}
        />
      </Box>

      <Divider />

      <Box>
        <SectionHeader icon={<WebIcon />} title="Product Pages" count={context.productPages.length} />
        <ProductPageEditor
          pages={context.productPages}
          onChange={(pages) => updateContext({ productPages: pages })}
        />
      </Box>

      <Divider />

      <Box>
        <SectionHeader icon={<CalendarMonthIcon />} title="Calendly Links" count={context.calendlyTypes.length} />
        <CalendlyEditor
          links={context.calendlyTypes}
          onChange={(links) => updateContext({ calendlyTypes: links })}
        />
      </Box>

      <Divider />

      <Box>
        <SectionHeader icon={<BuildIcon />} title="MCP Tools" count={context.mcpTools.length} />
        <ToolEditor
          tools={context.mcpTools}
          onChange={(tools) => updateContext({ mcpTools: tools })}
        />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Engagement Prompt (for AI)
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={context.engagementPrompt}
          onChange={(e) => updateContext({ engagementPrompt: e.target.value })}
          placeholder="AI prompt for encouraging first use"
        />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Rep Talking Points
        </Typography>
        <EditableStringList
          items={context.repTalkingPoints}
          onChange={(points) => updateContext({ repTalkingPoints: points })}
          placeholder="Add a talking point..."
        />
      </Box>
    </Stack>
  );
}

// Stage editor for Engaged
function EngagedEditor({
  feature,
  onChange,
}: {
  feature: Feature;
  onChange: (feature: Feature) => void;
}) {
  const context = feature.stages.engaged;

  const updateContext = (updates: Partial<typeof context>) => {
    onChange({
      ...feature,
      stages: {
        ...feature.stages,
        engaged: { ...context, ...updates },
      },
    });
  };

  return (
    <Stack spacing={3}>
      <StageConditionsSection
        conditions={context.conditions}
        onChange={(conditions) => updateContext({ conditions })}
      />

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Advanced Tips
        </Typography>
        <EditableStringList
          items={context.advancedTips}
          onChange={(tips) => updateContext({ advancedTips: tips })}
          placeholder="Add an advanced tip..."
        />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Success Metrics
        </Typography>
        <EditableStringList
          items={context.successMetrics}
          onChange={(metrics) => updateContext({ successMetrics: metrics })}
          placeholder="Add a success metric..."
        />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Upsell Opportunities
        </Typography>
        <EditableStringList
          items={context.upsellOpportunities}
          onChange={(opportunities) => updateContext({ upsellOpportunities: opportunities })}
          placeholder="Add an upsell opportunity..."
        />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Rep Talking Points
        </Typography>
        <EditableStringList
          items={context.repTalkingPoints}
          onChange={(points) => updateContext({ repTalkingPoints: points })}
          placeholder="Add a talking point..."
        />
      </Box>
    </Stack>
  );
}

// Feature editor modal
function FeatureEditorModal({
  feature,
  open,
  onClose,
  onSave,
}: {
  feature: Feature | null;
  open: boolean;
  onClose: () => void;
  onSave: (feature: Feature) => void;
}) {
  const [editedFeature, setEditedFeature] = useState<Feature | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Update local state when feature prop changes
  useEffect(() => {
    setEditedFeature(feature ? { ...feature } : null);
    setActiveTab(0);
  }, [feature]);

  if (!editedFeature) return null;

  const handleSave = () => {
    if (editedFeature) {
      onSave(editedFeature);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">Edit Feature: {editedFeature.name}</Typography>
          <Chip
            label={editedFeature.id}
            size="small"
            sx={{ bgcolor: alpha(palette.primary, 0.1), color: palette.primary }}
          />
        </Stack>
      </DialogTitle>

      {/* Feature metadata - above tabs */}
      <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            label="Feature Name"
            value={editedFeature.name}
            onChange={(e) =>
              setEditedFeature({ ...editedFeature, name: e.target.value })
            }
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Version"
            value={editedFeature.version}
            onChange={(e) =>
              setEditedFeature({ ...editedFeature, version: e.target.value })
            }
            placeholder="1.0.0"
            sx={{ width: 120 }}
            inputProps={{ style: { fontFamily: 'monospace' } }}
          />
          <TextField
            size="small"
            label="Icon"
            value={editedFeature.icon}
            onChange={(e) =>
              setEditedFeature({ ...editedFeature, icon: e.target.value })
            }
            sx={{ width: 150 }}
          />
        </Stack>
        <TextField
          size="small"
          label="Description"
          fullWidth
          multiline
          rows={2}
          value={editedFeature.description}
          onChange={(e) =>
            setEditedFeature({ ...editedFeature, description: e.target.value })
          }
          sx={{ mt: 2 }}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          {stageKeys.map((stage) => (
            <Tab
              key={stage}
              label={stageConfig[stage].label}
              sx={{
                '&.Mui-selected': {
                  color: stageConfig[stage].color,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: palette.grey[50] }}>
        {/* Stage-specific editor */}
        <Paper sx={{ p: 3 }}>
          {activeTab === 0 && (
            <NotAttachedEditor feature={editedFeature} onChange={setEditedFeature} />
          )}
          {activeTab === 1 && (
            <AttachedEditor feature={editedFeature} onChange={setEditedFeature} />
          )}
          {activeTab === 2 && (
            <ActivatedEditor feature={editedFeature} onChange={setEditedFeature} />
          )}
          {activeTab === 3 && (
            <EngagedEditor feature={editedFeature} onChange={setEditedFeature} />
          )}
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Main Admin View
export function AdminView() {
  const { features, updateFeature } = useOnboarding();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const handleEditFeature = (feature: Feature) => {
    setSelectedFeature(feature);
    setEditorOpen(true);
  };

  const handleSaveFeature = (feature: Feature) => {
    updateFeature(feature);
    setSelectedFeature(null);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Feature Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage onboarding content for all features and adoption stages
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disabled>
          Add Feature
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>Feature</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Version
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature) => (
              <TableRow
                key={feature.id}
                hover
                sx={{ '&:last-child td': { border: 0 } }}
              >
                <TableCell>
                  <Typography fontWeight={500}>{feature.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={`v${feature.version}`}
                    size="small"
                    sx={{
                      bgcolor: alpha(palette.primary, 0.1),
                      color: palette.primary,
                      fontFamily: 'monospace',
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleEditFeature(feature)}
                    sx={{ color: palette.primary }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FeatureEditorModal
        feature={selectedFeature}
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setSelectedFeature(null);
        }}
        onSave={handleSaveFeature}
      />
    </Box>
  );
}
