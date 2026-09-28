import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { Settings } from '../types/index';
import { createWhatsAppUrl } from '../utils/helpers';

interface FloatingWhatsAppWidgetProps {
  settings: Settings;
  onOpenOrder: () => void;
}

export const FloatingWhatsAppWidget: React.FC<FloatingWhatsAppWidgetProps> = ({
  settings,
  onOpenOrder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleSend = () => {
    const text = customMsg.trim() || 'Hello Suraj Maurya! I want to discuss a new digital website project.';
    const url = createWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen ? (
        <div className="w-80 rounded-2xl bg-[#0f172a] border border-cyan-500/40 p-4 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-200 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono text-sm border border-emerald-500/30">
                  SM
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f172a] absolute bottom-0 right-0" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Suraj Maurya</h4>
                <p className="text-[10px] text-emerald-400">Online • Typically replies in &lt;15m</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-slate-300 space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] leading-relaxed">
              👋 Namaste! I'm Suraj Maurya. How can I assist you with your website, funnel, or online course platform today?
            </div>
          </div>

          <div className="space-y-2">
            <textarea
              rows={2}
              placeholder="Type your project query..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={handleSend}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Start WhatsApp Chat</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenOrder();
              }}
              className="w-full py-1.5 text-center text-[10px] font-semibold text-cyan-400 hover:underline"
            >
              Or Place an Order Directly on Website →
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-600/30 transition-all transform hover:scale-105 active:scale-95 border border-emerald-400/30 cursor-pointer group"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping absolute top-2 right-2" />
          <MessageSquare className="w-5 h-5 text-white" />
          <span className="hidden sm:inline">WhatsApp Suraj</span>
        </button>
      )}
    </div>
  );
};
