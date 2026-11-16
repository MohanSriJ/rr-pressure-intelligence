"""
Quick Player Dossier Inspector for SupeRR Selector Dataset
"""

import sys
import os
import pandas as pd
import numpy as np

DATA_DIR = r"c:\Users\mohan\Downloads\Rajasthan Royals Cricket Analytics War Room\data"
RAW_DATA_DIR = r"C:\Users\mohan\Downloads\6af458274c1e8_data_pack\Data Pack"

all_b = pd.read_csv(os.path.join(DATA_DIR, "All_Player_Batting_Scores.csv"))
all_bw = pd.read_csv(os.path.join(DATA_DIR, "All_Player_Bowling_Scores.csv"))
top_b = pd.read_csv(os.path.join(DATA_DIR, "Top_10_Batters.csv"))
top_bw = pd.read_csv(os.path.join(DATA_DIR, "Top_10_Bowlers.csv"))

query_players = [
    'Rinku Singh', 'Namboori Tilak Varma', 'Ravindra Jadeja', 'David Miller', 
    'Tim David', 'Tristan Stubbs', 'Hardik Pandya', 'Jos Buttler', 'Sanju Samson',
    'Shimron Hetmyer', 'Riyan Parag', 'Mohammad Nawaz', 'Mustafizur Rahman', 
    'Sunil Narine', 'Jasprit Bumrah', 'Jofra Archer', 'Yuzvendra Chahal', 
    'Trent Boult', 'Sandeep Sharma'
]

print("="*80)
print("RR PRESSURE INTELLIGENCE — DETAILED PLAYER ANALYSIS DOSSIER")
print("Data Source: 6af458274c1e8_data_pack (883 matches, 200,999 balls, 2022-2026)")
print("="*80)

for p in query_players:
    mb = all_b[all_b['striker_name'].str.contains(p, case=False, na=False)]
    mbw = all_bw[all_bw['bowler_name'].str.contains(p, case=False, na=False)]
    
    has_b = len(mb) > 0 and mb.iloc[0]['all_balls'] > 0
    has_bw = len(mbw) > 0 and mbw.iloc[0]['all_legal_balls'] > 0
    
    if not has_b and not has_bw:
        continue
        
    print(f"\n>>> PLAYER: {p.upper()} <<<")
    
    if has_b:
        rb = mb.iloc[0]
        is_top_b = len(top_b[top_b['Player_ID'] == rb['striker_id']]) > 0
        rank_str = f"Rank #{top_b[top_b['Player_ID'] == rb['striker_id']].iloc[0]['Rank']} Top 10 Batter" if is_top_b else "Cohort Candidate"
        print(f"  [BATTING PROFILE] ID: {rb['striker_id']} | Status: {rank_str}")
        print(f"  • Reliability Score (BRS): {rb['reliability_score']:.1f} / 100 ({rb['confidence']} Evidence)")
        print(f"  • High Pressure (P>=55): {rb['p_runs']:.0f} runs, {rb['p_balls']:.0f} balls, SR: {rb['p_sr']:.2f}, Avg: {rb['p_avg']:.2f}")
        print(f"  • Normal Baseline:       {rb['norm_runs']:.0f} runs, {rb['norm_balls']:.0f} balls, SR: {rb['norm_sr']:.2f}, Avg: {rb['norm_avg']:.2f}")
        print(f"  • Pressure Uplift:       {rb['p_uplift']:+.2f} SR delta under crunch situations")
        print(f"  • Boundary & Dot Rate:   {rb['p_boundary_pct']:.1f}% boundary runs | {rb['p_dot_pct']:.1f}% dot ball wastage")
        print(f"  • Match Consistency:     {rb['match_consistency']*100:.1f}% positive impact across {rb['p_matches']:.0f} pressure matches (Total: {rb['all_matches']:.0f} matches)")

    if has_bw:
        rbw = mbw.iloc[0]
        is_top_bw = len(top_bw[top_bw['Player_ID'] == rbw['bowler_id']]) > 0
        rank_str = f"Rank #{top_bw[top_bw['Player_ID'] == rbw['bowler_id']].iloc[0]['Rank']} Top 10 Bowler" if is_top_bw else "Cohort Candidate"
        print(f"  [BOWLING PROFILE] ID: {rbw['bowler_id']} | Status: {rank_str}")
        print(f"  • Reliability Score (BWRS): {rbw['reliability_score']:.1f} / 100 ({rbw['confidence']} Evidence)")
        print(f"  • High Pressure (P>=55):  {rbw['p_overs']:.1f} overs, {rbw['p_wickets']:.0f} wickets, Econ: {rbw['p_econ']:.2f} RPO, Dot: {rbw['p_dot_pct']:.1f}%")
        print(f"  • Normal Baseline:        {rbw['norm_balls']/6.0:.1f} overs, {rbw['norm_wkts']:.0f} wickets, Econ: {rbw['norm_econ']:.2f} RPO")
        print(f"  • Pressure Economy Uplift: {rbw['p_uplift']:+.2f} RPO suppression under pressure")
        print(f"  • Match Consistency:      {rbw['consistency_score']*100:.1f}% positive match control across {rbw['p_matches']:.0f} pressure matches (Total: {rbw['all_matches']:.0f} matches)")
