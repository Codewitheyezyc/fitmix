'use client';

import { useStore } from '@/lib/store';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

export default function OnboardingGate() {
  const { isAuthenticated, isAuthReady, currentUser } = useStore();

  // Show onboarding only for authenticated new users who haven't completed it
  if (!isAuthReady || !isAuthenticated) return null;
  if (currentUser.hasCompletedOnboarding === true) return null;
  if (!currentUser.username) return null; // Guest template, not yet a real user

  return <OnboardingModal />;
}
