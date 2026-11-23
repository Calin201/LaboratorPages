import { CheckCircle2, Pause, Play, Rocket } from 'lucide-react';

interface NavbarProps {
  completedMissionsCount: number;
  totalMissions: number;
  motionPaused: boolean;
  onToggleMotion: () => void;
}

const NAV_LINKS = [
  { href: '#fork-start', label: 'Fork' },
  { href: '#busola', label: 'Busolă' },
  { href: '#comparatie', label: 'Comparație' },
  { href: '#simulator', label: 'Simulator' },
  { href: '#ghiduri', label: 'Ghiduri' },
  { href: '#generator', label: 'Configuri' },
  { href: '#doctor-test', label: 'Depanare & Test' },
];

export function Navbar({
  completedMissionsCount,
  totalMissions,
  motionPaused,
  onToggleMotion,
}: NavbarProps) {
  const progressPct = Math.round((completedMissionsCount / Math.max(1, totalMissions)) * 100);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md">
      <a href="#continut-principal" className="skip-link visually-hidden">
        Sari la conținutul principal
      </a>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 rounded-lg py-1 pr-2 text-left no-underline transition-opacity hover:opacity-85"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--accent-border)] bg-[var(--bg-subtle)] text-[var(--accent)]">
            <Rocket className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="whitespace-nowrap font-[var(--font-display)] text-base font-bold text-[var(--ink-primary)]">
            Deploy Lab
          </span>
        </a>

        <nav aria-label="Module laborator" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1.5 font-[var(--font-mono)] text-xs font-medium text-[var(--ink-primary)]"
            title="Progres misiuni laborator"
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
            <span>
              {completedMissionsCount}/{totalMissions}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleMotion}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--ink-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:px-3"
          >
            {motionPaused ? (
              <>
                <Play className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                <span>Pornește animații</span>
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5 shrink-0 text-[var(--ink-primary)]" aria-hidden="true" />
                <span>Pauză animații</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bară subțire de progres misiuni */}
      <div className="h-[2px] w-full bg-[var(--bg-subtle)]" aria-hidden="true">
        <div
          className="h-full bg-[var(--accent)] transition-[width] duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </header>
  );
}
