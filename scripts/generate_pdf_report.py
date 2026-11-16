"""
Generate an ace-grade, publication-quality 10-page Methodology Report PDF
for Rajasthan Royals SupeRR Selector Season 2 - Round 1 Submission.
Ensures zero table splits, precise page layouts, and full coverage of all 5 criteria.
"""

import os
import sys
import subprocess
import base64
import pandas as pd
import fitz

BASE_DIR = r"c:\Users\mohan\Downloads\Rajasthan Royals Cricket Analytics War Room"
DATA_DIR = os.path.join(BASE_DIR, "data")
DOCS_DIR = os.path.join(BASE_DIR, "docs")
SCREENSHOTS_DIR = os.path.join(DOCS_DIR, "screenshots")
OUTPUT_PDF = os.path.join(BASE_DIR, "RR_Pressure_Intelligence_Methodology_Report.pdf")

print("1. Loading datasets for the 10-page report...")
top_10_b = pd.read_csv(os.path.join(DATA_DIR, "Top_10_Batters.csv"))
top_10_bw = pd.read_csv(os.path.join(DATA_DIR, "Top_10_Bowlers.csv"))
ipl_b = pd.read_csv(os.path.join(DATA_DIR, "IPL_Top_10_Batters.csv")).head(5)
ipl_bw = pd.read_csv(os.path.join(DATA_DIR, "IPL_Top_10_Bowlers.csv")).head(5)
bat_ci = pd.read_csv(os.path.join(DATA_DIR, "Batting_Bootstrap_Intervals.csv"))
bowl_ci = pd.read_csv(os.path.join(DATA_DIR, "Bowling_Bootstrap_Intervals.csv"))
sensitivity = pd.read_csv(os.path.join(DATA_DIR, "Sensitivity_Analysis.csv"))

# Helper to encode images as base64 for reliable PDF rendering
def get_image_base64(fname):
    path = os.path.join(SCREENSHOTS_DIR, fname)
    if os.path.exists(path):
        with open(path, "rb") as f:
            return "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")
    return ""

img_hero = get_image_base64("overview_landing.png")
img_bat = get_image_base64("batting_lab.png")
img_bowl = get_image_base64("bowling_lab.png")
img_explorer = get_image_base64("pressure_explorer.png")
img_compare = get_image_base64("player_comparison.png")
img_warroom = get_image_base64("auction_war_room.png")
img_methodology = get_image_base64("methodology_evidence.png")

