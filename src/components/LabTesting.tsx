import React from 'react';
import { Microscope, ExternalLink, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LABS = [
  {
    id: 'drugsdata',
    name: 'DrugsData.org',
    region: 'United States & Global',
    desc: 'Independent anonymous lab testing program run by Erowid. Tests pills, powders, and other substances using GC/MS and LC/MS technology.',
    url: 'https://www.drugsdata.org/send_sample.php',
    color: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
  },
  {
    id: 'ncsda',
    name: 'UNC Street Drug Analysis Lab',
    region: 'United States',
    desc: 'Free, anonymous mail-in drug testing service based at UNC. Provides advanced GC/MS analysis and clear, detailed reports online.',
    url: 'https://streetsafe.supply/',
    color: 'bg-teal-500/10 border-teal-500/30 text-teal-400'
  },
  {
    id: 'getyourdrugstested',
    name: 'Get Your Drugs Tested',
    region: 'Canada',
    desc: 'Free, anonymous mail-in drug testing service based in Vancouver, offering fast FTIR spectrometer analysis for samples mailed from anywhere in Canada.',
    url: 'https://getyourdrugstested.com/mail-in-testing/',
    color: 'bg-red-500/10 border-red-500/30 text-red-400'
  },
  {
    id: 'substance',
    name: 'Substance (UVic)',
    region: 'Canada',
    desc: 'Mail-in drug checking project by the University of Victoria. Provides spectrometer composition analysis.',
    url: 'https://substance.uvic.ca/mail-in',
    color: 'bg-orange-500/10 border-orange-500/30 text-orange-400'
  },
  {
    id: 'energycontrol',
    name: 'Energy Control',
    region: 'International / Europe',
    desc: 'Spanish NGO offering advanced international mail-in substance analysis services to determine exact composition and purity.',
    url: 'https://energycontrol-international.org/drug-testing-service/',
    color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
  },
  {
    id: 'kykeon',
    name: 'Kykeon Analytics',
    region: 'International / Europe',
    desc: 'Provides advanced quantitative NMR analysis for mail-in samples. Ideal for determining precise purity and identifying complex mixtures outside standard libraries.',
    url: 'https://kykeonanalytics.com/',
    color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
  },
  {
    id: 'wedinos',
    name: 'WEDINOS',
    region: 'United Kingdom',
    desc: 'Welsh project providing robust, anonymous substance testing to reduce harm across the UK. Send samples via post to receive a unique reference code.',
    url: 'https://www.wedinos.org/sample_testing.html',
    color: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
  }
];

export default function LabTesting() {
  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6">
      
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
        <h2 className="text-xl font-black uppercase text-purple-400 tracking-widest flex items-center gap-3">
          <Microscope className="w-8 h-8" />
          Mail-In Lab Testing
        </h2>
        <p className="mt-3 text-white/80 text-sm leading-relaxed">
          While at-home reagents and test strips are crucial first steps, advanced laboratory testing (using GC/MS or FTIR spectrometers) is the only way to know the exact chemical composition, cuts, and ratios of your substances. Below are verified, anonymous mail-in testing facilities organized by region.
        </p>
      </div>

      <div className="space-y-4">
        {LABS.map((lab, i) => (
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={lab.id}
            href={lab.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-6 rounded-2xl border transition-all hover:bg-white/5 group ${lab.color}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-black uppercase tracking-wider text-lg text-white group-hover:text-white transition-colors flex items-center gap-2">
                  {lab.name}
                </h3>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80 inline-flex items-center gap-2 mt-1">
                  <Mail className="w-3 h-3" /> {lab.region}
                </span>
              </div>
              <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity mt-1" />
            </div>
            <p className="text-sm opacity-90 mt-4 leading-relaxed text-white/90">
              {lab.desc}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <span>View Mail-In Instructions</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.a>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
        <p className="text-xs text-white/50 leading-relaxed italic text-center">
          Shipping illegal substances through the mail carries inherent legal risks. Always read the specific security, anonymity, and packaging instructions outlined by each facility before sending any sample.
        </p>
      </div>

    </div>
  );
}
