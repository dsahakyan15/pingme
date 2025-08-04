import ReactMarkdown from 'react-markdown';
import type { ReactNode } from 'react';

interface MessageBubbleProps {
  children: ReactNode;
  variant: 'ai' | 'user' | 'other';
  timestamp: string;
  isCurrentUser?: boolean;
  className?: string;
}

const MessageBubble = ({
  children,
  variant,
  timestamp,
  isCurrentUser = false,
  className = '',
}: MessageBubbleProps) => {
  const getBubbleStyles = () => {
    if (variant === 'ai') {
      return 'bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 text-slate-800 rounded-bl-md';
    }

    return isCurrentUser
      ? 'bg-blue-600 text-white rounded-br-md'
      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md';
  };

  const getTimestampStyles = () => {
    if (variant === 'ai') {
      return 'text-slate-400';
    }

    return isCurrentUser ? 'text-blue-200' : 'text-slate-400';
  };

  return (
    <div
      className={`relative p-3 pb-6 min-w-[70px] rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${getBubbleStyles()} ${className}`}
      role="article"
      aria-label="Message content"
    >
      <div className="text-sm leading-relaxed">{children}</div>
      <span
        className={`absolute bottom-1 right-2 text-xs ${getTimestampStyles()}`}
        aria-label={`Sent at ${timestamp}`}
      >
        {timestamp}
      </span>
    </div>
  );
};

interface MessageContentProps {
  text: string;
  variant: 'ai' | 'user' | 'other';
  useMarkdown?: boolean;
}

const MessageContent = ({ text, variant, useMarkdown = false }: MessageContentProps) => {
  if (variant === 'ai' && useMarkdown) {
    return (
      <div className="prose max-w-none">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  }

  return <p className={`whitespace-pre-wrap ${variant !== 'ai' ? 'text-left' : ''}`}>{text}</p>;
};

export { MessageBubble, MessageContent };
