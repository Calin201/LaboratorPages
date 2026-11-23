import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Check, Copy, Lightbulb } from 'lucide-react';
import { PLATFORMS, type PlatformId } from '../data/labData';

interface StepByStepGuidesProps {
  activePlatform: PlatformId;
  onChangePlatform: (id: PlatformId) => void;
  studentUsername: string;
  repoName: string;
  checkedSteps: Record<string, boolean>;
  onToggleStep: (stepId: string) => void;
  onCopyText: (text: string, label: string) => void;
}

export function StepByStepGuides({
  activePlatform,
  onChangePlatform,
  studentUsername,
  repoName,
  checkedSteps,
  onToggleStep,
  onCopyText,
}: StepByStepGuidesProps) {
  const cleanUser = studentUsername.trim().replace(/[^a-zA-Z0-9-]/g, '') || 'student-dev';
  const cleanRepo = repoName.trim().replace(/[^a-zA-Z0-9._-]/g, '') || 'my-public-site';
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    panelRefs.current.forEach((panelEl, idx) => {
      if (!panelEl) return;
      const onBeforeMatch = () => {
        onChangePlatform(PLATFORMS[idx].id);
      };
      panelEl.addEventListener('beforematch', onBeforeMatch);
      cleanups.push(() => panelEl.removeEventListener('beforematch', onBeforeMatch));
    });
    return () => cleanups.forEach((fn) => fn());
  }, [onChangePlatform]);

  const handleTabSelect = (id: PlatformId, index: number) => {
    onChangePlatform(id);
    tabRefs.current[index]?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  };

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const total = PLATFORMS.length;
    let nextIndex = index;

    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % total;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + total) % total;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = total - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextPlatform = PLATFORMS[nextIndex];
    onChangePlatform(nextPlatform.id);
    const targetBtn = tabRefs.current[nextIndex];
    targetBtn?.focus();
    targetBtn?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const handleCopyCommand = (id: string, text: string, label: string) => {
    onCopyText(text, label);
    setCopiedId(id);
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 1800);
  };

  return (
    <section
      id="ghiduri"
      className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-6">
            <span className="font-mono text-xs font-semibold text-[var(--accent)]">
              04 / Ghid Pas-cu-Pas
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-[var(--ink-primary)] sm:text-4xl">
              Bifează fiecare pas pe măsură ce publici
            </h2>
          </div>
          <p className="max-w-[60ch] text-base text-[var(--ink-secondary)] lg:col-span-6">
            Selectează platforma din taburile de mai jos. Progresul bifat se salvează automat în browser ca să nu pierzi șirul.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div
            role="tablist"
            aria-label="Platforme de hosting"
            className="guide-tablist bg-[var(--bg-subtle)] px-3 pt-2"
          >
            {PLATFORMS.map((platform, idx) => {
              const isSelected = platform.id === activePlatform;
              return (
                <button
                  key={platform.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  id={`tab-${platform.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`panel-${platform.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleTabSelect(platform.id, idx)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className="guide-tab text-sm"
                >
                  {platform.name}
                </button>
              );
            })}
          </div>

          <div>
            {PLATFORMS.map((platform, idx) => {
              const isSelected = platform.id === activePlatform;
              const completedForPlatform = platform.steps.filter((s) => checkedSteps[s.id]).length;

              return (
                <div
                  key={platform.id}
                  id={`panel-${platform.id}`}
                  ref={(el) => {
                    panelRefs.current[idx] = el;
                  }}
                  role="tabpanel"
                  aria-labelledby={`tab-${platform.id}`}
                  hidden={!isSelected ? ('until-found' as unknown as boolean) : false}
                >
                  <div className="p-5 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-[var(--ink-primary)]">
                          {platform.name}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--ink-secondary)]">
                          {platform.tagline}
                        </p>
                      </div>
                      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3.5 py-2 font-mono text-xs font-semibold text-[var(--ink-primary)]">
                        {completedForPlatform} / {platform.steps.length} pași bifați
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-2.5 font-mono text-xs">
                      <span className="text-[var(--ink-secondary)]">
                        Fork-ul tău:{' '}
                        <span className="font-medium text-[var(--ink-primary)]">
                          github.com/{cleanUser}/{cleanRepo}
                        </span>
                      </span>
                      <span className="font-semibold text-[var(--accent)]">
                        URL estimat: {platform.urlExample(cleanUser, cleanRepo)}
                      </span>
                    </div>

                    <ol className="mt-6 space-y-4">
                      {platform.steps.map((step, stepIndex) => {
                        const done = Boolean(checkedSteps[step.id]);
                        return (
                          <li
                            key={step.id}
                            className={`rounded-lg border p-4 transition-colors sm:p-5 ${
                              done
                                ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]'
                                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                            }`}
                          >
                            <div className="flex items-start gap-3.5">
                              <input
                                id={`check-${step.id}`}
                                type="checkbox"
                                checked={done}
                                onChange={() => onToggleStep(step.id)}
                                className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--accent)]"
                              />

                              <div className="min-w-0 flex-1">
                                <label
                                  htmlFor={`check-${step.id}`}
                                  className="block cursor-pointer font-display text-base font-semibold text-[var(--ink-primary)]"
                                >
                                  <span className="mr-2 font-mono text-xs text-[var(--accent)]">
                                    0{stepIndex + 1}
                                  </span>
                                  {step.title}
                                </label>
                                <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-secondary)]">
                                  {step.detail}
                                </p>

                                {step.command && (
                                  <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
                                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs">
                                      <span className="font-mono text-[var(--ink-secondary)]">
                                        {step.commandLabel || 'Snippet'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCopyCommand(
                                            step.id,
                                            step.command!,
                                            step.commandLabel || 'Comanda'
                                          )
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                      >
                                        {copiedId === step.id ? (
                                          <>
                                            <Check className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                                            Copiat
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                                            Copiază
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-[var(--ink-primary)]">
                                      <code>{step.command}</code>
                                    </pre>
                                  </div>
                                )}

                                {step.tip && (
                                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-[var(--border-subtle)] border-l-4 border-l-[var(--ink-primary)] bg-[var(--bg-subtle)] px-3 py-2 text-xs text-[var(--ink-secondary)]">
                                    <Lightbulb
                                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--ink-primary)]"
                                      aria-hidden="true"
                                    />
                                    <span>{step.tip}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ol>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-4">
                        <h4 className="font-display text-sm font-semibold text-[var(--accent)]">
                          De ce merită {platform.name}
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-sm text-[var(--ink-secondary)]">
                          {platform.pros.map((pro, i) => (
                            <li key={i}>• {pro}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-4">
                        <h4 className="font-display text-sm font-semibold text-[var(--ink-primary)]">
                          Capcane frecvente
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-sm text-[var(--ink-secondary)]">
                          {platform.watchOuts.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
