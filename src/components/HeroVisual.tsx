import React from 'react';

export const HeroVisual: React.FC = () => {
  return (
    <div className="relative w-full h-[360px] md:h-[420px] flex items-center justify-center overflow-hidden rounded-2xl bg-[#0e1626]/80 border border-[#233550]/80 shadow-2xl">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,60,69,0.08)_0%,rgba(214,180,108,0.04)_40%,transparent_75%)]" />

      {/* SVG Pitch & Field Geometry */}
      <svg className="w-full h-full max-w-[640px] max-h-[420px] select-none" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#233550" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#172438" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="pressureLine" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#38B889" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#D6B46C" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E23C45" stopOpacity="1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Boundary Ellipse */}
        <ellipse cx="300" cy="200" rx="270" ry="170" stroke="#233550" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />

        {/* 30-Yard Circle */}
        <ellipse cx="300" cy="200" rx="190" ry="120" stroke="#D6B46C" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
        <text x="300" y="86" textAnchor="middle" fill="#D6B46C" opacity="0.5" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="2">
          30-YARD FIELD RESTRICTION
        </text>

        {/* Central 22-Yard Pitch */}
        <g transform="translate(265, 140)">
          <rect x="0" y="0" width="70" height="120" rx="4" fill="url(#pitchGrad)" stroke="#384C6B" strokeWidth="1" />
          {/* Popping Creases */}
          <line x1="8" y1="20" x2="62" y2="20" stroke="#F5F6F8" strokeWidth="1.2" opacity="0.7" />
          <line x1="8" y1="100" x2="62" y2="100" stroke="#F5F6F8" strokeWidth="1.2" opacity="0.7" />
          {/* Stumps */}
          <circle cx="35" cy="15" r="2.5" fill="#E23C45" />
          <circle cx="35" cy="105" r="2.5" fill="#D6B46C" />
          {/* Return Creases */}
          <line x1="8" y1="10" x2="8" y2="30" stroke="#F5F6F8" strokeWidth="0.8" opacity="0.5" />
          <line x1="62" y1="10" x2="62" y2="30" stroke="#F5F6F8" strokeWidth="0.8" opacity="0.5" />
          <line x1="8" y1="90" x2="8" y2="110" stroke="#F5F6F8" strokeWidth="0.8" opacity="0.5" />
          <line x1="62" y1="90" x2="62" y2="110" stroke="#F5F6F8" strokeWidth="0.8" opacity="0.5" />
        </g>

        {/* Field Positions Nodes */}
        {[
          { x: 300, y: 35, label: 'Long-off' },
          { x: 480, y: 150, label: 'Deep Cover' },
          { x: 460, y: 280, label: 'Deep Mid-Wicket' },
          { x: 130, y: 140, label: 'Third Man' },
          { x: 120, y: 270, label: 'Fine Leg' },
          { x: 300, y: 365, label: 'Long-on' },
        ].map((pos, i) => (
          <g key={i}>
            <circle cx={pos.x} cy={pos.y} r="3" fill="#A7B1C2" opacity="0.6" />
            <text x={pos.x} y={pos.y + 12} textAnchor="middle" fill="#A7B1C2" fontSize="7" fontFamily="Inter" opacity="0.5">
              {pos.label}
            </text>
          </g>
        ))}

        {/* Pressure Progression Arc */}
        <path
          d="M 110,200 A 190,120 0 0,1 490,200"
          stroke="url(#pressureLine)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Dynamic Delivery Vectors */}
        <path
          d="M 300,245 Q 380,210 440,160"
          stroke="#E23C45"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
        >
          <animate attributeName="stroke-dashoffset" from="32" to="0" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="440" cy="160" r="4.5" fill="#E23C45" filter="url(#glow)" />
        
        {/* Pressure Index Indicators */}
        <g transform="translate(390, 70)">
          <rect x="0" y="0" width="160" height="42" rx="6" fill="#111C2E" stroke="#E23C45" strokeWidth="1" opacity="0.9" />
          <text x="12" y="16" fill="#A7B1C2" fontSize="8" fontFamily="Inter" fontWeight="600" letterSpacing="1">
            LEVERAGE THRESHOLD
          </text>
          <text x="12" y="32" fill="#E23C45" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
            P &gt;= 55.0 <tspan fill="#D6B46C" fontSize="9">HIGH STAKES</tspan>
          </text>
        </g>

        <g transform="translate(50, 70)">
          <rect x="0" y="0" width="145" height="42" rx="6" fill="#111C2E" stroke="#233550" strokeWidth="1" opacity="0.9" />
          <text x="12" y="16" fill="#A7B1C2" fontSize="8" fontFamily="Inter" fontWeight="600" letterSpacing="1">
            PRE-BALL SITUATION
          </text>
          <text x="12" y="32" fill="#38B889" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
            ZERO LEAKAGE EVAL
          </text>
        </g>
      </svg>

      {/* Subtle overlay radar sweep text */}
      <div className="absolute bottom-3 left-4 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-[#E23C45] animate-ping" />
        <span className="text-[10px] font-mono font-semibold tracking-widest text-[#A7B1C2] uppercase">
          LIVE SITUATION MODELING: 883 MATCHES (2022-2026)
        </span>
      </div>
    </div>
  );
};
