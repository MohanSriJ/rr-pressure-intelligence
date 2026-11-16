import React, { useState } from 'react';
import { 
  Gavel, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  Award,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';

interface AuctionWarRoomViewProps {
  warRoomData: any;
  onSelectPlayer: (player: any) => void;
}

export const AuctionWarRoomView: React.FC<AuctionWarRoomViewProps> = ({
  warRoomData,
  onSelectPlayer,
}) => {
  const [activeBoardCategory, setActiveBoardCategory] = useState<string>('high_confidence_performers');
  
  const targetBoard = warRoomData.target_board || {};
  const priorityMatrix = warRoomData.priority_matrix || [];

  const boardTabs = [
    { id: 'high_confidence_performers', label: 'High-Confidence Performers', count: (targetBoard.high_confidence_performers || []).length },
    { id: 'high_upside_players', label: 'High-Upside Candidates', count: (targetBoard.high_upside_players || []).length },
    { id: 'consistent_performers', label: 'Consistent Performers', count: (targetBoard.consistent_performers || []).length },
    { id: 'specialist_candidates', label: 'Role Specialists', count: (targetBoard.specialist_candidates || []).length },
  ];

  const currentCards = targetBoard[activeBoardCategory] || [];

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#233550] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#D6B46C]" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#D6B46C] uppercase">
              IPL 2027 FRANCHISE INTELLIGENCE
            </span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white mt-1">
            Rajasthan Royals Auction War Room
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-1 max-w-2xl leading-relaxed">
            Evidence-based decision-support system translating empirical pressure reliability into tactical squad building recommendations.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-[#172438] border border-[#233550] rounded-xl px-3.5 py-2">
          <Info className="w-4 h-4 text-[#D6B46C]" />
          <span className="text-[11px] text-[#A7B1C2]">
            Evidence-based targets; does not invent retention status or prices.
          </span>
        </div>
      </div>

      {/* 11B. AUCTION PRIORITY MATRIX (Scatter Plot) */}
      <div className="bg-[#111C2E] border border-[#233550] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#233550] pb-3 gap-2">
          <div>
            <span className="text-[10px] font-mono text-[#E23C45] font-bold uppercase tracking-wider">
              PORTFOLIO SELECTION QUADRANTS
            </span>
            <h3 className="text-lg font-heading font-bold text-white mt-0.5">
              Auction Priority Matrix: Reliability vs Evidence Strength
            </h3>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center text-[#E23C45]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E23C45] mr-1.5" /> Batters
            </span>
            <span className="flex items-center text-[#D6B46C]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D6B46C] mr-1.5" /> Bowlers
            </span>
            <span className="text-[#A7B1C2] text-[10px]">Bubble Size = Exposure</span>
          </div>
        </div>

        {/* Priority Scatter Matrix */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#233550" />
              <XAxis 
                type="number" 
                dataKey="reliability_score" 
                name="Reliability Score" 
                domain={[60, 95]} 
                stroke="#A7B1C2"
                fontSize={11}
                unit=" BRS"
              />
              <YAxis 
                type="number" 
                dataKey="evidence_score" 
                name="Evidence Strength" 
                domain={[45, 100]} 
                stroke="#A7B1C2"
                fontSize={11}
                unit="%"
              />
              <ZAxis type="number" dataKey="exposure_value" range={[100, 500]} name="Exposure" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#172438] border border-[#233550] p-3 rounded-xl shadow-2xl text-xs font-mono">
                        <div className="font-heading font-bold text-white text-sm mb-1">{d.name}</div>
                        <div className="text-[11px] text-[#A7B1C2]">{d.role} • {d.sub_role}</div>
                        <div className="mt-2 text-[#D6B46C] font-bold">Reliability: {d.reliability_score} / 100</div>
                        <div className="text-[#38B889]">Evidence Confidence: {d.confidence} ({d.evidence_score}%)</div>
                        <div className="text-[#E23C45] text-[10px] mt-1">{d.summary}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Players" data={priorityMatrix}>
                {priorityMatrix.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.role === 'Batter' ? '#E23C45' : '#D6B46C'} 
                    stroke="#F5F6F8"
                    strokeWidth={1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Matrix Quadrant Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-[#233550] pt-4 text-xs">
          <div className="bg-[#0B1220] p-3 rounded-xl border border-[#233550]">
            <div className="text-[#38B889] font-bold font-mono text-[11px] uppercase">Top-Right: Tier 1 Core Targets</div>
            <p className="text-[#A7B1C2] mt-1 text-[11px]">
              High Reliability (&gt; 80) + High Evidence (&gt; 80%). Players who combine elite performance with deep multi-season exposure (e.g. Rinku Singh, Tilak Varma, Jadeja, Nawaz).
            </p>
          </div>
          <div className="bg-[#0B1220] p-3 rounded-xl border border-[#233550]">
            <div className="text-[#E9AE55] font-bold font-mono text-[11px] uppercase">Top-Left: Proven Anchors</div>
            <p className="text-[#A7B1C2] mt-1 text-[11px]">
              High Evidence with Moderate Reliability. Consistent veterans who stabilize collapse scenarios (e.g. David Miller, Hardik Pandya, Sunil Narine).
            </p>
          </div>
          <div className="bg-[#0B1220] p-3 rounded-xl border border-[#233550]">
            <div className="text-[#E23C45] font-bold font-mono text-[11px] uppercase">Bottom-Right: High-Upside Gems</div>
            <p className="text-[#A7B1C2] mt-1 text-[11px]">
              High Reliability with Moderate Evidence. Explosive performers who offer high auction value if sample size holds (e.g. Tristan Stubbs, Ashutosh Sharma, Sufiyan Muqeem).
            </p>
          </div>
        </div>
      </div>

      {/* 11A & 11C. TARGET BOARD & RECOMMENDATION CARDS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#233550] pb-3 gap-3">
          <div>
            <span className="text-[10px] font-mono text-[#38B889] font-bold uppercase tracking-wider">
              TARGET BOARD
            </span>
            <h2 className="text-xl font-heading font-bold text-white mt-0.5">
              Categorized Scouting Shortlist
            </h2>
          </div>

          {/* Board Category Tabs */}
          <div className="flex items-center space-x-1 bg-[#111C2E] border border-[#233550] rounded-xl p-1 overflow-x-auto">
            {boardTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveBoardCategory(tab.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeBoardCategory === tab.id 
                    ? 'bg-[#E23C45] text-white font-bold' 
                    : 'text-[#A7B1C2] hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Shortlist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentCards.map((player: any) => (
            <div
              key={player.id}
              onClick={() => onSelectPlayer(player)}
              className="bg-[#111C2E] border border-[#233550] rounded-2xl p-5 hover:border-[#D6B46C]/60 transition-all cursor-pointer flex flex-col justify-between shadow-xl group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#D6B46C] uppercase bg-[#D6B46C]/10 px-2 py-0.5 rounded border border-[#D6B46C]/30">
                      {player.evaluation_priority}
                    </span>
                    <h4 className="text-lg font-heading font-bold text-white mt-2 group-hover:text-[#D6B46C] transition-colors">
                      {player.name}
                    </h4>
                    <p className="text-xs text-[#A7B1C2]">{player.role}</p>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-[10px] text-[#A7B1C2] uppercase">Score</div>
                    <div className="text-xl font-black text-[#D6B46C]">
                      {player.score}
                    </div>
                  </div>
                </div>

                <div className="my-3 py-2 border-y border-[#233550] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A7B1C2]">Exposure:</span>
                  <span className="text-white font-semibold">{player.exposure}</span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-[#F5F6F8] leading-relaxed">
                    <span className="text-[#38B889] font-semibold text-[11px] uppercase block font-mono">Tactical Value:</span>
                    {player.tactical_fit}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#233550] flex items-center justify-between text-xs text-[#E23C45] font-semibold">
                <span>Inspect Full Dossier</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 11D. SQUAD FIT & TACTICAL INTEGRATION */}
      <div className="bg-[#111C2E] border border-[#233550] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="border-b border-[#233550] pb-3">
          <span className="text-[10px] font-mono text-[#D6B46C] font-bold uppercase tracking-wider">
            TACTICAL ARCHITECTURE
          </span>
          <h3 className="text-lg font-heading font-bold text-white mt-0.5">
            Addressing Tactical Requirements for Rajasthan Royals
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#A7B1C2]">
          <div className="bg-[#0B1220] p-4 rounded-xl border border-[#233550] space-y-2">
            <h4 className="text-white font-heading font-bold text-sm">1. Lower-Order Chasing Composure</h4>
            <p className="leading-relaxed">
              When chasing 10+ RRR in the final 5 overs, RR needs batters who convert deliveries into boundaries without dot ball stalls. Candidates like Rinku Singh (193.5 SR) and Tilak Varma (184.1 SR) provide calibrated composure.
            </p>
          </div>
          <div className="bg-[#0B1220] p-4 rounded-xl border border-[#233550] space-y-2">
            <h4 className="text-white font-heading font-bold text-sm">2. Middle-Overs Spin Restriction</h4>
            <p className="leading-relaxed">
              At the Sawai Mansingh Stadium, spin choking through overs 7-15 is critical. Targets like Mohammad Nawaz (4.60 economy) and Abrar Ahmed (4.85 economy) starve opponents of boundary momentum.
            </p>
          </div>
          <div className="bg-[#0B1220] p-4 rounded-xl border border-[#233550] space-y-2">
            <h4 className="text-white font-heading font-bold text-sm">3. Death-Over Yorker Execution</h4>
            <p className="leading-relaxed">
              Defending targets under 45 off 24 balls demands bowler variation and dot ball frequency. Mustafizur Rahman (52.3 pressure overs, 26 wickets) and Jofra Archer (+2.02 economy suppression) provide proven defensive shields.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-[#6B7A92] border-t border-[#233550] pt-3 flex items-center space-x-2">
          <Info className="w-3.5 h-3.5 text-[#A7B1C2]" />
          <span>Note: Analysis strictly presents verified data-supported capabilities. No assumptions are made regarding player retention, auction purse, or base prices.</span>
        </div>
      </div>

    </div>
  );
};
