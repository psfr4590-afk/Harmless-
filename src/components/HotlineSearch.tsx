import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, ExternalLink, Loader2, AlertCircle, PhoneCall, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { buildOverpassQuery, dedupeById, safeExternalUrl, extractOverpassElements } from '../utils/safetyUtils';

const LOCAL_SEARCHES = [
  { id: 'crisis', name: 'Local Crisis Centers', query: 'mental health crisis center', osm: ['["name"~"crisis|behavioral health|mental health",i]', '["healthcare"="mental_health"]', '["amenity"="clinic"]["name"~"mental|crisis",i]'], color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'substance', name: 'Substance Use Centers', query: 'substance use treatment', osm: ['["healthcare"="addiction"]', '["healthcare"="rehabilitation"]', '["name"~"substance use|addiction|recovery|detox",i]'], color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'domestic', name: 'Domestic Violence Shelters', query: 'domestic violence shelter', osm: ['["name"~"domestic violence|family violence|women.s shelter",i]', '["social_facility"="shelter"]["name"~"women|family|violence",i]'], color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'youth', name: 'Youth & Teen Services', query: 'youth crisis services', osm: ['["name"~"youth|teen|children|family services",i]'], color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'meetings', name: 'Local NA/AA Services', query: 'NA AA meetings', osm: ['["name"~"narcotics anonymous|alcoholics anonymous|\\bNA\\b|\\bAA\\b",i]', '["description"~"narcotics anonymous|alcoholics anonymous",i]'], color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
];

interface LocalResult { id: string; name: string; address: string; phone: string | null; website: string | null; distance: number | null; }

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = 6371, dLat = (bLat - aLat) * Math.PI / 180, dLng = (bLng - aLng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(x));
}

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
  const [results, setResults] = useState<LocalResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => { requestLocation(); }, []);

  function requestLocation() {
    setLoadingLoc(true); setLocError(null);
    if (!navigator.geolocation) { setLocError('Geolocation is not supported by your browser.'); setLoadingLoc(false); return; }
    navigator.geolocation.getCurrentPosition(
      p => { setLocation({ lat: p.coords.latitude, lng: p.coords.longitude }); setLoadingLoc(false); },
      e => { setLocError(e.code === 1 ? 'Location access denied.' : e.code === 2 ? 'Position unavailable.' : e.code === 3 ? 'Location request timed out.' : 'Failed to get location.'); setLoadingLoc(false); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }

  async function searchLocal(categoryId: string) {
    const category = LOCAL_SEARCHES.find(c => c.id === categoryId);
    if (!category || !location) return;
    setSelected(categoryId); setSearching(true); setSearchError(null); setResults([]);
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    try {
      const query = buildOverpassQuery(category.osm, location.lat, location.lng);
      const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query, signal: controller.signal });
      if (!res.ok) throw new Error(`Public directory returned HTTP ${res.status}`);
      const data = await res.json();
      const elements = extractOverpassElements(data);
      if (!elements) throw new Error('Public directory returned an unexpected response format.');
      const mapped: LocalResult[] = dedupeById<LocalResult>(elements.map((el: any) => {
        const t = el.tags || {}, lat = el.lat ?? el.center?.lat, lng = el.lon ?? el.center?.lon;
        const address = [[t['addr:housenumber'], t['addr:street']].filter(Boolean).join(' '), t['addr:city'], t['addr:state'], t['addr:postcode']].filter(Boolean).join(', ');
        return { id: `osm-${el.type}-${el.id}`, name: t.name || t.operator || 'Unnamed service', address: address || 'Address not listed', phone: t.phone || t['contact:phone'] || null, website: t.website || t['contact:website'] || null, distance: typeof lat === 'number' && typeof lng === 'number' ? distanceKm(location.lat, location.lng, lat, lng) : null };
      })).filter((x: LocalResult) => x.phone || x.website || x.name !== 'Unnamed service').sort((a: LocalResult,b: LocalResult) => (a.distance ?? 9999) - (b.distance ?? 9999)).slice(0, 50);
      if (requestId !== requestIdRef.current) return;
      setResults(mapped);
      if (!mapped.length) setSearchError('No mapped local services with contact information were found within 20 km.');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      if (requestId === requestIdRef.current) setSearchError(err instanceof Error ? err.message : 'Unable to search the public directory.');
    } finally { if (requestId === requestIdRef.current) setSearching(false); }
  }

  useEffect(() => () => { requestIdRef.current += 1; }, []);

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-[#FF1493]/10 border border-[#FF1493]/30 rounded-2xl p-6">
        <h2 className="text-xl font-black uppercase text-[#FF69B4] tracking-widest flex items-center gap-3"><PhoneCall className="w-8 h-8" />Crisis & Support Lines</h2>
        <p className="mt-3 text-white/80 text-sm leading-relaxed">National direct-dial hotlines are listed below. Local searches now query mapped public records for nearby services and their published contact details. Missing data does not mean a service is unavailable.</p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4"><MapPin className="w-6 h-6 text-[#FF1493]" /><h3 className="text-lg font-black uppercase tracking-wider text-white">Location Status</h3></div>
        {loadingLoc ? <div className="flex items-center gap-3 text-white/60"><Loader2 className="w-5 h-5 animate-spin text-[#FF1493]" /><span className="text-sm uppercase tracking-widest font-bold">Acquiring GPS coordinates...</span></div> :
          locError ? <div className="flex flex-col gap-3"><div className="flex items-center gap-3 text-red-400"><AlertCircle className="w-5 h-5" /><span className="text-sm font-bold">{locError}</span></div><button onClick={requestLocation} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold uppercase tracking-wider self-start">Retry</button></div> :
          location ? <div className="flex items-center gap-3 text-green-400"><Navigation className="w-5 h-5" /><span className="text-sm uppercase tracking-widest font-bold">Location Active - Local Search Enabled</span></div> : null}
      </div>
      <div className="space-y-4">
        <h3 className="text-white/40 font-black uppercase tracking-widest text-xs ml-2">Direct Dial National Hotlines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{NATIONAL_HOTLINES.map(hl => <a key={hl.id} href={`tel:${hl.number}`} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between group"><div><h4 className="font-black uppercase text-lg tracking-wide text-white">{hl.name}</h4><p className="text-xs text-white/60 font-medium mt-1">{hl.desc}</p><p className="text-sm font-bold text-[#FF69B4] mt-2">{hl.number}</p></div><PhoneCall className="w-8 h-8 text-[#FF1493] group-hover:scale-110 transition-transform" /></a>)}</div>
      </div>
      <div className="space-y-4 pb-8">
        <h3 className="text-white/40 font-black uppercase tracking-widest text-xs ml-2">Find Local Services & Contact Numbers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{LOCAL_SEARCHES.map(category => <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={category.id} onClick={() => searchLocal(category.id)} disabled={!location || searching} className={`p-6 rounded-2xl border flex flex-col justify-between text-left gap-4 ${category.color} transition-all disabled:opacity-40`}><div><h4 className="font-black uppercase text-lg tracking-wide">{category.name}</h4><p className="text-xs opacity-80 mt-1 font-medium">Search mapped public records</p></div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80 mt-2"><Search className="w-4 h-4" /><span>Find Local Numbers</span><ExternalLink className="w-3 h-3 ml-auto" /></div></motion.button>)}</div>
      </div>
      {selected && <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col"><div className="flex items-center justify-between mb-4"><h3 className="text-2xl font-black uppercase tracking-widest text-white">{LOCAL_SEARCHES.find(c => c.id === selected)?.name}</h3><button onClick={() => setSelected(null)} className="p-2 hover:bg-white/10 rounded-full text-white">✕</button></div>{searching ? <div className="flex flex-col items-center justify-center gap-4 py-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF1493]" /><p className="text-sm font-bold uppercase tracking-widest text-[#FF69B4]">Searching public records...</p></div> : <div className="overflow-y-auto space-y-4">{searchError && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">{searchError}</div>}{results.map(r => <div key={r.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2"><h4 className="font-bold text-lg text-[#FF69B4]">{r.name}</h4><div className="text-sm text-white/80 flex gap-2"><MapPin className="w-4 h-4 shrink-0" />{r.address}</div>{r.distance !== null && <div className="text-xs text-white/50">{r.distance.toFixed(1)} km away</div>}{r.phone && <a href={`tel:${r.phone}`} className="flex items-center gap-2 text-sm text-green-400"><PhoneCall className="w-4 h-4" />{r.phone}</a>}{r.website && safeExternalUrl(r.website) && <a href={safeExternalUrl(r.website) as string} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-400"><Globe className="w-4 h-4" />Website</a>}</div>)}{results.length === 0 && !searchError && <div className="text-center text-white/60 p-6">No results found.</div>}</div>}</div></div>}
    </div>
  );
}
