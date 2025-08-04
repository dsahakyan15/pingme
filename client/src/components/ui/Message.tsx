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
}

type MessageProps = AIMessageProps | ChatMessageProps;

const Message = (props: MessageProps) => {
  const { text, sentAt, variant } = props;

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
          <MessageBubble variant="ai" timestamp={sentAt}>
            <MessageContent text={text} variant="ai" useMarkdown={useMarkdown} />
          </MessageBubble>
        </div>
      </div>
    );
  }

  const { isCurrentUser, senderId } = props;
  const avatarVariant = isCurrentUser ? 'user' : 'other';

  return (
    <div
      className={`flex items-start space-x-2 max-w-xs md:max-w-md lg:max-w-lg ${
        isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}
      role="group"
      aria-label={isCurrentUser ? 'Your message' : 'User message'}
    >
      <MessageAvatar variant={avatarVariant} />

      <div className={`group ${isCurrentUser ? 'text-right' : 'text-left'}`}>
        {!isCurrentUser && senderId && (
          <p className="text-xs text-slate-500 mb-1 px-1" aria-label={`From user ${senderId}`}>
            {senderId}
          </p>
        )}

        <MessageBubble variant={avatarVariant} timestamp={sentAt} isCurrentUser={isCurrentUser}>
          <MessageContent text={text} variant={avatarVariant} />
        </MessageBubble>
      </div>
    </div>
  );
};

export default Message;
