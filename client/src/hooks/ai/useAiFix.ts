import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface UseAiFixProps {
  apiKey?: string;
}

interface UseAiFixReturn {
  isLoading: boolean;
  error: string | null;
  askAI: (question: string) => Promise<string | null>;
  clearError: () => void;
}

const useAiFix = ({ apiKey }: UseAiFixProps): UseAiFixReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskAI = async (question: string , method:string): Promise<string | null> => {
    if (!question.trim()) return null;
    
    if (!apiKey) {
      setError('API key is required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // helo i am Job 
      //AiFix(question)=>{"hello i am Job"}
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: question.trim(),
      });
      
      if (!response.text) {
        throw new Error('Empty response from AI');
      }

      return response.text;
    } catch (error) {
      console.error('Error asking AI:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearError = (): void => {
    setError(null);
  };

  return {
    isLoading,
    error,
    askAI: handleAskAI,
    clearError: handleClearError,
  };
};

export default useAiFix;