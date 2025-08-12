import { useCallback, useState } from 'react';
import { GoogleGenAI } from '@google/genai';

type CorrectionMode = 'correction' | 'improve';

interface UseAiFixProps {
  apiKey?: string;
}

interface UseAiFixReturn {
  isLoading: boolean;
  error: string | null;
  correctText: (text: string, mode?: CorrectionMode) => Promise<string | null>;
  correctTextAndApply: (
    text: string,
    apply: (next: string) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputRef?: React.RefObject<any>,
    mode?: CorrectionMode
  ) => Promise<boolean>;
  clearError: () => void;
}

const SYSTEM_PROMPTS: Record<CorrectionMode, (text: string) => string> = {
  correction: (text: string) =>
    `Goal: Grammar and spelling correction.
Inputs: raw user text only.
Instruction: Fix grammar, spelling, and punctuation. Do not add explanations. Return only the corrected text.
Text: ${text}`,
  improve: (text: string) =>
    `Goal: Improve clarity and style.
Inputs: raw user text only.
Instruction: Keep original meaning. Make it clearer and more concise. Return only the improved text.
Text: ${text}`,
};

const useAiFix = ({ apiKey }: UseAiFixProps): UseAiFixReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const correctText = useCallback(
    async (text: string, mode: CorrectionMode = 'correction'): Promise<string | null> => {
      if (!text || !text.trim()) return null;
      if (!apiKey) {
        setError('API key is required');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Purpose + minimal inputs trace (as required)
        console.debug(
          `AI Call → purpose: ${
            mode === 'correction' ? 'fix grammar' : 'improve style'
          }, inputs: { length: ${text.trim().length} }`
        );

        const ai = new GoogleGenAI({ apiKey });
        const prompt = SYSTEM_PROMPTS[mode](text.trim());

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const result = (response.text || '').trim();
        if (!result) {
          throw new Error('Empty response from AI');
        }

        return result;
      } catch (err) {
        console.error('AI correction error:', err);
        const message = err instanceof Error ? err.message : 'Failed to correct text';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey]
  );

  const correctTextAndApply = useCallback(
    async (
      text: string,
      apply: (next: string) => void,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inputRef?: React.RefObject<any>,
      mode: CorrectionMode = 'correction'
    ): Promise<boolean> => {
      const corrected = await correctText(text, mode);
      if (!corrected) return false;

      apply(corrected);

      // Post-apply validation (short): ensure input value updated
      if (inputRef && inputRef.current) {
        // Defer validation to allow React state to commit
        return await new Promise<boolean>((resolve) => {
          setTimeout(() => {
            const ok = String(inputRef.current?.value ?? '').trim() === corrected.trim();
            if (!ok) {
              setError('Failed to apply corrected text to the input field');
            }
            resolve(ok);
          }, 0);
        });
      }
      return true;
    },
    [correctText]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    isLoading,
    error,
    correctText,
    correctTextAndApply,
    clearError,
  };
};

export default useAiFix;
