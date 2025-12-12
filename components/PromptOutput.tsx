import React, { useState, useMemo, useEffect } from 'react'; 
import { LoadingState } from '../types';

interface PromptOutputProps {
  cleanedPrompt: string;
  originalPrompt?: string; 
  loadingState: LoadingState;
  error: string | null;
}

// --- 1. Helper Logic to Parse the Output ---
const parseCleanedOutput = (rawOutput: string) => {
    const results = {
        task: '[Task details not extracted by model]',
        constraints: '[Constraints not extracted by model]',
        context: '[Context not extracted by model]',
    };

    const taskMatch = rawOutput.match(/TASK:\s*([\s\S]*?)(?=CONSTRAINTS:|CONTEXT:|$)/i);
    const constraintsMatch = rawOutput.match(/CONSTRAINTS:\s*([\s\S]*?)(?=TASK:|CONTEXT:|$)/i);
    const contextMatch = rawOutput.match(/CONTEXT:\s*([\s\S]*?)(?=TASK:|CONSTRAINTS:|$)/i);
    
    if (taskMatch && taskMatch[1].trim().length > 0) results.task = taskMatch[1].trim();
    if (constraintsMatch && constraintsMatch[1].trim().length > 0) results.constraints = constraintsMatch[1].trim();
    if (contextMatch && contextMatch[1].trim().length > 0) results.context = contextMatch[1].trim();

    return results;
};

// --- 2. Improved Smarter Diff Logic ---
const renderDiffWords = (original: string, clean: string) => {
    if (!original) return null;
    
    const words = original.split(/(\s+)/);
    let cleanTrackerLower = clean.toLowerCase();
    
    return words.map((word, i) => {
        if (word.trim() === "") return <span key={i}>{word}</span>;

        const wordLower = word.toLowerCase();
        // Remove basic punctuation for comparison
        const wordCleaned = wordLower.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
        const indexInClean = cleanTrackerLower.indexOf(wordLower);
        
        // Safety check: only look ahead 50 chars to avoid false positives
        const isFound = indexInClean !== -1 && indexInClean < 50; 

        if (isFound) {
            cleanTrackerLower = cleanTrackerLower.substring(indexInClean + wordLower.length);
            return <span key={i} className="text-slate-700">{word}</span>;
        } else {
            return (
                <span key={i} className="bg-red-100 text-red-600 line-through decoration-red-400/50 mx-0.5 rounded px-1 select-none text-sm">
                    {word}
                </span>
            );
        }
    });
};

// --- PRO TIPS LIST ---
const PRO_TIPS = [
  "Tip: Skip 'please' and 'thank you'. It saves tokens and reduces noise.",
  "Tip: Separating data from instructions (using XML tags) reduces hallucinations.",
  "Did you know? Providing a 'persona' (e.g., 'Act as a Senior Engineer') improves reasoning.",
  "Tip: Being specific about the output format (e.g., 'Return JSON only') prevents fluff.",
  "Optimization: Removing timestamps from transcripts helps the LLM focus on content.",
  "Pro Strategy: providing 1-2 examples of the desired output (Few-Shot Prompting) fixes most format errors.",
  "Did you know? Adding 'Think step-by-step' to the end of a prompt boosts logic and math accuracy.",
  "Clarity: Define your audience (e.g., 'Explain this to a 5-year-old') to control complexity." ,
  "Accuracy: Instruct the model to 'Answer using ONLY the provided text' to strictly prevent hallucinations.",
  "Constraint: Explicitly state what NOT to do (e.g., 'Do not use markdown') to keep the output clean."
];

