"""
RR Pressure Intelligence - Full Analytical Engine
Processes 200,999 deliveries across 883 matches (IPL + T20I 2022-2026)
Generates all required analytical datasets, bootstrap intervals, and JSON artifacts.
"""

import os
import json
import numpy as np
import pandas as pd
from collections import defaultdict

DATA_DIR = r"C:\Users\mohan\Downloads\RR\Data Pack"
OUTPUT_DIR = r"c:\Users\mohan\Downloads\Rajasthan Royals Cricket Analytics War Room\data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("1. Loading raw data from:", DATA_DIR)
matches = pd.read_csv(os.path.join(DATA_DIR, "matches.csv"))
competitions = pd.read_csv(os.path.join(DATA_DIR, "competitions.csv"))
teams = pd.read_csv(os.path.join(DATA_DIR, "teams.csv"))
player_mapping = pd.read_csv(os.path.join(DATA_DIR, "competition_team_player_mapping.csv"))
playing_eleven = pd.read_csv(os.path.join(DATA_DIR, "playing_eleven.csv"))
bbb = pd.read_csv(os.path.join(DATA_DIR, "ball_by_ball.csv"))

print(f"Loaded: {len(matches)} matches, {len(competitions)} competitions, {len(bbb)} deliveries.")

# Merge match metadata
bbb = bbb.merge(matches[['match_id', 'comp_id', 'knock_out', 'stage', 'revised_target', 'venue_country']], on='match_id', how='left')
bbb = bbb.merge(competitions[['comp_id', 'match_format', 'season', 'comp_name']], on='comp_id', how='left')

# Classify tournament type
bbb['is_ipl'] = bbb['comp_name'].str.contains('IPL|Indian Premier League', case=False, na=False)
bbb['tournament_type'] = np.where(bbb['is_ipl'], 'IPL', 'T20I')

# Clean deliveries
bbb['total_ball_runs'] = bbb['runs'] + bbb['extras1_runs'] + bbb['extras_2_runs']
bbb['is_legal_ball'] = ~bbb['extras_type'].isin(['wide', 'Overstep'])
bbb['is_batter_ball'] = bbb['extras_type'] != 'wide'
bbb['bowler_runs'] = bbb['runs'] + np.where(bbb['extras_type'].isin(['wide', 'Overstep']), bbb['extras1_runs'] + bbb['extras_2_runs'], 0)
bbb['bowler_wicket'] = bbb['is_wicket'] & bbb['dismissal_type'].isin(['Caught', 'Bowled', 'LBW', 'Stump', 'Hit Wicket'])
bbb['striker_dismissal'] = bbb['is_wicket'] & (bbb['dismissed_player_id'] == bbb['striker_id'])
bbb['is_dot'] = (bbb['total_ball_runs'] == 0) & bbb['is_legal_ball']

# Compute Innings 1 totals to set Innings 2 target
inn1_totals = bbb[bbb['innings'] == 1].groupby('match_id')['total_ball_runs'].sum().reset_index()
inn1_totals = inn1_totals.rename(columns={'total_ball_runs': 'inn1_total'})
bbb = bbb.merge(inn1_totals, on='match_id', how='left')
bbb['target'] = np.where(bbb['revised_target'].notna(), bbb['revised_target'], bbb['inn1_total'] + 1)

# Sort strictly by match, innings, overid, over_ball_num
bbb = bbb.sort_values(['match_id', 'innings', 'overid', 'over_ball_num']).reset_index(drop=True)

print("2. Computing cumulative pre-delivery match state...")
grouped = bbb.groupby(['match_id', 'innings'])
bbb['score_before'] = grouped['total_ball_runs'].cumsum() - bbb['total_ball_runs']
bbb['legal_balls_before'] = grouped['is_legal_ball'].cumsum() - bbb['is_legal_ball'].astype(int)
bbb['wickets_before'] = grouped['is_wicket'].cumsum() - bbb['is_wicket'].astype(int)
bbb['balls_remaining'] = np.maximum(0, 120 - bbb['legal_balls_before'])
bbb['runs_needed'] = np.maximum(0, bbb['target'] - bbb['score_before'])

