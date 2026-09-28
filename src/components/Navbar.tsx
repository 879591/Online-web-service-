import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sparkles, MessageSquare, Search, ShieldCheck, 
  ArrowRight, PhoneCall, Layers, CheckCircle2 
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { Settings } from '../types/index';
import { createWhatsAppUrl } from '../utils/helpers';

interface NavbarProps {
  settings: Settings;
  onOpenOrder: (serviceId?: string, packageName?: string) => void;
  onOpenTracker: (orderId?: string) => void;
  onOpenQuote: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenOrder,
  onOpenTracker,
  onOpenQuote,
  onOpenAdmin
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Packages', href: '#packages' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Process', href: '#process' },
    { name: 'Direct Payment', href: '#payment' },
    { name: 'About', href: '#about' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsAppGeneralUrl = createWhatsAppUrl(
    settings.whatsappNumber,
    `Hello Suraj! I am on your website and want to discuss a new digital project.`
  );

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-cyan-500/20 text-xs py-1.5 px-4 text-center text-slate-300 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          <span>Accepting New Client Projects</span>
        </span>
        <span className="hidden md:inline text-slate-600">•</span>
        <span className="hidden md:inline text-slate-400">
          Direct WhatsApp Support with Suraj Maurya
        </span>
        <a
          href={whatsAppGeneralUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold underline decoration-emerald-500/40 text-[11px]"
        >
          Chat Now →
        </a>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800 shadow-2xl py-2.5'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-yellow-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center font-bold text-white tracking-tighter text-base">
                  <span className="text-cyan-400 font-mono">S</span>
                  <span className="text-yellow-400 font-mono">M</span>
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition">
                  {settings.businessName}
                </span>
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <span>By Suraj Maurya</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span className="text-[10px] text-emerald-400">Online</span>
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="hover:text-cyan-400 transition-colors py-1 cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Desktop Action CTAs */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* PWA Install Button */}
              <PWAInstallButton variant="nav" />

              {/* Track Order Button */}
              <button
                onClick={() => onOpenTracker()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Track Order</span>
              </button>

              {/* Start Project CTA Button */}
              <button
                onClick={() => onOpenOrder()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-yellow-400 hover:from-cyan-300 hover:to-yellow-300 shadow-md shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Start Project</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>

              {/* Admin Portal Key */}
              <button
                onClick={onOpenAdmin}
                title="Admin Control Panel"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu & Quick CTA Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => onOpenTracker()}
                className="p-2 rounded-xl text-slate-300 bg-slate-800/80 border border-slate-700 text-xs"
                title="Track Order"
              >
                <Search className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                onClick={() => onOpenOrder()}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-yellow-400"
              >
                Start Project
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-[#0a0f1d]/95 backdrop-blur-xl border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <PWAInstallButton variant="banner" />

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTracker();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  Track Order
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuote();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-cyan-300 font-semibold text-xs border border-cyan-500/30 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Custom Quote
                </button>
              </div>

              <a
                href={whatsAppGeneralUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <MessageSquare className="w-4 h-4" />
                Chat with Suraj on WhatsApp
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full text-center py-2 text-xs text-slate-500 hover:text-slate-400 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Dashboard Access
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