const PromptOutput: React.FC<PromptOutputProps> = ({ cleanedPrompt, originalPrompt, loadingState, error }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'diff' | 'clean'>('diff');
  
  // State for the rotating tips
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

// Rotate tips RANDOMLY while loading
  useEffect(() => {
    if (loadingState === LoadingState.LOADING) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prevIndex) => {
            // Pick a random index
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * PRO_TIPS.length);
            } while (newIndex === prevIndex && PRO_TIPS.length > 1); // Keep picking until it's different from the last one
            
            return newIndex;
        });
      }, 4000); // Change tip every 4 seconds
      return () => clearInterval(interval);
    }
  }, [loadingState]);

  const parsedContent = useMemo(() => {
    if (cleanedPrompt && loadingState === LoadingState.SUCCESS) {
      return parseCleanedOutput(cleanedPrompt);
    }
    return { task: '[Awaiting LLM response]', constraints: '[]', context: '[]' };
  }, [cleanedPrompt, loadingState]);

  // --- Copy Functionality ---
  const handleCopy = async () => {
    if (!cleanedPrompt) return;
    const structuredPrompt = `
<CLEAN_CONTEXT>
${parsedContent.context}
</CLEAN_CONTEXT>

<USER_TASK>
${parsedContent.task}
</USER_TASK>

<CONSTRAINTS>
${parsedContent.constraints}
</CONSTRAINTS>`.trim(); 

    try {
      await navigator.clipboard.writeText(structuredPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const structuredPromptForDisplay = `
<CLEAN_CONTEXT>
${parsedContent.context}
</CLEAN_CONTEXT>

<USER_TASK>
${parsedContent.task}
</USER_TASK>

<CONSTRAINTS>
${parsedContent.constraints}
</CONSTRAINTS>`;

  // --- LOADING STATES ---
  if (loadingState === LoadingState.IDLE) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-8 h-8 text-indigo-400">
            <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" fillRule="evenodd"/>
           </svg>
        </div> 
        <h3 className="text-lg font-medium text-slate-600">Ready to Optimize</h3>
        <p className="max-w-xs mt-2 text-sm">Enter your prompt on the left and tell us how to improve it.</p>
      </div>
    );
  }

  // --- LOADING STATE WITH TIPS ---
  if (loadingState === LoadingState.LOADING) {
     return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse">
        {/* Loading Skeletons */}
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        
        {/* Animated Tip Section */}
        <div className="mt-8 flex flex-col items-center max-w-sm">
            <p className="text-sm text-indigo-500 font-bold animate-bounce mb-2">
                Consulting the AI oracle...
            </p>
            <div className="bg-indigo-50 text-indigo-700 p-3 rounded-lg text-xs font-medium border border-indigo-100 transition-all duration-500 ease-in-out flex items-center justify-center w-full text-center">
                {PRO_TIPS[currentTipIndex]}
            </div>
        </div>
      </div>
    );
  }

  if (loadingState === LoadingState.ERROR) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-2xl border border-red-200 text-red-600">
        <div className="bg-red-100 p-3 rounded-full mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-8 h-8 text-red-600"
          >
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>        
        </div>
        <h3 className="text-lg font-medium">Optimization Failed</h3>
        <p className="mt-2 text-sm">{error || "Something went wrong. Please try again."}</p>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100 border border-indigo-100 overflow-hidden h-full flex flex-col relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      {/* HEADER WITH TABS */}
      <div className="p-4 border-b border-indigo-50 bg-indigo-50/30 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-indigo-900 flex items-center">
                <i className="fas fa-magic w-5 h-5 mr-2 text-indigo-600"></i>
                Result
            </h2>
            <div className="flex bg-white/50 p-1 rounded-lg border border-indigo-100">
                <button 
                    onClick={() => setViewMode('diff')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'diff' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-100' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                    Diff View
                </button>
                <button 
                    onClick={() => setViewMode('clean')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'clean' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-100' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                    Clean Only
                </button>
            </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors shadow-sm"
        >
          {copied ? (
            <>
              {/* Checkmark Icon (SVG) */}
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-700">Copied!</span>
            </>
          ) : (
            <>
              {/* Copy Clipboard Icon (SVG) */}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="p-0 flex-grow relative overflow-y-auto bg-white">
        
        {viewMode === 'diff' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 h-full divide-y md:divide-y-0 md:divide-x divide-indigo-50">
               {/* Left Column: Polluted (With Red Highlights) */}
               <div className="p-6 bg-slate-50/50 overflow-y-auto h-full">
                  <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2">
                     <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Polluted Input</span>
                     <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Red = Removed</span>
                  </div>
                  <div className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap font-mono text-sm break-words">
                    {originalPrompt ? renderDiffWords(originalPrompt, cleanedPrompt) : <span className="italic text-slate-400">Original text not available for diff.</span>}
                  </div>
               </div>

               {/* Right Column: Clean Result */}
               <div className="p-6 bg-white overflow-y-auto h-full min-w-0">
                  <div className="mb-4 flex items-center justify-between border-b border-indigo-100 pb-2">
                     <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Cleaned Result</span>
                  </div>
                  <div className="prose prose-indigo max-w-none">
                     <pre className="!whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-700 bg-transparent border-none p-0 focus:ring-0 !break-words w-full">
                      {structuredPromptForDisplay}
                    </pre>
                  </div>
               </div>
            </div>
        ) : (
            <div className="p-6 overflow-y-auto h-full min-w-0">
                <div className="prose prose-indigo max-w-none">
                    <pre className="!whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-700 bg-transparent border-none p-0 focus:ring-0 !break-words w-full">
                    {structuredPromptForDisplay}
                    </pre>
                </div>
            </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
        <span className="flex items-center">
           <i className="far fa-comment-dots w-3 h-3 mr-1"></i>
           Ready for ChatGPT, Claude, or Gemini
        </span>
        <span>{cleanedPrompt.length} chars</span>
      </div>
    </div>
  );
};

export default PromptOutput;