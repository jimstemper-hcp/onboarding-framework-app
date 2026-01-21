import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
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
} from '../types';
import { features as initialFeatures } from '../data/features';
import { mockPros as initialPros } from '../data/mockPros';

// =============================================================================
// LOCAL STORAGE PERSISTENCE
// =============================================================================

const STORAGE_KEYS = {
  features: 'hcp-context-features',
  // Future: pros, navigation, etc.
};

/**
 * Load data from localStorage or fall back to initial data
 */
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Save data to localStorage
 */
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

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
  // STATE
  // ---------------------------------------------------------------------------

  const [features, setFeatures] = useState<Feature[]>(() =>
    loadFromStorage(STORAGE_KEYS.features, initialFeatures)
  );
  const [pros, setPros] = useState<ProAccount[]>(initialPros);
  const [currentView, setCurrentView] = useState<ViewType>('portal');
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<FeatureId | null>(null);
  // The "logged in" pro for the Portal view - defaults to first pro
  const [activeProId, setActiveProId] = useState<string>(initialPros[0]?.id ?? '');

  // Chat integration - pending prompt to send when chat view opens
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);

  // Chat drawer state
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

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
            ...((stage === 'activated' || stage === 'engaged') && !currentStatus.activatedAt
              ? { activatedAt: now }
              : {}),
            ...(stage === 'engaged' && !currentStatus.engagedAt
              ? { engagedAt: now }
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

  const updateFeature = useCallback((updatedFeature: Feature) => {
    setFeatures((currentFeatures) => {
      const newFeatures = currentFeatures.map((feature) =>
        feature.id === updatedFeature.id ? updatedFeature : feature
      );
      saveToStorage(STORAGE_KEYS.features, newFeatures);
      return newFeatures;
    });
  }, []);

  const resetFeatures = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.features);
    setFeatures(initialFeatures);
  }, []);

  // ---------------------------------------------------------------------------
  // PRO CRUD MUTATIONS (for Sample Pros view)
  // ---------------------------------------------------------------------------

  const addPro = useCallback((pro: ProAccount) => {
    setPros((currentPros) => [...currentPros, pro]);
  }, []);

  const updatePro = useCallback((updatedPro: ProAccount) => {
    setPros((currentPros) =>
      currentPros.map((pro) =>
        pro.id === updatedPro.id ? updatedPro : pro
      )
    );
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
    (proId: string, completedItems: string[]) => {
      setPros((currentPros) =>
        currentPros.map((pro) =>
          pro.id === proId ? { ...pro, completedItems } : pro
        )
      );
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
        engaged: 'engaged',
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

      // Helpers
      getFeatureById,
      getProById,
      getProFeatureStatus,
      getStageContext,
    }),
    [
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
      getFeatureById,
      getProById,
      getProFeatureStatus,
      getStageContext,
    ]
  );

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