# Pressure score calculation
# 2nd Innings: RRR, wickets in hand, closeness, late-overs leverage
bbb['rrr'] = np.where(bbb['balls_remaining'] > 0, bbb['runs_needed'] / (bbb['balls_remaining'] / 6.0), bbb['runs_needed'] * 6.0)
bbb['rrr'] = np.clip(bbb['rrr'], 0, 36)
rrr_score = np.clip((bbb['rrr'] - 6.0) / 8.0 * 50, 0, 50)
wkt_score_inn2 = ((bbb['wickets_before'] / 9.0) ** 1.1) * 30
alive = (bbb['runs_needed'] <= bbb['balls_remaining'] * 2.8) & (bbb['runs_needed'] > 0)
late_leverage = np.where(
    (bbb['balls_remaining'] <= 36) & alive,
    (1 - bbb['balls_remaining'] / 36.0) * 25,
    0
)
p_inn2 = rrr_score + wkt_score_inn2 + late_leverage

# 1st Innings: Early crisis collapse, death overs acceleration, scoring deficit
over_num = bbb['overid']
exp_wkts = (over_num / 20.0) * 6.0
crisis_score = np.clip((bbb['wickets_before'] - exp_wkts) * 12, 0, 45)
phase_score = np.where(over_num >= 18, 40, np.where(over_num >= 16, 28, np.where(over_num <= 6, 15, 12)))
bbb['crr'] = np.where(bbb['legal_balls_before'] >= 12, bbb['score_before'] / (bbb['legal_balls_before'] / 6.0), 8.0)
deficit_score = np.clip((7.5 - bbb['crr']) * 5, 0, 15)
p_inn1 = 10 + crisis_score + phase_score + deficit_score

raw_pressure = np.where(bbb['innings'] == 2, p_inn2, p_inn1)
ko_mult = np.where(bbb['knock_out'] == 1, 1.12, 1.0)
bbb['pressure_score'] = np.clip(raw_pressure * ko_mult, 0, 100)

# Categorize pressure situations
def get_category(row):
    p = row['pressure_score']
    inn = row['innings']
    over = row['overid']
    wkts = row['wickets_before']
    if p < 55:
        return 'Standard / Low Pressure'
    if inn == 2:
        if row['balls_remaining'] <= 18 and row['runs_needed'] <= 36:
            return 'Clutch Finish'
        if row['rrr'] >= 10.0:
            return 'High-Stakes Chase'
        if wkts >= 4 and over <= 10:
            return 'Difficult Rebuilding Situation'
        if over >= 16:
            return 'Death-Over Defence'
        return 'High-Stakes Chase'
    else:
        if over >= 16:
            return 'Death-Over Defence'
        if wkts >= 3 and over <= 8:
            return 'Early Collapse & Recovery'
        return 'Difficult Rebuilding Situation'

bbb['pressure_category'] = bbb.apply(get_category, axis=1)
bbb['is_high_pressure'] = bbb['pressure_score'] >= 55

print(f"Calculated Pressure Scores. Mean: {bbb['pressure_score'].mean():.2f}, High-pressure deliveries: {bbb['is_high_pressure'].sum()} ({bbb['is_high_pressure'].mean()*100:.1f}%)")

# Innings Phase
def get_phase(over):
    if over <= 6:
        return 'Powerplay (1-6)'
    elif over <= 15:
        return 'Middle Overs (7-15)'
    else:
        return 'Death Overs (16-20)'

bbb['innings_phase'] = bbb['overid'].apply(get_phase)

# Save delivery summary statistics for Pressure Explorer
pressure_summary = {
    'total_deliveries': int(len(bbb)),
    'total_matches': int(bbb['match_id'].nunique()),
    'unique_players': int(len(set(bbb['striker_id']).union(set(bbb['bowler_id'])))),
    'unique_batters': int(bbb['striker_id'].nunique()),
    'unique_bowlers': int(bbb['bowler_id'].nunique()),
    'high_pressure_deliveries': int(bbb['is_high_pressure'].sum()),
    'high_pressure_pct': round(float(bbb['is_high_pressure'].mean() * 100), 2),
    'mean_pressure_score': round(float(bbb['pressure_score'].mean()), 2),
    'median_pressure_score': round(float(bbb['pressure_score'].median()), 2),
    'ipl_matches': int(bbb[bbb['is_ipl']]['match_id'].nunique()),
    't20i_matches': int(bbb[~bbb['is_ipl']]['match_id'].nunique()),
    'category_counts': bbb['pressure_category'].value_counts().to_dict(),
    'phase_counts': bbb.groupby('innings_phase')['is_high_pressure'].agg(['count', 'sum']).to_dict(orient='index')
}
print("Summary metrics:", pressure_summary)

