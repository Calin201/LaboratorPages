import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  GitFork,
  Link2,
  RefreshCw,
} from 'lucide-react';
import { parseRepoSlug } from '../data/labData';
import { SpotlightCard } from './reactbits/SpotlightCard';

interface ForkStarterStepProps {
  starterRepoInput: string;
  onChangeStarterRepo: (value: string) => void;
  studentUsername: string;
  onChangeStudentUsername: (value: string) => void;
  forkDone: boolean;
  onToggleForkDone: () => void;
  onMarkForkDone: () => void;
  onCopyText: (text: string, label: string) => void;
}

export function ForkStarterStep({
  starterRepoInput,
  onChangeStarterRepo,
  studentUsername,
  onChangeStudentUsername,
  forkDone,
  onToggleForkDone,
  onMarkForkDone,
  onCopyText,
}: ForkStarterStepProps) {
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const parsed = parseRepoSlug(starterRepoInput);
  const cleanUser = studentUsername.trim().replace(/[^a-zA-Z0-9-]/g, '') || 'student-dev';

  const forkUrl = `https://github.com/${parsed.slug}/fork`;
  const studentRepoUrl = `https://github.com/${cleanUser}/${parsed.repo}`;
  const cloneCmd = `git clone ${studentRepoUrl}.git`;

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?repo=${encodeURIComponent(
      parsed.slug
    )}`;
    onCopyText(shareUrl, 'Linkul preconfigurat pentru studenți');
    setCopiedShareLink(true);
    window.setTimeout(() => setCopiedShareLink(false), 1800);
  };

  const handleCopyClone = () => {
    onCopyText(cloneCmd, 'Comanda git clone');
    setCopiedClone(true);
    window.setTimeout(() => setCopiedClone(false), 1800);
  };

  return (
    <section
      id="fork-start"
      className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-6">
            <span className="font-[var(--font-mono)] text-xs font-semibold text-[var(--accent)]">
              00 / Pregătire
            </span>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-[var(--ink-primary)] sm:text-4xl">
              Pornește de la un Fork pe contul tău GitHub
            </h2>
          </div>
          <p className="max-w-[60ch] text-base text-[var(--ink-secondary)] lg:col-span-6">
            Nu scrii proiectul de la zero. Faci <strong className="font-semibold text-[var(--ink-primary)]">Fork</strong> la repository-ul profesorului, iar din copia ta îl conectezi și îl publici pe oricare dintre platformele gratuite.
          </p>
        </div>

        <SpotlightCard className="mt-10 p-5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="min-w-0 space-y-5 lg:col-span-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor="fork-starter-repo"
                    className="block text-xs font-semibold text-[var(--ink-secondary)]"
                  >
                    Repository profesor (owner/repo sau URL GitHub)
                  </label>
                  <input
                    id="fork-starter-repo"
                    type="text"
                    value={starterRepoInput}
                    onChange={(e) => onChangeStarterRepo(e.target.value)}
                    placeholder="profesor/proiect-lab-web"
                    className="mt-1.5 w-full rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3.5 py-2.5 font-[var(--font-mono)] text-sm text-[var(--ink-primary)]"
                  />
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="fork-student-user"
                    className="block text-xs font-semibold text-[var(--ink-secondary)]"
                  >
                    Username-ul tău GitHub
                  </label>
                  <input
                    id="fork-student-user"
                    type="text"
                    value={studentUsername}
                    onChange={(e) => onChangeStudentUsername(e.target.value)}
                    placeholder="student-dev"
                    className="mt-1.5 w-full rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3.5 py-2.5 font-[var(--font-mono)] text-sm text-[var(--ink-primary)]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={forkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onMarkForkDone}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-ink)] transition-opacity hover:opacity-92"
                >
                  <GitFork className="h-4 w-4" aria-hidden="true" />
                  <span>Deschide pagina de Fork pe GitHub</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-xs font-semibold text-[var(--ink-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {copiedShareLink ? (
                    <>
                      <Check className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                      <span>Link copiat!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                      <span>Copiază link de laborator pentru studenți</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-3.5">
                <input
                  id="fork-done-check"
                  type="checkbox"
                  checked={forkDone}
                  onChange={onToggleForkDone}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--accent)]"
                />
                <label htmlFor="fork-done-check" className="min-w-0 flex-1 cursor-pointer text-sm">
                  <span className="font-semibold text-[var(--ink-primary)]">
                    Am făcut Fork și am repository-ul pe contul meu GitHub
                  </span>
                  <span className="mt-0.5 block break-all font-[var(--font-mono)] text-xs font-medium text-[var(--accent)]">
                    {studentRepoUrl}
                  </span>
                </label>
              </div>

              <div className="rounded-lg border border-[var(--border-subtle)] border-l-4 border-l-[var(--ink-primary)] bg-[var(--bg-subtle)] p-4 text-xs leading-relaxed text-[var(--ink-secondary)]">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ink-primary)]"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <strong className="font-semibold text-[var(--ink-primary)]">
                      Atenție la GitHub Pages după Fork:
                    </strong>{' '}
                    GitHub dezactivează automat <em>GitHub Actions</em> pe orice fork nou. Intră în tab-ul{' '}
                    <strong className="text-[var(--ink-primary)]">Actions</strong> din fork-ul tău și apasă{' '}
                    <em>„I understand my workflows, go ahead and enable them”</em>.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col justify-between space-y-4 lg:col-span-6">
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-4 sm:p-5">
                <div className="text-xs font-semibold text-[var(--ink-secondary)]">
                  Fluxul tău complet de lucru
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="min-w-0 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5">
                    <div className="text-[11px] font-semibold text-[var(--ink-secondary)]">
                      1. Repo Profesor (Sursă)
                    </div>
                    <div className="mt-1 truncate font-[var(--font-mono)] text-xs font-medium text-[var(--ink-primary)]">
                      github.com/{parsed.slug}
                    </div>
                  </div>

                  <div className="flex justify-center text-[var(--accent)]" aria-hidden="true">
                    <ArrowRight className="h-5 w-5 rotate-90 sm:rotate-0" />
                  </div>

                  <div className="min-w-0 rounded-lg border border-[var(--accent-border)] bg-[var(--bg-surface)] p-3.5">
                    <div className="text-[11px] font-semibold text-[var(--accent)]">
                      2. Fork pe contul tău
                    </div>
                    <div className="mt-1 truncate font-[var(--font-mono)] text-xs font-semibold text-[var(--ink-primary)]">
                      github.com/{cleanUser}/{parsed.repo}
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5">
                  <div className="text-[11px] font-semibold text-[var(--accent)]">
                    3. Publicare din fork-ul tău pe platforme gratuite
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--ink-secondary)]">
                    Poți edita fișierele direct în interfața web GitHub (sau local cu Git) — de fiecare dată când salvezi pe{' '}
                    <code className="font-semibold text-[var(--ink-primary)]">main</code>, platforma conectată face deploy automat.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs">
                  <span className="font-[var(--font-mono)] text-[var(--ink-secondary)]">
                    Opțional: clonare locală din fork-ul tău
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyClone}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {copiedClone ? (
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
                <pre className="overflow-x-auto p-3.5 font-[var(--font-mono)] text-xs text-[var(--ink-primary)]">
                  <code>{cloneCmd}</code>
                </pre>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-xs text-[var(--ink-secondary)]">
                <RefreshCw
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]"
                  aria-hidden="true"
                />
                <span>
                  Dacă profesorul adaugă modificări noi în repo-ul original, apasă butonul{' '}
                  <strong className="text-[var(--ink-primary)]">Sync fork → Update branch</strong> din pagina ta GitHub pentru a le prelua.
                </span>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
