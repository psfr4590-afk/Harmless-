import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search as SearchIcon, AlertTriangle } from 'lucide-react';
import { STATE_LAWS, LawDetails, LEGAL_DATA_SOURCE } from '../data/goodSamaritanLaws';

export default function GoodSamaritanLaws() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLaws = STATE_LAWS.filter((law) =>
    law.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6 relative">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-gradient-to-r from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-black uppercase text-blue-400 tracking-widest flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Good Samaritan Laws
          </h2>
          <p className="mt-2 text-sm text-white/80 max-w-2xl">
            State-by-state information regarding Naloxone (Narcan) access and Good Samaritan protections. 
            Legal protections vary by jurisdiction and can contain conditions and exceptions. This screen provides source-linked guidance, not legal advice.
          </p>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex gap-3 text-yellow-200">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-xs font-bold leading-relaxed">
          DISCLAIMER: This is a general summary and does not constitute legal advice. Laws change frequently and specific protections vary widely by state. Always consult official state legislation or a legal professional for exact details.
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 text-sm text-white/70">
        Primary source: <a href={LEGAL_DATA_SOURCE.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">{LEGAL_DATA_SOURCE.name}</a>. Last source review: {LEGAL_DATA_SOURCE.reviewedOn}.
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input 
          type="text" 
          placeholder="Search by state..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-4">
        {filteredLaws.length > 0 ? (
          filteredLaws.map((law: LawDetails) => (
            <motion.div 
              key={law.state}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <h3 className="text-lg font-black text-white mb-4 uppercase tracking-widest">{law.state}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Naloxone Access</h4>
                  <p className="text-sm text-white/80">{law.naloxoneAccess}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider">Good Samaritan Protection</h4>
                  <p className="text-sm text-white/80">{law.goodSamaritanProtection}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50">
                Source: <a href={law.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">{law.sourceName}</a> · Reviewed {law.reviewedOn}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-white/50 font-bold uppercase tracking-widest">
            No states found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}
