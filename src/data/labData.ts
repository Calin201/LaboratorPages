export type PlatformId =
  | 'github-pages'
  | 'vercel'
  | 'netlify'
  | 'railway';

export type MissionId =
  | 'fork'
  | 'wizard'
  | 'comparison'
  | 'simulator'
  | 'guides'
  | 'generator'
  | 'quiz';

export const DEFAULT_STARTER_REPO = 'Calin201/my-public-site';

function toSubdomainSlug(repo: string): string {
  return (
    repo
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/^-+|-+$/g, '') || 'my-public-site'
  );
}

export function parseRepoSlug(input: string): {
  owner: string;
  repo: string;
  slug: string;
} {
  const cleaned = input
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/^\/+|\/+$/g, '');

  const parts = cleaned.split('/').filter(Boolean);
  const rawOwner = (parts[0] || 'Calin201').replace(/[^a-zA-Z0-9-]/g, '') || 'Calin201';
  const rawRepo =
    (parts.length > 1 ? parts[1] : parts[0] || 'my-public-site').replace(
      /[^a-zA-Z0-9._-]/g,
      ''
    ) || 'my-public-site';

  const owner = parts.length >= 2 ? rawOwner : 'Calin201';
  const repo = rawRepo;

  return {
    owner,
    repo,
    slug: `${owner}/${repo}`,
  };
}

export type ProjectFilter = 'all' | 'static' | 'fullstack' | 'no-card';

export interface GuideStep {
  id: string;
  title: string;
  detail: string;
  command?: string;
  commandLabel?: string;
  tip?: string;
}

export interface PlatformInfo {
  id: PlatformId;
  name: string;
  shortLabel: string;
  tagline: string;
  accentColor: string;
  spotlightColor: string;
  category: 'static' | 'fullstack' | 'backend';
  requiresCard: boolean;
  cardNote: string;
  projectTypes: string;
  freeQuota: string;
  previewPerPr: string;
  backendSupport: string;
  difficulty: 'Foarte ușor' | 'Ușor' | 'Mediu';
  bestFor: string;
  pros: string[];
  watchOuts: string[];
  urlExample: (user: string, repo: string) => string;
  steps: GuideStep[];
}

