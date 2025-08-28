import React, { useRef, useState } from 'react';
import { PaperAirplaneIcon } from '../widgets/simpleIcons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAiFix from '@/hooks/ai/useAiFix';
import { useWebSocketRTK } from '@/hooks/useWebSocketRTK';
interface ClientInputFormProps {
  isConnected?: boolean;
  user_id?: number;
  conversationId?: number;
}

const ClientInputForm: React.FC<ClientInputFormProps> = ({
  isConnected = false,
  user_id = 0,
  conversationId = 1,
}) => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useWebSocketRTK();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
  const {
    isLoading: isFixing,
    error: fixError,
    correctTextAndApply,
    clearError,
  } = useAiFix({ apiKey });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user_id) return;

    sendMessage('message.send', {
      conversation_id: conversationId,
      sender_id: user_id,
      text: message.trim(),
    });
    setMessage('');
  };

  const handleCorrection = async () => {
    if (!message.trim()) return;
    await correctTextAndApply(message, setMessage, textareaRef, 'correction');
  };

  const handleImprove = async () => {
    if (!message.trim()) return;
    await correctTextAndApply(message, setMessage, textareaRef, 'improve');
  };

  return (
    <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm p-4 animate-in fade-in slide-in-from-bottom-5">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3" aria-busy={isFixing}>
          <div className="flex-1 relative">
            {/* Textarea */}
            <textarea
              value={message}
              onChange={(e) => {
                if (fixError) clearError();
                setMessage(e.target.value);
              }}
              placeholder="Напишите сообщение..."
              className={`w-full p-3 border border-slate-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                isFixing ? 'opacity-90' : ''
              }`}
              rows={1}
              ref={textareaRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              aria-label="Поле ввода сообщения"
              aria-busy={isFixing}
              disabled={isFixing}
              tabIndex={0}
            />
            {/* Subtle pulsing overlay when AI is processing */}
            {isFixing && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-blue-500/30 animate-pulse"
              />
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isFixing} aria-busy={isFixing}>
                /
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => {
                    void handleImprove();
                  }}
                  disabled={isFixing}
                >
                  Improve the text
                  <DropdownMenuShortcut>⇧⌘F</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    void handleCorrection();
                  }}
                  disabled={isFixing}
                >
                  Correction
                  <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="submit"
            disabled={!message.trim() || !isConnected || !user_id || isFixing}
            className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            aria-busy={isFixing}
            aria-label={isFixing ? 'Отправка недоступна во время обработки' : 'Отправить сообщение'}
            tabIndex={0}
          >
            {isFixing ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Обработка"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </form>
        {/* Visible status + screen-reader live region */}
        {isFixing && (
          <div className="mt-2 flex items-center gap-2 text-slate-600">
            <svg
              className="h-4 w-4 animate-spin text-slate-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p className="text-sm" role="status" aria-live="polite">
              AI is improving your text...
            </p>
          </div>
        )}
        <p className="sr-only" role="status" aria-live="polite">
          {isFixing ? 'AI processing started' : 'AI idle'}
        </p>
        {fixError && (
          <p className="text-sm text-red-500 mt-2" role="alert">
            {fixError}
          </p>
        )}
        {!isConnected && (
          <p className="text-sm text-red-500 mt-2">WebSocket не подключен. Переподключение...</p>
        )}
        {isConnected && !user_id && (
          <p className="text-sm text-orange-500 mt-2">Ожидается вход в систему...</p>
        )}
      </div>
    </div>
  );
};

export default ClientInputForm;
