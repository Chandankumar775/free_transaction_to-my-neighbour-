
import React from 'react';
import { ArrowRight } from 'lucide-react';

const Solution: React.FC = () => {
  return (
    <section id="about" className="py-40 px-8 md:px-16 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24">
          <h2 className="text-7xl md:text-[11rem] font-black italic uppercase tracking-tighter leading-[0.8] mb-16">
            PEER TO PEER <br />
            <span className="text-zinc-800">AUTONOMY.</span>
          </h2>

          <p className="text-2xl text-zinc-400 max-w-4xl leading-snug font-medium mb-20">
            Grid Matrix is the native energy layer of the decentralized internet.
            We bypass utility monopolies to create neighborhood-scale microgrids
            powered by peer-verified energy trades.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-0">
            {[
              { t: "SMART SETTLEMENT", d: "Payments settle instantly via neighborhood smart contracts." },
              { t: "VERIFIED ORIGIN", d: "Energy provenance is tracked with zero-knowledge proofs." },
              { t: "FAIR MARKET", d: "AI-driven price discovery ensures the best local rates." }
            ].map((item, i) => (
              <div key={i} className="group py-10 border-b border-zinc-900 cursor-default flex items-start gap-6 hover:bg-zinc-950/50 transition-colors px-4 -mx-4">
                <ArrowRight className="w-5 h-5 text-zinc-700 mt-1.5 group-hover:text-white transition-colors" />
                <div>
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors">
                    {item.t}
                  </h4>
                  <p className="text-zinc-500 text-lg mt-2 font-medium">{item.d}</p>
                </div>
              </div>
            ))}

            <div className="mt-20">
              <button className="px-16 py-8 bg-orange-600 text-white rounded-full font-black text-2xl hover:bg-orange-500 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_60px_rgba(234,88,12,0.3)]">
                Join the Network
              </button>
            </div>
          </div>

          <div className="relative aspect-square">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[120%] h-[120%] bg-orange-600/5 blur-[120px] rounded-full animate-pulse"></div>

              <div className="relative w-full h-full bg-zinc-950 border border-zinc-900 rounded-[4rem] p-12 overflow-hidden group">
                <div className="absolute inset-0 bg-grid opacity-20"></div>

                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <div className="w-40 h-40 bg-black border-2 border-white rounded-[2.5rem] flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-700">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 text-white fill-current">
                      <path d="M50 15 L85 80 L15 80 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                      <path d="M50 35 L70 70 L30 70 Z" fill="currentColor" />
                    </svg>
                  </div>

                  {/* Floating labels */}
                  <div className="absolute top-10 left-10 glass px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    NODE_ACTIVE: 0xFF21
                  </div>
                  <div className="absolute bottom-10 right-10 glass px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-orange-500">
                    SYNC_COMPLETE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
