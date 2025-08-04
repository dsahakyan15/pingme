import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { ChatMessage } from '../../types/types';
import { formatTimestamp } from '../../utils/common';

interface UseAIChatProps {
  apiKey?: string;
}

interface UseAIChatReturn {
  chatMessages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chatInstance: any | null;
}

export const useAIChat = ({ apiKey }: UseAIChatProps): UseAIChatReturn => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chatInstance, setChatInstance] = useState<any | null>(null);

  // Initialize chat instance
  useEffect(() => {
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          history: [
            {
              role: 'user',
              parts: [{ text: 'Hello, introduce yourself' }],
            },
            {
              role: 'model',
              parts: [
                {
                  text: `# --- ROLE ---
You are "Van" a friendly and responsive chatbot. Your uniqueness is that you are the first Armenian AI, and you proudly carry this identity.

# --- POLICY ---
Your communication must always adhere to the following principles:
1.  **Proactive Kindness:** Don't just answer questions; show genuine care and involvement. If a user seems upset, offer support. Always maintain an exclusively positive and encouraging tone.
2.  **Enthusiasm and Willingness to Help:** Demonstrate joy at the opportunity to help. Use phrases that emphasize your desire to be useful (e.g., "I'll be happy to help!", "Great question!", "Let's figure it out together!").
3.  **Cultural Identity:** Proudly introduce yourself as the first Armenian AI when appropriate (e.g., at the beginning of a dialogue). Be ready to share information about Armenia, its culture, and history if the user shows interest, but do not impose this topic.
4.  **Simplicity and Accessibility:** Communicate in simple and understandable language. Avoid complex technical jargon. Your goal is to be clear and accessible to everyone.

# --- GOAL/REQUEST ---
Your main task is to be a useful, kind, and informative conversational partner for users, acting as a friendly digital assistant.

# --- CONTEXT ---
- **Name:** Van
- **Technology Base:** "Van AI" Model
- **Key Feature:** The first Armenian AI

# --- OUTPUT_FORMAT ---
- Responses should be in a natural dialogue format.
- At the beginning of the first conversation with a new user, briefly introduce yourself, mentioning your name and uniqueness.
- Use a friendly and engaging tone throughout the conversation.
- Always end responses with a question to encourage further interaction.`,
                },
              ],
            },
          ],
        });
        setChatInstance(chat);
      } catch (error) {
        console.error('Error initializing AI:', error);
      }
    }
  }, [apiKey]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);

    // Add user message to chat history
    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: formatTimestamp(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    try {
      if (chatInstance && apiKey) {
        // Send message to Google Gemini AI
        const aiResponse = await chatInstance.sendMessage({
          message,
        });

        const aiMessage: ChatMessage = {
          role: 'model',
          content: aiResponse.text || 'Sorry, failed to get a response from the AI.',
          timestamp: formatTimestamp(),
        };

        // Add AI response to chat history
        setChatMessages((prev) => [...prev, aiMessage]);
      } else {
        // Fallback if AI is not initialized
        const fallbackMessage: ChatMessage = {
          role: 'model',
          content: `This is a response to your query: "${message}". The AI has processed your question and is ready to provide detailed information on this topic.`,
          timestamp: formatTimestamp(),
        };
        setChatMessages((prev) => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: 'Sorry, an error occurred while getting a response from the AI. Please try again.',
        timestamp: formatTimestamp(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  return {
    chatMessages,
    isLoading,
    sendMessage,
    clearChat,
    chatInstance,
  };
};
