import React, { useState } from 'react';
import { 
  Sparkles, ExternalLink, ArrowRight, Layers, 
  CheckCircle, Code, Eye, X 
} from 'lucide-react';
import { PortfolioItem } from '../types/index';

interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
  onOrderSimilar: (serviceTitle: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  portfolio,
  onOrderSimilar
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const categories = ['All', 'Websites', 'Landing Pages', 'Funnels', 'Branding', 'Design'];

  const filtered = activeCategory === 'All'
    ? portfolio
    : portfolio.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 md:py-28 relative bg-[#0a0f1d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
            Real Work & Concepts
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-yellow-400">Design Portfolio</span>
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            All showcase projects are clearly labeled as demo agency concepts or client builds. Zero fake statistics or fabricated testimonials.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl glass-card overflow-hidden flex flex-col justify-between group border-slate-800 hover:border-cyan-500/40"
            >
              <div>
                {/* Visual Banner Header */}
                <div className={`h-48 relative overflow-hidden bg-gradient-to-tr ${item.accentColor} p-6 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/70 text-white backdrop-blur-md border border-white/10">
                      {item.badge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-950/60 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-inner border border-white/10">
                      <Layers className="w-5 h-5 text-cyan-300" />
                    </div>
                    <h3 className="text-xl font-black text-white drop-shadow-md">
                      {item.title}
                    </h3>
                  </div>

                  {/* Decorative diagonal pattern */}
                  <div className="absolute inset-0 bg-black/15 bg-tech-grid pointer-events-none" />
                </div>

                {/* Body Details */}
                <div className="p-6">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed min-h-[48px]">
                    {item.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 space-y-1.5">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech tags */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {item.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-6 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preview Details</span>
                </button>

                <button
                  onClick={() => onOrderSimilar(item.title)}
                  className="flex-1 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>Build Similar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f172a] border border-cyan-500/40 p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
              {selectedItem.category} • {selectedItem.badge}
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">
              {selectedItem.title}
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {selectedItem.description}
            </p>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 mb-4 space-y-2">
              <strong className="text-xs text-white block">Key Architectural Highlights:</strong>
              {selectedItem.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <span className="text-xs text-slate-400 block mb-1.5">Technologies & Tools:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedItem.techStack.map(t => (
                  <span key={t} className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  const title = selectedItem.title;
                  setSelectedItem(null);
                  onOrderSimilar(title);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Order This Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
