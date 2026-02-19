import React from 'react';

export const TransformationSection: React.FC = () => {
  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto z-20 text-center overflow-hidden">
      <div className="space-y-6 mb-20 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Protocol Architecture With Stability isn't <br />
          <span className="text-white/40">Transactional.</span> It's <span className="italic">Transformational</span>
        </h2>
        <p className="text-white/40 text-sm md:text-base font-medium max-w-2xl mx-auto tracking-wide">
          Go-to-market, product, and technical leaders powering the next generation of Web3.
        </p>
      </div>

      {/* Stacked Architectural Element from Screenshot */}
      <div className="relative flex flex-col items-center justify-center pt-10">
        <div className="flex flex-col gap-1.5 w-full max-w-4xl perspective-1000">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i}
              className="relative w-full h-12 md:h-16 rounded-xl overflow-hidden transition-all duration-700 hover:scale-[1.02] cursor-pointer group"
              style={{
                background: `linear-gradient(90deg, #1d1b4b 0%, #312e81 30%, #4338ca 60%, #10b981 100%)`,
                opacity: 1 - (i * 0.05),
                transform: `rotateX(15deg) translateY(${i * -4}px)`,
                boxShadow: `0 ${10 + i * 5}px 30px -10px rgba(0,0,0,0.8)`
              }}
            >
              {/* Scanline pattern overlay */}
              <div className="absolute inset-0 opacity-30 pointer-events-none" 
                   style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #000 2px)' }}>
              </div>
              
              {/* Internal Glow */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Edge highlight */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>
            </div>
          ))}
        </div>
        
        {/* Ground Glow */}
        <div className="absolute bottom-[-100px] w-full h-[300px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      </div>
    </section>
  );
};