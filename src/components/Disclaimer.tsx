import React from 'react';
import { ShieldAlert, MapPin, PhoneCall, Camera, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface DisclaimerProps {
  onAcknowledge: () => void;
}

export default function Disclaimer({ onAcknowledge }: DisclaimerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6 text-white"
    >
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FF1493]/20 flex items-center justify-center mb-2">
            <ShieldAlert className="w-8 h-8 text-[#FF69B4]" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-[#FF69B4]">Disclaimer & Permissions</h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Harm.Less provides educational harm-reduction information and links to public resources. It is not a substitute for emergency care, medical advice, diagnosis, treatment, or legal advice. Device permissions are requested only when a current feature needs them.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500/20 p-3 rounded-full mt-1"><MapPin className="w-6 h-6 text-blue-400" /></div>
            <div>
              <h3 className="font-bold text-white tracking-wide">Location</h3>
              <p className="text-sm text-white/60 leading-relaxed mt-1">Used to find nearby mapped resources. Current GPS coordinates may be sent to public geocoding/search services when those features are used. Manual location search is also available.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-500/20 p-3 rounded-full mt-1"><PhoneCall className="w-6 h-6 text-green-400" /></div>
            <div>
              <h3 className="font-bold text-white tracking-wide">Phone Dialing</h3>
              <p className="text-sm text-white/60 leading-relaxed mt-1">National hotline entries use telephone links. The Never Use Alone dashboard button opens the service website rather than directly placing a call.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-purple-500/20 p-3 rounded-full mt-1"><Camera className="w-6 h-6 text-purple-400" /></div>
            <div>
              <h3 className="font-bold text-white tracking-wide">Camera / Photos</h3>
              <p className="text-sm text-white/60 leading-relaxed mt-1">The Pill Identifier can open the device camera or image picker so you can inspect pill markings. Images are displayed locally for this workflow; the current identifier does not upload the photo to a server.</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Acknowledge the disclaimer and continue"
          onClick={onAcknowledge}
          className="w-full py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 bg-white/10 text-white hover:bg-[#FF1493] hover:shadow-[0_0_20px_rgba(255,20,147,0.5)] border border-white/10"
        >
          <Check className="w-5 h-5" />
          I Understand
        </button>
      </div>
    </motion.div>
  );
}