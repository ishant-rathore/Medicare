import React from 'react';
import { PillColor, PillShape } from '../types';

interface PillIconProps {
  color: PillColor | string;
  shape: PillShape | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PillIcon: React.FC<PillIconProps> = ({
  color,
  shape,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  }[size];

  const colorMap: Record<string, { bg: string; border: string; highlight: string; text: string }> = {
    Blue: { bg: 'bg-blue-600', border: 'border-blue-700', highlight: 'bg-blue-400', text: 'text-white' },
    White: { bg: 'bg-slate-100', border: 'border-slate-300', highlight: 'bg-white', text: 'text-slate-700' },
    Red: { bg: 'bg-rose-600', border: 'border-rose-700', highlight: 'bg-rose-400', text: 'text-white' },
    Yellow: { bg: 'bg-amber-400', border: 'border-amber-500', highlight: 'bg-amber-200', text: 'text-amber-950' },
    Orange: { bg: 'bg-orange-500', border: 'border-orange-600', highlight: 'bg-orange-300', text: 'text-white' },
    Green: { bg: 'bg-emerald-600', border: 'border-emerald-700', highlight: 'bg-emerald-400', text: 'text-white' },
    Pink: { bg: 'bg-pink-500', border: 'border-pink-600', highlight: 'bg-pink-300', text: 'text-white' },
    Purple: { bg: 'bg-purple-600', border: 'border-purple-700', highlight: 'bg-purple-400', text: 'text-white' },
    Peach: { bg: 'bg-orange-200', border: 'border-orange-300', highlight: 'bg-orange-100', text: 'text-orange-950' },
    Brown: { bg: 'bg-amber-800', border: 'border-amber-900', highlight: 'bg-amber-700', text: 'text-white' },
  };

  const scheme = colorMap[color] || colorMap['Blue'];

  if (shape === 'Capsule' || color === 'Red/White') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shadow-sm border ${sizeClasses} ${className}`}
        style={{ aspectRatio: '1/1' }}
      >
        <div className="w-full h-full rotate-45 flex rounded-full overflow-hidden border-2 border-slate-700/20 shadow-inner">
          <div className={`w-1/2 h-full ${scheme.bg} relative`}>
            <div className="absolute top-1 left-1 right-1 h-1 bg-white/40 rounded-full" />
          </div>
          <div className="w-1/2 h-full bg-slate-100 relative">
            <div className="absolute top-1 left-1 right-1 h-1 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (shape === 'Oval') {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${sizeClasses} ${className}`}
      >
        <div
          className={`w-full h-3/4 rounded-full ${scheme.bg} border-2 ${scheme.border} shadow-md flex items-center justify-center relative overflow-hidden`}
        >
          <div className="absolute top-1 left-2 right-2 h-1 bg-white/40 rounded-full" />
          <div className="w-1/2 h-0.5 bg-black/10 rounded" />
        </div>
      </div>
    );
  }

  if (shape === 'Syrup' || shape === 'Bottle') {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClasses} ${className}`}>
        <div className="w-2/3 h-5/6 bg-amber-900 rounded-b-lg rounded-t-sm border-2 border-amber-950 relative shadow-md flex flex-col items-center justify-between p-0.5">
          <div className="w-1/2 h-1 bg-white/80 rounded-t-xs -mt-1" />
          <div className="w-full h-1/2 bg-white/90 rounded-xs flex items-center justify-center text-[8px] font-bold text-amber-900">
            Rx
          </div>
          <div className="w-full h-1 bg-amber-700/50 rounded-b-xs" />
        </div>
      </div>
    );
  }

  if (shape === 'Triangle') {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClasses} ${className}`}>
        <div
          className={`w-4/5 h-4/5 ${scheme.bg} border-2 ${scheme.border} shadow-md flex items-center justify-center relative`}
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: '4px' }}
        >
          <div className="w-1 h-1 rounded-full bg-white/50" />
        </div>
      </div>
    );
  }

  if (shape === 'Rectangle' || shape === 'Square') {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClasses} ${className}`}>
        <div
          className={`w-4/5 h-4/5 rounded-md ${scheme.bg} border-2 ${scheme.border} shadow-md flex items-center justify-center relative overflow-hidden`}
        >
          <div className="absolute top-1 left-1 right-1 h-1 bg-white/40 rounded" />
          <div className="w-2 h-0.5 bg-black/10 rounded" />
        </div>
      </div>
    );
  }

  // Default Round Pill
  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses} ${className}`}>
      <div
        className={`w-full h-full rounded-full ${scheme.bg} border-2 ${scheme.border} shadow-md flex items-center justify-center relative overflow-hidden`}
      >
        <div className="absolute top-1.5 left-2 right-2 h-1.5 bg-white/40 rounded-full" />
        <div className="w-3/5 h-0.5 bg-black/15 rounded" />
      </div>
    </div>
  );
};
