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
            To provide life-saving features, Harm.Less requires certain device permissions. By acknowledging this notice, you understand why these permissions are needed. You will still be prompted by your device to accept or deny them when they are used.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500/20 p-3 rounded-full mt-1">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white tracking-wide">Location</h3>
              <p className="text-sm text-white/60 leading-relaxed mt-1">Used exclusively to find nearby harm reduction resources, shelters, and clinics in your exact area.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-500/20 p-3 rounded-full mt-1">
              <PhoneCall className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-white tracking-wide">Phone Dialing</h3>
              <p className="text-sm text-white/60 leading-relaxed mt-1">Used to immediately dial emergency services, hotlines, or Never Use Alone without leaving the app.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-purple-500/20 p-3 rounded-full mt-1">
              <Camera className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-white tracking-wide">Camera</h3>
              <p className="text-sm text-white/60 leading-relaxed mt-1">Required for an upcoming update (e.g., visual substance/test strip identification). Not currently active.</p>
            </div>
          </div>
        </div>

        <button
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