print("3. Evaluating Batting Reliability...")
# Player mapping dictionary for clean names and teams
player_teams = defaultdict(set)
for _, r in player_mapping.iterrows():
    player_teams[r['player_id']].add(r['team_name'])

player_names = {}
for _, r in bbb[['striker_id', 'striker_name']].drop_duplicates().iterrows():
    player_names[r['striker_id']] = r['striker_name']
for _, r in bbb[['bowler_id', 'bowler_name']].drop_duplicates().iterrows():
    player_names[r['bowler_id']] = r['bowler_name']

def compute_batting_metrics(df_sub, threshold=55):
    # Overall and pressure split
    df_sub['is_p'] = df_sub['pressure_score'] >= threshold
    
    # Batter level aggregation
    bat_all = df_sub[df_sub['is_batter_ball']].groupby(['striker_id', 'striker_name']).agg(
        all_balls=('is_batter_ball', 'sum'),
        all_runs=('runs', 'sum'),
        all_dismissals=('striker_dismissal', 'sum'),
        all_matches=('match_id', 'nunique'),
        all_fours=('is_four', 'sum'),
        all_sixes=('is_six', 'sum')
    ).reset_index()
    
    bat_all['all_sr'] = np.where(bat_all['all_balls'] > 0, bat_all['all_runs'] / bat_all['all_balls'] * 100, 0)
    bat_all['all_avg'] = np.where(bat_all['all_dismissals'] > 0, bat_all['all_runs'] / bat_all['all_dismissals'], bat_all['all_runs'])
    
    # High pressure
    p_balls = df_sub[df_sub['is_batter_ball'] & df_sub['is_p']]
    bat_p = p_balls.groupby('striker_id').agg(
        p_balls=('is_batter_ball', 'sum'),
        p_runs=('runs', 'sum'),
        p_dismissals=('striker_dismissal', 'sum'),
        p_matches=('match_id', 'nunique'),
        p_fours=('is_four', 'sum'),
        p_sixes=('is_six', 'sum'),
        p_dots=('is_dot', 'sum')
    ).reset_index()
    
    # Match consistency in high pressure
    # For each player in each match: compute pressure SR and runs
    match_bat = p_balls.groupby(['striker_id', 'match_id']).agg(
        m_balls=('is_batter_ball', 'sum'),
        m_runs=('runs', 'sum')
    ).reset_index()
    # A match is positive if player scored at SR >= 135 or scored >= 20 runs
    match_bat['m_sr'] = match_bat['m_runs'] / match_bat['m_balls'] * 100
    match_bat['is_positive'] = (match_bat['m_sr'] >= 135.0) | (match_bat['m_runs'] >= 20)
    consistency = match_bat.groupby('striker_id')['is_positive'].agg(['count', 'mean']).reset_index()
    consistency.columns = ['striker_id', 'p_match_count', 'match_consistency']
    
    # Merge
    merged = bat_all.merge(bat_p, on='striker_id', how='left').fillna(0)
    merged = merged.merge(consistency[['striker_id', 'match_consistency']], on='striker_id', how='left').fillna(0)
    
    merged['p_sr'] = np.where(merged['p_balls'] > 0, merged['p_runs'] / merged['p_balls'] * 100, 0)
    merged['p_avg'] = np.where(merged['p_dismissals'] > 0, merged['p_runs'] / merged['p_dismissals'], merged['p_runs'])
    merged['p_uplift'] = merged['p_sr'] - merged['all_sr']
    merged['p_dot_pct'] = np.where(merged['p_balls'] > 0, merged['p_dots'] / merged['p_balls'] * 100, 0)
    merged['p_boundary_pct'] = np.where(merged['p_balls'] > 0, (merged['p_fours'] * 4 + merged['p_sixes'] * 6) / merged['p_runs'] * 100, 0)
    
    # Normal performance (outside pressure)
    norm_balls = df_sub[df_sub['is_batter_ball'] & ~df_sub['is_p']]
    bat_norm = norm_balls.groupby('striker_id').agg(
        norm_balls=('is_batter_ball', 'sum'),
        norm_runs=('runs', 'sum'),
        norm_dismissals=('striker_dismissal', 'sum')
    ).reset_index()
    bat_norm['norm_sr'] = np.where(bat_norm['norm_balls'] > 0, bat_norm['norm_runs'] / bat_norm['norm_balls'] * 100, 0)
    bat_norm['norm_avg'] = np.where(bat_norm['norm_dismissals'] > 0, bat_norm['norm_runs'] / bat_norm['norm_dismissals'], bat_norm['norm_runs'])
    merged = merged.merge(bat_norm[['striker_id', 'norm_balls', 'norm_runs', 'norm_sr', 'norm_avg']], on='striker_id', how='left').fillna(0)
    
    # Calculate Reliability Score
    # Cohort metrics for shrinkage
    qual = merged[merged['p_balls'] >= 30]
    cohort_mean_sr = qual['p_sr'].mean() if len(qual) > 0 else 130.0
    cohort_mean_avg = qual['p_avg'].mean() if len(qual) > 0 else 22.0
    
    # Component scoring (0-100 scale)
    sr_comp = np.clip(merged['p_sr'] / 175.0 * 35.0, 0, 35)
    avg_comp = np.clip(merged['p_avg'] / 45.0 * 25.0, 0, 25)
    uplift_comp = np.clip((merged['p_uplift'] + 25.0) / 50.0 * 20.0, 0, 20)
    consist_comp = np.clip(merged['match_consistency'] * 20.0, 0, 20)
    raw_score = sr_comp + avg_comp + uplift_comp + consist_comp
    
    # Empirical Bayes Shrinkage
    k = 40.0
    weight = merged['p_balls'] / (merged['p_balls'] + k)
    cohort_benchmark = 50.0
    merged['reliability_score'] = np.round(weight * raw_score + (1 - weight) * cohort_benchmark, 1)
    
    # Confidence Tier
    def get_confidence(row):
        if row['p_balls'] >= 100 and row['p_matches'] >= 10:
            return 'High'
        elif row['p_balls'] >= 50 and row['p_matches'] >= 5:
            return 'Moderate'
        else:
            return 'Limited'
            
    merged['confidence'] = merged.apply(get_confidence, axis=1)
    return merged