export const PLATFORMS: PlatformInfo[] = [
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    shortLabel: 'GitHub Pages',
    tagline: 'Direct din repository-ul tău GitHub, fără un alt cont',
    accentColor: '#B84A0A',
    spotlightColor: 'rgba(184, 74, 10, 0.065)',
    category: 'static',
    requiresCard: false,
    cardNote: 'Nu cere card bancar',
    projectTypes: 'HTML/CSS/JS static, React, Vite, Astro',
    freeQuota: '100 GB/lună trafic (soft), 1 GB spațiu site, gratuit nelimitat ca timp',
    previewPerPr: 'Nu nativ (necesită Action separat)',
    backendSupport: 'Nu (doar fișiere statice pe client)',
    difficulty: 'Ușor',
    bestFor: 'Site-uri statice, portofolii și proiecte de facultate direct pe github.io',
    pros: [
      'Zero conturi noi: totul rămâne în GitHub.',
      'HTTPS gratuit și activ automat pentru *.github.io.',
      'Ideal pentru HTML/CSS/JS pur și React/Vite cu GitHub Actions.',
    ],
    watchOuts: [
      'URL-ul implicit este pe sub-cale (/nume-repo/), deci React/Vite are nevoie de base: "./" în vite.config.ts.',
      'Repository-ul trebuie să fie Public pe planul GitHub Free.',
    ],
    urlExample: (user, repo) => `https://${user}.github.io/${repo}/`,
    steps: [
      {
        id: 'gh-1',
        title: 'Fă Fork la repository-ul profesorului pe contul tău GitHub',
        detail:
          'Deschide repository-ul profesorului și apasă butonul Fork → Create fork. Vei obține o copie completă la adresa github.com/USER-UL-TAU/nume-repo, pe contul tău public.',
        tip: 'Pe planul GitHub Free, GitHub Pages necesită ca fork-ul tău să rămână Public.',
      },
      {
        id: 'gh-2',
        title: 'Pas critic după Fork: activează GitHub Actions în tab-ul Actions',
        detail:
          'Din motive de securitate, GitHub dezactivează automat workflow-urile atunci când faci Fork. Intră în tab-ul Actions al fork-ului tău și apasă butonul verde „I understand my workflows, go ahead and enable them”.',
        tip: 'Fără acest click, fișierul .github/workflows/deploy.yml nu va rula la push.',
      },
      {
        id: 'gh-3',
        title: 'Setează Source: GitHub Actions în Settings → Pages',
        detail:
          'În fork-ul tău, intră în Settings → Pages (meniul din stânga) → Build and deployment → alege Source: GitHub Actions. Verifică și că vite.config.ts conține base: "./" dacă proiectul folosește Vite/React.',
        command: `export default defineConfig({
  plugins: [react()],
  base: './',
});`,
        commandLabel: 'vite.config.ts',
      },
      {
        id: 'gh-4',
        title: 'Pornește primul deploy din Actions sau printr-un commit în fork',
        detail:
          'Apasă Run workflow în tab-ul Actions (sau editează un fișier din fork cu numele tău și apasă Commit changes pe ramura main). În 45–60 de secunde primești link-ul live.',
      },
    ],
  },
  {
    id: 'vercel',
    name: 'Vercel',
    shortLabel: 'Vercel',
    tagline: 'Standardul de aur pentru React, Vite și Next.js',
    accentColor: '#B84A0A',
    spotlightColor: 'rgba(184, 74, 10, 0.065)',
    category: 'fullstack',
    requiresCard: false,
    cardNote: 'Nu cere card bancar (Hobby)',
    projectTypes: 'React, Vite, Next.js, Astro, API Serverless',
    freeQuota: '100 GB bandwidth/lună, deploy-uri nelimitate (proiecte personale)',
    previewPerPr: 'Da, automat pe fiecare Pull Request',
    backendSupport: 'Funcții Serverless / Edge (fără server persistent sau DB propriu)',
    difficulty: 'Foarte ușor',
    bestFor: 'Proiecte React, Vite, Next.js unde vrei zero configurare și Preview URLs',
    pros: [
      'Detectează automat Vite sau Next.js în câteva secunde.',
      'Generează un link de preview separat pentru fiecare commit sau Pull Request.',
      'Rewrites pentru React Router se rezolvă cu un vercel.json de 5 linii.',
    ],
    watchOuts: [
      'Planul gratuit Hobby este exclusiv pentru proiecte personale / non-comerciale.',
      'Nu poți ține un server Node continuu cu WebSockets sau un PostgreSQL intern fără servicii externe.',
    ],
    urlExample: (_user, repo) => `https://${toSubdomainSlug(repo)}.vercel.app`,
    steps: [
      {
        id: 'vc-1',
        title: 'Asigură-te că fork-ul apare pe contul tău GitHub',
        detail:
          'Loghează-te pe vercel.com folosind „Continue with GitHub”. Fork-ul tău (github.com/USER-UL-TAU/nume-repo) trebuie să fie deja creat pe contul tău.',
      },
      {
        id: 'vc-2',
        title: 'Apasă „Create New… → Project” și importă fork-ul tău (nu repo-ul profesorului)',
        detail:
          'Selectează fork-ul din lista ta de repository-uri. Dacă nu îl vezi în listă, apasă „Adjust GitHub App Permissions” și acordă acces pentru noul repository.',
      },
      {
        id: 'vc-3',
        title: 'Verifică Build Command, Output Directory și vercel.json',
        detail:
          'Pentru Vite/React, Vercel detectează npm run build și dist. Verifică să ai vercel.json pentru a evita eroarea 404 la refresh (F5) pe rutele React Router.',
        command: `{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}`,
        commandLabel: 'vercel.json',
      },
      {
        id: 'vc-4',
        title: 'Setează Environment Variables (dacă există) și apasă Deploy',
        detail:
          'De acum, fiecare commit pe care îl faci în fork-ul tău declanșează automat un nou deploy pe Vercel și un Preview URL separat pentru fiecare Pull Request.',
      },
    ],
  },
  {
    id: 'netlify',
    name: 'Netlify',
    shortLabel: 'Netlify',
    tagline: 'Cel mai prietenos onboarding, inclusiv Drag & Drop',
    accentColor: '#B84A0A',
    spotlightColor: 'rgba(184, 74, 10, 0.065)',
    category: 'fullstack',
    requiresCard: false,
    cardNote: 'Nu cere card bancar (Starter)',
    projectTypes: 'HTML/CSS/JS, React, Vite, formulare statice, funcții',
    freeQuota: '100 GB trafic/lună, 300 minute de build/lună',
    previewPerPr: 'Da, Deploy Previews automate',
    backendSupport: 'Netlify Functions & Forms integrate gratuit',
    difficulty: 'Foarte ușor',
    bestFor: 'Studenți la început de drum, prototipuri rapide și site-uri cu formular de contact',
    pros: [
      'Poți testa în 10 secunde trăgând folderul dist/ direct pe app.netlify.com/drop.',
      'Netlify Forms captează formulare HTML fără să scrii backend.',
      'Fișierul netlify.toml controlează build-ul și redirecționările foarte clar.',
    ],
    watchOuts: [
      'Atenție la cele 300 de minute de build pe lună — nu face commit-uri inutile din minut în minut pe proiecte mari.',
    ],
    urlExample: (_user, repo) => `https://${toSubdomainSlug(repo)}.netlify.app`,
    steps: [
      {
        id: 'nl-1',
        title: 'Conectează GitHub în app.netlify.com și alege fork-ul tău',
        detail:
          'Autentifică-te cu GitHub → „Add new project → Import a Git repository → GitHub”. Selectează fork-ul de pe contul tău (ajustează permisiunile aplicației Netlify dacă repo-ul nu apare).',
      },
      {
        id: 'nl-2',
        title: 'Confirmă Build command (npm run build) și Publish directory (dist)',
        detail:
          'Dacă fork-ul conține deja netlify.toml, aceste câmpuri sunt completate automat. Pentru HTML simplu fără build, lasă Build command gol și pune "." la Publish.',
        command: `[build]
  command = "npm run build"
  publish = "dist"`,
        commandLabel: 'netlify.toml',
      },
      {
        id: 'nl-4',
        title: 'Apasă Deploy site și personalizează subdomeniul',
        detail:
          'După primul build verde, intră în Site configuration → Change site name ca să schimbi numele aleatoriu într-unul curat (ex. nume-proiect.netlify.app).',
      },
    ],
  },
  {
    id: 'railway',
    name: 'Railway',
    shortLabel: 'Railway',
    tagline: 'Servere Node, Python, Go și baze de date reale (PostgreSQL/Redis)',
    accentColor: '#B84A0A',
    spotlightColor: 'rgba(184, 74, 10, 0.065)',
    category: 'backend',
    requiresCard: false,
    cardNote: 'Trial $5 + plan Free ($1 credit/lună), fără card la început',
    projectTypes: 'Node.js/Express, Python/FastAPI/Django, Go, Docker, PostgreSQL',
    freeQuota: '$5 credit trial (30 zile), apoi plan Free cu $1/lună credit inclus',
    previewPerPr: 'Da, PR environments configurabile',
    backendSupport: 'Da! Procese permanente + Baze de date gestionate (Postgres, MySQL, Redis)',
    difficulty: 'Mediu',
    bestFor: 'Backend API, aplicații full-stack cu bază de date, boți Discord/Telegram',
    pros: [
      'Rulează servere reale 24/7 fără "cold start" de 50 de secunde cum au alte platforme.',
      'Adaugi PostgreSQL sau Redis cu două click-uri în același canvas vizual.',
      'Detectează automat Node, Python sau Dockerfile direct din GitHub.',
    ],
    watchOuts: [
      'Hostingul gratuit de backend are mereu limite de resurse: după trial-ul de $5, planul Free oferă $1 credit/lună (suficient pentru un proiect mic de laborator, dar nu pentru trafic greu). Alternativă populară: Render Free (cu hibernare după 15 min inactivitate).',
      'Serverul tău TREBUIE să asculte pe process.env.PORT și host 0.0.0.0, nu doar pe portul fix 3000!',
    ],
    urlExample: (_user, repo) => `https://${toSubdomainSlug(repo)}-production.up.railway.app`,
    steps: [
      {
        id: 'rw-1',
        title: 'Fă Fork la repo-ul de backend/full-stack al profesorului',
        detail:
          'Asigură-te că ai o copie pe contul tău GitHub. Verifică în cod că serverul citește portul din process.env.PORT și ascultă pe 0.0.0.0.',
        command: `const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server pornit pe portul ' + PORT);
});`,
        commandLabel: 'server.js (Node/Express)',
      },
      {
        id: 'rw-2',
        title: 'Conectează fork-ul pe railway.app',
        detail:
          'Loghează-te cu GitHub → „New Project → Deploy from GitHub repo” și selectează fork-ul tău. Verifică să existe scriptul „start” în package.json.',
        command: `"scripts": {
  "start": "node server.js"
}`,
        commandLabel: 'package.json',
      },
      {
        id: 'rw-3',
        title: 'Adaugă variabilele de mediu sau baza de date PostgreSQL',
        detail:
          'Copiază secretele în tab-ul Variables al serviciului. Dacă proiectul cere DB, apasă „+ Create → Database → Add PostgreSQL”.',
      },
      {
        id: 'rw-4',
        title: 'Generează domeniul public în Settings → Networking',
        detail:
          'Implicit, serviciile Railway sunt private. Intră pe serviciu → Settings → Networking → Generate Domain pentru a primi link-ul HTTPS public.',
      },
    ],
  },
];

