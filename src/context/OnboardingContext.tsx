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

  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [pros, setPros] = useState<ProAccount[]>(initialPros);
  const [currentView, setCurrentView] = useState<ViewType>('portal');
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<FeatureId | null>(null);
  // The "logged in" pro for the Portal view - defaults to first pro
  const [activeProId, setActiveProId] = useState<string>(initialPros[0]?.id ?? '');

  // ---------------------------------------------------------------------------
  // NAVIGATION ACTIONS
  // ---------------------------------------------------------------------------

  const selectPro = useCallback((proId: string | null) => {
    setSelectedProId(proId);
  }, []);

  const selectFeature = useCallback((featureId: FeatureId | null) => {
    setSelectedFeatureId(featureId);
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
    setFeatures((currentFeatures) =>
      currentFeatures.map((feature) =>
        feature.id === updatedFeature.id ? updatedFeature : feature
      )
    );
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

      // Navigation
      setCurrentView,
      selectPro,
      selectFeature,
      setActivePro: setActiveProId,

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

      // Feature mutations
      updateFeature,

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
      selectPro,
      selectFeature,
      completeTask,
      uncompleteTask,
      setFeatureStage,
      incrementUsage,
      addPro,
      updatePro,
      deletePro,
      updateProFeatureStatus,
      updateProWeeklyPlan,
      updateFeature,
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