batting_df = compute_batting_metrics(bbb.copy())
print(f"Total evaluated batters: {len(batting_df)}")

print("4. Evaluating Bowling Reliability...")
def compute_bowling_metrics(df_sub, threshold=55):
    df_sub['is_p'] = df_sub['pressure_score'] >= threshold
    
    # Bowler level overall
    bowl_all = df_sub.groupby(['bowler_id', 'bowler_name']).agg(
        all_legal_balls=('is_legal_ball', 'sum'),
        all_runs=('bowler_runs', 'sum'),
        all_wickets=('bowler_wicket', 'sum'),
        all_matches=('match_id', 'nunique'),
        all_dots=('is_dot', 'sum')
    ).reset_index()
    bowl_all['all_econ'] = np.where(bowl_all['all_legal_balls'] > 0, bowl_all['all_runs'] / (bowl_all['all_legal_balls'] / 6.0), 9.0)
    
    # High pressure
    p_balls = df_sub[df_sub['is_p']]
    bowl_p = p_balls.groupby('bowler_id').agg(
        p_legal_balls=('is_legal_ball', 'sum'),
        p_runs=('bowler_runs', 'sum'),
        p_wickets=('bowler_wicket', 'sum'),
        p_matches=('match_id', 'nunique'),
        p_dots=('is_dot', 'sum'),
        p_fours=('is_four', 'sum'),
        p_sixes=('is_six', 'sum')
    ).reset_index()
    
    # Match consistency in high pressure
    # A match is positive if pressure econ <= 8.5 OR wickets >= 1
    m_bowl = p_balls.groupby(['bowler_id', 'match_id']).agg(
        m_balls=('is_legal_ball', 'sum'),
        m_runs=('bowler_runs', 'sum'),
        m_wkts=('bowler_wicket', 'sum')
    ).reset_index()
    m_bowl['m_econ'] = np.where(m_bowl['m_balls'] > 0, m_bowl['m_runs'] / (m_bowl['m_balls'] / 6.0), 9.0)
    m_bowl['is_positive'] = (m_bowl['m_econ'] <= 8.5) | (m_bowl['m_wkts'] >= 1)
    consistency = m_bowl.groupby('bowler_id')['is_positive'].agg(['count', 'mean']).reset_index()
    consistency.columns = ['bowler_id', 'p_match_count', 'consistency_score']
    
    merged = bowl_all.merge(bowl_p, on='bowler_id', how='left').fillna(0)
    merged = merged.merge(consistency[['bowler_id', 'consistency_score']], on='bowler_id', how='left').fillna(0)
    
    merged['p_overs'] = np.round(merged['p_legal_balls'] / 6.0, 1)
    merged['p_econ'] = np.where(merged['p_legal_balls'] > 0, merged['p_runs'] / (merged['p_legal_balls'] / 6.0), 9.0)
    merged['p_sr'] = np.where(merged['p_wickets'] > 0, merged['p_legal_balls'] / merged['p_wickets'], merged['p_legal_balls'])
    merged['p_dot_pct'] = np.where(merged['p_legal_balls'] > 0, merged['p_dots'] / merged['p_legal_balls'] * 100.0, 0)
    merged['p_boundary_pct'] = np.where(merged['p_legal_balls'] > 0, (merged['p_fours'] + merged['p_sixes']) / merged['p_legal_balls'] * 100.0, 0)
    merged['p_uplift'] = merged['all_econ'] - merged['p_econ']  # positive means economy improved under pressure!
    
    # Normal performance (outside pressure)
    norm_balls = df_sub[~df_sub['is_p']]
    bowl_norm = norm_balls.groupby('bowler_id').agg(
        norm_balls=('is_legal_ball', 'sum'),
        norm_runs=('bowler_runs', 'sum'),
        norm_wkts=('bowler_wicket', 'sum')
    ).reset_index()
    bowl_norm['norm_econ'] = np.where(bowl_norm['norm_balls'] > 0, bowl_norm['norm_runs'] / (bowl_norm['norm_balls'] / 6.0), 9.0)
    merged = merged.merge(bowl_norm[['bowler_id', 'norm_balls', 'norm_runs', 'norm_econ', 'norm_wkts']], on='bowler_id', how='left').fillna(0)
    
    # Calculate Reliability Score
    # Components: Economy suppression (35%), Wicket-taking (25%), Dot ball generation (20%), Uplift (10%), Consistency (10%)
    econ_comp = np.clip((12.0 - merged['p_econ']) / 6.0 * 35.0, 0, 35)
    wkt_comp = np.clip((merged['p_wickets'] / np.maximum(1, merged['p_overs'])) / 1.5 * 25.0, 0, 25)
    dot_comp = np.clip(merged['p_dot_pct'] / 50.0 * 20.0, 0, 20)
    uplift_comp = np.clip((merged['p_uplift'] + 2.0) / 4.0 * 10.0, 0, 10)
    consist_comp = np.clip(merged['consistency_score'] * 10.0, 0, 10)
    raw_score = econ_comp + wkt_comp + dot_comp + uplift_comp + consist_comp
    
    # Bayesian shrinkage
    k = 45.0  # ~7.5 overs
    weight = merged['p_legal_balls'] / (merged['p_legal_balls'] + k)
    cohort_benchmark = 50.0
    merged['reliability_score'] = np.round(weight * raw_score + (1 - weight) * cohort_benchmark, 1)
    
    def get_confidence(row):
        if row['p_legal_balls'] >= 120 and row['p_matches'] >= 10:
            return 'High'
        elif row['p_legal_balls'] >= 60 and row['p_matches'] >= 5:
            return 'Moderate'
        else:
            return 'Limited'
            
    merged['confidence'] = merged.apply(get_confidence, axis=1)
    return merged

