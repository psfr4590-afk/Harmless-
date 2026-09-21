import React, { useState } from 'react';
import { Heart, MapPin, PhoneCall, Shield, Calculator, FlaskConical, ArrowLeft, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResourceSearch from './components/ResourceSearch';
import ROASafeUse from './components/ROASafeUse';
import HotlineSearch from './components/HotlineSearch';
import InteractionChecker from './components/InteractionChecker';
import DoseCalculator from './components/DoseCalculator';
import AffirmationLanding from './components/AffirmationLanding';
import HelpfulLinks from './components/HelpfulLinks';
import Disclaimer from './components/Disclaimer';
import LabTesting from './components/LabTesting';
import PillIdentifier from './components/PillIdentifier';
import GoodSamaritanLaws from './components/GoodSamaritanLaws';
import { Microscope, Search as SearchIcon } from 'lucide-react';

type Screen =
  | 'disclaimer' | 'landing' | 'dashboard'
  | 'resources' | 'roa' | 'hotlines' | 'interactions'
  | 'dose' | 'links' | 'testing' | 'pill-id' | 'laws';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('disclaimer');

  return (
    <div className="min-h-[100dvh] bg-[#121212] text-white antialiased">
      <main id="main-content" tabIndex={-1} className="outline-none">
      <AnimatePresence mode="wait">
        {currentScreen === 'disclaimer' ? (
          <Disclaimer key="disclaimer" onAcknowledge={() => setCurrentScreen('landing')} />
        ) : currentScreen === 'landing' ? (
          <AffirmationLanding key="landing" onContinue={() => setCurrentScreen('dashboard')} />
        ) : currentScreen === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 pb-24 max-w-4xl mx-auto space-y-8" aria-labelledby="dashboard-title"
          >
            <header className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-[#FF1493]" />
                <div>
                  <h1 id="dashboard-title" className="text-xl font-black text-[#FF69B4] uppercase tracking-widest">Harm.Less</h1>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Harm reduction • support • practical safety</p>
                </div>
              </div>
            </header>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-white/40 mr-2 hidden sm:inline-block">Index:</span>
              <button onClick={() => document.getElementById('urgent')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 rounded-full border border-[#FF1493]/30 bg-[#FF1493]/5 text-[#FF69B4] text-xs font-bold uppercase tracking-wider hover:bg-[#FF1493]/20 transition-colors">Urgent</button>
              <button onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 rounded-full border border-white/10 text-white/70 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">Tools</button>
              <button onClick={() => document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 rounded-full border border-white/10 text-white/70 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">Education</button>
              <button onClick={() => document.getElementById('local')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 rounded-full border border-white/10 text-white/70 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">Services</button>
            </div>

            <div className="space-y-12">

              {/* SECTION: Urgent Response */}
              <section id="urgent" className="space-y-4">
                <div className="flex items-center gap-3 border-b border-[#FF1493]/30 pb-2">
                  <Heart className="w-5 h-5 text-[#FF1493]" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white/90">Urgent Response</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => window.open('https://neverusealone.com/', '_blank', 'noopener,noreferrer')}
                    className="col-span-1 md:col-span-2 flex flex-col items-center justify-center text-center gap-4 min-h-[160px] rounded-2xl border-2 border-[#FF1493] bg-gradient-to-br from-[#FF1493]/40 to-[#FF1493]/10 shadow-[0_0_15px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.8)] hover:from-[#FF1493]/50 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <PhoneCall className="w-10 h-10 text-[#FF69B4] group-hover:text-white transition-colors drop-shadow-[0_0_10px_rgba(255,20,147,0.8)] animate-pulse" />
                    <span className="text-xl font-black uppercase tracking-widest text-white drop-shadow-md block">Never Use Alone</span>
                    <span className="text-sm uppercase text-white/80 font-bold -mt-2">Open Never Use Alone Website</span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('hotlines')}
                    className="col-span-1 md:col-span-2 flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-4 min-h-[100px] p-6 rounded-2xl border border-[#FF1493]/50 bg-gradient-to-r from-red-500/20 to-orange-500/10 hover:border-[#FF1493] hover:from-red-500/30 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-red-500/30 rounded-full group-hover:scale-110 transition-transform">
                      <PhoneCall className="w-6 h-6 text-red-200" />
                    </div>
                    <div>
                      <span className="text-lg font-black uppercase tracking-widest text-white drop-shadow-md block">Hotlines & Support</span>
                      <span className="text-sm uppercase text-white/60 font-bold">National lines + local support</span>
                    </div>
                  </button>
                </div>
              </section>

              {/* SECTION: Tools */}
              <section id="tools" className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                  <Calculator className="w-5 h-5 text-[#FF69B4]" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white/90">Harm Reduction Tools</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => setCurrentScreen('interactions')} className="col-span-1 flex flex-col items-center justify-center text-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-[#FF1493]/50 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                    <FlaskConical className="w-8 h-8 text-[#FF69B4] group-hover:scale-110 transition-transform" />
                    <span className="text-md font-black uppercase tracking-widest text-white block">Interaction Check</span>
                    <span className="text-xs uppercase text-white/50 font-bold">Evidence & safety status</span>
                  </button>
                  <button onClick={() => setCurrentScreen('dose')} className="col-span-1 flex flex-col items-center justify-center text-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-[#FF1493]/50 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                    <Calculator className="w-8 h-8 text-[#FF69B4] group-hover:scale-110 transition-transform" />
                    <span className="text-md font-black uppercase tracking-widest text-white block">Dose Calculator</span>
                    <span className="text-xs uppercase text-white/50 font-bold">Mathematical conversion only</span>
                  </button>
                  <button onClick={() => setCurrentScreen('pill-id')} className="col-span-1 md:col-span-2 flex flex-col sm:flex-row items-center justify-center text-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-[#FF1493]/50 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                    <SearchIcon className="w-8 h-8 text-[#FF69B4] group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-md font-black uppercase tracking-widest text-white block">Pill Identifier</span>
                      <span className="text-xs uppercase text-white/50 font-bold">Local photo + imprint lookup</span>
                    </div>
                  </button>
                </div>
              </section>

              {/* SECTION: Education */}
              <section id="info" className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                  <Shield className="w-5 h-5 text-[#FF69B4]" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white/90">Education & Info</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => setCurrentScreen('roa')} className="col-span-1 flex flex-col items-center justify-center text-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-[#FF1493]/50 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                    <Shield className="w-8 h-8 text-[#FF69B4] group-hover:scale-110 transition-transform" />
                    <span className="text-md font-black uppercase tracking-widest text-white block">ROA & Safe Use</span>
                    <span className="text-xs uppercase text-white/50 font-bold">Infection Prevention</span>
                  </button>
                  <button onClick={() => setCurrentScreen('links')} className="col-span-1 flex flex-col items-center justify-center text-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-[#FF1493]/50 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                    <Globe className="w-8 h-8 text-[#FF69B4] group-hover:scale-110 transition-transform" />
                    <span className="text-md font-black uppercase tracking-widest text-white block">Helpful Links</span>
                    <span className="text-xs uppercase text-white/50 font-bold">Communities & Guides</span>
                  </button>
                  <button onClick={() => setCurrentScreen('laws')} className="col-span-1 md:col-span-2 flex flex-col items-center justify-center text-center gap-3 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-blue-500/5 hover:border-blue-500/50 hover:bg-blue-500/10 hover:-translate-y-1 transition-all duration-300 group">
                    <Shield className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-md font-black uppercase tracking-widest text-white block">Good Samaritan Laws</span>
                    <span className="text-xs uppercase text-white/50 font-bold">Current legal reference by jurisdiction</span>
                  </button>
                </div>
              </section>

              {/* SECTION: Local Services */}
              <section id="local" className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                  <MapPin className="w-5 h-5 text-[#FF69B4]" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white/90">Services & Testing</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => setCurrentScreen('resources')} className="col-span-1 flex flex-col items-center justify-center text-center gap-3 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 group">
                    <MapPin className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="text-md font-black uppercase tracking-widest text-white block">Local Resources</span>
                    <span className="text-xs uppercase text-white/50 font-bold">Treatment, support & community services</span>
                  </button>
                  <button onClick={() => setCurrentScreen('testing')} className="col-span-1 flex flex-col items-center justify-center text-center gap-3 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-teal-500/10 to-emerald-500/5 hover:border-teal-500/50 hover:-translate-y-1 transition-all duration-300 group">
                    <Microscope className="w-8 h-8 text-teal-400 group-hover:scale-110 transition-transform" />
                    <span className="text-md font-black uppercase tracking-widest text-white block">Lab Testing</span>
                    <span className="text-xs uppercase text-white/50 font-bold">Independent lab-testing resources</span>
                  </button>
                </div>
              </section>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="interface"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-[100dvh] flex flex-col"
          >
            <header className="p-4 flex items-center gap-4 bg-[#121212] border-b border-white/10 shrink-0">
              <button aria-label="Back to dashboard" onClick={() => setCurrentScreen('dashboard')} className="p-2 hover:bg-white/10 rounded-full transition-all flex items-center justify-center shrink-0">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-black text-[#FF69B4] uppercase tracking-tighter truncate">
                {currentScreen === 'interactions' && 'Interaction Check'}
                {currentScreen === 'dose'         && 'Dose Calculator'}
                {currentScreen === 'resources'    && 'Local Resources'}
                {currentScreen === 'roa'          && 'ROA & Safe Use'}
                {currentScreen === 'hotlines'     && 'Hotlines & Support'}
                {currentScreen === 'links'        && 'Helpful Links'}
                {currentScreen === 'testing'      && 'Mail-In Lab Testing'}
                {currentScreen === 'pill-id'      && 'Pill Identifier & Scanner'}
                {currentScreen === 'laws'         && 'Good Samaritan Laws'}
              </h2>
            </header>

            <div className="flex-1 overflow-hidden relative" aria-live="polite">
              {currentScreen === 'interactions' && <InteractionChecker />}
              {currentScreen === 'dose'         && <DoseCalculator />}
              {currentScreen === 'resources'    && <ResourceSearch />}
              {currentScreen === 'roa'          && <ROASafeUse />}
              {currentScreen === 'hotlines'     && <HotlineSearch />}
              {currentScreen === 'links'        && <HelpfulLinks />}
              {currentScreen === 'testing'      && <LabTesting />}
              {currentScreen === 'pill-id'      && <PillIdentifier />}
              {currentScreen === 'laws'         && <GoodSamaritanLaws />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </main>
    </div>
  );
}
