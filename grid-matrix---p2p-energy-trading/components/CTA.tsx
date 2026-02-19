import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="py-40 px-8 md:px-16 relative">
            <div className="max-w-5xl mx-auto text-center">
                {/* Glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] bg-orange-600/8 blur-[150px] rounded-full"></div>
                </div>

                <div className="relative z-10">
                    <p className="text-orange-500 font-black tracking-[0.4em] text-xs mb-8">JOIN THE REVOLUTION</p>

                    <h2 className="text-6xl md:text-[7rem] font-black italic uppercase tracking-tighter leading-[0.85] mb-12">
                        POWER THE<br />FUTURE.
                    </h2>

                    <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed font-medium mb-16">
                        Join thousands of prosumers, developers, and energy pioneers building the world's first truly decentralized energy grid.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                        <button
                            onClick={() => navigate('/app')}
                            className="group px-14 py-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-orange-500/25 flex items-center gap-3"
                        >
                            Launch App
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button className="px-14 py-6 glass text-white rounded-full font-black text-xl hover:scale-105 transition-all border border-zinc-700 hover:border-orange-500/30">
                            Read Whitepaper
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-8 mt-20 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                        <span>Audited by CertiK</span>
                        <span className="text-zinc-800">•</span>
                        <span>Open Source</span>
                        <span className="text-zinc-800">•</span>
                        <span>DAO Governed</span>
                        <span className="text-zinc-800">•</span>
                        <span>Carbon Neutral</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
