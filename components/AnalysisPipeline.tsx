
import React, { useEffect, useState, useRef } from 'react';
import { 
  Search, Database, BrainCircuit, FileText, CheckCircle2, 
  Loader2, Terminal 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type PipelineStep = 'identity' | 'harvesting' | 'reasoning' | 'generating' | 'complete';

interface AnalysisPipelineProps {
  currentStep: PipelineStep;
}

export const AnalysisPipeline: React.FC<AnalysisPipelineProps> = ({ currentStep }) => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulation of logs based on steps
  useEffect(() => {
    const addLog = (msg: string) => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${msg}`].slice(-20));
    };

    let timeouts: NodeJS.Timeout[] = [];

    if (currentStep === 'identity') {
      setLogs([]); // Clear on start
      addLog(t('log.identity.start'));
      timeouts.push(setTimeout(() => addLog('Scanning Etherscan/Solscan...'), 500));
      timeouts.push(setTimeout(() => addLog('Verifying Token Contract Identity...'), 1200));
      timeouts.push(setTimeout(() => addLog('Triangulating Chain Data...'), 1800));
    } else if (currentStep === 'harvesting') {
      addLog(t('log.harvesting.start'));
      timeouts.push(setTimeout(() => addLog('Executing V14.0 9-Path Discovery...'), 400));
      timeouts.push(setTimeout(() => addLog('Checking DNS TXT & WHOIS Records...'), 800));
      timeouts.push(setTimeout(() => addLog('Fetching Wayback Machine snapshots...'), 1500));
      timeouts.push(setTimeout(() => addLog('Extracting Metadata from Contract Bytecode...'), 2500));
      timeouts.push(setTimeout(() => addLog('Crawling Github & Official Docs...'), 3200));
    } else if (currentStep === 'reasoning') {
      addLog(t('log.reasoning.start'));
      timeouts.push(setTimeout(() => addLog('Running V12.6 Mechanism Deviation Matrix...'), 500));
      timeouts.push(setTimeout(() => addLog('Validating Tokenomics Flow...'), 1200));
      timeouts.push(setTimeout(() => addLog('Applying Counter-Evidence Logic...'), 2000));
      timeouts.push(setTimeout(() => addLog('Analyzing Liquidity Forensics (V12.5)...'), 2800));
    } else if (currentStep === 'generating') {
      addLog(t('log.generating.start'));
      timeouts.push(setTimeout(() => addLog('Formatting 15-Section Report...'), 500));
      timeouts.push(setTimeout(() => addLog('Finalizing Evidence Pack...'), 1000));
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [currentStep, t]);

  // Auto scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const steps = [
    { id: 'identity', icon: Search, label: t('step.identity') },
    { id: 'harvesting', icon: Database, label: t('step.harvesting') },
    { id: 'reasoning', icon: BrainCircuit, label: t('step.reasoning') },
    { id: 'generating', icon: FileText, label: t('step.generating') },
  ];

  const getStepStatus = (id: string) => {
    const stepOrder = ['identity', 'harvesting', 'reasoning', 'generating', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(id);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 animate-fade-in no-print">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8 px-4 relative">
        {/* Connecting Line */}
        <div className="absolute left-4 right-4 top-5 transform -translate-y-1/2 h-0.5 bg-slate-800 -z-10"></div>
        
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className="flex flex-col items-center gap-3 bg-[#0f172a] px-2 z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                status === 'completed' ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500' :
                status === 'active' ? 'bg-indigo-900/20 border-indigo-500 text-indigo-400 animate-pulse shadow-lg shadow-indigo-500/30' :
                'bg-slate-900 border-slate-700 text-slate-600'
              }`}>
                {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                 status === 'active' ? <Loader2 className="w-5 h-5 animate-spin" /> :
                 <step.icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-bold tracking-wider uppercase ${
                status === 'active' ? 'text-indigo-400' : 
                status === 'completed' ? 'text-emerald-500' : 'text-slate-600'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Terminal Log */}
      <div className="bg-[#09090b] border border-slate-800 rounded-xl overflow-hidden font-mono text-xs shadow-2xl">
        <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-3 h-3" />
            <span className="uppercase tracking-wider text-[10px]">Veder X Protocol Terminal</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
          </div>
        </div>
        <div 
          ref={scrollRef}
          className="h-40 overflow-y-auto p-4 space-y-1.5 text-slate-300 scroll-smooth bg-[#050505]"
        >
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 animate-slide-right">
              <span className="text-emerald-500/50 shrink-0">➜</span>
              <span>{log}</span>
            </div>
          ))}
          {currentStep !== 'complete' && (
            <div className="animate-pulse text-emerald-500 pl-5">_</div>
          )}
        </div>
      </div>
    </div>
  );
};
