'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { LandingHero } from './landing-hero';
import { NewUserOnboarding } from './new-user-onboarding';
import { ReadingDashboard } from './reading-dashboard';

type HomePageContentProps = {
  initialView: 'dashboard' | 'landing';
};

export function HomePageContent({ initialView }: HomePageContentProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [signedInView, setSignedInView] = useState<'checking' | 'dashboard' | 'onboarding'>(
    initialView === 'dashboard' ? 'checking' : 'dashboard',
  );

  useEffect(() => {
    let isMounted = true;

    async function loadSignedInView() {
      if (!isLoaded) return;

      if (!isSignedIn || !user?.id) {
        if (isMounted) {
          setSignedInView('dashboard');
        }
        return;
      }

      if (isMounted) {
        setSignedInView('checking');
      }

      try {
        await fetch('/api/users', { method: 'POST' });
        const response = await fetch(`/api/users/profile?userId=${user.id}`);
        const data = await response.json().catch(() => null);

        const hasPet = Boolean(
          typeof data?.pet?.name === 'string' &&
            data.pet.name.trim() &&
            typeof data?.pet?.imageID === 'string' &&
            data.pet.imageID.trim(),
        );
        const goalValue = Number(data?.user?.monthlyGoalTargetPages);
        const hasMonthlyGoal = Number.isFinite(goalValue) && Math.floor(goalValue) > 0;
        const onboardingCompleted = Boolean(data?.user?.onboardingCompleted) && hasPet && hasMonthlyGoal;

        if (isMounted) {
          setSignedInView(onboardingCompleted ? 'dashboard' : 'onboarding');
        }
      } catch {
        if (isMounted) {
          setSignedInView('onboarding');
        }
      }
    }

    void loadSignedInView();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, user?.id]);

  if (!isLoaded) {
    return initialView === 'dashboard' ? (
      <section className="px-6 pb-16 pt-6 sm:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center rounded-[2.5rem] bg-surface-container-low p-6 text-center shadow-[0_18px_40px_var(--card-shadow)]">
          <p className="text-base font-medium text-on-surface-variant">Loading your reading space...</p>
        </div>
      </section>
    ) : (
      <LandingHero />
    );
  }

  if (!isSignedIn) {
    return <LandingHero />;
  }

  if (signedInView === 'checking') {
    return (
      <section className="px-6 pb-16 pt-6 sm:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center rounded-[2.5rem] bg-surface-container-low p-6 text-center shadow-[0_18px_40px_var(--card-shadow)]">
          <p className="text-base font-medium text-on-surface-variant">Loading your reading space...</p>
        </div>
      </section>
    );
  }

  if (signedInView === 'onboarding') {
    return <NewUserOnboarding onCompleteAction={() => setSignedInView('dashboard')} />;
  }

  return <ReadingDashboard />;
}
