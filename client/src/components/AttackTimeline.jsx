import React, { useState } from 'react';
import { Clock, MessageSquare, ExternalLink, KeyRound, ArrowRightLeft, Banknote, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AttackTimeline({ events = [], activeCaseNumber = 'Case #104' }) {
  const [selectedStep, setSelectedStep] = useState(0);

  // Default timeline matching poster Section 8 & 9 if none provided
  const displayEvents = (events && events.length > 0) ? events : [
    {
      stepNumber: 1,
      phase: 'Initial Contact',
      title: 'Phishing SMS / Email Broadcast',
      timestamp: '10:01 AM',
      description: 'Deceptive KYC expiry alert sent to victim via spoofed telecom header AX-SBISEC.',
      actor: 'Threat Actor (Phishing Bot)',
      evidenceSnippet: 'Originating Calling Line: +91-9876543210',
      severity: 'MEDIUM',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      stepNumber: 2,
      phase: 'Delivery & Lure',
      title: 'Fake Bank Link Opened',
      timestamp: '10:18 AM',
      description: 'Victim opened fraudulent portal resembling authentic State Bank verification desk.',
      actor: 'Victim (Deceived User)',
      evidenceSnippet: 'URL: https://sbi-kyc-verify-portal.in',
      severity: 'HIGH',
      icon: ExternalLink,
      color: 'amber'
    },
    {
      stepNumber: 3,
      phase: 'Credential Theft',
      title: 'Credential Theft (Unauthorized Access)',
      timestamp: '10:25 AM',
      description: 'Victim submitted NetBanking password & OTP; intercepted by reverse proxy in real time.',
      actor: 'Reverse Proxy (Exfiltration)',
      evidenceSnippet: 'Relay Server IP: 185.220.101.5',
      severity: 'CRITICAL',
      icon: KeyRound,
      color: 'rose'
    },
    {
      stepNumber: 4,
      phase: 'Unauthorized Transfer',
      title: 'Money Transfer / UPI Fraud',
      timestamp: '10:33 AM',
      description: 'Threat actors executed automated UPI/IMPS debit transferring ₹2,45,000 to primary mule account.',
      actor: 'Scammer / Money Mule Operator',
      evidenceSnippet: 'Mule Bank A/C: 123456789012 (abc@upi)',
      severity: 'CRITICAL',
      icon: ArrowRightLeft,
      color: 'rose'
    },
    {
      stepNumber: 5,
      phase: 'Laundering Hop',
      title: 'Multiple Victims & ATM Cash-Out',
      timestamp: '10:48 AM',
      description: 'Funds layered across secondary sub-accounts and cash withdrawn at regional ATM kiosk.',
      actor: 'Cash-out Mule Network',
      evidenceSnippet: 'Withdrawal Location: Jamtara / ATM Kiosk #99281',
      severity: 'CRITICAL',
      icon: Banknote,
      color: 'rose'
    }
  ];

  const current = displayEvents[selectedStep] || displayEvents[0];

  return (
    <div className="cyber-card rounded-xl border border-slate-800 p-4 relative overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-800/50 text-blue-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              ATTACK TIMELINE RECONSTRUCTION
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700/40 font-mono">
                {activeCaseNumber}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Chronological forensic event chain & timestamp delta
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Total Duration: <strong className="text-cyan-400 font-bold">47 mins</strong>
        </span>
      </div>

      {/* Horizontal Step Sequence matching poster */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        {displayEvents.map((ev, index) => {
          const isSelected = selectedStep === index;
          return (
            <button
              key={index}
              onClick={() => setSelectedStep(index)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 relative ${
                isSelected
                  ? 'bg-blue-950/60 border-cyan-500 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {ev.timestamp}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  ev.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800/60' :
                  ev.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800/60' :
                  'bg-blue-950 text-blue-400 border border-blue-800/60'
                }`}>
                  {ev.severity}
                </span>
              </div>
              <div className="font-semibold text-xs text-white line-clamp-1">
                {ev.title}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                {ev.phase}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Selected Step View */}
      {current && (
        <div className="bg-[#0b1120] rounded-xl p-3.5 border border-slate-800/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                Phase {current.stepNumber}: {current.phase}
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">
                Time: {current.timestamp}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">
                Actor: <strong className="text-amber-300">{current.actor}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              {current.description}
            </p>
          </div>

          <div className="w-full md:w-auto bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-right">
            <span className="text-[10px] text-slate-400 block font-mono">
              EVIDENCE ARTIFACT
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300 truncate max-w-xs block">
              {current.evidenceSnippet}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
