
import React from 'react';

const Partners: React.FC = () => {
  const partners = [
    'coinbase', 'OKX', 'galaxy', 'Kraken VENTURES', 'CIRCLE'
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 px-4">
      {partners.map((partner) => (
        <span 
          key={partner} 
          className="text-zinc-600 font-bold text-xl md:text-2xl tracking-tighter uppercase grayscale opacity-50 hover:opacity-100 transition-opacity cursor-default"
        >
          {partner}
        </span>
      ))}
    </div>
  );
};

export default Partners;
