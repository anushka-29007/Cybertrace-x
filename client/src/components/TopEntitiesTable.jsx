import React, { useState } from 'react';
import { Fingerprint, Phone, Landmark, Smartphone, Mail, Globe, Copy, Check, Search, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function TopEntitiesTable({ piiMasked = false, onInspectEntity }) {
  const [activeTab, setActiveTab] = useState('entities');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedVal, setCopiedVal] = useState(null);

  // Directly matches Poster Section 9 preview
  const entitySummary = [
    { type: 'Phone Numbers', count: 4562, icon: Phone, color: 'cyan', tag: 'Telecom SIM' },
    { type: 'Bank Accounts', count: 2164, icon: Landmark, color: 'amber', tag: 'Mule A/Cs' },
    { type: 'UPI IDs', count: 1298, icon: Smartphone, color: 'emerald', tag: 'VPA Wallets' },
    { type: 'Email IDs', count: 1102, icon: Mail, color: 'purple', tag: 'Digital IDs' },
    { type: 'IP Addresses', count: 966, icon: Globe, color: 'blue', tag: 'Origin Proxy' },
  ];

  // Specific high-frequency entities from cases with dynamic PII masking
  const detailedEntities = [
    { 
      value: piiMasked ? '+91-9876-XXXX-10' : '+91-9876543210', 
      raw: '+919876543210', 
      type: 'Phone', 
      cases: 'Case #104, #117, #126, #135', 
      role: 'Primary Phishing SIM', 
      risk: 'Critical',
      icon: Phone
    },
    { 
      value: piiMasked ? '1234-XXXX-9012' : '123456789012', 
      raw: '123456789012', 
      type: 'Bank', 
      cases: 'Case #104, #117, #126, #142', 
      role: 'Hub Mule Bank A/C (State Bank)', 
      risk: 'Critical',
      icon: Landmark
    },
    { 
      value: piiMasked ? 'abc@***' : 'abc@upi', 
      raw: 'abc@upi', 
      type: 'UPI', 
      cases: 'Case #104, #117, #158', 
      role: 'Syndicate VPA Gateway Sink', 
      risk: 'Critical',
      icon: Smartphone
    },
    { 
      value: piiMasked ? '185.220.101.x' : '185.220.101.5', 
      raw: '185.220.101.5', 
      type: 'IP', 
      cases: 'Case #104, #126, #142', 
      role: 'Reverse Proxy & TOR Exit Relay', 
      risk: 'High',
      icon: Globe
    },
    { 
      value: piiMasked ? 'sbi-***@support.net' : 'sbi-alert@support-portal.net', 
      raw: 'sbi-alert@support-portal.net', 
      type: 'Email', 
      cases: 'Case #104', 
      role: 'Spoofed Phishing Mailer Header', 
      risk: 'Medium',
      icon: Mail
    },
    { 
      value: piiMasked ? '0x71C8***49b' : '0x71C8363820912BF821389028198301823901949b', 
      raw: '0x71C8363820912BF821389028198301823901949b', 
      type: 'Crypto', 
      cases: 'Case #126, #142', 
      role: 'USDT Hawala Converter Desk', 
      risk: 'Critical',
      icon: Landmark
    }
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedVal(text);
    setTimeout(() => setCopiedVal(null), 2000);
  };

  const filteredDetailed = detailedEntities.filter(e => {
    const matchesSearch = e.value.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.cases.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'entities') return matchesSearch;
    return matchesSearch && e.type.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <div className="cyber-card rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950/80 border border-purple-800/50 text-purple-400">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              TOP EXTRACTED ENTITIES
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${
                piiMasked ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {piiMasked ? 'MASKED' : 'UNMASKED'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              15,732 automated NER items • Dynamic forensic redaction active
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search IOC or case..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('entities')}
          className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'entities' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200 bg-slate-900/40'
          }`}
        >
          Key Entities (Live PII)
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'overview' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200 bg-slate-900/40'
          }`}
        >
          Category Counts (Poster)
        </button>
        {['Phone', 'Bank', 'UPI', 'IP'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200 bg-slate-900/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'overview' && !searchTerm ? (
        // Matches exact poster preview table
        <div className="space-y-1.5 flex-1">
          {entitySummary.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-800/80 text-cyan-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.tag}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black font-mono text-cyan-300">
                    {item.count.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Extracted
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Detailed drill-down list with live PII Masking
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {filteredDetailed.map((ent, idx) => {
            const Icon = ent.icon;
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 flex-shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-white">
                        {ent.value}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-rose-950 text-rose-300 border border-rose-800">
                        {ent.risk}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      Role: <strong className="text-amber-300">{ent.role}</strong> • Linked: {ent.cases}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(ent.raw)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    title="Copy Raw Identifier"
                  >
                    {copiedVal === ent.raw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
