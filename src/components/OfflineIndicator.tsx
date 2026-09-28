import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-2xl border border-amber-300">
      <span className="h-2 w-2 rounded-full bg-slate-950 animate-ping" />
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — Cached data is being used.</span>
    </div>
  );
};
