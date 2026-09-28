import React from 'react';
import { Check, Zap, Sparkles, ArrowRight, Shield, Clock } from 'lucide-react';
import { Package, Settings } from '../types/index';
import { createWhatsAppUrl } from '../utils/helpers';

interface PackagesSectionProps {
  packages: Package[];
  settings: Settings;
  onSelectPackage: (packageName: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  settings,
  onSelectPackage
}) => {
  return (
    <section id="packages" className="py-20 md:py-28 relative bg-[#0a0f1d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 text-xs font-semibold uppercase tracking-wider">
            Clear Transparent Pricing
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-cyan-400">Growth Packages</span>
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            No hidden charges, zero unexpected add-ons. Direct bank/UPI transfer payment directly to Suraj Maurya.
          </p>
        </div>

        {/* Packages 4-Column Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {packages.map((pkg) => {
            const isGrowth = pkg.name === 'GROWTH';
            const isPro = pkg.name === 'PRO';

            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isGrowth
                    ? 'bg-gradient-to-b from-slate-900 via-[#0f172a] to-blue-950/80 border-2 border-cyan-400/60 shadow-2xl shadow-cyan-500/15 p-6 md:-translate-y-2'
                    : 'bg-[#0f172a]/70 border border-slate-800 hover:border-slate-700 p-6'
                }`}
              >
                {/* Popular Pill */}
                {isGrowth && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-yellow-400 text-slate-950 text-[11px] font-extrabold tracking-wide uppercase shadow-md shadow-cyan-500/30 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Most Popular Choice
                  </div>
                )}

                <div>
                  {/* Package Title & Subtitle */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-extrabold text-white tracking-tight">
                      {pkg.name}
                    </h3>
                    {isPro && (
                      <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-mono border border-indigo-700/50">
                        Enterprise
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-400 min-h-[36px] leading-relaxed">
                    {pkg.subtitle}
                  </p>

                  {/* Price */}
                  <div className="mt-5 pb-5 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {pkg.price}
                      </span>
                      {pkg.price.includes('₹') && (
                        <span className="text-xs text-slate-400 font-medium">/ one-time</span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Delivery: {pkg.delivery}</span>
                    </div>
                  </div>

                  {/* Best For Tag */}
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-300">
                    <strong className="text-cyan-300 block mb-0.5 font-semibold">Ideal For:</strong>
                    {pkg.bestFor}
                  </div>

                  {/* Features Checklist */}
                  <div className="mt-5 space-y-2.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Package Includes:
                    </span>
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Action Button */}
                <div className="mt-8 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => onSelectPackage(pkg.name)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      isGrowth
                        ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-yellow-400 hover:from-cyan-300 hover:to-yellow-300 text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-95'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-cyan-500/40 active:scale-95'
                    }`}
                  >
                    <span>Choose {pkg.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Advance & Verification Notice */}
        <div className="mt-12 text-center text-xs text-slate-400 max-w-xl mx-auto flex items-center justify-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Direct UPI / Bank Transfer. Zero gateway fees. Advance confirmation ensures priority development slot.
          </span>
        </div>

      </div>
    </section>
  );
};
