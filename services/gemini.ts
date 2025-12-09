import { GoogleGenAI } from "@google/genai";

export const generateCompliment = async (name: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not defined in the environment.");
    return "Tu belleza ilumina el mundo más que mil soles.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // We use gemini-2.5-flash for speed and creative text generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a very short, romantic, and poetic compliment in Spanish for a girl named "${name}". 
      It should be about how she is the prettiest girl ("la niña más linda"). 
      Keep it under 30 words. Tone: Sweet, elegant, floral.`,
    });

    return response.text || "Eres la flor más preciosa de este jardín.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tu sonrisa hace que todos los claveles florezcan de alegría.";
  }
};