import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not defined in environment variables');
  throw new Error('GEMINI_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Get the model for music theory analysis
// Try gemini-1.5-pro-latest or gemini-1.5-flash-latest (for newer API keys)
export const musicTheoryModel = genAI.getGenerativeModel({ 
  model: 'gemini-3-flash-preview' 
});

// Helper function to analyze jazz harmony
export async function analyzeJazzHarmony(notes: string[], context: string) {
  const prompt = `
    As a jazz theory expert, analyze these notes briefly and concisely:
    
    Notes: ${notes.join(', ')}
    Context: ${context}
    
    Provide a brief but constructive analysis (2 paragraphs max) covering:
    1. Blue notes identified (if any)
    2. Harmonic quality (major/minor/dominant/etc)
    3. One specific suggestion for improvement
    
    Be encouraging and constructive. Keep it brief - students want quick feedback during practice.
    Use plaintext only, no markdown formatting.

    Be reasonably tough with grading, taking points and accuracy off for small mistakes, even if taking just 5 score points off. Wrong notes should be more inaccurate. But don't be too tough, no need to have less than a 93 if very close.
    Give explicit score / 100 and accuracy / 100. Accuracy should only be taken off for notes and accidentals outside of harmony, moreso for notes.
    Don't state 'analysis' at the top of your response. Your response should just be the response.
  `;

  try {
    const result = await musicTheoryModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error analyzing harmony:', error);
    console.error('Error details:', error.message);
    
    // If it's a model not found error, suggest checking available models
    if (error.message?.includes('not found')) {
      console.error('\nTry one of these model names in lib/gemini.ts:');
      console.error('- gemini-1.5-pro-latest');
      console.error('- gemini-1.5-flash-latest');
      console.error('- gemini-pro (legacy)');
      console.error('\nOr check available models at: https://ai.google.dev/models/gemini');
    }
    
    throw new Error(`Failed to analyze harmony: ${error.message}`);
  }
}

export default genAI;
