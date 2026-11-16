# RR PRESSURE INTELLIGENCE — IPL 2027 AUCTION ANALYTICS COMMAND CENTRE
> **"WHEN THE GAME TIGHTENS, TRUST THE ONES WHO DELIVER."**  
> *Decoding pressure performance. Discovering auction value. Building match-winning squads.*  
> **Rajasthan Royals — SupeRR Selector Season 2 Challenge (Round 1 Submission)**

---

## Executive Overview

**RR PRESSURE INTELLIGENCE** is an elite cricket analytics command centre and decision-support platform engineered specifically for the Rajasthan Royals scouting strategy ahead of the IPL 2027 Mega Auction.

Rather than relying on raw averages or reputation, this platform evaluates **200,999 deliveries across 883 matches (IPL 2022–2026 and T20 Internationals)** through a sports-science-grade **Context-Aware Pressure Index (CPI)**. By strictly evaluating match leverage *before* each ball is bowled, the system eliminates post-hoc outcome leakage and isolates true clutch execution from ordinary game situations.

---

## Official Top 10 Rankings (Derived from Empirical Data)

### Top 10 Batters Under Pressure (Eligible: $\ge 60$ Pressure Balls, $\ge 6$ Matches)

| Rank | Player | Player ID | Reliability Score | Pressure Runs | Pressure Balls | Pressure SR | Pressure Avg | Pressure Uplift | Match Consistency | Pressure Matches | Confidence |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Rinku Singh** | 4708 | **90.0** | 532 | 275 | 193.45 | 76.00 | +40.77 | 79% | 24 | High |
| **2** | **Namboori Tilak Varma** | 7897 | **88.8** | 600 | 326 | 184.05 | 40.00 | +41.07 | 81% | 27 | High |
| **3** | **Ravindra Jadeja** | 152 | **88.2** | 426 | 268 | 158.96 | 53.25 | +23.88 | 88% | 25 | High |
| **4** | **David Miller** | 1077 | **86.9** | 575 | 312 | 184.29 | 41.07 | +35.00 | 69% | 29 | High |
| **5** | **Sikandar Raza** | 2984 | **84.8** | 260 | 144 | 180.56 | 43.33 | +45.03 | 77% | 13 | High |
| **6** | **Matthew Wade** | 796 | **83.6** | 200 | 115 | 173.91 | 100.00 | +35.27 | 78% | 9 | Moderate |
| **7** | **Tim David** | 6396 | **82.9** | 679 | 348 | 195.11 | 37.72 | +17.46 | 69% | 32 | High |
| **8** | **Hardik Pandya** | 3330 | **81.5** | 448 | 270 | 165.93 | 34.46 | +24.29 | 70% | 27 | High |
| **9** | **Tristan Stubbs** | 20702 | **80.5** | 479 | 283 | 169.26 | 36.85 | +19.35 | 64% | 22 | High |
| **10** | **Curtis Campher** | 7094 | **80.5** | 136 | 82 | 165.85 | 45.33 | +45.89 | 86% | 7 | Moderate |

---

### Top 10 Bowlers Under Pressure (Eligible: $\ge 12$ Pressure Overs, $\ge 6$ Matches)

