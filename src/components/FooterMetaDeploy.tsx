import { Check, Copy, GitBranch, Rocket } from 'lucide-react';
import { useState } from 'react';

interface FooterMetaDeployProps {
  onCopyText: (text: string, label: string) => void;
}

const META_COMMANDS = `git init
git add .
git commit -m "Deploy Lab initial"
git branch -M main
git remote add origin https://github.com/USERNAME/LaboratorPages.git
git push -u origin main`;

export function FooterMetaDeploy({ onCopyText }: FooterMetaDeployProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyText(META_COMMANDS, 'Comenzi Git pentru publicarea laboratorului');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer className="bg-[var(--bg-surface)] pb-16 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-6">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                <Rocket className="h-4 w-4" aria-hidden="true" />
                Meta-Deploy: acest laborator este gata de publicare
              </div>
              <h2 className="mt-2 font-[var(--font-display)] text-2xl font-bold text-[var(--ink-primary)]">
                Urcă acest laborator pe GitHub și postează-l live în 3 pași
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)]">
                Proiectul conține deja toate fișierele necesare pentru publicare imediată fără erori:
              </p>

              <ul className="mt-4 space-y-2 text-sm text-[var(--ink-primary)]">
                <li>
                  • <code className="font-semibold text-[var(--accent)]">vite.config.ts</code> cu{' '}
                  <code className="font-semibold text-[var(--ink-primary)]">base: &apos;./&apos;</code> pentru GitHub Pages
                </li>
                <li>
                  • <code className="font-semibold text-[var(--accent)]">.github/workflows/deploy.yml</code> pentru deploy automat prin GitHub Actions
                </li>
                <li>
                  • <code className="font-semibold text-[var(--accent)]">vercel.json</code> și{' '}
                  <code className="font-semibold text-[var(--accent)]">netlify.toml</code> pregătite pentru import cu un click
                </li>
              </ul>
            </div>

            <div className="min-w-0 lg:col-span-6">
              <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-2.5 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-[var(--font-mono)] text-[var(--ink-secondary)]">
                    <GitBranch className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                    Terminal local → GitHub
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                        Copiat
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        Copiază comenzile
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto p-4 font-[var(--font-mono)] text-xs leading-relaxed text-[var(--ink-primary)]">
                  <code>{META_COMMANDS}</code>
                </pre>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[var(--ink-secondary)]">
                După <code className="font-semibold text-[var(--ink-primary)]">git push</code>, activează{' '}
                <strong className="text-[var(--ink-primary)]">Settings → Pages → Source: GitHub Actions</strong> pe GitHub sau importă repo-ul în Vercel ori Netlify.
              </p>
              <p className="mt-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--ink-secondary)]">
                <strong className="text-[var(--accent)]">Tip pentru profesor:</strong> repository-ul implicit din Pasul 0 este{' '}
                <code className="font-semibold text-[var(--ink-primary)]">Calin201/my-public-site</code>, dar îl poți suprascrie oricând din URL cu{' '}
                <code className="font-semibold text-[var(--ink-primary)]">?repo=USER/REPO</code>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6 text-xs text-[var(--ink-secondary)]">
          <p>Deploy Lab • Resursă educațională interactivă pentru studenți (React, Motion, Tailwind CSS)</p>
          <p>Toate cele 4 platforme oferă HTTPS gratuit și integrare cu GitHub.</p>
        </div>
      </div>
    </footer>
  );
}
