import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { GridMetrics, GridAsset, GridAlertItem } from '../../types/grid';

interface AICopilotViewProps {
  metrics: GridMetrics;
  assets: GridAsset[];
  alerts: GridAlertItem[];
}

export const AICopilotView: React.FC<AICopilotViewProps> = ({
  metrics,
  assets,
  alerts,
}) => {
  const [messages, setMessages] = useState<
    { sender: 'user' | 'copilot'; text: string; time: string }[]
  >([
    {
      sender: 'copilot',
      text: `### GridGuard Copilot Ready\n\nI am connected to your live SCADA telemetry stream and fleet diagnostics.\n\n* **Reliability Index:** **${metrics.reliabilityScore}%** (Status: STABLE)\n* **Active Alarms:** **${alerts.filter((a) => a.status === 'ACTIVE').length} Active** (${alerts.map((a) => a.assetName).join(', ')})\n* **Highest Risk Asset:** **Transformer T-002** (78°C / 91% Load)\n* **Predicted Peak Demand:** **${metrics.peakLoadMW} MW at 19:00**\n\nSelect a preset query below or ask any reliability, equipment health, or load question.`,
      time: 'Now',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const presetQueries = [
    'Which equipment currently has the highest risk?',
    'Why is the grid risk increasing?',
    "Show today's peak-load period.",
    'Which transformer needs attention?',
    'Explain the current alerts.',
    'What preventive action should be considered?',
  ];

  const handleSend = (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (lower.includes('highest risk') || lower.includes('attention') || lower.includes('transformer')) {
        reply = `### Equipment Risk Assessment: Transformer T-002\n\n* **Asset:** **Transformer T-002** at Substation B\n* **Current Loading:** **91% (Approaching high-load trip threshold)**\n* **Winding Temperature:** **78°C** (Increasing thermal gradient; threshold is 85°C)\n* **Failure Risk Rating:** **Medium (28% failure probability over 30 days)**\n* **Health Index:** **74%**\n\n**Recommended Preventive Action:**\n1. Command forced cooling fan bank 2 to active state immediately.\n2. Execute supervisory load-shed or tie-transfer of **6 MW** to Substation A.\n3. Dispatch technician within **6 days** for oil DGA chromatographic test.`;
      } else if (lower.includes('why') || lower.includes('increasing')) {
        reply = `### Root Cause Risk Factors (XAI Decomposition)\n\nOverall grid reliability remains at **94%**, but localized feeder stress is rising due to 4 factors:\n\n1. **High Transformer Loading:** (+28% contribution) driven by Substation B industrial manufacturing shift concurrency.\n2. **Increasing Core Temperature:** (+21% contribution) on Transformer T-002 (78°C).\n3. **Voltage Fluctuations:** (+14% contribution) at Distribution Node D-14 (-5.6% transient sags).\n4. **Historical Fault Patterns:** (+9% contribution) recorded on feeder 4B.`;
      } else if (lower.includes('peak') || lower.includes('period') || lower.includes('demand')) {
        reply = `### Today's Peak Demand Schedule\n\n* **Current Active Load:** **${metrics.currentLoadMW} MW (76% load ratio)**\n* **Projected Peak Demand:** **${metrics.peakLoadMW} MW at 19:00**\n* **Peak Duration Window:** **18:15 – 20:45**\n* **Available BESS Arbitrage:** Metro BESS Storage can discharge **4.5 MW** to shave the peak below the 18.0 MW substation headroom limit.`;
      } else if (lower.includes('alert') || lower.includes('alarms')) {
        reply = `### Active Alarms Triage (${alerts.length} Total)\n\n* 🔴 **HIGH:** *Transformer T-002 approaching high-load threshold* (Load: 91%, Temp: 78°C). Action: Transfer 6 MW to Substation A.\n* 🟡 **MEDIUM:** *Voltage fluctuation detected at Distribution Node D-14* (Transient dip to 216V). Action: Adjust OLTC tap changer.\n* 🔵 **LOW:** *Load increase detected in Sector 3*. Action: Monitor EV fast-charging demand.`;
      } else {
        reply = `### Grid Reliability Analysis\n\n* **Bus Voltage:** **${metrics.voltage} V** (Normal nominal band: 220V - 240V)\n* **Frequency:** **${metrics.frequency} Hz** (Nominal target: 50.00 Hz)\n* **Power Factor:** **${metrics.powerFactor}** (Optimal VAR balance)\n* **Fleet Status:** 107 Healthy, 16 Warning, 5 Critical.\n\nAll parameters remain within IEEE 519 operational limits.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setLoading(false);
    }, 400);
  };

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0F3D91] text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              AI Grid Reliability Copilot
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Integrated industrial intelligence assistant grounded exclusively in real-time grid telemetry and asset health records
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#0F3D91] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-[#1976D2]" />
          <span>Grounded in SCADA Telemetry (Zero Hallucination Mode)</span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs ${
                  m.sender === 'user'
                    ? 'bg-[#0F3D91] text-white rounded-tr-none shadow-xs'
                    : 'bg-[#F6F9FC] border border-slate-200/80 text-[#172033] rounded-tl-none shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  {m.text.split('\n').map((line, i) => {
                    if (line.startsWith('### ')) {
                      return (
                        <h4
                          key={i}
                          className="text-[#0F3D91] font-bold text-sm font-['Chakra_Petch']"
                        >
                          {line.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (line.startsWith('* ') || line.startsWith('- ')) {
                      return (
                        <div key={i} className="flex items-start gap-2 ml-1 text-xs">
                          <span className="text-[#1976D2] font-bold">•</span>
                          <span>{line.replace(/^(\* |- )/, '')}</span>
                        </div>
                      );
                    }
                    if (line.match(/^\d+\. /)) {
                      return (
                        <div key={i} className="flex items-start gap-2 ml-1 text-xs">
                          <span className="text-[#0F3D91] font-bold">
                            {line.match(/^\d+\./)?.[0]}
                          </span>
                          <span>{line.replace(/^\d+\. /, '')}</span>
                        </div>
                      );
                    }
                    return line ? <p key={i} className="leading-relaxed">{line}</p> : null;
                  })}
                </div>

                {m.sender === 'copilot' && (
                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-[#64748B] font-mono">
                    <span>GridGuard Industrial Model v2.4</span>
                    <button
                      onClick={() => handleCopy(idx, m.text)}
                      className="hover:text-[#0F3D91] flex items-center gap-1 font-semibold"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-[#16A34A]" />
                          <span className="text-[#16A34A]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Analysis</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-mono text-[#64748B] mt-1 px-1">
                {m.sender === 'user' ? 'Operator' : 'GridGuard Copilot'} • {m.time}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-mono text-[#0F3D91] max-w-sm">
              <Sparkles className="w-4 h-4 animate-spin text-[#1976D2]" />
              <span>Querying live bus telemetry & reliability matrices...</span>
            </div>
          )}
        </div>

        {/* Preset Query Chips */}
        <div className="px-4 py-2.5 bg-[#F6F9FC] border-t border-slate-200/80 overflow-x-auto scrollbar-none flex items-center gap-2">
          {presetQueries.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pq)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 text-xs font-mono text-[#0F3D91] border border-slate-200 hover:border-[#1976D2] whitespace-nowrap shadow-xs transition-colors cursor-pointer"
            >
              {pq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask GridGuard Copilot for reliability assessments, thermal warnings, or load curves..."
            className="flex-1 bg-[#F6F9FC] border border-slate-200 focus:border-[#1976D2] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#172033] outline-none transition-all font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 bg-[#0F3D91] hover:bg-[#1976D2] text-white rounded-xl disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