export interface WizardAnswers {
  projectType: 'html' | 'react-vite' | 'nextjs' | 'backend-db';
  priority: 'easiest' | 'github-only' | 'drag-and-drop' | 'pr-previews';
  secrets: 'static' | 'env-serverless' | 'persistent-db';
}

export interface WizardResult {
  primary: PlatformInfo;
  secondary: PlatformInfo;
  matchScore: number;
  reasons: string[];
  caveat: string;
}

export function recommendPlatforms(answers: WizardAnswers): WizardResult {
  const scores: Record<PlatformId, number> = {
    'github-pages': 50,
    vercel: 55,
    netlify: 55,
    railway: 20,
  };

  // Tip proiect
  if (answers.projectType === 'html') {
    scores['github-pages'] += 28;
    scores.netlify += 26;
  } else if (answers.projectType === 'react-vite') {
    scores.vercel += 28;
    scores.netlify += 24;
    scores['github-pages'] += 16;
  } else if (answers.projectType === 'nextjs') {
    scores.vercel += 42;
    scores.netlify += 14;
    scores['github-pages'] -= 30;
  } else if (answers.projectType === 'backend-db') {
    scores.railway += 75;
    scores['github-pages'] -= 40;
    scores.netlify -= 25;
    scores.vercel -= 15;
  }

  // Prioritate
  if (answers.priority === 'easiest') {
    scores.netlify += 24;
    scores.vercel += 22;
  } else if (answers.priority === 'github-only') {
    scores['github-pages'] += 40;
  } else if (answers.priority === 'drag-and-drop') {
    scores.netlify += 34;
  } else if (answers.priority === 'pr-previews') {
    scores.vercel += 28;
    scores.netlify += 22;
  }

  // Backend & Secrete
  if (answers.secrets === 'static') {
    scores['github-pages'] += 15;
    scores.netlify += 10;
  } else if (answers.secrets === 'env-serverless') {
    scores.vercel += 22;
    scores.netlify += 18;
    scores['github-pages'] -= 20;
  } else if (answers.secrets === 'persistent-db') {
    scores.railway += 95;
    scores['github-pages'] -= 60;
    scores.netlify -= 45;
    scores.vercel -= 35;
  }

  const sortedIds = (Object.keys(scores) as PlatformId[]).sort((a, b) => scores[b] - scores[a]);
  const primary = PLATFORMS.find((p) => p.id === sortedIds[0])!;
  const secondary = PLATFORMS.find((p) => p.id === sortedIds[1])!;

  const rawTop = Math.max(76, Math.min(99, Math.round(62 + scores[primary.id] * 0.34)));

  const reasons: string[] = [];
  let caveat = primary.watchOuts[0];

  if (primary.id === 'railway') {
    reasons.push('Ai nevoie de un server activ continuu sau de o bază de date reală — site-urile statice nu pot rula Express, FastAPI sau PostgreSQL.');
    reasons.push('Railway citește codul direct din GitHub și îți oferă PostgreSQL în același dashboard.');
    caveat =
      'După creditul trial ($5), planul Free are $1/lună inclus. Dacă aplicația crește, poți combina frontend gratuit pe Vercel/Netlify cu backend pe Railway sau Render.';
  } else if (primary.id === 'github-pages') {
    reasons.push('Nu trebuie să îți faci niciun cont extern — tot codul și hostingul stau în același repo GitHub.');
    reasons.push('Perfect pentru HTML/CSS/JS sau React + Vite dacă adaugi un workflow GitHub Actions.');
  } else if (primary.id === 'vercel') {
    reasons.push('Detectează automat React, Vite sau Next.js și configurează build-ul fără bătăi de cap.');
    reasons.push('Fiecare Pull Request primește un link unic de test înainte să dai merge în main.');
  } else if (primary.id === 'netlify') {
    reasons.push('Are cea mai prietenoasă interfață pentru începători (plus Netlify Drop pentru testare instantanee).');
    reasons.push('Primești 100 GB/lună gratuit și formulare HTML fără backend.');
  }

  return {
    primary,
    secondary,
    matchScore: rawTop,
    reasons,
    caveat,
  };
}

