import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  BarChart2, 
  PieChart as PieIcon,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid, 
  Cell, 
  Legend 
} from 'recharts';

interface BattingLabViewProps {
  battersData: any;
  competitionFilter: string;
  onSelectPlayer: (player: any) => void;
}

export const BattingLabView: React.FC<BattingLabViewProps> = ({
  battersData,
  competitionFilter,
  onSelectPlayer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState('All');
  const [minBalls, setMinBalls] = useState(50);
  const [sortField, setSortField] = useState('reliability_score');
  const [sortAsc, setSortAsc] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'sr_vs_norm' | 'runs_balls' | 'reliability' | 'phase'>('sr_vs_norm');

  // Choose dataset based on competition filter
  const currentDataset = useMemo(() => {
    if (competitionFilter === 'IPL') {
      return (battersData.ipl_top_10 || []).map((b: any) => ({
        ...b,
        Rank: b.Rank,
        Player: b.striker_name,
        Player_ID: b.striker_id,
        Reliability_Score: b.reliability_score,
        Pressure_Runs: b.p_runs,
        Pressure_Balls: b.p_balls,
        Pressure_Strike_Rate: Math.round(b.p_sr * 10) / 10,
        Pressure_Average: Math.round(b.p_avg * 10) / 10,
        Pressure_Uplift: Math.round(b.p_uplift * 10) / 10,
        Match_Consistency: Math.round((b.match_consistency || 0.75) * 100),
        Pressure_Matches: b.p_matches,
        Confidence: b.confidence
      }));
    } else if (competitionFilter === 'T20I') {
      return (battersData.t20i_top_10 || []).map((b: any) => ({
        ...b,
        Rank: b.Rank,
        Player: b.striker_name,
        Player_ID: b.striker_id,
        Reliability_Score: b.reliability_score,
        Pressure_Runs: b.p_runs,
        Pressure_Balls: b.p_balls,
        Pressure_Strike_Rate: Math.round(b.p_sr * 10) / 10,
        Pressure_Average: Math.round(b.p_avg * 10) / 10,
        Pressure_Uplift: Math.round(b.p_uplift * 10) / 10,
        Match_Consistency: Math.round((b.match_consistency || 0.75) * 100),
        Pressure_Matches: b.p_matches,
        Confidence: b.confidence
      }));
    } else {
      return (battersData.top_10 || []).map((b: any) => ({
        ...b,
        Rank: b.rank,
        Player: b.name,
        Player_ID: b.id,
        Reliability_Score: b.reliability_score,
        Pressure_Runs: b.pressure_runs,
        Pressure_Balls: b.pressure_balls,
        Pressure_Strike_Rate: b.pressure_sr,
        Pressure_Average: b.pressure_avg,
        Pressure_Uplift: b.pressure_uplift,
        Match_Consistency: Math.round(b.match_consistency * 100),
        Pressure_Matches: b.pressure_matches,
        Confidence: b.confidence
      }));
    }
  }, [competitionFilter, battersData]);

  // Filtered and sorted table data
  const filteredBatters = useMemo(() => {
    return currentDataset
      .filter((b: any) => {
        const matchesName = b.Player.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesConf = confidenceFilter === 'All' || b.Confidence === confidenceFilter;
        const matchesBalls = (b.Pressure_Balls || 0) >= minBalls;
        return matchesName && matchesConf && matchesBalls;
      })
      .sort((a: any, b: any) => {
        let valA = a[sortField] || a.Reliability_Score;
        let valB = b[sortField] || b.Reliability_Score;
        if (sortAsc) return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
  }, [currentDataset, searchTerm, confidenceFilter, minBalls, sortField, sortAsc]);

  // Scatter plot data: Pressure SR vs Normal SR
  const scatterData = useMemo(() => {
    return currentDataset.map((b: any) => ({
      name: b.Player,
      normal_sr: Math.round((b.Pressure_Strike_Rate - b.Pressure_Uplift) * 10) / 10,
      pressure_sr: b.Pressure_Strike_Rate,
      balls: b.Pressure_Balls,
      score: b.Reliability_Score,
    }));
  }, [currentDataset]);

  // Phase comparison data
  const phaseChartData = [
    { phase: 'Powerplay (1-6)', par_sr: 124, top_avg_sr: 142 },
    { phase: 'Middle Overs (7-15)', par_sr: 131, top_avg_sr: 156 },
    { phase: 'Death Overs (16-20)', par_sr: 158, top_avg_sr: 194 },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#233550] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#E23C45]" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#E23C45] uppercase">
              BATTING INTELLIGENCE LAB
            </span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white mt-1">
            Top Batter Pressure Rankings
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-1">
            Evaluating scoring rate preservation, wicket cost, and positive impact under pressure (P &gt;= 55.0)
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3 text-xs font-mono">
          <span className="text-[#A7B1C2]">Cohort: {competitionFilter}</span>
          <span className="text-[#6B7A92]">|</span>
          <span className="text-[#D6B46C]">Min. Exposure: {minBalls} balls</span>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-[#111C2E] border border-[#233550] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex items-center bg-[#0B1220] border border-[#233550] rounded-lg px-3 py-1.5 focus-within:border-[#E23C45] transition-colors w-full sm:w-64">
          <Search className="w-4 h-4 text-[#A7B1C2] mr-2" />
          <input
            type="text"
            placeholder="Search batter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-[#6B7A92] focus:outline-none w-full"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Confidence Filter */}
          <div className="flex items-center space-x-1 bg-[#0B1220] border border-[#233550] rounded-lg p-1">
            <span className="text-[10px] font-mono text-[#A7B1C2] px-2">Confidence:</span>
            {['All', 'High', 'Moderate'].map((c) => (
              <button
                key={c}
                onClick={() => setConfidenceFilter(c)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  confidenceFilter === c ? 'bg-[#233550] text-[#D6B46C]' : 'text-[#A7B1C2] hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Min Exposure Slider */}
          <div className="flex items-center space-x-2 bg-[#0B1220] border border-[#233550] rounded-lg px-3 py-1.5">
            <span className="text-[10px] font-mono text-[#A7B1C2]">Min Balls:</span>
            <input
              type="range"
              min="30"
              max="150"
              step="10"
              value={minBalls}
              onChange={(e) => setMinBalls(Number(e.target.value))}
              className="w-20 accent-[#E23C45] cursor-pointer"
            />
            <span className="text-[11px] font-mono text-white font-bold w-6">{minBalls}</span>
          </div>
        </div>

      </div>

      {/* 7A. TOP 10 BATTER RANKINGS TABLE */}
      <div className="bg-[#111C2E] border border-[#233550] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#172438] text-[#A7B1C2] font-mono uppercase text-[10px] border-b border-[#233550] select-none">
              <tr>
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-4">Player</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                  onClick={() => {
                    setSortField('Reliability_Score');
                    setSortAsc(sortField === 'Reliability_Score' ? !sortAsc : false);
                  }}
                >
                  <span className="flex items-center justify-end">
                    Reliability Score <ArrowUpDown className="w-3 h-3 ml-1" />
                  </span>
                </th>
                <th className="py-3 px-3 text-right">Runs</th>
                <th className="py-3 px-3 text-right">Balls</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                  onClick={() => {
                    setSortField('Pressure_Strike_Rate');
                    setSortAsc(sortField === 'Pressure_Strike_Rate' ? !sortAsc : false);
                  }}
                >
                  <span className="flex items-center justify-end">
                    Pressure SR <ArrowUpDown className="w-3 h-3 ml-1" />
                  </span>
                </th>
                <th className="py-3 px-3 text-right">Pressure Avg</th>
                <th className="py-3 px-3 text-right">Uplift</th>
                <th className="py-3 px-3 text-right">Match Consistency</th>
                <th className="py-3 px-3 text-center">Matches</th>
                <th className="py-3 px-3 text-center">Confidence</th>
                <th className="py-3 px-3 text-center">Scouting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233550] bg-[#111C2E]">
              {filteredBatters.map((batter: any) => (
                <tr 
                  key={batter.Player_ID}
                  onClick={() => onSelectPlayer(batter)}
                  className="hover:bg-[#172438] cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-[#A7B1C2] group-hover:text-white">
                    #{batter.Rank}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-heading font-bold text-white text-sm group-hover:text-[#D6B46C] transition-colors">
                      {batter.Player}
                    </div>
                    <div className="text-[10px] text-[#A7B1C2] font-mono">
                      ID: {batter.Player_ID}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-black text-[#D6B46C] text-sm text-right">
                    {batter.Reliability_Score}
                  </td>
                  <td className="py-3 px-3 font-mono text-white text-right font-semibold">
                    {batter.Pressure_Runs}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#A7B1C2] text-right">
                    {batter.Pressure_Balls}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white text-right">
                    {batter.Pressure_Strike_Rate}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#A7B1C2] text-right">
                    {batter.Pressure_Average}
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-semibold text-[#38B889]">
                    +{batter.Pressure_Uplift}
                  </td>
                  <td className="py-3 px-3 font-mono text-right">
                    <span className="text-[#F5F6F8] font-bold">{batter.Match_Consistency}%</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[#A7B1C2] text-center">
                    {batter.Pressure_Matches}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                      batter.Confidence === 'High'
                        ? 'bg-[#38B889]/10 text-[#38B889] border-[#38B889]/30'
                        : 'bg-[#E9AE55]/10 text-[#E9AE55] border-[#E9AE55]/30'
                    }`}>
                      {batter.Confidence}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-xs text-[#E23C45] group-hover:translate-x-1 inline-flex items-center transition-transform">
                      View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7B. ANALYTICAL VISUALIZATIONS SECTION */}
      <div className="bg-[#111C2E] border border-[#233550] rounded-2xl p-6 shadow-xl space-y-6">
        
        {/* Visualizations Navigation Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#233550] pb-4 gap-4">
          <div>
            <span className="text-[10px] font-mono text-[#D6B46C] font-bold uppercase tracking-wider">
              DEEP ANALYTICAL CHARTS
            </span>
            <h3 className="text-lg font-heading font-bold text-white mt-0.5">
              Batting Performance Distribution & Phase Diagnostics
            </h3>
          </div>

          <div className="flex items-center bg-[#0B1220] border border-[#233550] rounded-lg p-1">
            {[
              { id: 'sr_vs_norm', label: 'Pressure SR vs Baseline' },
              { id: 'runs_balls', label: 'Runs vs Balls Faced' },
              { id: 'phase', label: 'Phase Performance' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveChartTab(tab.id as any)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeChartTab === tab.id ? 'bg-[#E23C45] text-white font-semibold' : 'text-[#A7B1C2] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart View Area */}
        <div className="h-80 w-full pt-4">
          {activeChartTab === 'sr_vs_norm' && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#233550" />
                <XAxis 
                  type="number" 
                  dataKey="normal_sr" 
                  name="Baseline SR" 
                  domain={[110, 180]} 
                  stroke="#A7B1C2"
                  fontSize={11}
                  unit=" SR"
                />
                <YAxis 
                  type="number" 
                  dataKey="pressure_sr" 
                  name="Pressure SR" 
                  domain={[130, 230]} 
                  stroke="#A7B1C2"
                  fontSize={11}
                  unit=" SR"
                />
                <ZAxis type="number" dataKey="balls" range={[80, 450]} name="Pressure Balls" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#172438] border border-[#233550] p-3 rounded-lg shadow-xl text-xs font-mono">
                          <div className="font-heading font-bold text-white text-sm mb-1">{data.name}</div>
                          <div className="text-[#D6B46C]">Pressure SR: {data.pressure_sr}</div>
                          <div className="text-[#A7B1C2]">Baseline SR: {data.normal_sr}</div>
                          <div className="text-[#38B889]">Delta Uplift: +{Math.round((data.pressure_sr - data.normal_sr)*10)/10}</div>
                          <div className="text-[#6B7A92] mt-1">{data.balls} balls faced</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Batters" data={scatterData} fill="#E23C45" stroke="#F04C55" strokeWidth={1} />
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'runs_balls' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentDataset} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#233550" />
                <XAxis dataKey="Player" stroke="#A7B1C2" fontSize={10} interval={0} angle={-25} textAnchor="end" />
                <YAxis stroke="#A7B1C2" fontSize={11} />
                <Tooltip 
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#172438] border border-[#233550] p-3 rounded-lg text-xs font-mono">
                          <div className="font-heading font-bold text-white">{d.Player}</div>
                          <div className="text-[#E23C45] mt-1">Pressure Runs: {d.Pressure_Runs}</div>
                          <div className="text-[#A7B1C2]">Pressure Balls: {d.Pressure_Balls}</div>
                          <div className="text-[#D6B46C]">Score: {d.Reliability_Score}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Pressure_Runs" fill="#E23C45" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pressure_Balls" fill="#233550" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'phase' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phaseChartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#233550" />
                <XAxis dataKey="phase" stroke="#A7B1C2" fontSize={11} />
                <YAxis stroke="#A7B1C2" fontSize={11} domain={[100, 220]} unit=" SR" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#172438', borderColor: '#233550', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="top_avg_sr" name="Top 10 Average SR" fill="#E23C45" radius={[4, 4, 0, 0]} />
                <Bar dataKey="par_sr" name="Tournament Par SR" fill="#233550" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="text-[11px] text-[#A7B1C2] border-t border-[#233550] pt-3 flex items-center justify-between">
          <span>*Calculated from ball-by-ball deliveries where Pressure Index P &gt;= 55.0</span>
          <span className="font-mono text-[#D6B46C]">Click any player row to inspect match-by-match logs</span>
        </div>

      </div>

    </div>
  );
};
