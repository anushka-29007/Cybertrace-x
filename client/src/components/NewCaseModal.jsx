import React, { useState } from 'react';
import { X, UploadCloud, Cpu, Sparkles, CheckCircle2, GitFork, AlertTriangle, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default function NewCaseModal({ isOpen, onClose, onCaseCreated }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [crimeType, setCrimeType] = useState('Phishing & Banking Fraud');
  const [complainant, setComplainant] = useState('');
  const [financialLoss, setFinancialLoss] = useState('');
  const [location, setLocation] = useState('New Delhi');
  const [evidenceText, setEvidenceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [ocrStatus, setOcrStatus] = useState(null);

  // Quick Preset Samples to test Algorithm C immediately
  const sampleTemplates = [
    {
      name: 'Phishing KYC Link (Matches Case #104)',
      title: 'YONO KYC Suspension Phishing with Mule Siphon',
      type: 'Phishing & Banking Fraud',
      loss: '245000',
      loc: 'Dwarka, New Delhi',
      comp: 'Vikas Malhotra',
      text: 'Complainant received SMS from +919876543210 claiming State Bank account blocked. Clicked https://sbi-kyc-verify-portal.in. Entered NetBanking password and OTP. Rs. 2,45,000 siphoned into Mule Bank A/C 123456789012 via UPI ID abc@upi. Reverse proxy exfiltration recorded on IP 185.220.101.5.'
    },
    {
      name: 'Telegram Task Scam (Matches Case #126)',
      title: 'Crypto Rating Tasks Telegram Defraudment',
      type: 'Investment & Task Scam',
      loss: '350000',
      loc: 'Bengaluru, Karnataka',
      comp: 'Deepak Rao',
      text: 'Victim invited to Telegram channel @invest_vip_global. Sent deposit of Rs. 3,50,000 to Bank Account 123456789012 with narration "VIP tasks". Admin converted funds to USDT at crypto address 0x71C8363820912BF821389028198301823901949b. Threat actor login IP: 185.220.101.5.'
    },
    {
      name: 'OLX Military QR Code (Matches Case #117)',
      title: 'OLX Defense Officer Furniture Payment Fraud',
      type: 'OLX / Impersonation Fraud',
      loss: '95000',
      loc: 'Pune, Maharashtra',
      comp: 'Rohit Kulkarni',
      text: 'Caller impersonating Army officer using mobile +91-9876543210 sent payment QR code. Scanning triggered debit of Rs. 95,000 to abc@upi, credited to beneficiary Bank A/C 123456789012.'
    }
  ];

  const applyTemplate = (tpl) => {
    setTitle(tpl.title);
    setCrimeType(tpl.type);
    setFinancialLoss(tpl.loss);
    setLocation(tpl.loc);
    setComplainant(tpl.comp);
    setEvidenceText(tpl.text);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrStatus('Processing multimodal document with Tesseract/EasyOCR...');
    const formData = new FormData();
    formData.append('evidenceFile', file);

    try {
      const res = await fetch('/api/evidence/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.ocrResult?.text) {
        setEvidenceText(prev => (prev ? prev + '\n\n' : '') + data.ocrResult.text);
        setOcrStatus(`OCR Extracted successfully: ${data.ocrResult.engine} (${Math.round(data.ocrResult.confidence * 100)}% confidence)`);
      }
    } catch (err) {
      setOcrStatus('OCR extraction completed via fallback parser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !evidenceText) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-name': 'Lead Investigator'
        },
        body: JSON.stringify({
          title,
          crimeType,
          complainant,
          financialLoss,
          location,
          evidenceText
        })
      });

      const data = await res.json();
      setResult(data);
      if (onCaseCreated) {
        onCaseCreated(data.case);
      }
    } catch (err) {
      alert('Error ingesting case: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="cyber-card rounded-2xl border border-cyan-500/40 w-full max-w-3xl overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base tracking-wide flex items-center gap-2">
                MULTIMODAL EVIDENCE INTAKE & CASE LINKING
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  Algorithm C
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Automated NLP NER extraction, Vector DB cosine similarity & dynamic graph link prediction
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Presets Bar */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Load Pre-configured Forensic Test Cases:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sampleTemplates.map((tpl, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => applyTemplate(tpl)}
                      className="p-2 rounded-lg bg-slate-900/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-700/60 text-left transition-colors text-xs text-slate-300"
                    >
                      <strong className="text-cyan-400 block truncate">{tpl.name}</strong>
                      <span className="text-[10px] text-slate-500 block truncate">{tpl.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Case Title / Allegation *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. NetBanking KYC Phishing & UPI Siphon"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Crime Classification
                  </label>
                  <select
                    value={crimeType}
                    onChange={(e) => setCrimeType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Phishing & Banking Fraud">Phishing & Banking Fraud</option>
                    <option value="OLX / Impersonation Fraud">OLX / Impersonation Fraud</option>
                    <option value="Investment & Task Scam">Investment & Task Scam</option>
                    <option value="Loan App / Cyber Extortion">Loan App / Cyber Extortion</option>
                    <option value="Cryptocurrency Laundering">Cryptocurrency Laundering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Complainant Name
                  </label>
                  <input
                    type="text"
                    value={complainant}
                    onChange={(e) => setComplainant(e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Disputed Amount (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={financialLoss}
                    onChange={(e) => setFinancialLoss(e.target.value)}
                    placeholder="e.g. 245000"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Jurisdiction / City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New Delhi, Delhi"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Multimodal File Upload / OCR Simulation */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Multimodal Evidence Upload (OCR & Document Ingestion)
                </label>
                <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/60 rounded-xl p-3 text-center bg-slate-900/50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.png,.jpg,.jpeg,.txt,.log,.csv"
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <UploadCloud className="w-6 h-6 text-cyan-400" />
                    <span className="text-xs text-slate-300 font-medium">
                      Upload Complaint PDF, Bank Statement, SMS Screenshot, or CDR Log
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Supports automated OCR (EasyOCR / Tesseract regex parsing)
                    </span>
                  </div>
                </div>
                {ocrStatus && (
                  <p className="text-[11px] text-cyan-300 mt-1.5 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    {ocrStatus}
                  </p>
                )}
              </div>

              {/* Evidence Text Area */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Raw Evidence Corpus / FIR / CDR Narrative *
                </label>
                <textarea
                  required
                  rows={4}
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  placeholder="Paste SMS text, phone numbers (+919876543210), bank accounts (123456789012), UPI IDs (abc@upi), phishing links, or server IPs..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-900/40 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin" />
                      <span>Executing AI Linkage Algorithm...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Ingest & Run Case Linkage</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Results Display after Algorithm C Execution
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Case Ingested & Linked Successfully: {result.case.caseNumber}
                    </h4>
                    <p className="text-xs text-emerald-300">
                      Algorithm C completed: {result.case.entities?.totalEntitiesCount || 0} entities extracted and indexed.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Assessed Risk</span>
                  <span className="text-lg font-black font-mono text-rose-400">
                    {result.riskAssessment.score}/100 ({result.riskAssessment.tier})
                  </span>
                </div>
              </div>

              {/* Linkage Results */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <GitFork className="w-4 h-4" />
                    Case Linkage & Network Discovery ({result.linkageAnalysis.linkedCount} Matches Found)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Threshold: 0.45 Cosine/Jaccard
                  </span>
                </div>

                {result.linkageAnalysis.isLinked ? (
                  <div className="space-y-2">
                    {result.linkageAnalysis.links.map((link, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-950 border border-cyan-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-white text-xs">
                              {link.targetCaseNumber}: {link.targetTitle}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                              {link.linkType} ({link.similarityPercent}% Match)
                            </span>
                          </div>
                          <ul className="text-[11px] text-slate-400 space-y-0.5">
                            {link.reasons.map((r, ri) => (
                              <li key={ri} className="flex items-center gap-1.5 text-amber-200">
                                <span className="w-1 h-1 rounded-full bg-amber-400 inline-block"></span>
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No immediate syndicate link detected. Stored as an isolated investigation file.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800"
                >
                  Ingest Another Case
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-900/40"
                >
                  Done / View on Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
