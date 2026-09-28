import React from 'react';
import { 
  Code2, CheckCircle2, MessageSquare, Sparkles, 
  Terminal, ShieldCheck, HeartHandshake, User 
} from 'lucide-react';
import { Settings } from '../types/index';
import { createWhatsAppUrl } from '../utils/helpers';

interface AboutSectionProps {
  settings: Settings;
  onOpenOrder: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  settings,
  onOpenOrder
}) => {
  const whatsAppDirectUrl = createWhatsAppUrl(
    settings.whatsappNumber,
    `Hello Suraj Maurya, I reviewed your profile on your website. I want to discuss a new project.`
  );

  return (
    <section id="about" className="py-20 md:py-28 relative bg-[#0a0f1d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Profile Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-cyan-500 via-blue-600 to-yellow-400 shadow-2xl">
              <div className="rounded-[22px] bg-[#0f172a] p-6 sm:p-8">
                
                {/* Profile Avatar Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px] shadow-lg">
                    <div className="w-full h-full bg-[#0a0f1d] rounded-[14px] flex items-center justify-center text-white font-extrabold text-2xl font-mono">
                      SM
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white">
                      Suraj Maurya
                    </h3>
                    <p className="text-xs text-cyan-400 font-medium">
                      Web Developer • Digital Creator • Freelancer
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      <span>Available for New Projects</span>
                    </div>
                  </div>
                </div>

                {/* Direct Philosophy Statement */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
                  <p>
                    "Main business owners, educators aur creators ke liye simple, clean aur high-converting websites design aur code karta hoon."
                  </p>
                  <p>
                    "Har project ko main personally supervise karta hoon — koi outsourcing nahi, koi hidden fees nahi, aur koi false claims nahi. Aapka vision aur mera technical execution milkar ek solid online asset banate hain."
                  </p>
                </div>

                {/* Skill Stack */}
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                    Core Specializations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Modern Web Development',
                      'High-Converting Landing Pages',
                      'Sales Funnels Architecture',
                      'LMS & Course Websites',
                      'UI/UX Design & Figma',
                      'Direct UPI & Bank Workflows',
                      'Responsive Mobile Design',
                      'Fast Load Optimization'
                    ].map((s) => (
                      <span
                        key={s}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Chat Button */}
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <a
                    href={whatsAppDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat Directly with Suraj</span>
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Values & Working Ethics */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
                Founder & Lead Engineer
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Built on <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-yellow-400">Integrity, Quality</span> & Precision
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                Online Website & Digital Services was established to bridge the gap between bloated agency pricing and low-quality template websites. We build clean, bespoke, lightning-fast digital solutions that genuinely serve your commercial goals.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Direct Developer Access</h4>
                <p className="text-xs text-slate-400">
                  You communicate directly with Suraj Maurya throughout your project. No middleman account managers or missed instructions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Honest & Fact-Based</h4>
                <p className="text-xs text-slate-400">
                  Zero fake client claims or puffed-up statistics. Clear milestone tracking and manual direct bank/UPI payments.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                  <Code2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Clean Modern Stack</h4>
                <p className="text-xs text-slate-400">
                  Websites written with modern web standards, lightweight code, responsive layouts, and sub-2 second load times.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                  <Terminal className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Order Tracking Portal</h4>
                <p className="text-xs text-slate-400">
                  Receive an automated Order ID upon submission and monitor your progress across all 10 distinct development stages.
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={onOpenOrder}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 cursor-pointer"
              >
                Start Your Project with Suraj Maurya →
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
