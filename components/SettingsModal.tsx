import React, { useEffect, useState } from 'react';
import { Settings, X, Key, Check, ExternalLink } from 'lucide-react';
import { AI_MODELS, DEFAULT_SETTINGS } from '../constants';
import { ModelProvider, UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) setLocalSettings(settings);
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleKeyChange = (provider: ModelProvider, value: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [provider]: value,
      },
    }));
  };

  const handleModelSelect = (modelId: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      selectedModelId: modelId,
    }));
  };

  const saveAndClose = () => {
    onSave(localSettings);
    onClose();
  };

  const selectedModel = AI_MODELS.find(m => m.id === localSettings.selectedModelId);
  const currentProvider = selectedModel?.provider;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 text-slate-100">
            <Settings className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold">Model Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Model Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Select AI Model</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    localSettings.selectedModelId === model.id
                      ? 'bg-purple-500/20 border-purple-500/50 text-white'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <span className="font-medium">{model.name}</span>
                  {localSettings.selectedModelId === model.id && (
                    <Check className="w-4 h-4 text-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          {currentProvider && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Key className="w-4 h-4 text-slate-500" />
                  {currentProvider} API Key
                </label>
                <a 
                  href={getProviderUrl(currentProvider)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  Get Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <input
                type="password"
                placeholder={`sk-... (Your ${currentProvider} Key)`}
                value={localSettings.apiKeys[currentProvider] || ''}
                onChange={(e) => handleKeyChange(currentProvider, e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-slate-500">
                Your key is stored locally in your browser. We never see it.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={saveAndClose}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-purple-500/20 active:scale-95"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

const getProviderUrl = (provider: ModelProvider): string => {
  switch (provider) {
    case ModelProvider.GOOGLE: return 'https://aistudio.google.com/app/apikey';
    case ModelProvider.OPENAI: return 'https://platform.openai.com/api-keys';
    case ModelProvider.ANTHROPIC: return 'https://console.anthropic.com/settings/keys';
    case ModelProvider.GROQ: return 'https://console.groq.com/keys';
    default: return '#';
  }
};
