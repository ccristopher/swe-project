'use client';

import { useUser } from '@clerk/nextjs';

type HomeView = 'dashboard' | 'landing';

export function useHomeView(initialView: HomeView) {
  const { isLoaded, isSignedIn } = useUser();
  const view = isLoaded ? (isSignedIn ? 'dashboard' : 'landing') : initialView;

  return {
    isLoaded,
    isSignedIn,
    view,
  } as const;
}
