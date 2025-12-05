import { GoogleGenAI, Type as GeminiType } from "@google/genai";
import { PromptMode, EnchantResponse, ModelProvider, UserSettings, AIModel } from "../types";
import { AI_MODELS } from "../constants";

// --- System Instructions (Shared across all models) ---
const getSystemInstruction = (mode: PromptMode): string => {
  const baseInstruction = `You are a World-Class Prompt Engineer (The Enchanter). Your goal is to take simple, vague, or poorly constructed user inputs and transform them into highly effective, structured, and professional prompts.
  
  IMPORTANT: You must output ONLY valid JSON. No markdown, no thinking process, no conversational text.
  The JSON structure must be:
  {
    "enhancedPrompt": "The full prompt text...",
    "explanation": "One sentence explaining the changes...",
    "suggestedTags": ["tag1", "tag2", "tag3"]
  }`;

  switch (mode) {
    case PromptMode.IMAGE:
      return `${baseInstruction}
      Focus on: Visual details, lighting, art style, composition.
      Target: Midjourney v6, DALL-E 3.`;
    
    case PromptMode.SOCIAL:
      return `${baseInstruction}
      Focus on: Viral hooks, short punchy sentences, formatting.
      Target: LinkedIn, Twitter.`;

    case PromptMode.DESIGN:
      return `${baseInstruction}
      Focus on: UI layouts, color palettes, typography, modern trends.
      Target: Figma, CSS.`;

    case PromptMode.CODING:
      return `${baseInstruction}
      Focus on: Specificity, edge cases, clean code practices.
      Target: Expert Developers.`;

    case PromptMode.WRITING:
      return `${baseInstruction}
      Focus on: Persona, tone, structure.`;

    case PromptMode.GENERAL:
    default:
      return `${baseInstruction}
      Focus on: Clarity, context, role assignment.`;
  }
};

// --- Main Service ---

export const enchantPrompt = async (
  input: string, 
  mode: PromptMode,
  settings: UserSettings
): Promise<EnchantResponse> => {
  
  const selectedModel = AI_MODELS.find(m => m.id === settings.selectedModelId);
  if (!selectedModel) throw new Error("Model not found");

  const provider = selectedModel.provider;
  const apiKey = settings.apiKeys[provider];

  if (!apiKey) {
    throw new Error(`Missing API Key for ${selectedModel.name}. Please add it in Settings.`);
  }

  try {
    switch (provider) {
      case ModelProvider.GOOGLE:
        return await callGemini(input, mode, apiKey, selectedModel.id);
      case ModelProvider.OPENAI:
        return await callOpenAI(input, mode, apiKey, selectedModel.id);
      case ModelProvider.GROQ:
        return await callGroq(input, mode, apiKey, selectedModel.id);
      case ModelProvider.ANTHROPIC:
        return await callAnthropic(input, mode, apiKey, selectedModel.id);
      default:
        throw new Error("Provider not supported yet.");
    }
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw new Error(error.message || "The spell failed. Please check your API key and try again.");
  }
};

// --- Google (Gemini) Implementation ---
async function callGemini(input: string, mode: PromptMode, apiKey: string, modelId: string): Promise<EnchantResponse> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: modelId,
    contents: input,
    config: {
      systemInstruction: getSystemInstruction(mode),
      responseMimeType: "application/json",
      responseSchema: {
        type: GeminiType.OBJECT,
        properties: {
          enhancedPrompt: { type: GeminiType.STRING },
          explanation: { type: GeminiType.STRING },
          suggestedTags: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } }
        },
        required: ["enhancedPrompt", "explanation", "suggestedTags"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from Gemini.");
  return JSON.parse(text) as EnchantResponse;
}

// --- OpenAI Implementation ---
async function callOpenAI(input: string, mode: PromptMode, apiKey: string, modelId: string): Promise<EnchantResponse> {
  // Direct call to OpenAI API with the selected model (e.g., gpt-5)
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: "system", content: getSystemInstruction(mode) },
        { role: "user", content: input }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`OpenAI Error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// --- Groq (Llama 3) Implementation ---
async function callGroq(input: string, mode: PromptMode, apiKey: string, modelId: string): Promise<EnchantResponse> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: "system", content: getSystemInstruction(mode) + " Ensure output is pure JSON." },
        { role: "user", content: input }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Groq Error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// --- Anthropic Implementation ---
async function callAnthropic(input: string, mode: PromptMode, apiKey: string, modelId: string): Promise<EnchantResponse> {
  // Note: Anthropic does not support JSON mode natively like OpenAI/Gemini yet, so we prompt-engineer it harder.
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "dangerously-allow-browser": "true" // Required for client-side usage
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 1024,
      system: getSystemInstruction(mode),
      messages: [
        { role: "user", content: input }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Anthropic Error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const text = data.content[0].text;
  
  // Extract JSON if the model added extra chatter
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return JSON.parse(text);
}
