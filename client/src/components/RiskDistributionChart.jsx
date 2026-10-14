import React, { useState } from 'react';
import { PieChart, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';

export default function RiskDistributionChart({ onSelectTier, selectedTier = 'all' }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Directly matches Poster Section 9 numbers
  const tiers = [
    {
      id: 'high',
      label: 'High (70-100)',
      count: 187,
      percentage: 15,
      color: '#ef4444', // Red / Rose
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-950/60',
      borderColor: 'border-rose-800/80',
      action: 'Immediate Interdiction'
    },
    {
      id: 'medium',
      label: 'Medium (40-69)',
      count: 512,
      percentage: 41,
      color: '#f59e0b', // Amber
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-950/60',
      borderColor: 'border-amber-800/80',
      action: 'Active Investigation'
    },
    {
      id: 'low',
      label: 'Low (0-39)',
      count: 549,
      percentage: 44,
      color: '#10b981', // Emerald
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-950/60',
      borderColor: 'border-emerald-800/80',
      action: 'Automated Monitoring'
    }
  ];

  const total = 1248;

  // Donut SVG parameters
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke offsets
  let accumulatedPercent = 0;
  const slices = tiers.map(tier => {
    const strokeDasharray = `${(tier.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += tier.percentage / 100;
    return {
      ...tier,
      strokeDasharray,
      strokeDashoffset
    };
  });

  return (
    <div className="cyber-card rounded-xl border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-800/50 text-rose-400">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              RISK SCORE DISTRIBUTION
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              XGBoost ML Prioritization Tier Breakdown
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Total: <strong className="text-white font-bold">{total}</strong>
        </span>
      </div>

      {/* Chart & Legend Container */}
      <div className="flex items-center justify-around gap-4 py-2">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {slices.map((slice) => {
              const isSelected = selectedTier === slice.id;
              const isHovered = hoveredSlice === slice.id;
              return (
                <circle
                  key={slice.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isSelected || isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice(slice.id)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  onClick={() => onSelectTier(selectedTier === slice.id ? 'all' : slice.id)}
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-2xl font-black font-mono text-white">
              78<span className="text-xs text-amber-400 font-normal">/100</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
              Avg Score
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2 flex-1">
          {tiers.map((tier) => {
            const isSelected = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => onSelectTier(selectedTier === tier.id ? 'all' : tier.id)}
                className={`w-full text-left p-2 rounded-lg border transition-all ${
                  isSelected 
                    ? `${tier.bgColor} ${tier.borderColor} ring-1 ring-white/20` 
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="text-xs font-bold text-white">
                      {tier.label}
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${tier.textColor}`}>
                    {tier.count} <span className="text-[10px] text-slate-400 font-normal">({tier.percentage}%)</span>
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {tier.action}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
