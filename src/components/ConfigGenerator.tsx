import { useEffect, useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import {
  generateConfigFiles,
  type GeneratorStack,
} from '../data/labData';

interface ConfigGeneratorProps {
  username: string;
  onChangeUsername: (value: string) => void;
  repoName: string;
  onChangeRepoName: (value: string) => void;
  onCopyText: (text: string, label: string) => void;
  onCompleteMission: () => void;
}

export function ConfigGenerator({
  username,
  onChangeUsername,
  repoName,
  onChangeRepoName,
  onCopyText,
  onCompleteMission,
}: ConfigGeneratorProps) {
  const [stack, setStack] = useState<GeneratorStack>('vite-router');

  const files = generateConfigFiles(username, repoName, stack);
  const [selectedFileId, setSelectedFileId] = useState(files[0].id);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!files.some((f) => f.id === selectedFileId)) {
      setSelectedFileId(files[0].id);
    }
  }, [files, selectedFileId]);

  const activeFile = files.find((f) => f.id === selectedFileId) ?? files[0];

  const handleCopy = () => {
    onCopyText(activeFile.content, activeFile.filename);
    onCompleteMission();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.downloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    onCompleteMission();
  };

  return (
    <section
      id="generator"
      className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-6">
            <span className="font-[var(--font-mono)] text-xs font-semibold text-[var(--accent)]">
              05 / Generator de Configurații
            </span>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-[var(--ink-primary)] sm:text-4xl">
              Generează fișierele de deploy gata de pus în proiect
            </h2>
          </div>
          <p className="max-w-[60ch] text-base text-[var(--ink-secondary)] lg:col-span-6">
            Introdu username-ul GitHub și numele fork-ului, apoi copiază sau descarcă fișierele necesare pentru GitHub Pages, Vercel, Netlify sau Railway.
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="gen-username"
                className="block text-xs font-semibold text-[var(--ink-secondary)]"
              >
                Username GitHub
              </label>
              <input
                id="gen-username"
                type="text"
                value={username}
                onChange={(e) => onChangeUsername(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3.5 py-2.5 font-[var(--font-mono)] text-sm text-[var(--ink-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="gen-repo"
                className="block text-xs font-semibold text-[var(--ink-secondary)]"
              >
                Nume repository
              </label>
              <input
                id="gen-repo"
                type="text"
                value={repoName}
                onChange={(e) => onChangeRepoName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3.5 py-2.5 font-[var(--font-mono)] text-sm text-[var(--ink-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="gen-stack"
                className="block text-xs font-semibold text-[var(--ink-secondary)]"
              >
                Structură proiect
              </label>
              <select
                id="gen-stack"
                value={stack}
                onChange={(e) => setStack(e.target.value as GeneratorStack)}
                className="mt-1.5 w-full rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm text-[var(--ink-primary)]"
              >
                <option value="vite-router">React + Vite + Router (SPA)</option>
                <option value="vite-react">React + Vite simplu</option>
                <option value="html-static">HTML / CSS / JS fără build</option>
                <option value="node-api">Backend Node.js / Express (Railway)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-4">
            {files.map((file) => {
              const active = file.id === activeFile.id;
              return (
                <button
                  key={file.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`rounded-lg border px-3.5 py-2 font-[var(--font-mono)] text-xs font-medium transition-colors ${
                    active
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                      : 'border-[var(--border-interactive)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--accent)] hover:text-[var(--ink-primary)]'
                  }`}
                >
                  {file.filename}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-[65ch] text-sm text-[var(--ink-secondary)]">
                {activeFile.description}
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                      Copiat!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      Copiază codul
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3.5 py-2 text-xs font-semibold text-[var(--accent-ink)] transition-opacity hover:opacity-92"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Descarcă {activeFile.downloadName}
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs text-[var(--ink-secondary)]">
                <span className="font-[var(--font-mono)] font-semibold text-[var(--accent)]">
                  {activeFile.filename}
                </span>
                <span>{activeFile.languageLabel}</span>
              </div>
              <pre className="overflow-x-auto p-4 font-[var(--font-mono)] text-xs leading-relaxed text-[var(--ink-primary)] sm:text-[13px]">
                <code>{activeFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
