import React, { useState, useEffect } from 'react';
import { Wand2, Sparkles, ChevronRight, Github, Settings, Coffee, Heart } from 'lucide-react';
import { PromptMode, EnchantedResult, HistoryItem, UserSettings, ModelProvider } from './types';
import { MODE_CONFIG, DEFAULT_SETTINGS, AI_MODELS } from './constants';
import { enchantPrompt } from './services/aiService';
import { EnchantCard } from './components/EnchantCard';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsModal } from './components/SettingsModal';

// Generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function App() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<PromptMode>(PromptMode.GENERAL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnchantedResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('prompt_wizard_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isResultNew, setIsResultNew] = useState(false);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('prompt_enchanter_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('prompt_wizard_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('prompt_enchanter_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  const handleEnchant = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await enchantPrompt(input, mode, userSettings);
      
      const newResult: EnchantedResult = {
        original: input,
        enhanced: response.enhancedPrompt,
        explanation: response.explanation,
        tags: response.suggestedTags,
        mode: mode,
        timestamp: Date.now(),
        modelUsed: AI_MODELS.find(m => m.id === userSettings.selectedModelId)?.name || 'Unknown Model'
      };

      setResult(newResult);
      setIsResultNew(true);
      setHistory(prev => [{ ...newResult, id: generateId() }, ...prev].slice(0, 20));
    } catch (error: any) {
      console.error(error);
      const msg = error.message || 'The spell failed! Please check your connection or API key.';
      
      // If it's an API key error, prompt to open settings
      if (msg.includes('API Key') || msg.includes('401') || msg.includes('403')) {
        if (confirm(`${msg}\n\nWould you like to open Settings to add your key?`)) {
          setIsSettingsOpen(true);
        }
      } else {
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleEnchant();
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setInput(item.original);
    setMode(item.mode);
    setResult(item);
    setIsResultNew(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearHistory = () => {
    if(confirm('Clear all your magical records?')) {
      setHistory([]);
    }
  };

  const selectedConfig = MODE_CONFIG[mode];
  const currentModelName = AI_MODELS.find(m => m.id === userSettings.selectedModelId)?.name;

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617] text-slate-100 selection:bg-purple-500/30 flex flex-col">
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={userSettings}
        onSave={setUserSettings}
      />

      {/*Navbar */}
      <nav className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Wand2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Viral<span className="text-purple-400">Post</span> & Design</span>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSettingsOpen(true)}
               className="flex items-center gap-2 text-xs font-medium bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5 transition-all text-slate-300 hover:text-white"
             >
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               {currentModelName}
               <Settings size={14} className="ml-1" />
             </button>

            <a href="https://github.com/iiXotic" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Main Interface */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 pb-2">
              Turn ideas into <br/>
              <span className="italic font-serif">viral content & designs.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Select a mode, pick your AI model (GPT-5, Gemini, Claude), and let the magic happen.
            </p>
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            
            {/* Mode Selector */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {(Object.values(PromptMode) as PromptMode[]).map((m) => {
                const config = MODE_CONFIG[m];
                const isActive = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`
                      relative p-3 rounded-xl border transition-all duration-200 text-left group
                      ${isActive 
                        ? `bg-slate-900 ${config.borderColor} shadow-lg ring-1 ring-white/10` 
                        : 'bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-800'}
                    `}
                  >
                    <div className={`mb-2 ${isActive ? config.color : 'text-slate-500 group-hover:text-slate-400'}`}>
                      <config.icon size={20} />
                    </div>
                    <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {config.label}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Main Input Box */}
            <div className="relative group">
              <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${selectedConfig.color.replace('text-', 'from-')} to-purple-600 opacity-20 blur group-hover:opacity-40 transition duration-500`}></div>
              <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-4 md:p-6 shadow-2xl">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === PromptMode.SOCIAL ? "e.g., I learned to code in 3 months..." : "e.g., A futuristic city with flying cars..."}
                  className="w-full bg-transparent text-lg text-slate-100 placeholder:text-slate-600 outline-none resize-none h-32 scrollbar-thin scrollbar-thumb-slate-700"
                  spellCheck={false}
                />
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="hidden md:inline">Using {currentModelName}</span>
                  </div>

                  <button
                    onClick={handleEnchant}
                    disabled={loading || !input.trim()}
                    className={`
                      group relative px-6 py-2.5 rounded-lg font-semibold text-white shadow-lg overflow-hidden transition-all
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                      bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                    `}
                  >
                     <span className={`absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer`}></span>
                     <span className="relative flex items-center gap-2">
                       {loading ? (
                         <>
                           <Sparkles size={18} className="animate-spin" /> Generating...
                         </>
                       ) : (
                         <>
                           <Wand2 size={18} /> Generate
                         </>
                       )}
                     </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Result Area */}
          <div>
            {result ? (
              <EnchantCard 
                result={result} 
                isNew={isResultNew} 
                onReEnchant={handleEnchant} 
              />
            ) : (
               !loading && (
                 <div className="py-12 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                      <Sparkles size={24} className="text-slate-700" />
                    </div>
                    <p className="font-medium">Ready to Create</p>
                    <p className="text-sm mt-1">Select a mode and type your idea above.</p>
                 </div>
               )
            )}
            
            {loading && !result && (
              <div className="py-12 flex flex-col items-center justify-center animate-pulse">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-purple-400 animate-spin" />
                </div>
                <p className="text-purple-300 font-medium">Connecting to {currentModelName}...</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           {/* Tips Card */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
             <h3 className="font-bold text-white mb-3 flex items-center gap-2">
               <Sparkles size={16} className="text-amber-400" />
               Pro Tips
             </h3>
             <ul className="space-y-3 text-sm text-slate-400">
               <li className="flex gap-3">
                 <span className="w-5 h-5 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-300">1</span>
                 <span><strong>Viral Posts:</strong> Use the "Social" mode and paste a boring paragraph. It will make it punchy.</span>
               </li>
               <li className="flex gap-3">
                 <span className="w-5 h-5 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-300">2</span>
                 <span><strong>UI Design:</strong> Use "Design" mode and ask for a "Dashboard for a Crypto App".</span>
               </li>
               <li className="flex gap-3">
                 <span className="w-5 h-5 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-300">3</span>
                 <span><strong>Model:</strong> Gemini 2.5 Flash is the fastest. Gemini 3 is the smartest.</span>
               </li>
             </ul>
           </div>

           {/* History */}
           <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5">
             <HistoryPanel 
               history={history} 
               onSelect={loadHistoryItem}
               onClear={clearHistory}
             />
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950/50 py-8 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-400 text-sm flex items-center gap-4">
            <div className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500/20" /> by 
              <a href="https://github.com/iiXotic" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors font-medium">
                iiXotic
              </a>
            </div>
            <img src="https://visitor-badge.laobi.icu/badge?page_id=iiXotic.Enchant-prompter" alt="visitor badge" className="h-5" />
          </div>
          
          <a 
            href="https://buymeacoffee.com/iblockedthem" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#FFDD00] text-slate-900 font-bold rounded-lg hover:bg-[#FFDD00]/90 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20"
          >
            <Coffee className="w-5 h-5" />
            Buy me a coffee
          </a>
        </div>
      </footer>
    </div>
  );
}