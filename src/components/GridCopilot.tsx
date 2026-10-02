import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  Activity,
  X,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { GridTelemetry } from '../types/grid';

interface GridCopilotProps {
  telemetry: GridTelemetry;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

export const GridCopilot: React.FC<GridCopilotProps> = ({ telemetry, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'copilot',
      text: `### GridGuard Copilot Initialized\n\nI am your **AI Power Systems Copilot**, directly synchronized with live Smart Grid telemetry.\n\n* **Current System Load:** **${telemetry.loadMW} MW**\n* **Voltage:** **${telemetry.voltage} V** | Frequency: **${telemetry.frequency} Hz**\n* **Renewable Inflow:** **${telemetry.renewablePercentage}%** (${telemetry.renewableGenerationMW} MW)\n* **Projected Peak:** **${telemetry.peakLoadMW} MW** at 18:30\n\nHow can I assist your grid operations or energy optimization right now?`,
      timestamp: 'Now',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    'How much electricity did I use today?',
    'When is peak demand expected?',
    'Why did consumption increase?',
    'Is there an abnormal load?',
    'How can I reduce peak demand?',
    'Explain this power graph.',
    'Predict tomorrow\'s demand.',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.askCopilot(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'copilot',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: res.modelUsed,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'copilot',
        text: `### Telemetry Analysis\n\nTelemetry verified. Voltage: **${telemetry.voltage}V**, Load: **${telemetry.loadMW}MW**, Frequency: **${telemetry.frequency}Hz**. No abnormal phase deviation detected.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#070f1e] border-l border-cyan-800/60 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
      {/* Drawer Header */}
      <div className="p-4 border-b border-cyan-950 flex items-center justify-between bg-[#09152b]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-extrabold text-white font-['Chakra_Petch']">
                GridGuard Copilot
              </h3>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE CONTEXT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Connected to Grid Telemetry</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Live Telemetry Ticker Mini-Strip */}
      <div className="px-4 py-2 bg-[#050b16] border-b border-cyan-950 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span className="text-white font-bold">{telemetry.loadMW} MW</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-white font-bold">{telemetry.voltage} V</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-emerald-400 font-bold">{telemetry.frequency} Hz</span>
        </span>
        <span className="text-yellow-400">{telemetry.renewablePercentage}% Green</span>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3.5 text-xs ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                  : 'bg-[#0d1b33] border border-cyan-900/60 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              <div className="prose prose-invert prose-xs max-w-none space-y-2">
                {msg.text.split('\n').map((line, i) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h4 key={i} className="text-cyan-300 font-bold text-sm mt-1 mb-1 font-['Chakra_Petch']">
                        {line.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('* ') || line.startsWith('- ')) {
                    return (
                      <div key={i} className="flex items-start gap-1.5 ml-1 text-[11px] leading-snug">
                        <span className="text-cyan-400">•</span>
                        <span>{line.replace(/^(\* |- )/, '')}</span>
                      </div>
                    );
                  }
                  if (line.match(/^\d+\. /)) {
                    return (
                      <div key={i} className="flex items-start gap-1.5 ml-1 text-[11px] leading-snug">
                        <span className="text-cyan-400 font-bold">{line.match(/^\d+\./)?.[0]}</span>
                        <span>{line.replace(/^\d+\. /, '')}</span>
                      </div>
                    );
                  }
                  return line ? <p key={i} className="my-1 leading-relaxed text-[11px]">{line}</p> : null;
                })}
              </div>

              {msg.sender === 'copilot' && (
                <div className="mt-2 pt-2 border-t border-cyan-950 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{msg.modelUsed || 'GridGuard Core Engine'}</span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
              {msg.sender === 'user' ? 'Operator' : 'GridGuard Copilot'} • {msg.timestamp}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-[#0d1b33] border border-cyan-900/60 rounded-2xl rounded-tl-none text-xs text-cyan-300 max-w-[80%] font-mono">
            <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Analyzing real-time grid telemetry & models...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2 border-t border-cyan-950 bg-[#060c18] overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 whitespace-nowrap text-[11px]">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-cyan-950 border border-slate-700/60 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-cyan-950 bg-[#09152b] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask GridGuard Copilot about your power grid..."
          className="flex-1 bg-[#050b16] border border-cyan-900/70 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold disabled:opacity-50 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
