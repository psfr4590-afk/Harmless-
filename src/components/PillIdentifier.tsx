import React, { useState, useRef } from 'react';
import { Camera, Search, AlertOctagon, ExternalLink, X } from 'lucide-react';

export default function PillIdentifier() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [imprint, setImprint] = useState('');
  const [color, setColor] = useState('12'); // '12' is wildcard for multi on drugs.com, but let's leave blank by default or use standard mapping
  const [shape, setShape] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const clearPhoto = () => {
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (imprint) params.append('imprint', imprint);
    if (color) params.append('color', color);
    if (shape) params.append('shape', shape);
    
    window.open(`https://www.drugs.com/imprints.php?${params.toString()}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6">
      
      {/* Disclaimer */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
        <h2 className="text-sm font-black uppercase text-red-500 tracking-widest flex items-center gap-3">
          <AlertOctagon className="w-5 h-5" />
          Critical Warning
        </h2>
        <p className="mt-3 text-white/80 text-sm leading-relaxed font-mono">
          Counterfeit pills are highly prevalent. Even if a pill perfectly matches the visual markings, shape, and color of a legitimate pharmaceutical drug, it may contain lethal amounts of fentanyl, xylazine, or nitazenes. 
          Pill identification is NOT a substitute for chemical test strips or lab testing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Camera/Photo Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col space-y-4">
          <h2 className="text-lg font-black uppercase tracking-widest text-[#FF69B4] flex items-center gap-2">
            <Camera className="w-6 h-6" />
            Scan Pill Markings
          </h2>
          <p className="text-sm text-white/60">
            Use your device's camera as a magnifier. Take a clear, well-lit photo of the pill's imprint to inspect it closely.
          </p>

          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleCapture}
          />

          {!photoUrl ? (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 min-h-[200px] border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 hover:border-[#FF1493]/50 transition-all text-white/50"
            >
              <Camera className="w-12 h-12 text-[#FF69B4]" />
              <div className="text-center">
                <span className="block font-bold tracking-widest uppercase text-white/80">Tap To Open Camera</span>
                <span className="text-xs">Or select from gallery</span>
              </div>
            </button>
          ) : (
            <div className="relative flex-1 bg-black rounded-xl border border-white/10 overflow-hidden flex items-center justify-center min-h-[200px]">
              <img 
                src={photoUrl} 
                alt="Captured pill" 
                className="max-h-[300px] object-contain w-full"
              />
              <button 
                onClick={clearPhoto}
                className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white/80 hover:text-white hover:bg-[#FF1493] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Lookup Details Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col space-y-4">
          <h2 className="text-lg font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
            <Search className="w-6 h-6" />
            Lookup Information
          </h2>
          
          <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">Imprint (Letters & Numbers)</label>
              <input 
                type="text" 
                value={imprint}
                onChange={(e) => setImprint(e.target.value)}
                placeholder="e.g. M 30, Xanax, 512"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 font-mono"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">Color</label>
              <select 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 appearance-none font-medium"
              >
                <option value="">Any Color</option>
                <option value="1">Black</option>
                <option value="2">Blue</option>
                <option value="3">Brown</option>
                <option value="4">Clear</option>
                <option value="5">Gold</option>
                <option value="6">Gray</option>
                <option value="7">Green</option>
                <option value="8">Orange</option>
                <option value="9">Pink</option>
                <option value="10">Purple</option>
                <option value="11">Red</option>
                <option value="12">White</option>
                <option value="13">Yellow</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">Shape</label>
              <select 
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 appearance-none font-medium"
              >
                <option value="">Any Shape</option>
                <option value="1">Round</option>
                <option value="2">Capsule</option>
                <option value="3">Oval</option>
                <option value="4">Egg</option>
                <option value="5">Barrel</option>
                <option value="6">Rectangle</option>
                <option value="11">Triangle</option>
                <option value="13">Heart</option>
                <option value="14">Square</option>
                <option value="24">Hexagon</option>
                <option value="25">Octagon</option>
                <option value="26">Pentagon</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleSearch}
            disabled={!imprint && !color && !shape}
            className="w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
          >
            <Search className="w-5 h-5" />
            Search Database
            <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
          </button>
        </div>

      </div>
    </div>
  );
}
