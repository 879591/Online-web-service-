import React from 'react';
import { 
  FileText, Search, CreditCard, Code, CheckCircle, 
  ArrowRight, ShieldCheck, MessageSquare 
} from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenOrder: () => void;
  onOpenTracker: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onOpenOrder,
  onOpenTracker
}) => {
  const steps = [
    {
      step: '01',
      title: 'Submit Project Order',
      description: 'Fill our streamlined project form with your service, features, references, and deadline. Instant unique Order ID generate hota hai.',
      icon: <FileText className="w-5 h-5 text-cyan-400" />
    },
    {
      step: '02',
      title: 'Requirement Review',
      description: 'Suraj Maurya manually aapki requirements analyze karte hain aur WhatsApp / email par timeline & final scope confirm karte hain.',
      icon: <Search className="w-5 h-5 text-yellow-400" />
    },
    {
      step: '03',
      title: 'Direct Advance Payment',
      description: 'Official UPI ID ya Bank Account par agreed advance transfer karein. Order Tracker par UTR number enter karein for manual verification.',
      icon: <CreditCard className="w-5 h-5 text-emerald-400" />
    },
    {
      step: '04',
      title: 'Design & Code Sprints',
      description: 'Clean modern code & UI design begins. Aap 10-stage order tracking system mein live progress aur preview links dekh sakte hain.',
      icon: <Code className="w-5 h-5 text-indigo-400" />
    },
    {
      step: '05',
      title: 'Review, Revisions & Delivery',
      description: 'Aap review karte hain, requested revisions complete kiye jaate hain, aur final source code / live domain hand-over kiya jata hai.',
      icon: <CheckCircle className="w-5 h-5 text-teal-400" />
    }
  ];

  return (
    <section id="process" className="py-20 md:py-28 relative bg-[#090d1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
            Clear Workflow
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            How Your Project Gets <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-yellow-400">Delivered</span>
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Zero confusion, complete transparency from Day 1 to final launch.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0f172a]/80 border border-slate-800 p-5 flex flex-col justify-between hover:border-cyan-500/40 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-cyan-400 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>

                <h4 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
                <span>Step {idx + 1} of 5</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenOrder}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
          >
            <span>Start Step 1: Submit Your Order</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={onOpenTracker}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 hover:border-slate-600 flex items-center gap-2 cursor-pointer"
          >
            <span>Already Ordered? Track Project Progress</span>
          </button>
        </div>

      </div>
    </section>
  );
};
