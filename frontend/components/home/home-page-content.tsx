'use client';

import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import { ArrowRight, BookOpen, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import styles from './home-page-content.module.css';
import Link from "next/link";
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
