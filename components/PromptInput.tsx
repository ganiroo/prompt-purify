import React from 'react';
import { PromptRequest } from '../types';
import { Eraser, Settings2 } from 'lucide-react';

interface PromptInputProps {
  values: PromptRequest;
  onChange: (field: keyof PromptRequest, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ values, onChange, onSubmit, isLoading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center">
          <Settings2 className="w-5 h-5 mr-2 text-indigo-600" />
          Input Configuration
        </h2>
        <p className="text-sm text-slate-500 mt-1">Provide your rough draft and optimization goals.</p>
      </div>

      <div className="p-6 space-y-6 flex-grow overflow-y-auto">
        <div>
          <label htmlFor="originalPrompt" className="block text-sm font-medium text-slate-700 mb-2">
            Original Prompt
          </label>
          <textarea
            id="originalPrompt"
            value={values.originalPrompt}
            onChange={(e) => onChange('originalPrompt', e.target.value)}
            placeholder="Paste your raw, messy prompt here... e.g., 'I need a blog post about cats but make it funny and also talk about food.'"
            className="w-full h-40 p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none text-slate-800 placeholder:text-slate-400 text-sm leading-relaxed bg-white"
          />
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-slate-700 mb-2">
            User Instructions / Constraints
          </label>
          <textarea
            id="instructions"
            value={values.instructions}
            onChange={(e) => onChange('instructions', e.target.value)}
            placeholder="What should we fix? e.g., 'Remove the humor, focus on nutritional facts, make it professional.'"
            className="w-full h-24 p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none text-slate-800 placeholder:text-slate-400 text-sm leading-relaxed bg-white"
          />
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50">
        <button
          onClick={onSubmit}
          disabled={isLoading || !values.originalPrompt.trim()}
          className={`w-full flex items-center justify-center py-3.5 px-6 rounded-xl text-white font-semibold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0
            ${isLoading || !values.originalPrompt.trim() 
              ? 'bg-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Optimizing...
            </>
          ) : (
            <>
              <Eraser className="w-5 h-5 mr-2" />
              Clean Prompt
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;