import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';

const AFFIRMATIONS = [
  "You carry immeasurable value, exactly as you are right now.",
  "Your story is not over. Healing is not linear, and that is okay.",
  "You do not have to be perfect to be deserving of safety, love, and care.",
  "There is profound strength in simply choosing to stay here today.",
  "Your past does not dictate your future. You hold the pen to your own story.",
  "You are not alone, even when the world feels overwhelmingly heavy.",
  "Small steps forward are still steps forward. Be gentle with yourself.",
  "You are worthy of a life that feels peaceful and good.",
  "Your breath is proof that you still have a purpose here.",
  "Forgive yourself for the things you did in survival mode.",
  "Protecting your life today is a radical act of self-love."
];

export default function AffirmationLanding({ onContinue }: { onContinue: () => void }) {
  const [affirmation] = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);

  return (
    <motion.div 
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="min-h-[100dvh] bg-[#121212] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF1493]/10 via-[#121212] to-[#121212] opacity-50"></div>
      
      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          <Heart className="w-16 h-16 text-[#FF1493] drop-shadow-[0_0_15px_rgba(255,20,147,0.8)] mx-auto animate-pulse" />
          <h1 className="text-3xl font-black text-[#FF69B4] mt-6 uppercase tracking-widest">Harm.Less</h1>
        </motion.div>

        <AnimatePresence>
          {affirmation && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-2xl md:text-3xl font-medium text-white/90 leading-relaxed italic px-4"
            >
              "{affirmation}"
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          onClick={onContinue}
          className="mt-12 flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 hover:bg-[#FF1493]/20 border border-white/10 hover:border-[#FF1493]/50 text-white transition-all group"
        >
          <span className="font-bold uppercase tracking-widest text-sm">Enter Dashboard</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#FF1493]" />
        </motion.button>
      </div>
    </motion.div>
  );
}
