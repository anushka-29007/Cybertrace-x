import React, { useState, useEffect, useRef } from 'react';
import { Network, ZoomIn, ZoomOut, RotateCcw, Filter, Info, Shield, ArrowUpRight, Search, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function KnowledgeGraph({ onSelectCase, activeCaseId = null, piiMasked = false }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dragging support for canvas and individual nodes
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState(null);

  // Default coordinate layout matching Poster Section 8 & 9
  const defaultNodes = [
    // Core Syndicate Hubs (Poster Section 8)
    { id: 'phone-9876', unmaskedLabel: '+91-9876543210', maskedLabel: '9876XXXXX', type: 'phone', x: 260, y: 150, risk: 'Critical', desc: 'Calling SIM used for phishing SMS & WhatsApp lure', casesLinked: ['Case #104', 'Case #117', 'Case #135'] },
    { id: 'bank-1234', unmaskedLabel: 'A/C 123456789012', maskedLabel: 'A/C 1234XXXX', type: 'bank', x: 420, y: 190, risk: 'Critical', desc: 'Primary Mule Bank A/C (State Bank branch) receiving siphoned funds', casesLinked: ['Case #104', 'Case #117', 'Case #126', 'Case #142'] },
    { id: 'upi-abc', unmaskedLabel: 'abc@upi', maskedLabel: 'abc@***', type: 'upi', x: 580, y: 150, risk: 'Critical', desc: 'Central Syndicate UPI VPA receiver on NPCI gateway', casesLinked: ['Case #104', 'Case #117', 'Case #158'] },

    // Primary Connected Cases (Poster Section 8: Case #104, #117, #126)
    { id: 'case-104', unmaskedLabel: 'Case #104', maskedLabel: 'Case #104', type: 'case', x: 260, y: 290, riskScore: 88, desc: 'NetBanking KYC Expiry Phishing (Loss: ₹2,45,000)', title: 'NetBanking KYC Scam', casesLinked: ['Case #117', 'Case #126'] },
    { id: 'case-117', unmaskedLabel: 'Case #117', maskedLabel: 'Case #117', type: 'case', x: 580, y: 290, riskScore: 84, desc: 'OLX Defense QR Code Scam (Loss: ₹1,15,000)', title: 'UPI QR Scam', casesLinked: ['Case #104', 'Case #126'] },
    { id: 'case-126', unmaskedLabel: 'Case #126', maskedLabel: 'Case #126', type: 'case', x: 420, y: 350, riskScore: 92, desc: 'Telegram Task Investment Fraud (Loss: ₹4,80,000)', title: 'Telegram Investment Fraud', casesLinked: ['Case #104', 'Case #117', 'Case #142'] },

    // Infrastructure & Layering Nodes
    { id: 'ip-185', unmaskedLabel: '185.220.101.5', maskedLabel: '185.220.101.x', type: 'ip', x: 120, y: 330, risk: 'High', desc: 'Reverse Proxy & TOR Exit Relay Hosting Phishing Clones', casesLinked: ['Case #104', 'Case #126'] },
    { id: 'dom-sbi', unmaskedLabel: 'sbi-kyc-verify-portal.in', maskedLabel: 'sbi-kyc-***.in', type: 'domain', x: 120, y: 180, risk: 'High', desc: 'Fraudulent bank credential harvesting domain', casesLinked: ['Case #104'] },
    { id: 'crypto-0x', unmaskedLabel: '0x71C8...49b', maskedLabel: '0x71C8***49b', type: 'crypto', x: 420, y: 450, risk: 'Critical', desc: 'USDT Hawala Laundering Contract', casesLinked: ['Case #126', 'Case #142'] },
    { id: 'case-135', unmaskedLabel: 'Case #135', maskedLabel: 'Case #135', type: 'case', x: 680, y: 390, riskScore: 79, desc: 'Instant Loan App Harassment (Loss: ₹85,000)', title: 'Loan Extortion', casesLinked: ['Case #104'] },
    { id: 'case-158', unmaskedLabel: 'Case #158', maskedLabel: 'Case #158', type: 'case', x: 170, y: 70, riskScore: 68, desc: 'Electricity Bill Arrears Scam (Loss: ₹72,000)', title: 'Utility Bill Phishing', casesLinked: ['Case #104'] }
  ];

  const [nodes, setNodes] = useState(defaultNodes);

  // Links corresponding to Direct and Indirect links in Poster Section 8
  const links = [
    // Case #104 Connections
    { source: 'case-104', target: 'phone-9876', type: 'direct', label: 'DIRECT CONTACT' },
    { source: 'case-104', target: 'bank-1234', type: 'direct', label: 'FUNDS SIPHONED' },
    { source: 'case-104', target: 'upi-abc', type: 'direct', label: 'UPI P2A ROUTE' },
    { source: 'case-104', target: 'ip-185', type: 'indirect', label: 'PROXY RELAY' },
    { source: 'case-104', target: 'dom-sbi', type: 'direct', label: 'PHISH HOST' },

    // Case #117 Connections
    { source: 'case-117', target: 'phone-9876', type: 'direct', label: 'CALLER SIM' },
    { source: 'case-117', target: 'bank-1234', type: 'direct', label: 'BENEFICIARY A/C' },
    { source: 'case-117', target: 'upi-abc', type: 'direct', label: 'QR PAYMENT' },

    // Case #126 Connections
    { source: 'case-126', target: 'bank-1234', type: 'direct', label: 'VIP DEPOSIT' },
    { source: 'case-126', target: 'ip-185', type: 'direct', label: 'PORTAL HOST' },
    { source: 'case-126', target: 'crypto-0x', type: 'indirect', label: 'USDT HOP' },

    // Inter-entity Links from Poster diagram
    { source: 'phone-9876', target: 'bank-1234', type: 'indirect', label: 'KYC REGISTRATION' },
    { source: 'bank-1234', target: 'upi-abc', type: 'direct', label: 'SETTLEMENT A/C' },

    // Auxiliary links
    { source: 'case-135', target: 'phone-9876', type: 'direct', label: 'EXTORTION CALL' },
    { source: 'case-158', target: 'upi-abc', type: 'direct', label: 'FAKE BILL PAYMENT' }
  ];

  // Helper colors
  const getNodeColor = (type, riskScore) => {
    switch (type) {
      case 'case':
        return riskScore >= 85 ? '#ef4444' : riskScore >= 70 ? '#f97316' : '#eab308';
      case 'phone':
        return '#06b6d4'; // Cyan
      case 'bank':
        return '#f59e0b'; // Amber / Gold
      case 'upi':
        return '#10b981'; // Emerald
      case 'ip':
        return '#8b5cf6'; // Purple
      case 'domain':
        return '#ec4899'; // Pink
      case 'crypto':
        return '#6366f1'; // Indigo
      default:
        return '#94a3b8';
    }
  };

  // Node Dragging Handlers
  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
  };

  const handleSvgMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.id === 'graph-bg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (draggedNodeId) {
      const svg = document.getElementById('graph-svg');
      if (svg) {
        const rect = svg.getBoundingClientRect();
        // Convert screen coordinates to SVG viewBox coordinates
        const x = ((e.clientX - rect.left - pan.x) / zoomLevel) * (800 / rect.width);
        const y = ((e.clientY - rect.top - pan.y) / zoomLevel) * (500 / rect.height);

        setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: Math.round(x), y: Math.round(y) } : n));
      }
    } else if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
    setSearchQuery('');
    setNodes(defaultNodes);
  };

  // Filtered nodes
  const filteredNodes = nodes.filter(n => {
    const label = piiMasked ? n.maskedLabel : n.unmaskedLabel;
    const matchesSearch = !searchQuery || 
      label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    if (filterType === 'cases') return n.type === 'case';
    if (filterType === 'financial') return n.type === 'bank' || n.type === 'upi' || n.type === 'crypto';
    if (filterType === 'telecom') return n.type === 'phone' || n.type === 'ip' || n.type === 'domain';
    return true;
  });

  return (
    <div className="cyber-card rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex flex-col h-[560px]">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950/90 border border-cyan-700/60 text-cyan-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              CASE LINKAGE & NETWORK DISCOVERY GRAPH
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono">
                Interactive Force Graph
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Direct & indirect multi-victim links • Drag nodes to organize • Click to inspect entity dossier
            </p>
          </div>
        </div>

        {/* Graph Controls & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Node Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter node (e.g. 104, bank, upi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48"
            />
          </div>

          {/* Filter options */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-xs">
            {['all', 'cases', 'financial', 'telecom'].map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-all ${
                  filterType === f ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.0))}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Reset Graph Layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Graph Area */}
      <div 
        className="flex-1 relative bg-[#070d18] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-900"
        onMouseDown={handleSvgMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg
          id="graph-svg"
          className="w-full h-full select-none"
          viewBox="0 0 800 500"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="graphGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 41, 59, 0.4)" strokeWidth="0.8" />
            </pattern>
          </defs>

          <rect id="graph-bg" width="100%" height="100%" fill="url(#graphGrid)" />

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoomLevel})`}>
            {/* Render Links */}
            {links.map((link, idx) => {
              const srcNode = nodes.find(n => n.id === link.source);
              const tgtNode = nodes.find(n => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              const isDirect = link.type === 'direct';
              const isHighlighted = selectedNode && (selectedNode.id === srcNode.id || selectedNode.id === tgtNode.id);

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={
                      isHighlighted 
                        ? '#38bdf8' 
                        : isDirect 
                        ? 'rgba(56, 189, 248, 0.75)' 
                        : 'rgba(148, 163, 184, 0.45)'
                    }
                    strokeWidth={isHighlighted ? 3 : isDirect ? 2.2 : 1.5}
                    strokeDasharray={isDirect ? 'none' : '5,5'}
                  />
                  {/* Text Badge on Link */}
                  <rect
                    x={(srcNode.x + tgtNode.x) / 2 - 28}
                    y={(srcNode.y + tgtNode.y) / 2 - 8}
                    width="56"
                    height="12"
                    rx="3"
                    fill="#080f1d"
                    stroke={isDirect ? 'rgba(56, 189, 248, 0.4)' : 'rgba(148, 163, 184, 0.3)'}
                    strokeWidth="0.5"
                    className="pointer-events-none"
                  />
                  <text
                    x={(srcNode.x + tgtNode.x) / 2}
                    y={(srcNode.y + tgtNode.y) / 2}
                    fill={isDirect ? '#38bdf8' : '#94a3b8'}
                    fontSize="7"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none pointer-events-none"
                  >
                    {link.label}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {filteredNodes.map(node => {
              const isSelected = selectedNode && selectedNode.id === node.id;
              const color = getNodeColor(node.type, node.riskScore);
              const isCase = node.type === 'case';
              const currentLabel = piiMasked ? node.maskedLabel : node.unmaskedLabel;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                    if (isCase && onSelectCase) {
                      const caseId = node.id.replace('case-', '');
                      onSelectCase(caseId);
                    }
                  }}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  {/* Outer Pulsing Glow Ring if Selected */}
                  {isSelected && (
                    <circle
                      r={isCase ? 32 : 24}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Body */}
                  {isCase ? (
                    // Distinct Rounded Diamond / Hexagon for Cases
                    <rect
                      x="-22"
                      y="-22"
                      width="44"
                      height="44"
                      rx="10"
                      fill="#0d1627"
                      stroke={color}
                      strokeWidth={isSelected ? 3.5 : 2.5}
                      className="drop-shadow-xl"
                    />
                  ) : (
                    // Solid Circle Hub for Entities
                    <circle
                      r={node.type === 'bank' || node.type === 'phone' ? 20 : 16}
                      fill="#091220"
                      stroke={color}
                      strokeWidth={isSelected ? 3.5 : 2.5}
                      className="drop-shadow-lg"
                    />
                  )}

                  {/* Inner Node Icon / Identifier */}
                  <text
                    y="4"
                    fill="#ffffff"
                    fontSize={isCase ? "11" : "9"}
                    fontWeight="black"
                    textAnchor="middle"
                    className="select-none pointer-events-none font-mono"
                  >
                    {isCase ? node.id.replace('case-', '#') : node.type.toUpperCase().slice(0, 4)}
                  </text>

                  {/* Node Label Below */}
                  <text
                    y={isCase ? 32 : 28}
                    fill={isSelected ? '#38bdf8' : '#ffffff'}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="select-none pointer-events-none drop-shadow-md font-sans"
                  >
                    {currentLabel}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend Box directly matching Poster Section 8 & 9 */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs space-y-1.5 shadow-2xl select-none">
          <div className="font-bold text-slate-200 uppercase tracking-wider text-[10px] mb-1 flex items-center justify-between gap-2">
            <span>Graph Legend & Relationship Types</span>
            <span className="text-[9px] text-cyan-400 font-mono">
              {piiMasked ? 'PII MASKED' : 'UNMASKED'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-1 bg-sky-400 inline-block rounded-full"></span>
              <span className="text-slate-200 font-semibold text-[11px]">Direct Link (Mule/SIM match)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-1 border-t-2 border-dashed border-slate-400 inline-block"></span>
              <span className="text-slate-300 text-[11px]">Indirect Link (IP/Subnet)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1.5 border-t border-slate-800 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>Phone SIM</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>Bank A/C</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>UPI ID</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>Case File</span>
          </div>
        </div>

        {/* Selected Node Floating Dossier Card */}
        {selectedNode && (
          <div className="absolute top-3 right-3 w-72 bg-slate-950/95 backdrop-blur-md border border-cyan-500/50 rounded-2xl p-4 shadow-2xl text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-700">
                {selectedNode.type} Entity
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <h4 className="font-bold text-white text-sm mb-1 font-mono">
              {piiMasked ? selectedNode.maskedLabel : selectedNode.unmaskedLabel}
            </h4>
            <p className="text-slate-300 text-[11px] mb-3 leading-relaxed">
              {selectedNode.desc}
            </p>

            {/* Connected Cases badges */}
            {selectedNode.casesLinked && (
              <div className="mb-3">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Correlated Cases ({selectedNode.casesLinked.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.casesLinked.map((c, ci) => (
                    <span key={ci} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedNode.riskScore && (
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800 mb-3">
                <span className="text-slate-400 text-[10px]">AI Priority Risk Score</span>
                <span className="font-mono font-bold text-rose-400">{selectedNode.riskScore}/100</span>
              </div>
            )}

            {selectedNode.type === 'case' && onSelectCase && (
              <button
                onClick={() => onSelectCase(selectedNode.id.replace('case-', ''))}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-md shadow-cyan-900/30"
              >
                <span>Open Full Case Dossier</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
