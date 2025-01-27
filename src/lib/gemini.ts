import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY! as string;

if (!geminiApiKey) {
  throw new Error('Gemini API key is missing in the environment variables.');
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

const gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default gemini;
