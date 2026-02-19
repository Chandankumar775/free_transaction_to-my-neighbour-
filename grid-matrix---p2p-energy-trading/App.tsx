import React, { useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Landing page components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problems from './components/Problems';
import Solution from './components/Solution';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import LiveDashboard from './components/LiveDashboard';
import Tokenomics from './components/Tokenomics';
import NetworkStats from './components/NetworkStats';
import Roadmap from './components/Roadmap';
import CTA from './components/CTA';
import Footer from './components/Footer';

// App pages
import AppLayout from './pages/AppLayout';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import MyEnergy from './pages/MyEnergy';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import EnergyMap from './pages/EnergyMap';
import AutoTrade from './pages/AutoTrade';
import Staking from './pages/Staking';
import Leaderboard from './pages/Leaderboard';

import bgVideo from './src/assets/bg-video.mp4';

/* ─────────────────── Landing Page ─────────────────── */
const LandingPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();

    const handleScroll = () => {
      if (video.paused) video.play().catch(() => { });
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => video.pause(), 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen relative bg-black text-white selection:bg-orange-500 selection:text-white overflow-x-hidden">
      {/* Fixed Full-Page Video Background */}
      <div
        className="fixed top-0 left-0 pointer-events-none"
        style={{ zIndex: 0, width: '100vw', height: '100vh', opacity: 0.85 }}
      >
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          muted playsInline loop
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar />
        <main>
          <Hero />
          <Problems />
          <HowItWorks />
          <Features />
          <LiveDashboard />
          <Solution />
          <Tokenomics />
          <NetworkStats />
          <Roadmap />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
};

/* ─────────────────── App Router ─────────────────── */
const App: React.FC = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Trading Platform App */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="my-energy" element={<MyEnergy />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="profile" element={<Profile />} />
        <Route path="energy-map" element={<EnergyMap />} />
        <Route path="auto-trade" element={<AutoTrade />} />
        <Route path="staking" element={<Staking />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
};

export default App;
