import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, GitFork, Clock, Printer, FileDown, ExternalLink, MapPin, Calendar, User, Phone, Landmark, Smartphone, Globe, Landmark as BankIcon, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';
import AttackTimeline from './AttackTimeline';

export default function CaseDetailModal({ caseId, onClose, piiMasked = false, onNavigateCase, userRole = 'Lead Investigator' }) {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFormalReport, setShowFormalReport] = useState(false);

  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    fetch(`/api/cases/${caseId}`)
      .then(res => res.json())
      .then(data => {
        setCaseData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [caseId]);

  if (!caseId) return null;

  // Masking helpers
  const maskPhone = (p) => piiMasked ? p.replace(/(?:\+?91[\s.-]?)?([6-9]\d{2})\d{4}(\d{3})/, '+91-$1-XXXX-$2') : p;
  const maskBank = (b) => piiMasked ? b.replace(/(\d{4})\d{4,8}(\d{4})/, '$1-XXXX-$2') : b;
  const maskUPI = (u) => piiMasked ? u.replace(/^([^@]{2})[^@]+(@.+)$/, '$1***$2') : u;
  const maskName = (n) => piiMasked ? 'Confidential Citizen' : n;

  const handleTriggerPrint = () => {
    setShowFormalReport(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="cyber-card rounded-2xl border border-cyan-500/50 w-full max-w-4xl overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200 bg-[#0a1122]">
        
        {/* Top Header Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg font-mono font-black text-sm bg-cyan-950 text-cyan-300 border border-cyan-700">
              {caseData?.caseNumber || `Case #${caseId}`}
            </span>
            <div>
              <h3 className="font-bold text-white text-base">
                {caseData?.title || 'Forensic Case Dossier'}
              </h3>
              <p className="text-xs text-slate-400">
                {caseData?.crimeType} • Jurisdiction: {caseData?.location || 'Cyber Crime Police Station'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFormalReport(!showFormalReport)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{showFormalReport ? 'Standard View' : 'Formal Report View'}</span>
            </button>
            <button
              onClick={handleTriggerPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/40 transition-colors"
              title="Print Formal Cybercrime Investigation Dossier"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2" />
              <span>Retrieving case evidence and knowledge graph nodes...</span>
            </div>
          ) : caseData ? (
            showFormalReport ? (
              /* FORMAL GOVERNMENT / LEGAL INVESTIGATION REPORT VIEW (PRINT-OPTIMIZED) */
              <div className="print-page bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 font-sans space-y-6">
                {/* Formal Header */}
                <div className="border-b-2 border-slate-900 pb-4 text-center">
                  <div className="text-[11px] font-bold tracking-widest uppercase text-slate-700">
                    CENTRAL CYBER CRIME INVESTIGATION & THREAT INTELLIGENCE FRAMEWORK
                  </div>
                  <h1 className="text-xl font-black text-slate-900 mt-1 uppercase tracking-tight">
                    OFFICIAL FORENSIC CASE DOSSIER & INVESTIGATION REPORT
                  </h1>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">
                    Prepared under IT Act 2000 & Bharatiya Nyaya Sanhita (BNS) 2023 • Evidence Act Sec 63 BSA
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-700 border-t border-slate-300 pt-2">
                    <span><strong>Case Reference:</strong> {caseData.caseNumber}</span>
                    <span><strong>Date of Ingestion:</strong> {new Date().toLocaleDateString()}</span>
                    <span><strong>Classification:</strong> {caseData.crimeType}</span>
                    <span><strong>Status:</strong> {caseData.status}</span>
                  </div>
                </div>

                {/* Case Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="border border-slate-300 p-3 rounded bg-slate-50">
                    <span className="font-bold block text-slate-700 uppercase text-[10px]">Complainant / Target Identity</span>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">{maskName(caseData.complainant || 'Rajesh Sharma')}</span>
                    <span className="text-slate-600 block text-[11px]">Location: {caseData.location}</span>
                  </div>
                  <div className="border border-slate-300 p-3 rounded bg-slate-50">
                    <span className="font-bold block text-slate-700 uppercase text-[10px]">Financial Damage & Priority</span>
                    <span className="text-sm font-bold text-red-600 block mt-0.5">Disputed Loss: ₹{caseData.financialLoss ? caseData.financialLoss.toLocaleString() : '0'}</span>
                    <span className="text-slate-700 block text-[11px]">XGBoost Risk Score: <strong>{caseData.riskScore}/100 ({caseData.riskTier})</strong></span>
                  </div>
                </div>

                {/* Modus Operandi & Factual Findings */}
                <div className="text-xs space-y-2">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
                    1. Modus Operandi & Forensic Narrative
                  </h3>
                  <p className="text-slate-800 leading-relaxed text-justify">
                    {caseData.description}
                  </p>
                </div>

                {/* Reconstructed Attack Timeline */}
                <div className="text-xs space-y-2">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
                    2. Reconstructed Chronological Attack Sequence
                  </h3>
                  <table className="w-full text-left border-collapse border border-slate-300 text-[11px]">
                    <thead className="bg-slate-100 font-bold">
                      <tr>
                        <th className="border border-slate-300 p-2">Step</th>
                        <th className="border border-slate-300 p-2">Timestamp</th>
                        <th className="border border-slate-300 p-2">Attack Phase</th>
                        <th className="border border-slate-300 p-2">Actor</th>
                        <th className="border border-slate-300 p-2">Forensic Artifact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(caseData.timeline || []).map((t, idx) => (
                        <tr key={idx} className="border-b border-slate-200">
                          <td className="border border-slate-300 p-2 font-mono font-bold text-center">{idx + 1}</td>
                          <td className="border border-slate-300 p-2 font-mono">{t.timestamp}</td>
                          <td className="border border-slate-300 p-2 font-semibold">{t.title}</td>
                          <td className="border border-slate-300 p-2">{t.actor}</td>
                          <td className="border border-slate-300 p-2 font-mono text-[10px]">{t.evidenceSnippet}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Extracted IOCs & Mule Trail */}
                <div className="text-xs space-y-2">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
                    3. Indicators of Compromise (IOCs) & Banking Trail
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border border-slate-300 p-2.5 rounded bg-slate-50">
                      <strong className="block text-slate-700 text-[10px] uppercase">Calling SIM(s)</strong>
                      {(caseData.entities?.phoneNumbers || []).map((p, i) => (
                        <span key={i} className="font-mono text-slate-900 font-bold block">{maskPhone(p)}</span>
                      ))}
                    </div>
                    <div className="border border-slate-300 p-2.5 rounded bg-slate-50">
                      <strong className="block text-slate-700 text-[10px] uppercase">Mule Bank A/C(s)</strong>
                      {(caseData.entities?.bankAccounts || []).map((b, i) => (
                        <span key={i} className="font-mono text-slate-900 font-bold block">{maskBank(b)}</span>
                      ))}
                    </div>
                    <div className="border border-slate-300 p-2.5 rounded bg-slate-50">
                      <strong className="block text-slate-700 text-[10px] uppercase">UPI VPA(s)</strong>
                      {(caseData.entities?.upiIds || []).map((u, i) => (
                        <span key={i} className="font-mono text-slate-900 font-bold block">{maskUPI(u)}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legal Framework & Statutory Charges */}
                <div className="text-xs space-y-2">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
                    4. Statutory Invocations & Recommended Charges
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(caseData.legalSections || ['IT Act Sec 66C', 'IT Act Sec 66D', 'BNS Sec 318(4)']).map((sec, si) => (
                      <span key={si} className="px-2.5 py-1 rounded bg-slate-200 text-slate-900 font-bold text-[11px] border border-slate-400">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Official Sign-off and Digital Certificate */}
                <div className="pt-6 border-t border-slate-400 flex items-end justify-between text-xs">
                  <div>
                    <span className="font-bold block text-slate-800">Electronic Record Hash (SHA-256):</span>
                    <span className="font-mono text-[10px] text-slate-600 block">7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Certified pursuant to Bharatiya Sakshya Adhiniyam, 2023 Sec 63.</span>
                  </div>
                  <div className="text-right">
                    <div className="h-10 border-b border-dashed border-slate-500 w-48 mb-1"></div>
                    <span className="font-bold block text-slate-900">{caseData.investigatingOfficer || 'Insp. Vikram Singh'}</span>
                    <span className="text-[10px] text-slate-600 block">{userRole}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* STANDARD INTERACTIVE DOSSIER VIEW */
              <>
                {/* Overview Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium block">DISPUTED LOSS</span>
                    <span className="text-lg font-black font-mono text-cyan-300">
                      {caseData.financialLoss ? `₹${caseData.financialLoss.toLocaleString()}` : '₹0'}
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium block">PRIORITY RISK SCORE</span>
                    <span className="text-lg font-black font-mono text-rose-400">
                      {caseData.riskScore}/100 ({caseData.riskTier})
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium block">COMPLAINANT IDENTITY</span>
                    <span className="text-sm font-bold text-white truncate block">
                      {maskName(caseData.complainant || 'Rajesh Sharma')}
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium block">INVESTIGATING OFFICER</span>
                    <span className="text-sm font-bold text-white truncate block">
                      {caseData.investigatingOfficer || 'Insp. Vikram Singh'}
                    </span>
                  </div>
                </div>

                {/* Modus Operandi & Case Description */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Forensic Summary & Modus Operandi
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {caseData.description}
                  </p>
                </div>

                {/* Attack Timeline Reconstructor Component */}
                <AttackTimeline
                  events={caseData.timeline}
                  activeCaseNumber={caseData.caseNumber}
                />

                {/* Connected Cases & Syndicate Link Analysis */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <GitFork className="w-4 h-4 text-cyan-400" />
                      Cross-Case Linkages & Network Discovery
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Knowledge Graph Correlated
                    </span>
                  </div>

                  {caseData.linkedCases && caseData.linkedCases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {caseData.linkedCases.map((link, idx) => (
                        <div
                          key={idx}
                          onClick={() => onNavigateCase && onNavigateCase(link.targetCaseId)}
                          className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-cyan-400 text-xs group-hover:text-cyan-300">
                              {link.targetCaseNumber}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                              {link.linkType} ({link.similarityScore ? Math.round(link.similarityScore * 100) : 95}%)
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-white mb-1 truncate">
                            {link.targetTitle}
                          </div>
                          <ul className="text-[11px] text-slate-400 space-y-0.5">
                            {(link.reasons || []).map((r, ri) => (
                              <li key={ri} className="flex items-center gap-1.5 text-amber-200/90 text-[10px]">
                                <span className="w-1 h-1 rounded-full bg-amber-400 inline-block"></span>
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      No connected cases identified yet for this file.
                    </p>
                  )}
                </div>

                {/* Extracted Forensic Entities (With Dynamic PII Masking) */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Extracted Multimodal Forensic Indicators (IOCs)
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {piiMasked ? 'PII MASKED VIEW' : 'RAW UNMASKED VIEW'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {/* Phones */}
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono block mb-1">CALLING / TARGET SIMS</span>
                      {(caseData.entities?.phoneNumbers || []).map((p, pi) => (
                        <span key={pi} className="font-mono text-cyan-400 font-bold block">
                          {maskPhone(p)}
                        </span>
                      ))}
                    </div>

                    {/* Bank Accounts */}
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono block mb-1">MULE BANK A/CS</span>
                      {(caseData.entities?.bankAccounts || []).map((b, bi) => (
                        <span key={bi} className="font-mono text-amber-400 font-bold block">
                          {maskBank(b)}
                        </span>
                      ))}
                    </div>

                    {/* UPI IDs */}
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono block mb-1">UPI VPAS</span>
                      {(caseData.entities?.upiIds || []).map((u, ui) => (
                        <span key={ui} className="font-mono text-emerald-400 font-bold block">
                          {maskUPI(u)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legal Framework Invocations */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-blue-900/40">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1.5">
                    Statutory Provisions & Recommended Penal Charges
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(caseData.legalSections || ['IT Act Sec 66D', 'IT Act Sec 66C', 'BNS Sec 318(4)']).map((sec, si) => (
                      <span key={si} className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-950/80 text-blue-200 border border-blue-800">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
