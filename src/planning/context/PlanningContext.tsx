// =============================================================================
// PLANNING MODE - REACT CONTEXT
// =============================================================================
// This context manages the planning mode state across the application.
// It handles mode toggling, element inspection, and feedback collection.
//
// LLM INSTRUCTIONS:
// - Import this context in any component that needs planning mode access
// - Use usePlanningMode() hook to access state and actions
// - Feedback is persisted to localStorage automatically
// - Mode preference is also persisted to localStorage
// =============================================================================

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  PlanningModeContextValue,
  PlanningFeedback,
  PlanningTab,
  PlannableId,
  PlannableElement,
  PlannableCategory,
  PageId,
  SpecViewMode,
} from '../types';
import { plannableRegistry } from '../registry/plannableRegistry';

// -----------------------------------------------------------------------------
// LOCALSTORAGE KEYS
// -----------------------------------------------------------------------------

const STORAGE_KEYS = {
  MODE: 'planning-mode-enabled',
  FEEDBACK: 'planning-mode-feedback',
} as const;

// -----------------------------------------------------------------------------
// CONTEXT
// -----------------------------------------------------------------------------

const PlanningModeContext = createContext<PlanningModeContextValue | null>(null);

// -----------------------------------------------------------------------------
// PROVIDER
// -----------------------------------------------------------------------------

interface PlanningModeProviderProps {
  children: ReactNode;
}

export function PlanningModeProvider({ children }: PlanningModeProviderProps) {
  // State
  const [isPlanningMode, setIsPlanningMode] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.MODE);
    return stored === 'true';
  });

  const [activeElementId, setActiveElementId] = useState<PlannableId | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PlanningTab>('spec');
  const [currentPageId, setCurrentPageId] = useState<PageId | null>(null);
  const [specViewMode, setSpecViewModeState] = useState<SpecViewMode>('formatted');

  const [feedbackItems, setFeedbackItems] = useState<PlanningFeedback[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Persist mode to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODE, String(isPlanningMode));
  }, [isPlanningMode]);

  // Persist feedback to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackItems));
  }, [feedbackItems]);

  // ---------------------------------------------------------------------------
  // MODE ACTIONS
  // ---------------------------------------------------------------------------

  const togglePlanningMode = useCallback(() => {
    setIsPlanningMode((prev) => !prev);
  }, []);

  const setPlanningMode = useCallback((enabled: boolean) => {
    setIsPlanningMode(enabled);
  }, []);

  // ---------------------------------------------------------------------------
  // ELEMENT INSPECTION ACTIONS
  // ---------------------------------------------------------------------------

  const openElement = useCallback((elementId: PlannableId) => {
    setActiveElementId(elementId);
    setActiveTab('spec');
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setActiveElementId(null);
  }, []);

  const setActiveTabAction = useCallback((tab: PlanningTab) => {
    setActiveTab(tab);
  }, []);

  // ---------------------------------------------------------------------------
  // PAGE-AWARE DRAWER ACTIONS
  // ---------------------------------------------------------------------------

  const setCurrentPage = useCallback((pageId: PageId) => {
    setCurrentPageId(pageId);
  }, []);

  const toggleSpecViewMode = useCallback(() => {
    setSpecViewModeState((prev) => (prev === 'formatted' ? 'markdown' : 'formatted'));
  }, []);

  const setSpecViewMode = useCallback((mode: SpecViewMode) => {
    setSpecViewModeState(mode);
  }, []);

  // ---------------------------------------------------------------------------
  // FEEDBACK ACTIONS
  // ---------------------------------------------------------------------------

  const submitFeedback = useCallback(
    (elementId: PlannableId, elementName: string, feedback: string, submittedBy?: string) => {
      const newFeedback: PlanningFeedback = {
        id: crypto.randomUUID(),
        elementId,
        elementName,
        feedback,
        submittedAt: new Date().toISOString(),
        submittedBy,
      };
      setFeedbackItems((prev) => [newFeedback, ...prev]);
    },
    []
  );

  const getFeedbackForElement = useCallback(
    (elementId: PlannableId): PlanningFeedback[] => {
      return feedbackItems.filter((f) => f.elementId === elementId);
    },
    [feedbackItems]
  );

  const clearFeedback = useCallback((feedbackId: string) => {
    setFeedbackItems((prev) => prev.filter((f) => f.id !== feedbackId));
  }, []);

  // ---------------------------------------------------------------------------
  // REGISTRY ACCESS
  // ---------------------------------------------------------------------------

  const getElement = useCallback((elementId: PlannableId): PlannableElement | undefined => {
    return plannableRegistry.get(elementId);
  }, []);

  const getAllElements = useCallback((): PlannableElement[] => {
    return Array.from(plannableRegistry.values());
  }, []);

  const getElementsByCategory = useCallback((category: PlannableCategory): PlannableElement[] => {
    return Array.from(plannableRegistry.values()).filter((el) => el.category === category);
  }, []);

  // ---------------------------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------------------------

  const contextValue: PlanningModeContextValue = {
    // State
    isPlanningMode,
    activeElementId,
    isModalOpen,
    activeTab,
    currentPageId,
    specViewMode,
    feedbackItems,

    // Mode actions
    togglePlanningMode,
    setPlanningMode,

    // Element inspection actions
    openElement,
    closeModal,
    setActiveTab: setActiveTabAction,

    // Page-aware drawer actions
    setCurrentPage,
    toggleSpecViewMode,
    setSpecViewMode,

    // Feedback actions
    submitFeedback,
    getFeedbackForElement,
    clearFeedback,

    // Registry access
    getElement,
    getAllElements,
    getElementsByCategory,
  };

  return (
    <PlanningModeContext.Provider value={contextValue}>
      {children}
    </PlanningModeContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// HOOK
// -----------------------------------------------------------------------------

/**
 * Hook to access planning mode context.
 *
 * LLM INSTRUCTIONS:
 * - Use this hook in any component that needs planning mode access
 * - Example: const { isPlanningMode, openElement } = usePlanningMode();
 * - Throws if used outside PlanningModeProvider
 */
export function usePlanningMode(): PlanningModeContextValue {
  const context = useContext(PlanningModeContext);
  if (!context) {
    throw new Error('usePlanningMode must be used within a PlanningModeProvider');
  }
  return context;
}

export default PlanningModeContext;
