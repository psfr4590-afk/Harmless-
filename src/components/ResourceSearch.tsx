import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, ExternalLink, Loader2, AlertCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveSubmission } from '../lib/storage';

export default function ResourceSearch() {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitForm, setSubmitForm] = useState({ name: '', type: 'clinic', address: '', description: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fetchingData, setFetchingData] = useState(false);

  interface ApiResult {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    source: string;
  }

  const [apiResults, setApiResults] = useState<ApiResult[]>([]);
  const [manualLocationQuery, setManualLocationQuery] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [activeLocationName, setActiveLocationName] = useState<string | null>(null);

  useEffect(() => {
    requestLocation();
  }, []);

  const CATEGORIES = [
    { id: 'narcan', name: 'Narcan / Naloxone', query: 'Narcan Naloxone distribution near me', osmQuery: 'node["healthcare"="pharmacy"]', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { id: 'needle', name: 'Needle Exchange Programs', query: 'Syringe Needle exchange reduction near me', osmQuery: 'node["social_facility"="syringe_exchange"]', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { id: 'housing', name: 'Homeless Shelters & Housing', query: 'Homeless shelter housing assistance near me', osmQuery: 'node["social_facility"="shelter"]', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { id: 'food', name: 'Food Pantries & Meals', query: 'Food pantry bank soup kitchen near me', osmQuery: 'node["social_facility"="food_bank"]', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { id: 'mental', name: 'Mental Health Services', query: 'Mental health counseling psychiatric services near me', osmQuery: 'node["healthcare"="psychotherapist"]', color: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30' },
    { id: 'financial', name: 'Rental & Utility Assistance', query: 'Rental utility financial assistance Community Action Agency near me', osmQuery: 'node["office"="ngo"]', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { id: 'health', name: 'Free Health Clinics', query: 'Free low income health clinic near me', osmQuery: 'node["amenity"="clinic"]', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { id: 'rehab', name: 'Rehab & Detox Clinics', query: 'Substance abuse rehabilitation detox clinic near me', osmQuery: 'node["healthcare"="rehabilitation"]', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
    { id: 'advocacy', name: 'Advocacy & Legal Aid', query: 'Legal aid advocacy services near me', osmQuery: 'node["office"="lawyer"]', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { id: 'employment', name: 'Employment & Job Help', query: 'Job employment assistance workforce center near me', osmQuery: 'node["office"="employment_agency"]', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { id: 'domestic', name: 'Domestic Violence Support', query: 'Domestic violence shelter support near me', osmQuery: 'node["social_facility"="shelter"]', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
    { id: 'youth', name: 'Youth & Family Services', query: 'Youth family services near me', osmQuery: 'node["social_facility"="group_home"]', color: 'bg-lime-500/20 text-lime-400 border-lime-500/30' },
  ];

  const fetchPublicData = async (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category || !location) return;

    setSelectedCategory(categoryId);
    setFetchingData(true);
    setApiResults([]);

    try {
      const radius = 15000;
      const overpassQuery = `
        [out:json][timeout:10];
        (
          ${category.osmQuery}(around:${radius},${location.lat},${location.lng});
        );
        out body 15;
      `;

      const osmRes = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
      });
      const osmData = await osmRes.json();

      const mappedOsm = osmData.elements.map((el: Record<string, unknown>) => {
        const id = el.id as string;
        const tags = el.tags as Record<string, string>;
        return {
          id: `osm-${id}`,
          name: tags?.name || 'Unnamed Facility',
          address: tags?.['addr:street'] ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}` : 'Address not listed',
          phone: tags?.phone || null,
          source: 'Public Health Data (OSM)'
        };
      });

      setApiResults(mappedOsm);
    } catch (_err) {
      console.error("OSM Fetch Error", _err);
    } finally {
      setFetchingData(false);
    }
  };

  const openMapFallback = (query: string) => {
    let url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    if (location) url += `/@${location.lat},${location.lng},13z`;
    window.open(url, '_blank');
  };

  const handleGeocode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualLocationQuery.trim()) return;

    setGeocoding(true);
    setLocError(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualLocationQuery)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        setLocation({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
        setActiveLocationName(data[0].display_name);
        setManualLocationQuery('');
      } else {
        setLocError("Could not find that location. Please try a different search term.");
      }
    } catch {
      setLocError("Error connecting to location service.");
    } finally {
      setGeocoding(false);
    }
  };

  function requestLocation() {
    setLoadingLoc(true);
    setLocError(null);
    setActiveLocationName(null);
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
        setActiveLocationName("Current GPS Location");
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
  }

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    try {
      saveSubmission({
        ...submitForm,
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
      });
      setSubmitStatus('success');
      setTimeout(() => {
        setShowSubmitModal(false);
        setSubmitStatus('idle');
        setSubmitForm({ name: '', type: 'clinic', address: '', description: '' });
      }, 2000);
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6 relative">

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-gradient-to-r from-[#FF1493]/20 to-[#FF1493]/5 border border-[#FF1493]/30 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-black uppercase text-[#FF69B4] tracking-widest">Community Resources</h2>
          <p className="mt-2 text-sm text-white/80 max-w-md">Find harm reduction services, shelters, and clinics nearby. We aggregate public health markers and crowdsourced locations.</p>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-6 py-3 shrink-0 rounded-full bg-[#FF1493] text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Resource
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[#FF1493]" />
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider text-white">Active Location</h3>
              <p className="text-xs text-white/50 uppercase font-bold tracking-widest mt-1">
                {activeLocationName || "Unknown"}
              </p>
            </div>
          </div>

          <form onSubmit={handleGeocode} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. Dallas County, TX"
              className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF1493]/50"
              value={manualLocationQuery}
              onChange={(e) => setManualLocationQuery(e.target.value)}
              disabled={geocoding}
            />
            <button
              type="submit"
              disabled={geocoding || !manualLocationQuery.trim()}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white flex items-center justify-center rounded-xl transition-colors font-bold uppercase tracking-wider text-xs whitespace-nowrap"
            >
              {geocoding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search World"}
            </button>
          </form>
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
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 text-green-400">
              <Navigation className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest font-bold">Location Active - Local Search Enabled</span>
            </div>
            <button
              onClick={requestLocation}
              className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest underline decoration-white/20 underline-offset-4 ml-auto"
            >
              Use My GPS
            </button>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <h3 className="text-white/40 font-black uppercase tracking-widest text-xs ml-2">Find Support Near You</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          {CATEGORIES.map((category) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={category.id}
              onClick={() => fetchPublicData(category.id)}
              className={`p-6 rounded-2xl border flex flex-col justify-between text-left gap-4 ${category.color} transition-all`}
            >
              <div>
                <h4 className="font-black uppercase text-lg tracking-wide">{category.name}</h4>
                <p className="text-xs opacity-80 mt-1 font-medium">Query Public Databases</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80 mt-2">
                <Search className="w-4 h-4" />
                <span>Search Local API</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-[#1a1a1a] border border-white/10 p-6 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black uppercase tracking-widest text-white">
                  {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </h3>
                <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">✕</button>
              </div>

              {fetchingData ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#FF1493]" />
                  <p className="text-sm font-bold uppercase tracking-widest text-[#FF69B4]">Querying Public API...</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {apiResults.length === 0 ? (
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center text-white/60">
                      No results found near your current location via the public API.
                      <div className="mt-4">
                        <button onClick={() => openMapFallback(CATEGORIES.find(c => c.id === selectedCategory)?.query || '')} className="px-4 py-2 bg-[#FF1493] text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-colors inline-block hover:scale-105">
                          Try Google Maps Fallback
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#FF1493] mb-4">Fetched from Open Public Databases</p>
                      {apiResults.map(res => (
                        <div key={res.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2">
                          <h4 className="font-bold text-lg text-[#FF69B4]">{res.name}</h4>
                          <div className="flex items-start gap-2 text-sm text-white/80">
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{res.address}</span>
                          </div>
                          <div className="mt-2 text-xs font-bold uppercase tracking-widest text-white/40 border border-white/10 px-2 py-1 rounded inline-block self-start">
                            Source: {res.source}
                          </div>
                        </div>
                      ))}
                      <div className="pt-6 pb-2 text-center">
                        <button onClick={() => openMapFallback(CATEGORIES.find(c => c.id === selectedCategory)?.query || '')} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
                          Still didn't find what you need? Try Maps
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-[#1a1a1a] border border-white/10 p-6 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black uppercase text-[#FF69B4] tracking-widest mb-2">Submit Resource</h3>
              <p className="text-white/60 text-sm mb-6">Contribute to our local directory. Submissions are saved privately on your device.</p>

              <form onSubmit={handleSubmission} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Resource Name</label>
                  <input required value={submitForm.name} onChange={e => setSubmitForm(s => ({...s, name: e.target.value}))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF1493] transition-colors" placeholder="e.g. Hope Clinic" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Type</label>
                  <select value={submitForm.type} onChange={e => setSubmitForm(s => ({...s, type: e.target.value}))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF1493] appearance-none cursor-pointer">
                    <option value="clinic">Clinic</option>
                    <option value="exchange">Syringe Exchange</option>
                    <option value="shelter">Shelter</option>
                    <option value="pantry">Food Pantry</option>
                    <option value="rehab">Rehab / Detox</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Location / Address</label>
                  <input value={submitForm.address} onChange={e => setSubmitForm(s => ({...s, address: e.target.value}))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF1493] transition-colors" placeholder="Full address or nearby cross-streets" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Description / Provided Services</label>
                  <textarea value={submitForm.description} onChange={e => setSubmitForm(s => ({...s, description: e.target.value}))} className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF1493] transition-colors resize-none" placeholder="What services do they offer?"></textarea>
                </div>

                {submitStatus === 'error' && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm font-bold">
                    Failed to submit. Please try again.
                  </div>
                )}
                {submitStatus === 'success' && (
                  <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm font-bold">
                    Submitted! Saved locally to your device.
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowSubmitModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors">Cancel</button>
                  <button disabled={submitStatus === 'submitting'} type="submit" className="flex-1 px-4 py-3 rounded-xl bg-[#FF1493] text-white font-bold hover:scale-105 transition-transform flex justify-center items-center">
                    {submitStatus === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
