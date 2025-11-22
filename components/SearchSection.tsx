
import React, { useState } from 'react';
import { Search, Loader2, Radar, FileCode, Lock, FileSearch, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SearchSectionProps {
  onSearch: (term: string) => void;
  onOpenRadar: () => void;
  isLoading: boolean;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, onOpenRadar, isLoading }) => {
  const [term, setTerm] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term);
    }
  };

  const popularTokens = ['Bitcoin', 'Ethereum', 'Solana', 'Pepe', 'Ethena', 'Sui'];

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-12 text-center px-4 no-print">
      
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/20 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6 animate-fade-in">
         <ShieldCheck className="w-3 h-3" /> {t('search.badge')}
      </div>

      <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-500">
          {t('search.title')}
        </span>
      </h2>
      <h3 className="text-xl md:text-2xl font-light text-slate-300 mb-8 tracking-wide">
        {t('search.subtitle')}
      </h3>
      
      <div className="text-slate-400 mb-10 text-sm md:text-base max-w-3xl mx-auto leading-relaxed space-y-4">
        <p>{t('search.description1')}</p>
        <p className="hidden md:block opacity-80">{t('search.description2')}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group mb-8">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative flex items-center">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full bg-slate-900 border border-slate-800 text-white px-6 py-5 rounded-xl pl-14 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 shadow-2xl transition-all text-lg placeholder-slate-600 font-medium"
            disabled={isLoading}
          />
          <Search className="absolute left-5 text-slate-500 w-6 h-6" />
          <button 
            type="submit"
            disabled={isLoading || !term.trim()}
            className="absolute right-2.5 top-2.5 bottom-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-emerald-900/20"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('search.button')}
          </button>
        </div>
      </form>

      {/* Action Buttons Row */}
      <div className="flex justify-center mb-10">
        <button 
          onClick={onOpenRadar}
          className="group flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl transition-all duration-300 text-slate-300"
        >
          <div className="relative">
             <Radar className="w-5 h-5" />
             <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          </div>
          <span className="font-semibold tracking-wide">{t('search.radar')}</span>
        </button>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
         <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-800 text-slate-400 text-xs md:text-sm">
           <FileCode className="w-4 h-4 text-emerald-400" /> {t('search.tier1')}
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-800 text-slate-400 text-xs md:text-sm">
           <Lock className="w-4 h-4 text-blue-400" /> {t('search.tier2')}
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-800 text-slate-400 text-xs md:text-sm">
           <FileSearch className="w-4 h-4 text-slate-500" /> {t('search.tier3')}
         </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 items-center">
        <span className="text-xs text-slate-600 font-mono uppercase tracking-widest mr-2">{t('search.hot')}</span>
        {popularTokens.map((token) => (
          <button
            key={token}
            onClick={() => {
              setTerm(token);
              onSearch(token);
            }}
            className="text-xs font-mono px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/50 transition-all"
          >
            ${token.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};
