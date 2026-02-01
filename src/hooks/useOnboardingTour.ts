import { useState, useEffect, useCallback } from 'react';

const TOUR_COMPLETED_KEY = 'skilllearners_onboarding_completed';
const TOUR_SKIPPED_KEY = 'skilllearners_onboarding_skipped';

interface UseOnboardingTourReturn {
  isTourOpen: boolean;
  startTour: () => void;
  closeTour: () => void;
  completeTour: () => void;
  skipTour: () => void;
  resetTour: () => void;
  hasTourCompleted: boolean;
}

export const useOnboardingTour = (userId?: string): UseOnboardingTourReturn => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [hasTourCompleted, setHasTourCompleted] = useState(true);

  const getStorageKey = useCallback((key: string) => {
    return userId ? `${key}_${userId}` : key;
  }, [userId]);

  // Check if tour has been completed or skipped
  useEffect(() => {
    const completed = localStorage.getItem(getStorageKey(TOUR_COMPLETED_KEY));
    const skipped = localStorage.getItem(getStorageKey(TOUR_SKIPPED_KEY));
    
    if (completed === 'true' || skipped === 'true') {
      setHasTourCompleted(true);
    } else {
      setHasTourCompleted(false);
      // Auto-start tour for new users after a short delay
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [getStorageKey, userId]);

  const startTour = useCallback(() => {
    setIsTourOpen(true);
  }, []);

  const closeTour = useCallback(() => {
    setIsTourOpen(false);
  }, []);

  const completeTour = useCallback(() => {
    localStorage.setItem(getStorageKey(TOUR_COMPLETED_KEY), 'true');
    setHasTourCompleted(true);
    setIsTourOpen(false);
  }, [getStorageKey]);

  const skipTour = useCallback(() => {
    localStorage.setItem(getStorageKey(TOUR_SKIPPED_KEY), 'true');
    setHasTourCompleted(true);
    setIsTourOpen(false);
  }, [getStorageKey]);

  const resetTour = useCallback(() => {
    localStorage.removeItem(getStorageKey(TOUR_COMPLETED_KEY));
    localStorage.removeItem(getStorageKey(TOUR_SKIPPED_KEY));
    setHasTourCompleted(false);
  }, [getStorageKey]);

  return {
    isTourOpen,
    startTour,
    closeTour,
    completeTour,
    skipTour,
    resetTour,
    hasTourCompleted
  };
};
