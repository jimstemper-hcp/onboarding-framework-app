import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import type { ProAccount, FeatureId, FeatureStatus, WeeklyPlan } from '../types';

// Default weekly plan used for most pros (fallback)
const defaultWeeklyPlan: WeeklyPlan = {
  week1: [
    { itemId: 'create-first-customer', order: 0 },
    { itemId: 'company-profile', order: 1 },
    { itemId: 'add-company-logo', order: 2 },
    { itemId: 'add-new-customers', order: 3 },
  ],
  week2: [
    { itemId: 'create-first-estimate', order: 0 },
    { itemId: 'create-first-job', order: 1 },
    { itemId: 'send-first-invoice', order: 2 },
    { itemId: 'online-booking', order: 3 },
  ],
  week3: [
    { itemId: 'connect-payment-processor', order: 0 },
    { itemId: 'enable-appointment-reminders', order: 1 },
    { itemId: 'enable-review-requests', order: 2 },
    { itemId: 'add-employees', order: 3 },
  ],
  week4: [
    { itemId: 'pricebook', order: 0 },
    { itemId: 'service-plans-settings', order: 1 },
    { itemId: 'time-tracking', order: 2 },
    { itemId: 'custom-reports', order: 3 },
  ],
};

// Helper to create a feature status at a specific stage
const createStatus = (
  stage: FeatureStatus['stage'],
  completedTasks: string[] = [],
  usageCount = 0
): FeatureStatus => ({
  stage,
  completedTasks,
  usageCount,
  ...(stage !== 'not_attached' && { attachedAt: '2024-01-15' }),
  ...(stage === 'activated' ? { activatedAt: '2024-01-20' } : {}),
});

// List of all feature IDs to ensure complete featureStatus
const ALL_FEATURE_IDS: FeatureId[] = [
  'invoicing',
  'payments',
  'automated-comms',
  'scheduling',
  'estimates',
  'csr-ai',
  'reviews',
  'account-setup',
  'customers',
  'add-ons',
  'service-plans',
  'online-booking',
  'reporting',
  'business-setup',
  'jobs',
  'employees',
];

// Helper to ensure all feature statuses are present
const ensureAllFeatureStatuses = (
  statuses: Partial<Record<FeatureId, FeatureStatus>>
): Record<FeatureId, FeatureStatus> => {
  const defaultStatus = createStatus('not_attached');
  const result: Record<FeatureId, FeatureStatus> = {} as Record<FeatureId, FeatureStatus>;

  for (const id of ALL_FEATURE_IDS) {
    result[id] = statuses[id] ?? defaultStatus;
  }

  return result;
};

// YAML structure for pros file
interface ProsYamlData {
  defaultWeeklyPlan?: WeeklyPlan;
  notAttached?: FeatureStatus;
}

class ProRegistry {
  private static instance: ProRegistry;
  private pros: Map<string, ProAccount>;
  private configPath: string;
  private prosFilePath: string;

  private constructor() {
    // When running with tsx from src/, __dirname is src/models
    // We need to go up 2 levels to backend/, then into config/onboarding
    this.configPath = path.join(__dirname, '../../config/onboarding');
    this.prosFilePath = path.join(this.configPath, 'pros.yml');
    this.pros = new Map();
    this.load();
  }

  public static getInstance(): ProRegistry {
    if (!ProRegistry.instance) {
      ProRegistry.instance = new ProRegistry();
    }
    return ProRegistry.instance;
  }

  private load(): void {
    if (fs.existsSync(this.prosFilePath)) {
      try {
        const content = fs.readFileSync(this.prosFilePath, 'utf8');
        const data = yaml.load(content);

        // The YAML file has pros as an array (after YAML anchors are resolved)
        // YAML anchors like *defaultWeeklyPlan are resolved during parsing
        if (Array.isArray(data)) {
          for (const proData of data) {
            const pro = this.normalizeProData(proData);
            this.pros.set(pro.id, pro);
          }
        }
      } catch (error) {
        console.error('Error loading pros from YAML:', error);
      }
    }
    console.log(`Loaded ${this.pros.size} pros from YAML`);
  }

