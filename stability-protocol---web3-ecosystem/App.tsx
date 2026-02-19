import React, { useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Operators } from './components/Operators';
import { GrowthStats } from './components/GrowthStats';
import { TransformationSection } from './components/TransformationSection';
import { Footer } from './components/Footer';
import heroVideo from './components/assets/wg1962q68hrmy0cwd0s9cp3tr4_result_.mp4';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll-controlled video playback across the entire site
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Pause the video initially — it will only play on scroll
    video.pause();

    const handleScroll = () => {
      // Play while scrolling
      if (video.paused) {
        video.play().catch(() => { });
      }

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Pause after 150ms of no scrolling
      scrollTimeoutRef.current = setTimeout(() => {
        video.pause();
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative bg-black selection:bg-orange-500 selection:text-white overflow-x-hidden">

      {/* Fixed Full-Page Video Background — Visible across entire site */}
      <div className="fixed inset-0 z-[1] pointer-events-none" style={{ opacity: 0.90 }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          loop
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Gradient overlay to protect text readability */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 20%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.25) 80%, rgba(0,0,0,0.8) 100%)'
        }}></div>
      </div>

      {/* Structural Background Text Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden hidden lg:block select-none opacity-[0.015]">
        <div className="absolute top-[20%] left-16">
          <p className="cyber-font text-[14px] tracking-[2em] mb-12">////////////////////////////////////</p>
          <div className="cyber-font text-[12rem] leading-[0.8] font-black text-white">
            SECURE<br />WALLETS
          </div>
        </div>
        <div className="absolute bottom-[15%] right-16 text-right">
          <div className="cyber-font text-[8rem] leading-[0.8] font-black text-white">
            PROTO<br />COL
          </div>
          <p className="cyber-font text-[12px] tracking-[1.5em] mt-8">////////////////////////////////////</p>
        </div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Operators />
        <TransformationSection />
        <GrowthStats />
      </main>

      <Footer />

      {/* HUD Accents */}
      <div className="fixed bottom-10 left-10 w-12 h-12 border-l border-b border-white/5 pointer-events-none z-50"></div>
      <div className="fixed bottom-10 right-10 w-12 h-12 border-r border-b border-white/5 pointer-events-none z-50"></div>
      <div className="fixed top-10 left-10 w-12 h-12 border-l border-t border-white/5 pointer-events-none z-50"></div>
      <div className="fixed top-10 right-10 w-12 h-12 border-r border-t border-white/5 pointer-events-none z-50"></div>
    </div>
  );
};

export default App;