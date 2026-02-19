
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  buttonText: string;
  color: string;
  icon: string;
}

export const Card: React.FC<CardProps> = ({ title, description, buttonText, color, icon }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl p-8 bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-300">
      {/* Subtle corner glow */}
      <div 
        className="absolute -top-12 -right-12 w-24 h-24 blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor: color }}
      ></div>
      
      <div className="relative z-10 space-y-6">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ 
            background: `linear-gradient(135deg, ${color}33, transparent)`,
            border: `1px solid ${color}44`
          }}
        >
          {icon}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-white text-xl font-semibold tracking-tight">{title}</h3>
          <p className="text-white/50 text-sm leading-relaxed font-light">
            {description}
          </p>
        </div>

        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
          <span>{buttonText}</span>
          <svg className="w-4 h-4 translate-y-[-1px] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};
