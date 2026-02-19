
import React from 'react';
import { AlertTriangle, ZapOff, EyeOff, ShieldAlert } from 'lucide-react';

const Problems: React.FC = () => {
  const problems = [
    {
      id: 1,
      title: "THE MIDDLEMAN TAX",
      icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
      description: "Utility monopolies pocket up to 30% of every transaction in hidden administrative fees that provide zero value to the local grid."
    },
    {
      id: 2,
      title: "CENTRALIZED FAILURE",
      icon: <ZapOff className="w-6 h-6 text-orange-500" />,
      description: "Single-point-of-failure infrastructure makes your home vulnerable to cyberattacks, storms, and grid instability without any local redundancy."
    },
    {
      id: 3,
      title: "GREEN-WASHING",
      icon: <EyeOff className="w-6 h-6 text-orange-500" />,
      description: "Traditional 'green energy' plans lack on-chain verification. You pay a premium for promises that are impossible to audit or verify."
    },
    {
      id: 4,
      title: "ACTIVE DISINCENTIVE",
      icon: <ShieldAlert className="w-6 h-6 text-orange-500" />,
      description: "Current laws punish solar adopters by forcing them to sell surplus energy at 2 cents while neighbors buy it back at 20 cents."
    }
  ];

  return (
    <section id="ecosystem" className="py-40 px-8 md:px-16 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <p className="text-orange-500 font-black tracking-[0.4em] text-xs mb-8">THE PROBLEM</p>
          <h2 className="text-6xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-[0.85] mb-12">
            LEGACY GRIDS <br /> ARE BROKEN.
          </h2>
          <div className="w-32 h-2.5 bg-orange-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {problems.map((problem) => (
            <div key={problem.id} className="relative group glass p-12 rounded-[3rem] border-zinc-900 overflow-hidden hover:border-orange-600/30 transition-all duration-500">
              <div className="scan-line-v"></div>

              <div className="mb-10 p-5 bg-zinc-900/50 w-fit rounded-2xl border border-zinc-800">
                {problem.icon}
              </div>

              <h3 className="text-3xl font-black mb-6 tracking-tighter uppercase italic">
                {problem.title}
              </h3>

              <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                {problem.description}
              </p>

              <div className="absolute top-8 right-8 text-[10px] font-black text-zinc-800 tracking-widest uppercase">
                ERR_NODE_0{problem.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problems;
