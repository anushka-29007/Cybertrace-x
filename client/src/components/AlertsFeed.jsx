import React from 'react';
import { Bell, AlertOctagon, Link2, Key, Globe2, ChevronRight } from 'lucide-react';

export default function AlertsFeed({ alerts = [], onAlertClick }) {
  // Directly matches Poster Section 9 alerts
  const defaultAlerts = [
    {
      id: 'alt-1',
      title: 'High-risk transaction detected',
      timeAgo: '2 min ago',
      severity: 'critical',
      icon: AlertOctagon,
      desc: 'Rapid siphon of ₹2,45,000 into flagged mule account 123456789012 from Delhi IP.'
    },
    {
      id: 'alt-2',
      title: 'New similar case linked',
      timeAgo: '5 min ago',
      severity: 'warning',
      icon: Link2,
      desc: 'Case #126 matched with Case #104 & #117 via shared mule A/C 123456789012 (98% confidence).'
    },
    {
      id: 'alt-3',
      title: 'Unusual login pattern detected',
      timeAgo: '12 min ago',
      severity: 'info',
      icon: Key,
      desc: 'Simultaneous victim credential submissions recorded from IP subnet 185.220.101.x.'
    },
    {
      id: 'alt-4',
      title: 'Potential phishing site identified',
      timeAgo: '15 min ago',
      severity: 'warning',
      icon: Globe2,
      desc: 'Domain sbi-kyc-verify-portal.in flagged in active phishing SMS campaign.'
    }
  ];

  const list = alerts.length > 0 ? alerts : defaultAlerts;

  return (
    <div className="cyber-card rounded-xl border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-800/50 text-amber-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              ALERTS & NOTIFICATIONS
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Real-time threat telemetry & linkage triggers
            </p>
          </div>
        </div>

        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
      </div>

      {/* Alert Items List */}
      <div className="space-y-2 flex-1">
        {list.map((alt) => {
          const isCritical = alt.severity === 'critical';
          const isWarning = alt.severity === 'warning';

          return (
            <div
              key={alt.id}
              onClick={() => onAlertClick && onAlertClick(alt)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer group flex items-start gap-2.5 ${
                isCritical 
                  ? 'bg-rose-950/30 border-rose-900/60 hover:border-rose-700' 
                  : isWarning 
                  ? 'bg-amber-950/30 border-amber-900/60 hover:border-amber-700' 
                  : 'bg-blue-950/30 border-blue-900/60 hover:border-blue-700'
              }`}
            >
              <div className={`p-1.5 rounded-md mt-0.5 ${
                isCritical ? 'bg-rose-900/50 text-rose-400' :
                isWarning ? 'bg-amber-900/50 text-amber-400' :
                'bg-blue-900/50 text-blue-400'
              }`}>
                {alt.icon ? <alt.icon className="w-3.5 h-3.5" /> : <AlertOctagon className="w-3.5 h-3.5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className={`text-xs font-bold truncate ${
                    isCritical ? 'text-rose-200' : isWarning ? 'text-amber-200' : 'text-blue-200'
                  }`}>
                    {alt.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                    {alt.timeAgo}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 group-hover:text-slate-200 transition-colors">
                  {alt.description || alt.desc}
                </p>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors self-center flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
