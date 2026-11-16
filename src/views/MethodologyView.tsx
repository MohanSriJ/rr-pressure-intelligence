import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Database, 
  Cpu, 
  AlertTriangle,
  ShieldCheck,
  Scale
} from 'lucide-react';

interface MethodologyViewProps {
  methodologyData: any;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({
  methodologyData,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('formulas');

  const battingCi = methodologyData.batting_ci || [];
  const bowlingCi = methodologyData.bowling_ci || [];
  const sensitivity = methodologyData.sensitivity || [];
  const summary = methodologyData.dataset_summary || [];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="border-b border-[#233550] pb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#38B889]" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#38B889] uppercase">
            AUDITABLE SPORTS SCIENCE • OPEN ARCHITECTURE
          </span>
        </div>
        <h1 className="text-3xl font-heading font-black text-white mt-1">
          Methodology &amp; Data Transparency
        </h1>
        <p className="text-xs text-[#A7B1C2] mt-1 max-w-2xl leading-relaxed">
          Comprehensive scientific documentation detailing the Context-Aware Pressure Index, Empirical Bayes shrinkage, 1,000-sample bootstrap uncertainty bounds, and sensitivity tests.
        </p>
      </div>

      {/* Dataset Provenance & Cleaning Rules Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C2E] border border-[#233550] rounded-xl p-5 space-y-2">
          <div className="flex items-center text-[#D6B46C] text-xs font-mono font-bold uppercase">
            <Database className="w-4 h-4 mr-2" />
            1. Source Provenance
          </div>
          <h4 className="text-sm font-heading font-bold text-white">Full Ball-by-Ball Records</h4>
          <p className="text-xs text-[#A7B1C2] leading-relaxed">
            Covers 883 matches across 141 competitions (2022–2026), comprising 401 IPL matches and 482 T20 Internationals, totaling 200,999 tracked deliveries.
          </p>
        </div>

        <div className="bg-[#111C2E] border border-[#233550] rounded-xl p-5 space-y-2">
          <div className="flex items-center text-[#E23C45] text-xs font-mono font-bold uppercase">
            <Cpu className="w-4 h-4 mr-2" />
            2. Delivery Attribution Rules
          </div>
          <h4 className="text-sm font-heading font-bold text-white">Cricket-Grade Precision</h4>
          <p className="text-xs text-[#A7B1C2] leading-relaxed">
            Bowler wickets credit only bowled, caught, LBW, stumped, and hit wicket (excluding run outs). Legbyes and byes are excluded from bowler economy.
          </p>
        </div>

        <div className="bg-[#111C2E] border border-[#233550] rounded-xl p-5 space-y-2">
          <div className="flex items-center text-[#38B889] text-xs font-mono font-bold uppercase">
            <Scale className="w-4 h-4 mr-2" />
            3. Zero Leakage Architecture
          </div>
          <h4 className="text-sm font-heading font-bold text-white">Pre-Delivery Evaluation</h4>
          <p className="text-xs text-[#A7B1C2] leading-relaxed">
            The pressure score is strictly computed from cumulative state before each ball is bowled, guaranteeing zero outcome leakage into leverage scoring.
          </p>
        </div>
      </div>

      {/* EXPANDABLE METHODOLOGY DOSSIERS */}
      <div className="space-y-4">
        
        {/* Accordion 1: Mathematical Formulas */}
        <div className="bg-[#111C2E] border border-[#233550] rounded-2xl overflow-hidden shadow-xl">
          <button
            onClick={() => toggleSection('formulas')}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#172438] transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#E23C45]/15 text-[#E23C45] flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Mathematical Formulas &amp; Scoring Architecture
                </h3>
                <p className="text-xs text-[#A7B1C2]">
                  Pressure Index (CPI), Batting Reliability Score (BRS), and Bowling Reliability Score (BWRS)
                </p>
              </div>
            </div>
            {expandedSection === 'formulas' ? <ChevronUp className="w-5 h-5 text-[#A7B1C2]" /> : <ChevronDown className="w-5 h-5 text-[#A7B1C2]" />}
          </button>

          {expandedSection === 'formulas' && (
            <div className="p-6 bg-[#0B1220] border-t border-[#233550] space-y-6 text-xs text-[#A7B1C2] font-mono">
              <div className="space-y-2">
                <h4 className="text-white font-sans font-bold text-sm">1. Batting Reliability Score (BRS) Formulation:</h4>
                <div className="bg-[#172438] p-4 rounded-xl text-[#F5F6F8] leading-relaxed">
                  BRS_raw = (Pressure_SR / 175 * 35) + (min(Pressure_Avg, 45) / 45 * 25) + ((Pressure_Uplift + 25) / 50 * 20) + (Match_Consistency * 20)
                  <br />
                  <span className="text-[#D6B46C]">BRS_final = W_sample * BRS_raw + (1 - W_sample) * Cohort_Benchmark</span>
                  <br />
                  <span className="text-[#A7B1C2] text-[11px]">where W_sample = Balls_pressure / (Balls_pressure + 40.0), and Cohort_Benchmark = 50.0</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-sans font-bold text-sm">2. Bowling Reliability Score (BWRS) Formulation:</h4>
                <div className="bg-[#172438] p-4 rounded-xl text-[#F5F6F8] leading-relaxed">
                  BWRS_raw = (max(0, 12.0 - Pressure_Econ) / 6.0 * 35) + ((Wickets / Overs) / 1.5 * 25) + (Dot_Pct / 50 * 20) + ((Uplift + 2.0) / 4.0 * 10) + (Consistency * 10)
                  <br />
                  <span className="text-[#D6B46C]">BWRS_final = W_sample * BWRS_raw + (1 - W_sample) * Cohort_Benchmark</span>
                  <br />
                  <span className="text-[#A7B1C2] text-[11px]">where W_sample = Legal_Balls_pressure / (Legal_Balls_pressure + 45.0), and Cohort_Benchmark = 50.0</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Empirical Bayes Shrinkage */}
        <div className="bg-[#111C2E] border border-[#233550] rounded-2xl overflow-hidden shadow-xl">
          <button
            onClick={() => toggleSection('shrinkage')}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#172438] transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#D6B46C]/15 text-[#D6B46C] flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Empirical Bayes Shrinkage &amp; Eligibility Filters
                </h3>
                <p className="text-xs text-[#A7B1C2]">
                  Preventing small-sample anomalies from distorting auction recommendations
                </p>
              </div>
            </div>
            {expandedSection === 'shrinkage' ? <ChevronUp className="w-5 h-5 text-[#A7B1C2]" /> : <ChevronDown className="w-5 h-5 text-[#A7B1C2]" />}
          </button>

          {expandedSection === 'shrinkage' && (
            <div className="p-6 bg-[#0B1220] border-t border-[#233550] space-y-4 text-xs text-[#A7B1C2] leading-relaxed">
              <p>
                In unregularized sports statistics, small-sample players frequently top leaderboards (e.g., a batter who hit 2 sixes in 5 pressure balls displaying a 240.0 strike rate).
              </p>
              <div className="bg-[#172438] p-4 rounded-xl border border-[#233550] space-y-2">
                <div className="text-white font-bold font-sans">Three Safeguards Implemented:</div>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
                  <li><span className="text-white">Minimum Eligibility Gate:</span> Batters require &ge; 60 pressure balls across &ge; 6 matches; Bowlers require &ge; 12 pressure overs (72 legal balls) across &ge; 6 matches.</li>
                  <li><span className="text-white">Bayesian Shrinkage Towards Cohort Mean:</span> Regressing scores towards population benchmark (50.0) based on sample exposure.</li>
                  <li><span className="text-white">Confidence Classification:</span> High Evidence (&ge; 100 balls / &ge; 20 overs, &ge; 10 matches), Moderate Evidence (&ge; 60 balls / &ge; 12 overs), Limited Evidence (&lt; 60 balls).</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: Match-Level Bootstrap Uncertainty Analysis */}
        <div className="bg-[#111C2E] border border-[#233550] rounded-2xl overflow-hidden shadow-xl">
          <button
            onClick={() => toggleSection('bootstrap')}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#172438] transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#38B889]/15 text-[#38B889] flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Match-Level Bootstrap Resampling (1,000 Iterations)
                </h3>
                <p className="text-xs text-[#A7B1C2]">
                  Evaluating 90% confidence intervals and rank stability across resampled tournaments
                </p>
              </div>
            </div>
            {expandedSection === 'bootstrap' ? <ChevronUp className="w-5 h-5 text-[#A7B1C2]" /> : <ChevronDown className="w-5 h-5 text-[#A7B1C2]" />}
          </button>

          {expandedSection === 'bootstrap' && (
            <div className="p-6 bg-[#0B1220] border-t border-[#233550] space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Top 10 Batters Bootstrap Confidence Intervals
                </h4>
                <div className="border border-[#233550] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#172438] text-[#A7B1C2] text-[10px] uppercase border-b border-[#233550]">
                      <tr>
                        <th className="py-2.5 px-3">Player</th>
                        <th className="py-2.5 px-3 text-right">Reliability Score</th>
                        <th className="py-2.5 px-3 text-right">Pressure SR Mean</th>
                        <th className="py-2.5 px-3 text-right">90% CI (Low - High)</th>
                        <th className="py-2.5 px-3 text-right">Bootstrap SE</th>
                        <th className="py-2.5 px-3 text-center">Stability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#233550] bg-[#111C2E]">
                      {battingCi.map((r: any, idx: number) => (
                        <tr key={idx} className="hover:bg-[#172438]">
                          <td className="py-2 px-3 text-white font-sans font-bold">{r.Player}</td>
                          <td className="py-2 px-3 text-right text-[#D6B46C]">{r.Reliability_Score}</td>
                          <td className="py-2 px-3 text-right text-white">{r.Pressure_SR_Mean}</td>
                          <td className="py-2 px-3 text-right text-[#38B889]">[{r.Pressure_SR_CI_Low} - {r.Pressure_SR_CI_High}]</td>
                          <td className="py-2 px-3 text-right text-[#A7B1C2]">{r.Bootstrap_Std_Error}</td>
                          <td className="py-2 px-3 text-center">
                            <span className="text-[10px] text-[#38B889] bg-[#38B889]/10 px-2 py-0.5 rounded font-bold">
                              {r.Rank_Stability}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Top 10 Bowlers Bootstrap Confidence Intervals
                </h4>
                <div className="border border-[#233550] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#172438] text-[#A7B1C2] text-[10px] uppercase border-b border-[#233550]">
                      <tr>
                        <th className="py-2.5 px-3">Player</th>
                        <th className="py-2.5 px-3 text-right">Reliability Score</th>
                        <th className="py-2.5 px-3 text-right">Pressure Econ Mean</th>
                        <th className="py-2.5 px-3 text-right">90% CI (Low - High)</th>
                        <th className="py-2.5 px-3 text-right">Bootstrap SE</th>
                        <th className="py-2.5 px-3 text-center">Stability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#233550] bg-[#111C2E]">
                      {bowlingCi.map((r: any, idx: number) => (
                        <tr key={idx} className="hover:bg-[#172438]">
                          <td className="py-2 px-3 text-white font-sans font-bold">{r.Player}</td>
                          <td className="py-2 px-3 text-right text-[#D6B46C]">{r.Reliability_Score}</td>
                          <td className="py-2 px-3 text-right text-white">{r.Pressure_Econ_Mean}</td>
                          <td className="py-2 px-3 text-right text-[#38B889]">[{r.Pressure_Econ_CI_Low} - {r.Pressure_Econ_CI_High}]</td>
                          <td className="py-2 px-3 text-right text-[#A7B1C2]">{r.Bootstrap_Std_Error}</td>
                          <td className="py-2 px-3 text-center">
                            <span className="text-[10px] text-[#38B889] bg-[#38B889]/10 px-2 py-0.5 rounded font-bold">
                              {r.Rank_Stability}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 4: Known Data Limitations */}
        <div className="bg-[#111C2E] border border-[#233550] rounded-2xl overflow-hidden shadow-xl">
          <button
            onClick={() => toggleSection('limitations')}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#172438] transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#E9AE55]/15 text-[#E9AE55] flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Known Data Limitations &amp; Ethical Boundary Disclosures
                </h3>
                <p className="text-xs text-[#A7B1C2]">
                  Transparent reporting of dataset constraints and analytical scope
                </p>
              </div>
            </div>
            {expandedSection === 'limitations' ? <ChevronUp className="w-5 h-5 text-[#A7B1C2]" /> : <ChevronDown className="w-5 h-5 text-[#A7B1C2]" />}
          </button>

          {expandedSection === 'limitations' && (
            <div className="p-6 bg-[#0B1220] border-t border-[#233550] space-y-3 text-xs text-[#A7B1C2] leading-relaxed">
              <div className="bg-[#172438] p-4 rounded-xl border border-[#233550] space-y-2">
                <div className="text-white font-bold font-sans flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-[#E9AE55]" />
                  Analytical Disclosures for RR Evaluators:
                </div>
                <ul className="list-disc list-inside space-y-1.5 font-mono text-[11px]">
                  <li><span className="text-white">Sample Imbalance Between IPL and T20Is:</span> Certain overseas players have heavier exposure in international bilateral T20Is than IPL. The platform provides dedicated IPL-only and T20I-only toggle filters to verify context purity.</li>
                  <li><span className="text-white">Fielding Extra Attribution:</span> Byes and legbyes are not attributed to bowlers; wides and oversteps are properly penalized.</li>
                  <li><span className="text-white">Zero Auction Guesswork:</span> The platform does not invent auction purse, retention status, player availability, or base prices. It operates strictly as an objective performance-reliability intelligence engine.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
