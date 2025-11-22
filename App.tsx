
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchSection } from './components/SearchSection';
import { ReportView } from './components/ReportView';
import { MarketRadar } from './components/MarketRadar';
import { AnalysisPipeline, PipelineStep } from './components/AnalysisPipeline'; // New Import
import { generateCryptoReport } from './services/geminiService';
import { ResearchReport, LoadingState } from './types';
import { Loader2 } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({ status: 'idle' });
  const [reportData, setReportData] = useState<ResearchReport | null>(null);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('identity'); // New State
  const { language } = useLanguage();

  const handleSearch = useCallback(async (term: string) => {
    setLoadingState({ status: 'searching' });
    setReportData(null);
    setPipelineStep('identity');
    
    try {
      // Step 1: Identity Resolution (Simulated Delay)
      await new Promise(r => setTimeout(r, 2000));
      
      // Step 2: Info Harvesting
      setPipelineStep('harvesting');
      await new Promise(r => setTimeout(r, 3500));

      // Step 3: Deep Reasoning
      setPipelineStep('reasoning');
      
      // Trigger API Call (Async)
      const apiPromise = generateCryptoReport(term, language);
      
      // Wait a bit more for reasoning simulation while API fetches
      await new Promise(r => setTimeout(r, 3500));
      
      setPipelineStep('generating');
      const data = await apiPromise;
      
      setReportData(data);
      setPipelineStep('complete');
      setLoadingState({ status: 'complete' });
    } catch (error) {
      setLoadingState({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [language]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 relative overflow-x-hidden">
      {/* Background Effects (Screen Only) */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none no-print"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] pointer-events-none no-print"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none no-print"></div>

      <Header onPrint={handlePrint} showPrintButton={loadingState.status === 'complete' && !!reportData} />

      <main className="flex-grow relative z-10 w-full px-4">
        
        {/* Search Section (Hidden when printing) */}
        <div className={`${reportData || loadingState.status === 'searching' ? 'mt-6' : 'mt-20'} transition-all duration-500 no-print`}>
          <SearchSection 
            onSearch={handleSearch} 
            onOpenRadar={() => setIsRadarOpen(true)}
            isLoading={loadingState.status !== 'idle' && loadingState.status !== 'complete' && loadingState.status !== 'error'} 
          />
        </div>

        {/* Analysis Pipeline Visualization */}
        {loadingState.status === 'searching' && (
          <AnalysisPipeline currentStep={pipelineStep} />
        )}

        {/* Error State */}
        {loadingState.status === 'error' && (
          <div className="max-w-md mx-auto mt-10 p-6 bg-rose-950/30 border border-rose-900/50 rounded-xl text-center no-print animate-fade-in">
            <h3 className="text-lg font-bold text-rose-400 mb-2">{language === 'en' ? 'Analysis Failed' : '分析生成失败'}</h3>
            <p className="text-slate-400 mb-4">{loadingState.message}</p>
            <button 
              onClick={() => setLoadingState({ status: 'idle' })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm transition-colors"
            >
              {language === 'en' ? 'Retry' : '重试'}
            </button>
          </div>
        )}

        {/* Report Display */}
        {loadingState.status === 'complete' && reportData && (
          <div className="animate-slide-up mt-8">
             {/* Mobile hint */}
             <div className="md:hidden text-center mb-4 text-xs text-slate-500 no-print">
               <p>{language === 'en' ? 'Recommended to view on Desktop or Export PDF' : '建议使用桌面端浏览或导出为 PDF'}</p>
             </div>
             <ReportView data={reportData} />
          </div>
        )}

      </main>

      {/* Market Radar Modal */}
      <MarketRadar 
        isOpen={isRadarOpen} 
        onClose={() => setIsRadarOpen(false)} 
        onSelectToken={(term) => handleSearch(term)}
      />

    </div>
  );
};

export default App;
