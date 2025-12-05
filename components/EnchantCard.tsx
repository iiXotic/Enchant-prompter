import React, { useState } from 'react';
import { EnchantedResult, PromptMode } from '../types';
import { MODE_CONFIG } from '../constants';
import { Copy, Check, Sparkles, RefreshCw, Terminal, Wand2 } from 'lucide-react';
import { Typewriter } from './Typewriter';

interface EnchantCardProps {
  result: EnchantedResult;
  isNew: boolean;
  onReEnchant?: () => void;
}

export const EnchantCard: React.FC<EnchantCardProps> = ({ result, isNew, onReEnchant }) => {
  const [copied, setCopied] = useState(false);
  const config = MODE_CONFIG[result.mode];
  const isCoding = result.mode === PromptMode.CODING;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.enhanced);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full animate-slide-up">
      {/* Decorative Glow */}
      <div className="relative group">
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${config.color.replace('text-', 'from-')} to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000`}></div>
        
        <div className="relative bg-[#0B1120] border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.bgColor} ${config.color} border border-white/5`}>
                <config.icon size={18} />
              </div>
              <div>
                <h3 className="text-slate-100 font-semibold text-base leading-tight">Enchanted Prompt</h3>
                <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`}></span>
                  {config.label} Mode
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono font-medium tracking-tight uppercase">
                {result.original.length} chars <span className="text-slate-600 mx-1">→</span> {result.enhanced.length} chars
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <label className="text-slate-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 select-none">
                {isCoding ? <Terminal size={12} className="text-emerald-500" /> : <Wand2 size={12} className="text-purple-500" />}
                The Result
              </label>
              
              {/* Result Container */}
              <div className={`
                relative w-full rounded-lg border shadow-inner overflow-hidden group/editor
                ${isCoding 
                  ? 'bg-[#0f1117] border-slate-800 font-mono text-sm leading-relaxed text-emerald-100/90' 
                  : 'bg-slate-950/60 border-slate-800/60 text-slate-100 text-lg leading-relaxed font-light'}
              `}>
                {/* Optional Top Bar for Code view */}
                {isCoding && (
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900/50 border-b border-slate-800/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700/50"></div>
                  </div>
                )}
                
                <div className={`${isCoding ? 'p-5' : 'p-6'} min-h-[120px]`}>
                  {isNew ? (
                    // Passing key forces remount if text changes rapidly, preventing garble
                    <Typewriter key={result.enhanced} text={result.enhanced} speed={isCoding ? 2 : 4} className="whitespace-pre-wrap" />
                  ) : (
                    <p className="whitespace-pre-wrap">{result.enhanced}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata Box */}
            <div className="grid md:grid-cols-[1fr_auto] gap-4 pt-2">
               <div className="bg-slate-900/40 rounded-lg p-3.5 border border-slate-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={12} className="text-amber-400" />
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Magic Applied</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{result.explanation}</p>
               </div>
               
               <div className="flex flex-col gap-2 min-w-[140px]">
                 <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider pl-1">Tags</span>
                 <div className="flex flex-wrap gap-2">
                   {result.tags.map(tag => (
                     <span key={tag} className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/80 cursor-default hover:border-slate-600 transition-colors whitespace-nowrap">
                       #{tag}
                     </span>
                   ))}
                 </div>
               </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800/80 flex justify-between items-center">
             <button 
               onClick={onReEnchant}
               className="group flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800/50"
             >
               <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> 
               Try Again
             </button>
             
             <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg ${
                copied 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-900/20' 
                  : 'bg-white text-slate-900 hover:bg-slate-200 shadow-white/5 hover:shadow-white/10'
              }`}
            >
              {copied ? (
                <>
                  <Check size={16} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy Prompt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};