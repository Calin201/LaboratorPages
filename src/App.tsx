import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import {
  DEFAULT_STARTER_REPO,
  parseRepoSlug,
  type MissionId,
  type PlatformId,
} from './data/labData';
import { ClickSpark } from './components/reactbits/ClickSpark';
import { Navbar } from './components/Navbar';
import { HeroLaunchpad } from './components/HeroLaunchpad';
import { ForkStarterStep } from './components/ForkStarterStep';
import { PlatformWizard } from './components/PlatformWizard';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { DeploySimulator } from './components/DeploySimulator';
import { StepByStepGuides } from './components/StepByStepGuides';
import { ConfigGenerator } from './components/ConfigGenerator';
import { TroubleshooterAndQuiz } from './components/TroubleshooterAndQuiz';
import { FooterMetaDeploy } from './components/FooterMetaDeploy';

const INITIAL_MISSIONS: Record<MissionId, boolean> = {
  fork: false,
  wizard: false,
  comparison: false,
  simulator: false,
  guides: false,
  generator: false,
  quiz: false,
};

function loadSavedState<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getInitialStarterRepo(): string {
  try {
    const param = new URLSearchParams(window.location.search).get('repo');
    if (param && param.trim()) {
      return parseRepoSlug(param).slug;
    }
  } catch {
    // Ignore URL parsing errors
  }
  return DEFAULT_STARTER_REPO;
}

