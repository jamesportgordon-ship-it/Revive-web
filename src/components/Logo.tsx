import React from 'react';
import { RefreshCw } from 'lucide-react';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative group">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-300">
          <RefreshCw className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 border-2 border-white rounded-full"></div>
      </div>
      <span className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
        Revive <span className="text-blue-600">IT</span>
      </span>
    </div>
  );
};
