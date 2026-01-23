import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import type {
  Feature,
  OnboardingItemDefinition,
  CompletionStep,
  NavigationItem,
  CalendlyLink,
  McpTool,
  FeatureId,
} from '../../types';

// Import default data from frontend (for now, until we move to YAML)
// We'll load from YAML files when they exist, fallback to in-memory defaults

interface FeatureRegistryData {
  features: Map<string, Feature>;
  items: Map<string, OnboardingItemDefinition>;
  completionSteps: Map<string, CompletionStep>;
  navigation: Map<string, NavigationItem>;
  calendly: Map<string, CalendlyLink>;
  tools: Map<string, McpTool>;
}

class FeatureRegistryClass {
  private static instance: FeatureRegistryClass;
  private data: FeatureRegistryData;
  private configPath: string;

  private constructor() {
    // When running with tsx from src/, __dirname is src/services/onboarding
    // We need to go up 3 levels to backend/, then into config/onboarding
    this.configPath = path.join(__dirname, '../../../config/onboarding');
    this.data = {
      features: new Map(),
      items: new Map(),
      completionSteps: new Map(),
      navigation: new Map(),
      calendly: new Map(),
      tools: new Map(),
    };
    this.load();
  }

  public static getInstance(): FeatureRegistryClass {
    if (!FeatureRegistryClass.instance) {
      FeatureRegistryClass.instance = new FeatureRegistryClass();
    }
    return FeatureRegistryClass.instance;
  }

  private load(): void {
    this.loadFeatures();
    this.loadItems();
    this.loadCompletionSteps();
    this.loadNavigation();
    this.loadCalendly();
    this.loadTools();
  }

