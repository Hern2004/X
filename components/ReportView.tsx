
import React from 'react';
import { ResearchReport } from '../types';
import { RiskGauge } from './RiskGauge';
import { 
  AlertTriangle, TrendingUp, 
  ShieldAlert, Globe, Users, Microscope,
  CheckCircle2, XCircle, Swords,
  Scale, SearchCheck, Workflow, Fingerprint, GitBranch, ArrowRight, Server, FileSearch, Link2, AlertOctagon, MinusCircle, ShieldCheck, FileText, Newspaper,
  Briefcase, Layers, Code2, LineChart, Coins, Wallet, UserCheck, MessageCircle, Gavel, Flag, ThumbsUp, ThumbsDown, BookOpen,
  Shield, Target, Lock, Unlock, Zap, Box, PieChart as PieChartIcon, Activity, Radar, BrainCircuit, Database
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useLanguage } from '../context/LanguageContext';

interface ReportViewProps {
  data: ResearchReport;
}

// Mapping for English verdict from API to Chinese display if needed
const verdictMap: Record<string, string> = {
  "Strong Buy": "强力买入",
  "Buy": "买入",
  "Hold": "持有",
  "Sell": "卖出",
  "Strong Sell": "强力卖出"
};

const getScoreBg = (score: number) => {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 30) return 'bg-orange-500';
  return 'bg-rose-500';
};

