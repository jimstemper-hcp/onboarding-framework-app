import { useState } from 'react';
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
  TextField,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Card,
  alpha,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import * as MuiIcons from '@mui/icons-material';
import { useOnboarding } from '../../context';
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
// PRO EDITOR DIALOG
// =============================================================================

interface ProEditorDialogProps {
  open: boolean;
  pro: ProAccount | null;
  onSave: (pro: ProAccount) => void;
  onClose: () => void;
  isNew: boolean;
}

function ProEditorDialog({ open, pro, onSave, onClose, isNew }: ProEditorDialogProps) {
  const [editedPro, setEditedPro] = useState<ProAccount | null>(pro);
  const [activeTab, setActiveTab] = useState(0);

  // Reset state when dialog opens with new pro
  useState(() => {
    setEditedPro(pro);
    setActiveTab(0);
  });

  if (!editedPro) return null;

  const handleSave = () => {
    onSave(editedPro);
    onClose();
  };

  const handleFieldChange = (field: keyof ProAccount, value: string) => {
    let processedValue: string | boolean | number | undefined = value;

    // Handle special field types
    if (field === 'techReadiness') {
      processedValue = value === 'true' ? true : value === 'false' ? false : undefined;
    } else if (field === 'organizationSize') {
      processedValue = value ? parseInt(value, 10) : undefined;
    } else if (value === '') {
      processedValue = undefined;
    }

    setEditedPro({ ...editedPro, [field]: processedValue });
  };

  const handleFeatureStatusChange = (featureId: FeatureId, status: FeatureStatus) => {
    setEditedPro({
      ...editedPro,
      featureStatus: {
        ...editedPro.featureStatus,
        [featureId]: status,
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isNew ? <PersonAddIcon color="primary" /> : <EditIcon color="primary" />}
        {isNew ? 'Add New Sample Pro' : `Edit: ${editedPro.companyName}`}
      </DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Pro Details" />
          <Tab label="Feature Status" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
            {/* Basic Info Section */}
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
              Basic Information
            </Typography>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Company Name"
                  value={editedPro.companyName}
                  onChange={(e) => handleFieldChange('companyName', e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Owner Name"
                  value={editedPro.ownerName}
                  onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Plan</InputLabel>
                  <Select
                    value={editedPro.plan}
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
                    value={editedPro.goal}
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
                  value={editedPro.createdAt}
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
                  value={editedPro.businessId || ''}
                  onChange={(e) => handleFieldChange('businessId', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="UUID"
                />
                <TextField
                  label="Organization UUID"
                  value={editedPro.organizationUuid || ''}
                  onChange={(e) => handleFieldChange('organizationUuid', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="UUID"
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Salesforce Account ID"
                  value={editedPro.salesforceAccountId || ''}
                  onChange={(e) => handleFieldChange('salesforceAccountId', e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Salesforce Lead ID"
                  value={editedPro.salesforceLeadId || ''}
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
                    value={editedPro.industryStandardized || ''}
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
                    value={editedPro.industryType || ''}
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
                    value={editedPro.segment || ''}
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
                    value={editedPro.organizationBinSize || ''}
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
                  value={editedPro.organizationSize || ''}
                  onChange={(e) => handleFieldChange('organizationSize', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Stack>
              <FormControl fullWidth size="small">
                <InputLabel>Tech Readiness</InputLabel>
                <Select
                  value={editedPro.techReadiness === true ? 'true' : editedPro.techReadiness === false ? 'false' : ''}
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
                    value={editedPro.billingStatus || ''}
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
                    value={editedPro.organizationStatus || ''}
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
                    value={editedPro.customerStatusDisplayName || ''}
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
                    value={editedPro.leadStatus || ''}
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
                    value={editedPro.fraudStatus || ''}
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
                    value={editedPro.retentionStatus || ''}
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
                value={editedPro.painPoints || []}
                label="Pain Points"
                onChange={(e) => {
                  const value = e.target.value;
                  setEditedPro({ ...editedPro, painPoints: typeof value === 'string' ? value.split(',') as PainPoint[] : value as PainPoint[] });
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
                value={editedPro.businessType}
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
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <FeatureStatusEditor
              featureStatus={editedPro.featureStatus}
              onChange={handleFeatureStatusChange}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {isNew ? 'Add Pro' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// =============================================================================
// FEATURE STATUS EDITOR
// =============================================================================

interface FeatureStatusEditorProps {
  featureStatus: Record<FeatureId, FeatureStatus>;
  onChange: (featureId: FeatureId, status: FeatureStatus) => void;
}

function FeatureStatusEditor({ featureStatus, onChange }: FeatureStatusEditorProps) {
  const { features } = useOnboarding();

  const handleStageChange = (featureId: FeatureId, stage: AdoptionStage) => {
    const current = featureStatus[featureId];
    const now = new Date().toISOString().split('T')[0];

    const updated: FeatureStatus = {
      ...current,
      stage,
      ...(stage !== 'not_attached' && !current.attachedAt && { attachedAt: now }),
      ...((stage === 'activated' || stage === 'engaged') && !current.activatedAt && { activatedAt: now }),
      ...(stage === 'engaged' && !current.engagedAt && { engagedAt: now }),
    };

    onChange(featureId, updated);
  };

  const handleUsageChange = (featureId: FeatureId, usageCount: number) => {
    onChange(featureId, {
      ...featureStatus[featureId],
      usageCount,
    });
  };

  const handleCompletedTasksChange = (featureId: FeatureId, tasks: string[]) => {
    onChange(featureId, {
      ...featureStatus[featureId],
      completedTasks: tasks,
    });
  };

  const handleRankChange = (featureId: FeatureId, rank: number | undefined) => {
    onChange(featureId, {
      ...featureStatus[featureId],
      rank,
    });
  };

  return (
    <Stack spacing={2}>
      {allFeatureIds.map((featureId) => {
        const feature = features.find((f) => f.id === featureId);
        const status = featureStatus[featureId] || createDefaultFeatureStatus();

        return (
          <Card key={featureId} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <FeatureIcon iconName={feature?.icon || 'HelpOutlineRounded'} sx={{ color: stageColors[status.stage] }} />
              <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1 }}>
                {feature?.name || featureId}
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

              <TextField
                label="Rank"
                type="number"
                size="small"
                value={status.rank ?? ''}
                onChange={(e) => handleRankChange(featureId, e.target.value ? parseInt(e.target.value) : undefined)}
                sx={{ width: 100 }}
                placeholder="1, 2, 3..."
                helperText="Lower = higher priority"
              />

              <TextField
                label="Completed Tasks (comma-separated)"
                size="small"
                value={status.completedTasks.join(', ')}
                onChange={(e) => handleCompletedTasksChange(featureId, e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                sx={{ flex: 1 }}
                placeholder="task-1, task-2"
              />
            </Stack>

            {status.stage !== 'not_attached' && (
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
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
          </Card>
        );
      })}
    </Stack>
  );
}

// =============================================================================
// MAIN VIEW
// =============================================================================

export function SampleProsView() {
  const { pros, features: _features, addPro, updatePro, deletePro } = useOnboarding();
  const [editingPro, setEditingPro] = useState<ProAccount | null>(null);
  const [isNew, setIsNew] = useState(false);

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
    setEditingPro(newPro);
    setIsNew(true);
  };

  const handleEditPro = (pro: ProAccount) => {
    setEditingPro({ ...pro });
    setIsNew(false);
  };

  const handleSavePro = (pro: ProAccount) => {
    if (isNew) {
      addPro(pro);
    } else {
      updatePro(pro);
    }
    setEditingPro(null);
  };

  const handleDeletePro = (proId: string) => {
    if (window.confirm('Are you sure you want to delete this sample pro?')) {
      deletePro(proId);
    }
  };

  const handleApplyPreset = (pro: ProAccount, featureStatus: Record<FeatureId, FeatureStatus>) => {
    updatePro({
      ...pro,
      featureStatus,
    });
  };

  const getStageStats = (pro: ProAccount) => {
    const counts = { not_attached: 0, attached: 0, activated: 0, engaged: 0 };
    allFeatureIds.forEach((featureId) => {
      const stage = pro.featureStatus[featureId]?.stage || 'not_attached';
      counts[stage]++;
    });
    return counts;
  };

  return (
    <PlanningWrapper elementId="view-sample-pros">
      <Box>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SettingsApplicationsIcon sx={{ fontSize: 32, color: palette.primary }} />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Sample Pro Configurations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure sample pro accounts for testing different scenarios
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPro}
          >
            Add Sample Pro
          </Button>
        </Stack>

        {/* Pro Table */}
        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Goal</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Feature Stages</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Quick Preset</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pros.map((pro) => {
                const stats = getStageStats(pro);
                return (
                  <TableRow key={pro.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{pro.companyName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {pro.businessType}
                      </Typography>
                    </TableCell>
                    <TableCell>{pro.ownerName}</TableCell>
                    <TableCell>
                      <Chip
                        label={pro.plan}
                        size="small"
                        sx={{
                          textTransform: 'capitalize',
                          bgcolor: pro.plan === 'max' ? alpha(palette.primary, 0.1) : palette.grey[100],
                          color: pro.plan === 'max' ? palette.primary : palette.grey[600],
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pro.goal}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {stats.not_attached > 0 && (
                          <Chip
                            label={stats.not_attached}
                            size="small"
                            sx={{ bgcolor: alpha(stageColors.not_attached, 0.1), color: stageColors.not_attached, minWidth: 28 }}
                          />
                        )}
                        {stats.attached > 0 && (
                          <Chip
                            label={stats.attached}
                            size="small"
                            sx={{ bgcolor: alpha(stageColors.attached, 0.1), color: stageColors.attached, minWidth: 28 }}
                          />
                        )}
                        {stats.activated > 0 && (
                          <Chip
                            label={stats.activated}
                            size="small"
                            sx={{ bgcolor: alpha(stageColors.activated, 0.1), color: stageColors.activated, minWidth: 28 }}
                          />
                        )}
                        {stats.engaged > 0 && (
                          <Chip
                            label={stats.engaged}
                            size="small"
                            sx={{ bgcolor: alpha(stageColors.engaged, 0.1), color: stageColors.engaged, minWidth: 28 }}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Set all to Not Attached">
                          <IconButton
                            size="small"
                            onClick={() => handleApplyPreset(pro, createAllFeatureStatuses('not_attached'))}
                          >
                            <Typography variant="caption" sx={{ color: stageColors.not_attached }}>N</Typography>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Set all to Attached">
                          <IconButton
                            size="small"
                            onClick={() => handleApplyPreset(pro, createAllFeatureStatuses('attached'))}
                          >
                            <Typography variant="caption" sx={{ color: stageColors.attached }}>A</Typography>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Set all to Activated">
                          <IconButton
                            size="small"
                            onClick={() => handleApplyPreset(pro, createAllFeatureStatuses('activated'))}
                          >
                            <Typography variant="caption" sx={{ color: stageColors.activated }}>V</Typography>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Set all to Engaged">
                          <IconButton
                            size="small"
                            onClick={() => handleApplyPreset(pro, createAllFeatureStatuses('engaged'))}
                          >
                            <CheckCircleIcon sx={{ fontSize: 16, color: stageColors.engaged }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEditPro(pro)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeletePro(pro.id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Legend */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">Stage Legend:</Typography>
          {stages.map((stage) => (
            <Chip
              key={stage}
              label={stageLabels[stage]}
              size="small"
              sx={{
                bgcolor: alpha(stageColors[stage], 0.1),
                color: stageColors[stage],
                fontWeight: 500,
              }}
            />
          ))}
        </Box>

        {/* Editor Dialog */}
        {editingPro && (
          <ProEditorDialog
            open={Boolean(editingPro)}
            pro={editingPro}
            onSave={handleSavePro}
            onClose={() => setEditingPro(null)}
            isNew={isNew}
          />
        )}
      </Box>
    </PlanningWrapper>
  );
}

export default SampleProsView;
