
import React, { useEffect, useState } from 'react';
import { fetchMarketIntelligence } from '../services/geminiService';
import { MarketIntelligence } from '../types';
import { X, Loader2, Rocket, Flame, Calendar, ExternalLink, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MarketRadarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (name: string) => void;
}

export const MarketRadar: React.FC<MarketRadarProps> = ({ isOpen, onClose, onSelectToken }) => {
  const [data, setData] = useState<MarketIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen && !data) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchMarketIntelligence();
      setData(result);
    } catch (e) {
      setError(t('radar.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0f172a] w-full max-w-4xl h-[85vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Rocket className="w-6 h-6 text-indigo-400" />
              {t('radar.title')}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {t('radar.subtitle')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
              <p>{t('radar.loading')}</p>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-rose-400 space-y-4">
              <AlertCircle className="w-10 h-10" />
              <p>{error}</p>
              <button onClick={loadData} className="px-4 py-2 bg-slate-800 rounded text-white text-sm hover:bg-slate-700">{t('radar.retry')}</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Newly Listed */}
              <div className="space-y-4">
                <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4" /> {t('radar.new_listings')}
                </h3>
                {data?.newListings.map((token, idx) => (
                  <div key={idx} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl hover:border-emerald-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-100 text-lg">{token.name} <span className="text-slate-500 text-sm font-normal">({token.symbol})</span></h4>
                        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded mt-1 inline-block">{token.platform}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-emerald-300">{token.price}</div>
                        {token.trend && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${token.trend === 'Up' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                            {token.trend === 'Up' ? 'Trending' : 'New'}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">{token.description}</p>
                    <button 
                      onClick={() => { onClose(); onSelectToken(token.symbol); }}
                      className="w-full py-2 rounded-lg bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-300 text-slate-400 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {t('radar.generate_report')} <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upcoming */}
              <div className="space-y-4">
                <h3 className="text-indigo-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
                   <Calendar className="w-4 h-4" /> {t('radar.upcoming')}
                </h3>
                {data?.upcomingProjects.map((project, idx) => (
                  <div key={idx} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl hover:border-indigo-500/30 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-100 text-lg">{project.name} <span className="text-slate-500 text-sm font-normal">({project.symbol})</span></h4>
                        <span className="text-xs text-indigo-300 bg-indigo-900/20 border border-indigo-500/20 px-2 py-0.5 rounded mt-1 inline-block">
                          {project.platform}
                        </span>
                      </div>
                      <div className="text-right">
                         <span className="text-xs text-slate-400 block">{t('radar.expected_time')}</span>
                         <span className="text-sm font-mono text-slate-200">{project.launchDate}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3">{project.description}</p>
                    <button 
                      onClick={() => { onClose(); onSelectToken(project.name); }}
                      className="w-full py-2 rounded-lg bg-slate-800 hover:bg-indigo-600/20 hover:text-indigo-300 text-slate-400 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {t('radar.pre_research')} <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 text-center text-xs text-slate-500">
           {t('radar.disclaimer')}
        </div>
      </div>
    </div>
  );
};
