import React from 'react';
import { 
  Sparkles, MessageSquare, Mail, Phone, ShieldCheck, 
  ArrowUp, Smartphone, Heart 
} from 'lucide-react';
import { Settings } from '../types/index';
import { createWhatsAppUrl } from '../utils/helpers';
import { PWAInstallButton } from './PWAInstallButton';

interface FooterProps {
  settings: Settings;
  onOpenOrder: () => void;
  onOpenTracker: () => void;
  onOpenLegal: (tab: 'privacy' | 'terms' | 'refund' | 'contact') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenOrder,
  onOpenTracker,
  onOpenLegal,
  onOpenAdmin
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsAppFooterUrl = createWhatsAppUrl(
    settings.whatsappNumber,
    `Hello Suraj Maurya! I am contacting you from the footer of your website.`
  );

  return (
    <footer className="bg-[#070b16] border-t border-slate-800/80 pt-16 pb-12 relative text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Banner */}
        <div className="mb-14 p-8 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              Ready to elevate your online business?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Start Your Project with Suraj Maurya Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Professional website design, landing pages, sales funnels, and tailored digital solutions with direct milestone tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenOrder}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              Start Your Project Now →
            </button>
            <a
              href={whatsAppFooterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

        {/* 4-Column Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-yellow-400 p-[1.5px]">
                <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center font-bold text-white text-base">
                  <span className="text-cyan-400 font-mono">S</span>
                  <span className="text-yellow-400 font-mono">M</span>
                </div>
              </div>
              <div>
                <span className="text-base font-extrabold text-white block">
                  {settings.businessName}
                </span>
                <span className="text-xs text-cyan-400 font-medium">
                  {settings.ownerName} • Digital Solutions Architect
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Website • Landing Page • Sales Funnel • Online Course LMS • UI/UX Design • Graphic Design • Digital Solutions
            </p>

            <p className="text-xs text-yellow-400/90 font-mono">
              "{settings.tagline}"
            </p>

            {/* In-app install banner in footer */}
            <div className="pt-2">
              <PWAInstallButton variant="nav" />
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-cyan-400 transition">Business Websites</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition">Landing Pages</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition">Sales Funnels</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition">Online Course LMS</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition">UI/UX & Branding</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition">Custom Web Portals</a></li>
            </ul>
          </div>

          {/* Col 3: Client Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Client Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenOrder} className="hover:text-cyan-400 transition text-left cursor-pointer">
                  Start Project Order
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-cyan-400 transition text-left cursor-pointer">
                  Track Order Status (10 Stages)
                </button>
              </li>
              <li>
                <a href="#payment" className="hover:text-cyan-400 transition">
                  Direct Payment (UPI/Bank)
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-cyan-400 transition">
                  Transparent Packages
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-cyan-400 transition">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Policies & Admin
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-cyan-400 transition text-left cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-cyan-400 transition text-left cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('refund')} className="hover:text-cyan-400 transition text-left cursor-pointer">
                  Refund / Cancellation
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('contact')} className="hover:text-cyan-400 transition text-left cursor-pointer">
                  Contact Information
                </button>
              </li>
              <li className="pt-2">
                <button 
                  onClick={onOpenAdmin} 
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-cyan-400 transition font-mono cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Dashboard Login
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} {settings.businessName} • Owned & Operated by <strong className="text-slate-300">{settings.ownerName}</strong>. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-600">
              Direct UPI / Bank Transfer • Manual Verification
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
