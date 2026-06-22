# 🎯 Interview Prep Tracker

A full-featured placement interview preparation tracker built with React + Recharts + Vite.

## Features

- **Dashboard** — Animated readiness gauge, stat cards, radar chart, confidence distribution, trend lines
- **Topics** — Add, edit, delete topics with confidence sliders, notes, revision tracking, category filters
- **Analytics** — Pie chart, category bar charts, per-topic horizontal bars, revision frequency
- **Summary** — Interview readiness report, recommendations, strong/weak topic breakdown

## Tech Stack

- React 18 + Vite
- Recharts (RadarChart, BarChart, LineChart, PieChart)
- Lucide React icons
- No external CSS frameworks — pure CSS-in-JS

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173/interview-tracker/](http://localhost:5173/interview-tracker/)

---

## 📦 Deploying to GitHub Pages

### Step 1 — Create GitHub repo

Create a new repo named `interview-tracker` on GitHub (public).

### Step 2 — Update homepage in package.json

Open `package.json` and replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username:

```json
"homepage": "https://YOUR_USERNAME.github.io/interview-tracker"
```

### Step 3 — Initialize git and push

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/interview-tracker.git
git branch -M main
git push -u origin main
```

### Step 4 — Deploy

```bash
npm run deploy
```

This runs `vite build` then pushes the `dist` folder to the `gh-pages` branch automatically.

### Step 5 — Enable GitHub Pages

1. Go to your repo on GitHub
2. Settings → Pages
3. Source: **Deploy from a branch**
4. Branch: `gh-pages` / `/ (root)`
5. Save

Your app will be live at: `https://YOUR_USERNAME.github.io/interview-tracker/`

> **Note:** It may take 2–5 minutes for GitHub Pages to deploy after first setup.

---

## 📁 Project Structure

```
interview-tracker/
├── src/
│   ├── components/
│   │   ├── ReadinessGauge.jsx   # Animated SVG gauge
│   │   ├── Dashboard.jsx        # Main dashboard with charts
│   │   ├── TopicCard.jsx        # Individual topic card
│   │   ├── Analytics.jsx        # Detailed analytics view
│   │   ├── Summary.jsx          # Interview readiness summary
│   │   └── AddTopicModal.jsx    # Add topic modal
│   ├── data/
│   │   └── initialData.js       # Seed data & categories
│   ├── App.jsx                  # Root component + routing
│   ├── main.jsx
│   └── index.css
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
└── package.json
```
