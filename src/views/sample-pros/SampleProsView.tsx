import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  TextField,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  alpha,
  Tooltip,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import * as MuiIcons from '@mui/icons-material';
import { useOnboarding } from '../../context';
import { onboardingItems as allOnboardingItems } from '../../data';
import { PlanningWrapper } from '../../planning';
import type {
  ProAccount,
  FeatureId,
  FeatureStatus,
  AdoptionStage,
  BusinessType,
  PlanTier,
  ProGoal,
  BillingStatus,
  FraudStatus,
  IndustryType,
  LeadStatus,
  OrganizationBinSize,
  OrganizationStatus,
  CustomerStatusDisplayName,
  RetentionStatus,
  Segment,
  PainPoint,
  IndustryStandardized,
  WeeklyPlan,
  Feature,
} from '../../types';

// =============================================================================
// PALETTE
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
    400: '#94A3B8',
    600: '#475569',
    800: '#1E293B',
  },
};

const stageColors: Record<AdoptionStage, string> = {
  not_attached: palette.grey[400],
  attached: palette.warning,
  activated: palette.primary,
  engaged: palette.success,
};

const stageLabels: Record<AdoptionStage, string> = {
  not_attached: 'Not Attached',
  attached: 'Attached',
  activated: 'Activated',
  engaged: 'Engaged',
};

const allFeatureIds: FeatureId[] = [
  'invoicing',
  'payments',
  'automated-comms',
  'scheduling',
  'estimates',
  'csr-ai',
  'reviews',
];

const businessTypes: BusinessType[] = ['plumber', 'electrician', 'hvac', 'landscaper', 'cleaning', 'general'];
const planTiers: PlanTier[] = ['basic', 'essentials', 'max'];
const proGoals: ProGoal[] = ['growth', 'efficiency'];
const stages: AdoptionStage[] = ['not_attached', 'attached', 'activated', 'engaged'];

type WeekNumber = 1 | 2 | 3 | 4;

function createDefaultWeeklyPlan(): WeeklyPlan {
  return { week1: [], week2: [], week3: [], week4: [] };
}

