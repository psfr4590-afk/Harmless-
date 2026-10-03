import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, ExternalLink, Loader2, AlertCircle, Phone, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildOverpassQuery, dedupeById, safeExternalUrl, extractOverpassElements } from '../utils/safetyUtils';
import { searchFindTreatment } from '../utils/medicalApi';
import CoverageNotice from './CoverageNotice';

interface OverpassElement { type: string; id: string | number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string>; }

interface FindTreatmentRow { [key: string]: string | number | null | undefined; }

interface ResourceResult {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  distance: number | null;
  source: string;
  sourceUrl?: string;
  retrievedAt?: string;
}

const CATEGORIES = [
  { id: 'narcan', name: 'Narcan / Naloxone', query: 'Narcan Naloxone harm reduction overdose', searchTerms: ['naloxone', 'narcan', 'harm reduction', 'overdose prevention', 'pharmacy'], osm: ['["healthcare"="pharmacy"]', '["name"~"naloxone|narcan|harm reduction|overdose",i]', '["description"~"naloxone|narcan|harm reduction|overdose",i]'], color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'needle', name: 'Needle Exchange Programs', query: 'syringe needle exchange harm reduction', searchTerms: ['syringe service', 'needle exchange', 'syringe exchange', 'harm reduction'], osm: ['["social_facility"="syringe_exchange"]', '["name"~"syringe|needle exchange|harm reduction",i]', '["description"~"syringe|needle exchange|harm reduction",i]'], color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'housing', name: 'Homeless Shelters & Housing', query: 'homeless shelter housing assistance', searchTerms: ['homeless shelter', 'emergency shelter', 'transitional housing', 'housing assistance'], osm: ['["social_facility"="shelter"]', '["amenity"="shelter"]', '["name"~"shelter|homeless|housing",i]'], color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: 'food', name: 'Food Pantries & Meals', query: 'food pantry food bank soup kitchen', searchTerms: ['food pantry', 'food bank', 'soup kitchen', 'community meals', 'food assistance'], osm: ['["social_facility"="food_bank"]', '["amenity"="food_bank"]', '["amenity"="social_centre"]["name"~"food|pantry|soup kitchen|meal",i]', '["amenity"="community_centre"]["name"~"food|pantry|soup kitchen|meal",i]', '["name"~"food pantry|food bank|soup kitchen|community food|food assistance",i]', '["description"~"food pantry|food bank|soup kitchen|food assistance|free food",i]'], color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'mental', name: 'Mental Health Services', query: 'mental health counseling crisis services', searchTerms: ['mental health', 'behavioral health', 'counseling', 'crisis mental health'], osm: ['["healthcare"="psychotherapist"]', '["healthcare"="mental_health"]', '["name"~"mental health|behavioral health|crisis",i]'], color: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30' },
  { id: 'financial', name: 'Rental & Utility Assistance', query: 'rental utility financial assistance community action', searchTerms: ['rent assistance', 'rental assistance', 'utility assistance', 'community action'], osm: ['["office"="ngo"]["name"~"community action|utility|rental|housing assistance",i]', '["name"~"rental assistance|utility assistance|community action",i]', '["description"~"rental assistance|utility assistance",i]'], color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'health', name: 'Free Health Clinics', query: 'free low income community health clinic', searchTerms: ['community health clinic', 'free clinic', 'low income clinic', 'federally qualified health center'], osm: ['["amenity"="clinic"]', '["healthcare"="clinic"]', '["name"~"free clinic|community health|low income",i]'], color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'rehab', name: 'Rehab & Detox Clinics', query: 'substance use rehabilitation detox treatment', searchTerms: ['substance use treatment', 'drug rehab', 'alcohol treatment', 'detox', 'addiction treatment'], osm: ['["healthcare"="rehabilitation"]', '["healthcare"="addiction"]', '["name"~"rehab|detox|addiction|substance use",i]'], color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { id: 'advocacy', name: 'Advocacy & Legal Aid', query: 'legal aid advocacy services', searchTerms: ['legal aid', 'legal services', 'pro bono legal', 'advocacy'], osm: ['["office"="lawyer"]["name"~"legal aid|advocacy|pro bono",i]', '["name"~"legal aid|legal services|advocacy|pro bono",i]'], color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'employment', name: 'Employment & Job Help', query: 'job employment workforce assistance', searchTerms: ['workforce center', 'employment assistance', 'job center', 'career services'], osm: ['["office"="employment_agency"]', '["name"~"workforce|employment|job center|career",i]'], color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'domestic', name: 'Domestic Violence Support', query: 'domestic violence shelter support', searchTerms: ['domestic violence', 'family violence', 'sexual assault services', 'victim advocacy'], osm: ['["name"~"domestic violence|women.s shelter|family violence",i]', '["description"~"domestic violence|family violence",i]', '["social_facility"="shelter"]["name"~"women|family",i]'], color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'youth', name: 'Youth & Family Services', query: 'youth family services', searchTerms: ['youth services', 'family services', 'children services', 'teen services'], osm: ['["social_facility"="group_home"]', '["name"~"youth|teen|family services|children",i]'], color: 'bg-lime-500/20 text-lime-400 border-lime-500/30' },
];

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = 6371;
  const dLat = (bLat - aLat) * Math.PI / 180;
  const dLng = (bLng - aLng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(x));
}

export default function ResourceSearch() {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [apiResults, setApiResults] = useState<ResourceResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [manualLocationQuery, setManualLocationQuery] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [activeLocationName, setActiveLocationName] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  // Location is requested only after an explicit user action.


  const fetchPublicData = async (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category || !location) return;
    setSelectedCategory(categoryId);
    setFetchingData(true);
    setSearchError(null);
    setApiResults([]);

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    try {
      const results: ResourceResult[] = [];
      let treatmentWarning: string | null = null;

      if (categoryId === 'rehab' || categoryId === 'mental') {
        // FindTreatment.gov is a U.S. federal directory. Do not query or
        // describe it as worldwide coverage. All locations still use the
        // broader OpenStreetMap discovery path below.
        let countryCode: string | null = null;
        try {
          const reverse = new URL('https://nominatim.openstreetmap.org/reverse');
          reverse.searchParams.set('format', 'jsonv2');
          reverse.searchParams.set('lat', String(location.lat));
          reverse.searchParams.set('lon', String(location.lng));
          reverse.searchParams.set('zoom', '3');
          const reverseRes = await fetch(reverse.toString(), { signal: controller.signal, headers: { Accept: 'application/json' } });
          if (reverseRes.ok) {
            const reverseData = await reverseRes.json();
            countryCode = typeof reverseData?.address?.country_code === 'string'
              ? reverseData.address.country_code.toLowerCase()
              : null;
          }
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') return;
        }

        if (countryCode === 'us') try {
          const treatment = await searchFindTreatment({
            lat: location.lat,
            lng: location.lng,
            radiusMeters: 50000,
            type: categoryId === 'mental' ? 'MH' : 'SA',
            codes: [],
            signal: controller.signal
          });

          const treatmentRows = treatment.records.map((row: FindTreatmentRow, index: number) => {
            const name = [row.name1, row.name2].filter(Boolean).join(' ').trim() || row.facilityName || row.FACILITY_NAME || row.name || row.NAME || row.facility || row.FACILITY;
            const address = row.address || row.ADDRESS || [row.street1, row.street2, row.city, row.state, row.zip].filter(Boolean).join(', ');
            const phone = row.phone || row.PHONE || row.telephone || row.TELEPHONE || row.intake1 || row.hotline1 || null;
            const lat = Number(row.latitude ?? row.LATITUDE ?? row.lat);
            const lng = Number(row.longitude ?? row.LONGITUDE ?? row.lng ?? row.lon);
            if (!name) return null;
            return {
              id: `samhsa-${row.facilityId || row.FACILITY_ID || row.id || index}`,
              name: String(name),
              address: String(address || 'Address not listed'),
              phone: phone ? String(phone) : null,
              website: row.website ? (String(row.website).startsWith('http') ? row.website : `https://${row.website}`) : row.WEBSITE || null,
              distance: Number.isFinite(lat) && Number.isFinite(lng) ? distanceKm(location.lat, location.lng, lat, lng) : null,
              source: treatment.source,
              sourceUrl: treatment.sourceUrl,
              retrievedAt: treatment.retrievedAt
            } as ResourceResult;
          }).filter(Boolean) as ResourceResult[];

          results.push(...treatmentRows);
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') return;
          treatmentWarning = 'SAMHSA FindTreatment.gov was unavailable for this U.S. search. Geographic OpenStreetMap results below are secondary records and do not establish that treatment is absent.';
        }
      }

      const overpassQuery = buildOverpassQuery(category.osm, location.lat, location.lng);
      const osmRes = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: overpassQuery, signal: controller.signal });
      if (!osmRes.ok) throw new Error(`Public data service returned HTTP ${osmRes.status}`);
      const osmData = await osmRes.json();
      const elements = extractOverpassElements(osmData);
      if (!elements) throw new Error('Public data service returned an unexpected response format.');

      results.push(...elements.map((el: OverpassElement) => {
        const tags = el.tags || {};
        const lat = el.lat ?? el.center?.lat;
        const lng = el.lon ?? el.center?.lon;
        const addressParts = [
          [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' '),
          tags['addr:city'],
          tags['addr:state'],
          tags['addr:postcode']
        ].filter(Boolean);
        return {
          id: `osm-${el.type}-${el.id}`,
          name: tags.name || tags.operator || 'Unnamed facility',
          address: addressParts.join(', ') || 'Address not listed',
          phone: tags.phone || tags['contact:phone'] || null,
          website: tags.website || tags['contact:website'] || null,
          distance: typeof lat === 'number' && typeof lng === 'number' ? distanceKm(location.lat, location.lng, lat, lng) : null,
          source: 'OpenStreetMap',
          sourceUrl: 'https://www.openstreetmap.org/',
          retrievedAt: new Date().toISOString()
        } as ResourceResult;
      }).filter((item: ResourceResult) => item.name !== 'Unnamed facility' || item.phone || item.website));

      // OSM tagging is inconsistent for community resources. If structured
      // Overpass selectors return nothing, use Nominatim text search as a
      // second OSM-backed discovery path. An empty Overpass result is not
      // evidence that a service does not exist.
      // OSM coverage is incomplete and community services are tagged inconsistently.
      // Run several bounded text searches when structured discovery returns few records.
      if (results.length < 3) {
        const delta = 0.45;
        const viewbox = [location.lng - delta, location.lat + delta, location.lng + delta, location.lat - delta].join(',');
        const terms = category.searchTerms || [category.query];
        const existingNames = new Set(results.map(item => item.name.toLowerCase()));
        for (const term of terms.slice(0, 5)) {
          if (existingNames.size >= 20) break;
          try {
            const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
            nominatimUrl.searchParams.set('format', 'jsonv2');
            nominatimUrl.searchParams.set('q', term);
            nominatimUrl.searchParams.set('limit', '10');
            nominatimUrl.searchParams.set('viewbox', viewbox);
            nominatimUrl.searchParams.set('bounded', '1');
            const nominatimRes = await fetch(nominatimUrl.toString(), { signal: controller.signal, headers: { Accept: 'application/json' } });
            if (!nominatimRes.ok) continue;
            const nominatimData = await nominatimRes.json();
            if (!Array.isArray(nominatimData)) continue;
            for (const [index, item] of nominatimData.entries()) {
              const name = item.name || item.display_name?.split(',')[0] || 'Unnamed facility';
              if (name === 'Unnamed facility' || existingNames.has(String(name).toLowerCase())) continue;
              const lat = Number(item.lat);
              const lng = Number(item.lon);
              results.push({
                id: 'nominatim-' + (item.place_id || term) + '-' + index,
                name: String(name),
                address: item.display_name || item.address?.road || 'Address not listed',
                phone: null,
                website: null,
                distance: Number.isFinite(lat) && Number.isFinite(lng) ? distanceKm(location.lat, location.lng, lat, lng) : null,
                source: 'OpenStreetMap Nominatim',
                sourceUrl: 'https://nominatim.openstreetmap.org/',
                retrievedAt: new Date().toISOString()
              } as ResourceResult);
              existingNames.add(String(name).toLowerCase());
              if (existingNames.size >= 20) break;
            }
          } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') return;
          }
        }
      }

      const finalResults = dedupeById(results.map(item => ({ ...item, website: item.website && safeExternalUrl(item.website) ? safeExternalUrl(item.website) : null })))
        .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999))
        .slice(0, 50);

      if (requestId !== requestIdRef.current) return;
      setApiResults(finalResults);
      if (treatmentWarning) setSearchError(treatmentWarning);
      if (finalResults.length === 0) {
        setSearchError(treatmentWarning ? treatmentWarning + ' No matching records were returned by the connected sources. Use the broader directory links below rather than treating this as proof that services are absent.' : 'No matching records were returned by the connected sources. The connected geographic sources may not contain this service. Use the broader directory links below rather than treating this as proof that services are absent.');
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      if (requestId === requestIdRef.current) setSearchError(err instanceof Error ? err.message : 'Unable to query the connected resource databases.');
    } finally {
      if (requestId === requestIdRef.current) setFetchingData(false);
    }
  };

  const openMapFallback = (query: string) => {
    const suffix = location ? `/@${location.lat},${location.lng},13z` : '';
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}${suffix}`, '_blank', 'noopener,noreferrer');
  };

  const handleGeocode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!manualLocationQuery.trim()) return;
    setGeocoding(true);
    setLocError(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(manualLocationQuery)}`);
      if (!res.ok) throw new Error(`Location service returned HTTP ${res.status}`);
      const data = await res.json();
      if (!data?.length) throw new Error('Could not find that location. Try a city, ZIP code, or address.');
      setLocation({ lat: Number(data[0].lat), lng: Number(data[0].lon) });
      setActiveLocationName(data[0].display_name);
      setManualLocationQuery('');
    } catch (err) {
      setLocError(err instanceof Error ? err.message : 'Error connecting to location service.');
    } finally {
      setGeocoding(false);
    }
  };

  function requestLocation() {
    setLoadingLoc(true);
    setLocError(null);
    setActiveLocationName(null);
    if (!navigator.geolocation) { setLocError('Geolocation is not supported by your browser.'); setLoadingLoc(false); return; }
    navigator.geolocation.getCurrentPosition(
      position => { setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }); setActiveLocationName('Current GPS Location'); setLoadingLoc(false); },
      error => {
        const msg = error.code === 1 ? 'Location access denied. Use the location search above instead.' : error.code === 2 ? 'Position unavailable. Use the location search above instead.' : error.code === 3 ? 'Location request timed out. Use the location search above instead.' : 'Failed to get location. Use the location search above instead.';
        setLocError(msg); setLoadingLoc(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }

  useEffect(() => () => { requestIdRef.current += 1; }, []);

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6 relative">
      <div className="bg-gradient-to-r from-[#FF1493]/20 to-[#FF1493]/5 border border-[#FF1493]/30 rounded-2xl p-6">
        <h2 className="text-xl font-black uppercase text-[#FF69B4] tracking-widest">Local Resources</h2>
        <p className="mt-2 text-sm text-white/80 max-w-2xl">Search connected treatment and geographic sources near the selected location. Harmless is intended for people anywhere in the world. Geographic discovery uses OpenStreetMap sources worldwide; U.S. substance-use and mental-health searches may also use SAMHSA FindTreatment.gov. Results include source and retrieval metadata, and a missing result does not establish that a service is absent.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[#FF1493]" />
            <div><h3 className="text-xl font-black uppercase tracking-wider text-white">Active Location</h3><p className="text-xs text-white/50 uppercase font-bold tracking-widest mt-1">{activeLocationName || 'Unknown'}</p></div>
          </div>
          {!location && !loadingLoc && <button type="button" onClick={requestLocation} className="px-5 py-3 mb-4 bg-[#FF1493]/20 border border-[#FF1493]/40 text-[#FF69B4] rounded-xl text-xs font-black uppercase tracking-widest">Use My Location</button>}
          <form onSubmit={handleGeocode} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <input type="text" placeholder="e.g. Dallas County, TX" className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF1493]/50" value={manualLocationQuery} onChange={e => setManualLocationQuery(e.target.value)} disabled={geocoding} />
            <button type="submit" disabled={geocoding || !manualLocationQuery.trim()} className="px-6 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white flex items-center justify-center rounded-xl transition-colors font-bold uppercase tracking-wider text-xs whitespace-nowrap">{geocoding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search World'}</button>
          </form>
        </div>
        {loadingLoc ? <div className="flex items-center gap-3 text-white/60"><Loader2 className="w-5 h-5 animate-spin text-[#FF1493]" /><span className="text-sm uppercase tracking-widest font-bold">Acquiring GPS coordinates...</span></div> :
          locError ? <div className="flex flex-col gap-3"><div className="flex items-center gap-3 text-red-400"><AlertCircle className="w-5 h-5" /><span className="text-sm font-bold">{locError}</span></div><button onClick={requestLocation} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold uppercase tracking-wider self-start">Retry GPS</button></div> :
          location ? <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 pt-4 border-t border-white/10"><div className="flex items-center gap-3 text-green-400"><Navigation className="w-5 h-5" /><span className="text-sm uppercase tracking-widest font-bold">Location Active - Local Search Enabled</span></div><button onClick={requestLocation} className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest underline ml-auto">Use My GPS</button></div> : null}
      </div>

      <div className="space-y-4">
        <h3 className="text-white/40 font-black uppercase tracking-widest text-xs ml-2">Find Support Near You</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          {CATEGORIES.map(category => <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={category.id} onClick={() => fetchPublicData(category.id)} disabled={!location || fetchingData} className={`p-6 rounded-2xl border flex flex-col justify-between text-left gap-4 ${category.color} transition-all disabled:opacity-40`}>
            <div><h4 className="font-black uppercase text-lg tracking-wide">{category.name}</h4><p className="text-xs opacity-80 mt-1 font-medium">Search connected sources</p></div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80 mt-2"><Search className="w-4 h-4" /><span>Search live sources</span><ExternalLink className="w-3 h-3 ml-auto" /></div>
          </motion.button>)}
        </div>
      </div>

      <AnimatePresence>
        {selectedCategory && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="resource-results-dialog-title">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-[#1a1a1a] border border-white/10 p-6 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4"><h3 id="resource-results-dialog-title" className="text-2xl font-black uppercase tracking-widest text-white">{CATEGORIES.find(c => c.id === selectedCategory)?.name}</h3><button type="button" aria-label="Close local resource results" onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-white/10 rounded-full text-white">✕</button></div>
            {fetchingData ? <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF1493]" /><p className="text-sm font-bold uppercase tracking-widest text-[#FF69B4]">Searching public records...</p></div> :
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {searchError && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">{searchError}</div>}
                {apiResults.map(res => <div key={res.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2">
                  <h4 className="font-bold text-lg text-[#FF69B4]">{res.name}</h4>
                  <div className="flex items-start gap-2 text-sm text-white/80"><MapPin className="w-4 h-4 shrink-0 mt-0.5" /><span>{res.address}</span></div>
                  {res.distance !== null && <div className="text-xs text-white/50">{res.distance.toFixed(1)} km away</div>}
                  {res.phone && <a href={`tel:${res.phone}`} className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"><Phone className="w-4 h-4" />{res.phone}</a>}
                  {res.website && safeExternalUrl(res.website) && <a href={safeExternalUrl(res.website) as string} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"><Globe className="w-4 h-4" />Website</a>}
                  <div className="text-xs font-bold uppercase tracking-widest text-white/40">Source: {res.source}{res.retrievedAt ? ` • Retrieved ${new Date(res.retrievedAt).toLocaleString()}` : ''}</div>{res.sourceUrl && <a href={res.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 inline-flex items-center gap-1"><Globe className="w-3 h-3" />Open source</a>}
                </div>)}
                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  <button onClick={() => openMapFallback(CATEGORIES.find(c => c.id === selectedCategory)?.query || '')} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider">Search broader map results</button>
                  <a href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(CATEGORIES.find(c => c.id === selectedCategory)?.query || '')}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-300 rounded-xl text-xs font-bold uppercase tracking-wider">OpenStreetMap worldwide search</a>
                  <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-bold uppercase tracking-wider">Find A Helpline</a>
                </div>
                {!fetchingData && apiResults.length === 0 && !searchError && <div className="p-6 text-center text-white/60">No records from connected geographic sources. This is not evidence that no help exists.</div>}
              </div>}
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
