import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, BookOpen, ShieldCheck, CheckCircle, FileText, ChevronRight, User } from 'lucide-react';

export default function AIAssistantModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `### 🛡️ CyberTrace-X AI Investigator Assistant (RAG)

Welcome, Officer. I am connected to the **CyberTrace-X Knowledge Graph**, Vector Database, and Indian Cyber Law Corpus (IT Act 2000 & BNS 2023).

**I can assist you with:**
1. Cross-case linkage analysis (e.g. Case #104, #117, and #126 syndicate ties)
2. Money mule trail & beneficiary account tracing
3. Chronological attack timeline reconstruction
4. Drafting legal notices under Section 94 & 106 BNSS (Old 91 & 102 CrPC)
5. Framing charges under IT Act Sections 43, 66C, 66D and BNS Section 318(4)

What would you like to investigate?`,
      citations: ['Knowledge Graph', 'Vector DB', 'IT Act 2000 & BNS 2023'],
      suggestedActions: [
        'Analyze link between Case #104 and Case #126',
        'Draft Section 106 BNSS Bank Freeze Notice',
        'Show attack timeline for active phishing syndicate',
        'Trace money trail for UPI ID abc@upi'
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg = {
      sender: 'user',
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-name': 'Lead Investigator'
        },
        body: JSON.stringify({ prompt: q })
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: data.answer,
          citations: data.citations || [],
          suggestedActions: data.suggestedActions || []
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Encountered error retrieving RAG knowledge: ' + err.message
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="cyber-card rounded-2xl border border-blue-500/40 w-full max-w-3xl overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200 bg-[#090f1d] flex flex-col h-[700px]">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                AI INVESTIGATOR ASSISTANT (RAG)
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  Llama / Mistral / Forensics RAG
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Explainable intelligence with evidence citations, legal statutes & action recommendations
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

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="p-2 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/80 self-start flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}>
                  {/* Message Content */}
                  <div className="prose prose-invert prose-xs max-w-none space-y-2 whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Evidence Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Forensic Evidence Citations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((c, ci) => (
                          <span
                            key={ci}
                            className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 text-[10px] font-mono"
                          >
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Next Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                        Recommended Next Steps:
                      </span>
                      <div className="space-y-1">
                        {msg.suggestedActions.map((act, ai) => (
                          <button
                            key={ai}
                            onClick={() => handleSend(act)}
                            className="w-full text-left p-1.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-between text-[11px] transition-colors"
                          >
                            <span>👉 {act}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 self-start flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3">
              <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 self-start flex-shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400">
                Correlating case repository and querying statutory legal embeddings...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask AI Investigator (e.g., 'What connects Case #104 and #126?' or 'Draft Section 106 BNSS notice')..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-md shadow-blue-900/40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
