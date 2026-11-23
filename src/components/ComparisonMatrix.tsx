import { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { PLATFORMS, type PlatformId, type ProjectFilter } from '../data/labData';

interface ComparisonMatrixProps {
  onSelectPlatformGuide: (platformId: PlatformId) => void;
  onExploreComparison: () => void;
}

const FILTER_OPTIONS: { id: ProjectFilter; label: string }[] = [
  { id: 'all', label: 'Toate (4)' },
  { id: 'static', label: 'Frontend Static' },
  { id: 'fullstack', label: 'Full-Stack / Serverless' },
  { id: 'no-card', label: 'Fără card bancar' },
];

export function ComparisonMatrix({
  onSelectPlatformGuide,
  onExploreComparison,
}: ComparisonMatrixProps) {
  const [filter, setFilter] = useState<ProjectFilter>('all');

  const filteredPlatforms = PLATFORMS.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'static') return p.category === 'static';
    if (filter === 'fullstack') return p.category === 'fullstack' || p.category === 'backend';
    if (filter === 'no-card') return !p.requiresCard;
    return true;
  });

  const handleFilterClick = (next: ProjectFilter) => {
    setFilter(next);
    onExploreComparison();
  };

  return (
    <section
      id="comparatie"
      className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-6">
            <span className="font-mono text-xs font-semibold text-[var(--accent)]">
              02 / Planuri Gratuite
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-[var(--ink-primary)] sm:text-4xl">
              Ce primești gratuit pe fiecare platformă
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-6 lg:items-end">
            <p className="max-w-[58ch] text-base text-[var(--ink-secondary)]">
              Toate se conectează la fork-ul tău GitHub și includ HTTPS gratuit. Diferența majoră este dacă ai doar fișiere statice sau și un backend cu bază de date.
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrează platformele">
              {FILTER_OPTIONS.map((opt) => {
                const active = filter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleFilterClick(opt.id)}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                        : 'border-[var(--border-interactive)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--accent)] hover:text-[var(--ink-primary)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="table-container mt-10">
          <div
            tabIndex={0}
            role="region"
            aria-labelledby="tabel-comparatie-titlu"
            className="table-wrapper"
          >
            <table className="comparison-table">
              <caption
                id="tabel-comparatie-titlu"
                className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-3 text-left font-display text-sm font-semibold text-[var(--ink-primary)]"
              >
                Matrice comparativă: GitHub Pages, Vercel, Netlify și Railway
              </caption>
              <thead>
                <tr>
                  <th scope="col">Platformă</th>
                  <th scope="col">Tip proiect</th>
                  <th scope="col">Limită gratuită</th>
                  <th scope="col">Card bancar</th>
                  <th scope="col">Preview PR</th>
                  <th scope="col">Backend / DB</th>
                  <th scope="col">Ideal pentru</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlatforms.map((platform) => (
                  <tr key={platform.id}>
                    <th scope="row">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 text-[var(--accent)]"
                            aria-hidden="true"
                          />
                          <span>{platform.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onExploreComparison();
                            onSelectPlatformGuide(platform.id);
                          }}
                          className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-[var(--accent)] underline decoration-[var(--accent-border)] underline-offset-4 hover:opacity-80"
                        >
                          <span>Vezi ghidul</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </th>
                    <td className="text-[var(--ink-secondary)]">{platform.projectTypes}</td>
                    <td className="text-[var(--ink-primary)]">{platform.freeQuota}</td>
                    <td className="font-medium text-[var(--accent)]">{platform.cardNote}</td>
                    <td className="text-[var(--ink-secondary)]">{platform.previewPerPr}</td>
                    <td className="text-[var(--ink-secondary)]">{platform.backendSupport}</td>
                    <td className="text-[var(--ink-secondary)]">{platform.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
