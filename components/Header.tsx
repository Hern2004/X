import React from 'react';
import { BrainCircuit, Printer, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onPrint: () => void;
  showPrintButton: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onPrint, showPrintButton }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/60 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50 no-print">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg shadow-lg shadow-emerald-900/50">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">
            {t('app.name')}
          </h1>
          <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
            {t('app.slogan')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:border-slate-600 transition-all"
        >
          <Languages className="w-3 h-3" />
          {language === 'zh' ? 'EN' : '中文'}
        </button>

        {showPrintButton && (
          <button 
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-200 border border-slate-700 text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{t('header.print')}</span>
          </button>
        )}
      </div>
    </header>
  );
};