// Pro Data field options
const billingStatuses: BillingStatus[] = ['trial_expired', 'enrolled', 'unknown', 'unenrolled', 'trial'];
const fraudStatuses: FraudStatus[] = ['risk_review_approved', 'risk_review_denied', 'risk_review_in_progress', 'unknown'];
const industryTypes: IndustryType[] = ['Mechanical', 'One-time', 'Recurring'];
const leadStatuses: LeadStatus[] = [
  'database', 'demo_attended', 'demo_booked', 'demo_missed', 'in_progress_sale',
  'independent_trial', 'internal_account', 'not_target_customer', 'sales_and_trial',
  'sdr_assigned', 'spam', 'stop_outreach'
];
const organizationBinSizes: OrganizationBinSize[] = ['0 to 1', '2 to 5', '6 to 10', '11+'];
const organizationStatuses: OrganizationStatus[] = [
  'canceled_former_customer', 'enrolled_cancel_requested', 'enrolled_current_customer',
  'enrolled_under_review_billing', 'enrolled_under_review_risk', 'excluded_internal_account',
  'terminated_billing_reason', 'terminated_risk_reason', 'unknown'
];
const customerStatusDisplayNames: CustomerStatusDisplayName[] = [
  'Enrolled: Current Customer', 'Enrolled: Cancel Requested', 'Enrolled: Under Review Billing',
  'Enrolled: Under Review Risk', 'Canceled: Former Customer', 'Prospect: Database',
  'Prospect: SDR Assigned', 'Sale-in-Progress: Demo Attended', 'Sale-in-Progress: Demo Booked',
  'Sale-in-Progress: Demo Missed', 'Sale-in-Progress: Independent Trial', 'Sale-in-Progress: Sales',
  'Sale-in-Progress: Sales + Trial', 'Excluded: Internal Account', 'Excluded: Internal Lead',
  'Excluded: Not Target Customer', 'Excluded: Spam', 'Excluded: Stop Outreach',
  'Terminated: Billing Reason', 'Terminated: Risk Reason', 'Unknown'
];
const retentionStatuses: RetentionStatus[] = [
  'billing_retention_in_progress', 'billing_retention_lost', 'billing_retention_saved',
  'cancellation_retention_in_progress', 'cancellation_retention_lost', 'cancellation_retention_saved',
  'unknown'
];
const segments: Segment[] = [
  '1', '1A', '1B', '1C', '1D', '2', '2A', '2B', '2C', '2D',
  '3', '3A', '3B', '3C', '3D', '4', '4A', '4B', '4C', '4D',
  'A', 'B', 'C', 'D'
];
const painPointOptions: PainPoint[] = [
  'Hiring employees', 'Training employees', 'Managing employees', 'Employee communication',
  'Customer communications', 'Not enough jobs', 'Selling effectively', 'Collecting my money',
  'Knowing my numbers', 'Managing my schedule', 'Managing my costs', 'Too many apps',
  'Too much admin work', 'Need business help & coaching'
];
const industryStandardizedOptions: IndustryStandardized[] = [
  'Heating & Air Conditioning', 'Plumbing', 'Electrical', 'Landscaping & Lawn', 'Home Cleaning',
  'General Contractor', 'Handyman', 'Pest Control', 'Pool & Spa', 'Roof & Attic', 'Painting',
  'Flooring', 'Appliances', 'Garage', 'Fencing', 'Tree Services', 'Power Wash', 'Carpet Cleaning',
  'Junk Removal', 'Moving', 'Locksmith', 'Glass', 'Gutters', 'Sewer & Septic', 'Restoration',
  'Home Inspection', 'Fireplace & Chimney', 'Doors', 'Drywall', 'Cabinetry', 'Concrete & Asphalt',
  'Deck & Patio', 'Siding', 'Window & Exterior Cleaning', 'Smart Home', 'Solar & Energy',
  'Security', 'Construction & Remodels', 'Other'
];

// =============================================================================
// HELPERS
// =============================================================================

function FeatureIcon({ iconName, ...props }: { iconName: string } & Record<string, unknown>) {
  const Icon = (MuiIcons as Record<string, React.ComponentType<Record<string, unknown>>>)[iconName] || MuiIcons.HelpOutlineRounded;
  return <Icon {...props} />;
}

function createDefaultFeatureStatus(): FeatureStatus {
  return {
    stage: 'not_attached',
    completedTasks: [],
    usageCount: 0,
  };
}

function createAllFeatureStatuses(stage: AdoptionStage): Record<FeatureId, FeatureStatus> {
  const now = new Date().toISOString().split('T')[0];
  const status: FeatureStatus = {
    stage,
    completedTasks: [],
    usageCount: stage === 'engaged' ? 50 : stage === 'activated' ? 10 : 0,
    ...(stage !== 'not_attached' && { attachedAt: now }),
    ...((stage === 'activated' || stage === 'engaged') && { activatedAt: now }),
    ...(stage === 'engaged' && { engagedAt: now }),
  };

  return {
    invoicing: { ...status },
    payments: { ...status },
    'automated-comms': { ...status },
    scheduling: { ...status },
    estimates: { ...status },
    'csr-ai': { ...status },
    reviews: { ...status },
  };
}

