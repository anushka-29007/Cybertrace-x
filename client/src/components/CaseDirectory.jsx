import React, { useState } from 'react';
import { FolderLock, Search, Filter, ArrowUpRight, ShieldAlert, GitFork, MapPin, IndianRupee, User, Eye, EyeOff } from 'lucide-react';

export default function CaseDirectory({ cases = [], onSelectCase, piiMasked = false }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTier, setFilterTier] = useState('all');

  const maskName = (name) => {
    if (!name) return 'Confidential';
    if (!piiMasked) return name;
    const parts = name.split(' ');
    return parts.map(p => p[0] + '*****').join(' ');
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    if (!piiMasked) return phone;
    return phone.replace(/(?:\+?91[\s.-]?)?([6-9]\d{2})\d{4}(\d{3})/, '+91-$1-XXXX-$2');
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.crimeType.toLowerCase().includes(search.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(search.toLowerCase()));

    const matchesType = filterType === 'all' || c.crimeType.toLowerCase().includes(filterType.toLowerCase());
    const matchesTier = filterTier === 'all' || (c.riskTier || '').toLowerCase() === filterTier.toLowerCase();

    return matchesSearch && matchesType && matchesTier;
  });

  return (
    <div className="cyber-card rounded-2xl border border-slate-800 p-4">
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/50 text-cyan-400">
            <FolderLock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              INVESTIGATION CASE REPOSITORY
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${
                piiMasked ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {piiMasked ? 'PII MASKED' : 'UNMASKED'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Multi-source complaint intake with automated similarity & risk scoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search case, MO, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Crime Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Crime Types</option>
            <option value="Phishing">Phishing / Banking</option>
            <option value="UPI">UPI / QR Fraud</option>
            <option value="Investment">Investment / Telegram</option>
            <option value="Loan">Loan App Extortion</option>
            <option value="Crypto">Crypto Laundering</option>
          </select>

          {/* Tier Filter */}
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Risk Tiers</option>
            <option value="high">High Risk (70-100)</option>
            <option value="medium">Medium Risk (40-69)</option>
            <option value="low">Low Risk (0-39)</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <th className="py-2.5 px-3">Case ID</th>
              <th className="py-2.5 px-3">Title & Modus Operandi</th>
              <th className="py-2.5 px-3">Complainant / Target</th>
              <th className="py-2.5 px-3">Disputed Loss</th>
              <th className="py-2.5 px-3">Jurisdiction</th>
              <th className="py-2.5 px-3">Risk Score</th>
              <th className="py-2.5 px-3">Syndicate Links</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredCases.map((c) => {
              const isHigh = c.riskScore >= 70;
              const isMed = c.riskScore >= 40 && c.riskScore < 70;
              const linkCount = (c.linkedCases || []).length;

              return (
                <tr 
                  key={c.id} 
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectCase(c.id)}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {c.caseNumber}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-white block group-hover:text-cyan-300 transition-colors">
                      {c.title}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {c.description ? c.description.slice(0, 70) + '...' : ''}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-200 font-mono text-[11px]">
                        {maskName(c.complainant || 'Rajesh Sharma')}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-200 whitespace-nowrap font-medium">
                    {c.financialLoss ? `₹${c.financialLoss.toLocaleString()}` : '₹0'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{c.location || 'Cyber Cell'}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                        isHigh ? 'bg-rose-950 text-rose-300 border border-rose-800/80' :
                        isMed ? 'bg-amber-950 text-amber-300 border border-amber-800/80' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                      }`}>
                        {c.riskScore}/100
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {linkCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                        <GitFork className="w-3 h-3" />
                        {linkCount} Linked Cases
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Isolated</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors"
                      title="Inspect Case Dossier"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
