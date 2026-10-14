import React from 'react';
import { Shield, ShieldAlert, Sparkles, PlusCircle, Bot, FileText, Lock, Unlock, Eye, EyeOff, UserCheck, Scale, Binary } from 'lucide-react';

export default function Navbar({ 
  onNewCase, 
  onOpenAI, 
  onOpenAudit, 
  piiMasked, 
  setPiiMasked, 
  userRole, 
  setUserRole 
}) {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'Senior Forensics Analyst':
        return {
          label: 'FORENSIC LAB MODE',
          color: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
          icon: Binary
        };
      case 'Legal & Court Auditor':
        return {
          label: 'JUDICIAL AUDIT MODE',
          color: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
          icon: Scale
        };
      default:
        return {
          label: 'OPERATIONAL DISPATCH',
          color: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60',
          icon: UserCheck
        };
    }
  };

  const roleInfo = getRoleBadge(userRole);
  const RoleIcon = roleInfo.icon;

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    // If switching to Legal & Court Auditor, automatically turn ON PII masking to enforce court compliance
    if (newRole === 'Legal & Court Auditor') {
      setPiiMasked(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-colors no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-lg shadow-cyan-500/25 border border-cyan-400/40">
              <Shield className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  CyberTrace<span className="text-cyan-400">-X</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800/80 rounded-md">
                  v2.4 AI Node
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Multimodal Cybercrime Investigation & Intelligence Framework
              </p>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onNewCase}
              className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
              title="New Investigation"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAI}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
              title="AI Assistant"
            >
              <Bot className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center / Strategic Tagline & Active Mode Pill */}
        <div className="hidden xl:flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] font-mono bg-slate-900/80 border border-slate-800 rounded-full px-3.5 py-1 text-slate-400">
            <span className="text-cyan-400">Evidence</span>
            <span>→</span>
            <span className="text-blue-400">Understand</span>
            <span>→</span>
            <span className="text-amber-400">Connect</span>
            <span>→</span>
            <span className="text-emerald-400">Reconstruct</span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${roleInfo.color}`}>
            <RoleIcon className="w-3 h-3" />
            <span>{roleInfo.label}</span>
          </div>
        </div>

        {/* Right Tools & RBAC Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          {/* PII Masking Toggle Button */}
          <button
            onClick={() => setPiiMasked(!piiMasked)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              piiMasked 
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-900/40 ring-1 ring-emerald-500/50' 
                : 'bg-rose-950/70 border-rose-600 text-rose-300 ring-1 ring-rose-500/30'
            }`}
            title={piiMasked ? 'Sensitive PII is MASKED (safe for court/reports). Click to reveal raw data.' : 'Raw PII is UNMASKED. Click to mask for privacy.'}
          >
            {piiMasked ? <EyeOff className="w-4 h-4 text-emerald-400 animate-pulse" /> : <Eye className="w-4 h-4 text-rose-400" />}
            <span className="text-[11px] font-mono tracking-tight">
              {piiMasked ? 'PII MASKED (COURT READY)' : 'PII UNMASKED (RAW DATA)'}
            </span>
          </button>

          {/* RBAC Role Selector Dropdown */}
          <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <Lock className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
            <select
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent text-slate-100 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="Lead Investigator" className="bg-slate-900 text-slate-200">Lead Investigator (Operational)</option>
              <option value="Senior Forensics Analyst" className="bg-slate-900 text-slate-200">Senior Forensics Analyst (Deep Lab)</option>
              <option value="Legal & Court Auditor" className="bg-slate-900 text-slate-200">Legal & Court Auditor (Compliance)</option>
            </select>
          </div>

          {/* Audit Logs button */}
          <button
            onClick={onOpenAudit}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Inspect Cryptographic Audit Trail"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Audit Logs</span>
          </button>

          {/* AI Investigator Assistant Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-900/30 border border-blue-400/30 transition-all hover:scale-[1.02]"
          >
            <Bot className="w-3.5 h-3.5 text-blue-200" />
            <span>AI Assistant (RAG)</span>
          </button>

          {/* Intake New Evidence Button (Disabled for Legal Auditor in Read-only Mode) */}
          {userRole !== 'Legal & Court Auditor' ? (
            <button
              onClick={onNewCase}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-900/40 border border-cyan-400/30 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-200" />
              <span>+ Ingest Evidence</span>
            </button>
          ) : (
            <div className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-amber-950/60 border border-amber-800/80 text-amber-300 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Auditor Read-Only</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