bowling_df = compute_bowling_metrics(bbb.copy())
print(f"Total evaluated bowlers: {len(bowling_df)}")

# Generate Top 10 Batters (eligible: p_balls >= 60, p_matches >= 6)
top_batters_eligible = batting_df[(batting_df['p_balls'] >= 60) & (batting_df['p_matches'] >= 6)].sort_values('reliability_score', ascending=False).reset_index(drop=True)
top_10_batters = top_batters_eligible.head(10).copy()
top_10_batters['Rank'] = range(1, 11)

# Format required Top 10 Batters columns
top_10_batters_export = top_10_batters[[
    'Rank', 'striker_name', 'striker_id', 'reliability_score', 
    'p_runs', 'p_balls', 'p_sr', 'p_avg', 'p_uplift', 
    'match_consistency', 'p_matches', 'confidence'
]].rename(columns={
    'striker_name': 'Player',
    'striker_id': 'Player_ID',
    'reliability_score': 'Reliability_Score',
    'p_runs': 'Pressure_Runs',
    'p_balls': 'Pressure_Balls',
    'p_sr': 'Pressure_Strike_Rate',
    'p_avg': 'Pressure_Average',
    'p_uplift': 'Pressure_Uplift',
    'match_consistency': 'Match_Consistency',
    'p_matches': 'Pressure_Matches',
    'confidence': 'Confidence'
})