const EvidenceBadge = ({ level }: { level: string }) => {
  const { t } = useLanguage();
  const tierStyles: Record<string, { bg: string, text: string, border: string, icon: React.ReactNode, label: string }> = {
    'Tier 1': { bg: 'bg-emerald-950', text: 'text-emerald-400', border: 'border-emerald-800', icon: <ShieldCheck className="w-3 h-3"/>, label: t('search.tier1') },
    'Tier 2': { bg: 'bg-blue-950', text: 'text-blue-400', border: 'border-blue-800', icon: <FileText className="w-3 h-3"/>, label: t('search.tier2') },
    'Tier 3': { bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700', icon: <Newspaper className="w-3 h-3"/>, label: t('search.tier3') },
  };
  const style = tierStyles[level] || tierStyles['Tier 3'];
  return (
    <span className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase font-bold ${style.bg} ${style.text} ${style.border}`}>
      {style.icon} {style.label}
    </span>
  );
};

// Helper to display multiple websites
const WebsiteList = ({ urls }: { urls: string[] }) => {
  if (!urls || urls.length === 0) return <span className="text-sm text-slate-500">N/A</span>;
  return (
    <div className="flex flex-col gap-1">
      {urls.map((url, idx) => (
        <a key={idx} href={url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline truncate flex items-center gap-1">
          {url} <ExternalIcon />
        </a>
      ))}
    </div>
  );
};

const ExternalIcon = () => <Link2 className="w-3 h-3 inline opacity-50" />;

export const ReportView: React.FC<ReportViewProps> = ({ data }) => {
  const { t, language } = useLanguage();
  const isPositive = data.marketData.change24h.includes('+');
  
  let verdictDisplay: string = data.verdict;
  if (language === 'zh') {
    verdictDisplay = verdictMap[data.verdict] || data.verdict;
  } else {
    verdictDisplay = data.verdict;
  }

  const sections = data.reportSections;

  const chartData = (data.dimensionScores || []).map(d => ({
    ...d,
    displayName: d.name
  }));

  const addressData = (data.deepDive?.addressProfile || []).map(a => ({
    name: a.type,
    value: a.percentage
  }));
  const ADDRESS_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#8b5cf6', '#ec4899', '#94a3b8'];

  const liquidity = sections?.liquidityAnalysis;

  return (
    <div className="print-container w-full max-w-7xl mx-auto bg-[#0b1120] border border-slate-800 shadow-2xl overflow-hidden rounded-none md:rounded-2xl font-sans mb-12 text-slate-200">
      
      {/* --- TOP HEADER --- */}
      <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">{data.tokenName}</h1>
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-sm font-bold tracking-wider rounded">
              {data.tokenSymbol}
            </span>
            {data.engineVersion && (
              <span className="px-2 py-0.5 bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-[10px] font-medium rounded-full flex items-center gap-1">
                <Microscope className="w-3 h-3" /> {data.engineVersion}
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs font-mono">{t('report.generated_at')}: {data.generatedAt}</p>
        </div>
        <div className="flex gap-8 text-right">
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">{t('report.price')}</p>
            <p className="text-3xl font-mono font-medium text-white">{data.marketData.price}</p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">{t('report.change_24h')}</p>
            <p className={`text-3xl font-mono font-medium flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp className="w-6 h-6" /> : <TrendingUp className="w-6 h-6 rotate-180" />}
              {data.marketData.change24h}
            </p>
          </div>
        </div>
      </div>

      {/* --- 1. SCORE DASHBOARD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-800">
        {/* Score */}
        <div className="lg:col-span-3 p-8 border-r border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">{t('report.core_score')}</h3>
          <RiskGauge score={data.totalScore} label={t('report.ai_score')} />
          <div className={`mt-6 px-6 py-2 rounded-full border text-sm font-bold uppercase tracking-widest ${
            data.verdict.includes('Buy') ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400' :
            data.verdict.includes('Sell') ? 'bg-rose-950/30 border-rose-500/50 text-rose-400' :
            'bg-yellow-950/30 border-yellow-500/50 text-yellow-400'
          }`}>
            {verdictDisplay}
          </div>
        </div>
        {/* Dimensions */}
        <div className="lg:col-span-9 p-6 bg-slate-900/10">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Scale className="w-4 h-4" /> {t('report.dim_score')}
           </h3>
           <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                 <XAxis dataKey="displayName" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                 <YAxis hide />
                 <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                 <Bar dataKey="score" barSize={32} radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getScoreBg(entry.score).replace('bg-', 'var(--tw-bg-opacity: 1); fill: ').replace('500', '-500')} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* --- REPORT SECTIONS 1-15 --- */}
      <div className="bg-[#0b1120]">
        
        {/* Section 1: Basic Info */}
        <div className="p-6 border-b border-slate-800">
          <h3 className="section-title"><Briefcase className="w-4 h-4" /> {t('sec.profile')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
             <InfoItem label={t('label.contract')} value={sections?.profile?.contractAddress} isMono />
             <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t('label.website')}</p>
                <WebsiteList urls={sections?.profile?.website} />
             </div>
             <InfoItem label={t('label.sector')} value={sections?.profile?.sector} />
             <InfoItem label={t('label.status')} value={sections?.profile?.status} />
             <InfoItem label={t('label.location')} value={sections?.profile?.teamLocation} />
             <InfoItem label={t('label.whitepaper')} value={sections?.profile?.whitepaper} isLink />
          </div>
        </div>

        {/* Section 2: Overview */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/20">
          <h3 className="section-title"><Layers className="w-4 h-4" /> {t('sec.overview')}</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-400 leading-relaxed">
             <p><strong className="text-slate-300">{t('label.intro')}:</strong> {sections?.overview?.whatIsIt}</p>
             <p><strong className="text-slate-300">{t('label.vision')}:</strong> {sections?.overview?.vision}</p>
             <p><strong className="text-slate-300">{t('label.achievements')}:</strong> {sections?.overview?.achievements}</p>
          </div>
        </div>

        {/* Section 3: Product & Tech + Harvesting Trace (Deep Dive) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-slate-800">
           <div className="lg:col-span-2 p-6 border-r border-slate-800">
              <h3 className="section-title"><Code2 className="w-4 h-4" /> {t('sec.product')}</h3>
              <div className="mt-4 space-y-4 text-sm text-slate-400">
                 <p><strong className="text-slate-300">{t('label.features')}:</strong> {sections?.productTech?.features}</p>
                 <p><strong className="text-slate-300">{t('label.arch')}:</strong> {sections?.productTech?.architecture}</p>
                 <p><strong className="text-slate-300">{t('label.github')}:</strong> {sections?.productTech?.githubActivity}</p>
              </div>
           </div>
           <div className="p-6 bg-slate-900/30 flex flex-col gap-6">
              {/* Code Audit Terminal */}
              <div>
                <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Server className="w-4 h-4" /> {t('term.audit_terminal')}
                </h3>
                <div className="space-y-2 text-xs font-mono">
                   <AuditStatus label="Contract Verified" pass={data.deepDive?.codeAudit?.contractVerified} />
                   <AuditStatus label="Bytecode Match" pass={data.deepDive?.codeAudit?.bytecodeMatch} />
                   <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-500">Owner Status</span>
                      <span className="text-emerald-400">{data.deepDive?.codeAudit?.ownerStatus}</span>
                   </div>
                   <p className="text-[10px] text-slate-500 mt-2">{sections?.productTech?.securitySummary}</p>
                </div>
              </div>

              {/* V14.0 Info Harvesting Trace */}
              {data.deepDive?.harvestingTrace && data.deepDive.harvestingTrace.length > 0 && (
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800/50">
                   <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4" /> {t('term.harvesting_trace')}
                   </h3>
                   <div className="space-y-2">
                      {data.deepDive.harvestingTrace.map((trace, idx) => (
                         <div key={idx} className="text-[10px] flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded gap-3">
                            <div className="flex-1 overflow-hidden">
                               <div className="flex items-center justify-between mb-1">
                                  <span className="text-slate-300 font-bold truncate">{trace.category}</span>
                                  {trace.evidenceTier && (
                                    <span className={`text-[9px] px-1 rounded border ${
                                      trace.evidenceTier === 'L1' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 
                                      trace.evidenceTier === 'L2' ? 'bg-blue-950 text-blue-400 border-blue-800' : 
                                      'bg-slate-800 text-slate-500 border-slate-700'
                                    }`}>
                                      {trace.evidenceTier}
                                    </span>
                                  )}
                               </div>
                               <div className="text-slate-500 truncate font-mono text-[9px] mb-0.5">{trace.discoveryPath}</div>
                               <div className="text-slate-600 truncate italic">{trace.evidenceSnapshot}</div>
                            </div>
                            <div className="shrink-0">
                               <span className={`px-1.5 py-0.5 rounded border uppercase text-[9px] ${
                                  trace.status === 'Confirmed' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-900/50' : 'bg-yellow-900/20 text-yellow-400 border-yellow-900/50'
                               }`}>
                                  {trace.status === 'Confirmed' ? 'OK' : '?'}
                               </span>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Section 4: Market */}
        <div className="p-6 border-b border-slate-800">
           <h3 className="section-title"><LineChart className="w-4 h-4" /> {t('sec.market')}</h3>
           <p className="mt-4 text-sm text-slate-400 leading-relaxed">{sections?.marketAnalysis}</p>
           <div className="mt-4 flex flex-wrap gap-2">
              {(data.competitors || []).map((c, i) => (
                 <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                    Vs {c.name}: {c.comparison}
                 </span>
              ))}
           </div>
        </div>

        {/* Section 5: Tokenomics */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/20">
           <h3 className="section-title"><Coins className="w-4 h-4" /> {t('sec.tokenomics')}</h3>
           
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              
              {/* Left Column: Data & Description */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Base Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{t('label.total_supply')}</div>
                    <div className="text-sm font-mono text-slate-200">{sections?.tokenomics?.baseInfo?.totalSupply || 'N/A'}</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{t('label.circulating')}</div>
                    <div className="text-sm font-mono text-slate-200">{sections?.tokenomics?.baseInfo?.circulatingSupply || 'N/A'}</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{t('label.emission')}</div>
                    <div className="text-sm text-slate-300 leading-snug">{sections?.tokenomics?.baseInfo?.inflationMechanism || 'N/A'}</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{t('label.vesting')}</div>
                    <div className="text-sm text-slate-300 leading-snug">{sections?.tokenomics?.baseInfo?.vestingSchedule || 'N/A'}</div>
                  </div>
                </div>

                {/* Distribution & Utility */}
                <div className="space-y-4">
                  <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800/60">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                      <PieChartIcon className="w-3 h-3" /> {t('label.distribution')}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{sections?.tokenomics?.distribution}</p>
                  </div>
                  <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800/60">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> {t('label.utility')}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{sections?.tokenomics?.utility}</p>
                  </div>
                </div>
              </div>
              
              {/* Right Column: Matrix Terminal (Updated for V15.0) */}
              <div className="lg:col-span-5">
                 <div className="bg-[#0f172a] border border-slate-700 shadow-xl rounded-xl overflow-hidden h-full">
                    <div className="bg-slate-800/80 p-3 border-b border-slate-700 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <BrainCircuit className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">{t('term.matrix_terminal')}</span>
                       </div>
                       <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-rose-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                       </div>
                    </div>
                    <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                       {data.deepDive?.mechanismDeviations && data.deepDive.mechanismDeviations.length > 0 ? (
                          data.deepDive.mechanismDeviations.map((m, i) => (
                             <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs relative group hover:border-slate-600 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                   <div className="font-bold text-slate-300 flex items-center gap-1.5">
                                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                                      {m.signal}
                                   </div>
                                   <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                                      {m.category}
                                   </span>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-2 mb-2">
                                   <div className="pl-2 border-l-2 border-slate-700">
                                      <div className="text-[9px] text-slate-500 uppercase mb-0.5">Whitepaper Justification</div>
                                      <div className="text-slate-400">{m.whitepaperJustification}</div>
                                   </div>
                                   {m.reasoning && (
                                      <div className="pl-2 border-l-2 border-indigo-500/30 mt-2">
                                        <div className="text-[9px] text-indigo-400 uppercase mb-0.5">AI Deep Reasoning</div>
                                        <div className="text-slate-400 italic">{m.reasoning}</div>
                                      </div>
                                   )}
                                   {m.counterEvidence && (
                                      <div className="pl-2 border-l-2 border-emerald-500/30 mt-2">
                                        <div className="text-[9px] text-emerald-400 uppercase mb-0.5">Counter-Evidence (Risk Dismissed)</div>
                                        <div className="text-slate-400 font-medium text-emerald-400/90">{m.counterEvidence}</div>
                                      </div>
                                   )}
                                   {m.tokenFlow && (
                                       <div className="pl-2 border-l-2 border-blue-500/30 mt-2">
                                         <div className="text-[9px] text-blue-400 uppercase mb-0.5">Token Flow</div>
                                         <div className="text-slate-500 font-mono text-[10px]">{m.tokenFlow}</div>
                                       </div>
                                   )}
                                </div>

                                <div className={`mt-2 p-1.5 rounded text-center font-bold border ${
                                   m.assessment.includes('Expected') ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' : 
                                   m.assessment.includes('Watchlist') ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/50' : 
                                   'bg-rose-950/30 text-rose-400 border-rose-900/50'
                                }`}>
                                   {m.assessment}
                                </div>
                             </div>
                          ))
                       ) : (
                          <div className="text-center py-10 text-slate-500">
                             <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-20" />
                             <p className="text-xs">All mechanisms aligned. No deviations found.</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>

           </div>
        </div>

        {/* Section 6: On-Chain */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-slate-800">
           <div className="lg:col-span-2 p-6 border-r border-slate-800">
              <h3 className="section-title"><Wallet className="w-4 h-4" /> {t('sec.onchain')}</h3>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">{sections?.onChainSummary}</p>
              
              {liquidity && (
                <div className="mt-6 bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <SearchCheck className="w-4 h-4" /> {t('term.liquidity_terminal')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-3">
                     <div className="bg-slate-900 p-3 rounded border border-slate-800 text-center">
                        <div className="text-slate-500 mb-1">Contract Holding</div>
                        <div className="text-emerald-400 font-mono font-bold text-lg">{liquidity.holderBreakdown.contracts}%</div>
                     </div>
                     <div className="bg-slate-900 p-3 rounded border border-slate-800 text-center">
                        <div className="text-slate-500 mb-1">Exchange Holding</div>
                        <div className="text-blue-400 font-mono font-bold text-lg">{liquidity.holderBreakdown.exchanges}%</div>
                     </div>
                     <div className="bg-slate-900 p-3 rounded border border-slate-800 text-center">
                        <div className="text-slate-500 mb-1">Whale (EOA)</div>
                        <div className={`font-mono font-bold text-lg ${liquidity.holderBreakdown.whales > 20 ? 'text-rose-400' : 'text-slate-300'}`}>
                           {liquidity.holderBreakdown.whales}%
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded text-xs mb-2">
                     <span className="text-slate-400">LP Status:</span>
                     <span className={liquidity.lpStatus.isLocked ? "text-emerald-400 font-bold" : "text-yellow-500"}>
                        {liquidity.lpStatus.isLocked ? "Locked" : "Unlocked"} ({liquidity.lpStatus.lockDuration})
                     </span>
                  </div>
                  
                  <div className="border-t border-slate-700/50 pt-3 mt-3">
                     <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-300">Forensic Verdict:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                           liquidity.concentrationVerdict.includes('Safe') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 
                           liquidity.concentrationVerdict.includes('Critical') ? 'bg-rose-950 text-rose-400 border border-rose-800' : 
                           'bg-yellow-950 text-yellow-400 border border-yellow-800'
                        }`}>
                           {liquidity.concentrationVerdict}
                        </span>
                     </div>
                     <p className="text-slate-500 italic text-[11px]">{liquidity.explanation}</p>
                  </div>
                </div>
              )}

           </div>
           <div className="p-6">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">{t('term.address_profile')}</h3>
              <div className="h-32 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={addressData} cx="50%" cy="50%" innerRadius={25} outerRadius={50} dataKey="value" stroke="none">
                       {addressData.map((entry, index) => <Cell key={`cell-${index}`} fill={ADDRESS_COLORS[index % ADDRESS_COLORS.length]} />)}
                     </Pie>
                     <Tooltip contentStyle={{ backgroundColor: '#1e293b', fontSize: '12px' }} />
                   </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Section 7 & 8: Team & Social */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-800">
           <div className="p-6 border-r border-slate-800">
              <h3 className="section-title"><UserCheck className="w-4 h-4" /> {t('sec.team')}</h3>
              <div className="mt-4 space-y-2 text-sm text-slate-400">
                 <p><strong className="text-slate-300">{t('label.core_team')}:</strong> {sections?.teamInfo?.coreTeam}</p>
                 <p><strong className="text-slate-300">{t('label.investors')}:</strong> {sections?.teamInfo?.investors}</p>
                 <p><strong className="text-slate-300">{t('label.advisors')}:</strong> {sections?.teamInfo?.advisors}</p>
              </div>
           </div>
           <div className="p-6">
              <h3 className="section-title"><MessageCircle className="w-4 h-4" /> {t('sec.social')}</h3>
              <div className="mt-4 space-y-2 text-sm text-slate-400">
                 <p><strong className="text-slate-300">{t('label.followers')}:</strong> {sections?.socialAnalysis?.twitterFollowers}</p>
                 <p><strong className="text-slate-300">{t('label.activity')}:</strong> {sections?.socialAnalysis?.communityActivity}</p>
                 <p><strong className="text-slate-300">{t('label.sentiment')}:</strong> {sections?.socialAnalysis?.sentiment}</p>
              </div>
           </div>
        </div>

        {/* Section 9: Black Swan (Logic Conflict) */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/20">
           <h3 className="section-title text-rose-400"><AlertOctagon className="w-4 h-4" /> {t('sec.blackswan')}</h3>
           
           {/* Logic Paths Visualization */}
           <div className="mt-6 space-y-4">
             {(data.deepDive?.logicPaths || []).map((path, idx) => (
               <div key={idx} className="flex items-center gap-4 text-xs bg-slate-900 p-3 rounded border border-slate-800">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                  <div className="flex-1">
                     <div className="font-bold text-yellow-500 mb-1">Signal: {path.signal}</div>
                     <div className="flex items-center gap-2 text-slate-500">
                        <span className="bg-emerald-900/30 text-emerald-400 px-2 rounded">T1: {path.tier1Check}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className="bg-blue-900/30 text-blue-400 px-2 rounded">T2: {path.tier2Check}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className="text-slate-200 font-bold">Conclusion: {path.conclusion}</span>
                     </div>
                  </div>
               </div>
             ))}
             {(data.risks || []).map((risk, idx) => (
                <div key={idx} className="bg-rose-950/20 border border-rose-900/40 p-3 rounded flex justify-between items-start">
                   <div>
                      <p className="text-xs font-bold text-rose-300">{risk.title}</p>
                      <p className="text-[11px] text-rose-400/70">{risk.description}</p>
                   </div>
                   <EvidenceBadge level={risk.evidenceLevel} />
                </div>
             ))}
           </div>
        </div>

        {/* Section 10 & 11: Regulation & Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-800">
           <div className="p-6 border-r border-slate-800">
              <h3 className="section-title"><Gavel className="w-4 h-4" /> {t('sec.legal')}</h3>
              <div className="mt-4 space-y-2 text-sm text-slate-400">
                 <p><strong>{t('label.security_risk')}:</strong> {sections?.compliance?.securitiesRisk}</p>
                 <p><strong>{t('label.geo_restriction')}:</strong> {sections?.compliance?.geoRestrictions}</p>
              </div>
           </div>
           <div className="p-6">
              <h3 className="section-title"><Flag className="w-4 h-4" /> {t('sec.roadmap')}</h3>
              <div className="mt-4 space-y-2">
                 {(sections?.roadmap || []).map((r, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-slate-300">
                       <span className="font-mono bg-slate-800 px-2 py-0.5 rounded">{r.period}</span>
                       <span className="flex-1">{r.goal}</span>
                       <span className={`px-2 py-0.5 rounded ${r.status === 'Completed' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{r.status}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Section 12 & 13: Strengths & Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-800">
           <div className="p-6 border-r border-slate-800 bg-emerald-950/5">
              <h3 className="section-title text-emerald-400"><ThumbsUp className="w-4 h-4" /> {t('sec.strengths')}</h3>
              <ul className="mt-4 space-y-2 list-disc list-inside text-sm text-slate-400">
                 {(sections?.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
           </div>
           <div className="p-6 bg-rose-950/5">
              <h3 className="section-title text-rose-400"><ThumbsDown className="w-4 h-4" /> {t('sec.risks')}</h3>
              <ul className="mt-4 space-y-2 list-disc list-inside text-sm text-slate-400">
                 {(sections?.generalRisks || []).map((r, i) => <li key={i}>{r}</li>)}
              </ul>
           </div>
        </div>
        
        {/* Section 15: Appendix (Evidence Pack) */}
        <div className="p-6 bg-[#09090b]">
           <h3 className="section-title"><BookOpen className="w-4 h-4" /> {t('sec.appendix')}</h3>
           <div className="mt-6 grid gap-3">
              {(data.evidencePack || []).map((ev, idx) => (
                 <div key={idx} className="bg-slate-900/50 border border-slate-800 p-3 rounded flex flex-col md:flex-row justify-between gap-2 text-xs">
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-300">{ev.id}</span>
                          <EvidenceBadge level={ev.tier} />
                          <span className="text-slate-500">[{ev.type}]</span>
                       </div>
                       <p className="text-slate-400">{ev.content}</p>
                    </div>
                    {ev.url && (
                       <a href={ev.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 shrink-0">
                          <Link2 className="w-3 h-3" /> Source
                       </a>
                    )}
                 </div>
              ))}
           </div>
        </div>

      </div>

      <div className="px-8 py-4 bg-black/20 border-t border-slate-800 text-[10px] text-slate-600 flex justify-between items-center">
         <p>{t('report.footer')}</p>
      </div>
    </div>
  );
};

// Helper Components with updated RiskGauge reference prop
const InfoItem = ({ label, value, isLink, isMono }: any) => (
  <div>
    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{label}</p>
    {isLink ? (
      <a href={value} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline truncate block">{value || 'N/A'}</a>
    ) : (
      <p className={`text-sm text-slate-300 ${isMono ? 'font-mono' : ''} truncate`}>{value || 'N/A'}</p>
    )}
  </div>
);

const AuditStatus = ({ label, pass }: any) => (
  <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
    <span className="text-slate-500">{label}</span>
    <div className="flex items-center gap-2">
      <span className={pass ? "text-emerald-400" : "text-rose-400"}>{pass ? "PASS" : "FAIL"}</span>
      {pass ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-500" />}
    </div>
  </div>
);
