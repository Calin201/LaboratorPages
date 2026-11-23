import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  Check,
  ChevronDown,
  Copy,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { QUIZ_QUESTIONS, TROUBLESHOOTING_CASES } from '../data/labData';
import { TiltedCard } from './reactbits/TiltedCard';
import { ShinyText } from './reactbits/ShinyText';

interface TroubleshooterAndQuizProps {
  motionPaused: boolean;
  completedMissionsCount: number;
  totalMissions: number;
  onCopyText: (text: string, label: string) => void;
  onCompleteQuizMission: () => void;
}

export function TroubleshooterAndQuiz({
  motionPaused,
  completedMissionsCount,
  totalMissions,
  onCopyText,
  onCompleteQuizMission,
}: TroubleshooterAndQuizProps) {
  const [openCaseId, setOpenCaseId] = useState<string | null>(TROUBLESHOOTING_CASES[0].id);
  const [copiedCaseId, setCopiedCaseId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [studentName, setStudentName] = useState('Student Explorer');

  const answeredCount = Object.keys(answers).length;
  const correctCount = QUIZ_QUESTIONS.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);
  const quizFinished = answeredCount === QUIZ_QUESTIONS.length;
  const quizPassed = quizFinished && correctCount >= 4;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (answers[questionId] !== undefined) return;
    const next = { ...answers, [questionId]: optionIndex };
    setAnswers(next);

    const nextAnswered = Object.keys(next).length;
    const nextCorrect = QUIZ_QUESTIONS.reduce(
      (acc, q) => acc + (next[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    if (nextAnswered === QUIZ_QUESTIONS.length && nextCorrect >= 4) {
      onCompleteQuizMission();
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
  };

  const handleCopyFix = (id: string, snippet: string, title: string) => {
    onCopyText(snippet, title);
    setCopiedCaseId(id);
    window.setTimeout(() => {
      setCopiedCaseId((prev) => (prev === id ? null : prev));
    }, 1800);
  };

  const todayFormatted = new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <section
      id="doctor-test"
      className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-6">
            <span className="font-mono text-xs font-semibold text-[var(--accent)]">
              06 / Depanare și Verificare
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-[var(--ink-primary)] sm:text-4xl">
              Doctorul de Deploy și testul final
            </h2>
          </div>
          <p className="max-w-[60ch] text-base text-[var(--ink-secondary)] lg:col-span-6">
            Consultă soluțiile pentru cele mai comune erori după Fork, apoi răspunde la cele 5 întrebări pentru a obține certificatul de laborator.
          </p>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          {/* Partea A: Doctorul de Deploy */}
          <div className="min-w-0 lg:col-span-6">
            <h3 className="font-display text-xl font-bold text-[var(--ink-primary)]">
              Cele {TROUBLESHOOTING_CASES.length} erori frecvente după Fork și deploy
            </h3>

            <div className="mt-5 divide-y divide-[var(--border-subtle)] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              {TROUBLESHOOTING_CASES.map((item) => {
                const isOpen = openCaseId === item.id;
                const panelId = `trouble-panel-${item.id}`;

                return (
                  <div key={item.id}>
                    <h4 className="m-0">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenCaseId(isOpen ? null : item.id)}
                        className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-[var(--bg-subtle)] sm:px-5"
                      >
                        <div>
                          <span className="inline-block rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--accent)]">
                            {item.platformTag}
                          </span>
                          <span className="mt-1.5 block font-display text-base font-semibold text-[var(--ink-primary)]">
                            {item.symptom}
                          </span>
                        </div>
                        <ChevronDown
                          className={`mt-1 h-5 w-5 shrink-0 text-[var(--ink-secondary)] transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[var(--accent)]' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </h4>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-4 sm:px-5"
                        >
                          <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
                            <strong className="text-[var(--ink-primary)]">De ce apare:</strong>{' '}
                            {item.cause}
                          </p>

                          <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3.5 py-2 text-xs">
                              <span className="font-semibold text-[var(--accent)]">
                                {item.fixTitle}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyFix(item.id, item.fixSnippet, item.fixTitle)
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                              >
                                {copiedCaseId === item.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                                    Copiat
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                                    Copiază fix
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-[var(--ink-primary)]">
                              <code>{item.fixSnippet}</code>
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Partea B: Test Rapid + Certificat */}
          <div className="min-w-0 lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-display text-xl font-bold text-[var(--ink-primary)]">
                Test rapid (5 întrebări)
              </h3>

              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono text-xs font-semibold text-[var(--ink-primary)]">
                  Scor: {correctCount} / {QUIZ_QUESTIONS.length}
                </span>
                {answeredCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-secondary)] hover:border-[var(--accent)] hover:text-[var(--ink-primary)]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Reia
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {QUIZ_QUESTIONS.map((q, qIdx) => {
                const selectedIdx = answers[q.id];
                const isAnswered = selectedIdx !== undefined;
                const isCorrect = selectedIdx === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
                  >
                    <h4 className="font-display text-base font-semibold text-[var(--ink-primary)]">
                      <span className="mr-2 font-mono text-xs text-[var(--accent)]">
                        0{qIdx + 1}
                      </span>
                      {q.question}
                    </h4>

                    <div className="mt-3 space-y-2">
                      {q.options.map((option, optIdx) => {
                        const picked = selectedIdx === optIdx;
                        const rightOption = optIdx === q.correctIndex;

                        let btnStyle =
                          'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--ink-secondary)] hover:border-[var(--border-interactive)] hover:text-[var(--ink-primary)]';

                        if (isAnswered) {
                          if (rightOption) {
                            btnStyle =
                              'border-[var(--accent)] bg-[var(--accent-soft)] font-semibold text-[var(--ink-primary)]';
                          } else if (picked && !rightOption) {
                            btnStyle =
                              'border-2 border-[var(--ink-primary)] bg-[var(--bg-subtle)] font-medium text-[var(--ink-primary)]';
                          } else {
                            btnStyle =
                              'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${btnStyle}`}
                          >
                            <span>{option}</span>
                            {isAnswered && rightOption && (
                              <Check
                                className="h-4 w-4 shrink-0 text-[var(--accent)]"
                                aria-hidden="true"
                              />
                            )}
                            {isAnswered && picked && !rightOption && (
                              <XCircle
                                className="h-4 w-4 shrink-0 text-[var(--ink-primary)]"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div
                        className={`mt-3 rounded-lg border border-[var(--border-subtle)] border-l-4 p-3 text-xs leading-relaxed text-[var(--ink-secondary)] ${
                          isCorrect
                            ? 'border-l-[var(--accent)] bg-[var(--accent-soft)]'
                            : 'border-l-[var(--ink-primary)] bg-[var(--bg-subtle)]'
                        }`}
                      >
                        <strong className="font-semibold text-[var(--ink-primary)]">
                          {isCorrect ? 'Corect! ' : 'Explicație: '}
                        </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {quizFinished && (
              <div className="mt-6">
                {quizPassed ? (
                  <TiltedCard paused={motionPaused} maxTilt={4.5}>
                    <div className="rounded-xl border-2 border-[var(--accent-border)] bg-[var(--bg-surface)] p-6 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--accent-border)] bg-[var(--bg-subtle)] text-[var(--accent)]">
                            <Award className="h-6 w-6" aria-hidden="true" />
                          </span>
                          <div>
                            <div className="text-xs font-semibold text-[var(--accent)]">
                              Certificat digital de laborator
                            </div>
                            <h4 className="font-display text-2xl font-bold">
                              <ShinyText>Deploy Ready</ShinyText>
                            </h4>
                          </div>
                        </div>
                        <div className="font-mono text-xs font-semibold text-[var(--ink-primary)]">
                          Scor: {correctCount}/5
                        </div>
                      </div>

                      <div className="mt-4">
                        <label
                          htmlFor="cert-student-name"
                          className="block text-xs font-semibold text-[var(--ink-secondary)]"
                        >
                          Numele tău pe certificat
                        </label>
                        <input
                          id="cert-student-name"
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-[var(--border-interactive)] bg-[var(--bg-surface)] px-3.5 py-2 font-display text-base font-semibold text-[var(--ink-primary)]"
                        />
                      </div>

                      <p className="mt-4 text-sm text-[var(--ink-secondary)]">
                        <strong className="text-[var(--ink-primary)]">{studentName || 'Student'}</strong> a demonstrat că știe să facă Fork, să aleagă platforma potrivită, să configureze și să depaneze publicarea gratuită a proiectelor web de pe GitHub.
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3 font-mono text-xs text-[var(--ink-secondary)]">
                        <span>
                          Misiuni completate: {completedMissionsCount} / {totalMissions}
                        </span>
                        <span>{todayFormatted}</span>
                      </div>
                    </div>
                  </TiltedCard>
                ) : (
                  <div className="rounded-xl border border-[var(--border-subtle)] border-l-4 border-l-[var(--ink-primary)] bg-[var(--bg-surface)] p-5 text-sm text-[var(--ink-secondary)]">
                    Ai obținut {correctCount} din 5. Ai nevoie de cel puțin 4 răspunsuri corecte pentru a debloca certificatul „Deploy Ready” — apasă „Reia” mai sus după ce recitești explicațiile.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