| Rank | Player | Player ID | Reliability Score | Pressure Overs | Pressure Wickets | Pressure Econ | Dot Ball % | Pressure Uplift | Consistency | Pressure Matches | Confidence |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Mohammad Nawaz** | 2490 | **76.1** | 20.0 | 14 | 4.60 | 51.67% | +2.52 | 93% | 14 | High |
| **2** | **Sufiyan Muqeem** | 34485 | **73.1** | 22.7 | 15 | 5.82 | 51.47% | +0.18 | 92% | 13 | High |
| **3** | **Abrar Ahmed** | 5979 | **72.6** | 23.5 | 9 | 4.85 | 50.35% | +1.83 | 88% | 17 | High |
| **4** | **Akeal Hosein** | 2417 | **72.3** | 16.8 | 11 | 5.41 | 44.55% | +2.34 | 85% | 13 | Moderate |
| **5** | **Shadab Khan** | 4926 | **72.2** | 19.8 | 13 | 6.05 | 42.02% | +1.86 | 85% | 13 | Moderate |
| **6** | **Mustafizur Rahman** | 4373 | **68.8** | 52.3 | 26 | 7.01 | 45.86% | +0.79 | 88% | 34 | High |
| **7** | **Sunil Narine** | 781 | **68.4** | 25.3 | 8 | 5.76 | 42.11% | +1.10 | 89% | 19 | High |
| **8** | **Mohammad Nabi** | 1107 | **68.1** | 12.0 | 5 | 5.83 | 48.61% | +2.54 | 80% | 10 | Moderate |
| **9** | **Jofra Archer** | 3298 | **67.4** | 22.2 | 13 | 6.99 | 42.86% | +2.02 | 72% | 18 | High |
| **10** | **Washington Sundar** | 4823 | **66.8** | 18.3 | 8 | 6.27 | 35.45% | +1.83 | 92% | 12 | Moderate |

---

## Core Analytical Architecture & Sports Science

### 1. The Context-Aware Pressure Index ($P \in [0, 100]$)
- **Zero Outcome Leakage:** Pressure is evaluated strictly on cumulative pre-delivery state (runs needed, balls left, wickets in hand, RRR, match phase, knockout stakes).
- **2nd Innings Formulation:**
  $$\text{RRR Score} = \text{clip}\left(\frac{\text{RRR} - 6.0}{8.0} \times 50, 0, 50\right)$$
  $$\text{Wicket Score} = \left(\frac{\text{Wickets Lost}}{9}\right)^{1.1} \times 30$$
  $$\text{Endgame Leverage} = \left(1 - \frac{\text{Balls Left}}{36}\right) \times 25 \quad (\text{if competitive chase})$$
- **1st Innings Formulation:**
  $$\text{Crisis Score} = \text{clip}((\text{Wickets Lost} - E[W]) \times 12, 0, 45)$$
  $$\text{Phase Urgency} = \text{Overs 18–20 (40 pts), Overs 16–17 (28 pts), Powerplay (15 pts)}$$
  $$\text{Scoring Deficit} = \text{clip}((7.5 - \text{CRR}) \times 5, 0, 15)$$
- **High-Pressure Threshold:** $P \ge 55.0$ identifies the top 14.5% of critical game-defining deliveries (29,090 balls).

### 2. Empirical Bayes Shrinkage
To prevent small-sample anomalies from dominating rankings, raw scores are regressed towards the population mean:
$$\text{Score}_{\text{final}} = W_{\text{sample}} \times \text{Score}_{\text{raw}} + (1 - W_{\text{sample}}) \times 50.0$$
where $W_{\text{sample}} = \frac{N}{N + K}$ ($K = 40$ balls for batters, $K = 45$ balls for bowlers).

### 3. Match-Level Bootstrap Uncertainty (1,000 Resamples)
- Match clusters resampled with replacement 1,000 times to calculate **90% Confidence Intervals** and standard errors.
- Verified rank stability across resampled tournament editions.

---

## Product Features & Modules

1. **Executive Command Centre & Landing Page:**
   - Abstract interactive cricket pitch geometry with animated delivery trajectories and pressure arcs.
   - 4 live KPI counters (867 matches, 958 players, 29,090 high-pressure deliveries, 148 qualified targets).
   - Lead target highlights with uncertainty callouts and 4 key empirical discoveries.

2. **Batting Intelligence Lab:**
   - Interactive ranking table with live player search, sorting, and multi-tier filters (Competition: All/IPL/T20I, Confidence, Exposure).
   - 6 deep analytical charts: Pressure SR vs Baseline SR scatter, Runs vs Balls faced, Reliability scores, Phase diagnostics (Powerplay, Middle, Death), and IPL vs T20I comparison.

