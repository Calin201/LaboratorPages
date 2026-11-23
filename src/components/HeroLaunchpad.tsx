import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Cpu, GitFork, Globe, Play, RotateCcw, ShieldCheck } from 'lucide-react';
import { Aurora } from './reactbits/Aurora';
import { BlurText } from './reactbits/BlurText';
import { Magnet } from './reactbits/Magnet';
import { DecryptedText } from './reactbits/DecryptedText';
import { useMotionPreferences } from '../hooks/useMotionPreferences';

interface HeroLaunchpadProps {
  motionPaused: boolean;
  studentUsername: string;
  repoName: string;
}

const PIPELINE_NODES = [
  { id: 0, label: 'Fork GitHub', sub: 'copie pe contul tău', icon: GitFork },
  { id: 1, label: 'Cloud Build', sub: 'npm run build', icon: Cpu },
  { id: 2, label: 'Edge CDN', sub: 'distribuție globală', icon: Globe },
  { id: 3, label: 'HTTPS Live', sub: 'certificat SSL activ', icon: ShieldCheck },
];

export function HeroLaunchpad({
  motionPaused,
  studentUsername,
  repoName,
}: HeroLaunchpadProps) {
  const { shouldReduceMotion } = useMotionPreferences(motionPaused);
  const [stage, setStage] = useState<number>(3);
  const [running, setRunning] = useState<boolean>(false);

  const cleanUser = studentUsername.trim().replace(/[^a-zA-Z0-9-]/g, '') || 'student-dev';
  const cleanRepo = repoName.trim().replace(/[^a-zA-Z0-9._-]/g, '') || 'my-public-site';

  useEffect(() => {
    if (!running) return;
    if (stage >= 3) {
      setRunning(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStage((prev) => Math.min(3, prev + 1));
    }, shouldReduceMotion ? 220 : 620);

    return () => window.clearTimeout(timer);
  }, [running, stage, shouldReduceMotion]);

  const handleSimulatePush = () => {
    setStage(0);
    setRunning(true);
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]"
    >
      <Aurora paused={motionPaused} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <h1
              id="continut-principal"
              tabIndex={-1}
              className="font-display text-4xl font-bold leading-[1.08] text-[var(--ink-primary)] focus:outline-none sm:text-5xl lg:text-[3.5rem]"
            >
              <BlurText
                text="Fă Fork la proiectul de laborator și publică-l gratuit pe internet."
                paused={motionPaused}
              />
            </h1>

            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-[var(--ink-secondary)] sm:text-lg">
              Iei prin <strong className="font-semibold text-[var(--ink-primary)]">Fork</strong> repository-ul de start pe contul tău GitHub, apoi îl conectezi și îl publici gratuit pe{' '}
              <strong className="font-semibold text-[var(--ink-primary)]">GitHub Pages</strong>,{' '}
              <strong className="font-semibold text-[var(--ink-primary)]">Vercel</strong>,{' '}
              <strong className="font-semibold text-[var(--ink-primary)]">Netlify</strong> sau{' '}
              <strong className="font-semibold text-[var(--ink-primary)]">Railway</strong>.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnet paused={motionPaused}>
                <a
                  href="#fork-start"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--accent-ink)] transition-opacity hover:opacity-92"
                >
                  <GitFork className="h-4 w-4" aria-hidden="true" />
                  Pasul 0: Fă Fork la repo
                </a>
              </Magnet>

              <a
                href="#simulator"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--ink-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                Testează în simulator
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <h2 className="font-display text-base font-semibold text-[var(--ink-primary)]">
                    Pipeline live Git spre Internet
                  </h2>
                  <p className="text-xs text-[var(--ink-secondary)]">
                    Ce se întâmplă la fiecare <code className="font-semibold text-[var(--accent)]">git push</code>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSimulatePush}
                  disabled={running}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition-opacity hover:opacity-85 disabled:opacity-60"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  {running ? 'Se rulează…' : 'Simulează git push'}
                </button>
              </div>

              <ol className="mt-5 space-y-2.5">
                {PIPELINE_NODES.map((node, index) => {
                  const Icon = node.icon;
                  const isDone = stage > index || (stage === 3 && index === 3 && !running);
                  const isActive = stage === index && running;

                  return (
                    <li
                      key={node.id}
                      className={`relative flex items-center justify-between gap-3 rounded-lg border px-3.5 py-3 transition-colors ${
                        isDone
                          ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]'
                          : isActive
                          ? 'border-[var(--accent)] bg-[var(--bg-surface)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                            isDone
                              ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                              : isActive
                              ? 'border-[var(--accent)] bg-[var(--bg-surface)] text-[var(--accent)]'
                              : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)]'
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-[var(--ink-primary)]">
                            {node.label}
                          </div>
                          <div className="font-mono text-xs text-[var(--ink-secondary)]">
                            {node.sub}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-[var(--accent)]">
                            <Check className="h-4 w-4" aria-hidden="true" />
                            Gata
                          </span>
                        ) : isActive ? (
                          <motion.span
                            animate={shouldReduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
                            transition={{ duration: 0.9, repeat: Infinity }}
                            className="text-[var(--accent)]"
                          >
                            În curs…
                          </motion.span>
                        ) : (
                          <span className="text-[var(--ink-secondary)]">În așteptare</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3.5 py-2.5">
                <div className="text-[11px] font-medium text-[var(--ink-secondary)]">
                  Rezultat public
                </div>
                <div className="mt-0.5 truncate font-mono text-xs font-semibold text-[var(--accent)]">
                  {stage >= 3 && !running ? (
                    <DecryptedText
                      text={`https://${cleanUser}.github.io/${cleanRepo}/`}
                      paused={motionPaused}
                    />
                  ) : (
                    'Se așteaptă finalizarea build-ului…'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
