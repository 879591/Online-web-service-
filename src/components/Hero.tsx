import React from 'react';
import { 
  ArrowRight, MessageSquare, Sparkles, CheckCircle2, Shield, 
  Zap, Code2, Smartphone, Eye, ExternalLink, Award 
} from 'lucide-react';
import { Settings } from '../types/index';
import { createWhatsAppUrl } from '../utils/helpers';
import { PWAInstallButton } from './PWAInstallButton';

interface HeroProps {
  settings: Settings;
  onOpenOrder: (serviceId?: string) => void;
  onOpenTracker: () => void;
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onOpenOrder,
  onOpenTracker,
  onOpenQuote,
}) => {
  const whatsAppHeroUrl = createWhatsAppUrl(
    settings.whatsappNumber,
    `Hello Suraj Maurya! I want to start a project with Online Website & Digital Services. Let's discuss requirements.`
  );

  return (
    <section className="relative pt-6 pb-20 md:pt-12 md:pb-28 overflow-hidden">
      {/* Background Decorative Tech Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-yellow-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Agency Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-white font-medium">{settings.businessName}</span>
            <span className="text-slate-500">|</span>
            <span className="text-yellow-400 font-bold">Suraj Maurya</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/30 text-slate-300 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>"Your Vision → Our Digital Solution"</span>
          </div>
        </div>

        {/* Main Hero Headlines */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Digital Presence.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-yellow-400">
              Grow Your Business.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Professional websites, landing pages, sales funnels, online courses, and digital solutions designed around your business. High speed, modern UX & real results.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-cyan-400 font-medium">
            (Aapke business ke liye high-converting website aur digital branding — directly handled by Suraj Maurya)
          </p>

          {/* Primary Call to Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {/* Start Your Project */}
            <button
              onClick={() => onOpenOrder()}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            {/* WhatsApp Us */}
            <a
              href={whatsAppHeroUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            {/* View Services */}
            <a
              href="#services"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm sm:text-base border border-slate-700/80 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-2"
            >
              <span>View Services</span>
            </a>
          </div>

          {/* Direct Quick Badges */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs text-slate-400">
            <div className="flex items-center justify-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Direct UPI / Bank (No Gateway)</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300 font-medium">10-Stage Live Tracking</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-medium">Clean Code & Fast Speed</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300 font-medium">Installable PWA App</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Visual Dashboard Preview Card */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="relative rounded-2xl glass-panel p-2 sm:p-4 border border-cyan-500/25 shadow-2xl overflow-hidden glow-blue">
            
            {/* Top Mac-style Window Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-[#0a0f1d]/80 rounded-t-xl mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-slate-400 font-mono text-[11px] hidden sm:inline">
                  https://surajmaurya.digital • Client Portal & Agency Hub
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-medium">
                  LIVE VERIFIED WORKFLOW
                </span>
              </div>
            </div>

            {/* Inner Agency Mock Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-1">
              
              {/* Feature Box 1: Real Client Order System */}
              <div className="bg-[#0f172a]/90 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 1. Client Order System
                  </span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-mono">
                    Instant ID
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">Automated Order ID Generation</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Select service, choose package, submit specifications & budget. Get your unique tracking ID instantly.
                </p>
                <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                  <span>Order Generated:</span>
                  <span className="font-bold text-yellow-400">ORD-2026-XXXX</span>
                </div>
              </div>

              {/* Feature Box 2: Direct Payment Flow */}
              <div className="bg-[#0f172a]/90 p-4 rounded-xl border border-slate-800 hover:border-yellow-500/40 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> 2. Direct Payment
                  </span>
                  <span className="text-[10px] bg-yellow-950 text-yellow-300 px-2 py-0.5 rounded font-mono">
                    Zero Surcharges
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">Direct UPI & Bank Transfer</h4>
                <p className="text-xs text-slate-400 mt-1">
                  No middleman payment gateway fees. Pay to Suraj Maurya via PhonePe/GPay/IMPS, submit UTR for manual verification.
                </p>
                <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-[11px] font-mono text-yellow-300 flex items-center justify-between">
                  <span>UPI ID:</span>
                  <span className="font-bold text-slate-200">{settings.upiId}</span>
                </div>
              </div>

              {/* Feature Box 3: 10-Stage Milestone Tracking */}
              <div className="bg-[#0f172a]/90 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> 3. Order Tracking
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">
                    10 Stages
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">Transparent Real-Time Updates</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Watch your project advance step-by-step from requirement review to design, development, and delivery.
                </p>
                <button
                  onClick={onOpenTracker}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Test Live Order Tracker
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
