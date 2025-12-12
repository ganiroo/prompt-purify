import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">PromptPurify</h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">AI Context Optimizer & Cleaner</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           <div className="flex items-center text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            <Terminal className="w-4 h-4 mr-2" />
            <span>Powered by Gemini 2.5-flash </span>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;