import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Menu, 
  X, 
  BarChart3, 
  Activity, 
  Crosshair, 
  GitCompare, 
  Gavel, 
  FileText,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  competitionFilter: string;
  setCompetitionFilter: (comp: string) => void;
  onSelectPlayer: (player: any) => void;
  allBatters: any[];
  allBowlers: any[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  competitionFilter,
  setCompetitionFilter,
  onSelectPlayer,
  allBatters,
  allBowlers,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'batting', label: 'Batting Lab', icon: Activity },
    { id: 'bowling', label: 'Bowling Lab', icon: Crosshair },
    { id: 'explorer', label: 'Pressure Explorer', icon: BarChart3 },
    { id: 'compare', label: 'Comparison Studio', icon: GitCompare },
    { id: 'auction', label: 'Auction War Room', icon: Gavel },
    { id: 'methodology', label: 'Methodology', icon: FileText },
  ];

  // Combined search list
  const filteredPlayers = searchQuery.trim().length > 1 ? [
    ...allBatters
      .filter(b => b.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5)
      .map(b => ({ ...b, searchType: 'Batter' })),
    ...allBowlers
      .filter(bw => bw.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5)
      .map(bw => ({ ...bw, searchType: 'Bowler' }))
  ] : [];

  return (
    <header className="sticky top-0 z-50 bg-[#0B1220]/95 backdrop-blur-md border-b border-[#233550]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Wordmark */}
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E23C45] to-[#B01E26] p-0.5 flex items-center justify-center shadow-lg shadow-[#E23C45]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#111C2E] rounded-[7px] flex items-center justify-center">
                <span className="font-heading font-black text-[#D6B46C] text-lg tracking-tighter">RR</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-bold text-base tracking-wider text-white">
                  PRESSURE<span className="text-[#E23C45]">.</span>INTELLIGENCE
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#D6B46C]/10 text-[#D6B46C] border border-[#D6B46C]/30 uppercase">
                  S2
                </span>
              </div>
              <p className="text-[10px] text-[#A7B1C2] tracking-wide font-medium">
                RAJASTHAN ROYALS AUCTION COMMAND CENTRE
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-[#E23C45] text-white shadow-sm shadow-[#E23C45]/30' 
                      : 'text-[#A7B1C2] hover:text-white hover:bg-[#172438]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#A7B1C2]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Search & Competition Selector */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Player Search */}
            <div className="relative">
              <div className="flex items-center bg-[#111C2E] border border-[#233550] rounded-lg px-2.5 py-1.5 focus-within:border-[#E23C45] transition-colors">
                <Search className="w-3.5 h-3.5 text-[#A7B1C2] mr-2" />
                <input
                  type="text"
                  placeholder="Search player..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="bg-transparent text-xs text-white placeholder-[#6B7A92] focus:outline-none w-32 focus:w-44 transition-all"
                />
              </div>

              {/* Search Autocomplete Dropdown */}
              {searchFocused && filteredPlayers.length > 0 && (
                <div className="absolute right-0 mt-1 w-64 bg-[#172438] border border-[#233550] rounded-lg shadow-2xl py-1 z-50 overflow-hidden">
                  <div className="px-3 py-1 text-[10px] uppercase font-mono font-bold text-[#A7B1C2] border-b border-[#233550]">
                    Players Matching "{searchQuery}"
                  </div>
                  {filteredPlayers.map((player) => (
                    <div
                      key={`${player.id}-${player.searchType}`}
                      onMouseDown={() => {
                        onSelectPlayer(player);
                        setSearchQuery('');
                      }}
                      className="px-3 py-2 hover:bg-[#233550] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-xs font-medium text-white">{player.name}</div>
                        <div className="text-[10px] text-[#A7B1C2]">{player.role || player.searchType}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E23C45]/15 text-[#E23C45] font-bold">
                          {player.reliability_score || player.Reliability_Score} BRS
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Competition Filter */}
            <div className="flex items-center bg-[#111C2E] border border-[#233550] rounded-lg p-0.5">
              {[
                { id: 'All', label: 'All (IPL+T20I)' },
                { id: 'IPL', label: 'IPL Only' },
                { id: 'T20I', label: 'T20I Only' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCompetitionFilter(c.id)}
                  className={`text-[11px] font-medium px-2 py-1 rounded transition-colors ${
                    competitionFilter === c.id
                      ? 'bg-[#233550] text-[#D6B46C] font-semibold'
                      : 'text-[#A7B1C2] hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#A7B1C2] hover:text-white hover:bg-[#172438]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#111C2E] border-b border-[#233550] px-4 pt-2 pb-4 space-y-1">
          <div className="mb-3 pt-2">
            <div className="flex bg-[#0B1220] border border-[#233550] rounded-md px-3 py-2">
              <Search className="w-4 h-4 text-[#A7B1C2] mr-2" />
              <input
                type="text"
                placeholder="Search player..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-[#6B7A92] focus:outline-none w-full"
              />
            </div>
            {filteredPlayers.length > 0 && (
              <div className="mt-1 bg-[#172438] rounded border border-[#233550]">
                {filteredPlayers.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectPlayer(p);
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 text-xs text-white border-b border-[#233550]/40 flex justify-between"
                  >
                    <span>{p.name} ({p.searchType})</span>
                    <span className="text-[#E23C45] font-mono">{p.reliability_score || p.Reliability_Score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-[#E23C45] text-white' : 'text-[#A7B1C2] hover:bg-[#172438]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#233550] mt-2 flex justify-around">
            {['All', 'IPL', 'T20I'].map(c => (
              <button
                key={c}
                onClick={() => setCompetitionFilter(c)}
                className={`text-xs px-3 py-1 rounded ${
                  competitionFilter === c ? 'bg-[#233550] text-[#D6B46C]' : 'text-[#A7B1C2]'
                }`}
              >
                {c === 'All' ? 'All (IPL+T20I)' : c}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
