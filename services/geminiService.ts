import { GoogleGenAI } from "@google/genai";
import { PromptRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const cleanPromptWithGemini = async (request: PromptRequest): Promise<string> => {

const systemInstruction = `
You are an expert AI Prompt Engineer and Translator. Your goal is to act as a "Prompt Cleaner" that optimizes raw user inputs into high-quality, effective prompts for Large Language Models (LLMs).

### YOUR GOAL:
Take messy input and split it into three distinct sections so the final LLM knows exactly what is data and what is instruction.

### CRITICAL LOGIC RULES:
1. **Analyze Intent:** Identify the primary EXECUTION COMMAND (Task), the secondary RULES (Constraints), and any REFERENCE MATERIAL (Context).
2. **Filter Noise:** Remove fluff, politeness ("please", "hi"), and metadata (timestamps, authors) unless relevant to the data.
3. **Handling Modifications:** If the user asks to *modify* the context (e.g., "Make this recipe healthy", "Fix the bugs in this code"), treat that as a **TASK** or **CONSTRAINT**. 
   - **DO NOT** rewrite the Context yourself. 
   - The Context must remain the original, raw data (e.g., the unhealthy recipe) so the downstream LLM has the source material to work with.
4. **Formatting:** You must use the exact labels below.

### OUTPUT FORMAT (Strictly Follow This):

TASK:
[The specific command. If vague, default to "Analyze the provided context". Include any instructions to modify the data here.]

CONSTRAINTS:
[The specific rules, tone, style, or format requirements (e.g. "JSON only", "Healthy options", "Professional tone").]

CONTEXT:
[The cleaned source text/data/code. Keep this verbatim but stripped of conversational noise.]
`;

  const prompt = `
    Input Data:
    ---
    Original Prompt:
    ${request.originalPrompt}
    
    User Instructions (Constraints/Focus):
    ${request.instructions || "Optimize for clarity and accuracy."}
    ---
    
    Generate the three labeled sections below based on the input:
    TASK: [Extract the main verb/action command]
    CONSTRAINTS: [Extract rules regarding format, tone, or length]
    CONTEXT: [Extract any necessary reference data or clean text for the LLM to process]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, 
      },
    });

    return response.text || "Unable to generate a cleaned prompt. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process the prompt. Please check your input and try again.");
  }
};