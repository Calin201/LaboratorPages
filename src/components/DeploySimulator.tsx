import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  GitCommitHorizontal,
  Globe,
  Lock,
  Play,
  RefreshCw,
  Wrench,
} from 'lucide-react';
import { PLATFORMS, type PlatformId } from '../data/labData';
import { StarBorder } from './reactbits/StarBorder';
import { TiltedCard } from './reactbits/TiltedCard';
import { DecryptedText } from './reactbits/DecryptedText';

interface DeploySimulatorProps {
  motionPaused: boolean;
  starterRepoSlug: string;
  studentUsername: string;
  repoName: string;
  onChangeRepoName: (value: string) => void;
  onCompleteMission: () => void;
}

type SimStack = 'html' | 'react-vite' | 'nextjs' | 'node-api';
type SimStage = 'idle' | 'pushed' | 'building' | 'live' | 'bug';

interface LogEntry {
  time: string;
  level: 'info' | 'ok' | 'warn' | 'err';
  text: string;
}

const STACK_LABELS: Record<SimStack, string> = {
  html: 'HTML / CSS / JS simplu',
  'react-vite': 'React + Vite + Router',
  nextjs: 'Next.js App Router',
  'node-api': 'Node.js + Express API',
};

export function DeploySimulator({
  motionPaused,
  starterRepoSlug,
  studentUsername,
  repoName,
  onChangeRepoName,
  onCompleteMission,
}: DeploySimulatorProps) {
  const [stack, setStack] = useState<SimStack>('react-vite');
  const [platformId, setPlatformId] = useState<PlatformId>('vercel');
  const [simulateBug, setSimulateBug] = useState(false);
  const [stage, setStage] = useState<SimStage>('idle');
  const [autoRunning, setAutoRunning] = useState(false);

  const cleanUser = studentUsername.trim().replace(/[^a-zA-Z0-9-]/g, '') || 'student-dev';
  const cleanRepo = repoName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'proiect-lab-web';
  const platform = PLATFORMS.find((p) => p.id === platformId) ?? PLATFORMS[0];
  const generatedUrl = platform.urlExample(cleanUser, cleanRepo);

  const incompatibleStaticBackend = stack === 'node-api' && platformId !== 'railway';
  const effectiveBug = simulateBug || incompatibleStaticBackend;

  const bugInfo = useMemo(() => {
    if (incompatibleStaticBackend) {
      return {
        code: '501 / Server lipsă',
        title: `${platform.name} nu poate rula un proces Express/Node persistent`,
        detail:
          'Platformele de hosting static nu rulează app.listen(). Mută backend-ul pe Railway (sau transformă rutele în Serverless Functions).',
        fixActionLabel: 'Schimbă platforma pe Railway și re-deploy',
        fixType: 'switch-railway' as const,
      };
    }

    if (platformId === 'github-pages') {
      return {
        code: 'Actions oprite sau Pagină albă',
        title: 'GitHub Actions dezactivate după Fork (sau lipsește base: "./")',
        detail: `Pe un repo fork-uit, GitHub dezactivează Actions până nu apeși „Enable workflows” în tab-ul Actions. Pentru React/Vite pe /${cleanRepo}/ este necesar și base: "./" în vite.config.ts.`,
        fixActionLabel: 'Activează Actions + base: "./" și re-deploy',
        fixType: 'disable-bug' as const,
      };
    }

    if (platformId === 'railway') {
      return {
        code: '502 Bad Gateway',
        title: 'Serverul ascultă pe portul fix 3000',
        detail:
          'Railway alocă un port dinamic prin process.env.PORT. Ascultând hardcodat pe 3000, proxy-ul nu poate contacta aplicația.',
        fixActionLabel: 'Folosește process.env.PORT și re-deploy',
        fixType: 'disable-bug' as const,
      };
    }

    return {
      code: '404 la Refresh (F5)',
      title: 'Lipsește regula SPA Rewrite pentru rutele React Router',
      detail:
        'Ruta /proiecte funcționează la click, dar la F5 serverul caută fișierul fizic proiecte.html. Adaugă vercel.json sau netlify.toml.',
      fixActionLabel: 'Adaugă regula rewrite și re-deploy',
      fixType: 'disable-bug' as const,
    };
  }, [incompatibleStaticBackend, platform.name, platformId, cleanRepo]);

  const logs: LogEntry[] = useMemo(() => {
    if (stage === 'idle') {
      return [
        {
          time: '00:00',
          level: 'info',
          text: `Pregătit. Fork din ${starterRepoSlug} → github.com/${cleanUser}/${cleanRepo} (${STACK_LABELS[stack]}).`,
        },
      ];
    }

    const list: LogEntry[] = [
      {
        time: '00:01',
        level: 'ok',
        text: `Fork github.com/${cleanUser}/${cleanRepo} conectat la ${platform.name} (ramura main).`,
      },
    ];

    if (stage === 'pushed') return list;

    list.push({
      time: '00:04',
      level: 'info',
      text:
        stack === 'html'
          ? 'Nu este necesar pas de compilare. Se pregătesc fișierele statice…'
          : stack === 'node-api'
          ? 'Instalare pachete cu npm ci && verificare script start…'
          : 'Rulare npm ci && npm run build (Vite / bundler)…',
    });

    if (stage === 'building') return list;

    if (stage === 'bug') {
      list.push({
        time: '00:09',
        level: 'warn',
        text: `Build finalizat, dar a apărut o problemă de configurare: ${bugInfo.code}.`,
      });
      list.push({
        time: '00:10',
        level: 'err',
        text: bugInfo.title,
      });
      return list;
    }

    list.push({
      time: '00:08',
      level: 'ok',
      text:
        stack === 'node-api'
          ? 'Container pornit pe 0.0.0.0:$PORT. Healthcheck HTTP 200 OK.'
          : 'dist/ optimizat (142 KB gzip) urcat pe rețeaua Edge CDN.',
    });
    list.push({
      time: '00:10',
      level: 'ok',
      text: `HTTPS SSL activ. Live la ${generatedUrl}`,
    });
    return list;
  }, [stage, starterRepoSlug, cleanUser, cleanRepo, stack, platform.name, bugInfo, generatedUrl]);

  useEffect(() => {
    if (!autoRunning) return;

    if (stage === 'pushed') {
      const t = window.setTimeout(() => setStage('building'), 650);
      return () => window.clearTimeout(t);
    }

    if (stage === 'building') {
      const t = window.setTimeout(() => {
        const finalStage: SimStage = effectiveBug ? 'bug' : 'live';
        setStage(finalStage);
        setAutoRunning(false);
        if (finalStage === 'live') {
          onCompleteMission();
        }
      }, 900);
      return () => window.clearTimeout(t);
    }
  }, [autoRunning, stage, effectiveBug, onCompleteMission]);

  const handleFullRun = () => {
    setStage('pushed');
    setAutoRunning(true);
  };

  const handleStep = (target: 'pushed' | 'building' | 'finish') => {
    setAutoRunning(false);
    if (target === 'finish') {
      const finalStage: SimStage = effectiveBug ? 'bug' : 'live';
      setStage(finalStage);
      if (finalStage === 'live') {
        onCompleteMission();
      }
      return;
    }
    setStage(target);
  };

  const handleApplyFix = () => {
    if (bugInfo.fixType === 'switch-railway') {
      setPlatformId('railway');
    }
    setSimulateBug(false);
    setStage('pushed');
    setAutoRunning(true);
  };

  const progressValue =
    stage === 'idle' ? 0 : stage === 'pushed' ? 35 : stage === 'building' ? 72 : 100;

  return (
    <section
      id="simulator"
      className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-6">
            <span className="font-[var(--font-mono)] text-xs font-semibold text-[var(--accent)]">
              03 / Simulator de Deploy
            </span>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-[var(--ink-primary)] sm:text-4xl">
              Testează publicarea înainte să atingi consola reală
            </h2>
          </div>
          <p className="max-w-[60ch] text-base text-[var(--ink-secondary)] lg:col-span-6">
            Configurează repository-ul din fork, alege platforma și rulează deploy-ul. Activează și opțiunea de „greșeală clasică” ca să vezi diagnosticul și remedierea.
          </p>
        </div>

        <StarBorder className="mt-10">
          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-12">
            {/* Coloana stanga: controale & terminal */}
            <div className="min-w-0 space-y-5 lg:col-span-6">
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3.5 py-2.5 font-[var(--font-mono)] text-xs text-[var(--ink-secondary)]">
                Fork din <span className="font-medium text-[var(--ink-primary)]">{starterRepoSlug}</span> →{' '}
                <span className="font-semibold text-[var(--accent)]">
                  github.com/{cleanUser}/{cleanRepo}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="sim-repo"
                    className="block text-xs font-semibold text-[var(--ink-secondary)]"
                  >
                    Nume repository fork-uit
                  </label>
                  <input
                    id="sim-repo"
                    type="text"
                    value={repoName}
                    onChange={(e) => onChangeRepoName(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3.5 py-2.5 font-[var(--font-mono)] text-sm text-[var(--ink-primary)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sim-stack"
                    className="block text-xs font-semibold text-[var(--ink-secondary)]"
                  >
                    Tehnologie (Stack)
                  </label>
                  <select
                    id="sim-stack"
                    value={stack}
                    onChange={(e) => {
                      setStack(e.target.value as SimStack);
                      setStage('idle');
                      setAutoRunning(false);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm text-[var(--ink-primary)]"
                  >
                    <option value="html">HTML / CSS / JS simplu</option>
                    <option value="react-vite">React + Vite + Router</option>
                    <option value="nextjs">Next.js</option>
                    <option value="node-api">Node.js + Express API</option>
                  </select>
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[var(--ink-secondary)]">
                  Platforma țintă
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => {
                    const active = p.id === platformId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setPlatformId(p.id);
                          setStage('idle');
                          setAutoRunning(false);
                        }}
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                          active
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                            : 'border-[var(--border-interactive)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--accent)] hover:text-[var(--ink-primary)]'
                        }`}
                      >
                        {p.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-3.5">
                <input
                  id="sim-bug-toggle"
                  type="checkbox"
                  checked={simulateBug}
                  onChange={(e) => {
                    setSimulateBug(e.target.checked);
                    setStage('idle');
                    setAutoRunning(false);
                  }}
                  className="mt-1 h-4 w-4 accent-[var(--ink-primary)]"
                />
                <label htmlFor="sim-bug-toggle" className="cursor-pointer text-sm">
                  <span className="font-semibold text-[var(--ink-primary)]">
                    Simulează greșeala clasică
                  </span>
                  <span className="block text-xs text-[var(--ink-secondary)]">
                    Arată ce se întâmplă când uiți configurarea specifică platformei (ex. Actions oprite după Fork, 404 la F5 sau port blocat).
                  </span>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleFullRun}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-ink)] transition-opacity hover:opacity-92"
                >
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  Rulează deploy complet
                </button>

                <button
                  type="button"
                  onClick={() => handleStep('pushed')}
                  className="rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  1. git push
                </button>
                <button
                  type="button"
                  onClick={() => handleStep('building')}
                  className="rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  2. Build
                </button>
                <button
                  type="button"
                  onClick={() => handleStep('finish')}
                  className="rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  3. Deploy HTTPS
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAutoRunning(false);
                    setStage('idle');
                  }}
                  aria-label="Resetează simulatorul"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-2 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Resetează
                </button>
              </div>

              {/* Terminal logs */}
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-4">
                <div className="mb-2 flex items-center justify-between text-xs text-[var(--ink-secondary)]">
                  <span className="inline-flex items-center gap-1.5 font-[var(--font-mono)] font-semibold text-[var(--ink-primary)]">
                    <GitCommitHorizontal className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                    Build & Deploy Log
                  </span>
                  <span className="font-[var(--font-mono)]">{progressValue}%</span>
                </div>

                <progress
                  className="deploy-progress mb-3"
                  value={progressValue}
                  max={100}
                  aria-label="Progres simulare deploy"
                />

                <ul className="space-y-2 font-[var(--font-mono)] text-xs leading-relaxed">
                  {logs.map((entry, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="shrink-0 text-[var(--ink-secondary)]">{entry.time}</span>
                      <span
                        className={
                          entry.level === 'ok'
                            ? 'font-medium text-[var(--accent)]'
                            : entry.level === 'err' || entry.level === 'warn'
                            ? 'font-semibold text-[var(--ink-primary)]'
                            : 'text-[var(--ink-secondary)]'
                        }
                      >
                        {entry.level === 'err' ? `[EROARE] ${entry.text}` : entry.level === 'warn' ? `[ATENȚIE] ${entry.text}` : entry.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Coloana dreapta: Mini-Browser Preview */}
            <div className="flex min-w-0 flex-col justify-center lg:col-span-6">
              <TiltedCard paused={motionPaused} maxTilt={4}>
                <div className="overflow-hidden rounded-xl border border-[var(--border-interactive)] bg-[var(--bg-surface)] shadow-sm">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-3">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="h-2.5 w-2.5 rounded-full bg-[var(--ink-primary)]/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[var(--ink-primary)]/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[var(--ink-primary)]/20" />
                    </div>

                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 font-[var(--font-mono)] text-xs">
                      <Lock
                        className={`h-3.5 w-3.5 shrink-0 ${
                          stage === 'live'
                            ? 'text-[var(--accent)]'
                            : stage === 'bug'
                            ? 'text-[var(--ink-primary)]'
                            : 'text-[var(--ink-secondary)]'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="truncate text-[var(--ink-primary)]">
                        {stage === 'live' ? (
                          <DecryptedText text={generatedUrl} paused={motionPaused} />
                        ) : stage === 'bug' ? (
                          generatedUrl
                        ) : (
                          'about:blank (așteaptă deploy)'
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Browser viewport */}
                  <div className="min-h-[300px] p-6">
                    {stage === 'idle' && (
                      <div className="flex h-[250px] flex-col items-center justify-center text-center">
                        <Globe className="h-10 w-10 text-[var(--ink-secondary)]" aria-hidden="true" />
                        <h3 className="mt-3 font-[var(--font-display)] text-lg font-semibold text-[var(--ink-primary)]">
                          Site-ul nu este încă publicat
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-[var(--ink-secondary)]">
                          Apasă „Rulează deploy complet” pentru a simula urcarea codului pe {platform.name}.
                        </p>
                      </div>
                    )}

                    {(stage === 'pushed' || stage === 'building') && (
                      <div className="flex h-[250px] flex-col items-center justify-center text-center">
                        <div className="rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-1.5 font-[var(--font-mono)] text-xs font-semibold text-[var(--accent)]">
                          {stage === 'pushed'
                            ? 'Pas 1/3: Preluare commit GitHub…'
                            : 'Pas 2/3: Se construiește proiectul…'}
                        </div>
                        <p className="mt-3 text-sm text-[var(--ink-secondary)]">
                          Serverele {platform.name} compilează{' '}
                          <code className="font-semibold text-[var(--ink-primary)]">{cleanRepo}</code>.
                        </p>
                      </div>
                    )}

                    {stage === 'bug' && (
                      <div className="rounded-lg border-2 border-[var(--ink-primary)] bg-[var(--bg-subtle)] p-5">
                        <div className="inline-flex items-center gap-2 rounded-md bg-[var(--ink-primary)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-ink)]">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{bugInfo.code}</span>
                        </div>
                        <h3 className="mt-3 font-[var(--font-display)] text-lg font-bold text-[var(--ink-primary)]">
                          {bugInfo.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
                          {bugInfo.detail}
                        </p>
                        <button
                          type="button"
                          onClick={handleApplyFix}
                          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--accent-ink)] transition-opacity hover:opacity-92"
                        >
                          <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                          {bugInfo.fixActionLabel}
                        </button>
                      </div>
                    )}

                    {stage === 'live' && (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]">
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          Online cu HTTPS activ pe {platform.name}
                        </div>

                        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-5">
                          <div className="font-[var(--font-mono)] text-xs font-semibold text-[var(--accent)]">
                            {STACK_LABELS[stack]}
                          </div>
                          <h3 className="mt-1 font-[var(--font-display)] text-2xl font-bold text-[var(--ink-primary)]">
                            {cleanRepo}
                          </h3>
                          <p className="mt-2 text-sm text-[var(--ink-secondary)]">
                            Proiectul tău răspunde public din orice browser, cu certificat SSL reînnoit automat și actualizare la fiecare{' '}
                            <code className="font-semibold text-[var(--ink-primary)]">git push</code>.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TiltedCard>
            </div>
          </div>
        </StarBorder>
      </div>
    </section>
  );
}
