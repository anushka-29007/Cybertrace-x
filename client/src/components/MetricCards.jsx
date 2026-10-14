import React from 'react';
import { Database, GitFork, AlertTriangle, Fingerprint, Activity, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export default function MetricCards({ metrics = {} }) {
  const data = [
    {
      id: 'total',
      label: 'TOTAL CASES',
      value: metrics.totalCases ? metrics.totalCases.toLocaleString() : '1,248',
      icon: Database,
      color: 'blue',
      glow: 'shadow-blue-500/10',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-950/60 text-blue-400',
      trend: '70% Manual Effort Reduction',
      trendIcon: Zap,
      trendColor: 'text-blue-400'
    },
    {
      id: 'linked',
      label: 'LINKED CASES',
      value: metrics.linkedCases ? metrics.linkedCases.toLocaleString() : '862',
      icon: GitFork,
      color: 'cyan',
      glow: 'shadow-cyan-500/10',
      border: 'border-cyan-500/20',
      iconBg: 'bg-cyan-950/60 text-cyan-400',
      trend: '95% Linkage Accuracy',
      trendIcon: TrendingUp,
      trendColor: 'text-cyan-400'
    },
    {
      id: 'high-risk',
      label: 'HIGH RISK CASES',
      value: metrics.highRiskCases ? metrics.highRiskCases.toLocaleString() : '187',
      icon: AlertTriangle,
      color: 'rose',
      glow: 'shadow-rose-500/10',
      border: 'border-rose-500/20',
      iconBg: 'bg-rose-950/60 text-rose-400',
      trend: 'Urgent Interdiction',
      trendIcon: Activity,
      trendColor: 'text-rose-400'
    },
    {
      id: 'entities',
      label: 'ENTITIES EXTRACTED',
      value: metrics.entitiesExtracted ? metrics.entitiesExtracted.toLocaleString() : '15,732',
      icon: Fingerprint,
      color: 'purple',
      glow: 'shadow-purple-500/10',
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-950/60 text-purple-400',
      trend: 'Phones, UPI, Bank, IP',
      trendIcon: ShieldCheck,
      trendColor: 'text-purple-400'
    },
    {
      id: 'avg-risk',
      label: 'AVG. RISK SCORE',
      value: metrics.avgRiskScore ? `${metrics.avgRiskScore}/100` : '78/100',
      icon: Activity,
      color: 'amber',
      glow: 'shadow-amber-500/10',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-950/60 text-amber-400',
      trend: 'XGBoost ML Prioritization',
      trendIcon: Activity,
      trendColor: 'text-amber-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {data.map((item) => {
        const Icon = item.icon;
        const TrendIcon = item.trendIcon;
        return (
          <div
            key={item.id}
            className={`cyber-card rounded-xl p-3.5 border ${item.border} ${item.glow} hover:border-slate-600 transition-all duration-300 relative overflow-hidden group`}
          >
            {/* Ambient Background Accent */}
            <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity bg-current text-${item.color}-500`} />

            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {item.label}
              </span>
              <div className={`p-1.5 rounded-lg ${item.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-black tracking-tight text-white font-mono">
                {item.value}
              </span>
            </div>

            <div className={`flex items-center gap-1.5 text-[10px] font-medium ${item.trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              <span className="truncate">{item.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
