# Deploy Lab — Laborator Interactiv de Hosting Gratuit

Un laborator interactiv în limba română creat cu React 19, TypeScript, Tailwind CSS v4 și `motion`, care îi învață pe studenți cum să își publice proiectele de pe GitHub gratuit pe **GitHub Pages**, **Vercel**, **Netlify**, **Cloudflare Pages** și **Railway**.

## Rulare locală

```bash
npm install
npm run dev
```

## Publicare rapidă (acest proiect este deja pregătit!)

1. Inițializează repo-ul și urcă codul pe GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Deploy Lab"
   git branch -M main
   git remote add origin https://github.com/USER/LaboratorPages.git
   git push -u origin main
   ```
2. Alege una dintre platforme:
   - **GitHub Pages**: Activează *Settings → Pages → Source: GitHub Actions*. Workflow-ul `.github/workflows/deploy.yml` este deja configurat.
   - **Vercel**: Importă repository-ul în Vercel — `vercel.json` și scripturile Vite sunt detectate automat.
   - **Netlify**: Importă repository-ul în Netlify — `netlify.toml` configurează automat build-ul și redirecționările SPA.
   - **Cloudflare Pages**: Conectează repository-ul și setează build command `npm run build`, output directory `dist`.

## Mod de lucru la laborator (pentru profesor și studenți)

1. Profesorul poate trimite studenților linkul laboratorului cu parametrul `?repo=USER-PROFESOR/NUME-REPO` (de exemplu `https://site-lab.vercel.app/?repo=profesor/proiect-lab-web`), astfel încât **Pasul 0 (Fork)** să fie precompletat automat pentru repository-ul de start.
2. Studenții își introduc username-ul GitHub, dau click pe butonul de **Fork** (creându-și o copie proprie pe contul lor), apoi urmează ghidurile interactive pentru a-și publica fork-ul pe GitHub Pages (activând workflow-urile din tab-ul *Actions*), Vercel, Netlify, Cloudflare Pages sau Railway.
