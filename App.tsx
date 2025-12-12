import React, { useState } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import PromptOutput from './components/PromptOutput';
import { PromptRequest, LoadingState } from './types';
import { cleanPromptWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [request, setRequest] = useState<PromptRequest>({
    originalPrompt: '',
    instructions: '',
  });

  const [cleanedPrompt, setCleanedPrompt] = useState<string>('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof PromptRequest, value: string) => {
    setRequest((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!request.originalPrompt.trim()) return;

    setLoadingState(LoadingState.LOADING);
    setError(null);
    setCleanedPrompt('');

    // Prevent API calls from hanging indefinitely (15s limit).  
    const TIMEOUT_LIMIT = 15000;

    // Reject the promise if the API takes too long.     
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out (15s). The AI is busy, please try again.')), TIMEOUT_LIMIT)
    );

    try {
      // Race condition: ensure the response is faster than the timeout.
      const result = await Promise.race([
        cleanPromptWithGemini(request),
        timeoutPromise
      ]) as string;

      setCleanedPrompt(result);
      setLoadingState(LoadingState.SUCCESS);

    } catch (err: any) {
      setLoadingState(LoadingState.ERROR);
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Hero Section */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Stop Guessing. <span className="text-indigo-600">Start Prompting.</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Transform messy, ambiguous thoughts into precise, high-performance instructions for any AI model.
          </p>
        </div>

        {/* Main Application Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Input */}
          <div className="h-auto w-full">
            <PromptInput 
              values={request} 
              onChange={handleInputChange} 
              onSubmit={handleSubmit}
              isLoading={loadingState === LoadingState.LOADING}
            />
          </div>

          {/* Right Column: Output */}
          <div className="h-[600px] w-full">
            <PromptOutput 
              cleanedPrompt={cleanedPrompt} 
              originalPrompt={request.originalPrompt}
              loadingState={loadingState} 
              error={error}
            />
          </div>
        </div>

        {/* Features / Benefits Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Reduce Hallucinations</h3>
             <p className="text-slate-600 text-sm">Clear constraints help models stay grounded and factual.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Crystal Clarity</h3>
             <p className="text-slate-600 text-sm">Removes ambiguity so the AI knows exactly what you want.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/>
                </svg>
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Context Retention</h3>
             <p className="text-slate-600 text-sm">Filters noise while keeping the essential mission data intact.</p>
          </div>
        </div>

      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>© {new Date().getFullYear()} PromptPurify. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;