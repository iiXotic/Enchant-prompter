import React from 'react';
import { HistoryItem, PromptMode } from '../types';
import { MODE_CONFIG } from '../constants';
import { Clock, Trash2, ArrowRight } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="text-slate-500 text-center py-10 text-sm italic">
        No spells cast yet...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Clock size={14} /> Recent Enchantments
        </h3>
        <button 
          onClick={onClear}
          className="text-slate-600 hover:text-red-400 transition-colors text-xs flex items-center gap-1"
        >
          <Trash2 size={12} /> Clear
        </button>
      </div>
      
      <div className="space-y-3">
        {history.map((item) => {
          const ModeIcon = MODE_CONFIG[item.mode].icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg p-3 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`p-1.5 rounded-md ${MODE_CONFIG[item.mode].bgColor} ${MODE_CONFIG[item.mode].color}`}>
                  <ModeIcon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm font-medium truncate mb-1">
                    {item.original}
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <ArrowRight size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