function generateProId(): string {
  return `pro-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
}

// =============================================================================
// PRO SIDEBAR
// =============================================================================

interface ProSidebarProps {
  pros: ProAccount[];
  selectedProId: string | null;
  onSelectPro: (proId: string) => void;
  onAddPro: () => void;
}

function ProSidebar({ pros, selectedProId, onSelectPro, onAddPro }: ProSidebarProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: 280,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={600}>
            Sample Pros
          </Typography>
          <Tooltip title="Add new pro">
            <IconButton size="small" onClick={onAddPro} color="primary">
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <List sx={{ flex: 1, overflow: 'auto', py: 0 }}>
        {pros.map((pro) => (
          <ListItem key={pro.id} disablePadding>
            <ListItemButton
              selected={selectedProId === pro.id}
              onClick={() => onSelectPro(pro.id)}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  bgcolor: alpha(palette.primary, 0.08),
                  borderLeft: `3px solid ${palette.primary}`,
                  '&:hover': {
                    bgcolor: alpha(palette.primary, 0.12),
                  },
                },
              }}
            >
              <ListItemText
                primary={pro.companyName}
                secondary={
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                    <Chip
                      label={pro.plan}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        textTransform: 'capitalize',
                        bgcolor: pro.plan === 'max' ? alpha(palette.primary, 0.1) : palette.grey[100],
                        color: pro.plan === 'max' ? palette.primary : palette.grey[600],
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {pro.ownerName}
                    </Typography>
                  </Stack>
                }
                primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

// =============================================================================
// DETAILS TAB
// =============================================================================

interface DetailsTabProps {
  pro: ProAccount;
  onUpdate: (pro: ProAccount) => void;
}

function DetailsTab({ pro, onUpdate }: DetailsTabProps) {
  const handleFieldChange = (field: keyof ProAccount, value: string) => {
    let processedValue: string | boolean | number | undefined = value;

    if (field === 'techReadiness') {
      processedValue = value === 'true' ? true : value === 'false' ? false : undefined;
    } else if (field === 'organizationSize') {
      processedValue = value ? parseInt(value, 10) : undefined;
    } else if (value === '') {
      processedValue = undefined;
    }

    onUpdate({ ...pro, [field]: processedValue });
  };

  return (
    <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', pr: 1 }}>
      {/* Basic Info Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
        Basic Information
      </Typography>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Company Name"
            value={pro.companyName}
            onChange={(e) => handleFieldChange('companyName', e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Owner Name"
            value={pro.ownerName}
            onChange={(e) => handleFieldChange('ownerName', e.target.value)}
            fullWidth
            size="small"
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Plan</InputLabel>
            <Select
              value={pro.plan}
              label="Plan"
              onChange={(e) => handleFieldChange('plan', e.target.value)}
            >
              {planTiers.map((tier) => (
                <MenuItem key={tier} value={tier}>
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Company Goal</InputLabel>
            <Select
              value={pro.goal}
              label="Company Goal"
              onChange={(e) => handleFieldChange('goal', e.target.value)}
            >
              {proGoals.map((goal) => (
                <MenuItem key={goal} value={goal}>
                  {goal.charAt(0).toUpperCase() + goal.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Created At"
            type="date"
            value={pro.createdAt}
            onChange={(e) => handleFieldChange('createdAt', e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Stack>

      {/* Organization IDs Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
        Organization IDs
      </Typography>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Business ID"
            value={pro.businessId || ''}
            onChange={(e) => handleFieldChange('businessId', e.target.value)}
            fullWidth
            size="small"
            placeholder="UUID"
          />
          <TextField
            label="Organization UUID"
            value={pro.organizationUuid || ''}
            onChange={(e) => handleFieldChange('organizationUuid', e.target.value)}
            fullWidth
            size="small"
            placeholder="UUID"
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Salesforce Account ID"
            value={pro.salesforceAccountId || ''}
            onChange={(e) => handleFieldChange('salesforceAccountId', e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Salesforce Lead ID"
            value={pro.salesforceLeadId || ''}
            onChange={(e) => handleFieldChange('salesforceLeadId', e.target.value)}
            fullWidth
            size="small"
          />
        </Stack>
      </Stack>

      {/* Industry & Segment Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
        Industry & Segment
      </Typography>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Industry (Standardized)</InputLabel>
            <Select
              value={pro.industryStandardized || ''}
              label="Industry (Standardized)"
              onChange={(e) => handleFieldChange('industryStandardized', e.target.value)}
            >
              <MenuItem value="">—</MenuItem>
              {industryStandardizedOptions.map((ind) => (
                <MenuItem key={ind} value={ind}>{ind}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Industry Type</InputLabel>
            <Select
              value={pro.industryType || ''}
              label="Industry Type"
              onChange={(e) => handleFieldChange('industryType', e.target.value)}
            >
              <MenuItem value="">—</MenuItem>
              {industryTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Segment</InputLabel>
            <Select
              value={pro.segment || ''}
              label="Segment"
              onChange={(e) => handleFieldChange('segment', e.target.value)}
            >
              <MenuItem value="">—</MenuItem>
              {segments.map((seg) => (
                <MenuItem key={seg} value={seg}>{seg}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Organization Bin Size</InputLabel>
            <Select
              value={pro.organizationBinSize || ''}
              label="Organization Bin Size"
              onChange={(e) => handleFieldChange('organizationBinSize', e.target.value)}
            >
              <MenuItem value="">—</MenuItem>
              {organizationBinSizes.map((size) => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Organization Size"
            type="number"
            value={pro.organizationSize || ''}
            onChange={(e) => handleFieldChange('organizationSize', e.target.value)}
            fullWidth
            size="small"
          />
        </Stack>
        <FormControl fullWidth size="small">
          <InputLabel>Tech Readiness</InputLabel>
          <Select
            value={pro.techReadiness === true ? 'true' : pro.techReadiness === false ? 'false' : ''}
            label="Tech Readiness"
            onChange={(e) => handleFieldChange('techReadiness', e.target.value)}
          >
            <MenuItem value="">—</MenuItem>
            <MenuItem value="true">Yes (Switcher - comparing with current system)</MenuItem>
            <MenuItem value="false">No (Coming from pen and paper)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Status Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
        Status Information
      </Typography>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Billing Status</InputLabel>
            <Select
              value={pro.billingStatus || ''}
              label="Billing Status"
              onChange={(e) => handleFieldChange('billingStatus', e.target.value)}
            >
              <MenuItem value="">—</MenuItem>
              {billingStatuses.map((status) => (
                <MenuItem key={status} value={status}>{status.replace(/_/g, ' ')}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Organization Status</InputLabel>
            <Select
              value={pro.organizationStatus || ''}
              label="Organization Status"
              onChange={(e) => handleFieldChange('organizationStatus', e.target.value)}
            >
              <MenuItem value="">—</MenuItem>
              {organizationStatuses.map((status) => (
                <MenuItem key={status} value={status}>{status.replace(/_/g, ' ')}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Customer Status Display</InputLabel>
            <Select
              value={pro.customerStatusDisplayName || ''}
              label="Customer Status Display"
              onChange={(e) => handleFieldChange('customerStatusDisplayName', e.target.value)}
            >
              <MenuItem value="">—</MenuItem>
              {customerStatusDisplayNames.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Lead Status</InputLabel>
            <Select
              value={pro.leadStatus || ''}
              label="Lead Status"
              onChange={(e) => handleFieldChange('leadStatus', e.target.value)}
            >
              <MenuItem value="">—</MenuItem>
              {leadStatuses.map((status) => (
                <MenuItem key={status} value={status}>{status.replace(/_/g, ' ')}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Fraud Status</InputLabel>
            <Select
              value={pro.fraudStatus || ''}
              label="Fraud Status"
              onChange={(e) => handleFieldChange('fraudStatus', e.target.value)}
            >
              <MenuItem value="">—</MenuItem>
              {fraudStatuses.map((status) => (
                <MenuItem key={status} value={status}>{status.replace(/_/g, ' ')}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Retention Status</InputLabel>
            <Select
              value={pro.retentionStatus || ''}
              label="Retention Status"
              onChange={(e) => handleFieldChange('retentionStatus', e.target.value)}
            >
              <MenuItem value="">—</MenuItem>
              {retentionStatuses.map((status) => (
                <MenuItem key={status} value={status}>{status.replace(/_/g, ' ')}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* Pain Points Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
        Pain Points
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Pain Points</InputLabel>
        <Select
          multiple
          value={pro.painPoints || []}
          label="Pain Points"
          onChange={(e) => {
            const value = e.target.value;
            onUpdate({ ...pro, painPoints: typeof value === 'string' ? value.split(',') as PainPoint[] : value as PainPoint[] });
          }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {painPointOptions.map((point) => (
            <MenuItem key={point} value={point}>{point}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Legacy Business Type (for backward compatibility) */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
        Legacy Fields
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel>Business Type (Legacy)</InputLabel>
        <Select
          value={pro.businessType}
          label="Business Type (Legacy)"
          onChange={(e) => handleFieldChange('businessType', e.target.value)}
        >
          {businessTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

// =============================================================================
// FEATURES TAB
// =============================================================================

interface FeaturesTabProps {
  pro: ProAccount;
  features: Feature[];
  onUpdate: (pro: ProAccount) => void;
}

function FeaturesTab({ pro, features, onUpdate }: FeaturesTabProps) {
  const handleStageChange = (featureId: FeatureId, stage: AdoptionStage) => {
    const current = pro.featureStatus[featureId] || createDefaultFeatureStatus();
    const now = new Date().toISOString().split('T')[0];

    const updated: FeatureStatus = {
      ...current,
      stage,
      ...(stage !== 'not_attached' && !current.attachedAt && { attachedAt: now }),
      ...((stage === 'activated' || stage === 'engaged') && !current.activatedAt && { activatedAt: now }),
      ...(stage === 'engaged' && !current.engagedAt && { engagedAt: now }),
    };

    onUpdate({
      ...pro,
      featureStatus: {
        ...pro.featureStatus,
        [featureId]: updated,
      },
    });
  };

  const handleUsageChange = (featureId: FeatureId, usageCount: number) => {
    onUpdate({
      ...pro,
      featureStatus: {
        ...pro.featureStatus,
        [featureId]: {
          ...pro.featureStatus[featureId],
          usageCount,
        },
      },
    });
  };

  // Get onboarding items for a feature at its current stage
  const getFeatureOnboardingItems = (feature: Feature, stage: AdoptionStage) => {
    const stageKey = stage === 'not_attached' ? 'notAttached' : stage;
    const stageData = feature.stages[stageKey as keyof typeof feature.stages];
    if (!stageData?.onboardingItems) return [];

    return stageData.onboardingItems.map((item) => {
      const itemDef = allOnboardingItems.find((i) => i.id === item.itemId);
      return {
        ...item,
        definition: itemDef,
      };
    });
  };

  return (
    <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', pr: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure feature status and view onboarding items for each stage. Onboarding items are defined in the HCP Context Manager.
      </Typography>

      {features.filter((f) => allFeatureIds.includes(f.id as FeatureId)).map((feature) => {
        const featureId = feature.id as FeatureId;
        const status = pro.featureStatus[featureId] || createDefaultFeatureStatus();
        const onboardingItems = getFeatureOnboardingItems(feature, status.stage);

        return (
          <Accordion
            key={featureId}
            defaultExpanded={false}
            sx={{
              mb: 1,
              border: 1,
              borderColor: 'divider',
              '&:before': { display: 'none' },
              boxShadow: 'none',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', pr: 2 }}>
                <FeatureIcon iconName={feature.icon || 'HelpOutlineRounded'} sx={{ color: stageColors[status.stage] }} />
                <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1 }}>
                  {feature.name}
                </Typography>
                <Chip
                  label={stageLabels[status.stage]}
                  size="small"
                  sx={{
                    bgcolor: alpha(stageColors[status.stage], 0.1),
                    color: stageColors[status.stage],
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {/* Stage and usage controls */}
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Stage</InputLabel>
                    <Select
                      value={status.stage}
                      label="Stage"
                      onChange={(e) => handleStageChange(featureId, e.target.value as AdoptionStage)}
                    >
                      {stages.map((stage) => (
                        <MenuItem key={stage} value={stage}>
                          {stageLabels[stage]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Usage Count"
                    type="number"
                    size="small"
                    value={status.usageCount}
                    onChange={(e) => handleUsageChange(featureId, parseInt(e.target.value) || 0)}
                    sx={{ width: 120 }}
                  />

                  {status.stage !== 'not_attached' && (
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 2 }}>
                      {status.attachedAt && (
                        <Typography variant="caption" color="text.secondary">
                          Attached: {status.attachedAt}
                        </Typography>
                      )}
                      {status.activatedAt && (
                        <Typography variant="caption" color="text.secondary">
                          Activated: {status.activatedAt}
                        </Typography>
                      )}
                      {status.engagedAt && (
                        <Typography variant="caption" color="text.secondary">
                          Engaged: {status.engagedAt}
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Stack>

                {/* Onboarding items for current stage */}
                {onboardingItems.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Onboarding Items for {stageLabels[status.stage]} Stage
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5 }}>
                      <Stack spacing={1}>
                        {onboardingItems.map((item) => {
                          const isCompleted = status.completedTasks.includes(item.itemId);
                          return (
                            <Stack
                              key={item.itemId}
                              direction="row"
                              alignItems="flex-start"
                              spacing={1}
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                bgcolor: isCompleted ? alpha(palette.success, 0.05) : 'transparent',
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const newTasks = isCompleted
                                    ? status.completedTasks.filter((t) => t !== item.itemId)
                                    : [...status.completedTasks, item.itemId];
                                  onUpdate({
                                    ...pro,
                                    featureStatus: {
                                      ...pro.featureStatus,
                                      [featureId]: {
                                        ...status,
                                        completedTasks: newTasks,
                                      },
                                    },
                                  });
                                }}
                                sx={{ p: 0.25 }}
                              >
                                {isCompleted ? (
                                  <CheckBoxIcon sx={{ color: palette.success }} />
                                ) : (
                                  <CheckBoxOutlineBlankIcon sx={{ color: palette.grey[400] }} />
                                )}
                              </IconButton>
                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      textDecoration: isCompleted ? 'line-through' : 'none',
                                      color: isCompleted ? 'text.secondary' : 'text.primary',
                                    }}
                                  >
                                    {item.definition?.title || item.itemId}
                                  </Typography>
                                  {item.required && (
                                    <Chip
                                      label="Required"
                                      size="small"
                                      sx={{
                                        height: 18,
                                        fontSize: '0.65rem',
                                        bgcolor: alpha(palette.error, 0.1),
                                        color: palette.error,
                                      }}
                                    />
                                  )}
                                </Stack>
                                {item.definition?.description && (
                                  <Typography variant="caption" color="text.secondary">
                                    {item.definition.description}
                                  </Typography>
                                )}
                                {item.stageSpecificNote && (
                                  <Typography variant="caption" color="primary.main" display="block">
                                    Note: {item.stageSpecificNote}
                                  </Typography>
                                )}
                              </Box>
                            </Stack>
                          );
                        })}
                      </Stack>
                    </Paper>
                  </Box>
                )}

                {onboardingItems.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No onboarding items defined for the {stageLabels[status.stage]} stage.
                  </Typography>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}

// =============================================================================
// WEEKLY PLAN TAB
// =============================================================================

interface WeeklyPlanTabProps {
  pro: ProAccount;
  onUpdate: (pro: ProAccount) => void;
}

function WeeklyPlanTab({ pro, onUpdate }: WeeklyPlanTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const weeklyPlan = pro.weeklyPlan || createDefaultWeeklyPlan();

  const handleWeeklyPlanChange = (plan: WeeklyPlan) => {
    onUpdate({ ...pro, weeklyPlan: plan });
  };

  // Get all assigned item IDs across all weeks
  const assignedItemIds = [
    ...weeklyPlan.week1.map(i => i.itemId),
    ...weeklyPlan.week2.map(i => i.itemId),
    ...weeklyPlan.week3.map(i => i.itemId),
    ...weeklyPlan.week4.map(i => i.itemId),
  ];

  // Filter available items (not already assigned)
  const availableItems = allOnboardingItems.filter(item => {
    const matchesSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const notAssigned = !assignedItemIds.includes(item.id);
    return matchesSearch && notAssigned;
  });

  const getWeekKey = (week: WeekNumber): keyof WeeklyPlan => `week${week}` as keyof WeeklyPlan;

  const handleAddToWeek = (itemId: string, week: WeekNumber) => {
    const weekKey = getWeekKey(week);
    const currentItems = weeklyPlan[weekKey];
    const maxOrder = currentItems.length > 0
      ? Math.max(...currentItems.map(i => i.order)) + 1
      : 0;
    handleWeeklyPlanChange({
      ...weeklyPlan,
      [weekKey]: [...currentItems, { itemId, order: maxOrder }],
    });
  };

  const handleRemoveFromWeek = (itemId: string, week: WeekNumber) => {
    const weekKey = getWeekKey(week);
    handleWeeklyPlanChange({
      ...weeklyPlan,
      [weekKey]: weeklyPlan[weekKey].filter(i => i.itemId !== itemId),
    });
  };

  const handleMoveUp = (itemId: string, week: WeekNumber) => {
    const weekKey = getWeekKey(week);
    const items = [...weeklyPlan[weekKey]].sort((a, b) => a.order - b.order);
    const index = items.findIndex(i => i.itemId === itemId);
    if (index > 0) {
      const temp = items[index].order;
      items[index].order = items[index - 1].order;
      items[index - 1].order = temp;
      handleWeeklyPlanChange({ ...weeklyPlan, [weekKey]: items });
    }
  };

  const handleMoveDown = (itemId: string, week: WeekNumber) => {
    const weekKey = getWeekKey(week);
    const items = [...weeklyPlan[weekKey]].sort((a, b) => a.order - b.order);
    const index = items.findIndex(i => i.itemId === itemId);
    if (index < items.length - 1) {
      const temp = items[index].order;
      items[index].order = items[index + 1].order;
      items[index + 1].order = temp;
      handleWeeklyPlanChange({ ...weeklyPlan, [weekKey]: items });
    }
  };

  const renderWeekColumn = (week: WeekNumber) => {
    const weekKey = getWeekKey(week);
    const items = weeklyPlan[weekKey].sort((a, b) => a.order - b.order);

    return (
      <Box
        key={week}
        sx={{
          flex: 1,
          minWidth: 180,
          borderRight: week < 4 ? '1px solid' : 'none',
          borderColor: 'divider',
          p: 1.5,
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{ mb: 1.5, color: palette.primary }}
        >
          Week {week}
        </Typography>
        <Stack spacing={0.5}>
          {items.map((item, index) => {
            const itemDef = allOnboardingItems.find(i => i.id === item.itemId);
            if (!itemDef) return null;
            return (
              <Paper
                key={item.itemId}
                variant="outlined"
                sx={{
                  p: 1,
                  bgcolor: palette.grey[50],
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" noWrap title={itemDef.title}>
                    {itemDef.title}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0}>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveUp(item.itemId, week)}
                    disabled={index === 0}
                    sx={{ p: 0.25 }}
                  >
                    <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveDown(item.itemId, week)}
                    disabled={index === items.length - 1}
                    sx={{ p: 0.25 }}
                  >
                    <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFromWeek(item.itemId, week)}
                    sx={{ p: 0.25, color: palette.error }}
                  >
                    <RemoveIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              </Paper>
            );
          })}
          {items.length === 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No items
            </Typography>
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 220px)' }}>
      {/* Left panel: Available items */}
      <Paper
        variant="outlined"
        sx={{
          width: 280,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Available Items
          </Typography>
          <TextField
            size="small"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <List dense sx={{ flex: 1, overflow: 'auto', py: 0 }}>
          {availableItems.map((item) => (
            <ListItem
              key={item.id}
              disablePadding
              secondaryAction={
                <Stack direction="row" spacing={0.5}>
                  {([1, 2, 3, 4] as WeekNumber[]).map((week) => (
                    <Tooltip key={week} title={`Add to Week ${week}`}>
                      <IconButton
                        size="small"
                        onClick={() => handleAddToWeek(item.id, week)}
                        sx={{
                          width: 20,
                          height: 20,
                          fontSize: '0.65rem',
                          bgcolor: alpha(palette.primary, 0.1),
                          color: palette.primary,
                          '&:hover': { bgcolor: alpha(palette.primary, 0.2) },
                        }}
                      >
                        {week}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Stack>
              }
            >
              <ListItemButton sx={{ py: 0.5 }}>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    variant: 'caption',
                    noWrap: true,
                    sx: { maxWidth: 140 },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {availableItems.length === 0 && (
            <ListItem>
              <ListItemText
                primary={searchTerm ? 'No matching items' : 'All items assigned'}
                primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Right panel: Week columns */}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'auto',
        }}
      >
        {([1, 2, 3, 4] as WeekNumber[]).map(renderWeekColumn)}
      </Paper>
    </Box>
  );
}

// =============================================================================
// MAIN VIEW
// =============================================================================

export function SampleProsView() {
  const { pros, features, addPro, updatePro, deletePro } = useOnboarding();
  const [selectedProId, setSelectedProId] = useState<string | null>(pros[0]?.id || null);
  const [activeTab, setActiveTab] = useState(0);

  const selectedPro = pros.find((p) => p.id === selectedProId);

  const handleAddPro = () => {
    const newPro: ProAccount = {
      id: generateProId(),
      companyName: 'New Company',
      ownerName: 'New Owner',
      businessType: 'general',
      plan: 'essentials',
      goal: 'growth',
      createdAt: new Date().toISOString().split('T')[0],
      featureStatus: createAllFeatureStatuses('not_attached'),
    };
    addPro(newPro);
    setSelectedProId(newPro.id);
    setActiveTab(0);
  };

  const handleDeletePro = () => {
    if (selectedPro && window.confirm(`Are you sure you want to delete ${selectedPro.companyName}?`)) {
      deletePro(selectedPro.id);
      setSelectedProId(pros.find((p) => p.id !== selectedPro.id)?.id || null);
    }
  };

  return (
    <PlanningWrapper elementId="view-sample-pros">
      <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
        {/* Left sidebar with pro list */}
        <ProSidebar
          pros={pros}
          selectedProId={selectedProId}
          onSelectPro={setSelectedProId}
          onAddPro={handleAddPro}
        />

        {/* Main content area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {selectedPro ? (
            <>
              {/* Header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <SettingsApplicationsIcon sx={{ fontSize: 28, color: palette.primary }} />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedPro.companyName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedPro.ownerName} • {selectedPro.plan.charAt(0).toUpperCase() + selectedPro.plan.slice(1)} Plan
                      </Typography>
                    </Box>
                  </Stack>
                  <Tooltip title="Delete this pro">
                    <IconButton onClick={handleDeletePro} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                  <Tab label="Details" />
                  <Tab label="Features" />
                  <Tab label="Weekly Plan" />
                </Tabs>
              </Box>

              {/* Tab content */}
              <Box sx={{ flex: 1, p: 2, overflow: 'hidden' }}>
                {activeTab === 0 && (
                  <DetailsTab pro={selectedPro} onUpdate={updatePro} />
                )}
                {activeTab === 1 && (
                  <FeaturesTab pro={selectedPro} features={features} onUpdate={updatePro} />
                )}
                {activeTab === 2 && (
                  <WeeklyPlanTab pro={selectedPro} onUpdate={updatePro} />
                )}
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <SettingsApplicationsIcon sx={{ fontSize: 64, color: palette.grey[300] }} />
              <Typography variant="h6" color="text.secondary">
                No pro selected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a pro from the sidebar or add a new one
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddPro}>
                Add Sample Pro
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </PlanningWrapper>
  );
}

export default SampleProsView;