  private loadFeatures(): void {
    const featuresPath = path.join(this.configPath, 'features');
    if (fs.existsSync(featuresPath)) {
      const files = fs.readdirSync(featuresPath).filter((f) => f.endsWith('.yml'));
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(featuresPath, file), 'utf8');
          const feature = yaml.load(content) as Feature;
          if (feature && feature.id) {
            this.data.features.set(feature.id, feature);
          }
        } catch (error) {
          console.error(`Error loading feature from ${file}:`, error);
        }
      }
    }
    console.log(`Loaded ${this.data.features.size} features from YAML`);
  }

  private loadItems(): void {
    const itemsPath = path.join(this.configPath, 'items.yml');
    if (fs.existsSync(itemsPath)) {
      try {
        const content = fs.readFileSync(itemsPath, 'utf8');
        const items = yaml.load(content) as OnboardingItemDefinition[];
        if (Array.isArray(items)) {
          for (const item of items) {
            this.data.items.set(item.id, item);
          }
        }
      } catch (error) {
        console.error('Error loading items:', error);
      }
    }
    console.log(`Loaded ${this.data.items.size} onboarding items from YAML`);
  }

  private loadCompletionSteps(): void {
    const stepsPath = path.join(this.configPath, 'completion-steps.yml');
    if (fs.existsSync(stepsPath)) {
      try {
        const content = fs.readFileSync(stepsPath, 'utf8');
        const steps = yaml.load(content) as CompletionStep[];
        if (Array.isArray(steps)) {
          for (const step of steps) {
            this.data.completionSteps.set(step.id, step);
          }
        }
      } catch (error) {
        console.error('Error loading completion steps:', error);
      }
    }
    console.log(`Loaded ${this.data.completionSteps.size} completion steps from YAML`);
  }

  private loadNavigation(): void {
    const navPath = path.join(this.configPath, 'navigation.yml');
    if (fs.existsSync(navPath)) {
      try {
        const content = fs.readFileSync(navPath, 'utf8');
        const items = yaml.load(content) as NavigationItem[];
        if (Array.isArray(items)) {
          for (const item of items) {
            const key = item.slugId || item.name;
            this.data.navigation.set(key, item);
          }
        }
      } catch (error) {
        console.error('Error loading navigation:', error);
      }
    }
    console.log(`Loaded ${this.data.navigation.size} navigation items from YAML`);
  }

  private loadCalendly(): void {
    const calendlyPath = path.join(this.configPath, 'calendly.yml');
    if (fs.existsSync(calendlyPath)) {
      try {
        const content = fs.readFileSync(calendlyPath, 'utf8');
        const items = yaml.load(content) as CalendlyLink[];
        if (Array.isArray(items)) {
          for (const item of items) {
            const key = item.slugId || item.name;
            this.data.calendly.set(key, item);
          }
        }
      } catch (error) {
        console.error('Error loading calendly:', error);
      }
    }
    console.log(`Loaded ${this.data.calendly.size} calendly links from YAML`);
  }

  private loadTools(): void {
    const toolsPath = path.join(this.configPath, 'tools.yml');
    if (fs.existsSync(toolsPath)) {
      try {
        const content = fs.readFileSync(toolsPath, 'utf8');
        const items = yaml.load(content) as McpTool[];
        if (Array.isArray(items)) {
          for (const item of items) {
            this.data.tools.set(item.name, item);
          }
        }
      } catch (error) {
        console.error('Error loading tools:', error);
      }
    }
    console.log(`Loaded ${this.data.tools.size} MCP tools from YAML`);
  }

  public reload(): void {
    this.data = {
      features: new Map(),
      items: new Map(),
      completionSteps: new Map(),
      navigation: new Map(),
      calendly: new Map(),
      tools: new Map(),
    };
    this.load();
  }

  // Getters
  public getAllFeatures(): Feature[] {
    return Array.from(this.data.features.values());
  }

  public findFeature(featureId: string): Feature | undefined {
    return this.data.features.get(featureId);
  }

  public getAllItems(): OnboardingItemDefinition[] {
    return Array.from(this.data.items.values());
  }

  public findItem(itemId: string): OnboardingItemDefinition | undefined {
    return this.data.items.get(itemId);
  }

  // HP-5118: Completion Steps getters
  public getAllCompletionSteps(): CompletionStep[] {
    return Array.from(this.data.completionSteps.values());
  }

  public findCompletionStep(stepId: string): CompletionStep | undefined {
    return this.data.completionSteps.get(stepId);
  }

  public getAllNavigation(): NavigationItem[] {
    return Array.from(this.data.navigation.values());
  }

  public findNavigation(slugId: string): NavigationItem | undefined {
    return this.data.navigation.get(slugId);
  }

  public getAllCalendly(): CalendlyLink[] {
    return Array.from(this.data.calendly.values());
  }

  public findCalendly(slugId: string): CalendlyLink | undefined {
    return this.data.calendly.get(slugId);
  }

  public getAllTools(): McpTool[] {
    return Array.from(this.data.tools.values());
  }

  public findTool(name: string): McpTool | undefined {
    return this.data.tools.get(name);
  }

  // Setters (for admin updates)
  public setFeature(feature: Feature): void {
    this.data.features.set(feature.id, feature);
    this.saveFeatureToYaml(feature);
  }

  public setItem(item: OnboardingItemDefinition): void {
    this.data.items.set(item.id, item);
    this.saveItemsToYaml();
  }

  // HP-5118: Completion Steps setters
  public setCompletionStep(step: CompletionStep): void {
    this.data.completionSteps.set(step.id, step);
    this.saveCompletionStepsToYaml();
  }

  public setNavigation(item: NavigationItem): void {
    const key = item.slugId || item.name;
    this.data.navigation.set(key, item);
    this.saveNavigationToYaml();
  }

  public setCalendly(item: CalendlyLink): void {
    const key = item.slugId || item.name;
    this.data.calendly.set(key, item);
    this.saveCalendlyToYaml();
  }

  public setTool(tool: McpTool): void {
    this.data.tools.set(tool.name, tool);
    this.saveToolsToYaml();
  }

  // Delete methods
  public deleteItem(itemId: string): boolean {
    const result = this.data.items.delete(itemId);
    if (result) this.saveItemsToYaml();
    return result;
  }

  // HP-5118: Completion Steps delete
  public deleteCompletionStep(stepId: string): boolean {
    const result = this.data.completionSteps.delete(stepId);
    if (result) this.saveCompletionStepsToYaml();
    return result;
  }

  public deleteNavigation(slugId: string): boolean {
    const result = this.data.navigation.delete(slugId);
    if (result) this.saveNavigationToYaml();
    return result;
  }

  public deleteCalendly(slugId: string): boolean {
    const result = this.data.calendly.delete(slugId);
    if (result) this.saveCalendlyToYaml();
    return result;
  }

  public deleteTool(name: string): boolean {
    const result = this.data.tools.delete(name);
    if (result) this.saveToolsToYaml();
    return result;
  }

  // Save to YAML methods
  private saveFeatureToYaml(feature: Feature): void {
    const featuresPath = path.join(this.configPath, 'features');
    if (!fs.existsSync(featuresPath)) {
      fs.mkdirSync(featuresPath, { recursive: true });
    }
    const filePath = path.join(featuresPath, `${feature.id}.yml`);
    fs.writeFileSync(filePath, yaml.dump(feature, { lineWidth: -1 }));
  }

  private saveItemsToYaml(): void {
    const itemsPath = path.join(this.configPath, 'items.yml');
    const items = this.getAllItems();
    fs.writeFileSync(itemsPath, yaml.dump(items, { lineWidth: -1 }));
  }

  // HP-5118: Completion Steps save
  private saveCompletionStepsToYaml(): void {
    const stepsPath = path.join(this.configPath, 'completion-steps.yml');
    const steps = this.getAllCompletionSteps();
    fs.writeFileSync(stepsPath, yaml.dump(steps, { lineWidth: -1 }));
  }

  private saveNavigationToYaml(): void {
    const navPath = path.join(this.configPath, 'navigation.yml');
    const items = this.getAllNavigation();
    fs.writeFileSync(navPath, yaml.dump(items, { lineWidth: -1 }));
  }

  private saveCalendlyToYaml(): void {
    const calendlyPath = path.join(this.configPath, 'calendly.yml');
    const items = this.getAllCalendly();
    fs.writeFileSync(calendlyPath, yaml.dump(items, { lineWidth: -1 }));
  }

  private saveToolsToYaml(): void {
    const toolsPath = path.join(this.configPath, 'tools.yml');
    const items = this.getAllTools();
    fs.writeFileSync(toolsPath, yaml.dump(items, { lineWidth: -1 }));
  }
}

export const FeatureRegistry = FeatureRegistryClass.getInstance();
