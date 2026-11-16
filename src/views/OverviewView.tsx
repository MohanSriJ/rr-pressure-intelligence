import React from 'react';
import { HeroVisual } from '../components/HeroVisual';
import { 
  Shield, 
  Activity, 
  Crosshair, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Database,
  Users,
  Flame,
  FileCheck
} from 'lucide-react';

interface OverviewViewProps {
  dashboardData: any;
  onNavigateTab: (tab: string) => void;
  onSelectPlayer: (player: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  dashboardData,
  onNavigateTab,
  onSelectPlayer,
}) => {
  const summary = dashboardData.summary || [];
  const leadBatter = dashboardData.lead_batter || {};
  const leadBowler = dashboardData.lead_bowler || {};
  const keyDiscoveries = dashboardData.key_discoveries || [];
  const topBatters = dashboardData.top_10_batters || [];
  const topBowlers = dashboardData.top_10_bowlers || [];

  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      
      {/* 4. HERO SECTION */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#172438] border border-[#233550]">
              <span className="w-2 h-2 rounded-full bg-[#E23C45]" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#D6B46C] uppercase">
                SUPERR SELECTOR SEASON 2 | IPL 2027
              </span>
              <span className="text-[#6B7A92]">|</span>
              <span className="text-[11px] font-mono text-[#A7B1C2]">
                IPL + T20I DATA | 2022–2026
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white leading-none">
              PRESSURE REVEALS<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E23C45] via-[#F04C55] to-[#D6B46C]">
                THE REAL PLAYERS.
              </span>
            </h1>

            <p className="text-lg font-medium text-[#D6B46C] italic font-heading">
              "Talent wins games. Reliability under pressure builds champions."
            </p>

            <p className="text-sm sm:text-base text-[#A7B1C2] max-w-xl leading-relaxed">
              An evidence-driven player intelligence platform designed to identify the batters and bowlers who consistently deliver when match situations become difficult.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigateTab('auction')}
                className="px-6 py-3.5 bg-gradient-to-r from-[#E23C45] to-[#B01E26] hover:from-[#F04C55] hover:to-[#C0262E] text-white rounded-xl font-heading font-bold text-sm tracking-wide shadow-xl shadow-[#E23C45]/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>ENTER THE WAR ROOM</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('methodology')}
                className="px-6 py-3.5 bg-[#172438] hover:bg-[#233550] border border-[#233550] text-[#F5F6F8] rounded-xl font-heading font-medium text-sm tracking-wide transition-all"
              >
                EXPLORE THE METHODOLOGY
              </button>
            </div>
          </div>

          {/* Right Column: Abstract Cricket Pitch Visual */}
          <div className="lg:col-span-5">
            <HeroVisual />
          </div>

        </div>
      </section>

      {/* EXECUTIVE INSIGHT STRIP - 4 Dynamically Calculated KPI Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Matches Analysed',
            value: '867',
            detail: '401 IPL + 466 T20Is',
            icon: Database,
            color: 'text-white'
          },
          {
            label: 'Unique Players Evaluated',
            value: '958',
            detail: '888 Batters, 647 Bowlers',
            icon: Users,
            color: 'text-[#D6B46C]'
          },
          {
            label: 'High-Pressure Deliveries',
            value: '29,090',
            detail: '14.5% of 200,999 total balls',
            icon: Flame,
            color: 'text-[#E23C45]'
          },
          {
            label: 'Eligible Shortlist',
            value: '148',
            detail: '80 Batters, 68 Bowlers verified',
            icon: FileCheck,
            color: 'text-[#38B889]'
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              className="bg-[#111C2E] border border-[#233550] rounded-xl p-5 hover:border-[#E23C45]/40 transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between text-[#A7B1C2] mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">{kpi.label}</span>
                <Icon className="w-4 h-4 text-[#A7B1C2]" />
              </div>
              <div className={`text-3xl font-mono font-black ${kpi.color}`}>
                {kpi.value}
              </div>
              <div className="text-[11px] text-[#A7B1C2] mt-1 font-sans">
                {kpi.detail}
              </div>
            </div>
          );
        })}
      </section>

      {/* 6. EXECUTIVE DASHBOARD: SECTION A - EXECUTIVE INTELLIGENCE */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#233550] pb-3">
          <div>
            <div className="text-[10px] font-mono text-[#E23C45] font-bold uppercase tracking-widest">
              COMMAND PERSPECTIVE
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mt-0.5">
              Executive Intelligence: Lead Target Benchmarks
            </h2>
          </div>
          <p className="text-xs text-[#A7B1C2] max-w-md mt-2 md:mt-0">
            Never treat the highest numerical score as automatically the safest recommendation. Sample size, uncertainty bounds, and tactical role stability must remain visible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Lead Batter Card */}
          <div className="bg-[#111C2E] border border-[#233550] rounded-2xl p-6 relative overflow-hidden group hover:border-[#E23C45]/50 transition-all shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E23C45]/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E23C45]/15 text-[#E23C45] font-bold uppercase border border-[#E23C45]/30">
                  Lead Batting Candidate • Rank #1
                </span>
                <h3 className="text-2xl font-heading font-bold text-white mt-2 group-hover:text-[#D6B46C] transition-colors">
                  {leadBatter.name}
                </h3>
                <p className="text-xs text-[#A7B1C2]">{leadBatter.role} • {leadBatter.teams}</p>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono text-[#A7B1C2] uppercase">Reliability Score</div>
                <div className="text-3xl font-mono font-black text-[#D6B46C]">
                  {leadBatter.reliability_score}
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 my-5 py-3 border-y border-[#233550] text-center font-mono">
              <div>
                <div className="text-[10px] text-[#A7B1C2] uppercase">Pressure SR</div>
                <div className="text-lg font-bold text-white mt-0.5">{leadBatter.pressure_sr}</div>
                <div className="text-[10px] text-[#38B889]">+{leadBatter.pressure_uplift} uplift</div>
              </div>
              <div>
                <div className="text-[10px] text-[#A7B1C2] uppercase">Pressure Runs</div>
                <div className="text-lg font-bold text-white mt-0.5">{leadBatter.pressure_runs}</div>
                <div className="text-[10px] text-[#A7B1C2]">{leadBatter.pressure_balls} balls</div>
              </div>
              <div>
                <div className="text-[10px] text-[#A7B1C2] uppercase">Consistency</div>
                <div className="text-lg font-bold text-[#D6B46C] mt-0.5">{Math.round(leadBatter.match_consistency * 100)}%</div>
                <div className="text-[10px] text-[#38B889]">{leadBatter.confidence} Conf.</div>
              </div>
            </div>

            {/* Evidence Explanation */}
            <p className="text-xs text-[#A7B1C2] leading-relaxed line-clamp-3">
              {leadBatter.verdict?.why_matters}
            </p>

            <div className="mt-5 pt-3 flex items-center justify-between border-t border-[#233550]/60">
              <span className="text-[11px] font-mono text-[#6B7A92]">Exposure: 24 pressure matches</span>
              <button
                onClick={() => onSelectPlayer(leadBatter)}
                className="text-xs text-[#E23C45] hover:text-[#F04C55] font-semibold flex items-center space-x-1"
              >
                <span>View Full Scouting Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Lead Bowler Card */}
          <div className="bg-[#111C2E] border border-[#233550] rounded-2xl p-6 relative overflow-hidden group hover:border-[#D6B46C]/50 transition-all shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D6B46C]/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D6B46C]/15 text-[#D6B46C] font-bold uppercase border border-[#D6B46C]/30">
                  Lead Bowling Candidate • Rank #1
                </span>
                <h3 className="text-2xl font-heading font-bold text-white mt-2 group-hover:text-[#D6B46C] transition-colors">
                  {leadBowler.name}
                </h3>
                <p className="text-xs text-[#A7B1C2]">{leadBowler.role} • {leadBowler.bowling_type}</p>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono text-[#A7B1C2] uppercase">Reliability Score</div>
                <div className="text-3xl font-mono font-black text-[#D6B46C]">
                  {leadBowler.reliability_score}
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 my-5 py-3 border-y border-[#233550] text-center font-mono">
              <div>
                <div className="text-[10px] text-[#A7B1C2] uppercase">Pressure Economy</div>
                <div className="text-lg font-bold text-white mt-0.5">{leadBowler.pressure_econ}</div>
                <div className="text-[10px] text-[#38B889]">+{leadBowler.pressure_uplift} tighter</div>
              </div>
              <div>
                <div className="text-[10px] text-[#A7B1C2] uppercase">Overs / Wkts</div>
                <div className="text-lg font-bold text-white mt-0.5">{leadBowler.pressure_overs}ov</div>
                <div className="text-[10px] text-[#E23C45]">{leadBowler.pressure_wickets} wickets</div>
              </div>
              <div>
                <div className="text-[10px] text-[#A7B1C2] uppercase">Dot Ball %</div>
                <div className="text-lg font-bold text-[#D6B46C] mt-0.5">{leadBowler.pressure_dot_pct}%</div>
                <div className="text-[10px] text-[#38B889]">{leadBowler.confidence} Conf.</div>
              </div>
            </div>

            {/* Evidence Explanation */}
            <p className="text-xs text-[#A7B1C2] leading-relaxed line-clamp-3">
              {leadBowler.verdict?.why_matters}
            </p>

            <div className="mt-5 pt-3 flex items-center justify-between border-t border-[#233550]/60">
              <span className="text-[11px] font-mono text-[#6B7A92]">Exposure: 14 pressure matches</span>
              <button
                onClick={() => onSelectPlayer(leadBowler)}
                className="text-xs text-[#E23C45] hover:text-[#F04C55] font-semibold flex items-center space-x-1"
              >
                <span>View Full Scouting Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION B: KEY DISCOVERIES */}
      <section className="space-y-4">
        <div className="border-b border-[#233550] pb-3">
          <div className="text-[10px] font-mono text-[#D6B46C] font-bold uppercase tracking-widest">
            EMPIRICAL SIGNALS
          </div>
          <h2 className="text-2xl font-heading font-bold text-white mt-0.5">
            Key Analytical Discoveries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyDiscoveries.map((disc: any, i: number) => (
            <div key={i} className="bg-[#111C2E] border border-[#233550] rounded-xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#233550] flex items-center justify-center font-mono font-bold text-xs text-[#D6B46C]">
                0{i + 1}
              </div>
              <h4 className="text-sm font-heading font-bold text-white">{disc.title}</h4>
              <p className="text-xs text-[#A7B1C2] leading-relaxed">{disc.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION C: FEATURED PLAYERS - SHORTLIST PREVIEW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#233550] pb-3">
          <div>
            <div className="text-[10px] font-mono text-[#38B889] font-bold uppercase tracking-widest">
              FRANCHISE TARGETS
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mt-0.5">
              Featured Pressure Candidates
            </h2>
          </div>
          <button 
            onClick={() => onNavigateTab('batting')}
            className="text-xs text-[#D6B46C] hover:text-[#E8CA8A] font-semibold flex items-center space-x-1"
          >
            <span>Explore All 10 Candidates</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Horizontal Grid of Scouting Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topBatters.slice(0, 4).map((player: any) => (
            <div
              key={player.Player_ID || player.id}
              onClick={() => onSelectPlayer(player)}
              className="bg-[#111C2E] border border-[#233550] rounded-xl p-4 hover:border-[#E23C45]/60 hover:bg-[#172438] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#A7B1C2]">
                    #{player.Rank} BATTER
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    player.Confidence === 'High' ? 'bg-[#38B889]/15 text-[#38B889]' : 'bg-[#E9AE55]/15 text-[#E9AE55]'
                  }`}>
                    {player.Confidence}
                  </span>
                </div>
                <h4 className="text-base font-heading font-bold text-white mt-2">
                  {player.Player}
                </h4>
                <div className="text-xs text-[#A7B1C2] font-mono mt-1">
                  SR: <span className="text-white font-bold">{player.Pressure_Strike_Rate}</span> (+{player.Pressure_Uplift})
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#233550] flex items-center justify-between text-xs font-mono">
                <span className="text-[#D6B46C] font-bold">{player.Reliability_Score} BRS</span>
                <span className="text-[#A7B1C2] hover:text-white flex items-center">
                  Profile <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
