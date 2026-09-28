import React, { useState } from 'react';
import { 
  Globe, Target, TrendingUp, GraduationCap, ShoppingBag, Briefcase, 
  Layout, Sparkles, Image as ImageIcon, Share2, ShieldCheck, Cpu, 
  Clock, ArrowRight, MessageSquare, Check, Filter 
} from 'lucide-react';
import { Service, Settings } from '../types/index';
import { createWhatsAppUrl } from '../utils/helpers';

interface ServicesSectionProps {
  services: Service[];
  settings: Settings;
  onSelectService: (serviceId: string) => void;
}

// Map service icon string to Lucide icon
const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Globe': return <Globe className="w-6 h-6 text-cyan-400" />;
    case 'Target': return <Target className="w-6 h-6 text-yellow-400" />;
    case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-emerald-400" />;
    case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-indigo-400" />;
    case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-purple-400" />;
    case 'Briefcase': return <Briefcase className="w-6 h-6 text-blue-400" />;
    case 'Layout': return <Layout className="w-6 h-6 text-pink-400" />;
    case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-400" />;
    case 'Image': return <ImageIcon className="w-6 h-6 text-sky-400" />;
    case 'Share2': return <Share2 className="w-6 h-6 text-teal-400" />;
    case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-rose-400" />;
    case 'Cpu': return <Cpu className="w-6 h-6 text-cyan-300" />;
    default: return <Globe className="w-6 h-6 text-cyan-400" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  settings,
  onSelectService
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Web Development', 'Conversion', 'Marketing', 'Education', 'Design', 'Branding', 'Support'];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <section id="services" className="py-20 md:py-28 relative bg-[#090d1a]">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-600/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-600/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
            Comprehensive Digital Suite
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            High-Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-yellow-400">Services</span> Tailored For You
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Har service real business growth aur maximum conversion dhyan mein rakh kar develop ki jaati hai. Select your service to place an order or talk directly with Suraj.
          </p>

          {/* Filter Categories */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services 12-Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const whatsAppServiceUrl = createWhatsAppUrl(
              settings.whatsappNumber,
              `Hello Suraj, I am interested in your "${service.name}" service (Starting at ${service.startingPrice}). I would like to discuss my project requirements.`
            );

            return (
              <div
                key={service.id}
                className="group relative rounded-2xl glass-card p-6 flex flex-col justify-between hover:border-cyan-500/40"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40 flex items-center justify-center transition shadow-md">
                      {getServiceIcon(service.iconName)}
                    </div>
                    {service.badge && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-yellow-400/90 font-medium mt-0.5">
                    {service.tagline}
                  </p>
                  
                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Key Features Checklist */}
                  <div className="mt-5 space-y-2 border-t border-slate-800/80 pt-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      What's Included:
                    </span>
                    {service.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Meta & CTAs */}
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Starting From</span>
                      <span className="text-lg font-extrabold text-white tracking-tight">
                        {service.startingPrice}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Delivery Time</span>
                      <span className="text-xs font-semibold text-cyan-300 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {service.deliveryTime}
                      </span>
                    </div>
                  </div>

                  {/* Buttons: Order Now & Ask on WhatsApp */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectService(service.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <span>Order Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={whatsAppServiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-semibold text-xs border border-emerald-500/30 flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Solution Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900/90 to-indigo-950/70 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Need a completely customized setup or unique integration?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              We engineer custom portals, automation workflows, CRM links, and bespoke client applications tailored specifically to your company’s workflow.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => onSelectService('custom-digital-solutions')}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Get Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
