
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Partners from './Partners';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      <div className="arc-glow"></div>
      <div className="arc-line"></div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-7xl">
        <div className="mb-12">
          <div className="relative inline-block">
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-white fill-current relative z-10">
              <path d="M50 10 L90 85 L10 85 Z" fill="none" stroke="currentColor" strokeWidth="4" />
              <path d="M50 30 L75 75 L25 75 Z" fill="currentColor" />
            </svg>
            <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-30 animate-pulse"></div>
          </div>
        </div>

        <h1 className="text-6xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] mb-12">
          GRID <br />
          <span className="text-white">MATRIX</span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-3xl max-w-4xl mb-16 leading-tight font-medium tracking-tight uppercase">
          The trustless <span className="text-white">peer-to-peer</span> protocol <br className="hidden md:block" />
          for the next generation of energy grids.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 items-center">
          <button
            onClick={() => navigate('/app')}
            className="px-14 py-6 bg-white text-black rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl"
          >
            EXPLORE ECOSYSTEM
          </button>
          <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-widest text-xs">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></div>
            Mainnet Operational
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 w-full opacity-40">
        <Partners />
      </div>
    </section>
  );
};

export default Hero;
