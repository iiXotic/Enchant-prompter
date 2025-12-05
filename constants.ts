import { PromptMode, AIModel, ModelProvider, UserSettings } from './types';
import { Sparkles, Image, Code, PenTool, MessageSquare, Share2, Palette } from 'lucide-react';

export const AI_MODELS: AIModel[] = [
  // Google
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: ModelProvider.GOOGLE, isFree: true },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 (New!)', provider: ModelProvider.GOOGLE },
  
  // OpenAI
  { id: 'gpt-5', name: 'GPT-5', provider: ModelProvider.OPENAI },

  // Free / Open Source
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 (Free via Groq)', provider: ModelProvider.GROQ, isFree: true },
];

export const DEFAULT_SETTINGS: UserSettings = {
  selectedModelId: 'gemini-2.5-flash',
  apiKeys: {},
};

export const MODE_CONFIG = {
  [PromptMode.GENERAL]: {
    label: 'General Assistant',
    icon: MessageSquare,
    description: 'Best for questions, logic, and general tasks.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  [PromptMode.DESIGN]: {
    label: 'UI/UX Design',
    icon: Palette,
    description: 'Web layouts, color palettes, and modern app aesthetics.',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30'
  },
  [PromptMode.SOCIAL]: {
    label: 'Viral Social',
    icon: Share2,
    description: 'Hooks, threads, and posts for LinkedIn/Twitter.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  [PromptMode.IMAGE]: {
    label: 'Image Generation',
    icon: Image,
    description: 'Optimized for Midjourney, DALL-E, or Stable Diffusion.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30'
  },
  [PromptMode.CODING]: {
    label: 'Coding & Tech',
    icon: Code,
    description: 'Precise technical specifications and constraints.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  },
  [PromptMode.WRITING]: {
    label: 'Creative Writing',
    icon: PenTool,
    description: 'Focus on tone, style, narrative, and persona.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30'
  }
};