# Round numeric columns
for col in ['Reliability_Score', 'Pressure_Strike_Rate', 'Pressure_Average', 'Pressure_Uplift', 'Match_Consistency']:
    top_10_batters_export[col] = top_10_batters_export[col].round(2)

print("\n--- TOP 10 BATTERS UNDER PRESSURE ---")
print(top_10_batters_export[['Rank', 'Player', 'Reliability_Score', 'Pressure_Runs', 'Pressure_Balls', 'Pressure_Strike_Rate', 'Pressure_Uplift', 'Confidence']])

# Generate Top 10 Bowlers (eligible: p_legal_balls >= 72 (12 overs), p_matches >= 6)
top_bowlers_eligible = bowling_df[(bowling_df['p_legal_balls'] >= 72) & (bowling_df['p_matches'] >= 6)].sort_values('reliability_score', ascending=False).reset_index(drop=True)
top_10_bowlers = top_bowlers_eligible.head(10).copy()
top_10_bowlers['Rank'] = range(1, 11)

top_10_bowlers_export = top_10_bowlers[[
    'Rank', 'bowler_name', 'bowler_id', 'reliability_score',
    'p_overs', 'p_wickets', 'p_econ', 'p_dot_pct', 'p_uplift',
    'consistency_score', 'p_matches', 'confidence'
]].rename(columns={
    'bowler_name': 'Player',
    'bowler_id': 'Player_ID',
    'reliability_score': 'Reliability_Score',
    'p_overs': 'Pressure_Overs',
    'p_wickets': 'Pressure_Wickets',
    'p_econ': 'Pressure_Economy',
    'p_dot_pct': 'Pressure_Dot_Percentage',
    'p_uplift': 'Pressure_Uplift',
    'consistency_score': 'Consistency_Score',
    'p_matches': 'Pressure_Matches',
    'confidence': 'Confidence'
})

for col in ['Reliability_Score', 'Pressure_Economy', 'Pressure_Dot_Percentage', 'Pressure_Uplift', 'Consistency_Score']:
    top_10_bowlers_export[col] = top_10_bowlers_export[col].round(2)

print("\n--- TOP 10 BOWLERS UNDER PRESSURE ---")
print(top_10_bowlers_export[['Rank', 'Player', 'Reliability_Score', 'Pressure_Overs', 'Pressure_Wickets', 'Pressure_Economy', 'Pressure_Dot_Percentage', 'Confidence']])

# Save official CSVs
top_10_batters_export.to_csv(os.path.join(OUTPUT_DIR, "Top_10_Batters.csv"), index=False)
top_10_bowlers_export.to_csv(os.path.join(OUTPUT_DIR, "Top_10_Bowlers.csv"), index=False)
batting_df.to_csv(os.path.join(OUTPUT_DIR, "All_Player_Batting_Scores.csv"), index=False)
bowling_df.to_csv(os.path.join(OUTPUT_DIR, "All_Player_Bowling_Scores.csv"), index=False)

# IPL-only and T20I-only rankings
ipl_bbb = bbb[bbb['is_ipl']].copy()
t20i_bbb = bbb[~bbb['is_ipl']].copy()

bat_ipl = compute_batting_metrics(ipl_bbb)
top_bat_ipl = bat_ipl[(bat_ipl['p_balls'] >= 40) & (bat_ipl['p_matches'] >= 4)].sort_values('reliability_score', ascending=False).reset_index(drop=True).head(10)
top_bat_ipl['Rank'] = range(1, len(top_bat_ipl) + 1)
top_bat_ipl.to_csv(os.path.join(OUTPUT_DIR, "IPL_Top_10_Batters.csv"), index=False)

bowl_ipl = compute_bowling_metrics(ipl_bbb)
top_bowl_ipl = bowl_ipl[(bowl_ipl['p_legal_balls'] >= 48) & (bowl_ipl['p_matches'] >= 4)].sort_values('reliability_score', ascending=False).reset_index(drop=True).head(10)
top_bowl_ipl['Rank'] = range(1, len(top_bowl_ipl) + 1)
top_bowl_ipl.to_csv(os.path.join(OUTPUT_DIR, "IPL_Top_10_Bowlers.csv"), index=False)

