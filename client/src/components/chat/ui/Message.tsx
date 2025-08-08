import MessageAvatar from './MessageAvatar';
import { MessageBubble, MessageContent } from './MessageBubble';

interface BaseMessageProps {
  text: string;
  sentAt: string;
}

interface AIMessageProps extends BaseMessageProps {
  variant: 'ai';
  useMarkdown?: boolean;
}

interface ChatMessageProps extends BaseMessageProps {
  variant: 'chat';
  isCurrentUser: boolean;
  senderId?: string | number;
  senderName?: string; // added
}

type MessageProps = AIMessageProps | ChatMessageProps;

// Util to format timestamp strictly as HH:MM
const formatTime = (raw: string): string => {
  const date = new Date(raw);
  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  const match = raw.match(/\b(\d{2}:\d{2})/);
  return match ? match[1] : raw;
};

const Message = (props: MessageProps) => {
  const { text, sentAt, variant } = props;
  const displayTime = formatTime(sentAt);

  if (variant === 'ai') {
    const { useMarkdown = true } = props;

    return (
      <div
        className="flex items-start space-x-2 max-w-xs md:max-w-md lg:max-w-lg"
        role="group"
        aria-label="AI message"
      >
        <MessageAvatar variant="ai" />

        <div className="group text-left">
          <MessageBubble variant="ai" timestamp={displayTime}>
            <MessageContent text={text} variant="ai" useMarkdown={useMarkdown} />
          </MessageBubble>
        </div>
      </div>
    );
  }

  const { isCurrentUser, senderId, senderName } = props as ChatMessageProps;
  const avatarVariant = isCurrentUser ? 'user' : 'other';

  return (
    <div
      className={`flex items-start space-x-2 max-w-xs md:max-w-md lg:max-w-lg ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
      role="group"
      aria-label={isCurrentUser ? 'Your message' : 'User message'}
    >
      <MessageAvatar variant={avatarVariant} />

      <div className={`group ${isCurrentUser ? 'text-right' : 'text-left'}`}>
        {!isCurrentUser && (senderName || senderId) && (
          <p className="text-xs text-slate-500 mb-1 px-1" aria-label={`From user ${senderName || senderId}`}>
            {senderName || senderId}
          </p>
        )}

        <MessageBubble variant={avatarVariant} timestamp={displayTime} isCurrentUser={isCurrentUser}>
          <MessageContent text={text} variant={avatarVariant} />
        </MessageBubble>
      </div>
    </div>
  );
};

export default Message;
