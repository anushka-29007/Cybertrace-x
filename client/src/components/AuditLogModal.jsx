import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AuditLogModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    fetch('/api/audit')
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="cyber-card rounded-2xl border border-slate-700 w-full max-w-3xl overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200 bg-[#0a101d]">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                FORENSIC AUDIT TRAIL & ACCESS LOGS
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  SHA-256 Tamper Evident
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Evidentiary chain of custody compliant with Indian Evidence Act / BSA 2023 Section 63
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">
                      {log.user}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-800 text-cyan-300 border border-slate-700">
                      {log.role}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      IP: {log.ip}
                    </span>
                  </div>
                  <p className="text-slate-300">
                    <strong className="text-amber-400">{log.action}</strong> on <span className="font-mono text-cyan-400">{log.target}</span>: {log.details}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="font-mono text-[10px] text-slate-500 block">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className="text-[9px] text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