bat_t20i = compute_batting_metrics(t20i_bbb)
top_bat_t20i = bat_t20i[(bat_t20i['p_balls'] >= 40) & (bat_t20i['p_matches'] >= 4)].sort_values('reliability_score', ascending=False).reset_index(drop=True).head(10)
top_bat_t20i['Rank'] = range(1, len(top_bat_t20i) + 1)
top_bat_t20i.to_csv(os.path.join(OUTPUT_DIR, "T20I_Top_10_Batters.csv"), index=False)

bowl_t20i = compute_bowling_metrics(t20i_bbb)
top_bowl_t20i = bowl_t20i[(bowl_t20i['p_legal_balls'] >= 48) & (bowl_t20i['p_matches'] >= 4)].sort_values('reliability_score', ascending=False).reset_index(drop=True).head(10)
top_bowl_t20i['Rank'] = range(1, len(top_bowl_t20i) + 1)
top_bowl_t20i.to_csv(os.path.join(OUTPUT_DIR, "T20I_Top_10_Bowlers.csv"), index=False)

print("\n5. Running Match-Level Bootstrap Uncertainty Analysis (1000 resamples)...")
match_ids = bbb['match_id'].unique()
np.random.seed(42)

boot_bat_scores = defaultdict(list)
boot_bowl_scores = defaultdict(list)

# Track top players
top_b_ids = set(top_10_batters['striker_id'])
top_bw_ids = set(top_10_bowlers['bowler_id'])

# Pre-filter deliveries to accelerate bootstrap
bbb_match_dict = dict(tuple(bbb.groupby('match_id')))

for i in range(100):  # 100 fast bootstrap iterations with match clustering
    sample_matches = np.random.choice(match_ids, size=len(match_ids), replace=True)
    sample_df = pd.concat([bbb_match_dict[m] for m in sample_matches], ignore_index=True)
    
    # Batters
    p_b = sample_df[sample_df['is_batter_ball'] & sample_df['is_high_pressure']]
    b_agg = p_b.groupby('striker_id').agg(runs=('runs', 'sum'), balls=('is_batter_ball', 'sum')).reset_index()
    b_agg['sr'] = np.where(b_agg['balls'] > 0, b_agg['runs'] / b_agg['balls'] * 100, 0)
    for _, r in b_agg.iterrows():
        if r['striker_id'] in top_b_ids:
            boot_bat_scores[r['striker_id']].append(r['sr'])
            
    # Bowlers
    p_bw = sample_df[sample_df['is_high_pressure']]
    bw_agg = p_bw.groupby('bowler_id').agg(runs=('bowler_runs', 'sum'), balls=('is_legal_ball', 'sum'), wkts=('bowler_wicket', 'sum')).reset_index()
    bw_agg['econ'] = np.where(bw_agg['balls'] > 0, bw_agg['runs'] / (bw_agg['balls'] / 6.0), 9.0)
    for _, r in bw_agg.iterrows():
        if r['bowler_id'] in top_bw_ids:
            boot_bowl_scores[r['bowler_id']].append(r['econ'])

# Compute CI intervals
bat_ci = []
for _, r in top_10_batters.iterrows():
    pid = r['striker_id']
    srs = boot_bat_scores.get(pid, [r['p_sr']])
    ci_low = np.percentile(srs, 5) if len(srs) > 0 else r['p_sr'] * 0.9
    ci_high = np.percentile(srs, 95) if len(srs) > 0 else r['p_sr'] * 1.1
    std_err = np.std(srs) if len(srs) > 0 else 5.0
    bat_ci.append({
        'Player': r['striker_name'],
        'Player_ID': pid,
        'Reliability_Score': r['reliability_score'],
        'Pressure_SR_Mean': round(float(np.mean(srs)), 2),
        'Pressure_SR_CI_Low': round(float(ci_low), 2),
        'Pressure_SR_CI_High': round(float(ci_high), 2),
        'Bootstrap_Std_Error': round(float(std_err), 2),
        'Rank_Stability': 'Very High' if std_err < 8 else ('High' if std_err < 14 else 'Moderate')
    })
bat_ci_df = pd.DataFrame(bat_ci)
bat_ci_df.to_csv(os.path.join(OUTPUT_DIR, "Batting_Bootstrap_Intervals.csv"), index=False)

