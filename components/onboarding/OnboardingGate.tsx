'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

export default function OnboardingGate() {
  const { isAuthenticated, isAuthReady, currentUser } = useStore();
  const [isLocallyDismissed, setIsLocallyDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('fitmix_onboarding_done') === 'true') {
        setIsLocallyDismissed(true);
      }
    }
  }, []);

  // Show onboarding ONLY for authenticated users who explicitly have hasCompletedOnboarding === false
  // Existing accounts or users who already completed it will have hasCompletedOnboarding === true
  if (!isAuthReady || !isAuthenticated) return null;
  if (isLocallyDismissed) return null;
  if (!currentUser || currentUser.hasCompletedOnboarding !== false) return null;
  if (!currentUser.username || currentUser.id === 'guest') return null;

  return <OnboardingModal />;
}