export function App() {
  const [motionPaused, setMotionPaused] = useState(false);
  const [activeGuidePlatform, setActiveGuidePlatform] = useState<PlatformId>('github-pages');

  const [starterRepoInput, setStarterRepoInput] = useState<string>(getInitialStarterRepo);
  const [repoName, setRepoName] = useState<string>(() => parseRepoSlug(getInitialStarterRepo()).repo);
  const [studentUsername, setStudentUsername] = useState<string>(() =>
    loadSavedState('deploy-lab-student-user-v1', 'student-dev')
  );

  const [missions, setMissions] = useState<Record<MissionId, boolean>>(() =>
    loadSavedState('deploy-lab-missions-v2', INITIAL_MISSIONS)
  );
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>(() =>
    loadSavedState('deploy-lab-steps-v1', {})
  );
  const [liveMessage, setLiveMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('deploy-lab-student-user-v1', JSON.stringify(studentUsername));
    } catch {
      // Ignore storage quota errors
    }
  }, [studentUsername]);

  useEffect(() => {
    try {
      window.localStorage.setItem('deploy-lab-missions-v2', JSON.stringify(missions));
    } catch {
      // Ignore storage quota errors
    }
  }, [missions]);

  useEffect(() => {
    try {
      window.localStorage.setItem('deploy-lab-steps-v1', JSON.stringify(checkedSteps));
    } catch {
      // Ignore storage quota errors
    }
  }, [checkedSteps]);

  const parsedStarter = parseRepoSlug(starterRepoInput);

  const handleChangeStarterRepo = useCallback((value: string) => {
    setStarterRepoInput(value);
    setRepoName(parseRepoSlug(value).repo);
  }, []);

  const announce = useCallback((message: string, showVisualToast = false) => {
    setLiveMessage('');
    window.setTimeout(() => setLiveMessage(message), 20);
    if (showVisualToast) {
      setToastMessage(message);
      window.setTimeout(() => {
        setToastMessage((prev) => (prev === message ? null : prev));
      }, 2400);
    }
  }, []);

  const completeMission = useCallback((id: MissionId) => {
    setMissions((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: true };
    });
  }, []);

  const toggleForkMission = useCallback(() => {
    setMissions((prev) => ({ ...prev, fork: !prev.fork }));
  }, []);

  const handleSelectPlatformGuide = useCallback((platformId: PlatformId) => {
    setActiveGuidePlatform(platformId);
    const el = document.getElementById('ghiduri');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleToggleStep = useCallback(
    (stepId: string) => {
      setCheckedSteps((prev) => {
        const next = { ...prev, [stepId]: !prev[stepId] };
        const anyChecked = Object.values(next).some(Boolean);
        if (anyChecked) {
          completeMission('guides');
        }
        return next;
      });
    },
    [completeMission]
  );

  const handleCopyText = useCallback(
    async (text: string, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        announce(`${label} copiat în clipboard.`, true);
      } catch {
        announce(`Nu s-a putut copia automat ${label}; selectează textul manual.`, true);
      }
    },
    [announce]
  );

  const completedCount = Object.values(missions).filter(Boolean).length;
  const totalMissions = Object.keys(INITIAL_MISSIONS).length;

  return (
    <MotionConfig reducedMotion={motionPaused ? 'always' : 'user'}>
      <div className={`app-root min-h-screen ${motionPaused ? 'motion-paused' : ''}`}>
        <ClickSpark paused={motionPaused} />

        {/* Regiune centralizată pentru anunțuri Screen Reader */}
        <div aria-live="polite" aria-atomic="true" className="visually-hidden">
          {liveMessage}
        </div>

        {/* Toast vizual discret */}
        {toastMessage && (
          <div
            role="status"
            className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-lg border border-[var(--accent-border)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--ink-primary)] shadow-lg"
          >
            <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
            <span>{toastMessage}</span>
          </div>
        )}

        <Navbar
          completedMissionsCount={completedCount}
          totalMissions={totalMissions}
          motionPaused={motionPaused}
          onToggleMotion={() => {
            setMotionPaused((prev) => {
              const next = !prev;
              announce(next ? 'Animațiile au fost puse pe pauză.' : 'Animațiile au fost pornite.');
              return next;
            });
          }}
        />

        <main>
          <HeroLaunchpad
            motionPaused={motionPaused}
            studentUsername={studentUsername}
            repoName={repoName}
          />

          <ForkStarterStep
            starterRepoInput={starterRepoInput}
            onChangeStarterRepo={handleChangeStarterRepo}
            studentUsername={studentUsername}
            onChangeStudentUsername={setStudentUsername}
            forkDone={missions.fork}
            onToggleForkDone={toggleForkMission}
            onMarkForkDone={() => completeMission('fork')}
            onCopyText={handleCopyText}
          />

          <PlatformWizard
            motionPaused={motionPaused}
            onSelectPlatformGuide={handleSelectPlatformGuide}
            onCompleteMission={() => completeMission('wizard')}
          />

          <ComparisonMatrix
            onSelectPlatformGuide={handleSelectPlatformGuide}
            onExploreComparison={() => completeMission('comparison')}
          />

          <DeploySimulator
            motionPaused={motionPaused}
            starterRepoSlug={parsedStarter.slug}
            studentUsername={studentUsername}
            repoName={repoName}
            onChangeRepoName={setRepoName}
            onCompleteMission={() => completeMission('simulator')}
          />

          <StepByStepGuides
            activePlatform={activeGuidePlatform}
            onChangePlatform={setActiveGuidePlatform}
            studentUsername={studentUsername}
            repoName={repoName}
            checkedSteps={checkedSteps}
            onToggleStep={handleToggleStep}
            onCopyText={handleCopyText}
          />

          <ConfigGenerator
            username={studentUsername}
            onChangeUsername={setStudentUsername}
            repoName={repoName}
            onChangeRepoName={setRepoName}
            onCopyText={handleCopyText}
            onCompleteMission={() => completeMission('generator')}
          />

          <TroubleshooterAndQuiz
            motionPaused={motionPaused}
            completedMissionsCount={completedCount}
            totalMissions={totalMissions}
            onCopyText={handleCopyText}
            onCompleteQuizMission={() => completeMission('quiz')}
          />
        </main>

        <FooterMetaDeploy onCopyText={handleCopyText} />
      </div>
    </MotionConfig>
  );
}

export default App;