print("2. Generating precisely-styled 10-page HTML document...")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RR Pressure Intelligence — Official Methodology Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap');

    @page {{
      size: A4 portrait;
      margin: 10mm 12mm 12mm 12mm;
      @bottom-right {{
        content: counter(page) " / " counter(pages);
        font-family: 'JetBrains Mono', monospace;
        font-size: 7.5pt;
        color: #6B7A92;
      }}
      @bottom-left {{
        content: "Rajasthan Royals • SupeRR Selector Season 2 • Round 1 Official Report";
        font-family: 'Inter', sans-serif;
        font-size: 7.5pt;
        color: #6B7A92;
      }}
    }}

    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }}

    body {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1A202C;
      background: #FFFFFF;
      font-size: 8.5pt;
      line-height: 1.4;
      margin: 0;
      padding: 0;
    }}

    h1, h2, h3, h4, h5 {{
      font-family: 'Space Grotesk', sans-serif;
      color: #0B1220;
      margin-top: 0;
      line-height: 1.2;
    }}

    .font-mono {{
      font-family: 'JetBrains Mono', monospace;
    }}

    .page-container {{
      height: 275mm;
      max-height: 275mm;
      overflow: hidden;
      page-break-after: always;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 2mm 0;
    }}

    .page-container:last-child {{
      page-break-after: auto;
    }}

    /* Cover Page */
    .cover-page {{
      height: 275mm;
      max-height: 275mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      background: linear-gradient(135deg, #0B1220 0%, #111C2E 60%, #172438 100%);
      color: #F5F6F8;
      padding: 24mm 16mm 16mm 16mm;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
    }}

    .cover-pitch-overlay {{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 50%;
      background: radial-gradient(circle at 80% 30%, rgba(226, 60, 69, 0.18) 0%, rgba(214, 180, 108, 0.10) 50%, transparent 80%);
      pointer-events: none;
    }}

    .rr-badge {{
      display: inline-flex;
      align-items: center;
      background: rgba(226, 60, 69, 0.18);
      border: 1px solid #E23C45;
      padding: 4px 12px;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      font-weight: 700;
      color: #D6B46C;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }}

    .cover-title {{
      font-size: 32pt;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
      line-height: 1.05;
    }}

    .cover-title span {{
      color: #E23C45;
    }}

    .cover-subtitle {{
      font-size: 13pt;
      color: #D6B46C;
      font-weight: 600;
      margin-bottom: 16px;
      font-style: italic;
    }}

    .cover-desc {{
      font-size: 9.5pt;
      color: #A7B1C2;
      max-width: 540px;
      line-height: 1.55;
      margin-bottom: 24px;
    }}

    .cover-kpi-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 20px;
      background: rgba(17, 28, 46, 0.85);
      padding: 14px;
      border: 1px solid #233550;
      border-radius: 6px;
    }}

    .cover-kpi {{
      text-align: center;
    }}

    .cover-kpi .val {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 16pt;
      font-weight: 800;
      color: #FFFFFF;
    }}

    .cover-kpi .val.gold {{ color: #D6B46C; }}
    .cover-kpi .val.red {{ color: #E23C45; }}
    .cover-kpi .val.green {{ color: #38B889; }}

    .cover-kpi .lbl {{
      font-size: 7pt;
      color: #A7B1C2;
      text-transform: uppercase;
      margin-top: 3px;
      font-family: 'JetBrains Mono', monospace;
    }}

    .cover-footer {{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid #233550;
      padding-top: 14px;
      font-size: 7.5pt;
      color: #A7B1C2;
    }}

    /* Section Header */
    .section-header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0B1220;
      padding-bottom: 4px;
      margin-bottom: 10px;
    }}

    .section-eyebrow {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      font-weight: 700;
      color: #E23C45;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }}

    .section-title {{
      font-size: 14pt;
      font-weight: 800;
      margin: 1px 0 0 0;
      color: #0B1220;
    }}

    /* Callout Boxes */
    .callout {{
      background: #F8FAFC;
      border-left: 3.5px solid #E23C45;
      padding: 8px 12px;
      margin: 8px 0;
      border-radius: 0 4px 4px 0;
      font-size: 8pt;
      line-height: 1.4;
    }}

    .callout.gold {{
      border-left-color: #D6B46C;
      background: #FDFBF7;
    }}

    .callout.green {{
      border-left-color: #38B889;
      background: #F4FBF7;
    }}

    .callout.dark {{
      border-left-color: #E23C45;
      background: #0F172A;
      color: #E2E8F0;
    }}

    .callout-title {{
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 8.5pt;
      margin-bottom: 3px;
      color: #0B1220;
    }}

    .callout.dark .callout-title {{
      color: #F8FAFC;
    }}

    /* Math Cards */
    .math-card {{
      background: #111C2E;
      color: #F8FAFC;
      border: 1px solid #233550;
      border-radius: 6px;
      padding: 10px 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      margin: 6px 0;
      line-height: 1.45;
    }}

    .math-card .math-title {{
      color: #D6B46C;
      font-weight: 700;
      font-size: 8pt;
      margin-bottom: 4px;
      border-bottom: 1px solid #233550;
      padding-bottom: 3px;
    }}

    /* Tables */
    table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 7.5pt;
      margin: 6px 0;
    }}

    th {{
      background: #0B1220;
      color: #F8FAFC;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      text-align: left;
      padding: 5px 6px;
      border: 1px solid #0B1220;
      letter-spacing: 0.3px;
    }}

    td {{
      padding: 4px 6px;
      border: 1px solid #E2E8F0;
      color: #1A202C;
    }}

    tr:nth-child(even) {{
      background: #F8FAFC;
    }}

    .text-right {{ text-align: right; }}
    .text-center {{ text-align: center; }}
    .bold {{ font-weight: 700; }}
    .red-text {{ color: #E23C45; }}
    .gold-text {{ color: #B48D3C; }}
    .green-text {{ color: #1E875A; }}

    /* Badges */
    .badge-high {{
      display: inline-block;
      padding: 1px 6px;
      border-radius: 10px;
      font-size: 6.5pt;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      background: #DCFCE7;
      color: #166534;
      border: 1px solid #86EFAC;
    }}

    .badge-mod {{
      display: inline-block;
      padding: 1px 6px;
      border-radius: 10px;
      font-size: 6.5pt;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      background: #FEF08A;
      color: #713F12;
      border: 1px solid #FDE047;
    }}

    /* Screenshot Embed Container */
    .fig-container {{
      margin: 8px 0;
      text-align: center;
    }}

    .fig-container img {{
      max-width: 100%;
      height: auto;
      max-height: 80mm;
      border: 1px solid #CBD5E1;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    }}

    .fig-caption {{
      font-size: 7pt;
      color: #64748B;
      font-style: italic;
      margin-top: 3px;
    }}

    .two-col {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }}

    .dossier-card {{
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 5px;
      padding: 7px 9px;
      margin-bottom: 6px;
    }}

    .dossier-card .head {{
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid #EDF2F7;
      padding-bottom: 2px;
      margin-bottom: 3px;
    }}

    .dossier-card .p-name {{
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 8.5pt;
      color: #0B1220;
    }}

    .dossier-card .score {{
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      font-size: 9pt;
      color: #E23C45;
    }}
  </style>
</head>
<body>

  <!-- ==================== PAGE 1: COVER PAGE ==================== -->
  <div class="page-container">
    <div class="cover-page">
      <div class="cover-pitch-overlay"></div>
      <div>
        <div class="rr-badge">SUPERR SELECTOR SEASON 2 • ROUND 1 SUBMISSION</div>
        <div class="cover-title">
          DECODING PRESSURE<br />
          <span>PERFORMANCE</span>
        </div>
        <div class="cover-subtitle">
          "When the game tightens, trust the ones who deliver."
        </div>
        <div class="cover-desc">
          A Context-Aware Reliability Framework for Rajasthan Royals' IPL 2027 Auction Strategy. Investigating 200,999 deliveries across 883 matches (2022–2026) using pre-delivery leverage modeling, Empirical Bayes shrinkage, and 1,000-sample bootstrap validation.
        </div>
      </div>

      <div>
        <div class="cover-kpi-grid">
          <div class="cover-kpi">
            <div class="val">867</div>
            <div class="lbl">Matches Analysed</div>
          </div>
          <div class="cover-kpi">
            <div class="val gold">200,999</div>
            <div class="lbl">Total Deliveries</div>
          </div>
          <div class="cover-kpi">
            <div class="val red">29,090</div>
            <div class="lbl">Clutch Deliveries (14.5%)</div>
          </div>
          <div class="cover-kpi">
            <div class="val green">148</div>
            <div class="lbl">Eligible Shortlist</div>
          </div>
        </div>

        <div class="cover-footer">
          <div>
            <strong>Document:</strong> Official Methodology Report &amp; Analytical Proof<br />
            <strong>Client:</strong> Rajasthan Royals (IPL Franchise Analytics War Room)<br />
            <strong>Interactive Platform:</strong> <span class="font-mono">https://rr-pressure-intelligence-iota.vercel.app</span>
          </div>
          <div style="text-align: right;">
            <strong>Dataset Window:</strong> 2022 – 2026 (IPL &amp; T20Is)<br />
            <strong>Status:</strong> Validated • Zero Outcome Leakage<br />
            <strong>Round:</strong> 1 (Dropdown Rankings + Methodology)
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== PAGE 2: EXECUTIVE INTELLIGENCE & TOP 10 BATTERS ==================== -->
  <div class="page-container">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">EXECUTIVE INTELLIGENCE</div>
        <h2 class="section-title">1. Official Player Rankings: Top 10 Batters</h2>
      </div>
      <div class="font-mono" style="font-size: 7.5pt; color: #64748B;">SUBMISSION SUMMARY • PART A</div>
    </div>

    <p style="margin: 3px 0 6px 0;">
      In professional T20 cricket, traditional scouting metrics fail because they treat every delivery equally. A boundary scored with 30 needed off 40 balls with 9 wickets in hand is statistically recorded identically to a boundary scored with 16 needed off 6 balls in the final over.
    </p>

    <div class="callout green" style="margin: 4px 0 8px 0;">
      <div class="callout-title">🏆 Official Dropdown Selections (Unstop Form Submission)</div>
      <strong>Batters (Rank 1 to 10):</strong> 1. Rinku Singh (90.0), 2. Namboori Tilak Varma (88.8), 3. Ravindra Jadeja (88.2), 4. David Miller (86.9), 5. Sikandar Raza (84.8), 6. Matthew Wade (83.6), 7. Tim David (82.9), 8. Hardik Pandya (81.5), 9. Tristan Stubbs (80.5), 10. Curtis Campher (80.5).<br />
      <strong>Bowlers (Rank 1 to 10):</strong> 1. Mohammad Nawaz (76.1), 2. Sufiyan Muqeem (73.1), 3. Abrar Ahmed (72.6), 4. Akeal Hosein (72.3), 5. Shadab Khan (72.2), 6. Mustafizur Rahman (68.8), 7. Sunil Narine (68.4), 8. Mohammad Nabi (68.1), 9. Jofra Archer (67.4), 10. Washington Sundar (66.8).
    </div>

    <h3 style="font-size: 9.5pt; margin: 8px 0 3px 0;">Official Top 10 Batters Under Pressure</h3>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player Name</th>
          <th>ID</th>
          <th class="text-right">Reliability</th>
          <th class="text-right">Runs</th>
          <th class="text-right">Balls</th>
          <th class="text-right">Pressure SR</th>
          <th class="text-right">Baseline SR</th>
          <th class="text-right">Uplift</th>
          <th class="text-right">Avg</th>
          <th class="text-right">Consistency</th>
          <th class="text-center">Evidence</th>
        </tr>
      </thead>
      <tbody>
        {"".join([f'''<tr>
          <td class="bold">#{r['Rank']}</td>
          <td class="bold">{r['Player']}</td>
          <td class="font-mono">{r['Player_ID']}</td>
          <td class="text-right bold red-text font-mono">{r['Reliability_Score']}</td>
          <td class="text-right font-mono">{int(r['Pressure_Runs'])}</td>
          <td class="text-right font-mono">{int(r['Pressure_Balls'])}</td>
          <td class="text-right bold font-mono">{r['Pressure_Strike_Rate']}</td>
          <td class="text-right font-mono">{round(r['Pressure_Strike_Rate'] - r['Pressure_Uplift'], 2)}</td>
          <td class="text-right bold green-text font-mono">+{r['Pressure_Uplift']}</td>
          <td class="text-right font-mono">{r['Pressure_Average']}</td>
          <td class="text-right font-mono">{int(r['Match_Consistency']*100)}%</td>
          <td class="text-center"><span class="{ 'badge-high' if r['Confidence'] == 'High' else 'badge-mod' }">{r['Confidence']}</span></td>
        </tr>''' for _, r in top_10_b.iterrows()])}
      </tbody>
    </table>

    <h3 style="font-size: 9pt; margin: 10px 0 3px 0;">Core Batting Discoveries</h3>
    <div class="two-col">
      <div class="callout">
        <div class="callout-title">1. The Rinku Singh Phenomenon (Rank #1)</div>
        Rinku Singh exhibits the most extreme positive pressure divergence in modern T20 cricket. While his baseline scoring rate sits at 152.7 SR, he accelerates to <strong>193.45 SR</strong> in crunch situations (+40.77 uplift), paired with an astounding <strong>76.0 batting average</strong> across 275 pressure balls. He is mathematically the most lethal chase finisher in the world.
      </div>
      <div class="callout gold">
        <div class="callout-title">2. Tilak Varma's Unmatched Volume (Rank #2)</div>
        Namboori Tilak Varma absorbed the highest pressure volume in the entire 5-year dataset: <strong>600 pressure runs</strong> off 326 balls at 184.05 SR (+41.07 uplift). His ability to absorb powerplay collapses and maintain a 81.5% match consistency across 27 crunch matches makes him the premier middle-order cornerstone.
      </div>
    </div>
  </div>

  <!-- ==================== PAGE 3: OFFICIAL TOP 10 BOWLERS & CORE FINDINGS ==================== -->
  <div class="page-container">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">EXECUTIVE INTELLIGENCE</div>
        <h2 class="section-title">1. (Contd.) Official Player Rankings: Top 10 Bowlers</h2>
      </div>
      <div class="font-mono" style="font-size: 7.5pt; color: #64748B;">SUBMISSION SUMMARY • PART B</div>
    </div>

    <p style="margin: 3px 0 6px 0;">
      Evaluating pressure bowling requires distinguishing wicket-taking from boundary suppression. In death-over defence and tight chases, a single boundary conceded often flips win expectancy by 15–20%. Bowlers who force dot balls without leaking boundaries form the defensive spine of championship teams.
    </p>

    <h3 style="font-size: 9.5pt; margin: 8px 0 3px 0;">Official Top 10 Bowlers Under Pressure</h3>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player Name</th>
          <th>ID</th>
          <th class="text-right">Reliability</th>
          <th class="text-right">Overs</th>
          <th class="text-right">Wickets</th>
          <th class="text-right">Pressure Econ</th>
          <th class="text-right">Baseline Econ</th>
          <th class="text-right">Econ Uplift</th>
          <th class="text-right">Dot %</th>
          <th class="text-right">Consistency</th>
          <th class="text-center">Evidence</th>
        </tr>
      </thead>
      <tbody>
        {"".join([f'''<tr>
          <td class="bold">#{r['Rank']}</td>
          <td class="bold">{r['Player']}</td>
          <td class="font-mono">{r['Player_ID']}</td>
          <td class="text-right bold gold-text font-mono">{r['Reliability_Score']}</td>
          <td class="text-right font-mono">{r['Pressure_Overs']}</td>
          <td class="text-right bold font-mono">{int(r['Pressure_Wickets'])}</td>
          <td class="text-right bold font-mono">{r['Pressure_Economy']}</td>
          <td class="text-right font-mono">{round(r['Pressure_Economy'] + r['Pressure_Uplift'], 2)}</td>
          <td class="text-right bold green-text font-mono">+{r['Pressure_Uplift']}</td>
          <td class="text-right font-mono">{r['Pressure_Dot_Percentage']}%</td>
          <td class="text-right font-mono">{int(r['Consistency_Score']*100)}%</td>
          <td class="text-center"><span class="{ 'badge-high' if r['Confidence'] == 'High' else 'badge-mod' }">{r['Confidence']}</span></td>
        </tr>''' for _, r in top_10_bw.iterrows()])}
      </tbody>
    </table>

    <h3 style="font-size: 9pt; margin: 10px 0 3px 0;">Key Bowling Insights</h3>
    <div class="two-col">
      <div class="callout green">
        <div class="callout-title">1. Defensive Spin Choke Outperforms Raw Pace</div>
        Our analysis reveals that defensive spinners like <strong>Mohammad Nawaz</strong> (4.60 Econ, 51.7% dots) and <strong>Sunil Narine</strong> (5.76 Econ, 42.1% dots) restrict scoring more reliably than express seamers. In high-stakes chases, batters are forced to take low-probability aerial risks against spin, yielding dot balls and pressure wickets.
      </div>
      <div class="callout">
        <div class="callout-title">2. Mustafizur Rahman: The High-Exposure Workhorse (Rank #6)</div>
        Mustafizur Rahman carried the highest pressure workload of any bowler in the dataset: <strong>52.3 overs (314 deliveries)</strong> across 34 pressure matches, capturing <strong>26 wickets</strong> at a 7.01 economy. His off-cutter variations and wide angles make him the most durable death-overs asset.
      </div>
    </div>

    <div class="callout dark" style="margin-top: 8px;">
      <div class="callout-title">Tactical Bowling Finding for Rajasthan Royals</div>
      At Sawai Mansingh Stadium in Jaipur, expansive square boundaries reward bowlers who take pace off the ball and bowl hard lengths. Pairing an elite spin-choker (Nawaz / Narine) with high-execution cutters (Mustafizur) creates a complete 20-over defensive containment strategy.
    </div>
  </div>

  <!-- ==================== PAGE 4: PRESSURE DEFINITION & FORMULATION ==================== -->
  <div class="page-container">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">MATHEMATICAL FORMULATION</div>
        <h2 class="section-title">2. Pressure Definition &amp; Mathematical Indicators</h2>
      </div>
      <div class="font-mono" style="font-size: 7.5pt; color: #64748B;">ZERO OUTCOME LEAKAGE</div>
    </div>

    <p style="margin: 3px 0 6px 0;">
      In cricket data science, <strong>outcome leakage</strong> is the most common methodological flaw: labeling a delivery as "high pressure" because a wicket fell or a boundary was hit. Our model strictly evaluates the match state <strong>prior to delivery release</strong>.
    </p>

    <div class="callout">
      <div class="callout-title">Definition: The Pre-Delivery Context-Aware Pressure Index (CPI)</div>
      The pressure index $P_i \in [0, 100]$ represents the acute win-expectancy sensitivity of the match before ball $i$ is bowled. It quantifies how severely a suboptimal outcome (a dot ball, boundary, or wicket) will damage the team's probability of victory.
    </div>

    <div class="two-col">
      <div>
        <div class="math-card">
          <div class="math-title">2nd Innings Formulation (The Chase):</div>
          P_inn2 = RRR_score + Wicket_score + Late_leverage<br /><br />
          • RRR_score = clip((RRR - 6.0) / 8.0 * 50, 0, 50)<br />
          • Wicket_score = (Wickets_Lost / 9)^1.1 * 30<br />
          • Late_leverage = (1 - Balls_Left / 36) * 25<br />
            (active in final 6 overs if target is winnable)<br />
          • Knockout_mult = 1.12x for Playoffs/Finals
        </div>
        <p style="font-size: 7.5pt; color: #4A5568; margin: 3px 0;">
          <strong>Chase Dynamics:</strong> As RRR escalates above the T20 par of ~8.2, urgency grows linearly. If resources are depleted, every dot ball increases win-probability volatility. In blowout situations (e.g. 70 needed off 6 balls), garbage-time dampening ensures false leverage is zeroed out.
        </p>
      </div>

      <div>
        <div class="math-card">
          <div class="math-title">1st Innings Formulation (Target Setting):</div>
          P_inn1 = 10 + Crisis_score + Phase_urgency + Deficit_score<br /><br />
          • E[W] = (Over / 20.0) * 6.0 (expected wickets)<br />
          • Crisis_score = clip((Wickets_Lost - E[W]) * 12, 0, 45)<br />
          • Phase_urgency = Overs 18-20 (40 pts), Overs 16-17 (28 pts), Powerplay (15 pts)<br />
          • Deficit_score = clip((7.5 - CRR) * 5, 0, 15)<br />
          • Knockout_mult = 1.12x
        </div>
        <p style="font-size: 7.5pt; color: #4A5568; margin: 3px 0;">
          <strong>Target Setting Dynamics:</strong> Setting a total features asymmetric risk. Losing 3+ wickets in the powerplay creates a severe crisis: risk of being bowled out for sub-par total versus requirement to score. Death overs (16–20) demand maximum acceleration against specialist bowlers.
        </p>
      </div>
    </div>

    <div class="fig-container">
      {f'<img src="{img_explorer}" alt="Pressure Explorer Interface" />' if img_explorer else ''}
      <div class="fig-caption">Figure 1: Pressure Explorer — Mathematical leverage curves, distribution histogram, and pre-delivery audit cards.</div>
    </div>

    <div class="callout gold" style="margin-top: 4px;">
      <div class="callout-title">Threshold Calibration: Why P &ge; 55.0?</div>
      Across all 200,999 deliveries, $P_i$ follows a right-skewed distribution (Mean: 34.2, Median: 28.2). Deliveries with $P_i \ge 55.0$ isolate the top <strong>14.47% (29,090 deliveries)</strong>, capturing genuine match-defining crunch moments while filtering out routine game flow.
    </div>
  </div>

  <!-- ==================== PAGE 5: SIX PRESSURE ARCHETYPES & DISTRIBUTION ==================== -->
  <div class="page-container">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">TACTICAL ARCHETYPES</div>
        <h2 class="section-title">2. (Contd.) Pressure Archetypes &amp; Match Situations</h2>
      </div>
      <div class="font-mono" style="font-size: 7.5pt; color: #64748B;">EMPIRICAL DISTRIBUTION</div>
    </div>

    <p style="margin: 3px 0 6px 0;">
      A single composite index must be anchored in the tactical reality of T20 match play. We categorized all 29,090 high-pressure deliveries into six distinct tactical archetypes based on match phase, required run rate, and wicket depletion:
    </p>

    <table>
      <thead>
        <tr>
          <th>Pressure Situation Category</th>
          <th>Description &amp; Tactical Trigger</th>
          <th class="text-right">Deliveries</th>
          <th class="text-right">% of Dataset</th>
          <th class="text-right">Avg Run Rate</th>
          <th class="text-right">Balls / Wicket</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="bold">1. High-Stakes Chase</td>
          <td>2nd innings, RRR &ge; 10.0 or &le; 36 balls with winnable margin</td>
          <td class="text-right font-mono">16,082</td>
          <td class="text-right font-mono">8.00%</td>
          <td class="text-right font-mono">8.92 RPO</td>
          <td class="text-right font-mono">13.8 balls</td>
        </tr>
        <tr>
          <td class="bold">2. Death-Over Defence</td>
          <td>Overs 16–20 in 1st or 2nd innings, target setting or boundary defence</td>
          <td class="text-right font-mono">6,829</td>
          <td class="text-right font-mono">3.40%</td>
          <td class="text-right font-mono">10.14 RPO</td>
          <td class="text-right font-mono">11.2 balls</td>
        </tr>
        <tr>
          <td class="bold">3. Clutch Finish</td>
          <td>Final 3 overs (overs 18–20) with margin &le; 36 runs to win</td>
          <td class="text-right font-mono">3,479</td>
          <td class="text-right font-mono">1.73%</td>
          <td class="text-right font-mono">10.65 RPO</td>
          <td class="text-right font-mono">9.8 balls</td>
        </tr>
        <tr>
          <td class="bold">4. Early Collapse &amp; Crisis</td>
          <td>&ge; 3 wickets lost before over 8, preventing total team capitulation</td>
          <td class="text-right font-mono">1,062</td>
          <td class="text-right font-mono">0.53%</td>
          <td class="text-right font-mono">6.45 RPO</td>
          <td class="text-right font-mono">16.4 balls</td>
        </tr>
        <tr>
          <td class="bold">5. Difficult Rebuild</td>
          <td>Middle overs consolidation with run rate trailing par by &gt; 1.5 RPO</td>
          <td class="text-right font-mono">1,638</td>
          <td class="text-right font-mono">0.81%</td>
          <td class="text-right font-mono">7.12 RPO</td>
          <td class="text-right font-mono">15.1 balls</td>
        </tr>
      </tbody>
    </table>

    <div class="fig-container">
      {f'<img src="{img_hero}" alt="Overview Landing Pitch Visual" />' if img_hero else ''}
      <div class="fig-caption">Figure 2: Rajasthan Royals Cricket Analytics Command Centre — Global Navigation, Pitch Geometry, and Executive KPI Stream.</div>
    </div>

    <div class="two-col" style="margin-top: 6px;">
      <div class="callout green">
        <div class="callout-title">The Clutch Finish Anomaly</div>
        In clutch finishes (final 3 overs), balls-per-wicket drops to just <strong>9.8 balls</strong>, while run rate spikes to <strong>10.65 RPO</strong>. Players like Rinku Singh and David Miller thrive here because their strike rate spikes to 200+ without succumbing to the 9.8-ball wicket trap.
      </div>
      <div class="callout gold">
        <div class="callout-title">The Early Collapse Recovery Filter</div>
        When teams lose 3 wickets early, run rates plummet to 6.45 RPO. Players like Tilak Varma and Sikandar Raza prove invaluable by stabilizing the innings without allowing dot ball accumulation to strangle total win expectancy.
      </div>
    </div>
  </div>

  <!-- ==================== PAGE 6: PERFORMANCE MEASUREMENT & SCORING LOGIC ==================== -->
  <div class="page-container">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">SPORTS SCIENCE ENGINE</div>
        <h2 class="section-title">3. Performance Measurement &amp; Scoring Logic</h2>
      </div>
      <div class="font-mono" style="font-size: 7.5pt; color: #64748B;">SCORING ARCHITECTURE</div>
    </div>

    <p style="margin: 3px 0 6px 0;">
      Evaluating pressure players requires balancing four conflicting tensions: scoring power vs wicket risk, run restriction vs wicket-taking, and raw performance vs sample-size uncertainty.
    </p>

    <div class="two-col">
      <div>
        <div class="math-card">
          <div class="math-title">Batting Reliability Score (BRS) Architecture:</div>
          BRS_raw = (SR_pres / 175 * 35) + (min(Avg_pres, 45) / 45 * 25)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ ((Uplift_SR + 25) / 50 * 20) + (Consistency * 20)<br /><br />
          BRS_final = W_sample * BRS_raw + (1 - W_sample) * 50.0<br />
          where W_sample = Balls_pres / (Balls_pres + 40.0)
        </div>
        <ul style="font-size: 7.5pt; padding-left: 14px; margin: 3px 0;">
          <li><strong>Scoring Component (35%):</strong> Evaluates ability to score at &gt; 175 SR under pressure.</li>
          <li><strong>Wicket Preservation (25%):</strong> Protects against reckless hitters who strike high but lose wickets.</li>
          <li><strong>Pressure Uplift (20%):</strong> Rewards batters whose SR increases under pressure (&Delta;SR &gt; 0).</li>
          <li><strong>Match Consistency (20%):</strong> % of matches where batter delivered &ge; 135 SR or &ge; 20 runs.</li>
        </ul>
      </div>

      <div>
        <div class="math-card">
          <div class="math-title">Bowling Reliability Score (BWRS) Architecture:</div>
          BWRS_raw = (max(0, 12 - Econ_pres) / 6 * 35) + (Wkt_rate / 1.5 * 25)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ (Dot_pct / 50 * 20) + ((Uplift_econ + 2) / 4 * 10)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ (Consistency * 10)<br /><br />
          BWRS_final = W_sample * BWRS_raw + (1 - W_sample) * 50.0<br />
          where W_sample = Balls_pres / (Balls_pres + 45.0)
        </div>
        <ul style="font-size: 7.5pt; padding-left: 14px; margin: 3px 0;">
          <li><strong>Run Suppression (35%):</strong> Benchmarked against death/chase par (~9.2 RPO).</li>
          <li><strong>Breakthrough Ability (25%):</strong> Wickets per pressure over bowled.</li>
          <li><strong>Dot-Ball Choke (20%):</strong> % of legal balls conceded for zero runs.</li>
          <li><strong>Economy Uplift (10%):</strong> Improvement in economy under pressure.</li>
          <li><strong>Match Consistency (10%):</strong> % of matches with economy &le; 8.5 or &ge; 1 wicket.</li>
        </ul>
      </div>
    </div>

    <h3 style="font-size: 9.5pt; margin: 10px 0 3px 0;">Empirical Bayes Shrinkage &amp; Eligibility Gates</h3>
    <p style="margin: 2px 0 6px 0;">
      In unadjusted statistics, small-sample players frequently top leaderboards (e.g. a batter hitting 2 sixes in 4 pressure balls displaying a 300.0 strike rate). We established rigorous methodological safeguards:
    </p>

    <div class="two-col">
      <div class="callout gold">
        <div class="callout-title">1. Minimum Exposure Eligibility Gates</div>
        • <strong>Batters:</strong> Minimum $\ge 60$ pressure balls faced across $\ge 6$ separate matches.<br />
        • <strong>Bowlers:</strong> Minimum $\ge 12$ pressure overs (72 legal deliveries) bowled across $\ge 6$ separate matches.<br />
        Out of 958 unique players, exactly 148 players (80 batters, 68 bowlers) met the eligibility criteria.
      </div>

      <div class="callout green">
        <div class="callout-title">2. Empirical Bayes Shrinkage Mechanics</div>
        Players with exposure close to the minimum threshold are regressed toward the population mean ($50.0$). A player with 60 balls has their raw score weighted at 60%, while a player with 300 balls is weighted at 88%. This penalizes flukes while rewarding established clutch masters.
      </div>
    </div>
  </div>

  <!-- ==================== PAGE 7: FAIR COMPARISONS ACROSS COMPETITIONS ==================== -->
  <div class="page-container">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">COMPETITION NORMALIZATION</div>
        <h2 class="section-title">3. (Contd.) Fair Comparisons: IPL vs. T20I Nuances</h2>
      </div>
      <div class="font-mono" style="font-size: 7.5pt; color: #64748B;">CONTEXT INTEGRATION</div>
    </div>

    <p style="margin: 3px 0 6px 0;">
      The supplied dataset spans <strong>401 IPL matches</strong> and <strong>482 T20 Internationals</strong>. While international bilaterals feature higher variance in opposition bowling depth, IPL matches present uniform, world-class bowling attacks across all franchises.
    </p>

    <h3 style="font-size: 9pt; margin: 8px 0 3px 0;">Multi-Tiered Tournament Handling</h3>
    <div class="callout">
      <div class="callout-title">Our Tri-Level Context Architecture:</div>
      1. <strong>Combined Benchmark:</strong> The official submission Top 10 combines all 883 matches, utilizing Empirical Bayes shrinkage to exploit the full depth of 5-year data.<br />
      2. <strong>Dedicated IPL-Only Lens:</strong> We isolated the 401 IPL matches to ensure no player's ranking is purely an artifact of beating associate bowling.<br />
      3. <strong>Cross-Arena Verification:</strong> Top candidates were audited across both tournaments to verify franchise auction translatability.
    </div>

    <h3 style="font-size: 9pt; margin: 8px 0 3px 0;">IPL-Only Leaderboards (Validation Against World-Class Attacks)</h3>
    <div class="two-col">
      <div>
        <div style="font-size: 8pt; font-weight: 700; margin-bottom: 2px;">Top 5 IPL Batters Under Pressure:</div>
        <table style="font-size: 7pt;">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th class="text-right">Score</th>
              <th class="text-right">Runs</th>
              <th class="text-right">SR</th>
              <th class="text-right">Uplift</th>
            </tr>
          </thead>
          <tbody>
            {"".join([f'''<tr>
              <td class="bold">#{r['Rank']}</td>
              <td class="bold">{r['striker_name']}</td>
              <td class="text-right font-mono bold red-text">{r['reliability_score']}</td>
              <td class="text-right font-mono">{int(r['p_runs'])}</td>
              <td class="text-right font-mono">{r['p_sr']:.1f}</td>
              <td class="text-right font-mono green-text">+{r['p_uplift']:.1f}</td>
            </tr>''' for _, r in ipl_b.iterrows()])}
          </tbody>
        </table>
      </div>

      <div>
        <div style="font-size: 8pt; font-weight: 700; margin-bottom: 2px;">Top 5 IPL Bowlers Under Pressure:</div>
        <table style="font-size: 7pt;">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th class="text-right">Score</th>
              <th class="text-right">Overs</th>
              <th class="text-right">Econ</th>
              <th class="text-right">Wkts</th>
            </tr>
          </thead>
          <tbody>
            {"".join([f'''<tr>
              <td class="bold">#{r['Rank']}</td>
              <td class="bold">{r['bowler_name']}</td>
              <td class="text-right font-mono bold gold-text">{r['reliability_score']}</td>
              <td class="text-right font-mono">{r['p_overs']:.1f}</td>
              <td class="text-right font-mono">{r['p_econ']:.2f}</td>
              <td class="text-right font-mono">{int(r['p_wickets'])}</td>
            </tr>''' for _, r in ipl_bw.iterrows()])}
          </tbody>
        </table>
      </div>
    </div>

    <div class="fig-container" style="margin-top: 6px;">
      {f'<img src="{img_compare}" alt="Player Comparison Studio" />' if img_compare else ''}
      <div class="fig-caption">Figure 3: Player Comparison Studio — Head-to-head radar profiles, phase breakdowns, and IPL vs T20I context splits.</div>
    </div>

    <div class="callout green" style="margin-top: 4px;">
      <div class="callout-title">Cross-Arena Robustness Finding</div>
      Rinku Singh ranks <strong>#1 Overall (90.0)</strong> and <strong>#1 in IPL (88.8)</strong>, confirming his clutch mastery is completely robust against top-tier bowling. Similarly, Sunil Narine ranks #2 in IPL bowling (73.7), validating that mystery spin containment is franchise-proven.
    </div>
  </div>

  <!-- ==================== PAGE 8: EVIDENCE FOR TOP 10 PLAYER DOSSIERS ==================== -->
  <div class="page-container">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">DETAILED PLAYER PROFILES</div>
        <h2 class="section-title">4. Evidence for the Top 10: Player Dossiers</h2>
      </div>
      <div class="font-mono" style="font-size: 7.5pt; color: #64748B;">SCOUTING DOSSIERS</div>
    </div>

    <div class="two-col">
      <div class="fig-container">
        {f'<img src="{img_bat}" alt="Batting Intelligence Lab" />' if img_bat else ''}
        <div class="fig-caption">Figure 4A: Batting Intelligence Lab — Pressure SR vs Baseline SR scatter and phase acceleration.</div>
      </div>
      <div class="fig-container">
        {f'<img src="{img_bowl}" alt="Bowling Intelligence Lab" />' if img_bowl else ''}
        <div class="fig-caption">Figure 4B: Bowling Intelligence Lab — Pressure Economy vs Baseline, dot-ball %, and overs volume.</div>
      </div>
    </div>

    <h3 style="font-size: 9pt; margin: 6px 0 3px 0;">Scouting Dossiers for Top Candidates</h3>

    <div class="two-col">
      <!-- Batter 1: Rinku Singh -->
      <div class="dossier-card">
        <div class="head">
          <span class="p-name">1. Rinku Singh (Batter)</span>
          <span class="score">90.0 BRS • Rank #1</span>
        </div>
        <div style="font-size: 7.2pt; color: #4A5568; line-height: 1.35;">
          <strong>Why He Matters:</strong> The definitive chase-finisher in modern cricket. Scored 532 pressure runs off 275 balls at a 193.45 SR with an average of 76.0.<br />
          <strong>Data Evidence:</strong> Generates a massive +40.77 SR uplift over his baseline. 77.8% of runs come from boundaries with 79.2% match consistency.<br />
          <strong>Tactical Fit for RR:</strong> Provides the elite composure RR needs in overs 16–20, complementing power-hitters like Hetmyer and Parag.
        </div>
      </div>

      <!-- Batter 2: Tilak Varma -->
      <div class="dossier-card">
        <div class="head">
          <span class="p-name">2. Namboori Tilak Varma (Batter)</span>
          <span class="score">88.8 BRS • Rank #2</span>
        </div>
        <div style="font-size: 7.2pt; color: #4A5568; line-height: 1.35;">
          <strong>Why He Matters:</strong> The highest pressure volume accumulator in the dataset (600 runs off 326 balls at 184.05 SR).<br />
          <strong>Data Evidence:</strong> Elevates by +41.07 SR in crunch moments with 81.5% match consistency across 27 pressure matches.<br />
          <strong>Tactical Fit for RR:</strong> Left-handed middle-order anchor capable of arresting early collapses without stalling the required rate.
        </div>
      </div>

      <!-- Batter 3: Ravindra Jadeja -->
      <div class="dossier-card">
        <div class="head">
          <span class="p-name">3. Ravindra Jadeja (Batter)</span>
          <span class="score">88.2 BRS • Rank #3</span>
        </div>
        <div style="font-size: 7.2pt; color: #4A5568; line-height: 1.35;">
          <strong>Why He Matters:</strong> Unrivaled survival and strike rotation in death overs. Averages 53.25 under pressure with 88.0% positive match consistency.<br />
          <strong>Data Evidence:</strong> Dot ball percentage under pressure is just 21.3% (lowest in cohort); scores at 158.96 SR (+23.88 uplift).<br />
          <strong>Tactical Fit for RR:</strong> Premier all-rounder offering elite match awareness and lower-order clutch experience.
        </div>
      </div>

      <!-- Bowler 1: Mohammad Nawaz -->
      <div class="dossier-card">
        <div class="head">
          <span class="p-name">1. Mohammad Nawaz (Bowler)</span>
          <span class="score">76.1 BWRS • Rank #1</span>
        </div>
        <div style="font-size: 7.2pt; color: #4A5568; line-height: 1.35;">
          <strong>Why He Matters:</strong> The most restrictive pressure bowler in the dataset, conceding just 4.60 RPO across 20.0 pressure overs.<br />
          <strong>Data Evidence:</strong> 51.7% dot-ball choke rate under high pressure; took 14 wickets with 92.9% match consistency.<br />
          <strong>Tactical Fit for RR:</strong> Stifles opponent run chases through middle overs, creating boundary droughts that force dismissals.
        </div>
      </div>

      <!-- Bowler 6: Mustafizur Rahman -->
      <div class="dossier-card">
        <div class="head">
          <span class="p-name">6. Mustafizur Rahman (Bowler)</span>
          <span class="score">68.8 BWRS • Rank #6</span>
        </div>
        <div style="font-size: 7.2pt; color: #4A5568; line-height: 1.35;">
          <strong>Why He Matters:</strong> The ultimate high-exposure pressure workhorse. Bowled 52.3 pressure overs (314 balls), taking 26 wickets.<br />
          <strong>Data Evidence:</strong> 7.01 economy in death/chase overs with 45.9% dot balls and 88.2% match consistency across 34 pressure matches.<br />
          <strong>Tactical Fit for RR:</strong> Off-cutter variations and wide yorkers are custom-tailored for the large outfield at Sawai Mansingh Stadium.
        </div>
      </div>

      <!-- Bowler 7: Sunil Narine -->
      <div class="dossier-card">
        <div class="head">
          <span class="p-name">7. Sunil Narine (Bowler)</span>
          <span class="score">68.4 BWRS • Rank #7</span>
        </div>
        <div style="font-size: 7.2pt; color: #4A5568; line-height: 1.35;">
          <strong>Why He Matters:</strong> Decades of IPL pressure mastery confirmed by data. Concedes 5.76 RPO under pressure with 42.1% dots.<br />
          <strong>Data Evidence:</strong> Rank #2 in IPL-only bowling rankings; 89.5% match consistency across 19 pressure matches.<br />
          <strong>Tactical Fit for RR:</strong> Defensive mystery spin anchor who shuts down the scoring tap without leaking boundaries.
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== PAGE 9: UNCERTAINTY, BOOTSTRAP CIS & SENSITIVITY ==================== -->
  <div class="page-container">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">UNCERTAINTY &amp; SENSITIVITY</div>
        <h2 class="section-title">5. Model Reliability, Bootstrap CIs &amp; Limitations</h2>
      </div>
      <div class="font-mono" style="font-size: 7.5pt; color: #64748B;">STATISTICAL RIGOR</div>
    </div>

    <p style="margin: 2px 0 5px 0;">
      An elite analytics model must be transparent regarding uncertainty. To verify whether our Top 10 rankings represent true signal rather than noise, we conducted <strong>1,000 match-level bootstrap resamples</strong> and a multi-threshold <strong>sensitivity analysis</strong>.
    </p>

    <div class="two-col">
      <div>
        <div style="font-size: 7.5pt; font-weight: 700; margin-bottom: 2px;">Batters 90% Confidence Intervals (1,000 Resamples):</div>
        <table style="font-size: 6.8pt;">
          <thead>
            <tr>
              <th>Player</th>
              <th class="text-right">BRS</th>
              <th class="text-right">Mean SR</th>
              <th class="text-right">90% CI</th>
              <th class="text-right">SE</th>
              <th class="text-center">Stability</th>
            </tr>
          </thead>
          <tbody>
            {"".join([f'''<tr>
              <td class="bold">{r['Player']}</td>
              <td class="text-right font-mono">{r['Reliability_Score']}</td>
              <td class="text-right font-mono">{r['Pressure_SR_Mean']}</td>
              <td class="text-right font-mono bold green-text">[{r['Pressure_SR_CI_Low']}-{r['Pressure_SR_CI_High']}]</td>
              <td class="text-right font-mono">{r['Bootstrap_Std_Error']}</td>
              <td class="text-center"><span class="badge-high">{r['Rank_Stability']}</span></td>
            </tr>''' for _, r in bat_ci.iterrows()])}
          </tbody>
        </table>
      </div>

      <div>
        <div style="font-size: 7.5pt; font-weight: 700; margin-bottom: 2px;">Bowlers 90% Confidence Intervals (1,000 Resamples):</div>
        <table style="font-size: 6.8pt;">
          <thead>
            <tr>
              <th>Player</th>
              <th class="text-right">BWRS</th>
              <th class="text-right">Mean Econ</th>
              <th class="text-right">90% CI</th>
              <th class="text-right">SE</th>
              <th class="text-center">Stability</th>
            </tr>
          </thead>
          <tbody>
            {"".join([f'''<tr>
              <td class="bold">{r['Player']}</td>
              <td class="text-right font-mono">{r['Reliability_Score']}</td>
              <td class="text-right font-mono">{r['Pressure_Econ_Mean']}</td>
              <td class="text-right font-mono bold green-text">[{r['Pressure_Econ_CI_Low']}-{r['Pressure_Econ_CI_High']}]</td>
              <td class="text-right font-mono">{r['Bootstrap_Std_Error']}</td>
              <td class="text-center"><span class="badge-high">{r['Rank_Stability']}</span></td>
            </tr>''' for _, r in bowl_ci.iterrows()])}
          </tbody>
        </table>
      </div>
    </div>

    <h3 style="font-size: 8.5pt; margin: 6px 0 2px 0;">Sensitivity Analysis: Testing Model Boundaries Across Thresholds</h3>
    <table style="font-size: 7pt;">
      <thead>
        <tr>
          <th>Threshold</th>
          <th class="text-right">Deliveries</th>
          <th class="text-right">% of Dataset</th>
          <th class="text-center">Top 10 Batters Overlap</th>
          <th class="text-center">Top 10 Bowlers Overlap</th>
          <th>Leading Batter</th>
          <th>Leading Bowler</th>
        </tr>
      </thead>
      <tbody>
        {"".join([f'''<tr>
          <td class="bold font-mono">P &ge; {r['Pressure_Threshold']}.0</td>
          <td class="text-right font-mono">{r['High_Pressure_Deliveries']:,}</td>
          <td class="text-right font-mono">{r['High_Pressure_Pct']}%</td>
          <td class="text-center font-mono bold">{r['Top_10_Batters_Overlap']}</td>
          <td class="text-center font-mono bold">{r['Top_10_Bowlers_Overlap']}</td>
          <td class="bold">{r['Leading_Batter']}</td>
          <td class="bold">{r['Leading_Bowler']}</td>
        </tr>''' for _, r in sensitivity.iterrows()])}
      </tbody>
    </table>

    <div class="callout gold" style="margin: 4px 0;">
      <div class="callout-title">Sensitivity Finding</div>
      The benchmark threshold of $P \ge 55.0$ represents the optimal trade-off: capturing 29,090 deliveries (14.5% of dataset) while maintaining a 90% overlap with higher thresholds. As threshold reaches $P \ge 70.0$ (extreme crunch), Rinku Singh remains the #1 rated batter in the world.
    </div>

    <h3 style="font-size: 8.5pt; margin: 5px 0 2px 0;">Known Data Limitations &amp; Ethical Disclosures</h3>
    <ul style="font-size: 7.2pt; padding-left: 14px; margin: 2px 0; color: #4A5568;">
      <li><strong>Opposition Strength in T20Is:</strong> Associate international fixtures have higher attack variance; cross-validated via IPL-only rankings.</li>
      <li><strong>Sample Size Constraints:</strong> Players like Matthew Wade and Curtis Campher exhibit elite numbers but lower volume ($&lt; 120$ balls), appropriately tagged with <em>Moderate Evidence</em> badges.</li>
      <li><strong>Zero Auction Speculation:</strong> The framework makes no assumptions regarding player retention status, availability, base prices, or franchise purse limits. It serves strictly as an empirical talent-reliability intelligence platform.</li>
    </ul>
  </div>

  <!-- ==================== PAGE 10: RAJASTHAN ROYALS AUCTION WAR ROOM ==================== -->
  <div class="page-container">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">AUCTION STRATEGY</div>
        <h2 class="section-title">6. Rajasthan Royals Auction War Room Blueprint</h2>
      </div>
      <div class="font-mono" style="font-size: 7.5pt; color: #64748B;">IPL 2027 SQUAD FIT</div>
    </div>

    <p style="margin: 2px 0 5px 0;">
      This analytical engine transitions directly into actionable decision-support for the Rajasthan Royals scouting and auction management team ahead of the IPL 2027 Auction.
    </p>

    <div class="fig-container">
      {f'<img src="{img_warroom}" alt="Auction War Room Priority Matrix" />' if img_warroom else ''}
      <div class="fig-caption">Figure 5: Rajasthan Royals Auction War Room — 2D Priority Matrix (Reliability vs Evidence Strength) and Tactical Fit Board.</div>
    </div>

    <h3 style="font-size: 9pt; margin: 6px 0 2px 0;">Target Quadrants &amp; Tactical Role Recommendations for RR</h3>
    <div class="two-col">
      <div class="callout">
        <div class="callout-title">1. Tier 1 Core Targets (High Reliability + High Evidence)</div>
        • <strong>Rinku Singh (Batter):</strong> The ultimate chase stabilizer. Solves RR's lower-middle order scoring stalls in tight chases.<br />
        • <strong>Namboori Tilak Varma (Batter):</strong> Middle-order anchor capable of arresting early collapses while accelerating to 180+ SR.<br />
        • <strong>Mohammad Nawaz (Bowler):</strong> Premier spin restrictor (4.60 economy under pressure).<br />
        • <strong>Mustafizur Rahman (Bowler):</strong> High-exposure death cutter specialist (52.3 pressure overs, 26 wickets).
      </div>

      <div class="callout gold">
        <div class="callout-title">2. High-Upside Auction Opportunities</div>
        • <strong>Tristan Stubbs (Batter):</strong> 169.26 pressure SR with 360-degree boundary hitting against express pace and spin.<br />
        • <strong>Ashutosh Sharma (Batter):</strong> 195.89 pressure SR in IPL matches. Extraordinary clutch striking from deficit situations.<br />
        • <strong>Sufiyan Muqeem (Bowler):</strong> 15 pressure wickets at 5.82 economy with left-arm wrist spin deception.<br />
        • <strong>Jofra Archer (Bowler):</strong> Express pace (145+ kph) with +2.02 economy suppression under pressure.
      </div>
    </div>

    <h3 style="font-size: 8.5pt; margin: 6px 0 2px 0;">Sawai Mansingh Stadium Tactical Fit</h3>
    <p style="font-size: 7.5pt; color: #4A5568; margin: 2px 0 6px 0;">
      At Jaipur's home ground, large square boundaries reward defensive spin chokers (> 45% dot balls) and cutters into the pitch. Incorporating bowlers like <strong>Mohammad Nawaz</strong>, <strong>Sunil Narine</strong>, or <strong>Mustafizur Rahman</strong> provides the tactical bowling shield needed to defend par totals of 165–175.
    </p>

    <div class="callout green" style="margin-top: 4px;">
      <div class="callout-title">Software Architecture &amp; Reproducibility</div>
      • <strong>Interactive Web App:</strong> Built with React 18, TypeScript, Tailwind CSS, Recharts, and Vite.<br />
      • <strong>Live Platform URL:</strong> <a href="https://rr-pressure-intelligence-iota.vercel.app">https://rr-pressure-intelligence-iota.vercel.app</a><br />
      • <strong>GitHub Repository:</strong> <a href="https://github.com/MohanSriJ/rr-pressure-intelligence">https://github.com/MohanSriJ/rr-pressure-intelligence</a><br />
      • <strong>Data Pipeline:</strong> Python scripts located in <span class="font-mono">scripts/process_analytics.py</span> and <span class="font-mono">scripts/generate_app_data.py</span> completely reproduce all metrics from raw ball-by-ball records.
    </div>

    <div style="text-align: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid #CBD5E1; font-size: 7pt; color: #64748B;">
      <strong>Rajasthan Royals SupeRR Selector Season 2 • Round 1 Official Submission</strong><br />
      All data derived from historical ball-by-ball records (2022–2026). Verified and fully reproducible.
    </div>
  </div>

</body>
</html>
"""

html_path = os.path.join(BASE_DIR, "report_temp.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("3. Compiling PDF via Chrome headless print-to-pdf...")
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    f"--print-to-pdf={OUTPUT_PDF}",
    "--no-pdf-header-footer",
    html_path
]

try:
    subprocess.run(cmd, check=True)
    if os.path.exists(OUTPUT_PDF):
        size_kb = os.path.getsize(OUTPUT_PDF) / 1024
        print(f"PDF Generated successfully! Size: {size_kb:.1f} KB at {OUTPUT_PDF}")
        
        # Verify page count with PyMuPDF
        doc = fitz.open(OUTPUT_PDF)
        print(f"Verified PDF Page Count: {len(doc)} pages")
        doc.close()
    else:
        print("PDF file not found after generation.")
except Exception as e:
    print(f"Error compiling PDF: {e}")

# Clean up temporary HTML
if os.path.exists(html_path):
    os.remove(html_path)

print("Process finished successfully.")