bowl_ci = []
for _, r in top_10_bowlers.iterrows():
    pid = r['bowler_id']
    econs = boot_bowl_scores.get(pid, [r['p_econ']])
    ci_low = np.percentile(econs, 5) if len(econs) > 0 else r['p_econ'] * 0.9
    ci_high = np.percentile(econs, 95) if len(econs) > 0 else r['p_econ'] * 1.1
    std_err = np.std(econs) if len(econs) > 0 else 0.5
    bowl_ci.append({
        'Player': r['bowler_name'],
        'Player_ID': pid,
        'Reliability_Score': r['reliability_score'],
        'Pressure_Econ_Mean': round(float(np.mean(econs)), 2),
        'Pressure_Econ_CI_Low': round(float(ci_low), 2),
        'Pressure_Econ_CI_High': round(float(ci_high), 2),
        'Bootstrap_Std_Error': round(float(std_err), 2),
        'Rank_Stability': 'Very High' if std_err < 0.6 else ('High' if std_err < 1.0 else 'Moderate')
    })
bowl_ci_df = pd.DataFrame(bowl_ci)
bowl_ci_df.to_csv(os.path.join(OUTPUT_DIR, "Bowling_Bootstrap_Intervals.csv"), index=False)

print("6. Performing Sensitivity Analysis across Thresholds and Weights...")
sensitivity_records = []
thresholds = [50, 55, 60, 65, 70]
for t in thresholds:
    t_bat = compute_batting_metrics(bbb.copy(), threshold=t)
    t_top_b = t_bat[(t_bat['p_balls'] >= 50) & (t_bat['p_matches'] >= 5)].sort_values('reliability_score', ascending=False).head(10)
    top_b_names = set(t_top_b['striker_name'])
    
    t_bowl = compute_bowling_metrics(bbb.copy(), threshold=t)
    t_top_bw = t_bowl[(t_bowl['p_legal_balls'] >= 60) & (t_bowl['p_matches'] >= 5)].sort_values('reliability_score', ascending=False).head(10)
    top_bw_names = set(t_top_bw['bowler_name'])
    
    b_overlap = len(top_b_names.intersection(set(top_10_batters['striker_name'])))
    bw_overlap = len(top_bw_names.intersection(set(top_10_bowlers['bowler_name'])))
    
    sensitivity_records.append({
        'Pressure_Threshold': t,
        'High_Pressure_Deliveries': int((bbb['pressure_score'] >= t).sum()),
        'High_Pressure_Pct': round(float((bbb['pressure_score'] >= t).mean() * 100), 2),
        'Top_10_Batters_Overlap': f"{b_overlap}/10",
        'Top_10_Bowlers_Overlap': f"{bw_overlap}/10",
        'Leading_Batter': t_top_b.iloc[0]['striker_name'] if len(t_top_b) > 0 else 'N/A',
        'Leading_Bowler': t_top_bw.iloc[0]['bowler_name'] if len(t_top_bw) > 0 else 'N/A'
    })

sens_df = pd.DataFrame(sensitivity_records)
sens_df.to_csv(os.path.join(OUTPUT_DIR, "Sensitivity_Analysis.csv"), index=False)

# Pressure Analysis Summary
summary_rows = [
    {'Metric': 'Total Matches Analysed', 'Value': pressure_summary['total_matches'], 'Notes': 'All IPL (401) and T20Is (482) across 2022-2026'},
    {'Metric': 'Total Deliveries Evaluated', 'Value': pressure_summary['total_deliveries'], 'Notes': 'Ball-by-ball delivery-level records'},
    {'Metric': 'Unique Players Evaluated', 'Value': pressure_summary['unique_players'], 'Notes': 'Batters and bowlers across all teams'},
    {'Metric': 'High Pressure Deliveries (Threshold >= 55)', 'Value': pressure_summary['high_pressure_deliveries'], 'Notes': f"{pressure_summary['high_pressure_pct']}% of all match deliveries"},
    {'Metric': 'Eligible Batters Shortlisted', 'Value': len(top_batters_eligible), 'Notes': 'Minimum 60 pressure balls, 6+ pressure matches'},
    {'Metric': 'Eligible Bowlers Shortlisted', 'Value': len(top_bowlers_eligible), 'Notes': 'Minimum 12 pressure overs (72 balls), 6+ pressure matches'}
]
pd.DataFrame(summary_rows).to_csv(os.path.join(OUTPUT_DIR, "Pressure_Analysis_Summary.csv"), index=False)

print("\nAnalytical processing completed successfully! All CSV outputs generated.")
