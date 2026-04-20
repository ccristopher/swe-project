'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, Check, PawPrint } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import styles from './home-page-content.module.css';

type PetOption = {
  description: string;
  id: 'gator' | 'thor';
  imageAlt: string;
  imageSrc: string;
  label: string;
};

const petOptions: PetOption[] = [
  {
    description: 'A cheerful green reading buddy.',
    id: 'gator',
    imageAlt: 'Gator pet option',
    imageSrc: '/gator....png',
    label: 'Gator',
  },
  {
    description: 'A cozy companion with a calm vibe.',
    id: 'thor',
    imageAlt: 'Thor pet option',
    imageSrc: '/thor....png',
    label: 'Thor',
  },
];

const cardClassName =
  'gap-0 rounded-[2.25rem] border-0 bg-surface-container-low shadow-[0_14px_30px_var(--card-shadow)]';

export function NewUserOnboarding({ onCompleteAction }: { onCompleteAction: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<'goal' | 'pet'>('pet');
  const [petName, setPetName] = useState('');
  const [selectedPetId, setSelectedPetId] = useState<PetOption['id']>('gator');
  const [monthlyGoalTargetPages, setMonthlyGoalTargetPages] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const selectedPet = petOptions.find((pet) => pet.id === selectedPetId) ?? petOptions[0];
  const trimmedPetName = petName.trim();
  const parsedMonthlyGoalTargetPages = Number(monthlyGoalTargetPages);
  const canContinue = trimmedPetName.length > 0;
  const canSaveGoal =
    Number.isFinite(parsedMonthlyGoalTargetPages) && Math.floor(parsedMonthlyGoalTargetPages) > 0;

  function moveToGoalStep() {
    if (!canContinue) {
      setErrorMessage('Give your pet a name before you continue.');
      return;
    }

    setErrorMessage('');
    setStep('goal');
  }

  async function saveOnboarding() {
    if (!canSaveGoal) {
      setErrorMessage('Enter a monthly goal with at least 1 page.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/users/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyGoalTargetPages: Math.floor(parsedMonthlyGoalTargetPages),
          petChoice: selectedPetId,
          petName: trimmedPetName,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data?.error || 'Could not save your setup just yet.');
        return;
      }

      onCompleteAction();
      router.replace('/');
      router.refresh();
    } catch {
      setErrorMessage('Network error while saving your setup.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="px-6 pb-16 pt-6 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className={`${cardClassName} p-6 sm:p-7`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                New reader setup
              </p>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Build your reading companion before you start.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-on-surface-variant">
                Pick a pet, give them a name, and choose the monthly page goal you want to chase on
                your dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto">
              <StepBadge isActive={step === 'pet'} isComplete={step === 'goal'} label="Pet" />
              <StepBadge isActive={step === 'goal'} isComplete={false} label="Goal" />
            </div>
          </div>
        </Card>

        {step === 'pet' ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Card className={`${cardClassName} overflow-hidden p-5 sm:p-6`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                    Your pet
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">
                    {trimmedPetName || 'Name your companion'}
                  </h2>
                </div>

                <Badge className="rounded-full bg-accent px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-accent-foreground hover:bg-accent">
                  Level 1
                </Badge>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                <Card
                  className={`relative min-h-86 gap-0 rounded-[2.25rem] border-0 px-6 pb-6 pt-8 shadow-none ${styles.dashboardPetStage}`}
                >
                  <div className="relative z-10 flex w-full justify-center">
                    <Image
                      src={selectedPet.imageSrc}
                      alt={selectedPet.imageAlt}
                      width={260}
                      height={280}
                      className="mx-auto h-auto w-full max-w-60 object-contain object-center"
                      priority
                    />
                  </div>
                </Card>

                <div className="space-y-4">
                  <Card className="gap-0 rounded-[1.85rem] border-0 bg-surface-container p-5 shadow-none">
                    <label
                      htmlFor="pet-name"
                      className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant"
                    >
                      Pet name
                    </label>
                    <input
                      id="pet-name"
                      value={petName}
                      onChange={(event) => setPetName(event.target.value)}
                      placeholder="Type your pet's name"
                      maxLength={30}
                      className="mt-3 w-full rounded-[1.25rem] border border-border bg-surface-container-low px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-ring/60"
                    />
                    <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                      This is the name we&apos;ll save for your reading companion.
                    </p>
                  </Card>

                  <Card className="gap-0 rounded-[1.85rem] border-0 bg-tertiary-container/55 p-5 shadow-none">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-on-tertiary-container">
                      <PawPrint className="size-4 text-tertiary" />
                      Starter pet
                    </div>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      Your pet begins at Level 1 and levels up as you read more pages.
                    </p>
                  </Card>
                </div>
              </div>
            </Card>

            <aside className="space-y-4">
              <Card className={`${cardClassName} p-5`}>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                    Choose a pet
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground">
                    Pick your favorite
                  </h2>
                </div>

                <div className="mt-4 space-y-3">
                  {petOptions.map((pet) => {
                    const isSelected = pet.id === selectedPetId;

                    return (
                      <button
                        key={pet.id}
                        type="button"
                        onClick={() => setSelectedPetId(pet.id)}
                        className={`flex w-full items-center gap-4 rounded-[1.65rem] border px-4 py-4 text-left transition ${
                          isSelected
                            ? 'border-primary bg-primary-container/70 shadow-[0_10px_20px_var(--card-shadow)]'
                            : 'border-border bg-surface-container hover:bg-surface-container-high'
                        }`}
                      >
                        <div className="relative flex size-18 shrink-0 items-center justify-center rounded-[1.35rem] bg-surface-container-low">
                          <Image
                            src={pet.imageSrc}
                            alt={pet.imageAlt}
                            width={56}
                            height={56}
                            className="h-auto w-14 object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-lg font-extrabold tracking-tight text-foreground">
                            {pet.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                            {pet.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Button
                onClick={moveToGoalStep}
                className={`h-14 w-full cursor-pointer rounded-full px-8 font-display text-lg font-bold text-accent-foreground ${styles.primaryAction}`}
                type="button"
              >
                Continue to goal
                <ArrowRight className="size-4" />
              </Button>
            </aside>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <Card className={`${cardClassName} p-6 sm:p-7`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                    Monthly goal
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    Set your page target
                  </h2>
                </div>

                <div className="rounded-full bg-secondary-container px-4 py-2 text-sm font-black uppercase tracking-[0.15em] text-secondary-foreground">
                  {trimmedPetName || 'Your pet'}
                </div>
              </div>

              <Card className="mt-6 gap-0 rounded-[2rem] border-0 bg-surface-container p-5 shadow-none sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                      Monthly goal
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                      Choose how many pages you want on your board each month.
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-on-surface-variant">
                    Saved to your dashboard
                  </p>
                </div>

                <Progress
                  aria-label="Monthly goal setup progress"
                  className="mt-4 h-4 rounded-full bg-surface-container-low"
                  indicatorClassName="rounded-full bg-primary"
                  value={100}
                />

                <div className="mt-5 rounded-[1.5rem] border border-border bg-surface-container-low p-4">
                  <label
                    htmlFor="monthly-goal"
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant"
                  >
                    <BookOpen className="size-4 text-primary" />
                    Goal pages
                  </label>
                  <input
                    id="monthly-goal"
                    type="number"
                    min={1}
                    step={1}
                    value={monthlyGoalTargetPages}
                    onChange={(event) => setMonthlyGoalTargetPages(event.target.value)}
                    placeholder="500"
                    className="mt-3 w-full bg-transparent font-display text-4xl font-extrabold tracking-tight text-foreground outline-none"
                  />
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                    Example: 300, 500, or 900 pages.
                  </p>
                </div>
              </Card>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  onClick={() => {
                    setErrorMessage('');
                    setStep('pet');
                  }}
                  className={`h-12 rounded-full border-transparent bg-surface-container px-6 font-display text-base font-bold text-foreground ${styles.secondaryAction}`}
                  type="button"
                  variant="outline"
                >
                  Back
                </Button>

                <Button
                  onClick={saveOnboarding}
                  disabled={isSaving}
                  className={`h-12 rounded-full px-8 font-display text-base font-bold text-accent-foreground ${styles.primaryAction}`}
                  type="button"
                >
                  {isSaving ? 'Saving...' : 'Start dashboard'}
                  {!isSaving ? <ArrowRight className="size-4" /> : null}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {errorMessage ? (
          <p className="text-center text-sm font-semibold text-destructive">{errorMessage}</p>
        ) : null}
      </div>
    </section>
  );
}

function StepBadge({
  isActive,
  isComplete,
  label,
}: {
  isActive: boolean;
  isComplete: boolean;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : isComplete
            ? 'bg-secondary-container text-secondary-foreground'
            : 'bg-surface-container text-on-surface-variant'
      }`}
    >
      {isComplete ? <Check className="size-4" /> : null}
      <span>{label}</span>
    </div>
  );
}
