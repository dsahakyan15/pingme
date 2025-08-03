import { UserIcon } from '../../widgets/simpleIcons';

interface BaseMessageProps {
  text: string;
  sentAt: string;
}

interface AiMessageProps extends BaseMessageProps {
  variant: 'ai';
}

interface ChatMessageProps extends BaseMessageProps {
  variant: 'chat';
  isCurrentUser: boolean;
  senderId: number;
  isAIChat?: boolean; // новый проп для определения AI чата
}

type MessageProps = AiMessageProps | ChatMessageProps;

const Message = (props: MessageProps) => {
  const { text, sentAt, variant } = props;

  if (variant === 'ai') {
    return (
      <div className="flex items-start space-x-2 max-w-xs md:max-w-md lg:max-w-lg">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-600">
          <UserIcon className="w-5 h-5 text-white" />
        </div>

        <div className="group text-left">
          <div className="relative p-3 pb-6 min-w-[60px] rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 text-slate-800 rounded-bl-md">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
            <span className="absolute bottom-1 right-2 text-xs text-slate-400">{sentAt}</span>
          </div>
        </div>
      </div>
    );
  }

  const { isCurrentUser, senderId, isAIChat } = props;

  return (
    <div
      className={`flex items-start space-x-2 max-w-xs md:max-w-md lg:max-w-lg ${
        isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCurrentUser ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
        }`}
      >
        <UserIcon className="w-5 h-5 text-white" />
      </div>

      <div className={`group ${isCurrentUser ? 'text-right' : 'text-left'}`}>
        {!isCurrentUser && <p className="text-xs text-slate-500 mb-1 px-1">{senderId}</p>}
        <div
          className={`relative p-3  pb-6 ${
            isAIChat ? 'min-w-[80px]' : 'min-w-[60px]'
          } rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
            isCurrentUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'
          }`}
        >
          <p className="text-sm text-left leading-relaxed whitespace-pre-wrap">{text}</p>
          <span
            className={`absolute bottom-1 right-2 text-xs ${
              isCurrentUser ? 'text-blue-200' : 'text-slate-400'
            }`}
          >
            {sentAt}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;
