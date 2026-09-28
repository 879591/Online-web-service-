import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, MessageSquare } from 'lucide-react';
import { FAQItem, Settings } from '../types/index';
import { createWhatsAppUrl } from '../utils/helpers';

interface FAQSectionProps {
  faqs: FAQItem[];
  settings: Settings;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, settings }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const whatsAppAskUrl = createWhatsAppUrl(
    settings.whatsappNumber,
    `Hello Suraj, I have a quick question regarding your digital services:`
  );

  return (
    <section id="faq" className="py-20 md:py-28 relative bg-[#090d1a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
            Clear Answers
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-yellow-400">Questions</span>
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Got queries about order placement, direct payments, turnaround time, or revisions? Find all answers below.
          </p>

          {/* Search Input */}
          <div className="mt-6 relative max-w-md mx-auto">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions (e.g. payment, time, revisions)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="mt-12 space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-[#0f172a] border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : 'bg-[#0f172a]/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-white text-sm sm:text-base flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-lg bg-slate-900 text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching questions found for "{searchQuery}".
            </div>
          )}
        </div>

        {/* WhatsApp Question Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0f172a] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-white text-sm">Have a question not listed here?</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Talk directly with Suraj Maurya on WhatsApp — quick answers within minutes.
            </p>
          </div>
          <a
            href={whatsAppAskUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 shrink-0 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
