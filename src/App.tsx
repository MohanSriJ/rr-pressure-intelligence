import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PlayerModal } from './components/PlayerModal';
import { OverviewView } from './views/OverviewView';
import { BattingLabView } from './views/BattingLabView';
import { BowlingLabView } from './views/BowlingLabView';
import { PressureExplorerView } from './views/PressureExplorerView';
import { PlayerComparisonView } from './views/PlayerComparisonView';
import { AuctionWarRoomView } from './views/AuctionWarRoomView';
import { MethodologyView } from './views/MethodologyView';

// Pre-aggregated grounded analytical datasets
import dashboardData from './data/dashboard_data.json';
import battersData from './data/batters_data.json';
import bowlersData from './data/bowlers_data.json';
import pressureExplorerData from './data/pressure_explorer.json';
import playerComparisonData from './data/player_comparison.json';
import auctionWarRoomData from './data/auction_war_room.json';
import methodologyData from './data/methodology_evidence.json';

export function App() {
  const getInitialTab = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['overview', 'batting', 'bowling', 'explorer', 'compare', 'auction', 'methodology'].includes(hash)) {
        return hash;
      }
    }
    return 'overview';
  };

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [competitionFilter, setCompetitionFilter] = useState<string>('All');
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['overview', 'batting', 'bowling', 'explorer', 'compare', 'auction', 'methodology'].includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Quick player lookup helper
  const handleSelectPlayer = (player: any) => {
    // If player is a simple summary row, check if we have a full rich profile in batters or bowlers
    const pid = player.id || player.Player_ID || player.striker_id || player.bowler_id;
    const fullBatter = (battersData.top_10 || []).find((b: any) => b.id === pid);
    const fullBowler = (bowlersData.top_10 || []).find((bw: any) => bw.id === pid);
    setSelectedPlayer(fullBatter || fullBowler || player);
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F5F6F8] tactical-grid flex flex-col selection:bg-[#E23C45] selection:text-white">
      
      {/* Sticky Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        competitionFilter={competitionFilter}
        setCompetitionFilter={setCompetitionFilter}
        onSelectPlayer={handleSelectPlayer}
        allBatters={battersData.top_10 || []}
        allBowlers={bowlersData.top_10 || []}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && (
          <OverviewView
            dashboardData={dashboardData}
            onNavigateTab={setActiveTab}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {activeTab === 'batting' && (
          <BattingLabView
            battersData={battersData}
            competitionFilter={competitionFilter}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {activeTab === 'bowling' && (
          <BowlingLabView
            bowlersData={bowlersData}
            competitionFilter={competitionFilter}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {activeTab === 'explorer' && (
          <PressureExplorerView
            explorerData={pressureExplorerData}
          />
        )}

        {activeTab === 'compare' && (
          <PlayerComparisonView
            comparisonData={playerComparisonData}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {activeTab === 'auction' && (
          <AuctionWarRoomView
            warRoomData={auctionWarRoomData}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {activeTab === 'methodology' && (
          <MethodologyView
            methodologyData={methodologyData}
          />
        )}
      </main>

      {/* Persistent Franchise Footer */}
      <footer className="border-t border-[#233550] bg-[#0B1220] py-8 text-xs text-[#A7B1C2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-heading font-black text-[#D6B46C] text-lg">RR</span>
            <div>
              <div className="font-heading font-bold text-white tracking-wider">
                RR PRESSURE INTELLIGENCE
              </div>
              <div className="text-[10px] text-[#6B7A92]">
                SupeRR Selector Season 2 • Rajasthan Royals IPL 2027 Auction Analytics Command Centre
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-[11px] font-mono">
            <span>200,999 Deliveries Evaluated</span>
            <span>•</span>
            <span>Pre-Delivery CPI Model</span>
            <span>•</span>
            <span className="text-[#38B889]">Zero Outcome Leakage</span>
          </div>
        </div>
      </footer>

      {/* Global Interactive Player Dossier Modal */}
      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

    </div>
  );
}

export default App;