  private normalizeProData(data: Record<string, unknown>): ProAccount {
    // Ensure featureStatus has all features
    const featureStatus = ensureAllFeatureStatuses(
      (data.featureStatus as Partial<Record<FeatureId, FeatureStatus>>) || {}
    );

    // Ensure weeklyPlan exists
    const weeklyPlan = (data.weeklyPlan as WeeklyPlan) || defaultWeeklyPlan;

    return {
      id: data.id as string,
      companyName: data.companyName as string,
      ownerName: data.ownerName as string,
      businessType: data.businessType as ProAccount['businessType'],
      plan: data.plan as ProAccount['plan'],
      goal: data.goal as ProAccount['goal'],
      createdAt: data.createdAt as string,
      currentWeek: data.currentWeek as 1 | 2 | 3 | 4,
      featureStatus,
      weeklyPlan,
      completedItems: (data.completedItems as string[]) || [],
      // Pro Facets fields
      billingStatus: data.billingStatus as ProAccount['billingStatus'],
      businessId: data.businessId as string,
      customerStatusDisplayName: data.customerStatusDisplayName as ProAccount['customerStatusDisplayName'],
      fraudStatus: data.fraudStatus as ProAccount['fraudStatus'],
      industry: data.industry as string,
      industryStandardized: data.industryStandardized as string,
      industryType: data.industryType as ProAccount['industryType'],
      leadStatus: data.leadStatus as ProAccount['leadStatus'],
      organizationBinSize: data.organizationBinSize as ProAccount['organizationBinSize'],
      organizationSize: data.organizationSize as number,
      organizationStatus: data.organizationStatus as ProAccount['organizationStatus'],
      organizationUuid: data.organizationUuid as string,
      painPoints: data.painPoints as ProAccount['painPoints'],
      retentionStatus: data.retentionStatus as ProAccount['retentionStatus'],
      segment: data.segment as ProAccount['segment'],
      salesforceAccountId: data.salesforceAccountId as string,
      salesforceLeadId: data.salesforceLeadId as string,
      techReadiness: data.techReadiness as boolean,
    };
  }

  public reload(): void {
    this.pros.clear();
    this.load();
  }

  private save(): void {
    try {
      const prosArray = Array.from(this.pros.values());
      const yamlContent = yaml.dump(prosArray, {
        lineWidth: -1,
        noRefs: true,
        sortKeys: false,
      });
      fs.writeFileSync(this.prosFilePath, yamlContent);
    } catch (error) {
      console.error('Error saving pros to YAML:', error);
    }
  }

  // CRUD operations
  public all(): ProAccount[] {
    return Array.from(this.pros.values());
  }

  public find(id: string): ProAccount | undefined {
    return this.pros.get(id);
  }

  public create(pro: ProAccount): ProAccount {
    this.pros.set(pro.id, pro);
    this.save();
    return pro;
  }

  public update(id: string, updates: Partial<ProAccount>): ProAccount | undefined {
    const existing = this.pros.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.pros.set(id, updated);
    this.save();
    return updated;
  }

  public delete(id: string): boolean {
    const result = this.pros.delete(id);
    if (result) this.save();
    return result;
  }

  public completeItem(proId: string, itemId: string): ProAccount | undefined {
    const pro = this.find(proId);
    if (!pro) return undefined;

    const completedItems = pro.completedItems || [];
    if (!completedItems.includes(itemId)) {
      completedItems.push(itemId);
    }

    return this.update(proId, { completedItems });
  }

  public uncompleteItem(proId: string, itemId: string): ProAccount | undefined {
    const pro = this.find(proId);
    if (!pro) return undefined;

    const completedItems = (pro.completedItems || []).filter(id => id !== itemId);
    return this.update(proId, { completedItems });
  }

  // Mock method to check if pro has customers
  public hasCustomers(proId: string): boolean {
    const pro = this.find(proId);
    if (!pro) return false;
    return (pro.completedItems || []).includes('create-first-customer');
  }

  // Mock method to get customer count
  public getCustomerCount(proId: string): number {
    const pro = this.find(proId);
    if (!pro) return 0;
    return this.hasCustomers(proId) ? 3 : 0; // Mock: 3 customers if they've added one
  }
}

// Export the singleton with static-like methods for backward compatibility
const registry = ProRegistry.getInstance();

export const Pro = {
  all: () => registry.all(),
  find: (id: string) => registry.find(id),
  create: (pro: ProAccount) => registry.create(pro),
  update: (id: string, updates: Partial<ProAccount>) => registry.update(id, updates),
  delete: (id: string) => registry.delete(id),
  completeItem: (proId: string, itemId: string) => registry.completeItem(proId, itemId),
  uncompleteItem: (proId: string, itemId: string) => registry.uncompleteItem(proId, itemId),
  hasCustomers: (proId: string) => registry.hasCustomers(proId),
  getCustomerCount: (proId: string) => registry.getCustomerCount(proId),
  reload: () => registry.reload(),
};
