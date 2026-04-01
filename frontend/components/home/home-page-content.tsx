'use client';

import { useHomeView } from '@/hooks/use-home-view';
import { LandingHero } from './landing-hero';
import { ReadingDashboard } from './reading-dashboard';

type HomePageContentProps = {
  initialView: 'dashboard' | 'landing';
};

export function HomePageContent({ initialView }: HomePageContentProps) {
  const { view } = useHomeView(initialView);

  return view === 'dashboard' ? <ReadingDashboard /> : <LandingHero />;
}