export interface TroubleshootingCase {
  id: string;
  symptom: string;
  platformTag: string;
  cause: string;
  fixTitle: string;
  fixSnippet: string;
}

export const TROUBLESHOOTING_CASES: TroubleshootingCase[] = [
  {
    id: 'fork-actions-disabled',
    symptom: 'Am făcut Fork, există .github/workflows/deploy.yml, dar GitHub Pages nu pornește niciun build',
    platformTag: 'Fork + GitHub Pages',
    cause:
      'Din motive de securitate, GitHub dezactivează automat toate workflow-urile din GitHub Actions atunci când faci Fork la repository-ul altei persoane.',
    fixTitle: 'Activează workflow-urile în tab-ul Actions al fork-ului tău',
    fixSnippet: `# 1. Deschide fork-ul tău pe GitHub → tab-ul "Actions"
# 2. Apasă butonul verde:
"I understand my workflows, go ahead and enable them"
# 3. Apasă "Run workflow" (sau fă un mic commit în main)`,
  },
  {
    id: 'fork-missing-import',
    symptom: 'Nu găsesc fork-ul meu în lista de import din Vercel / Netlify / Railway',
    platformTag: 'Fork + GitHub App',
    cause:
      'Aplicația GitHub OAuth a platformei de hosting a primit acces doar la repository-uri vechi selectate anterior, nu și la fork-ul nou creat.',
    fixTitle: 'Actualizează permisiunile GitHub App pentru noul fork',
    fixSnippet: `# În ecranul de import (Vercel / Netlify / Railway):
# Apasă "Adjust GitHub App Permissions" / "Configure on GitHub"
# Selectează fork-ul nou (sau "All repositories") → Save`,
  },
  {
    id: 'gh-blank-page',
    symptom: 'Pagină complet albă pe GitHub Pages (erori 404 în Console pentru .js și .css)',
    platformTag: 'GitHub Pages + Vite',
    cause:
      'GitHub Pages publică proiectul pe o sub-cale (ex. https://user.github.io/proiect/), dar Vite presupune implicit că site-ul este la rădăcină (/). Browserul caută /assets/index.js în loc de /proiect/assets/index.js.',
    fixTitle: 'Adaugă base: "./" în vite.config.ts',
    fixSnippet: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
});`,
  },
  {
    id: 'spa-refresh-404',
    symptom: 'Prima pagină merge, dar când dau refresh (F5) pe /despre sau /contact primesc 404 Not Found',
    platformTag: 'Vercel / Netlify',
    cause:
      'Într-un Single Page Application (React Router), ruta /despre există doar în JavaScript, nu ca fișier fizic despre.html. Serverul trebuie instruit să trimită toate cererile către index.html.',
    fixTitle: 'Adaugă vercel.json (Vercel) sau public/_redirects (Netlify)',
    fixSnippet: `// vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }

