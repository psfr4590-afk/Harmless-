import React from 'react';
import { MessageSquare, ExternalLink, Globe, Info, AlertOctagon, LifeBuoy } from 'lucide-react';

const LINKS = [
  {
    id: 'helpline',
    title: 'Find A Helpline',
    desc: 'Country-specific crisis and emotional-support helplines with verified listings in 175+ countries.',
    url: 'https://findahelpline.com/',
    icon: <LifeBuoy className="w-8 h-8 text-[#FF1493] group-hover:scale-110 transition-transform" />,
    color: 'bg-[#FF1493]/10 border-[#FF1493]/30'
  },
  {
    id: 'na',
    title: 'Narcotics Anonymous',
    desc: 'International recovery support and local meeting information.',
    url: 'https://na.org/e-lit/na-a-resource-in-your-community/',
    icon: <MessageSquare className="w-8 h-8 text-[#00E5FF] group-hover:scale-110 transition-transform" />,
    color: 'bg-[#00E5FF]/10 border-[#00E5FF]/30'
  }
];

export default function HelpfulLinks() {
  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6">
      
      {/* Medical Disclaimer */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
        <h2 className="text-sm font-black uppercase text-red-500 tracking-widest flex items-center gap-3">
          <AlertOctagon className="w-5 h-5" />
          Medical Disclaimer
        </h2>
        <p className="mt-3 text-white/80 text-xs leading-relaxed font-mono">
          Harm.Less is an educational tool designed for harm reduction and survival purposes only. It is not a replacement for professional medical advice, diagnosis, or treatment. The creators of this application hold no liability for actions taken based on the information provided. In a medical emergency, immediately call the emergency service for the country you are currently in.
        </p>
      </div>

      {/* App Summary */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-black uppercase text-white tracking-widest flex items-center gap-3">
          <Info className="w-6 h-6 text-blue-400" />
          About Harm.Less
        </h2>
        <p className="text-white/80 text-sm leading-relaxed">
          Harm.Less is an no-account harm reduction and survival application designed to prevent fatal overdoses, reduce infection risks, and connect individuals with life-saving resources without judgment.
        </p>
        
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-bold text-blue-400 uppercase tracking-widest text-xs mb-2">Life-Saving Services & Tools</h3>
            <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
              <li>Emergency Dialing Integrations</li>
              <li>Rapid Interaction Checker</li>
              <li>Volumetric Dose Calculator</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-green-400 uppercase tracking-widest text-xs mb-2">Local Geographic Resources</h3>
            <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
              <li>Narcan & Syringe Exchange Locators</li>
              <li>Support Groups, Rehabs & Clinics</li>
              <li>Food Pantries & Shelters</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-purple-400 uppercase tracking-widest text-xs mb-2">Source-Linked Information</h3>
            <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
              <li>Route of Administration (ROA) Protocol</li>
              <li>Overdose Response Guides</li>
              <li>Supply Testing Instructions</li>
            </ul>
          </div>
        </div>
        <p className="text-white/60 text-xs italic mt-4 border-t border-white/10 pt-4">
          Harm.Less operates on the core belief that the safest choice is abstaining, but if one chooses to use, pragmatic knowledge and accessible resources are the greatest defenses against tragedy.
        </p>
      </div>

      <div className="bg-[#FF1493]/10 border border-[#FF1493]/30 rounded-2xl p-6">
        <h2 className="text-xl font-black uppercase text-[#FF69B4] tracking-widest flex items-center gap-3">
          <Globe className="w-8 h-8" />
          Guides & Links
        </h2>
        <p className="mt-3 text-white/80 text-sm leading-relaxed">
          Extended resources, public-health literature, and peer-support communities. External sites have their own content and policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LINKS.map(link => (
          <a 
            key={link.id} 
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-6 rounded-2xl border flex flex-col justify-between text-left gap-6 hover:bg-white/10 transition-all group ${link.color}`}
          >
            <div className="flex justify-between items-start text-white">
              {link.icon}
              <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h4 className="font-black uppercase text-lg tracking-wide text-white">{link.title}</h4>
              <p className="text-sm opacity-80 mt-1 font-medium text-white/80">{link.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
