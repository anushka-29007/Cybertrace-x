import React, { useState } from 'react';
import { MapPin, Globe, ShieldAlert, Radio, AlertTriangle, ArrowRight, Filter } from 'lucide-react';

export default function GeospatialMap({ onSelectHotspot }) {
  // Pre-select Delhi by default so the info panel is never empty
  const [selectedHub, setSelectedHub] = useState({
    id: 'delhi',
    name: 'Delhi NCR (Dwarka / Rohini Corridor)',
    x: 320,
    y: 110,
    cases: 342,
    syndicate: 'NetBanking KYC & SIM Swap Phishing Ring',
    risk: 'Critical',
    color: '#ef4444',
    muleRoute: 'Jamtara & Mewat Layering Accounts',
    loss: '₹4.2 Crores',
    activeSIMs: 184
  });

  // Regional Cybercrime Corridors across India directly matching the Geospatial Analysis in Poster
  const hotspots = [
    {
      id: 'delhi',
      name: 'Delhi NCR (Dwarka / Rohini Corridor)',
      x: 320,
      y: 110,
      cases: 342,
      syndicate: 'NetBanking KYC & SIM Swap Phishing Ring',
      risk: 'Critical',
      color: '#ef4444',
      muleRoute: 'Jamtara & Mewat Layering Accounts',
      loss: '₹4.2 Crores',
      activeSIMs: 184
    },
    {
      id: 'jamtara',
      name: 'Jamtara - Deoghar Belt (Jharkhand)',
      x: 470,
      y: 170,
      cases: 285,
      syndicate: 'Remote Screen-Share APK & Bank Phishing Desk',
      risk: 'Critical',
      color: '#ef4444',
      muleRoute: 'Kolkata ATM Cash-Out Batches',
      loss: '₹3.1 Crores',
      activeSIMs: 210
    },
    {
      id: 'mewat',
      name: 'Mewat - Bharatpur Corridor (Haryana/Raj)',
      x: 300,
      y: 140,
      cases: 240,
      syndicate: 'OLX Military Impersonation & Sextortion Hub',
      risk: 'Critical',
      color: '#ef4444',
      muleRoute: 'Inter-State UPI VPAs (GPay/PhonePe)',
      loss: '₹2.8 Crores',
      activeSIMs: 156
    },
    {
      id: 'bengaluru',
      name: 'Bengaluru Tech Corridor',
      x: 310,
      y: 310,
      cases: 189,
      syndicate: 'Telegram Work-From-Home & Crypto Laundering',
      risk: 'High',
      color: '#f59e0b',
      muleRoute: 'Binance P2P Hawala Wallets',
      loss: '₹5.6 Crores',
      activeSIMs: 92
    },
    {
      id: 'mumbai',
      name: 'Mumbai Financial Hub',
      x: 230,
      y: 220,
      cases: 112,
      syndicate: 'Corporate Wire Fraud & Mule A/C Networks',
      risk: 'High',
      color: '#f59e0b',
      muleRoute: 'Overseas Swift & Domestic Current A/Cs',
      loss: '₹7.9 Crores',
      activeSIMs: 64
    },
    {
      id: 'hyderabad',
      name: 'Hyderabad Cyber Security Bureau Area',
      x: 320,
      y: 240,
      cases: 80,
      syndicate: 'Illegal Loan App Extortion & Hawala Ops',
      risk: 'High',
      color: '#f59e0b',
      muleRoute: 'Payment Gateway Escrow Subversion',
      loss: '₹1.9 Crores',
      activeSIMs: 48
    }
  ];

  const handlePointClick = (spot) => {
    setSelectedHub(spot);
    if (onSelectHotspot) onSelectHotspot(spot);
  };

  return (
    <div className="cyber-card rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/50 text-emerald-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              GEOSPATIAL THREAT ANALYSIS
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              National cybercrime syndicates & inter-state money mule corridors
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
          <Radio className="w-3 h-3 animate-pulse" />
          Live Geo Radar
        </span>
      </div>

      {/* SVG Map Canvas (Unobstructed View) */}
      <div className="relative h-60 bg-[#080d1a] rounded-xl border border-slate-900 overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 540 370" className="w-full h-full select-none">
          {/* Subtle Indian Subcontinent Contour */}
          <path
            d="M 240,30 
               L 280,55 L 300,75 L 280,100 L 330,120 L 400,130 L 450,150 L 440,190 L 390,190 
               L 360,220 L 330,270 L 290,340 L 280,350 L 260,330 L 240,290 L 210,240 L 170,200 
               L 165,160 L 200,130 L 210,90 L 240,30 Z"
            fill="#0d172a"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Coordinate Grid lines */}
          <line x1="80" y1="180" x2="460" y2="180" stroke="rgba(30, 41, 59, 0.4)" strokeWidth="0.6" strokeDasharray="2 2" />
          <line x1="280" y1="30" x2="280" y2="340" stroke="rgba(30, 41, 59, 0.4)" strokeWidth="0.6" strokeDasharray="2 2" />

          {/* Inter-state Fraud Laundering Vectors */}
          <line x1="320" y1="110" x2="470" y2="170" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="1.8" strokeDasharray="4 2" />
          <line x1="320" y1="110" x2="300" y2="140" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="1.8" />
          <line x1="470" y1="170" x2="230" y2="220" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="230" y1="220" x2="310" y2="310" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="320" y1="240" x2="310" y2="310" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Hotspot Markers */}
          {hotspots.map((spot) => {
            const isSelected = selectedHub && selectedHub.id === spot.id;
            return (
              <g
                key={spot.id}
                transform={`translate(${spot.x}, ${spot.y})`}
                onClick={() => handlePointClick(spot)}
                className="cursor-pointer group"
              >
                {/* Radar pulse ripple */}
                <circle
                  r={isSelected ? "18" : "12"}
                  fill="none"
                  stroke={spot.color}
                  strokeWidth="1.2"
                  className="animate-ping opacity-35"
                />

                {/* Outer Ring */}
                <circle
                  r={isSelected ? 11 : 7}
                  fill="#070c18"
                  stroke={spot.color}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all"
                />

                {/* Inner Core Dot */}
                <circle
                  r={isSelected ? 5 : 3}
                  fill={spot.color}
                />

                {/* City Label beside pin (Never blocked) */}
                <text
                  x="14"
                  y="4"
                  fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                  fontSize={isSelected ? "10" : "9"}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  className="select-none pointer-events-none drop-shadow font-sans"
                >
                  {spot.name.split(' ')[0]} ({spot.cases})
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded px-2 py-0.5 text-[9px] text-slate-400">
          Click any red dot to view corridor
        </div>
      </div>

      {/* DEDICATED SYNDICATE INTEL PANEL (Directly Below Map - ZERO OVERLAPPING) */}
      {selectedHub && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-cyan-800/60 shadow-lg text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="font-bold text-white text-xs">{selectedHub.name}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-950 text-rose-300 border border-rose-800">
              {selectedHub.risk} Risk Corridor
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">PRIMARY MODUS OPERANDI</span>
              <span className="text-amber-300 font-semibold leading-tight block">
                {selectedHub.syndicate}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">MONEY LAUNDERING ROUTE</span>
              <span className="text-cyan-300 font-medium leading-tight block truncate">
                {selectedHub.muleRoute}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] font-mono border-t border-slate-800/60">
            <span className="text-slate-400">
              Active Cases: <strong className="text-white">{selectedHub.cases}</strong>
            </span>
            <span className="text-slate-400">
              Disputed Vol: <strong className="text-rose-400">{selectedHub.loss}</strong>
            </span>
            <span className="text-slate-400">
              Target SIMs: <strong className="text-emerald-400">{selectedHub.activeSIMs}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
