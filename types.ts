export enum PromptMode {
  GENERAL = 'GENERAL',
  IMAGE = 'IMAGE',
  CODING = 'CODING',
  WRITING = 'WRITING',
  SOCIAL = 'SOCIAL',
  DESIGN = 'DESIGN',
}

export enum ModelProvider {
  GOOGLE = 'GOOGLE',
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  GROQ = 'GROQ', // Good for Llama
}

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
  isFree?: boolean; // To highlight free options
}

export interface UserSettings {
  selectedModelId: string;
  apiKeys: {
    [key in ModelProvider]?: string;
  };
}

export interface EnchantedResult {
  original: string;
  enhanced: string;
  explanation: string;
  tags: string[];
  mode: PromptMode;
  timestamp: number;
  modelUsed: string;
}

export interface EnchantResponse {
  enhancedPrompt: string;
  explanation: string;
  suggestedTags: string[];
}

export interface HistoryItem extends EnchantedResult {
  id: string;
}
