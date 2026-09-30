import React, { useState } from 'react';
import { 
  X, Sparkles, Send, CheckCircle2, MessageSquare, 
  AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { Settings, Quote } from '../types/index';
import { createWhatsAppUrl } from '../utils/helpers';
import { safeApiFetch } from '../utils/api';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [service, setService] = useState('Custom Digital Solution');
  const [scopeDescription, setScopeDescription] = useState('');
  const [targetBudget, setTargetBudget] = useState('₹15,000 - ₹30,000');
  const [targetDeadline, setTargetDeadline] = useState('10 - 15 Days');

  const [loading, setLoading] = useState(false);
  const [createdQuote, setCreatedQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp || !scopeDescription) {
      setError('Please provide your Name, WhatsApp Number, and Scope description.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await safeApiFetch<Quote>('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          whatsapp,
          service,
          scopeDescription,
          targetBudget,
          targetDeadline
        })
      });

      if (!result.ok || !result.data) {
        throw new Error(result.error || 'Failed to submit quote request.');
      }

      setCreatedQuote(result.data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const whatsAppQuoteUrl = createdQuote
    ? createWhatsAppUrl(
        settings.whatsappNumber,
        `Hello Suraj Maurya! I have submitted a Custom Quote Request on your website.
Quote ID: ${createdQuote.id}
Client: ${createdQuote.name}
Service: ${createdQuote.service}
Budget: ${createdQuote.targetBudget}
Please review my scope and share a proposal.`
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f172a] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative text-left my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {createdQuote ? (
          <div className="text-center py-4 space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                Quote Request Registered!
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                Custom Proposal Initiated
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Suraj Maurya is reviewing your technical specifications to curate a milestone proposal.
              </p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/40 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">Your Quote Request ID</span>
              <span className="text-2xl font-black font-mono text-yellow-400">{createdQuote.id}</span>
            </div>

            <div className="space-y-2">
              <a
                href={whatsAppQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discuss Quote Details on WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                Bespoke Requirements
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>Request a Custom Quote</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Tell us about your custom requirements, integrations, or multi-platform vision.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ankit Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="ankit@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Project Category
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Custom Digital Solution">Custom Web Solution</option>
                    <option value="Custom E-Commerce Portal">Custom E-Commerce Portal</option>
                    <option value="Online Course LMS Platform">Online Course LMS Platform</option>
                    <option value="Sales Funnel & Automation">Sales Funnel & Automation</option>
                    <option value="Branding & Design Suite">Complete Branding Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Target Budget
                  </label>
                  <select
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
                    <option value="₹20,000 - ₹40,000">₹20,000 - ₹40,000</option>
                    <option value="₹40,000 - ₹75,000">₹40,000 - ₹75,000</option>
                    <option value="₹75,000+">₹75,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Scope of Work & Features Needed *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the modules, user journeys, specific third-party APIs or automations required..."
                  value={scopeDescription}
                  onChange={(e) => setScopeDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-yellow-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="animate-pulse">Generating Quote ID...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Proposal & Generate Quote ID</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