3. **Bowling Intelligence Lab:**
   - Interactive ranking table with sorting by economy choke, wickets, dot ball %, and reliability score.
   - 6 deep analytical charts: Pressure Economy vs Baseline, Wickets vs Overs, Dot-ball frequency, and phase suppression.

4. **Pressure Explorer (Signature Feature):**
   - Live delivery-level pressure distribution histogram.
   - Interactive sensitivity sandbox ($P \ge 50, 55, 60, 65, 70$).
   - Pressure category taxonomy (High-Stakes Chase, Early Collapse & Recovery, Death-Over Defence, Difficult Rebuilding, Clutch Finish).
   - Explainable Delivery Audit Card with zero outcome leakage proof.

5. **Player Comparison Studio:**
   - Multi-dimensional 6-axis Radar Chart contrasting any two batters or bowlers head-to-head.
   - Dimension-by-dimension winner evaluation table without unsupported claims.

6. **Rajasthan Royals Auction War Room:**
   - Categorized Target Board: High-Confidence Performers, High-Upside Candidates, Consistent Performers, Role Specialists.
   - 2D Auction Priority Matrix scatter plot (X: Reliability Score, Y: Evidence Strength, Bubble: Exposure).
   - Tactical squad fit recommendations for RR tactical requirements (Death finishing, Middle spin choke, Yorker execution).

7. **Methodology & Data Transparency:**
   - Complete scientific specification, formulas, data cleaning rules, bootstrap intervals, and sensitivity overlap matrices.

---

## Technical Stack & Architecture

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Restrained RR color palette: `#0B1220`, `#111C2E`, `#172438`, `#E23C45`, `#D6B46C`)
- **Data Visualization:** Recharts, SVG Cricket Geometry
- **Icons:** Lucide React
- **Data Engineering:** Python (Pandas, NumPy, SciPy)

---

## Quickstart & Setup Instructions

### Prerequisites
- Node.js $\ge 18$
- npm $\ge 9$
- Python $\ge 3.10$ (optional, for re-running data extraction)

### 1. Clone & Install
```bash
# Navigate to the project root
cd "Rajasthan Royals Cricket Analytics War Room"

# Install npm dependencies
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
Generates production-optimized static assets in `dist/`.

---

## Instructions for Deployment

### Deploying to Vercel
```bash
npm install -g vercel
vercel
```

### Deploying to Netlify
```bash
npm run build
# Drag and drop the 'dist' folder into Netlify Drop or connect GitHub repository
```

### Deploying via Docker / Nginx
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Deliverables & Source Data Files

All official data files are located in `data/`:
- `Top_10_Batters.csv` — Official top 10 batters under pressure.
- `Top_10_Bowlers.csv` — Official top 10 bowlers under pressure.
- `All_Player_Batting_Scores.csv` — All 888 evaluated batters with normal/pressure metrics.
- `All_Player_Bowling_Scores.csv` — All 647 evaluated bowlers with normal/pressure metrics.
- `IPL_Top_10_Batters.csv` & `IPL_Top_10_Bowlers.csv` — IPL-only rankings.
- `T20I_Top_10_Batters.csv` & `T20I_Top_10_Bowlers.csv` — T20I-only rankings.
- `Batting_Bootstrap_Intervals.csv` — 90% confidence intervals and stability.
- `Bowling_Bootstrap_Intervals.csv` — 90% confidence intervals and stability.
- `Sensitivity_Analysis.csv` — Stability across thresholds ($P \ge 50$ to $70$).
- `Pressure_Analysis_Summary.csv` — Summary dataset metrics.
- `docs/screenshots/` — High-resolution screenshots of all views.

---
*Created for Rajasthan Royals • SupeRR Selector Season 2 • All rights reserved.*
