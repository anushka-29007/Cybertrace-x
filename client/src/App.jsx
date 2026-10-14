import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricCards from './components/MetricCards';
import KnowledgeGraph from './components/KnowledgeGraph';
import AttackTimeline from './components/AttackTimeline';
import RiskDistributionChart from './components/RiskDistributionChart';
import TopEntitiesTable from './components/TopEntitiesTable';
import GeospatialMap from './components/GeospatialMap';
import AlertsFeed from './components/AlertsFeed';
import CaseDirectory from './components/CaseDirectory';
import NewCaseModal from './components/NewCaseModal';
import CaseDetailModal from './components/CaseDetailModal';
import AIAssistantModal from './components/AIAssistantModal';
import AuditLogModal from './components/AuditLogModal';
import { ShieldCheck, Award, Zap, Lock, Sparkles, Scale, Binary, UserCheck, Eye, EyeOff } from 'lucide-react';

export default function App() {
  const [metrics, setMetrics] = useState({
    totalCases: 1248,
    linkedCases: 862,
    highRiskCases: 187,
    entitiesExtracted: 15732,
    avgRiskScore: 78
  });
  const [cases, setCases] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [piiMasked, setPiiMasked] = useState(true); // Default to masked for safe display
  const [userRole, setUserRole] = useState('Lead Investigator');
  const [selectedTier, setSelectedTier] = useState('all');

  const fetchDashboardData = () => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.metrics) setMetrics(data.metrics);
        if (data.recentAlerts) setAlerts(data.recentAlerts);
      })
      .catch(console.error);

    fetch('/api/cases')
      .then(res => res.json())
      .then(data => {
        if (data.cases) setCases(data.cases);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCaseCreated = (newCase) => {
    fetchDashboardData();
    if (newCase?.id) {
      setSelectedCaseId(newCase.id);
    }
  };

  // Role Description Config
  const getRoleBanner = () => {
    switch (userRole) {
      case 'Senior Forensics Analyst':
        return {
          icon: Binary,
          color: 'bg-purple-950/40 border-purple-800/80 text-purple-200',
          title: '🔬 DEEP FORENSIC LAB MODE ACTIVE',
          description: 'High-sensitivity IOC extraction and TOR/Proxy telemetry correlation enabled. Graph node centrality reveals multi-victim syndicates.'
        };
      case 'Legal & Court Auditor':
        return {
          icon: Scale,
          color: 'bg-amber-950/40 border-amber-800/80 text-amber-200',
          title: '⚖️ JUDICIAL AUDIT MODE ACTIVE (READ-ONLY)',
          description: 'Strict evidentiary chain-of-custody locked (BSA 2023 Sec 63). Evidence ingestion locked. Automatic PII masking enforced for court presentation.'
        };
      default:
        return {
          icon: UserCheck,
          color: 'bg-cyan-950/40 border-cyan-800/80 text-cyan-200',
          title: '⚡ OPERATIONAL DISPATCH MODE ACTIVE',
          description: 'Full authority to ingest multimodal evidence, execute Algorithm C case linking, issue Sec 106 BNSS bank freezes, and export police dossiers.'
        };
    }
  };

  const roleBanner = getRoleBanner();
  const BannerIcon = roleBanner.icon;

  return (
    <div className="min-h-screen bg-[#070b14] bg-grid-pattern text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onNewCase={() => setIsNewCaseOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        piiMasked={piiMasked}
        setPiiMasked={setPiiMasked}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-5 space-y-4">
        {/* Dynamic RBAC Role Banner showing exact permissions changing */}
        <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${roleBanner.color} transition-all no-print`}>
          <div className="flex items-center gap-2.5">
            <BannerIcon className="w-4 h-4 flex-shrink-0" />
            <div>
              <span className="font-bold tracking-wide mr-2">{roleBanner.title}:</span>
              <span className="opacity-90">{roleBanner.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[11px]">
            <span className="opacity-75">PII Status:</span>
            <span className={`px-2 py-0.5 rounded font-bold uppercase ${
              piiMasked ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {piiMasked ? 'Masked' : 'Unmasked'}
            </span>
          </div>
        </div>

        {/* Banner with Poster Vision & Category Code */}
        <div className="cyber-card rounded-2xl p-4 sm:p-5 border border-cyan-500/30 relative overflow-hidden bg-gradient-to-r from-[#0b1426] via-[#091224] to-[#0d1b33]">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Category Code: 5. Engineering and technology
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  AI Cybercrime Investigation Framework
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                CyberTrace-X: An AI-Powered Multimodal Cybercrime Investigation & Intelligence Framework
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Connect scattered cybercrime evidence, uncover hidden syndicate relationships, reconstruct automated attack chains, and empower investigators with explainable AI insights.
              </p>
            </div>

            {/* Strategic KPI Badges directly from Poster Section 11 */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-wrap">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-center shadow-md">
                <span className="text-[10px] text-slate-400 font-medium block">FASTER CASE LINKING</span>
                <span className="text-base font-black font-mono text-cyan-400">70% Reduction</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-center shadow-md">
                <span className="text-[10px] text-slate-400 font-medium block">LINKAGE ACCURACY</span>
                <span className="text-base font-black font-mono text-emerald-400">Up to 95%</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-center shadow-md">
                <span className="text-[10px] text-slate-400 font-medium block">INTERDICTION WINDOW</span>
                <span className="text-base font-black font-mono text-rose-400">Golden Hour</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 KPI Metric Cards (Poster Section 9 Preview) */}
        <MetricCards metrics={metrics} />

        {/* Primary Intelligence Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (8 cols): Graph, Attack Timeline, Case Directory */}
          <div className="lg:col-span-8 space-y-5">
            {/* Case Linkage Network Graph (Poster Section 6 & 8 & 9) */}
            <KnowledgeGraph
              activeCaseId={selectedCaseId}
              onSelectCase={(id) => setSelectedCaseId(id)}
              piiMasked={piiMasked}
            />

            {/* Attack Timeline Reconstruction (Poster Section 8 & 9) */}
            <AttackTimeline
              activeCaseNumber={selectedCaseId ? `Case #${selectedCaseId}` : 'Case #104 (Active Syndicate)'}
            />

            {/* Case Repository Directory Table */}
            <CaseDirectory
              cases={cases}
              onSelectCase={(id) => setSelectedCaseId(id)}
              piiMasked={piiMasked}
            />
          </div>

          {/* Right Column (4 cols): Risk Distribution, Top Entities, Geo Map, Alerts */}
          <div className="lg:col-span-4 space-y-5">
            {/* Risk Score Distribution Donut Chart (Poster Section 9) */}
            <RiskDistributionChart
              selectedTier={selectedTier}
              onSelectTier={(tier) => setSelectedTier(tier)}
            />

            {/* Top Entities Table (Poster Section 9) */}
            <TopEntitiesTable
              piiMasked={piiMasked}
              onInspectEntity={(ent) => console.log('Inspect entity', ent)}
            />

            {/* Geospatial Threat Map (Poster Section 9) with ZERO OVERLAP */}
            <GeospatialMap
              onSelectHotspot={(spot) => console.log('Selected hotspot', spot)}
            />

            {/* Real-time Alerts Feed (Poster Section 9) */}
            <AlertsFeed
              alerts={alerts}
              onAlertClick={(alt) => {
                if (alt.desc?.includes('104')) setSelectedCaseId('104');
                else if (alt.desc?.includes('126')) setSelectedCaseId('126');
                else if (alt.desc?.includes('117')) setSelectedCaseId('117');
              }}
            />
          </div>
        </div>

        {/* Poster Footer: Security & Impact Bar (Section 10 & 11) */}
        <div className="cyber-card rounded-xl p-3.5 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400 no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              SECURITY COMPLIANCE:
            </span>
            <span className="text-[11px] text-slate-300">
              RBAC (Role-Based Access) • Evidence Access Control • Audit Logs • Data Encryption (In Transit & At Rest)
            </span>
          </div>

          <div className="font-semibold text-slate-300 tracking-wide text-center md:text-right">
            <span className="text-cyan-400">AI for Smarter Investigations.</span>{' '}
            <span className="text-blue-400">Stronger Evidence.</span>{' '}
            <span className="text-emerald-400">Stronger Decisions.</span>{' '}
            <span className="text-amber-300">Safer India.</span>
          </div>
        </div>
      </main>

      {/* Modal Dialogs */}
      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        onCaseCreated={handleCaseCreated}
      />

      <CaseDetailModal
        caseId={selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
        piiMasked={piiMasked}
        userRole={userRole}
        onNavigateCase={(newId) => setSelectedCaseId(newId)}
      />

      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      <AuditLogModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
      />
    </div>
  );
}
