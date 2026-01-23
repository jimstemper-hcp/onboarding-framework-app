import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type {
  Feature,
  FeatureId,
  ProAccount,
  FeatureStatus,
  AdoptionStage,
  ViewType,
  OnboardingContextValue,
  WeeklyPlan,
  OnboardingItemDefinition,
  CompletionStep,
  NavigationItem,
  CalendlyLink,
  McpTool,
} from '../types';
import {
  prosApi,
  featuresApi,
  itemsApi,
  completionStepsApi,
  navigationApi,
  callsApi,
  toolsApi,
  healthCheck,
} from '../services/onboardingApi';

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  // ---------------------------------------------------------------------------
  // LOADING & ERROR STATE
  // ---------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // DATA STATE (fetched from API)
  // ---------------------------------------------------------------------------
  const [features, setFeatures] = useState<Feature[]>([]);
  const [onboardingItemsList, setOnboardingItemsList] = useState<OnboardingItemDefinition[]>([]);
  const [completionSteps, setCompletionSteps] = useState<CompletionStep[]>([]);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [callItems, setCallItems] = useState<CalendlyLink[]>([]);
  const [toolItems, setToolItems] = useState<McpTool[]>([]);
  const [pros, setPros] = useState<ProAccount[]>([]);

  // ---------------------------------------------------------------------------
  // UI STATE
  // ---------------------------------------------------------------------------
  const [currentView, setCurrentView] = useState<ViewType>('portal');
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<FeatureId | null>(null);
  const [activeProId, setActiveProId] = useState<string>('');
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // LOAD DATA FROM API ON MOUNT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        // First check if backend is available
        await healthCheck();

        // Fetch all data in parallel
        const [
          prosData,
          featuresData,
          itemsData,
          completionStepsData,
          navData,
          callsData,
          toolsData,
        ] = await Promise.all([
          prosApi.getAll(),
          featuresApi.getAll(),
          itemsApi.getAll(),
          completionStepsApi.getAll(),
          navigationApi.getAll(),
          callsApi.getAll(),
          toolsApi.getAll(),
        ]);

        if (cancelled) return;

        setPros(prosData);
        setFeatures(featuresData);
        setOnboardingItemsList(itemsData);
        setCompletionSteps(completionStepsData);
        setNavigationItems(navData);
        setCallItems(callsData);
        setToolItems(toolsData);

        // Set active pro to first pro
        if (prosData.length > 0) {
          setActiveProId(prosData[0].id);
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to connect to backend: ${message}. Ensure the backend server is running on port 3001.`);
        console.error('Backend connection failed:', err);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // NAVIGATION ACTIONS
  // ---------------------------------------------------------------------------

  const selectPro = useCallback((proId: string | null) => {
    setSelectedProId(proId);
  }, []);

  const selectFeature = useCallback((featureId: FeatureId | null) => {
    setSelectedFeatureId(featureId);
  }, []);

  const openChatWithPrompt = useCallback((prompt: string) => {
    setPendingChatPrompt(prompt);
    setIsChatDrawerOpen(true);
  }, []);

  const clearPendingChatPrompt = useCallback(() => {
    setPendingChatPrompt(null);
  }, []);

  const openChatDrawer = useCallback(() => {
    setIsChatDrawerOpen(true);
  }, []);

  const closeChatDrawer = useCallback(() => {
    setIsChatDrawerOpen(false);
  }, []);

  const toggleChatDrawer = useCallback(() => {
    setIsChatDrawerOpen((prev) => !prev);
  }, []);

  // ---------------------------------------------------------------------------
  // PRO PROGRESS MUTATIONS
  // ---------------------------------------------------------------------------

  const completeTask = useCallback(
    (proId: string, featureId: FeatureId, taskId: string) => {
      setPros((currentPros) =>
        currentPros.map((pro) => {
          if (pro.id !== proId) return pro;

          const featureStatus = pro.featureStatus[featureId];
          if (!featureStatus || featureStatus.completedTasks.includes(taskId)) {
            return pro;
          }

          const updatedStatus: FeatureStatus = {
            ...featureStatus,
            completedTasks: [...featureStatus.completedTasks, taskId],
          };

          return {
            ...pro,
            featureStatus: {
              ...pro.featureStatus,
              [featureId]: updatedStatus,
            },
          };
        })
      );
    },
    []
  );

  const uncompleteTask = useCallback(
    (proId: string, featureId: FeatureId, taskId: string) => {
      setPros((currentPros) =>
        currentPros.map((pro) => {
          if (pro.id !== proId) return pro;

          const featureStatus = pro.featureStatus[featureId];
          if (!featureStatus) return pro;

          const updatedStatus: FeatureStatus = {
            ...featureStatus,
            completedTasks: featureStatus.completedTasks.filter((id) => id !== taskId),
          };

          return {
            ...pro,
            featureStatus: {
              ...pro.featureStatus,
              [featureId]: updatedStatus,
            },
          };
        })
      );
    },
    []
  );

  const setFeatureStage = useCallback(
    (proId: string, featureId: FeatureId, stage: AdoptionStage) => {
      setPros((currentPros) =>
        currentPros.map((pro) => {
          if (pro.id !== proId) return pro;

          const now = new Date().toISOString().split('T')[0];
          const currentStatus = pro.featureStatus[featureId];

          const updatedStatus: FeatureStatus = {
            ...currentStatus,
            stage,
            ...(stage !== 'not_attached' && !currentStatus.attachedAt
              ? { attachedAt: now }
              : {}),
            ...(stage === 'activated' && !currentStatus.activatedAt
              ? { activatedAt: now }
              : {}),
          };

          return {
            ...pro,
            featureStatus: {
              ...pro.featureStatus,
              [featureId]: updatedStatus,
            },
          };
        })
      );
    },
    []
  );

  const incrementUsage = useCallback((proId: string, featureId: FeatureId) => {
    setPros((currentPros) =>
      currentPros.map((pro) => {
        if (pro.id !== proId) return pro;

        const featureStatus = pro.featureStatus[featureId];
        if (!featureStatus) return pro;

        const updatedStatus: FeatureStatus = {
          ...featureStatus,
          usageCount: featureStatus.usageCount + 1,
        };

        return {
          ...pro,
          featureStatus: {
            ...pro.featureStatus,
            [featureId]: updatedStatus,
          },
        };
      })
    );
  }, []);

  // ---------------------------------------------------------------------------
  // FEATURE MUTATIONS (for Admin view)
  // ---------------------------------------------------------------------------

  const updateFeature = useCallback(async (updatedFeature: Feature) => {
    try {
      await featuresApi.update(updatedFeature.id, updatedFeature);
      setFeatures((currentFeatures) =>
        currentFeatures.map((feature) =>
          feature.id === updatedFeature.id ? updatedFeature : feature
        )
      );
    } catch (err) {
      console.error('Failed to update feature:', err);
      throw err;
    }
  }, []);

  const resetFeatures = useCallback(async () => {
    try {
      const data = await featuresApi.getAll();
      setFeatures(data);
    } catch (err) {
      console.error('Failed to reload features:', err);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // ONBOARDING ITEM MUTATIONS (for Admin view)
  // ---------------------------------------------------------------------------

  const updateOnboardingItem = useCallback(async (updatedItem: OnboardingItemDefinition) => {
    try {
      await itemsApi.update(updatedItem.id, updatedItem);
      setOnboardingItemsList((current) =>
        current.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    } catch (err) {
      console.error('Failed to update onboarding item:', err);
      throw err;
    }
  }, []);

  const addOnboardingItem = useCallback(async (newItem: OnboardingItemDefinition) => {
    try {
      await itemsApi.create(newItem);
      setOnboardingItemsList((current) => [...current, newItem]);
    } catch (err) {
      console.error('Failed to add onboarding item:', err);
      throw err;
    }
  }, []);

  const deleteOnboardingItem = useCallback(async (itemId: string) => {
    try {
      await itemsApi.delete(itemId);
      setOnboardingItemsList((current) =>
        current.filter((item) => item.id !== itemId)
      );
    } catch (err) {
      console.error('Failed to delete onboarding item:', err);
      throw err;
    }
  }, []);

  const resetOnboardingItems = useCallback(async () => {
    try {
      const data = await itemsApi.getAll();
      setOnboardingItemsList(data);
    } catch (err) {
      console.error('Failed to reload onboarding items:', err);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // HP-5118: COMPLETION STEP MUTATIONS (for Admin view)
  // ---------------------------------------------------------------------------

  const updateCompletionStep = useCallback(async (updatedStep: CompletionStep) => {
    try {
      await completionStepsApi.update(updatedStep.id, updatedStep);
      setCompletionSteps((current) =>
        current.map((step) =>
          step.id === updatedStep.id ? updatedStep : step
        )
      );
    } catch (err) {
      console.error('Failed to update completion step:', err);
      throw err;
    }
  }, []);

  const addCompletionStep = useCallback(async (newStep: CompletionStep) => {
    try {
      await completionStepsApi.create(newStep);
      setCompletionSteps((current) => [...current, newStep]);
    } catch (err) {
      console.error('Failed to add completion step:', err);
      throw err;
    }
  }, []);

  const deleteCompletionStep = useCallback(async (stepId: string) => {
    try {
      await completionStepsApi.delete(stepId);
      setCompletionSteps((current) =>
        current.filter((step) => step.id !== stepId)
      );
    } catch (err) {
      console.error('Failed to delete completion step:', err);
      throw err;
    }
  }, []);

  const resetCompletionSteps = useCallback(async () => {
    try {
      const data = await completionStepsApi.getAll();
      setCompletionSteps(data);
    } catch (err) {
      console.error('Failed to reload completion steps:', err);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // NAVIGATION MUTATIONS (for Admin view)
  // ---------------------------------------------------------------------------

  const updateNavigationItem = useCallback(async (updatedItem: NavigationItem) => {
    try {
      await navigationApi.update(updatedItem.slugId || updatedItem.name, updatedItem);
      setNavigationItems((current) =>
        current.map((item) =>
          item.slugId === updatedItem.slugId ? updatedItem : item
        )
      );
    } catch (err) {
      console.error('Failed to update navigation item:', err);
      throw err;
    }
  }, []);

  const addNavigationItem = useCallback(async (newItem: NavigationItem) => {
    try {
      await navigationApi.create(newItem);
      setNavigationItems((current) => [...current, newItem]);
    } catch (err) {
      console.error('Failed to add navigation item:', err);
      throw err;
    }
  }, []);

  const deleteNavigationItem = useCallback(async (itemId: string) => {
    try {
      await navigationApi.delete(itemId);
      setNavigationItems((current) =>
        current.filter((item) => item.slugId !== itemId)
      );
    } catch (err) {
      console.error('Failed to delete navigation item:', err);
      throw err;
    }
  }, []);

  const resetNavigation = useCallback(async () => {
    try {
      const data = await navigationApi.getAll();
      setNavigationItems(data);
    } catch (err) {
      console.error('Failed to reload navigation items:', err);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // CALLS MUTATIONS (for Admin view)
  // ---------------------------------------------------------------------------

  const updateCallItem = useCallback(async (updatedItem: CalendlyLink) => {
    try {
      await callsApi.update(updatedItem.slugId || updatedItem.name, updatedItem);
      setCallItems((current) =>
        current.map((item) =>
          item.slugId === updatedItem.slugId ? updatedItem : item
        )
      );
    } catch (err) {
      console.error('Failed to update call item:', err);
      throw err;
    }
  }, []);

  const addCallItem = useCallback(async (newItem: CalendlyLink) => {
    try {
      await callsApi.create(newItem);
      setCallItems((current) => [...current, newItem]);
    } catch (err) {
      console.error('Failed to add call item:', err);
      throw err;
    }
  }, []);

  const deleteCallItem = useCallback(async (itemId: string) => {
    try {
      await callsApi.delete(itemId);
      setCallItems((current) =>
        current.filter((item) => item.slugId !== itemId)
      );
    } catch (err) {
      console.error('Failed to delete call item:', err);
      throw err;
    }
  }, []);

  const resetCalls = useCallback(async () => {
    try {
      const data = await callsApi.getAll();
      setCallItems(data);
    } catch (err) {
      console.error('Failed to reload call items:', err);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // TOOLS MUTATIONS (for Admin view)
  // ---------------------------------------------------------------------------

  const updateToolItem = useCallback(async (updatedItem: McpTool) => {
    try {
      await toolsApi.update(updatedItem.name, updatedItem);
      setToolItems((current) =>
        current.map((item) =>
          item.name === updatedItem.name ? updatedItem : item
        )
      );
    } catch (err) {
      console.error('Failed to update tool item:', err);
      throw err;
    }
  }, []);

  const addToolItem = useCallback(async (newItem: McpTool) => {
    try {
      await toolsApi.create(newItem);
      setToolItems((current) => [...current, newItem]);
    } catch (err) {
      console.error('Failed to add tool item:', err);
      throw err;
    }
  }, []);

  const deleteToolItem = useCallback(async (itemId: string) => {
    try {
      await toolsApi.delete(itemId);
      setToolItems((current) =>
        current.filter((item) => item.name !== itemId)
      );
    } catch (err) {
      console.error('Failed to delete tool item:', err);
      throw err;
    }
  }, []);

  const resetTools = useCallback(async () => {
    try {
      const data = await toolsApi.getAll();
      setToolItems(data);
    } catch (err) {
      console.error('Failed to reload tool items:', err);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // PRO CRUD MUTATIONS (for Sample Pros view)
  // ---------------------------------------------------------------------------

  const addPro = useCallback((pro: ProAccount) => {
    setPros((currentPros) => [...currentPros, pro]);
  }, []);

  const updatePro = useCallback(async (updatedPro: ProAccount) => {
    try {
      await prosApi.update(updatedPro.id, updatedPro);
      setPros((currentPros) =>
        currentPros.map((pro) =>
          pro.id === updatedPro.id ? updatedPro : pro
        )
      );
    } catch (err) {
      console.error('Failed to update pro:', err);
      throw err;
    }
  }, []);

  const deletePro = useCallback((proId: string) => {
    setPros((currentPros) => currentPros.filter((pro) => pro.id !== proId));
  }, []);

  const updateProFeatureStatus = useCallback(
    (proId: string, featureId: FeatureId, status: FeatureStatus) => {
      setPros((currentPros) =>
        currentPros.map((pro) => {
          if (pro.id !== proId) return pro;
          return {
            ...pro,
            featureStatus: {
              ...pro.featureStatus,
              [featureId]: status,
            },
          };
        })
      );
    },
    []
  );

  const updateProWeeklyPlan = useCallback(
    (proId: string, weeklyPlan: WeeklyPlan) => {
      setPros((currentPros) =>
        currentPros.map((pro) =>
          pro.id === proId ? { ...pro, weeklyPlan } : pro
        )
      );
    },
    []
  );

  const updateProCompletedItems = useCallback(
    async (proId: string, completedItems: string[]) => {
      try {
        await prosApi.update(proId, { completedItems } as Partial<ProAccount>);
        setPros((currentPros) =>
          currentPros.map((pro) =>
            pro.id === proId ? { ...pro, completedItems } : pro
          )
        );
      } catch (err) {
        console.error('Failed to update pro completed items:', err);
        throw err;
      }
    },
    []
  );

  // ---------------------------------------------------------------------------
  // DERIVED DATA HELPERS
  // ---------------------------------------------------------------------------

  const getFeatureById = useCallback(
    (featureId: FeatureId): Feature | undefined => {
      return features.find((f) => f.id === featureId);
    },
    [features]
  );

  const getProById = useCallback(
    (proId: string): ProAccount | undefined => {
      return pros.find((p) => p.id === proId);
    },
    [pros]
  );

  const getProFeatureStatus = useCallback(
    (proId: string, featureId: FeatureId): FeatureStatus | undefined => {
      const pro = pros.find((p) => p.id === proId);
      return pro?.featureStatus[featureId];
    },
    [pros]
  );

  const getStageContext = useCallback(
    (featureId: FeatureId, stage: AdoptionStage) => {
      const feature = features.find((f) => f.id === featureId);
      if (!feature) return undefined;

      const stageMap: Record<AdoptionStage, keyof Feature['stages']> = {
        not_attached: 'notAttached',
        attached: 'attached',
        activated: 'activated',
      };

      return feature.stages[stageMap[stage]];
    },
    [features]
  );

  // ---------------------------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------------------------

  const contextValue = useMemo<OnboardingContextValue>(
    () => ({
      // Loading state
      isLoading,
      error,

      // State
      features,
      pros,
      currentView,
      selectedProId,
      selectedFeatureId,
      activeProId,
      pendingChatPrompt,
      isChatDrawerOpen,

      // Navigation
      setCurrentView,
      selectPro,
      selectFeature,
      setActivePro: setActiveProId,
      openChatWithPrompt,
      clearPendingChatPrompt,
      openChatDrawer,
      closeChatDrawer,
      toggleChatDrawer,

      // Pro progress mutations
      completeTask,
      uncompleteTask,
      setFeatureStage,
      incrementUsage,

      // Pro CRUD mutations
      addPro,
      updatePro,
      deletePro,
      updateProFeatureStatus,
      updateProWeeklyPlan,
      updateProCompletedItems,

      // Feature mutations
      updateFeature,
      resetFeatures,

      // Onboarding item mutations
      onboardingItemsList,
      updateOnboardingItem,
      addOnboardingItem,
      deleteOnboardingItem,
      resetOnboardingItems,

      // HP-5118: Completion steps mutations
      completionSteps,
      updateCompletionStep,
      addCompletionStep,
      deleteCompletionStep,
      resetCompletionSteps,

      // Navigation mutations
      navigationItems,
      updateNavigationItem,
      addNavigationItem,
      deleteNavigationItem,
      resetNavigation,

      // Calls mutations
      callItems,
      updateCallItem,
      addCallItem,
      deleteCallItem,
      resetCalls,

      // Tools mutations
      toolItems,
      updateToolItem,
      addToolItem,
      deleteToolItem,
      resetTools,

      // Helpers
      getFeatureById,
      getProById,
      getProFeatureStatus,
      getStageContext,
    }),
    [
      isLoading,
      error,
      features,
      pros,
      currentView,
      selectedProId,
      selectedFeatureId,
      activeProId,
      pendingChatPrompt,
      isChatDrawerOpen,
      selectPro,
      selectFeature,
      openChatWithPrompt,
      clearPendingChatPrompt,
      openChatDrawer,
      closeChatDrawer,
      toggleChatDrawer,
      completeTask,
      uncompleteTask,
      setFeatureStage,
      incrementUsage,
      addPro,
      updatePro,
      deletePro,
      updateProFeatureStatus,
      updateProWeeklyPlan,
      updateProCompletedItems,
      updateFeature,
      resetFeatures,
      onboardingItemsList,
      updateOnboardingItem,
      addOnboardingItem,
      deleteOnboardingItem,
      resetOnboardingItems,
      completionSteps,
      updateCompletionStep,
      addCompletionStep,
      deleteCompletionStep,
      resetCompletionSteps,
      navigationItems,
      updateNavigationItem,
      addNavigationItem,
      deleteNavigationItem,
      resetNavigation,
      callItems,
      updateCallItem,
      addCallItem,
      deleteCallItem,
      resetCalls,
      toolItems,
      updateToolItem,
      addToolItem,
      deleteToolItem,
      resetTools,
      getFeatureById,
      getProById,
      getProFeatureStatus,
      getStageContext,
    ]
  );

  // Show loading state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#6b7280' }}>Connecting to backend...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#dc2626',
          fontSize: '24px',
        }}>
          !
        </div>
        <h2 style={{ color: '#dc2626', margin: 0 }}>Backend Connection Error</h2>
        <p style={{ color: '#6b7280', maxWidth: '500px' }}>{error}</p>
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <code style={{
            backgroundColor: '#f3f4f6',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
          }}>
            cd backend && npm run dev
          </code>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Get the currently selected pro (for Frontline view)
 */
export function useSelectedPro(): ProAccount | undefined {
  const { selectedProId, getProById } = useOnboarding();
  return selectedProId ? getProById(selectedProId) : undefined;
}

/**
 * Get the currently active pro (for Portal view - the "logged in" user)
 */
export function useActivePro(): ProAccount | undefined {
  const { activeProId, getProById } = useOnboarding();
  return getProById(activeProId);
}

/**
 * Get the currently selected feature
 */
export function useSelectedFeature(): Feature | undefined {
  const { selectedFeatureId, getFeatureById } = useOnboarding();
  return selectedFeatureId ? getFeatureById(selectedFeatureId) : undefined;
}

/**
 * Get a specific pro's status for a specific feature
 */
export function useProFeatureStatus(
  proId: string | undefined,
  featureId: FeatureId
): FeatureStatus | undefined {
  const { getProFeatureStatus } = useOnboarding();
  return proId ? getProFeatureStatus(proId, featureId) : undefined;
}