# public/_redirects (Netlify)
/*  /index.html  200`,
  },
  {
    id: 'case-sensitive-linux',
    symptom: 'Local pe Windows/Mac proiectul merge, dar build-ul pică pe Vercel/Netlify cu "Module not found"',
    platformTag: 'Toate platformele',
    cause:
      'Windows și macOS ignoră de obicei literele mari/mici la nume de fișiere, însă serverele de build rulează pe Linux, care este strict case-sensitive (Navbar.tsx ≠ navbar.tsx).',
    fixTitle: 'Verifică exact literele mari și mici din import-uri',
    fixSnippet: `// ❌ Greșit pe Linux dacă fișierul e Navbar.tsx
import { Navbar } from './components/navbar';

// ✅ Corect
import { Navbar } from './components/Navbar';`,
  },
  {
    id: 'env-undefined',
    symptom: 'Variabila din .env este undefined pe site-ul live, deși local funcționează',
    platformTag: 'Vite / Vercel / Netlify',
    cause:
      'Fișierul .env este (corect!) ignorat în .gitignore și nu ajunge pe GitHub. În plus, Vite expune în browser doar variabilele care încep cu prefixul VITE_.',
    fixTitle: 'Adaugă variabila în dashboard-ul platformei cu prefix VITE_',
    fixSnippet: `# În Settings → Environment Variables (Vercel / Netlify)
VITE_API_URL=https://api.exemplu.ro

# În codul React:
const apiUrl = import.meta.env.VITE_API_URL;`,
  },
  {
    id: 'railway-502',
    symptom: 'Railway afișează "Application failed to respond" / 502 Bad Gateway',
    platformTag: 'Railway (Node / Python)',
    cause:
      'Serverul ascultă hardcodat pe localhost:3000 în loc să preia portul dinamic din variabila de mediu process.env.PORT și să accepte conexiuni pe 0.0.0.0.',
    fixTitle: 'Folosește process.env.PORT și 0.0.0.0',
    fixSnippet: `const port = Number(process.env.PORT) || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(\`Listening on \${port}\`);
});`,
  },
  {
    id: 'public-assets-path',
    symptom: 'Imaginile locale se văd la npm run dev, dar apar rupte după deploy',
    platformTag: 'React + Vite',
    cause:
      'Imaginile puse în src/ sau referite cu "/images/poza.png" (slash inițial) se rup pe sub-calea GitHub Pages. Ori le imporți în JS/TS, ori le pui în public/ și folosești căi relative "./".',
    fixTitle: 'Importă imaginea ca modul ES sau folosește calea relativă "./"',
    fixSnippet: `// Varianta 1 (recomandată în src/assets):
import heroImg from './assets/hero.png';
<img src={heroImg} alt="Prezentare proiect" />

// Varianta 2 (fișier în public/logo.svg):
<img src="./logo.svg" alt="Logo" />`,
  },
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question:
      'Ai un proiect React + Vite urcat pe GitHub Pages la adresa https://ana.github.io/tema-web/, dar pagina se încarcă complet albă. Care este cauza cea mai probabilă?',
    options: [
      'GitHub Pages nu suportă React deloc',
      'Lipsește base: "./" (sau "/tema-web/") din vite.config.ts',
      'Trebuie să plătești abonamentul GitHub Pro',
      'Ai uitat să urci folderul node_modules pe GitHub',
    ],
    correctIndex: 1,
    explanation:
      'Vite generează implicit căi absolute /assets/..., care pe sub-calea /tema-web/ duc la 404. Setând base: "./", căile devin relative și funcționează oriunde.',
  },
  {
    id: 'q2',
    question:
      'Ai făcut Fork la repository-ul profesorului care conține deja .github/workflows/deploy.yml, dar pe GitHub Pages nu pornește niciun build. Ce trebuie să faci prima dată?',
    options: [
      'Să ștergi folderul .github și să îl scrii din nou de la zero',
      'Să intri în tab-ul Actions al fork-ului și să apeși „I understand my workflows, go ahead and enable them”',
      'Să plătești abonamentul GitHub Pro',
      'Să schimbi numele repository-ului în index.html',
    ],
    correctIndex: 1,
    explanation:
      'GitHub dezactivează automat GitHub Actions pe repository-urile fork-uite ca măsură de securitate. După activarea din tab-ul Actions și setarea Source: GitHub Actions, deploy-ul pornește imediat.',
  },
  {
    id: 'q3',
    question:
      'De ce NU trebuie să urci niciodată folderul node_modules și fișierul .env pe GitHub?',
    options: [
      'GitHub blochează automat orice repository cu fișiere JavaScript',
      'node_modules are mii de fișiere inutile (platforma le instalează singură din package.json), iar .env conține chei secrete',
      'Vite nu poate compila dacă există .gitignore în proiect',
      'Platformele de hosting acceptă doar fișiere HTML',
    ],
    correctIndex: 1,
    explanation:
      'Platformele rulează npm install / npm ci pe baza package.json + package-lock.json. Cheile secrete se pun doar în Environment Variables din dashboard-ul platformei.',
  },
  {
    id: 'q4',
    question:
      'Ai făcut un API REST în Node.js + Express și o bază de date PostgreSQL. Pe ce platformă din laborator îl poți hosta complet?',
    options: ['GitHub Pages', 'Railway', 'Netlify Drop', 'Doar pe localhost'],
    correctIndex: 1,
    explanation:
      'GitHub Pages și Netlify Drop servesc doar fișiere statice. Railway rulează servere persistente (Node, Python, Go, Docker) și baze de date reale precum PostgreSQL.',
  },
  {
    id: 'q5',
    question:
      'Într-un site React cu React Router publicat pe Vercel, pagina /proiecte merge când dai click în meniu, dar dă 404 la refresh (F5). Cum rezolvi?',
    options: [
      'Ștergi toate rutele din React',
      'Adaugi un vercel.json cu rewrite de la "/(.*)" către "/index.html"',
      'Mută tot codul în folderul node_modules',
      'Schimbi extensia fișierelor din .tsx în .txt',
    ],
    correctIndex: 1,
    explanation:
      'Regula de rewrite spune serverului Vercel să livreze index.html pentru orice rută necunoscută, lăsând React Router să afișeze pagina corectă.',
  },
];

export interface GeneratedConfigFile {
  id: string;
  filename: string;
  downloadName: string;
  languageLabel: string;
  description: string;
  content: string;
}

export type GeneratorStack = 'vite-react' | 'vite-router' | 'html-static' | 'node-api';

export function generateConfigFiles(
  rawUsername: string,
  rawRepo: string,
  stack: GeneratorStack
): GeneratedConfigFile[] {
  const user = rawUsername.trim().replace(/[^a-zA-Z0-9-]/g, '') || 'student-dev';
  const repo = rawRepo.trim().replace(/[^a-zA-Z0-9._-]/g, '') || 'proiect-web';

  const files: GeneratedConfigFile[] = [];

  if (stack === 'vite-react' || stack === 'vite-router') {
    files.push({
      id: 'vite-config',
      filename: 'vite.config.ts',
      downloadName: 'vite.config.ts',
      languageLabel: 'TypeScript',
      description: `Setează base: './' ca proiectul ${repo} să meargă și pe GitHub Pages (${user}.github.io/${repo}/), și pe Vercel/Netlify.`,
      content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' face căile către JS și CSS relative, eliminând pagina albă pe GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
});`,
    });

    files.push({
      id: 'gh-workflow',
      filename: '.github/workflows/deploy.yml',
      downloadName: 'deploy.yml',
      languageLabel: 'YAML',
      description: `Workflow GitHub Actions care construiește automat aplicația Vite și o publică pe GitHub Pages la fiecare push pe main.`,
      content: `name: Deploy ${repo} to GitHub Pages

on:
  push:
    branches: ["main"] # Rulează automat la fiecare push pe main
  workflow_dispatch:   # Permite pornirea manuală din tab-ul Actions

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist # Folderul generat de Vite

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4`,
    });

    files.push({
      id: 'vercel-json',
      filename: 'vercel.json',
      downloadName: 'vercel.json',
      languageLabel: 'JSON',
      description: `Configurează build-ul Vite și redirecționează toate rutele către index.html ca să nu primești 404 la refresh.`,
      content: `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`,
    });

    files.push({
      id: 'netlify-toml',
      filename: 'netlify.toml',
      downloadName: 'netlify.toml',
      languageLabel: 'TOML',
      description: `Configurează folderul dist și regula SPA (status 200) pentru Netlify.`,
      content: `[build]
  command = "npm run build"
  publish = "dist"

# Păstrează rutele React Router funcționale la Refresh (F5)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`,
    });

    if (stack === 'vite-router') {
      files.push({
        id: 'redirects-file',
        filename: 'public/_redirects',
        downloadName: '_redirects',
        languageLabel: 'Text',
        description: `Alternativă ultra-simplă pentru Netlify: pune acest fișier în folderul public/ al proiectului tău React.`,
        content: `# Redirecționează orice rută către index.html fără să schimbe URL-ul
/*    /index.html   200`,
      });
    }
  } else if (stack === 'html-static') {
    files.push({
      id: 'gh-workflow-static',
      filename: '.github/workflows/deploy.yml',
      downloadName: 'deploy.yml',
      languageLabel: 'YAML',
      description: `Publică automat fișierele HTML/CSS/JS din rădăcina repository-ului ${repo} pe GitHub Pages.`,
      content: `name: Deploy static HTML to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: "." # Publică direct rădăcina repository-ului
      - id: deployment
        uses: actions/deploy-pages@v4`,
    });

    files.push({
      id: 'netlify-static',
      filename: 'netlify.toml',
      downloadName: 'netlify.toml',
      languageLabel: 'TOML',
      description: `Setează folderul curent (.) ca sursă pentru Netlify fără pas de build.`,
      content: `[build]
  publish = "."`,
    });
  } else {
    files.push({
      id: 'railway-server',
      filename: 'server.js',
      downloadName: 'server.js',
      languageLabel: 'JavaScript',
      description: `Punct de pornire Node.js/Express pregătit pentru Railway: ascultă pe process.env.PORT și 0.0.0.0.`,
      content: `import express from 'express';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, project: '${repo}', host: 'Railway' });
});

// Obligatoriu '0.0.0.0' și PORT dinamic pentru a evita eroarea 502 Bad Gateway
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Serverul ${repo} ascultă pe portul \${PORT}\`);
});`,
    });

    files.push({
      id: 'railway-toml',
      filename: 'railway.toml',
      downloadName: 'railway.toml',
      languageLabel: 'TOML',
      description: `Configurare opțională care fixează comanda de start și endpoint-ul de verificare pentru Railway.`,
      content: `[build]
  builder = "NIXPACKS"

[deploy]
  startCommand = "npm start"
  healthcheckPath = "/api/health"`,
    });
  }

  return files;
}
