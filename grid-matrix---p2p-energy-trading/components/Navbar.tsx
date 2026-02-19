
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 md:px-16 ${scrolled ? 'mt-4 mx-4 md:mx-16 rounded-full glass border-zinc-800/50 py-3 shadow-2xl' : 'bg-transparent py-6'
      }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative transition-transform duration-500 group-hover:rotate-6">
            <Logo size={32} color="#9FDC56" />
            <div className="absolute inset-0 bg-[#9FDC56]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase transition-colors group-hover:text-[#9FDC56]">Grid Matrix</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[13px] font-bold tracking-widest uppercase text-zinc-500">
          {['Ecosystem', 'Token', 'Developers', 'Resources', 'About'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-white transition-all duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#9FDC56] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden lg:block text-sm font-bold text-zinc-400 hover:text-white transition-colors">Sign In</button>
          <button
            onClick={() => navigate('/app')}
            className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-black hover:scale-105 transition-all active:scale-95 shadow-lg shadow-white/5"
          >
            Launch App
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
