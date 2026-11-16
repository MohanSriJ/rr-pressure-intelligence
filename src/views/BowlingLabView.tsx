import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  TrendingUp, 
  Crosshair, 
  ShieldCheck, 
  ChevronRight,
  Shield
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
  Legend 
} from 'recharts';

interface BowlingLabViewProps {
  bowlersData: any;
  competitionFilter: string;
  onSelectPlayer: (player: any) => void;
}

export const BowlingLabView: React.FC<BowlingLabViewProps> = ({
  bowlersData,
  competitionFilter,
  onSelectPlayer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState('All');
  const [minOvers, setMinOvers] = useState(12);
  const [sortField, setSortField] = useState('Reliability_Score');
  const [sortAsc, setSortAsc] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'econ_vs_norm' | 'wkts_overs' | 'dots'>('econ_vs_norm');

  // Choose dataset based on competition filter
  const currentDataset = useMemo(() => {
    if (competitionFilter === 'IPL') {
      return (bowlersData.ipl_top_10 || []).map((bw: any) => ({
        ...bw,
        Rank: bw.Rank,
        Player: bw.bowler_name,
        Player_ID: bw.bowler_id,
        Reliability_Score: bw.reliability_score,
        Pressure_Overs: bw.p_overs,
        Pressure_Wickets: bw.p_wickets,
        Pressure_Economy: Math.round(bw.p_econ * 10) / 10,
        Pressure_Dot_Percentage: Math.round(bw.p_dot_pct * 10) / 10,
        Pressure_Uplift: Math.round((bw.p_uplift || 0) * 10) / 10,
        Consistency_Score: Math.round((bw.consistency_score || 0.8) * 100),
        Pressure_Matches: bw.p_matches,
        Confidence: bw.confidence
      }));
    } else if (competitionFilter === 'T20I') {
      return (bowlersData.t20i_top_10 || []).map((bw: any) => ({
        ...bw,
        Rank: bw.Rank,
        Player: bw.bowler_name,
        Player_ID: bw.bowler_id,
        Reliability_Score: bw.reliability_score,
        Pressure_Overs: bw.p_overs,
        Pressure_Wickets: bw.p_wickets,
        Pressure_Economy: Math.round(bw.p_econ * 10) / 10,
        Pressure_Dot_Percentage: Math.round(bw.p_dot_pct * 10) / 10,
        Pressure_Uplift: Math.round((bw.p_uplift || 0) * 10) / 10,
        Consistency_Score: Math.round((bw.consistency_score || 0.8) * 100),
        Pressure_Matches: bw.p_matches,
        Confidence: bw.confidence
      }));
    } else {
      return (bowlersData.top_10 || []).map((bw: any) => ({
        ...bw,
        Rank: bw.rank,
        Player: bw.name,
        Player_ID: bw.id,
        Reliability_Score: bw.reliability_score,
        Pressure_Overs: bw.pressure_overs,
        Pressure_Wickets: bw.pressure_wickets,
        Pressure_Economy: bw.pressure_econ,
        Pressure_Dot_Percentage: bw.pressure_dot_pct,
        Pressure_Uplift: bw.pressure_uplift,
        Consistency_Score: Math.round(bw.consistency_score * 100),
        Pressure_Matches: bw.pressure_matches,
        Confidence: bw.confidence
      }));
    }
  }, [competitionFilter, bowlersData]);

  // Filtered and sorted table data
  const filteredBowlers = useMemo(() => {
    return currentDataset
      .filter((bw: any) => {
        const matchesName = bw.Player.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesConf = confidenceFilter === 'All' || bw.Confidence === confidenceFilter;
        const matchesOvers = (bw.Pressure_Overs || 0) >= minOvers;
        return matchesName && matchesConf && matchesOvers;
      })
      .sort((a: any, b: any) => {
        let valA = a[sortField] || a.Reliability_Score;
        let valB = b[sortField] || b.Reliability_Score;
        if (sortAsc) return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
  }, [currentDataset, searchTerm, confidenceFilter, minOvers, sortField, sortAsc]);

  // Scatter plot data: Pressure Economy vs Normal Economy
  const scatterData = useMemo(() => {
    return currentDataset.map((bw: any) => ({
      name: bw.Player,
      normal_econ: Math.round((bw.Pressure_Economy + bw.Pressure_Uplift) * 10) / 10,
      pressure_econ: bw.Pressure_Economy,
      overs: bw.Pressure_Overs,
      score: bw.Reliability_Score,
    }));
  }, [currentDataset]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#233550] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#D6B46C]" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#D6B46C] uppercase">
              BOWLING INTELLIGENCE LAB
            </span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white mt-1">
            Top Bowler Pressure Rankings
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-1">
            Evaluating run suppression, dot-ball choke frequency, and breakthrough wickets under high pressure (P &gt;= 55.0)
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3 text-xs font-mono">
          <span className="text-[#A7B1C2]">Cohort: {competitionFilter}</span>
          <span className="text-[#6B7A92]">|</span>
          <span className="text-[#D6B46C]">Min. Exposure: {minOvers} overs</span>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-[#111C2E] border border-[#233550] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex items-center bg-[#0B1220] border border-[#233550] rounded-lg px-3 py-1.5 focus-within:border-[#E23C45] transition-colors w-full sm:w-64">
          <Search className="w-4 h-4 text-[#A7B1C2] mr-2" />
          <input
            type="text"
            placeholder="Search bowler..."
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

          {/* Min Overs Slider */}
          <div className="flex items-center space-x-2 bg-[#0B1220] border border-[#233550] rounded-lg px-3 py-1.5">
            <span className="text-[10px] font-mono text-[#A7B1C2]">Min Overs:</span>
            <input
              type="range"
              min="8"
              max="30"
              step="2"
              value={minOvers}
              onChange={(e) => setMinOvers(Number(e.target.value))}
              className="w-20 accent-[#E23C45] cursor-pointer"
            />
            <span className="text-[11px] font-mono text-white font-bold w-6">{minOvers}ov</span>
          </div>
        </div>

      </div>

      {/* 8A. TOP 10 BOWLER RANKINGS TABLE */}
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
                <th className="py-3 px-3 text-right">Overs</th>
                <th className="py-3 px-3 text-right">Wickets</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                  onClick={() => {
                    setSortField('Pressure_Economy');
                    setSortAsc(sortField === 'Pressure_Economy' ? !sortAsc : true); // Lower is better
                  }}
                >
                  <span className="flex items-center justify-end">
                    Pressure Econ <ArrowUpDown className="w-3 h-3 ml-1" />
                  </span>
                </th>
                <th className="py-3 px-3 text-right">Dot Ball %</th>
                <th className="py-3 px-3 text-right">Uplift</th>
                <th className="py-3 px-3 text-right">Consistency</th>
                <th className="py-3 px-3 text-center">Matches</th>
                <th className="py-3 px-3 text-center">Confidence</th>
                <th className="py-3 px-3 text-center">Scouting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233550] bg-[#111C2E]">
              {filteredBowlers.map((bowler: any) => (
                <tr 
                  key={bowler.Player_ID}
                  onClick={() => onSelectPlayer(bowler)}
                  className="hover:bg-[#172438] cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-[#A7B1C2] group-hover:text-white">
                    #{bowler.Rank}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-heading font-bold text-white text-sm group-hover:text-[#D6B46C] transition-colors">
                      {bowler.Player}
                    </div>
                    <div className="text-[10px] text-[#A7B1C2] font-mono">
                      ID: {bowler.Player_ID}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-black text-[#D6B46C] text-sm text-right">
                    {bowler.Reliability_Score}
                  </td>
                  <td className="py-3 px-3 font-mono text-white text-right font-semibold">
                    {bowler.Pressure_Overs}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#E23C45] text-right font-bold">
                    {bowler.Pressure_Wickets}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white text-right">
                    {bowler.Pressure_Economy}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#38B889] text-right font-semibold">
                    {bowler.Pressure_Dot_Percentage}%
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-semibold text-[#38B889]">
                    +{bowler.Pressure_Uplift}
                  </td>
                  <td className="py-3 px-3 font-mono text-right">
                    <span className="text-[#F5F6F8] font-bold">{bowler.Consistency_Score}%</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[#A7B1C2] text-center">
                    {bowler.Pressure_Matches}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                      bowler.Confidence === 'High'
                        ? 'bg-[#38B889]/10 text-[#38B889] border-[#38B889]/30'
                        : 'bg-[#E9AE55]/10 text-[#E9AE55] border-[#E9AE55]/30'
                    }`}>
                      {bowler.Confidence}
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

      {/* 8B. BOWLING VISUALIZATIONS */}
      <div className="bg-[#111C2E] border border-[#233550] rounded-2xl p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#233550] pb-4 gap-4">
          <div>
            <span className="text-[10px] font-mono text-[#D6B46C] font-bold uppercase tracking-wider">
              DEEP BOWLING ANALYTICS
            </span>
            <h3 className="text-lg font-heading font-bold text-white mt-0.5">
              Economy Choke Distribution & Wicket Accumulation
            </h3>
          </div>

          <div className="flex items-center bg-[#0B1220] border border-[#233550] rounded-lg p-1">
            {[
              { id: 'econ_vs_norm', label: 'Economy vs Baseline' },
              { id: 'wkts_overs', label: 'Wickets vs Overs' },
              { id: 'dots', label: 'Dot Ball Frequency' },
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
          {activeChartTab === 'econ_vs_norm' && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#233550" />
                <XAxis 
                  type="number" 
                  dataKey="normal_econ" 
                  name="Baseline Economy" 
                  domain={[5.0, 11.0]} 
                  stroke="#A7B1C2"
                  fontSize={11}
                  unit=" RPO"
                />
                <YAxis 
                  type="number" 
                  dataKey="pressure_econ" 
                  name="Pressure Economy" 
                  domain={[4.0, 9.5]} 
                  stroke="#A7B1C2"
                  fontSize={11}
                  unit=" RPO"
                />
                <ZAxis type="number" dataKey="overs" range={[80, 450]} name="Pressure Overs" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#172438] border border-[#233550] p-3 rounded-lg shadow-xl text-xs font-mono">
                          <div className="font-heading font-bold text-white text-sm mb-1">{data.name}</div>
                          <div className="text-[#38B889]">Pressure Economy: {data.pressure_econ}</div>
                          <div className="text-[#A7B1C2]">Baseline Economy: {data.normal_econ}</div>
                          <div className="text-[#D6B46C]">Uplift: +{Math.round((data.normal_econ - data.pressure_econ)*10)/10} tighter</div>
                          <div className="text-[#6B7A92] mt-1">{data.overs} overs bowled</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Bowlers" data={scatterData} fill="#D6B46C" stroke="#E8CA8A" strokeWidth={1} />
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'wkts_overs' && (
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
                          <div className="text-[#E23C45] mt-1">Pressure Wickets: {d.Pressure_Wickets}</div>
                          <div className="text-[#A7B1C2]">Pressure Overs: {d.Pressure_Overs}</div>
                          <div className="text-[#D6B46C]">Economy: {d.Pressure_Economy}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Pressure_Wickets" fill="#E23C45" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pressure_Overs" fill="#233550" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'dots' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentDataset} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#233550" />
                <XAxis dataKey="Player" stroke="#A7B1C2" fontSize={10} interval={0} angle={-25} textAnchor="end" />
                <YAxis stroke="#A7B1C2" fontSize={11} domain={[30, 60]} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#172438', borderColor: '#233550', fontSize: '12px' }}
                />
                <Bar dataKey="Pressure_Dot_Percentage" name="Dot Ball %" fill="#38B889" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="text-[11px] text-[#A7B1C2] border-t border-[#233550] pt-3 flex items-center justify-between">
          <span>*Calculated from ball-by-ball deliveries where Pressure Index P &gt;= 55.0</span>
          <span className="font-mono text-[#D6B46C]">Click any bowler row to inspect match-by-match logs</span>
        </div>

      </div>

    </div>
  );
};
