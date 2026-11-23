import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ExternalLink, Sparkles } from 'lucide-react';
import {
  recommendPlatforms,
  type PlatformId,
  type WizardAnswers,
} from '../data/labData';
import { CountUp } from './reactbits/CountUp';
import { SpotlightCard } from './reactbits/SpotlightCard';

interface PlatformWizardProps {
  motionPaused: boolean;
  onSelectPlatformGuide: (platformId: PlatformId) => void;
  onCompleteMission: () => void;
}

const PROJECT_OPTIONS: { value: WizardAnswers['projectType']; title: string; hint: string }[] = [
  { value: 'html', title: 'HTML / CSS / JS simplu', hint: 'Fără npm run build' },
  { value: 'react-vite', title: 'React / Vite / Vue', hint: 'Single Page Application' },
  { value: 'nextjs', title: 'Next.js / Astro SSR', hint: 'Randare hibridă și API routes' },
  { value: 'backend-db', title: 'Backend API + Bază de date', hint: 'Node, Python, Go, PostgreSQL' },
];

const PRIORITY_OPTIONS: { value: WizardAnswers['priority']; title: string; hint: string }[] = [
  { value: 'easiest', title: 'Cel mai simplu posibil', hint: 'Configurare în 2 minute' },
  { value: 'github-only', title: 'Fără cont nou', hint: 'Totul rămâne în GitHub' },
  { value: 'drag-and-drop', title: 'Test rapid / Formulare HTML', hint: 'Netlify Drop și formulare fără backend' },
  { value: 'pr-previews', title: 'Preview URL pe fiecare PR', hint: 'Lucru în echipă pe Git' },
];

const SECRETS_OPTIONS: { value: WizardAnswers['secrets']; title: string; hint: string }[] = [
  { value: 'static', title: 'Doar fișiere statice', hint: 'Totul rulează în browser' },
  { value: 'env-serverless', title: 'Chei API / Funcții scurte', hint: 'Variabile .env securizate' },
  { value: 'persistent-db', title: 'Server activ + DB propriu', hint: 'Proces continuu 24/7' },
];

export function PlatformWizard({
  motionPaused,
  onSelectPlatformGuide,
  onCompleteMission,
}: PlatformWizardProps) {
  const [answers, setAnswers] = useState<WizardAnswers>({
    projectType: 'react-vite',
    priority: 'easiest',
    secrets: 'static',
  });

  const recommendation = recommendPlatforms(answers);

  const updateAnswer = <K extends keyof WizardAnswers>(key: K, value: WizardAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    onCompleteMission();
  };

  return (
    <section
      id="busola"
      className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-6">
            <span className="font-[var(--font-mono)] text-xs font-semibold text-[var(--accent)]">
              01 / Busola Platformelor
            </span>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-[var(--ink-primary)] sm:text-4xl">
              Ce platformă alegi pentru proiectul tău?
            </h2>
          </div>
          <p className="max-w-[60ch] text-base text-[var(--ink-secondary)] lg:col-span-6">
            Nu există o platformă universală pentru orice aplicație. Bifează cele trei criterii ca să vezi recomandarea potrivită pentru codul din fork-ul tău.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)] lg:col-span-7">
            <fieldset className="py-6">
              <legend className="font-[var(--font-display)] text-base font-semibold text-[var(--ink-primary)]">
                1. Ce tip de proiect urci pe GitHub?
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {PROJECT_OPTIONS.map((opt) => {
                  const selected = answers.projectType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => updateAnswer('projectType', opt.value)}
                      className={`flex items-start justify-between gap-3 rounded-lg border p-3.5 text-left transition-colors ${
                        selected
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-[var(--border-interactive)]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-[var(--ink-primary)]">
                          {opt.title}
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--ink-secondary)]">{opt.hint}</div>
                      </div>
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                            : 'border-[var(--border-interactive)] bg-[var(--bg-surface)]'
                        }`}
                        aria-hidden="true"
                      >
                        {selected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="py-6">
              <legend className="font-[var(--font-display)] text-base font-semibold text-[var(--ink-primary)]">
                2. Care este prioritatea ta numărul 1?
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {PRIORITY_OPTIONS.map((opt) => {
                  const selected = answers.priority === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => updateAnswer('priority', opt.value)}
                      className={`flex items-start justify-between gap-3 rounded-lg border p-3.5 text-left transition-colors ${
                        selected
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-[var(--border-interactive)]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-[var(--ink-primary)]">
                          {opt.title}
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--ink-secondary)]">{opt.hint}</div>
                      </div>
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                            : 'border-[var(--border-interactive)] bg-[var(--bg-surface)]'
                        }`}
                        aria-hidden="true"
                      >
                        {selected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="py-6">
              <legend className="font-[var(--font-display)] text-base font-semibold text-[var(--ink-primary)]">
                3. Ai nevoie de backend sau variabile secrete?
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {SECRETS_OPTIONS.map((opt) => {
                  const selected = answers.secrets === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => updateAnswer('secrets', opt.value)}
                      className={`flex items-start justify-between gap-2 rounded-lg border p-3.5 text-left transition-colors ${
                        selected
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-[var(--border-interactive)]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-[var(--ink-primary)]">
                          {opt.title}
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--ink-secondary)]">{opt.hint}</div>
                      </div>
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                            : 'border-[var(--border-interactive)] bg-[var(--bg-surface)]'
                        }`}
                        aria-hidden="true"
                      >
                        {selected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${recommendation.primary.id}-${recommendation.matchScore}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24 }}
              >
                <SpotlightCard className="p-6">
                  <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        Recomandarea #1 pentru tine
                      </div>
                      <h3 className="mt-1 font-[var(--font-display)] text-2xl font-bold text-[var(--ink-primary)]">
                        {recommendation.primary.name}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--ink-secondary)]">
                        {recommendation.primary.tagline}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-2 text-center">
                      <div className="font-[var(--font-display)] text-2xl font-bold text-[var(--accent)]">
                        <CountUp to={recommendation.matchScore} suffix="%" paused={motionPaused} />
                      </div>
                      <div className="text-[11px] font-medium text-[var(--ink-secondary)]">
                        potrivire
                      </div>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2.5 text-sm text-[var(--ink-primary)]">
                    {recommendation.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]"
                          aria-hidden="true"
                        />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 rounded-lg border border-[var(--border-subtle)] border-l-4 border-l-[var(--ink-primary)] bg-[var(--bg-subtle)] p-3.5 text-xs leading-relaxed text-[var(--ink-secondary)]">
                    <strong className="font-semibold text-[var(--ink-primary)]">
                      La ce să fii atent:
                    </strong>{' '}
                    {recommendation.caveat}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
                    <div className="text-xs text-[var(--ink-secondary)]">
                      Alternativă bună:{' '}
                      <button
                        type="button"
                        onClick={() => onSelectPlatformGuide(recommendation.secondary.id)}
                        className="font-semibold text-[var(--accent)] underline decoration-[var(--accent-border)] underline-offset-4 hover:opacity-85"
                      >
                        {recommendation.secondary.name}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectPlatformGuide(recommendation.primary.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-ink)] transition-opacity hover:opacity-92"
                    >
                      <span>Vezi ghidul {recommendation.primary.shortLabel}</span>
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </SpotlightCard>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
