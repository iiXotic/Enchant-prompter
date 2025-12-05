import { GoogleGenAI, Type } from "@google/genai";
import { PromptMode, EnchantResponse } from "../types";

const getSystemInstruction = (mode: PromptMode): string => {
  const baseInstruction = `You are a World-Class Prompt Engineer (The Enchanter). Your goal is to take simple, vague, or poorly constructed user inputs and transform them into highly effective, structured, and professional prompts optimized for Large Language Models (LLMs) or Image Generators.
  
  Your output must be JSON matching the schema provided.`;

  switch (mode) {
    case PromptMode.IMAGE:
      return `${baseInstruction}
      Focus on: Visual details, lighting, art style, composition, aspect ratio, camera settings, and resolution (e.g., 8k, cinematic lighting).
      Target: Midjourney v6, DALL-E 3, or Stable Diffusion XL.
      Example: Input "cat in space" -> Output "A hyper-realistic cinematic shot of a fluffly ginger cat floating in zero-gravity inside a futuristic spaceship observatory, nebula clouds visible through the giant glass dome, soft bioluminescent lighting, 8k resolution, Unreal Engine 5 render style."`;
    
    case PromptMode.SOCIAL:
      return `${baseInstruction}
      Focus on: Viral hooks, short punchy sentences, engaging questions, formatting for readability (line breaks), and call-to-actions.
      Target: LinkedIn, Twitter (X), or Instagram Captions.
      Example: Input "I learned to code" -> Output "I wasted 3 years trying to learn to code. \n\nHere is what I did wrong (so you don't have to):\n\n1. Tutorial Hell\n2. Ignoring Documentation\n3. Copying without understanding\n\nStop watching. Start building. \n\n#coding #webdev #learnprogramming"`;

    case PromptMode.DESIGN:
      return `${baseInstruction}
      Focus on: UI layouts, UX patterns, color palettes (hex codes), typography pairings, whitespace, accessibility, and modern trends (e.g., Bento grids, Glassmorphism, Brutalism).
      Target: Frontend generation tools (v0, Lovable), Figma designers, or CSS developers.
      Example: Input "modern weather app" -> Output "A sleek, minimal weather dashboard in Dark Mode. Uses a Bento Grid layout. \n\nPalette:\n- Background: #0f172a (Slate 900)\n- Cards: #1e293b (Slate 800) with 10% transparency and blur (Glassmorphism)\n- Accents: #38bdf8 (Sky 400) for sunny, #94a3b8 for cloudy.\n\nTypography: 'Inter' for UI elements, large thin font for temperature.\nFeatures: Animated SVG weather icons, hourly forecast slider, and a dynamic background gradient."`;

    case PromptMode.CODING:
      return `${baseInstruction}
      Focus on: Specificity, edge cases, tech stack versions, clean code practices, error handling, and performance constraints.
      Target: Gemini 2.5 Flash / Pro, GPT-4, Claude 3.5 Sonnet.
      Example: Input "make a python snake game" -> Output "Write a complete, single-file Python implementation of the classic Snake game using the 'pygame' library. The code should include a game loop, collision detection (walls and self), score tracking, and a restart mechanism. Add comments explaining key logic sections. Ensure type hinting is used."`;

    case PromptMode.WRITING:
      return `${baseInstruction}
      Focus on: Persona, tone of voice, target audience, structural constraints (word count, formatting), and stylistic nuance.
      Example: Input "write an email to my boss about being late" -> Output "Draft a professional yet apologetic email to a supervisor explaining a delay in arrival. The tone should be sincere but concise. Include a brief reason (traffic/transit issue), an estimated arrival time, and reassurance that current tasks will be managed. Keep it under 100 words."`;

    case PromptMode.GENERAL:
    default:
      return `${baseInstruction}
      Focus on: Context setting, role assignment (Persona), task decomposition, chain-of-thought requirements, and output formatting.
      Example: Input "help me plan a diet" -> Output "Act as a professional nutritionist. Create a comprehensive 7-day meal plan for a vegetarian adult looking to maintain weight. Include a grocery list, calorie breakdown per day, and preparation tips. Ensure meals take less than 30 minutes to cook."`;
  }
};

export const enchantPrompt = async (
  input: string, 
  mode: PromptMode
): Promise<EnchantResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-2.5-flash for speed and efficiency
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: input,
      config: {
        systemInstruction: getSystemInstruction(mode),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedPrompt: {
              type: Type.STRING,
              description: "The fully optimized, detailed prompt ready for use.",
            },
            explanation: {
              type: Type.STRING,
              description: "A brief, 1-sentence explanation of what was added (e.g., 'Added stylistic descriptors and lighting parameters').",
            },
            suggestedTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 keywords describing the prompt style or topic.",
            }
          },
          required: ["enhancedPrompt", "explanation", "suggestedTags"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from magical forces.");
    
    return JSON.parse(text) as EnchantResponse;

  } catch (error) {
    console.error("Enchantment failed:", error);
    throw new Error(" The enchantment spell fizzled out. Please try again.");
  }
};
