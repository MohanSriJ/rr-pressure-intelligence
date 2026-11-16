import React, { useState } from 'react';
import { 
  GitCompare, 
  Award, 
  ArrowRight, 
  Check, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

interface PlayerComparisonViewProps {
  comparisonData: any;
  onSelectPlayer: (player: any) => void;
}

export const PlayerComparisonView: React.FC<PlayerComparisonViewProps> = ({
  comparisonData,
  onSelectPlayer,
}) => {
  const [mode, setMode] = useState<'batters' | 'bowlers'>('batters');
  
  const battersList = comparisonData.batters || [];
  const bowlersList = comparisonData.bowlers || [];

  const currentList = mode === 'batters' ? battersList : bowlersList;

  const [player1Id, setPlayer1Id] = useState<number>(currentList[0]?.id || 4708);
  const [player2Id, setPlayer2Id] = useState<number>(currentList[1]?.id || 7897);

  // Switch defaults when changing mode
  const handleModeChange = (newMode: 'batters' | 'bowlers') => {
    setMode(newMode);
    const list = newMode === 'batters' ? battersList : bowlersList;
    if (list.length >= 2) {
      setPlayer1Id(list[0].id);
      setPlayer2Id(list[1].id);
    }
  };

  const p1 = currentList.find((p: any) => p.id === player1Id) || currentList[0] || {};
  const p2 = currentList.find((p: any) => p.id === player2Id) || currentList[1] || {};

  // Build unified radar data
  const radarMetrics = (p1.radar || []).map((m: any, idx: number) => {
    const p2Metric = (p2.radar || [])[idx] || {};
    return {
      subject: m.subject,
      [p1.name]: m.value,
      [p2.name]: p2Metric.value || 0,
    };
  });

  // Dimensional winner comparison
  const dimensions = mode === 'batters' ? [
    { label: 'Reliability Score', v1: p1.reliability_score, v2: p2.reliability_score, unit: 'pts', higherIsBetter: true },
    { label: 'Pressure Strike Rate', v1: p1.p_sr, v2: p2.p_sr, unit: 'SR', higherIsBetter: true },
    { label: 'Pressure Average', v1: p1.p_avg, v2: p2.p_avg, unit: 'Avg', higherIsBetter: true },
    { label: 'Pressure Uplift', v1: p1.p_uplift, v2: p2.p_uplift, unit: 'delta', higherIsBetter: true },
    { label: 'Match Consistency', v1: p1.consistency, v2: p2.consistency, unit: '%', higherIsBetter: true },
    { label: 'Pressure Volume', v1: p1.p_balls, v2: p2.p_balls, unit: 'balls', higherIsBetter: true },
  ] : [
    { label: 'Reliability Score', v1: p1.reliability_score, v2: p2.reliability_score, unit: 'pts', higherIsBetter: true },
    { label: 'Pressure Economy', v1: p1.p_econ, v2: p2.p_econ, unit: 'RPO', higherIsBetter: false }, // lower is better
    { label: 'Pressure Wickets', v1: p1.p_wickets, v2: p2.p_wickets, unit: 'wkts', higherIsBetter: true },
    { label: 'Dot Ball Frequency', v1: p1.p_dot_pct, v2: p2.p_dot_pct, unit: '%', higherIsBetter: true },
    { label: 'Economy Uplift', v1: p1.p_uplift, v2: p2.p_uplift, unit: 'RPO tighter', higherIsBetter: true },
    { label: 'Consistency Score', v1: p1.consistency, v2: p2.consistency, unit: '%', higherIsBetter: true },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#233550] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#E23C45]" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#E23C45] uppercase">
              PLAYER COMPARISON STUDIO
            </span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white mt-1">
            Head-to-Head Pressure Diagnostics
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-1 max-w-xl">
            Multi-dimensional radar profiling and evidence-based performance contrast across high-leverage situations.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mt-4 md:mt-0 flex items-center bg-[#111C2E] border border-[#233550] rounded-xl p-1">
          <button
            onClick={() => handleModeChange('batters')}
            className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'batters' ? 'bg-[#E23C45] text-white font-bold' : 'text-[#A7B1C2] hover:text-white'
            }`}
          >
            Compare Batters
          </button>
          <button
            onClick={() => handleModeChange('bowlers')}
            className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'bowlers' ? 'bg-[#D6B46C] text-[#0B1220] font-bold' : 'text-[#A7B1C2] hover:text-white'
            }`}
          >
            Compare Bowlers
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111C2E] border border-[#233550] rounded-2xl p-5 shadow-xl">
        {/* Player 1 Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-[#E23C45] uppercase font-bold tracking-wider">
            Candidate Alpha (Red Vector)
          </label>
          <select
            value={player1Id}
            onChange={(e) => setPlayer1Id(Number(e.target.value))}
            className="w-full bg-[#0B1220] border border-[#233550] text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#E23C45] font-heading font-semibold"
          >
            {currentList.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.reliability_score} BRS)
              </option>
            ))}
          </select>
        </div>

        {/* Player 2 Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-[#D6B46C] uppercase font-bold tracking-wider">
            Candidate Beta (Gold Vector)
          </label>
          <select
            value={player2Id}
            onChange={(e) => setPlayer2Id(Number(e.target.value))}
            className="w-full bg-[#0B1220] border border-[#233550] text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#D6B46C] font-heading font-semibold"
          >
            {currentList.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.reliability_score} BRS)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid: Radar Chart + Dimensional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 6-Axis Radar Chart */}
        <div className="lg:col-span-6 bg-[#111C2E] border border-[#233550] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-[#233550] pb-3 flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-white">
              6-Axis Capability Radar
            </h3>
            <span className="text-[10px] font-mono text-[#A7B1C2]">
              Normalized Scale (0-100)
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="75%" data={radarMetrics}>
                <PolarGrid stroke="#233550" />
                <PolarAngleAxis dataKey="subject" stroke="#A7B1C2" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#233550" />
                <Radar 
                  name={p1.name} 
                  dataKey={p1.name} 
                  stroke="#E23C45" 
                  fill="#E23C45" 
                  fillOpacity={0.35} 
                  strokeWidth={2}
                />
                <Radar 
                  name={p2.name} 
                  dataKey={p2.name} 
                  stroke="#D6B46C" 
                  fill="#D6B46C" 
                  fillOpacity={0.35} 
                  strokeWidth={2}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#172438', borderColor: '#233550', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-[#A7B1C2] border-t border-[#233550] pt-3 flex justify-between">
            <span className="text-[#E23C45] font-semibold">{p1.name}: {p1.reliability_score} Score</span>
            <span className="text-[#D6B46C] font-semibold">{p2.name}: {p2.reliability_score} Score</span>
          </div>
        </div>

        {/* Right: Dimension-by-Dimension Evidence Table */}
        <div className="lg:col-span-6 bg-[#111C2E] border border-[#233550] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-[#233550] pb-3">
            <h3 className="text-base font-heading font-bold text-white">
              Dimensional Evaluation Verdict
            </h3>
            <p className="text-[11px] text-[#A7B1C2]">
              Strictly grounded in historical empirical figures:
            </p>
          </div>

          <div className="space-y-3">
            {dimensions.map((dim, i) => {
              const p1Wins = dim.higherIsBetter ? (dim.v1 > dim.v2) : (dim.v1 < dim.v2);
              const isTie = dim.v1 === dim.v2;
              return (
                <div key={i} className="bg-[#0B1220] border border-[#233550] rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between text-[#A7B1C2] font-mono text-[11px] mb-1.5">
                    <span>{dim.label}</span>
                    <span className="text-[10px] uppercase font-bold text-[#D6B46C]">
                      {isTie ? 'Parity' : (p1Wins ? `${p1.name} Advantage` : `${p2.name} Advantage`)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-mono">
                    <div className={`flex items-center ${p1Wins && !isTie ? 'text-[#E23C45] font-bold' : 'text-[#A7B1C2]'}`}>
                      {dim.v1} {dim.unit}
                      {p1Wins && !isTie && <Check className="w-3.5 h-3.5 ml-1" />}
                    </div>

                    <div className="text-[#6B7A92] text-[10px]">VS</div>

                    <div className={`flex items-center ${!p1Wins && !isTie ? 'text-[#D6B46C] font-bold' : 'text-[#A7B1C2]'}`}>
                      {!p1Wins && !isTie && <Check className="w-3.5 h-3.5 mr-1" />}
                      {dim.v2} {dim.unit}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evidence-Based Comparison Summary */}
          <div className="bg-[#172438] border border-[#233550] rounded-xl p-4 text-xs text-[#A7B1C2] leading-relaxed">
            <span className="text-white font-semibold font-heading">Analyst Verdict: </span>
            {p1.name} and {p2.name} demonstrate complementary tactical profiles. While {p1.name} exhibits {p1.p_sr ? `a strike rate of ${p1.p_sr}` : `an economy rate of ${p1.p_econ}`}, {p2.name} presents {p2.p_balls ? `${p2.p_balls} balls of exposure` : `${p2.p_overs} overs of pressure bowling`}. Choice for Rajasthan Royals hinges on tactical role specialization (death boundary acceleration vs anchor rebuilding).
          </div>
        </div>

      </div>

    </div>
  );
};
