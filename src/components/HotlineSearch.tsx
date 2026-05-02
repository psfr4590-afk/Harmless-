import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, ExternalLink, Loader2, AlertCircle, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

const LOCAL_SEARCHES = [
  { id: 'crisis', name: 'Local Crisis Centers', query: 'Mental health crisis center hotline near me', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'substance', name: 'Substance Abuse Centers', query: 'Substance abuse hotline center near me', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'domestic', name: 'Domestic Violence Shelters', query: 'Domestic violence hotline near me', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'youth', name: 'Youth & Teen Services', query: 'Youth crisis hotline near me', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'meetings', name: 'Local NA/AA Hotlines', query: 'Narcotics Alcoholics Anonymous meeting hotline near me', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
];

const NATIONAL_HOTLINES = [
  { id: 'emergency', name: 'Emergency Services', number: '911', desc: 'Immediate medical or safety emergencies' },
  { id: 'suicide', name: 'Suicide & Crisis Lifeline', number: '988', desc: '24/7 free and confidential support' },
  { id: 'samhsa', name: 'SAMHSA National Helpline', number: '1-800-662-4357', desc: 'Treatment referral and info service' },
  { id: 'nua', name: 'Never Use Alone', number: '1-800-484-3731', desc: 'Harm reduction & overdose prevention' },
  { id: 'na', name: 'Narcotics Anonymous', number: '1-818-773-9999', desc: 'NA World Services general information' }
];

export default function HotlineSearch() {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  useEffect(() => {
    requestLocation();
  }, []);

  function requestLocation() {
    setLoadingLoc(true);
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      setLoadingLoc(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoadingLoc(false);
      },
      (error) => {
        let msg = "Failed to get location.";
        if (error.code === 1) msg = "Location access denied. Please enable permissions.";
        else if (error.code === 2) msg = "Position unavailable.";
        else if (error.code === 3) msg = "Location request timed out.";
        setLocError(msg);
        setLoadingLoc(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const openMapSearch = (query: string) => {
    let url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    if (location) {
      url += `/@${location.lat},${location.lng},13z`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-8">
      
      <div className="bg-[#FF1493]/10 border border-[#FF1493]/30 rounded-2xl p-6">
        <h2 className="text-xl font-black uppercase text-[#FF69B4] tracking-widest flex items-center gap-3">
          <PhoneCall className="w-8 h-8" />
          Crisis & Support Lines
        </h2>
        <p className="mt-3 text-white/80 text-sm leading-relaxed">
          National direct-dial hotlines are listed below. For hyper-local center numbers based on your exact coordinates, use the local search capabilities.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-6 h-6 text-[#FF1493]" />
          <h3 className="text-lg font-black uppercase tracking-wider text-white">Location Status</h3>
        </div>
        
        {loadingLoc ? (
          <div className="flex items-center gap-3 text-white/60">
            <Loader2 className="w-5 h-5 animate-spin text-[#FF1493]" />
            <span className="text-sm uppercase tracking-widest font-bold">Acquiring GPS coordinates...</span>
          </div>
        ) : locError ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-bold">{locError}</span>
            </div>
            <button 
              onClick={requestLocation}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold uppercase tracking-wider self-start transition-colors"
            >
              Retry
            </button>
          </div>
        ) : location ? (
          <div className="flex items-center gap-3 text-green-400">
            <Navigation className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest font-bold">Location Active - Local Search Enabled</span>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <h3 className="text-white/40 font-black uppercase tracking-widest text-xs ml-2">Direct Dial National Hotlines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NATIONAL_HOTLINES.map(hl => (
            <a 
              key={hl.id} 
              href={`tel:${hl.number}`}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="font-black uppercase text-lg tracking-wide text-white">{hl.name}</h4>
                <p className="text-xs text-white/60 font-medium mt-1">{hl.desc}</p>
                <p className="text-sm font-bold text-[#FF69B4] mt-2 block">{hl.number}</p>
              </div>
              <PhoneCall className="w-8 h-8 text-[#FF1493] group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4 pb-8">
        <h3 className="text-white/40 font-black uppercase tracking-widest text-xs ml-2">Find Local Numbers Near You</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LOCAL_SEARCHES.map((category) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={category.id}
              onClick={() => openMapSearch(category.query)}
              className={`p-6 rounded-2xl border flex flex-col justify-between text-left gap-4 ${category.color} transition-all`}
            >
              <div>
                <h4 className="font-black uppercase text-lg tracking-wide">{category.name}</h4>
                <p className="text-xs opacity-80 mt-1 font-medium">Search localized maps for contact numbers</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80 mt-2">
                <Search className="w-4 h-4" />
                <span>Find Local Numbers</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
    </div>
  );
}
