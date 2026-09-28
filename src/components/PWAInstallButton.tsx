import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Check, X, Info } from 'lucide-react';

interface Props {
  className?: string;
  variant?: 'nav' | 'hero' | 'banner';
}

export const PWAInstallButton: React.FC<Props> = ({ className = '', variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <Check className="w-3.5 h-3.5" /> App Installed
      </span>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-blue-900/60 to-cyan-900/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                Download App to Phone <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">Fast Access</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Chrome se direct install karein. Track orders, get quotes & contact Suraj anytime directly from home screen!
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            {isInstallable ? 'Install App Now' : 'Download / Add to Phone'}
          </button>
        </div>

        {showGuide && (
          <InstallModal onClose={() => setShowGuide(false)} isIOS={isIOS} />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Download App for Chrome / Phone"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          variant === 'hero'
            ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
            : 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-cyan-500/30'
        } ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-cyan-400" />
        <span>Install App</span>
      </button>

      {showGuide && (
        <InstallModal onClose={() => setShowGuide(false)} isIOS={isIOS} />
      )}
    </>
  );
};

const InstallModal: React.FC<{ onClose: () => void; isIOS: boolean }> = ({ onClose, isIOS }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-cyan-500/40 p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Download to Home Screen</h3>
            <p className="text-xs text-slate-400">Apne phone par app ki tarah save karein</p>
          </div>
        </div>

        {isIOS ? (
          <div className="space-y-3 text-sm text-slate-300 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="font-semibold text-cyan-300">Apple iPhone / iPad Safari Steps:</p>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
              <li>Safari browser mein bottom bar par <strong className="text-white">Share (तीर वाला आइकॉन)</strong> dabayein.</li>
              <li>Neeche scroll karke <strong className="text-white">"Add to Home Screen" (+)</strong> select karein.</li>
              <li>Top right corner par <strong className="text-white">"Add"</strong> tap karein.</li>
            </ol>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-slate-300 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="font-semibold text-cyan-300">Android / Chrome Steps:</p>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
              <li>Chrome browser ke top-right corner par <strong className="text-white">Three Dots (⋮)</strong> tap karein.</li>
              <li>Menu mein se <strong className="text-white">"Install app"</strong> ya <strong className="text-white">"Add to Home screen"</strong> par click karein.</li>
              <li>Confirm popup par <strong className="text-white">"Install"</strong> dabayein.</li>
            </ol>
            <p className="text-[11px] text-cyan-400/90 pt-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              App aapke phone menu aur desktop par instant shortcut ki tarah save ho jayega!
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:opacity-95 transition shadow-lg shadow-cyan-500/20"
        >
          Got It / Theek Hai
        </button>
      </div>
    </div>
  );
};
