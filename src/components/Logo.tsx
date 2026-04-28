import React from 'react';
import { RefreshCw } from 'lucide-react';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 md:gap-2.5 ${className} group`}>
      <div className="relative">
        <div className="w-8 h-8 md:w-9 md:h-9 bg-[#1D1D1F] rounded-lg md:rounded-xl flex items-center justify-center apple-shadow group-hover:bg-[#0071E3] transition-all duration-500">
          <RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] md:text-[17px] font-bold text-[#1D1D1F] tracking-tight">
          Revive<span className="text-[#0071E3]">IT</span>
        </span>
        <span className="text-[8px] md:text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mt-0.5 md:mt-1">
          Precision
        </span>
      </div>
    </div>
  );
};
